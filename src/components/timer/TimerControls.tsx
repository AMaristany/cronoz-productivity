
import React from "react";
import { Play, Pause } from "lucide-react";

interface TimerControlsProps {
  isRunning: boolean;
  onToggleTimer: () => void;
}

const TimerControls: React.FC<TimerControlsProps> = ({ 
  isRunning, 
  onToggleTimer 
}) => {
  return (
    <button
      onClick={onToggleTimer}
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
  );
};

export default TimerControls;
