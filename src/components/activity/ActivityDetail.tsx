
import React, { useState } from "react";
import { ArrowLeft, Trash2, Pencil, Check, X } from "lucide-react";
import { ActivityWithRecords } from "../../types";
import { deleteTimeRecord, formatTime, formatDateLong, updateActivityName } from "../../utils/timerUtils";
import { trackEvent, ANALYTICS_EVENTS } from "../../utils/analyticsUtils";
import { Icons } from "../../utils/iconUtils";
import { toast } from "sonner";
import { Button } from "../ui/button";
import { Input } from "../ui/input";

interface ActivityDetailProps {
  activity: ActivityWithRecords;
  onBack: () => void;
  onRecordsChange: () => void;
}

const ActivityDetail: React.FC<ActivityDetailProps> = ({ 
  activity, 
  onBack,
  onRecordsChange
}) => {
  const [isEditingName, setIsEditingName] = useState(false);
  const [newName, setNewName] = useState(activity.name);

  const handleDeleteRecord = (recordId: string) => {
    deleteTimeRecord(recordId);
    toast.success("Registro eliminado");
    onRecordsChange();
  };

  const handleRenameActivity = () => {
    if (newName.trim() === "") {
      toast.error("El nombre no puede estar vacío");
      return;
    }
    
    if (newName === activity.name) {
      setIsEditingName(false);
      return;
    }
    
    updateActivityName(activity.id, newName);
    trackEvent(ANALYTICS_EVENTS.RENAME_ACTIVITY, { 
      oldName: activity.name,
      newName: newName
    });
    toast.success("Nombre actualizado");
    onRecordsChange();
    setIsEditingName(false);
  };

  // Find the correct icon component
  const getActivityIcon = () => {
    const IconComponent = activity.icon ? Icons[activity.icon] || Icons["Tiempo"] : Icons["Tiempo"];
    return <IconComponent className="w-5 h-5" />;
  };

  return (
    <>
      <button 
        onClick={onBack}
        className="inline-flex items-center text-sm mb-4 hover:text-cronoz-green"
      >
        <ArrowLeft className="w-4 h-4 mr-1" /> Volver a actividades
      </button>
      
      <div className="glass-card p-4 mb-4 flex items-center">
        <div 
          className="w-12 h-12 rounded-full flex items-center justify-center mr-4"
          style={{ 
            backgroundColor: activity.color || "#8FD694",
            color: "#fff" 
          }}
        >
          {getActivityIcon()}
        </div>
        <div className="flex-1">
          {isEditingName ? (
            <div className="flex items-center">
              <Input 
                value={newName}
                onChange={(e) => setNewName(e.target.value)}
                autoFocus
                className="h-8"
              />
              <div className="flex ml-2 gap-1">
                <Button 
                  variant="ghost" 
                  size="icon" 
                  onClick={() => setIsEditingName(false)}
                >
                  <X className="h-4 w-4" />
                </Button>
                <Button 
                  variant="ghost" 
                  size="icon" 
                  onClick={handleRenameActivity}
                >
                  <Check className="h-4 w-4" />
                </Button>
              </div>
            </div>
          ) : (
            <div className="flex items-center">
              <h2 className="text-xl font-bold">{activity.name}</h2>
              <Button 
                variant="ghost" 
                size="icon" 
                className="ml-2 h-8 w-8" 
                onClick={() => setIsEditingName(true)}
              >
                <Pencil className="h-4 w-4" />
              </Button>
            </div>
          )}
          <p className="text-sm text-muted-foreground">
            Tiempo total: {activity.totalTime ? formatTime(activity.totalTime) : "0:00"}
          </p>
        </div>
      </div>
      
      {activity.records.length === 0 ? (
        <div className="glass-card p-8 text-center">
          <div className="w-12 h-12 mx-auto mb-4 flex items-center justify-center rounded-full bg-muted">
            <Icons.Tiempo className="w-6 h-6 text-muted-foreground" />
          </div>
          <h3 className="text-lg font-medium mb-2">No hay registros</h3>
          <p className="text-muted-foreground">
            Esta actividad no tiene registros de tiempo aún
          </p>
        </div>
      ) : (
        <div className="glass-card overflow-hidden">
          <div className="divide-y divide-border">
            {activity.records.map((record) => (
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
        </div>
      )}
    </>
  );
};

export default ActivityDetail;
