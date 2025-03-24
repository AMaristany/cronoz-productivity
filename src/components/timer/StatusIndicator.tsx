
import React from "react";

interface StatusIndicatorProps {
  isRunning: boolean;
  displayTotalTime: string;
}

const StatusIndicator: React.FC<StatusIndicatorProps> = ({ 
  isRunning, 
  displayTotalTime 
}) => {
  return (
    <div className="flex items-center text-sm text-muted-foreground">
      {isRunning ? (
        <div className="flex items-center gap-1">
          <span className="text-cronoz-green">●</span>
          <span className="hidden md:inline-block">Grabando</span>
        </div>
      ) : (
        <span>
          Total: {displayTotalTime}
        </span>
      )}
    </div>
  );
};

export default StatusIndicator;
