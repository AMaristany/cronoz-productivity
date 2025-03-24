
// Utilities for working with activities
import { Activity, ActivityWithRecords } from "../types";
import { loadActivities, saveActivities } from "./storageUtils";
import { loadTimeRecords } from "./storageUtils";
import { generateId } from "./idUtils";

// Update an activity name
export const updateActivityName = (activityId: string, newName: string): Activity | null => {
  const activities = loadActivities();
  const activityIndex = activities.findIndex(activity => activity.id === activityId);
  
  if (activityIndex === -1) return null;
  
  activities[activityIndex].name = newName;
  saveActivities(activities);
  
  return activities[activityIndex];
};

// Get activities with their records
export const getActivitiesWithRecords = (): ActivityWithRecords[] => {
  const activities = loadActivities();
  const records = loadTimeRecords();
  
  return activities.map(activity => {
    const activityRecords = records.filter(record => record.activityId === activity.id);
    const totalTime = activityRecords.reduce((total, record) => {
      if (record.duration) {
        return total + record.duration;
      }
      return total;
    }, 0);
    
    const sortedRecords = [...activityRecords].sort(
      (a, b) => new Date(b.startTime).getTime() - new Date(a.startTime).getTime()
    );
    
    return {
      ...activity,
      records: sortedRecords,
      totalTime,
      lastRecord: sortedRecords[0],
    };
  });
};

// Create a new activity
export const createActivity = (name: string, icon?: string, color?: string): Activity => {
  const activity: Activity = {
    id: generateId(),
    name,
    icon,
    color,
    createdAt: new Date().toISOString(),
  };
  
  const activities = loadActivities();
  saveActivities([...activities, activity]);
  
  return activity;
};

// Delete an activity and all its records
export const deleteActivity = (activityId: string): void => {
  const activities = loadActivities();
  const filteredActivities = activities.filter(activity => activity.id !== activityId);
  saveActivities(filteredActivities);
  
  const records = loadTimeRecords();
  const filteredRecords = records.filter(record => record.activityId !== activityId);
  saveTimeRecords(filteredRecords);
};

// Update an activity
export const updateActivity = (activityId: string, updates: Partial<Activity>): Activity | null => {
  const activities = loadActivities();
  const activityIndex = activities.findIndex(activity => activity.id === activityId);
  
  if (activityIndex === -1) return null;
  
  const updatedActivity = {
    ...activities[activityIndex],
    ...updates,
  };
  
  activities[activityIndex] = updatedActivity;
  saveActivities(activities);
  
  return updatedActivity;
};
