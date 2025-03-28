import React, { useState, useEffect, useRef } from "react";
import { ActivityWithRecords } from "../types";
import { formatTime, startTimeRecord, stopTimeRecord, findActiveTimeRecord } from "../utils/timerUtils";
import { trackEvent, ANALYTICS_EVENTS } from "../utils/analyticsUtils";

// Import our new components
import ActivityIcon from "./timer/ActivityIcon";
import TimerControls from "./timer/TimerControls";
import TimerDisplay from "./timer/TimerDisplay";
import ActivityNameEditor from "./timer/ActivityNameEditor";
import ActivityOptions from "./timer/ActivityOptions";
import StatusIndicator from "./timer/StatusIndicator";

interface TimerProps {
  activity: ActivityWithRecords;
  onRecordChange: () => void;
}

const Timer: React.FC<TimerProps> = ({ activity, onRecordChange }) => {
  const [isRunning, setIsRunning] = useState(false);
  const [activeRecordId, setActiveRecordId] = useState<string | null>(null);
  const [elapsedTime, setElapsedTime] = useState(0);
  const [isEditingName, setIsEditingName] = useState(false);
  const timerRef = useRef<NodeJS.Timeout | null>(null);
  const startTimeRef = useRef<number>(0);
  
  // Check if this activity has an active record
  useEffect(() => {
    const activeRecord = findActiveTimeRecord();
    if (activeRecord && activeRecord.activityId === activity.id) {
      setIsRunning(true);
      setActiveRecordId(activeRecord.id);
      
      // Calculate elapsed time
      const startTime = new Date(activeRecord.startTime).getTime();
      const now = Date.now();
      const elapsed = Math.floor((now - startTime) / 1000);
      setElapsedTime(elapsed);
      startTimeRef.current = startTime;
      
      // Start timer
      startTimer();
    } else {
      setIsRunning(false);
      setActiveRecordId(null);
      setElapsedTime(0);
      stopTimer();
    }
  }, [activity.id]);
  
  // Handle visibility change to keep timer accurate when tab becomes active again
  useEffect(() => {
    const handleVisibilityChange = () => {
      if (document.visibilityState === 'visible' && isRunning && startTimeRef.current > 0) {
        // Recalculate elapsed time when tab becomes visible
        const now = Date.now();
        const elapsed = Math.floor((now - startTimeRef.current) / 1000);
        setElapsedTime(elapsed);
      }
    };
    
    document.addEventListener('visibilitychange', handleVisibilityChange);
    
    return () => {
      document.removeEventListener('visibilitychange', handleVisibilityChange);
    };
  }, [isRunning]);
  
  // Start the timer
  const startTimer = () => {
    if (timerRef.current) {
      clearInterval(timerRef.current);
    }
    
    timerRef.current = setInterval(() => {
      setElapsedTime(prev => prev + 1);
    }, 1000);
  };
  
  // Stop the timer
  const stopTimer = () => {
    if (timerRef.current) {
      clearInterval(timerRef.current);
      timerRef.current = null;
    }
  };
  
  // Cleanup on unmount
  useEffect(() => {
    return () => stopTimer();
  }, []);
  
  // Toggle timer
  const handleToggleTimer = () => {
    if (isRunning) {
      // Stop timer
      if (activeRecordId) {
        stopTimeRecord(activeRecordId);
        trackEvent(ANALYTICS_EVENTS.STOP_TIMER, { 
          activityName: activity.name,
          duration: elapsedTime
        });
        stopTimer();
        setIsRunning(false);
        setActiveRecordId(null);
        setElapsedTime(0);
        onRecordChange();
      }
    } else {
      // Start timer
      const record = startTimeRecord(activity.id);
      trackEvent(ANALYTICS_EVENTS.START_TIMER, { activityName: activity.name });
      startTimeRef.current = new Date(record.startTime).getTime();
      setIsRunning(true);
      setActiveRecordId(record.id);
      setElapsedTime(0);
      startTimer();
      onRecordChange();
    }
  };
  
  // Format the total time for display
  const displayTotalTime = activity.totalTime ? formatTime(activity.totalTime) : "0:00";
  
  return (
    <div className="glass-card p-4 flex items-center">
      <ActivityIcon activity={activity} />
      
      <div className="flex-1">
        <ActivityNameEditor 
          activityId={activity.id}
          activityName={activity.name}
          isEditingName={isEditingName}
          setIsEditingName={setIsEditingName}
          onRecordChange={onRecordChange}
        />
        <StatusIndicator 
          isRunning={isRunning} 
          displayTotalTime={displayTotalTime} 
        />
      </div>
      
      <div className="flex items-center">
        <TimerDisplay 
          isRunning={isRunning}
          elapsedTime={elapsedTime}
          totalTime={activity.totalTime}
        />
        
        <TimerControls 
          isRunning={isRunning}
          onToggleTimer={handleToggleTimer}
        />
        
        <ActivityOptions 
          onEdit={() => setIsEditingName(true)}
        />
      </div>
    </div>
  );
};

export default Timer;
