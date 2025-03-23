
import React, { useState, useEffect } from "react";
import { toast } from "sonner";
import { Trash2, Edit, Clock, AlertCircle } from "lucide-react";
import Layout from "../components/Layout";
import { ActivityWithRecords } from "../types";
import { getActivitiesWithRecords, deleteActivity, formatTimeLong } from "../utils/timerUtils";
import NewActivityForm from "../components/NewActivityForm";

const Activities: React.FC = () => {
  const [activities, setActivities] = useState<ActivityWithRecords[]>([]);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState<string | null>(null);
  
  const loadActivities = () => {
    const activitiesWithRecords = getActivitiesWithRecords();
    setActivities(activitiesWithRecords);
  };
  
  useEffect(() => {
    loadActivities();
  }, []);
  
  const handleDeleteActivity = (activityId: string) => {
    deleteActivity(activityId);
    setShowDeleteConfirm(null);
    toast.success("Actividad eliminada");
    loadActivities();
  };
  
  return (
    <Layout title="Actividades">
      <div className="space-y-4">
        {activities.length === 0 ? (
          <div className="glass-card p-8 text-center">
            <Clock className="w-12 h-12 mx-auto mb-4 text-cronoz-green" />
            <h3 className="text-xl font-semibold mb-2">No hay actividades</h3>
            <p className="text-muted-foreground">
              Regresa al cronómetro para crear tu primera actividad
            </p>
          </div>
        ) : (
          <div className="glass-card overflow-hidden">
            <div className="divide-y divide-border">
              {activities.map((activity) => (
                <div key={activity.id} className="p-4 flex items-center justify-between">
                  <div className="flex items-center">
                    <div 
                      className="w-10 h-10 rounded-full flex items-center justify-center mr-3"
                      style={{ 
                        backgroundColor: activity.color || "#8FD694",
                        color: "#fff" 
                      }}
                    >
                      {activity.icon ? (
                        <span>{activity.icon}</span>
                      ) : (
                        <Clock className="w-5 h-5" />
                      )}
                    </div>
                    <div>
                      <h3 className="font-medium">{activity.name}</h3>
                      <span className="text-sm text-muted-foreground">
                        Tiempo total: {formatTimeLong(activity.totalTime)}
                      </span>
                    </div>
                  </div>
                  
                  {showDeleteConfirm === activity.id ? (
                    <div className="flex items-center gap-2">
                      <span className="text-sm text-destructive mr-2">¿Confirmar?</span>
                      <button 
                        onClick={() => setShowDeleteConfirm(null)}
                        className="p-2 rounded-full hover:bg-gray-100 dark:hover:bg-cronoz-black-light transition-colors text-muted-foreground"
                      >
                        Cancelar
                      </button>
                      <button 
                        onClick={() => handleDeleteActivity(activity.id)}
                        className="p-2 rounded-full bg-destructive text-white"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  ) : (
                    <button 
                      onClick={() => setShowDeleteConfirm(activity.id)}
                      className="p-2 rounded-full hover:bg-gray-100 dark:hover:bg-cronoz-black-light transition-colors text-muted-foreground"
                    >
                      <Trash2 className="w-5 h-5" />
                    </button>
                  )}
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </Layout>
  );
};

export default Activities;
