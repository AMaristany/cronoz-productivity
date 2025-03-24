
import React, { useState, useEffect } from "react";
import { BarChart, Bar, XAxis, Cell, ResponsiveContainer, PieChart, Pie, Cell as PieCell, Tooltip as RechartsTooltip, LineChart, Line, YAxis } from "recharts";
import { Clock, Calendar, TrendingUp, ChevronUp, ChevronDown } from "lucide-react";
import { Activity, TimeRecord } from "../../types";
import { loadTimeRecords, formatTimeLong, formatDateLong } from "../../utils/timerUtils";

interface ActivityStatsProps {
  activity: Activity;
}

const ActivityStats: React.FC<ActivityStatsProps> = ({ activity }) => {
  const [records, setRecords] = useState<TimeRecord[]>([]);
  const [totalTime, setTotalTime] = useState<number>(0);
  const [averageDuration, setAverageDuration] = useState<number>(0);
  const [shortestSession, setShortestSession] = useState<TimeRecord | null>(null);
  const [longestSession, setLongestSession] = useState<TimeRecord | null>(null);
  const [dailyData, setDailyData] = useState<{ date: string; time: number }[]>([]);
  const [selectedView, setSelectedView] = useState<'day' | 'week' | 'month'>('week');
  
  useEffect(() => {
    const loadedRecords = loadTimeRecords().filter(
      record => record.activityId === activity.id && record.duration !== null
    ) as TimeRecord[];
    
    setRecords(loadedRecords);
    
    if (loadedRecords.length > 0) {
      // Calculate total time
      const total = loadedRecords.reduce((sum, record) => sum + (record.duration || 0), 0);
      setTotalTime(total);
      
      // Calculate average duration
      setAverageDuration(total / loadedRecords.length);
      
      // Find shortest and longest sessions
      const sortedByDuration = [...loadedRecords].sort((a, b) => 
        (a.duration || 0) - (b.duration || 0)
      );
      
      setShortestSession(sortedByDuration[0]);
      setLongestSession(sortedByDuration[sortedByDuration.length - 1]);
      
      // Prepare daily data
      prepareDailyData(loadedRecords);
    }
  }, [activity.id]);
  
  const prepareDailyData = (loadedRecords: TimeRecord[]) => {
    const dailyTotals: Record<string, number> = {};
    
    // Group records by date and sum durations
    loadedRecords.forEach(record => {
      if (!dailyTotals[record.date]) {
        dailyTotals[record.date] = 0;
      }
      dailyTotals[record.date] += (record.duration || 0);
    });
    
    // Convert to array for chart
    const dailyChartData = Object.entries(dailyTotals).map(([date, time]) => ({
      date,
      time,
    })).sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());
    
    setDailyData(dailyChartData);
  };
  
  const getFilteredData = () => {
    if (dailyData.length === 0) return [];
    
    const now = new Date();
    let filterDate = new Date();
    
    if (selectedView === 'day') {
      filterDate.setDate(now.getDate() - 1);
    } else if (selectedView === 'week') {
      filterDate.setDate(now.getDate() - 7);
    } else if (selectedView === 'month') {
      filterDate.setMonth(now.getMonth() - 1);
    }
    
    return dailyData.filter(item => new Date(item.date) >= filterDate);
  };
  
  const filteredData = getFilteredData();
  
  return (
    <div className="space-y-6">
      <div className="glass-card p-6">
        <h2 className="text-xl font-semibold mb-4">Estadísticas de {activity.name}</h2>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="flex flex-col">
            <span className="text-sm text-muted-foreground">Tiempo total</span>
            <span className="text-2xl font-bold">{formatTimeLong(totalTime)}</span>
          </div>
          <div className="flex flex-col">
            <span className="text-sm text-muted-foreground">Duración media</span>
            <span className="text-2xl font-bold">{formatTimeLong(averageDuration)}</span>
          </div>
          <div className="flex flex-col">
            <span className="text-sm text-muted-foreground">Sesiones</span>
            <span className="text-2xl font-bold">{records.length}</span>
          </div>
        </div>
      </div>
      
      <div className="flex items-center gap-2 mb-2">
        <button
          onClick={() => setSelectedView('day')}
          className={`px-4 py-2 rounded-full text-sm ${
            selectedView === 'day' 
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
        <button
          onClick={() => setSelectedView('month')}
          className={`px-4 py-2 rounded-full text-sm ${
            selectedView === 'month' 
              ? 'bg-cronoz-green text-white' 
              : 'bg-gray-100 dark:bg-cronoz-black-light'
          }`}
        >
          Este Mes
        </button>
      </div>
      
      <div className="glass-card p-6">
        <div className="h-60">
          {filteredData.length > 0 ? (
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={filteredData}>
                <XAxis 
                  dataKey="date" 
                  tickFormatter={(date) => new Date(date).toLocaleDateString('es-ES', { day: '2-digit', month: '2-digit' })}
                />
                <RechartsTooltip 
                  formatter={(value: number) => formatTimeLong(value)}
                  labelFormatter={(date) => formatDateLong(date as string)}
                />
                <Bar dataKey="time" radius={[4, 4, 0, 0]}>
                  {filteredData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={activity.color || "#8FD694"} />
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
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="glass-card p-6">
          <div className="flex items-center gap-2 mb-4">
            <ChevronUp className="text-green-500 w-5 h-5" />
            <h3 className="text-lg font-semibold">Sesión más larga</h3>
          </div>
          
          {longestSession ? (
            <div className="space-y-2">
              <p className="text-2xl font-bold">{formatTimeLong(longestSession.duration || 0)}</p>
              <p className="text-sm text-muted-foreground">
                {formatDateLong(longestSession.date)}
              </p>
            </div>
          ) : (
            <p className="text-muted-foreground">Sin datos</p>
          )}
        </div>
        
        <div className="glass-card p-6">
          <div className="flex items-center gap-2 mb-4">
            <ChevronDown className="text-orange-500 w-5 h-5" />
            <h3 className="text-lg font-semibold">Sesión más corta</h3>
          </div>
          
          {shortestSession ? (
            <div className="space-y-2">
              <p className="text-2xl font-bold">{formatTimeLong(shortestSession.duration || 0)}</p>
              <p className="text-sm text-muted-foreground">
                {formatDateLong(shortestSession.date)}
              </p>
            </div>
          ) : (
            <p className="text-muted-foreground">Sin datos</p>
          )}
        </div>
      </div>
    </div>
  );
};

export default ActivityStats;
