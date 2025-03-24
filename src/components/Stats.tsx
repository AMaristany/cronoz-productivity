import React, { useState, useEffect } from "react";
import { BarChart, Bar, XAxis, Cell, ResponsiveContainer, PieChart, Pie, Cell as PieCell, Tooltip as RechartsTooltip, LineChart, Line, YAxis } from "recharts";
import { Activity, TimeRecord } from "../types";
import { getDailySummary, getWeeklySummary, loadActivities, loadTimeRecords, formatTimeLong } from "../utils/timerUtils";
import { Icons } from "../utils/iconUtils";
import { Flame, Clock, Calendar, Sparkles, TrendingUp, ArrowLeft } from "lucide-react";
import ActivityStats from "./activity/ActivityStats";

const Stats: React.FC = () => {
  const [activities, setActivities] = useState<Activity[]>([]);
  const [dailyData, setDailyData] = useState<{ name: string; time: number; color: string; id: string }[]>([]);
  const [weeklyData, setWeeklyData] = useState<{ name: string; time: number }[]>([]);
  const [streakData, setStreakData] = useState<{ activity: string; streak: number; color: string }[]>([]);
  const [hourlyData, setHourlyData] = useState<{ hour: string; count: number }[]>([]);
  const [avgDurations, setAvgDurations] = useState<{ activity: string; duration: number; color: string }[]>([]);
  const [totalToday, setTotalToday] = useState<number>(0);
  const [totalWeek, setTotalWeek] = useState<number>(0);
  const [selectedView, setSelectedView] = useState<'today' | 'week'>('today');
  const [selectedActivity, setSelectedActivity] = useState<Activity | null>(null);
  
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
        color: activity?.color || "#8FD694",
        id: activityId
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
    
    // Calculate streaks
    calculateStreaks(loadedActivities);
    
    // Calculate hourly distribution
    calculateHourlyDistribution();
    
    // Calculate average durations
    calculateAverageDurations(loadedActivities);
  }, []);
  
  const calculateStreaks = (allActivities: Activity[]) => {
    const timeRecords = loadTimeRecords();
    const streaks: { activity: string; streak: number; color: string }[] = [];
    
    allActivities.forEach(activity => {
      const activityRecords = timeRecords.filter(record => 
        record.activityId === activity.id && record.endTime !== null
      );
      
      if (activityRecords.length === 0) return;
      
      // Sort records by date
      const sortedDates = [...new Set(activityRecords.map(record => record.date))].sort();
      
      if (sortedDates.length === 0) return;
      
      let currentStreak = 1;
      let maxStreak = 1;
      
      // Calculate the streak
      for (let i = 1; i < sortedDates.length; i++) {
        const prevDate = new Date(sortedDates[i-1]);
        const currDate = new Date(sortedDates[i]);
        
        // Check if dates are consecutive
        prevDate.setDate(prevDate.getDate() + 1);
        
        if (prevDate.toISOString().split('T')[0] === sortedDates[i]) {
          currentStreak++;
          maxStreak = Math.max(maxStreak, currentStreak);
        } else {
          currentStreak = 1;
        }
      }
      
      streaks.push({
        activity: activity.name,
        streak: maxStreak,
        color: activity.color || "#8FD694"
      });
    });
    
    setStreakData(streaks.sort((a, b) => b.streak - a.streak).slice(0, 5));
  };
  
  const calculateHourlyDistribution = () => {
    const timeRecords = loadTimeRecords();
    const hourCounts: Record<number, number> = {};
    
    // Initialize hours
    for (let i = 0; i < 24; i++) {
      hourCounts[i] = 0;
    }
    
    timeRecords.forEach(record => {
      if (!record.endTime) return;
      
      const startHour = new Date(record.startTime).getHours();
      hourCounts[startHour]++;
    });
    
    const hourlyData = Object.entries(hourCounts)
      .map(([hour, count]) => ({
        hour: `${hour.padStart(2, '0')}:00`,
        count
      }))
      .filter(entry => entry.count > 0);
    
    setHourlyData(hourlyData);
  };
  
  const calculateAverageDurations = (allActivities: Activity[]) => {
    const timeRecords = loadTimeRecords();
    const avgDurations: { activity: string; duration: number; color: string }[] = [];
    
    allActivities.forEach(activity => {
      const activityRecords = timeRecords.filter(record => 
        record.activityId === activity.id && record.duration !== null
      ) as TimeRecord[];
      
      if (activityRecords.length === 0) return;
      
      const totalDuration = activityRecords.reduce((sum, record) => sum + (record.duration || 0), 0);
      const avgDuration = totalDuration / activityRecords.length;
      
      avgDurations.push({
        activity: activity.name,
        duration: avgDuration,
        color: activity.color || "#8FD694"
      });
    });
    
    setAvgDurations(avgDurations.sort((a, b) => b.duration - a.duration).slice(0, 5));
  };
  
  const handleActivityClick = (activityId: string) => {
    const activity = activities.find(a => a.id === activityId);
    if (activity) {
      setSelectedActivity(activity);
    }
  };
  
  if (selectedActivity) {
    return (
      <div>
        <button 
          onClick={() => setSelectedActivity(null)}
          className="flex items-center gap-1 text-sm text-muted-foreground mb-4 hover:text-foreground transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          Volver a estadísticas generales
        </button>
        <ActivityStats activity={selectedActivity} />
      </div>
    );
  }
  
  return (
    <div className="space-y-6">
      <div className="flex items-center gap-2 mb-2">
        <button
          onClick={() => setSelectedView('today')}
          className={`px-4 py-2 rounded-full text-sm ${
            selectedView === 'today' 
              ? 'bg-cronoz-green text-white' 
              : 'bg-gray-100 dark:bg-cronoz-black-light'
          }`}
        >
          Hoy
        </button>
        <button
          onClick={() => setSelectedView('week')}
          className={`px-4 py-2 rounded-full text-sm ${
            selectedView === 'week' 
              ? 'bg-cronoz-green text-white' 
              : 'bg-gray-100 dark:bg-cronoz-black-light'
          }`}
        >
          Esta Semana
        </button>
      </div>
      
      {selectedView === 'today' ? (
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
                    <button 
                      key={item.id} 
                      className="flex items-center w-full text-left hover:bg-muted/30 p-1 rounded transition-colors"
                      onClick={() => handleActivityClick(item.id)}
                    >
                      <div 
                        className="w-3 h-3 rounded-full mr-2"
                        style={{ backgroundColor: item.color }}
                      />
                      <span className="text-sm flex-1">{item.name}</span>
                      <span className="text-sm font-medium">{formatTimeLong(item.time)}</span>
                    </button>
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
                    <RechartsTooltip 
                      formatter={(value: number) => formatTimeLong(value)}
                      labelFormatter={(name) => `Actividad: ${name}`}
                    />
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
                      onClick={(data) => handleActivityClick(data.id)}
                      cursor="pointer"
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
      ) : (
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
                  <RechartsTooltip 
                    formatter={(value: number) => formatTimeLong(value)}
                    labelFormatter={(name) => `Día: ${name}`}
                  />
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
      )}
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Streak Widget */}
        <div className="glass-card p-6">
          <div className="flex items-center gap-2 mb-4">
            <Flame className="text-orange-500 w-5 h-5" />
            <h3 className="text-lg font-semibold">Rachas</h3>
          </div>
          
          {streakData.length > 0 ? (
            <div className="space-y-3">
              {streakData.map((item) => (
                <div key={item.activity} className="flex items-center">
                  <div 
                    className="w-3 h-3 rounded-full mr-2"
                    style={{ backgroundColor: item.color }}
                  />
                  <span className="text-sm flex-1">{item.activity}</span>
                  <span className="text-sm font-medium">
                    {item.streak} {item.streak === 1 ? 'día' : 'días'}
                  </span>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-muted-foreground text-sm">No hay rachas para mostrar</p>
          )}
        </div>
        
        {/* Average Duration Widget */}
        <div className="glass-card p-6">
          <div className="flex items-center gap-2 mb-4">
            <Clock className="text-blue-500 w-5 h-5" />
            <h3 className="text-lg font-semibold">Duración Media</h3>
          </div>
          
          {avgDurations.length > 0 ? (
            <div className="space-y-3">
              {avgDurations.map((item) => (
                <div key={item.activity} className="flex items-center">
                  <div 
                    className="w-3 h-3 rounded-full mr-2"
                    style={{ backgroundColor: item.color }}
                  />
                  <span className="text-sm flex-1">{item.activity}</span>
                  <span className="text-sm font-medium">{formatTimeLong(item.duration)}</span>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-muted-foreground text-sm">No hay datos suficientes</p>
          )}
        </div>
        
        {/* Hourly Distribution Widget */}
        <div className="glass-card p-6">
          <div className="flex items-center gap-2 mb-4">
            <Calendar className="text-purple-500 w-5 h-5" />
            <h3 className="text-lg font-semibold">Horas Activas</h3>
          </div>
          
          {hourlyData.length > 0 ? (
            <div className="h-40">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={hourlyData}>
                  <XAxis dataKey="hour" tick={{ fontSize: 10 }} />
                  <YAxis tick={{ fontSize: 10 }} />
                  <RechartsTooltip />
                  <Line 
                    type="monotone" 
                    dataKey="count" 
                    stroke="#9B51E0" 
                    strokeWidth={2}
                    dot={true}
                  />
                </LineChart>
              </ResponsiveContainer>
            </div>
          ) : (
            <p className="text-muted-foreground text-sm">No hay datos suficientes</p>
          )}
        </div>
      </div>
    </div>
  );
};

export default Stats;

