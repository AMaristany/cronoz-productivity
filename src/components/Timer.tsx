import React, { useState, useEffect, useRef } from "react";
import { Play, Pause, MoreVertical } from "lucide-react";
import { ActivityWithRecords } from "../types";
import { formatTime, startTimeRecord, stopTimeRecord, findActiveTimeRecord } from "../utils/timerUtils";
import { Icons } from "../utils/iconUtils";
import { trackEvent, ANALYTICS_EVENTS } from "../utils/analyticsUtils";

interface TimerProps {
  activity: ActivityWithRecords;
  onRecordChange: () => void;
}

const Timer: React.FC<TimerProps> = ({ activity, onRecordChange }) => {
  const [isRunning, setIsRunning] = useState(false);
  const [activeRecordId, setActiveRecordId] = useState<string | null>(null);
  const [elapsedTime, setElapsedTime] = useState(0);
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
  
  // Get activity icon
  const getActivityIcon = () => {
    const IconComponent = activity.icon ? Icons[activity.icon] || Icons["Tiempo"] : Icons["Tiempo"];
    return <IconComponent className="w-5 h-5" />;
  };
  
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
  
  // Current timer display
  const currentTimerDisplay = isRunning ? formatTime(elapsedTime) : displayTotalTime;
  
  return (
    <div className="glass-card p-4 flex items-center">
      <div 
        className="w-12 h-12 rounded-full flex items-center justify-center mr-4"
        style={{ 
          backgroundColor: activity.color || "#8FD694",
          color: "#fff" 
        }}
      >
        {getActivityIcon()}
      </div>
      
      <div className="flex-1">
        <h3 className="font-medium">{activity.name}</h3>
        <div className="flex items-center text-sm text-muted-foreground">
          {isRunning ? (
            <span className="animate-pulse-light text-cronoz-green">
              Grabando...
            </span>
          ) : (
            <span>
              Total: {displayTotalTime}
            </span>
          )}
        </div>
      </div>
      
      <div className="flex items-center">
        {isRunning && (
          <div className="font-mono font-medium text-lg mr-4">
            {formatTime(elapsedTime)}
          </div>
        )}
        
        <button
          onClick={handleToggleTimer}
          className={`w-10 h-10 rounded-full flex items-center justify-center ${
            isRunning 
              ? "bg-red-100 text-red-500 dark:bg-red-500/20" 
              : "bg-cronoz-green text-white"
          }`}
        >
          {isRunning ? (
            <Pause className="w-5 h-5" />
          ) : (
            <Play className="w-5 h-5 ml-0.5" />
          )}
        </button>
        
        <button className="ml-2 p-2 rounded-full hover:bg-gray-100 dark:hover:bg-cronoz-black-light transition-colors">
          <MoreVertical className="w-5 h-5" />
        </button>
      </div>
    </div>
  );
};

export default Timer;
