
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
        <span className="text-cronoz-green">
          ●
        </span>
      ) : (
        <span>
          Total: {displayTotalTime}
        </span>
      )}
    </div>
  );
};

export default StatusIndicator;
