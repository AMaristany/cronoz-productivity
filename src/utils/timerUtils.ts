
import { Activity, TimeRecord, ActivityWithRecords, DailySummary, WeeklySummary } from "../types";

// Helper to format time as HH:MM:SS
export const formatTime = (seconds: number): string => {
  const hours = Math.floor(seconds / 3600);
  const minutes = Math.floor((seconds % 3600) / 60);
  const remainingSeconds = seconds % 60;

  const pad = (num: number): string => num.toString().padStart(2, "0");
  
  if (hours > 0) {
    return `${pad(hours)}:${pad(minutes)}:${pad(remainingSeconds)}`;
  }
  
  return `${pad(minutes)}:${pad(remainingSeconds)}`;
};

// Helper to format time in a human-readable format with fewer decimals
export const formatTimeLong = (seconds: number): string => {
  const hours = Math.floor(seconds / 3600);
  const minutes = Math.floor((seconds % 3600) / 60);
  
  if (hours > 0 && minutes > 0) {
    return `${hours}h ${minutes}m`;
  } else if (hours > 0) {
    return `${hours}h`;
  } else if (minutes > 0) {
    return `${minutes}m`;
  } else {
    return `${Math.round(seconds)}s`;
  }
};

// Format date as YYYY-MM-DD
export const formatDate = (date: Date): string => {
  return date.toISOString().split("T")[0];
};

// Format date in a more readable format
export const formatDateLong = (dateStr: string): string => {
  const date = new Date(dateStr);
  return date.toLocaleDateString("es-ES", {
    weekday: "long",
    year: "numeric",
    month: "long",
    day: "numeric",
  });
};

// Get the current date as YYYY-MM-DD
export const getCurrentDate = (): string => {
  return formatDate(new Date());
};

// Calculate the duration between two dates in seconds
export const calculateDuration = (startTime: string, endTime: string): number => {
  return (new Date(endTime).getTime() - new Date(startTime).getTime()) / 1000;
};

// Generate a unique ID
export const generateId = (): string => {
  return Date.now().toString(36) + Math.random().toString(36).substring(2);
};

// Save activities to localStorage
export const saveActivities = (activities: Activity[]): void => {
  localStorage.setItem("cronoz-activities", JSON.stringify(activities));
};

// Load activities from localStorage
export const loadActivities = (): Activity[] => {
  const activitiesJson = localStorage.getItem("cronoz-activities");
  return activitiesJson ? JSON.parse(activitiesJson) : [];
};

// Save time records to localStorage
export const saveTimeRecords = (records: TimeRecord[]): void => {
  localStorage.setItem("cronoz-time-records", JSON.stringify(records));
};

// Load time records from localStorage
export const loadTimeRecords = (): TimeRecord[] => {
  const recordsJson = localStorage.getItem("cronoz-time-records");
  return recordsJson ? JSON.parse(recordsJson) : [];
};

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

// Get a summary of today's activities
export const getDailySummary = (date: string = getCurrentDate()): DailySummary => {
  const records = loadTimeRecords();
  const todayRecords = records.filter(record => record.date === date && record.duration);
  
  const activities: {[activityId: string]: number} = {};
  let totalTime = 0;
  
  todayRecords.forEach(record => {
    if (record.duration) {
      if (!activities[record.activityId]) {
        activities[record.activityId] = 0;
      }
      activities[record.activityId] += record.duration;
      totalTime += record.duration;
    }
  });
  
  return {
    date,
    totalTime,
    activities,
  };
};

// Get start and end dates for the current week
export const getCurrentWeekDates = (): { start: string; end: string } => {
  const now = new Date();
  const dayOfWeek = now.getDay(); // 0 is Sunday, 1 is Monday, etc.
  const diff = now.getDate() - dayOfWeek + (dayOfWeek === 0 ? -6 : 1); // Adjust when day is Sunday
  
  const monday = new Date(now.setDate(diff));
  const sunday = new Date(now.setDate(monday.getDate() + 6));
  
  return {
    start: formatDate(monday),
    end: formatDate(sunday),
  };
};

// Get a summary for the current week
export const getWeeklySummary = (): WeeklySummary => {
  const { start, end } = getCurrentWeekDates();
  const records = loadTimeRecords();
  
  // Filter records within the week
  const weekRecords = records.filter(record => {
    const recordDate = record.date;
    return recordDate >= start && recordDate <= end && record.duration;
  });
  
  const activities: {[activityId: string]: number} = {};
  const dailyTotals: {[date: string]: number} = {};
  let totalTime = 0;
  
  weekRecords.forEach(record => {
    if (record.duration) {
      // Add to activity total
      if (!activities[record.activityId]) {
        activities[record.activityId] = 0;
      }
      activities[record.activityId] += record.duration;
      
      // Add to daily total
      if (!dailyTotals[record.date]) {
        dailyTotals[record.date] = 0;
      }
      dailyTotals[record.date] += record.duration;
      
      totalTime += record.duration;
    }
  });
  
  return {
    startDate: start,
    endDate: end,
    totalTime,
    dailyTotals,
    activities,
  };
};

// Start a new time record
export const startTimeRecord = (activityId: string): TimeRecord => {
  const now = new Date();
  const record: TimeRecord = {
    id: generateId(),
    activityId,
    startTime: now.toISOString(),
    endTime: null,
    duration: null,
    date: formatDate(now),
  };
  
  const records = loadTimeRecords();
  saveTimeRecords([...records, record]);
  
  return record;
};

// Stop a time record
export const stopTimeRecord = (recordId: string): TimeRecord | null => {
  const records = loadTimeRecords();
  const recordIndex = records.findIndex(record => record.id === recordId);
  
  if (recordIndex === -1) return null;
  
  const record = records[recordIndex];
  const now = new Date();
  const endTime = now.toISOString();
  
  const updatedRecord: TimeRecord = {
    ...record,
    endTime,
    duration: calculateDuration(record.startTime, endTime),
  };
  
  records[recordIndex] = updatedRecord;
  saveTimeRecords(records);
  
  return updatedRecord;
};

// Find active time records (those without an end time)
export const findActiveTimeRecord = (): TimeRecord | null => {
  const records = loadTimeRecords();
  return records.find(record => record.endTime === null) || null;
};

// Delete a time record
export const deleteTimeRecord = (recordId: string): void => {
  const records = loadTimeRecords();
  const filteredRecords = records.filter(record => record.id !== recordId);
  saveTimeRecords(filteredRecords);
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
