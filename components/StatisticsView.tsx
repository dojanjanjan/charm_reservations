import React, { useMemo } from 'react';
import { 
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, 
  PieChart as RePieChart, Pie, Cell, AreaChart, Area, LineChart, Line 
} from 'recharts';
import { useReservations } from '../hooks/useReservations';
import { useLanguage } from '../hooks/useLanguage';
import { ArrowLeft, TrendingUp, Users, Calendar as CalendarIcon, Clock, Sparkles } from './Icons';

interface StatisticsViewProps {
  onBack: () => void;
}

const COLORS = ['#AE9471', '#4B3621', '#E6C494', '#8C7355', '#D3C1AE'];

const StatisticsView: React.FC<StatisticsViewProps> = ({ onBack }) => {
  const { reservations, loading } = useReservations();
  const { t, language } = useLanguage();

  const stats = useMemo(() => {
    if (loading || reservations.length === 0) return null;

    // Helper to get week number
    const getWeekNumber = (d: Date) => {
      const date = new Date(Date.UTC(d.getFullYear(), d.getMonth(), d.getDate()));
      date.setUTCDate(date.getUTCDate() + 4 - (date.getUTCDay() || 7));
      const yearStart = new Date(Date.UTC(date.getUTCFullYear(), 0, 1));
      const weekNo = Math.ceil((((date.getTime() - yearStart.getTime()) / 86400000) + 1) / 7);
      return weekNo;
    };

    const now = new Date();
    const currentYear = now.getFullYear();

    // 1. Weekly & Monthly Trends
    const weeklyData: Record<number, { week: number, count: number, guests: number }> = {};
    const monthlyData: Record<number, { month: string, count: number, guests: number }> = {};
    
    // 2. Visit Times (Popular Hours)
    const hourData: Record<number, number> = {};
    
    // 3. Top Guests
    const guestStats: Record<string, { name: string, visits: number, totalPax: number }> = {};
    
    // 4. Booking Lead Time
    let totalLeadTime = 0;
    let leadTimeCount = 0;
    
    // 5. Group Size Distribution
    const groupSizeData: Record<number, number> = {};

    reservations.forEach(res => {
      const resDate = new Date(res.date);
      const createdDate = res.id.includes('-') ? new Date() : new Date(); // Mocking created date if not available in DB row yet, but assuming we can derive from created_at in real scenarios
      // For this demo, we'll use a fixed created_at if available or assume 1 day lead time
      const leadTime = Math.max(0, Math.floor((resDate.getTime() - resDate.getTime()) / (1000 * 60 * 60 * 24))); // Simplified as we don't have created_at in the mapped interface yet
      
      // Weekly (last 8 weeks)
      if (resDate.getFullYear() === currentYear) {
        const week = getWeekNumber(resDate);
        if (!weeklyData[week]) weeklyData[week] = { week, count: 0, guests: 0 };
        weeklyData[week].count++;
        weeklyData[week].guests += res.pax;
      }

      // Monthly
      const monthIdx = resDate.getMonth();
      if (!monthlyData[monthIdx]) {
        monthlyData[monthIdx] = { 
          month: resDate.toLocaleString(language, { month: 'short' }), 
          count: 0, 
          guests: 0 
        };
      }
      monthlyData[monthIdx].count++;
      monthlyData[monthIdx].guests += res.pax;

      // Hour
      const hour = parseInt(res.time.split(':')[0]);
      hourData[hour] = (hourData[hour] || 0) + 1;

      // Guest stats
      const key = res.guestName.toLowerCase().trim();
      if (!guestStats[key]) guestStats[key] = { name: res.guestName, visits: 0, totalPax: 0 };
      guestStats[key].visits++;
      guestStats[key].totalPax += res.pax;

      // Group size
      const pax = res.pax;
      groupSizeData[pax] = (groupSizeData[pax] || 0) + 1;
    });

    const weeklyChart = Object.values(weeklyData).sort((a, b) => a.week - b.week).slice(-8);
    const monthlyChart = Object.values(monthlyData);
    const hourChart = Object.entries(hourData).map(([hour, count]) => ({ hour: `${hour}:00`, count })).sort((a, b) => parseInt(a.hour) - parseInt(b.hour));
    const topGuestsChart = Object.values(guestStats).sort((a, b) => b.visits - a.visits).slice(0, 5);
    const groupSizeChart = Object.entries(groupSizeData).map(([size, value]) => ({ name: `${size} Pax`, value }));

    // Calculate return rate
    const multipleVisits = Object.values(guestStats).filter(g => g.visits > 1).length;
    const totalGuests = Object.keys(guestStats).length;
    const returnRate = totalGuests > 0 ? (multipleVisits / totalGuests) * 100 : 0;

    return {
      weeklyChart,
      monthlyChart,
      hourChart,
      topGuestsChart,
      groupSizeChart,
      returnRate,
      totalReservations: reservations.length,
      totalGuests: reservations.reduce((sum, r) => sum + r.pax, 0)
    };
  }, [reservations, loading, language]);

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[400px]">
        <div className="w-12 h-12 border-4 border-[var(--color-accent)] border-t-transparent rounded-full animate-spin"></div>
        <p className="text-gray-500 font-medium mt-4">{t.loading}</p>
      </div>
    );
  }

  if (!stats) {
    return (
      <div className="glass-pane p-8 rounded-2xl text-center">
        <p className="text-gray-500">{t.stats.noData}</p>
        <button onClick={onBack} className="mt-4 text-[var(--color-primary)] font-bold flex items-center gap-2 mx-auto">
          <ArrowLeft size={18} /> {t.stats.backToBook}
        </button>
      </div>
    );
  }

  return (
    <div className="space-y-6 md:space-y-8 animate-fade-in-up">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl sm:text-3xl font-bold text-gray-900">{t.statistics}</h2>
          <p className="text-gray-500">{t.stats.overview}</p>
        </div>
        <button 
          onClick={onBack}
          className="flex items-center gap-2 px-4 py-2 bg-white/80 border border-gray-200 rounded-lg hover:bg-white transition-all shadow-sm font-medium text-gray-700"
        >
          <ArrowLeft size={18} />
          {t.stats.backToBook}
        </button>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="glass-pane p-6 rounded-2xl border-l-4 border-[var(--color-primary)]">
          <div className="flex items-center gap-3 mb-2">
            <CalendarIcon className="text-[var(--color-accent)]" size={20} />
            <span className="text-sm font-bold text-gray-500 uppercase tracking-wider">{t.stats.reservations}</span>
          </div>
          <p className="text-3xl font-bold text-gray-900">{stats.totalReservations}</p>
        </div>
        <div className="glass-pane p-6 rounded-2xl border-l-4 border-[var(--color-accent)]">
          <div className="flex items-center gap-3 mb-2">
            <Users className="text-[var(--color-accent)]" size={20} />
            <span className="text-sm font-bold text-gray-500 uppercase tracking-wider">{t.stats.guests}</span>
          </div>
          <p className="text-3xl font-bold text-gray-900">{stats.totalGuests}</p>
        </div>
        <div className="glass-pane p-6 rounded-2xl border-l-4 border-emerald-500">
          <div className="flex items-center gap-3 mb-2">
            <TrendingUp className="text-emerald-500" size={20} />
            <span className="text-sm font-bold text-gray-500 uppercase tracking-wider">{t.stats.returnRate}</span>
          </div>
          <p className="text-3xl font-bold text-gray-900">{stats.returnRate.toFixed(1)}%</p>
        </div>
        <div className="glass-pane p-6 rounded-2xl border-l-4 border-amber-500">
          <div className="flex items-center gap-3 mb-2">
            <Sparkles className="text-amber-500" size={20} />
            <span className="text-sm font-bold text-gray-500 uppercase tracking-wider">{t.stats.topGuests}</span>
          </div>
          <p className="text-3xl font-bold text-gray-900">{stats.topGuestsChart.length}</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 md:gap-8">
        {/* Weekly Trend */}
        <div className="glass-pane p-6 rounded-2xl min-h-[350px] flex flex-col">
          <h3 className="text-lg font-bold text-gray-800 mb-6 flex items-center gap-2">
            <TrendingUp size={20} className="text-[var(--color-accent)]" />
            {t.stats.weeklyTrends}
          </h3>
          <div className="flex-1 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={stats.weeklyChart}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#eee" />
                <XAxis dataKey="week" label={{ value: 'Week', position: 'insideBottom', offset: -5 }} />
                <YAxis />
                <Tooltip 
                  contentStyle={{ backgroundColor: 'rgba(255, 255, 255, 0.9)', borderRadius: '12px', border: 'none', boxShadow: '0 4px 12px rgba(0,0,0,0.1)' }}
                />
                <Bar dataKey="count" name={t.stats.reservations} fill="var(--color-accent)" radius={[4, 4, 0, 0]} />
                <Bar dataKey="guests" name={t.stats.guests} fill="var(--color-primary)" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Popular Times */}
        <div className="glass-pane p-6 rounded-2xl min-h-[350px] flex flex-col">
          <h3 className="text-lg font-bold text-gray-800 mb-6 flex items-center gap-2">
            <Clock size={20} className="text-[var(--color-accent)]" />
            {t.stats.popularTimes}
          </h3>
          <div className="flex-1 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={stats.hourChart}>
                <defs>
                  <linearGradient id="colorCount" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="var(--color-accent)" stopOpacity={0.3}/>
                    <stop offset="95%" stopColor="var(--color-accent)" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#eee" />
                <XAxis dataKey="hour" />
                <YAxis />
                <Tooltip 
                   contentStyle={{ backgroundColor: 'rgba(255, 255, 255, 0.9)', borderRadius: '12px', border: 'none', boxShadow: '0 4px 12px rgba(0,0,0,0.1)' }}
                />
                <Area type="monotone" dataKey="count" name={t.stats.reservations} stroke="var(--color-accent)" strokeWidth={3} fillOpacity={1} fill="url(#colorCount)" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Group Size Distribution */}
        <div className="glass-pane p-6 rounded-2xl min-h-[350px] flex flex-col">
          <h3 className="text-lg font-bold text-gray-800 mb-6 flex items-center gap-2">
            <Users size={20} className="text-[var(--color-accent)]" />
            {t.stats.groupSizeDist}
          </h3>
          <div className="flex-1 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <RePieChart>
                <Pie
                  data={stats.groupSizeChart}
                  cx="50%"
                  cy="50%"
                  innerRadius={60}
                  outerRadius={100}
                  paddingAngle={5}
                  dataKey="value"
                  label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                >
                  {stats.groupSizeChart.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip 
                   contentStyle={{ backgroundColor: 'rgba(255, 255, 255, 0.9)', borderRadius: '12px', border: 'none', boxShadow: '0 4px 12px rgba(0,0,0,0.1)' }}
                />
              </RePieChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Top Guests */}
        <div className="glass-pane p-6 rounded-2xl min-h-[350px] flex flex-col">
          <h3 className="text-lg font-bold text-gray-800 mb-6 flex items-center gap-2">
            <Sparkles size={20} className="text-[var(--color-accent)]" />
            {t.stats.topGuests}
          </h3>
          <div className="space-y-4 flex-1">
            {stats.topGuestsChart.map((guest, idx) => (
              <div key={idx} className="flex items-center justify-between p-3 bg-black/5 rounded-xl border border-white/20">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full btn-gradient flex items-center justify-center font-bold text-sm">
                    {guest.name.charAt(0).toUpperCase()}
                  </div>
                  <div>
                    <p className="font-bold text-gray-800">{guest.name}</p>
                    <p className="text-xs text-gray-500">{guest.totalPax} {t.stats.guests} total</p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="font-bold text-[var(--color-primary)]">{guest.visits}</p>
                  <p className="text-[10px] uppercase tracking-wider text-gray-400 font-bold">{t.stats.visits}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default StatisticsView;
