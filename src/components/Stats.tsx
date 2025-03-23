
import React, { useState, useEffect } from "react";
import { BarChart, Bar, XAxis, Cell, ResponsiveContainer, PieChart, Pie, Cell as PieCell } from "recharts";
import { Activity } from "../types";
import { getDailySummary, getWeeklySummary, loadActivities, formatTimeLong } from "../utils/timerUtils";

const Stats: React.FC = () => {
  const [activities, setActivities] = useState<Activity[]>([]);
  const [dailyData, setDailyData] = useState<{ name: string; time: number; color: string }[]>([]);
  const [weeklyData, setWeeklyData] = useState<{ name: string; time: number }[]>([]);
  const [totalToday, setTotalToday] = useState<number>(0);
  const [totalWeek, setTotalWeek] = useState<number>(0);
  
  useEffect(() => {
    const loadedActivities = loadActivities();
    setActivities(loadedActivities);
    
    // Load daily summary
    const dailySummary = getDailySummary();
    setTotalToday(dailySummary.totalTime);
    
    // Transform data for charts
    const dailyChartData = Object.entries(dailySummary.activities).map(([activityId, time]) => {
      const activity = loadedActivities.find(a => a.id === activityId);
      return {
        name: activity?.name || "Desconocido",
        time,
        color: activity?.color || "#8FD694"
      };
    }).sort((a, b) => b.time - a.time);
    
    setDailyData(dailyChartData);
    
    // Load weekly summary
    const weeklySummary = getWeeklySummary();
    setTotalWeek(weeklySummary.totalTime);
    
    // Transform weekly data
    const weeklyChartData = Object.entries(weeklySummary.dailyTotals).map(([date, time]) => {
      const weekday = new Date(date).toLocaleDateString("es-ES", { weekday: "short" });
      return {
        name: weekday,
        time
      };
    });
    
    setWeeklyData(weeklyChartData);
  }, []);
  
  return (
    <div className="space-y-6">
      <div className="glass-card p-6">
        <h2 className="text-xl font-semibold mb-4">Resumen de Hoy</h2>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <div className="mb-4">
              <span className="text-sm text-muted-foreground">Tiempo total</span>
              <h3 className="text-2xl font-bold">{formatTimeLong(totalToday)}</h3>
            </div>
            
            {dailyData.length > 0 ? (
              <div className="space-y-3">
                {dailyData.map((item) => (
                  <div key={item.name} className="flex items-center">
                    <div 
                      className="w-3 h-3 rounded-full mr-2"
                      style={{ backgroundColor: item.color }}
                    />
                    <span className="text-sm flex-1">{item.name}</span>
                    <span className="text-sm font-medium">{formatTimeLong(item.time)}</span>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-muted-foreground text-sm">No hay actividades registradas hoy</p>
            )}
          </div>
          
          <div className="h-60">
            {dailyData.length > 0 ? (
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={dailyData}
                    cx="50%"
                    cy="50%"
                    innerRadius={60}
                    outerRadius={80}
                    paddingAngle={2}
                    dataKey="time"
                    label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                    labelLine={false}
                  >
                    {dailyData.map((entry, index) => (
                      <PieCell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                </PieChart>
              </ResponsiveContainer>
            ) : (
              <div className="h-full flex items-center justify-center">
                <p className="text-muted-foreground">No hay datos para mostrar</p>
              </div>
            )}
          </div>
        </div>
      </div>
      
      <div className="glass-card p-6">
        <h2 className="text-xl font-semibold mb-4">Resumen Semanal</h2>
        
        <div className="mb-4">
          <span className="text-sm text-muted-foreground">Tiempo total esta semana</span>
          <h3 className="text-2xl font-bold">{formatTimeLong(totalWeek)}</h3>
        </div>
        
        <div className="h-60">
          {weeklyData.length > 0 ? (
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={weeklyData}>
                <XAxis dataKey="name" />
                <Bar dataKey="time" radius={[4, 4, 0, 0]}>
                  {weeklyData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill="#8FD694" />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          ) : (
            <div className="h-full flex items-center justify-center">
              <p className="text-muted-foreground">No hay datos para mostrar</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Stats;
