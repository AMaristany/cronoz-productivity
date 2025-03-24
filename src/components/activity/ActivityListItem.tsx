
import React from "react";
import { Trash2 } from "lucide-react";
import { ActivityWithRecords } from "../../types";
import { formatTimeLong } from "../../utils/timerUtils";
import { Icons } from "../../utils/iconUtils";
import { Button } from "../ui/button";
import DeleteConfirmation from "./DeleteConfirmation";

interface ActivityListItemProps {
  activity: ActivityWithRecords;
  onSelect: () => void;
  onDeleteClick: () => void;
  showDeleteConfirm: boolean;
  onConfirmDelete: () => void;
  onCancelDelete: () => void;
}

const ActivityListItem: React.FC<ActivityListItemProps> = ({ 
  activity,
  onSelect,
  onDeleteClick,
  showDeleteConfirm,
  onConfirmDelete,
  onCancelDelete
}) => {
  // Find the correct icon component for the activity
  const getActivityIcon = () => {
    const IconComponent = activity.icon ? Icons[activity.icon] || Icons["Tiempo"] : Icons["Tiempo"];
    return <IconComponent className="w-5 h-5" />;
  };

  return (
    <div className="p-4 flex items-center justify-between">
      <button 
        className="flex items-center flex-1"
        onClick={onSelect}
      >
        <div 
          className="w-10 h-10 rounded-full flex items-center justify-center mr-3"
          style={{ 
            backgroundColor: activity.color || "#8FD694",
            color: "#fff" 
          }}
        >
          {getActivityIcon()}
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
      
      {showDeleteConfirm ? (
        <DeleteConfirmation 
          onConfirm={onConfirmDelete} 
          onCancel={onCancelDelete} 
        />
      ) : (
        <button 
          onClick={onDeleteClick}
          className="p-2 rounded-full hover:bg-gray-100 dark:hover:bg-cronoz-black-light transition-colors text-muted-foreground"
          aria-label="Eliminar actividad"
        >
          <Trash2 className="w-5 h-5" />
        </button>
      )}
    </div>
  );
};

export default ActivityListItem;
