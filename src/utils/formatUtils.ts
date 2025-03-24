
// Formatting utilities for time and dates

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

// Helper to format time in a human-readable format with max 1 decimal place
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
    // Limit to 1 decimal place for seconds
    return `${Math.floor(seconds * 10) / 10}s`;
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
