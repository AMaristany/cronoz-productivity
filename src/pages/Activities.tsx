import React, { useState, useEffect } from "react";
import { toast } from "sonner";
import { Trash2, AlertCircle, ArrowLeft, Clock } from "lucide-react";
import Layout from "../components/Layout";
import { ActivityWithRecords } from "../types";
import { 
  getActivitiesWithRecords, 
  deleteActivity, 
  deleteTimeRecord, 
  formatTimeLong, 
  formatDateLong, 
  formatTime 
} from "../utils/timerUtils";
import { Icons } from "../utils/iconUtils";

const Activities: React.FC = () => {
  const [activities, setActivities] = useState<ActivityWithRecords[]>([]);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState<string | null>(null);
  const [selectedActivity, setSelectedActivity] = useState<ActivityWithRecords | null>(null);
  
  const loadActivities = () => {
    const activitiesWithRecords = getActivitiesWithRecords();
    setActivities(activitiesWithRecords);
    
    // If we have a selected activity, refresh its data
    if (selectedActivity) {
      const updatedActivity = activitiesWithRecords.find(a => a.id === selectedActivity.id);
      if (updatedActivity) {
        setSelectedActivity(updatedActivity);
      }
    }
  };
  
  useEffect(() => {
    loadActivities();
  }, []);
  
  const handleDeleteActivity = (activityId: string) => {
    deleteActivity(activityId);
    setShowDeleteConfirm(null);
    setSelectedActivity(null);
    toast.success("Actividad eliminada");
    loadActivities();
  };
  
  const handleDeleteRecord = (recordId: string) => {
    deleteTimeRecord(recordId);
    toast.success("Registro eliminado");
    loadActivities();
  };
  
  // Find the correct icon component for each activity
  const getActivityIcon = (activity: ActivityWithRecords) => {
    const IconComponent = activity.icon ? Icons[activity.icon] || Clock : Icons["Tiempo"];
    return <IconComponent className="w-5 h-5" />;
  };
  
  if (selectedActivity) {
    return (
      <Layout title={`Registros - ${selectedActivity.name}`}>
        <button 
          onClick={() => setSelectedActivity(null)}
          className="inline-flex items-center text-sm mb-4 hover:text-cronoz-green"
        >
          <ArrowLeft className="w-4 h-4 mr-1" /> Volver a actividades
        </button>
        
        <div className="glass-card p-4 mb-4 flex items-center">
          <div 
            className="w-12 h-12 rounded-full flex items-center justify-center mr-4"
            style={{ 
              backgroundColor: selectedActivity.color || "#8FD694",
              color: "#fff" 
            }}
          >
            {getActivityIcon(selectedActivity)}
          </div>
          <div>
            <h2 className="text-xl font-bold">{selectedActivity.name}</h2>
            <p className="text-sm text-muted-foreground">
              Tiempo total: {formatTimeLong(selectedActivity.totalTime)}
            </p>
          </div>
        </div>
        
        <div className="glass-card overflow-hidden">
          {selectedActivity.records.length === 0 ? (
            <div className="p-8 text-center">
              <AlertCircle className="w-12 h-12 mx-auto mb-4 text-muted-foreground" />
              <h3 className="text-lg font-medium mb-2">No hay registros</h3>
              <p className="text-muted-foreground">
                Esta actividad no tiene registros de tiempo aún
              </p>
            </div>
          ) : (
            <div className="divide-y divide-border">
              {selectedActivity.records.map((record) => (
                <div key={record.id} className="p-4">
                  <div className="flex justify-between items-start mb-1">
                    <div>
                      <span className="font-medium">
                        {formatDateLong(record.date)}
                      </span>
                      <div className="flex items-center text-sm text-muted-foreground">
                        <span>
                          {new Date(record.startTime).toLocaleTimeString('es-ES', { 
                            hour: '2-digit', 
                            minute: '2-digit' 
                          })}
                          {record.endTime && ` - ${new Date(record.endTime).toLocaleTimeString('es-ES', { 
                            hour: '2-digit', 
                            minute: '2-digit' 
                          })}`}
                        </span>
                      </div>
                    </div>
                    <div className="flex items-center">
                      {record.duration ? (
                        <span className="font-mono font-medium mr-3">
                          {formatTime(record.duration)}
                        </span>
                      ) : (
                        <span className="text-sm text-cronoz-green animate-pulse-light mr-3">
                          En progreso
                        </span>
                      )}
                      {record.endTime && (
                        <button 
                          onClick={() => handleDeleteRecord(record.id)}
                          className="p-2 rounded-full hover:bg-gray-100 dark:hover:bg-cronoz-black-light transition-colors text-muted-foreground"
                          aria-label="Eliminar registro"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      )}
                    </div>
                  </div>
                  {record.notes && (
                    <p className="text-sm mt-1 bg-muted/30 p-2 rounded-md">
                      {record.notes}
                    </p>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>
      </Layout>
    );
  }
  
  return (
    <Layout title="Actividades">
      <div className="space-y-4">
        {activities.length === 0 ? (
          <div className="glass-card p-8 text-center">
            <AlertCircle className="w-12 h-12 mx-auto mb-4 text-muted-foreground" />
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
                  <button 
                    className="flex items-center flex-1"
                    onClick={() => setSelectedActivity(activity)}
                  >
                    <div 
                      className="w-10 h-10 rounded-full flex items-center justify-center mr-3"
                      style={{ 
                        backgroundColor: activity.color || "#8FD694",
                        color: "#fff" 
                      }}
                    >
                      {getActivityIcon(activity)}
                    </div>
                    <div className="text-left">
                      <h3 className="font-medium">{activity.name}</h3>
                      <div className="flex items-center text-sm text-muted-foreground">
                        <span>{activity.records.length} registros</span>
                        <span className="mx-1">•</span>
                        <span>Total: {formatTimeLong(activity.totalTime)}</span>
                      </div>
                    </div>
                  </button>
                  
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
