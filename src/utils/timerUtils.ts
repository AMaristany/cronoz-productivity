
// Main timer utilities - re-exports from specialized utility files
import { formatTime, formatTimeLong, formatDate, formatDateLong, getCurrentDate, calculateDuration } from './formatUtils';
import { generateId } from './idUtils';
import { saveActivities, loadActivities, saveTimeRecords, loadTimeRecords } from './storageUtils';
import { 
  updateActivityName, 
  getActivitiesWithRecords, 
  createActivity, 
  deleteActivity, 
  updateActivity 
} from './activityUtils';
import { 
  startTimeRecord, 
  stopTimeRecord, 
  findActiveTimeRecord, 
  deleteTimeRecord 
} from './recordUtils';
import { 
  getDailySummary, 
  getWeeklySummary, 
  getCurrentWeekDates 
} from './statsUtils';

// Re-export all utilities to maintain backward compatibility
export {
  // Format utilities
  formatTime,
  formatTimeLong,
  formatDate,
  formatDateLong,
  getCurrentDate,
  calculateDuration,
  
  // ID utilities
  generateId,
  
  // Storage utilities
  saveActivities,
  loadActivities,
  saveTimeRecords,
  loadTimeRecords,
  
  // Activity utilities
  updateActivityName,
  getActivitiesWithRecords,
  createActivity,
  deleteActivity,
  updateActivity,
  
  // Record utilities
  startTimeRecord,
  stopTimeRecord,
  findActiveTimeRecord,
  deleteTimeRecord,
  
  // Stats utilities
  getDailySummary,
  getWeeklySummary,
  getCurrentWeekDates
};
