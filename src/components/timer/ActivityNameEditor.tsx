
import React, { useState, useEffect } from "react";
import { Check, X, Pencil } from "lucide-react";
import { toast } from "sonner";
import { Input } from "../ui/input";
import { updateActivityName } from "../../utils/timerUtils";
import { trackEvent, ANALYTICS_EVENTS } from "../../utils/analyticsUtils";

interface ActivityNameEditorProps {
  activityId: string;
  activityName: string;
  isEditingName: boolean;
  setIsEditingName: (value: boolean) => void;
  onRecordChange: () => void;
}

const ActivityNameEditor: React.FC<ActivityNameEditorProps> = ({
  activityId,
  activityName,
  isEditingName,
  setIsEditingName,
  onRecordChange
}) => {
  const [newName, setNewName] = useState(activityName);
  
  useEffect(() => {
    setNewName(activityName);
  }, [activityName]);
  
  const handleRenameActivity = () => {
    if (newName.trim() === "") {
      toast.error("El nombre no puede estar vacío");
      return;
    }
    
    if (newName === activityName) {
      setIsEditingName(false);
      return;
    }
    
    updateActivityName(activityId, newName);
    trackEvent(ANALYTICS_EVENTS.RENAME_ACTIVITY, { 
      oldName: activityName,
      newName: newName
    });
    toast.success("Nombre actualizado");
    onRecordChange();
    setIsEditingName(false);
  };
  
  if (isEditingName) {
    return (
      <div className="flex items-center">
        <Input 
          value={newName}
          onChange={(e) => setNewName(e.target.value)}
          autoFocus
          className="h-8"
        />
        <div className="flex ml-2 gap-1">
          <button 
            onClick={() => setIsEditingName(false)}
            className="p-1 rounded-full hover:bg-gray-100 dark:hover:bg-cronoz-black-light transition-colors"
          >
            <X className="h-4 w-4" />
          </button>
          <button 
            onClick={handleRenameActivity}
            className="p-1 rounded-full hover:bg-gray-100 dark:hover:bg-cronoz-black-light transition-colors"
          >
            <Check className="h-4 w-4" />
          </button>
        </div>
      </div>
    );
  }
  
  return (
    <h3 
      className="font-medium cursor-pointer hover:text-cronoz-green"
      onClick={() => setIsEditingName(true)}
    >
      {activityName}
    </h3>
  );
};

export default ActivityNameEditor;
