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
  const [analytics, setAnalytics] = useState(null);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const toast = useToast();

  const fetchAnalytics = useCallback(async (isSilent = false) => {
    if (!isSilent) setLoading(true);
    else setRefreshing(true);

    try {
      const res = await analyticsService.getAnalytics(timeframe);
      if (res.success) {
        setAnalytics(res.data);
      }
    } catch (err) {
      toast.error('Failed to load analytics data');
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }, [timeframe, toast]);

  useEffect(() => {
    fetchAnalytics();
  }, [fetchAnalytics]);

  const kpis = analytics?.kpis || {};
  const charts = analytics?.charts || {};

  const statusColors = {
    WAITING: '#06B6D4', // Electric Cyan
    SERVING: '#F59E0B', // Tach Amber
    COMPLETED: '#10B981', // Laser Emerald
    CANCELLED: '#EF4444', // Crimson
  };

  // Custom Tooltip for Recharts with Cockpit Glass support
  const CustomTooltip = ({ active, payload, label }) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-white dark:bg-[#080B11] border border-slate-200 dark:border-white/10 p-3 rounded-lg shadow-2xl text-xs space-y-1 font-mono">
          <p className="font-bold text-slate-800 dark:text-cyan-300">{label}</p>
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
            <BarChart3 className="w-5 h-5 text-cyan-500 dark:text-cyan-400" />
            <h2 className="text-xl sm:text-2xl font-bold text-slate-900 dark:text-white tracking-tight font-mono">
              TELEMETRY & OPERATIONAL ANALYTICS
            </h2>
          </div>
          <p className="text-xs sm:text-sm font-mono text-slate-500 dark:text-slate-400 mt-0.5">
            DATABASE METRICS DERIVED FROM ATOMIC TICKET CREATION & SERVICE DELTAS
          </p>
        </div>

        {/* Date Filter & Refresh */}
        <div className="flex items-center gap-2.5">
          <div className="inline-flex bg-slate-100 dark:bg-[#0D121F] border border-slate-200 dark:border-white/[0.08] rounded-lg p-1 text-xs font-mono uppercase">
            <button
              onClick={() => setTimeframe('today')}
              className={`px-3 py-1.5 rounded-md font-semibold transition-all cursor-pointer ${
                timeframe === 'today'
                  ? 'bg-cyan-500 text-slate-950 font-bold shadow-md shadow-cyan-500/20'
                  : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
              }`}
            >
              Today
            </button>
            <button
              onClick={() => setTimeframe('7d')}
              className={`px-3 py-1.5 rounded-md font-semibold transition-all cursor-pointer ${
                timeframe === '7d'
                  ? 'bg-cyan-500 text-slate-950 font-bold shadow-md shadow-cyan-500/20'
                  : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
              }`}
            >
              7 Days
            </button>
            <button
              onClick={() => setTimeframe('30d')}
              className={`px-3 py-1.5 rounded-md font-semibold transition-all cursor-pointer ${
                timeframe === '30d'
                  ? 'bg-cyan-500 text-slate-950 font-bold shadow-md shadow-cyan-500/20'
                  : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
              }`}
            >
              30 Days
            </button>
          </div>

          <button
            onClick={() => fetchAnalytics(true)}
            disabled={refreshing}
            className="p-2 rounded-lg bg-slate-100 dark:bg-[#0D121F] border border-slate-200 dark:border-white/[0.08] text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white hover:dark:border-cyan-500/30 transition-all cursor-pointer"
            title="Refresh Analytics"
          >
            <RefreshCw className={`w-4 h-4 text-cyan-400 ${refreshing ? 'animate-spin' : ''}`} />
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
          color="sky"
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
        <div className="bg-white dark:bg-[#0D121F] border border-slate-200 dark:border-white/[0.08] rounded-xl p-5 shadow-xs dark:shadow-md">
          <div className="mb-4">
            <h3 className="text-sm font-bold text-slate-900 dark:text-white tracking-tight font-mono">
              QUEUE LOAD & VOLUME TREND
            </h3>
            <p className="text-xs font-mono text-slate-500 dark:text-slate-400 mt-0.5">
              Daily tokens received versus resolved over selected timeframe
            </p>
          </div>

          <div className="h-64 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart
                data={charts.queueLengthTrend || []}
                margin={{ top: 10, right: 10, left: -20, bottom: 0 }}
              >
                <CartesianGrid strokeDasharray="3 3" stroke="#334155" strokeOpacity={0.2} />
                <XAxis dataKey="label" stroke="#64748B" fontSize={11} tickLine={false} />
                <YAxis stroke="#64748B" fontSize={11} tickLine={false} allowDecimals={false} />
                <Tooltip content={<CustomTooltip />} />
                <Legend
                  wrapperStyle={{ fontSize: '11px', paddingTop: '10px' }}
                  iconType="circle"
                />
                <Area
                  type="monotone"
                  dataKey="tokensReceived"
                  name="Tokens Issued"
                  stroke="#06B6D4"
                  strokeWidth={2}
                  fill="#06B6D4"
                  fillOpacity={0.15}
                />
                <Area
                  type="monotone"
                  dataKey="tokensCompleted"
                  name="Tokens Completed"
                  stroke="#10B981"
                  strokeWidth={2}
                  fill="#10B981"
                  fillOpacity={0.15}
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Chart 2: Token Status Distribution */}
        <div className="bg-white dark:bg-[#0D121F] border border-slate-200 dark:border-white/[0.08] rounded-xl p-5 shadow-xs dark:shadow-md">
          <div className="mb-4">
            <h3 className="text-sm font-bold text-slate-900 dark:text-white tracking-tight font-mono">
              TOKEN STATUS BREAKDOWN
            </h3>
            <p className="text-xs font-mono text-slate-500 dark:text-slate-400 mt-0.5">
              Current lifecycle distribution across all counter tickets
            </p>
          </div>

          <div className="h-64 w-full flex items-center justify-center">
            {charts.statusDistribution?.every((s) => s.value === 0) ? (
              <p className="text-xs font-mono text-slate-500">NO TOKEN ACTIVITY IN THIS TIMEFRAME.</p>
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
                        fill={statusColors[entry.key] || '#06B6D4'}
                        stroke="#080B11"
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
        <div className="bg-white dark:bg-[#0D121F] border border-slate-200 dark:border-white/[0.08] rounded-xl p-5 shadow-xs dark:shadow-md">
          <div className="mb-4">
            <h3 className="text-sm font-bold text-slate-900 dark:text-white tracking-tight font-mono">
              QUEUE THROUGHPUT COMPARISON
            </h3>
            <p className="text-xs font-mono text-slate-500 dark:text-slate-400 mt-0.5">
              Completed vs Waiting tokens across counters
            </p>
          </div>

          <div className="h-64 w-full">
            {charts.queuePerformance?.length === 0 ? (
              <div className="h-full flex items-center justify-center text-xs font-mono text-slate-500">
                NO QUEUES CONFIGURED YET.
              </div>
            ) : (
              <ResponsiveContainer width="100%" height="100%">
                <BarChart
                  data={charts.queuePerformance || []}
                  margin={{ top: 10, right: 10, left: -20, bottom: 0 }}
                >
                  <CartesianGrid strokeDasharray="3 3" stroke="#334155" strokeOpacity={0.2} />
                  <XAxis dataKey="name" stroke="#64748B" fontSize={11} tickLine={false} />
                  <YAxis stroke="#64748B" fontSize={11} tickLine={false} allowDecimals={false} />
                  <Tooltip content={<CustomTooltip />} />
                  <Legend
                    wrapperStyle={{ fontSize: '11px', paddingTop: '10px' }}
                    iconType="circle"
                  />
                  <Bar
                    dataKey="completed"
                    name="Completed"
                    fill="#10B981"
                    radius={[3, 3, 0, 0]}
                  />
                  <Bar
                    dataKey="waiting"
                    name="Waiting"
                    fill="#06B6D4"
                    radius={[3, 3, 0, 0]}
                  />
                </BarChart>
              </ResponsiveContainer>
            )}
          </div>
        </div>

        {/* Chart 4: Daily Activity Breakdown */}
        <div className="bg-white dark:bg-[#0D121F] border border-slate-200 dark:border-white/[0.08] rounded-xl p-5 shadow-xs dark:shadow-md">
          <div className="mb-4">
            <h3 className="text-sm font-bold text-slate-900 dark:text-white tracking-tight font-mono">
              DAILY OPERATIONAL VOLUME
            </h3>
            <p className="text-xs font-mono text-slate-500 dark:text-slate-400 mt-0.5">
              Created, Completed, and Cancelled ticket counts
            </p>
          </div>

          <div className="h-64 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart
                data={charts.dailyActivity || []}
                margin={{ top: 10, right: 10, left: -20, bottom: 0 }}
              >
                <CartesianGrid strokeDasharray="3 3" stroke="#334155" strokeOpacity={0.2} />
                <XAxis dataKey="label" stroke="#64748B" fontSize={11} tickLine={false} />
                <YAxis stroke="#64748B" fontSize={11} tickLine={false} allowDecimals={false} />
                <Tooltip content={<CustomTooltip />} />
                <Legend
                  wrapperStyle={{ fontSize: '11px', paddingTop: '10px' }}
                  iconType="circle"
                />
                <Bar
                  dataKey="created"
                  name="Created"
                  fill="#06B6D4"
                  radius={[3, 3, 0, 0]}
                />
                <Bar
                  dataKey="completed"
                  name="Completed"
                  fill="#10B981"
                  radius={[3, 3, 0, 0]}
                />
                <Bar
                  dataKey="cancelled"
                  name="Cancelled"
                  fill="#EF4444"
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
