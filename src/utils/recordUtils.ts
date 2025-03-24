
// Utilities for working with time records
import { TimeRecord } from "../types";
import { loadTimeRecords, saveTimeRecords } from "./storageUtils";
import { generateId } from "./idUtils";
import { formatDate, calculateDuration } from "./formatUtils";

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
