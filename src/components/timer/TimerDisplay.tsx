
import React from "react";
import { formatTime } from "../../utils/timerUtils";

interface TimerDisplayProps {
  isRunning: boolean;
  elapsedTime: number;
  totalTime: number | undefined;
}

const TimerDisplay: React.FC<TimerDisplayProps> = ({ 
  isRunning, 
  elapsedTime, 
  totalTime 
}) => {
  // Format the total time for display
  const displayTotalTime = totalTime ? formatTime(totalTime) : "0:00";
  
  // Current timer display
  const currentTimerDisplay = isRunning ? formatTime(elapsedTime) : displayTotalTime;
  
  return (
    <>
      {isRunning && (
        <div className="font-sans font-medium text-lg mr-4">
          {formatTime(elapsedTime)}
        </div>
      )}
    </>
  );
};

export default TimerDisplay;
