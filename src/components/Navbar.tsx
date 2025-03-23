
import React from "react";
import { Link, useLocation } from "react-router-dom";
import { Timer, LayoutList, LineChart } from "lucide-react";

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
      
      <div className="flex items-center space-x-1">
        <Link
          to="/"
          className={`p-2 rounded-full transition-all duration-300 ${
            isActive("/") 
              ? "bg-cronoz-green text-white shadow-md" 
              : "text-cronoz-black dark:text-white hover:bg-cronoz-gray/10 dark:hover:bg-white/5"
          }`}
          aria-label="Cronómetro"
        >
          <Timer className="w-6 h-6" />
        </Link>
        
        <Link
          to="/activities"
          className={`p-2 rounded-full transition-all duration-300 ${
            isActive("/activities") 
              ? "bg-cronoz-green text-white shadow-md" 
              : "text-cronoz-black dark:text-white hover:bg-cronoz-gray/10 dark:hover:bg-white/5"
          }`}
          aria-label="Actividades"
        >
          <LayoutList className="w-6 h-6" />
        </Link>
        
        <Link
          to="/statistics"
          className={`p-2 rounded-full transition-all duration-300 ${
            isActive("/statistics") 
              ? "bg-cronoz-green text-white shadow-md" 
              : "text-cronoz-black dark:text-white hover:bg-cronoz-gray/10 dark:hover:bg-white/5"
          }`}
          aria-label="Estadísticas"
        >
          <LineChart className="w-6 h-6" />
        </Link>
      </div>
    </div>
  );
};

export default Navbar;
