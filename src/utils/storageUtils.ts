
// Utilities for local storage operations
import { Activity, TimeRecord } from "../types";

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
