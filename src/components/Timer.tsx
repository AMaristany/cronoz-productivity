
import React, { useState, useEffect } from "react";
import { toast } from "sonner";
import { Play, Pause, Clock } from "lucide-react";
import { Activity, TimeRecord } from "../types";
import { startTimeRecord, stopTimeRecord, findActiveTimeRecord, formatTime } from "../utils/timerUtils";

interface TimerProps {
  activity: Activity;
  onRecordChange: () => void;
}

const Timer: React.FC<TimerProps> = ({ activity, onRecordChange }) => {
  const [activeRecord, setActiveRecord] = useState<TimeRecord | null>(null);
  const [elapsed, setElapsed] = useState<number>(0);
  const [isRunning, setIsRunning] = useState<boolean>(false);
  
  // Find if this activity has an active record when component mounts
  useEffect(() => {
    const record = findActiveTimeRecord();
    if (record && record.activityId === activity.id) {
      setActiveRecord(record);
      setIsRunning(true);
    } else {
      setActiveRecord(null);
      setIsRunning(false);
    }
  }, [activity.id]);
  
  // Update elapsed time
  useEffect(() => {
    let interval: number | null = null;
    
    if (isRunning && activeRecord) {
      interval = window.setInterval(() => {
        const startTime = new Date(activeRecord.startTime).getTime();
        const now = new Date().getTime();
        setElapsed(Math.floor((now - startTime) / 1000));
      }, 1000);
    } else {
      setElapsed(0);
    }
    
    return () => {
      if (interval !== null) {
        clearInterval(interval);
      }
    };
  }, [isRunning, activeRecord]);
  
  const handleStart = () => {
    const currentActiveRecord = findActiveTimeRecord();
    
    if (currentActiveRecord) {
      // Stop any other active record first
      stopTimeRecord(currentActiveRecord.id);
      toast.info("Se detuvo otra actividad en proceso");
    }
    
    const record = startTimeRecord(activity.id);
    setActiveRecord(record);
    setIsRunning(true);
    onRecordChange();
    toast.success(`Iniciando ${activity.name}`);
  };
  
  const handleStop = () => {
    if (activeRecord) {
      const updatedRecord = stopTimeRecord(activeRecord.id);
      if (updatedRecord && updatedRecord.duration) {
        toast.info(`${activity.name} - ${formatTime(updatedRecord.duration)}`);
      }
      setActiveRecord(null);
      setIsRunning(false);
      onRecordChange();
    }
  };
  
  return (
    <div className="glass-card p-4 mb-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center">
          <div 
            className="w-10 h-10 rounded-full flex items-center justify-center mr-3"
            style={{ 
              backgroundColor: activity.color || "#8FD694",
              color: "#fff" 
            }}
          >
            {activity.icon ? (
              <span>{activity.icon}</span>
            ) : (
              <Clock className="w-5 h-5" />
            )}
          </div>
          <div>
            <h3 className="font-medium text-lg">{activity.name}</h3>
            {isRunning && (
              <span className="text-sm text-cronoz-green-dark animate-pulse-light">
                En progreso
              </span>
            )}
          </div>
        </div>
        
        <div className="flex items-center gap-4">
          {isRunning && (
            <div className="text-xl font-semibold font-mono">
              {formatTime(elapsed)}
            </div>
          )}
          
          {isRunning ? (
            <button 
              onClick={handleStop}
              className="rounded-full bg-cronoz-black p-3 text-white shadow transition-all hover:shadow-md active:scale-95"
            >
              <Pause className="w-6 h-6" />
            </button>
          ) : (
            <button 
              onClick={handleStart}
              className="rounded-full bg-cronoz-green p-3 text-white shadow transition-all hover:shadow-md active:scale-95"
            >
              <Play className="w-6 h-6" />
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default Timer;
