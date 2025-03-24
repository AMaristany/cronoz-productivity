
import React, { useEffect } from "react";
import { Link, useLocation } from "react-router-dom";
import Navbar from "./Navbar";
import { Clock, BarChart2, CalendarDays } from "lucide-react";
import { initAnalytics, trackEvent, ANALYTICS_EVENTS } from "../utils/analyticsUtils";

interface LayoutProps {
  title: string;
  children: React.ReactNode;
}

const Layout: React.FC<LayoutProps> = ({ title, children }) => {
  const location = useLocation();
  
  useEffect(() => {
    // Initialize analytics
    initAnalytics();
    
    // Track page view based on current route
    let eventName = ANALYTICS_EVENTS.VIEW_HOME;
    
    if (location.pathname === '/statistics') {
      eventName = ANALYTICS_EVENTS.VIEW_STATISTICS;
    } else if (location.pathname === '/activities') {
      eventName = ANALYTICS_EVENTS.VIEW_ACTIVITIES;
    }
    
    trackEvent(eventName);
  }, [location.pathname]);
  
  return (
    <div className="flex flex-col md:flex-row min-h-screen bg-gradient-to-br from-white to-accent dark:from-cronoz-black dark:to-cronoz-black">
      <div className="flex-shrink-0 bg-background border-r border-border hidden md:block w-16">
        <div className="sticky top-0 flex flex-col items-center p-3 h-screen">
          <Link to="/" className="mb-8 mt-4">
            <img src="/logo.svg" alt="Cronoz" className="w-8 h-8" />
          </Link>
          
          <div className="flex flex-col items-center gap-3 mt-8">
            <Link 
              to="/" 
              className={`p-3 rounded-full ${location.pathname === "/" ? "bg-accent text-accent-foreground" : "text-foreground/60 hover:text-foreground hover:bg-accent/50"} transition-colors`}
              title="Temporizador"
            >
              <Clock className="w-5 h-5" />
            </Link>
            <Link 
              to="/statistics" 
              className={`p-3 rounded-full ${location.pathname === "/statistics" ? "bg-accent text-accent-foreground" : "text-foreground/60 hover:text-foreground hover:bg-accent/50"} transition-colors`}
              title="Estadísticas"
            >
              <BarChart2 className="w-5 h-5" />
            </Link>
            <Link 
              to="/activities" 
              className={`p-3 rounded-full ${location.pathname === "/activities" ? "bg-accent text-accent-foreground" : "text-foreground/60 hover:text-foreground hover:bg-accent/50"} transition-colors`}
              title="Actividades"
            >
              <CalendarDays className="w-5 h-5" />
            </Link>
          </div>
        </div>
      </div>
      
      <div className="flex-1 px-4 py-6 md:py-8 md:px-8 max-w-5xl mx-auto w-full">
        <Navbar />
        <main className="mt-8">
          {children}
        </main>
      </div>
    </div>
  );
};

export default Layout;
