
export interface Activity {
  id: string;
  name: string;
  icon?: string;
  color?: string;
  createdAt: string;
}

export interface TimeRecord {
  id: string;
  activityId: string;
  startTime: string;
  endTime: string | null;
  duration: number | null; // in seconds
  date: string;
  notes?: string;
}

export interface ActivityWithRecords extends Activity {
  records: TimeRecord[];
  totalTime: number; // in seconds
  lastRecord?: TimeRecord;
}

export interface DailySummary {
  date: string;
  totalTime: number; // in seconds
  activities: {
    [activityId: string]: number; // activity id -> time in seconds
  };
}

export interface WeeklySummary {
  startDate: string;
  endDate: string;
  totalTime: number; // in seconds
  dailyTotals: {
    [date: string]: number; // date -> time in seconds
  };
  activities: {
    [activityId: string]: number; // activity id -> time in seconds
  };
}
