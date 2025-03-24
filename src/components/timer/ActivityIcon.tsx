
import React from "react";
import { Icons } from "../../utils/iconUtils";
import { ActivityWithRecords } from "../../types";

interface ActivityIconProps {
  activity: ActivityWithRecords;
}

const ActivityIcon: React.FC<ActivityIconProps> = ({ activity }) => {
  // Get activity icon
  const getActivityIcon = () => {
    const IconComponent = activity.icon ? Icons[activity.icon] || Icons["Tiempo"] : Icons["Tiempo"];
    return <IconComponent className="w-5 h-5" />;
  };
  
  return (
    <div 
      className="w-12 h-12 rounded-full flex items-center justify-center mr-4"
      style={{ 
        backgroundColor: activity.color || "#8FD694",
        color: "#fff" 
      }}
    >
      {getActivityIcon()}
    </div>
  );
};

export default ActivityIcon;
