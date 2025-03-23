
import React, { useState, useEffect } from "react";
import { toast } from "sonner";
import Layout from "../components/Layout";
import { ActivityWithRecords } from "../types";
import { getActivitiesWithRecords, deleteActivity } from "../utils/timerUtils";
import ActivityDetail from "../components/activity/ActivityDetail";
import ActivityList from "../components/activity/ActivityList";
import EmptyActivities from "../components/activity/EmptyActivities";

const Activities: React.FC = () => {
  const [activities, setActivities] = useState<ActivityWithRecords[]>([]);
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
    setSelectedActivity(null);
    toast.success("Actividad eliminada");
    loadActivities();
  };
  
  if (selectedActivity) {
    return (
      <Layout title={`Registros - ${selectedActivity.name}`}>
        <ActivityDetail 
          activity={selectedActivity}
          onBack={() => setSelectedActivity(null)}
          onRecordsChange={loadActivities}
        />
      </Layout>
    );
  }
  
  return (
    <Layout title="Actividades">
      <div className="space-y-4">
        {activities.length === 0 ? (
          <EmptyActivities />
        ) : (
          <ActivityList
            activities={activities}
            onSelectActivity={setSelectedActivity}
            onDeleteActivity={handleDeleteActivity}
          />
        )}
      </div>
    </Layout>
  );
};

export default Activities;
