
// Utilities for statistics and summaries
import { DailySummary, WeeklySummary } from "../types";
import { loadTimeRecords } from "./storageUtils";
import { formatDate, getCurrentDate } from "./formatUtils";

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
