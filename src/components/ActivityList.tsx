
import React, { useState, useEffect } from "react";
import { toast } from "sonner";
import { Plus, Clock, X, Sparkles } from "lucide-react";
import { Activity, ActivityWithRecords } from "../types";
import { getActivitiesWithRecords, formatTimeLong } from "../utils/timerUtils";
import { trackEvent, ANALYTICS_EVENTS } from "../utils/analyticsUtils";
import Timer from "./Timer";
import NewActivityForm from "./NewActivityForm";

const ActivityList: React.FC = () => {
  const [activities, setActivities] = useState<ActivityWithRecords[]>([]);
  const [showNewForm, setShowNewForm] = useState<boolean>(false);
  
  const loadActivities = () => {
    const activitiesWithRecords = getActivitiesWithRecords();
    setActivities(activitiesWithRecords);
  };
  
  useEffect(() => {
    loadActivities();
  }, []);
  
  const handleAddActivity = (activity: Activity) => {
    setShowNewForm(false);
    toast.success(`Actividad "${activity.name}" creada ¡A por todas! 🚀`, {
      icon: <Sparkles className="w-5 h-5 text-cronoz-green" />
    });
    trackEvent(ANALYTICS_EVENTS.CREATE_ACTIVITY, { activityName: activity.name });
    loadActivities();
  };
  
  const handleRecordChange = () => {
    loadActivities();
  };
  
  return (
    <div className="space-y-4">
      {activities.length === 0 && !showNewForm ? (
        <div className="glass-card p-8 text-center">
          <div className="w-20 h-20 mx-auto mb-4 rounded-full bg-cronoz-green/10 flex items-center justify-center">
            <Clock className="w-10 h-10 text-cronoz-green" />
          </div>
          <h3 className="text-xl font-semibold mb-2">No hay actividades</h3>
          <p className="text-muted-foreground mb-6 max-w-sm mx-auto">
            ¡Crea tu primera actividad para comenzar a trackear tiempo y dominar tu productividad! 💪
          </p>
          <button 
            onClick={() => setShowNewForm(true)}
            className="button-primary inline-flex items-center"
          >
            <Plus className="w-5 h-5 mr-2" />
            Nueva Actividad
          </button>
        </div>
      ) : (
        <>
          {activities.map((activity) => (
            <div key={activity.id} className="animate-slide-in" style={{animationDelay: `${activities.indexOf(activity) * 50}ms`}}>
              <Timer 
                activity={activity} 
                onRecordChange={handleRecordChange}
              />
            </div>
          ))}
          
          {!showNewForm && (
            <button 
              onClick={() => setShowNewForm(true)}
              className="button-primary fixed bottom-6 right-6 inline-flex items-center justify-center rounded-full h-16 w-16 shadow-lg"
              aria-label="Nueva Actividad"
            >
              <Plus className="w-8 h-8" />
            </button>
          )}
        </>
      )}
      
      {showNewForm && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-end justify-center z-50 animate-fade-in">
          <div className="bg-white dark:bg-cronoz-black w-full max-w-lg rounded-t-3xl p-6 animate-slide-up">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-bold bg-gradient-to-r from-cronoz-green to-cronoz-green-dark bg-clip-text text-transparent">
                Nueva Actividad ✨
              </h2>
              <button 
                onClick={() => setShowNewForm(false)}
                className="p-2 rounded-full hover:bg-gray-100 dark:hover:bg-cronoz-black-light transition-colors"
                aria-label="Cerrar"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
            
            <NewActivityForm 
              onSubmit={handleAddActivity}
              onCancel={() => setShowNewForm(false)}
            />
          </div>
        </div>
      )}
    </div>
  );
};

export default ActivityList;
