
import React, { useState } from "react";
import { Trash2 } from "lucide-react";
import { ActivityWithRecords } from "../../types";
import { formatTimeLong } from "../../utils/timerUtils";
import { trackEvent, ANALYTICS_EVENTS } from "../../utils/analyticsUtils";
import { Icons } from "../../utils/iconUtils";
import { Button } from "../ui/button";
import ActivityListItem from "./ActivityListItem";
import DeleteConfirmation from "./DeleteConfirmation";

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
  
  const handleSelectActivity = (activity: ActivityWithRecords) => {
    trackEvent(ANALYTICS_EVENTS.VIEW_ACTIVITY_DETAIL, { activityName: activity.name });
    onSelectActivity(activity);
  };
  
  const handleDeleteActivity = (activityId: string) => {
    trackEvent(ANALYTICS_EVENTS.DELETE_ACTIVITY);
    onDeleteActivity(activityId);
    setShowDeleteConfirm(null);
  };

  const handleDeleteClick = (activityId: string) => {
    setShowDeleteConfirm(activityId);
  };
  
  const handleCancelDelete = () => {
    setShowDeleteConfirm(null);
  };
  
  return (
    <div className="glass-card overflow-hidden">
      <div className="divide-y divide-border">
        {activities.map((activity) => (
          <ActivityListItem 
            key={activity.id}
            activity={activity}
            onSelect={() => handleSelectActivity(activity)}
            onDeleteClick={() => handleDeleteClick(activity.id)}
            showDeleteConfirm={showDeleteConfirm === activity.id}
            onConfirmDelete={() => handleDeleteActivity(activity.id)}
            onCancelDelete={handleCancelDelete}
          />
        ))}
      </div>
    </div>
  );
};

export default ActivityList;
