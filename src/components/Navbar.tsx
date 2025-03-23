
import React from "react";
import { Link, useLocation } from "react-router-dom";
import { Clock, BarChart2, Settings } from "lucide-react";

const Navbar: React.FC = () => {
  const location = useLocation();
  
  const isActive = (path: string) => {
    return location.pathname === path;
  };
  
  return (
    <div className="flex justify-between items-center">
      <Link to="/" className="flex items-center gap-2">
        <img src="/logo.svg" alt="Cronoz Logo" className="w-8 h-8" />
        <span className="font-display font-bold text-xl text-cronoz-black dark:text-white">Cronoz</span>
      </Link>
      
      <div className="flex items-center gap-1">
        <Link
          to="/"
          className={`flex flex-col items-center justify-center p-2 rounded-lg transition-all duration-300 ${
            isActive("/") 
              ? "text-cronoz-green bg-cronoz-green/10" 
              : "text-cronoz-black dark:text-white hover:bg-cronoz-gray/10 dark:hover:bg-white/5"
          }`}
        >
          <Clock className="w-6 h-6" />
          <span className="text-xs mt-1">Cronómetro</span>
        </Link>
        
        <Link
          to="/activities"
          className={`flex flex-col items-center justify-center p-2 rounded-lg transition-all duration-300 ${
            isActive("/activities") 
              ? "text-cronoz-green bg-cronoz-green/10" 
              : "text-cronoz-black dark:text-white hover:bg-cronoz-gray/10 dark:hover:bg-white/5"
          }`}
        >
          <Settings className="w-6 h-6" />
          <span className="text-xs mt-1">Actividades</span>
        </Link>
        
        <Link
          to="/statistics"
          className={`flex flex-col items-center justify-center p-2 rounded-lg transition-all duration-300 ${
            isActive("/statistics") 
              ? "text-cronoz-green bg-cronoz-green/10" 
              : "text-cronoz-black dark:text-white hover:bg-cronoz-gray/10 dark:hover:bg-white/5"
          }`}
        >
          <BarChart2 className="w-6 h-6" />
          <span className="text-xs mt-1">Estadísticas</span>
        </Link>
      </div>
    </div>
  );
};

export default Navbar;
