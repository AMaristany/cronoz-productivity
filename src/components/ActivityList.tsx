
import React, { useState, useEffect } from "react";
import { toast } from "sonner";
import { Plus, Clock, X } from "lucide-react";
import { Activity, ActivityWithRecords } from "../types";
import { getActivitiesWithRecords, formatTimeLong } from "../utils/timerUtils";
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
    toast.success(`Actividad "${activity.name}" creada`);
    loadActivities();
  };
  
  const handleRecordChange = () => {
    loadActivities();
  };
  
  return (
    <div className="space-y-4">
      {activities.length === 0 && !showNewForm ? (
        <div className="glass-card p-8 text-center">
          <Clock className="w-12 h-12 mx-auto mb-4 text-cronoz-green" />
          <h3 className="text-xl font-semibold mb-2">No hay actividades</h3>
          <p className="text-muted-foreground mb-6">
            Crea tu primera actividad para comenzar a trackear tiempo
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
              className="button-primary fixed bottom-6 right-6 inline-flex items-center rounded-full h-14 w-14 justify-center shadow-lg"
            >
              <Plus className="w-6 h-6" />
            </button>
          )}
        </>
      )}
      
      {showNewForm && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-end justify-center z-50 animate-fade-in">
          <div className="bg-white dark:bg-cronoz-black w-full max-w-lg rounded-t-3xl p-6 animate-slide-up">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-semibold">Nueva Actividad</h2>
              <button 
                onClick={() => setShowNewForm(false)}
                className="p-2 rounded-full hover:bg-gray-100 dark:hover:bg-cronoz-black-light transition-colors"
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
