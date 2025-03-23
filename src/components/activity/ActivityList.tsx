
import React, { useState } from "react";
import { Trash2 } from "lucide-react";
import { ActivityWithRecords } from "../../types";
import { formatTimeLong } from "../../utils/timerUtils";
import { Icons } from "../../utils/iconUtils";

interface ActivityListProps {
  activities: ActivityWithRecords[];
  onSelectActivity: (activity: ActivityWithRecords) => void;
  onDeleteActivity: (activityId: string) => void;
}

const ActivityList: React.FC<ActivityListProps> = ({ 
  activities, 
  onSelectActivity, 
  onDeleteActivity 
}) => {
  const [showDeleteConfirm, setShowDeleteConfirm] = useState<string | null>(null);
  
  // Find the correct icon component for each activity
  const getActivityIcon = (activity: ActivityWithRecords) => {
    const IconComponent = activity.icon ? Icons[activity.icon] || Icons["Tiempo"] : Icons["Tiempo"];
    return <IconComponent className="w-5 h-5" />;
  };
  
  return (
    <div className="glass-card overflow-hidden">
      <div className="divide-y divide-border">
        {activities.map((activity) => (
          <div key={activity.id} className="p-4 flex items-center justify-between">
            <button 
              className="flex items-center flex-1"
              onClick={() => onSelectActivity(activity)}
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
                  onClick={() => onDeleteActivity(activity.id)}
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
  );
};

export default ActivityList;
