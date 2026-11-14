import React, { useState, useEffect, useCallback } from 'react';
import {
  BarChart,
  Bar,
  AreaChart,
  Area,
  PieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from 'recharts';
import {
  BarChart3,
  Layers,
  Users,
  Clock,
  UserCheck,
  CheckCircle2,
  XCircle,
  RefreshCw,
  TrendingUp,
} from 'lucide-react';
import { analyticsService } from '../services/analyticsService';
import { useToast } from '../hooks/useToast';
import StatCard from '../components/common/StatCard';
import LoadingSpinner from '../components/common/LoadingSpinner';

const AnalyticsPage = () => {
  const [timeframe, setTimeframe] = useState('7d');
  const [analytics, setAnalytics] = useState(() => {
    try {
      const saved = sessionStorage.getItem('qf_cache_analytics_7d');
      return saved ? JSON.parse(saved) : null;
    } catch { return null; }
  });
  const [loading, setLoading] = useState(() => {
    try {
      return !sessionStorage.getItem('qf_cache_analytics_7d');
    } catch { return true; }
  });
  const [refreshing, setRefreshing] = useState(false);
  const toast = useToast();

  const fetchAnalytics = useCallback(async (isSilent = false) => {
    const hasData = !!analytics;
    if (!isSilent && !hasData) setLoading(true);
    else setRefreshing(true);

    try {
      const res = await analyticsService.getAnalytics(timeframe);
      if (res.success) {
        setAnalytics(res.data);
        try { sessionStorage.setItem(`qf_cache_analytics_${timeframe}`, JSON.stringify(res.data)); } catch {}
      }
    } catch (err) {
      if (!hasData) toast.error('Failed to load analytics data');
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }, [analytics, timeframe, toast]);

  useEffect(() => {
    fetchAnalytics();
  }, [fetchAnalytics]);

  const kpis = analytics?.kpis || {};
  const charts = analytics?.charts || {};

  const statusColors = {
    WAITING: '#8C532B', // Warm Caramel
    SERVING: '#B87A44', // Cognac Amber
    COMPLETED: '#2E7D32', // Forest Green
    CANCELLED: '#B71C1C', // Crimson Umber
  };

  // Custom Tooltip for Recharts with Warm Studio support
  const CustomTooltip = ({ active, payload, label }) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-white dark:bg-[#1C1815] border border-[#E6E0D4] dark:border-[#3E342C] p-3 rounded-lg shadow-md text-xs space-y-1 font-mono">
          <p className="font-bold text-[#26221F] dark:text-[#FAF8F5]">{label}</p>
          {payload.map((item, index) => (
            <p key={index} style={{ color: item.color }} className="font-medium">
              {item.name}: <span className="font-bold">{item.value}</span>
            </p>
          ))}
        </div>
      );
    }
    return null;
  };

  if (loading) {
    return <LoadingSpinner size="lg" text="Aggregating Performance Analytics..." />;
  }

  return (
    <div className="space-y-8" id="main-content">
      {/* Page Header and Timeframe Filter */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-2">
        <div>
          <div className="flex items-center gap-2">
            <BarChart3 className="w-5 h-5 text-[#8C532B] dark:text-[#C78753]" />
            <h2 className="text-xl sm:text-2xl font-bold text-[#26221F] dark:text-[#FAF8F5] tracking-tight">
              Analytics & Reports
            </h2>
          </div>
          <p className="text-xs sm:text-sm text-[#736A62] dark:text-[#A69B8F] mt-0.5">
            Real-time metrics on wait times, queue volumes, and service resolution.
          </p>
        </div>

        {/* Date Filter & Refresh */}
        <div className="flex items-center gap-2.5">
          <div className="inline-flex bg-[#F8F6F0] dark:bg-[#1A1613] border border-[#E6E0D4] dark:border-[#3E342C] rounded-xl p-1 text-xs">
            <button
              onClick={() => setTimeframe('today')}
              className={`px-3 py-1.5 rounded-lg font-medium transition-all duration-150 cursor-pointer ${
                timeframe === 'today'
                  ? 'bg-[#8C532B] text-white font-semibold shadow-xs'
                  : 'text-[#736A62] dark:text-[#A69B8F] hover:text-[#26221F] dark:hover:text-[#FAF8F5]'
              }`}
            >
              Today
            </button>
            <button
              onClick={() => setTimeframe('7d')}
              className={`px-3 py-1.5 rounded-lg font-medium transition-all duration-150 cursor-pointer ${
                timeframe === '7d'
                  ? 'bg-[#8C532B] text-white font-semibold shadow-xs'
                  : 'text-[#736A62] dark:text-[#A69B8F] hover:text-[#26221F] dark:hover:text-[#FAF8F5]'
              }`}
            >
              7 Days
            </button>
            <button
              onClick={() => setTimeframe('30d')}
              className={`px-3 py-1.5 rounded-lg font-medium transition-all duration-150 cursor-pointer ${
                timeframe === '30d'
                  ? 'bg-[#8C532B] text-white font-semibold shadow-xs'
                  : 'text-[#736A62] dark:text-[#A69B8F] hover:text-[#26221F] dark:hover:text-[#FAF8F5]'
              }`}
            >
              30 Days
            </button>
          </div>

          <button
            onClick={() => fetchAnalytics(true)}
            disabled={refreshing}
            className="p-2 rounded-xl bg-white dark:bg-[#26201B] border border-[#E6E0D4] dark:border-[#3E342C] text-[#736A62] dark:text-[#A69B8F] hover:text-[#26221F] dark:hover:text-[#FAF8F5] transition-all duration-150 cursor-pointer shadow-xs"
            title="Refresh Analytics"
          >
            <RefreshCw className={`w-4 h-4 text-[#8C532B] dark:text-[#C78753] ${refreshing ? 'animate-spin' : ''}`} />
          </button>
        </div>
      </div>

      {/* KPI Stat Cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-7 gap-3 sm:gap-4">
        <StatCard
          title="Total Queues"
          value={kpis.totalQueues ?? 0}
          icon={Layers}
          color="slate"
        />
        <StatCard
          title="Total Tokens"
          value={kpis.totalTokens ?? 0}
          icon={Users}
          color="sky"
        />
        <StatCard
          title="Waiting Now"
          value={kpis.currentlyWaiting ?? 0}
          icon={Clock}
          color="amber"
        />
        <StatCard
          title="Serving Now"
          value={kpis.currentlyServing ?? 0}
          icon={UserCheck}
          color="amber"
        />
        <StatCard
          title="Completed"
          value={kpis.completedToday ?? 0}
          icon={CheckCircle2}
          color="emerald"
        />
        <StatCard
          title="Cancelled"
          value={kpis.cancelledToday ?? 0}
          icon={XCircle}
          color="rose"
        />
        <StatCard
          title="Avg Wait"
          value={`${kpis.averageWaitMinutes ?? 0}m`}
          subtext="Actual time delta"
          icon={TrendingUp}
          color="slate"
        />
      </div>

      {/* Primary Charts Row 1 */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Chart 1: Queue Volume / Length Trend */}
        <div className="bg-white dark:bg-[#26201B] border border-[#E6E0D4] dark:border-[#3E342C] rounded-xl p-5 shadow-sm">
          <div className="mb-4">
            <h3 className="text-sm font-bold text-[#26221F] dark:text-[#FAF8F5] tracking-tight font-mono">
              QUEUE LOAD & VOLUME TREND
            </h3>
            <p className="text-xs font-mono text-[#736A62] dark:text-[#A69B8F] mt-0.5">
              Daily tokens received versus resolved over selected timeframe
            </p>
          </div>

          <div className="h-64 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart
                data={charts.queueLengthTrend || []}
                margin={{ top: 10, right: 10, left: -20, bottom: 0 }}
              >
                <CartesianGrid strokeDasharray="3 3" stroke="#D4CBBF" strokeOpacity={0.4} />
                <XAxis dataKey="label" stroke="#8C827A" fontSize={11} tickLine={false} />
                <YAxis stroke="#8C827A" fontSize={11} tickLine={false} allowDecimals={false} />
                <Tooltip content={<CustomTooltip />} />
                <Legend
                  wrapperStyle={{ fontSize: '11px', paddingTop: '10px' }}
                  iconType="circle"
                />
                <Area
                  type="monotone"
                  dataKey="tokensReceived"
                  name="Tokens Issued"
                  stroke="#8C532B"
                  strokeWidth={2}
                  fill="#8C532B"
                  fillOpacity={0.15}
                />
                <Area
                  type="monotone"
                  dataKey="tokensCompleted"
                  name="Tokens Completed"
                  stroke="#2E7D32"
                  strokeWidth={2}
                  fill="#2E7D32"
                  fillOpacity={0.15}
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Chart 2: Token Status Distribution */}
        <div className="bg-white dark:bg-[#26201B] border border-[#E6E0D4] dark:border-[#3E342C] rounded-xl p-5 shadow-sm">
          <div className="mb-4">
            <h3 className="text-sm font-bold text-[#26221F] dark:text-[#FAF8F5] tracking-tight font-mono">
              TOKEN STATUS BREAKDOWN
            </h3>
            <p className="text-xs font-mono text-[#736A62] dark:text-[#A69B8F] mt-0.5">
              Current lifecycle distribution across all counter tickets
            </p>
          </div>

          <div className="h-64 w-full flex items-center justify-center">
            {charts.statusDistribution?.every((s) => s.value === 0) ? (
              <p className="text-xs font-mono text-[#8C827A]">NO TOKEN ACTIVITY IN THIS TIMEFRAME.</p>
            ) : (
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={charts.statusDistribution || []}
                    cx="50%"
                    cy="50%"
                    innerRadius={60}
                    outerRadius={85}
                    paddingAngle={3}
                    dataKey="value"
                  >
                    {charts.statusDistribution?.map((entry, index) => (
                      <Cell
                        key={`cell-${index}`}
                        fill={statusColors[entry.key] || '#8C532B'}
                        stroke="#FAF8F5"
                        strokeWidth={2}
                      />
                    ))}
                  </Pie>
                  <Tooltip content={<CustomTooltip />} />
                  <Legend
                    wrapperStyle={{ fontSize: '11px', paddingTop: '10px' }}
                    iconType="circle"
                  />
                </PieChart>
              </ResponsiveContainer>
            )}
          </div>
        </div>
      </div>

      {/* Row 2: Queue Throughput & Daily Activity */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Chart 3: Queue Performance Comparison */}
        <div className="bg-white dark:bg-[#26201B] border border-[#E6E0D4] dark:border-[#3E342C] rounded-xl p-5 shadow-sm">
          <div className="mb-4">
            <h3 className="text-sm font-bold text-[#26221F] dark:text-[#FAF8F5] tracking-tight font-mono">
              QUEUE THROUGHPUT COMPARISON
            </h3>
            <p className="text-xs font-mono text-[#736A62] dark:text-[#A69B8F] mt-0.5">
              Completed vs Waiting tokens across counters
            </p>
          </div>

          <div className="h-64 w-full">
            {charts.queuePerformance?.length === 0 ? (
              <div className="h-full flex items-center justify-center text-xs font-mono text-[#8C827A]">
                NO QUEUES CONFIGURED YET.
              </div>
            ) : (
              <ResponsiveContainer width="100%" height="100%">
                <BarChart
                  data={charts.queuePerformance || []}
                  margin={{ top: 10, right: 10, left: -20, bottom: 0 }}
                >
                  <CartesianGrid strokeDasharray="3 3" stroke="#D4CBBF" strokeOpacity={0.4} />
                  <XAxis dataKey="name" stroke="#8C827A" fontSize={11} tickLine={false} />
                  <YAxis stroke="#8C827A" fontSize={11} tickLine={false} allowDecimals={false} />
                  <Tooltip content={<CustomTooltip />} />
                  <Legend
                    wrapperStyle={{ fontSize: '11px', paddingTop: '10px' }}
                    iconType="circle"
                  />
                  <Bar
                    dataKey="completed"
                    name="Completed"
                    fill="#2E7D32"
                    radius={[3, 3, 0, 0]}
                  />
                  <Bar
                    dataKey="waiting"
                    name="Waiting"
                    fill="#8C532B"
                    radius={[3, 3, 0, 0]}
                  />
                </BarChart>
              </ResponsiveContainer>
            )}
          </div>
        </div>

        {/* Chart 4: Daily Activity Breakdown */}
        <div className="bg-white dark:bg-[#26201B] border border-[#E6E0D4] dark:border-[#3E342C] rounded-xl p-5 shadow-sm">
          <div className="mb-4">
            <h3 className="text-sm font-bold text-[#26221F] dark:text-[#FAF8F5] tracking-tight font-mono">
              DAILY OPERATIONAL VOLUME
            </h3>
            <p className="text-xs font-mono text-[#736A62] dark:text-[#A69B8F] mt-0.5">
              Created, Completed, and Cancelled ticket counts
            </p>
          </div>

          <div className="h-64 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart
                data={charts.dailyActivity || []}
                margin={{ top: 10, right: 10, left: -20, bottom: 0 }}
              >
                <CartesianGrid strokeDasharray="3 3" stroke="#D4CBBF" strokeOpacity={0.4} />
                <XAxis dataKey="label" stroke="#8C827A" fontSize={11} tickLine={false} />
                <YAxis stroke="#8C827A" fontSize={11} tickLine={false} allowDecimals={false} />
                <Tooltip content={<CustomTooltip />} />
                <Legend
                  wrapperStyle={{ fontSize: '11px', paddingTop: '10px' }}
                  iconType="circle"
                />
                <Bar
                  dataKey="created"
                  name="Created"
                  fill="#8C532B"
                  radius={[3, 3, 0, 0]}
                />
                <Bar
                  dataKey="completed"
                  name="Completed"
                  fill="#2E7D32"
                  radius={[3, 3, 0, 0]}
                />
                <Bar
                  dataKey="cancelled"
                  name="Cancelled"
                  fill="#B71C1C"
                  radius={[3, 3, 0, 0]}
                />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AnalyticsPage;
