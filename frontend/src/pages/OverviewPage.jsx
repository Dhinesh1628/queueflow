import React, { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Users,
  Layers,
  UserCheck,
  CheckCircle2,
  XCircle,
  Plus,
  RefreshCw,
  ArrowRight,
  Clock,
  Sparkles,
  Flame,
} from 'lucide-react';
import { queueService } from '../services/queueService';
import { analyticsService } from '../services/analyticsService';
import { tokenService } from '../services/tokenService';
import { useToast } from '../hooks/useToast';
import StatCard from '../components/common/StatCard';
import QueueCard from '../components/queues/QueueCard';
import CreateQueueModal from '../components/queues/CreateQueueModal';
import EditQueueModal from '../components/queues/EditQueueModal';
import CreateTokenModal from '../components/tokens/CreateTokenModal';
import ConfirmDialog from '../components/common/ConfirmDialog';
import LoadingSpinner from '../components/common/LoadingSpinner';
import { formatDateTime, formatTimeAgo, getStatusBadgeStyle } from '../utils/formatters';

const OverviewPage = () => {
  const [queues, setQueues] = useState([]);
  const [analytics, setAnalytics] = useState(null);
  const [recentTokens, setRecentTokens] = useState([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  // Modals
  const [createQueueOpen, setCreateQueueOpen] = useState(false);
  const [createTokenOpen, setCreateTokenOpen] = useState(false);
  const [editQueue, setEditQueue] = useState(null);
  const [deleteQueueData, setDeleteQueueData] = useState(null);
  const [deleteLoading, setDeleteLoading] = useState(false);

  const toast = useToast();
  const navigate = useNavigate();

  const loadDashboardData = useCallback(async (isSilent = false) => {
    if (!isSilent) setLoading(true);
    else setRefreshing(true);

    try {
      const [queuesRes, analyticsRes, tokensRes] = await Promise.all([
        queueService.getQueues(),
        analyticsService.getAnalytics('today'),
        tokenService.getTokens({ limit: 8 }),
      ]);

      if (queuesRes.success) setQueues(queuesRes.data);
      if (analyticsRes.success) setAnalytics(analyticsRes.data);
      if (tokensRes.success) setRecentTokens(tokensRes.data);
    } catch (err) {
      toast.error('Failed to load dashboard data');
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }, [toast]);

  useEffect(() => {
    loadDashboardData();
  }, [loadDashboardData]);

  const handleDeleteConfirm = async () => {
    if (!deleteQueueData) return;
    try {
      setDeleteLoading(true);
      const res = await queueService.deleteQueue(deleteQueueData._id);
      if (res.success) {
        toast.success(res.message);
        setDeleteQueueData(null);
        loadDashboardData(true);
      }
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to delete queue');
    } finally {
      setDeleteLoading(false);
    }
  };

  const kpis = analytics?.kpis || {};

  if (loading) {
    return <LoadingSpinner size="lg" text="Loading QueueFlow Operations..." />;
  }

  return (
    <div className="space-y-8">
      {/* Top Banner & Quick Action Buttons */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-2">
        <div>
          <h2 className="text-xl sm:text-2xl font-extrabold text-white tracking-tight">
            Queue Operations Control
          </h2>
          <p className="text-xs sm:text-sm text-slate-400 mt-0.5">
            Real-time multi-counter tracking and live token dispatching
          </p>
        </div>

        <div className="flex items-center gap-2.5 flex-wrap">
          <button
            onClick={() => loadDashboardData(true)}
            disabled={refreshing}
            className="flex items-center gap-2 px-3.5 py-2 rounded-xl bg-slate-900 border border-slate-800 text-xs font-semibold text-slate-300 hover:text-white hover:bg-slate-800 transition-colors cursor-pointer"
          >
            <RefreshCw className={`w-3.5 h-3.5 ${refreshing ? 'animate-spin' : ''}`} />
            <span>Refresh</span>
          </button>

          <button
            onClick={() => setCreateTokenOpen(true)}
            disabled={queues.length === 0}
            className="flex items-center gap-2 px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700/80 border border-slate-700 text-xs font-semibold text-white shadow-sm transition-all cursor-pointer disabled:opacity-40"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>Add Person</span>
          </button>

          <button
            onClick={() => setCreateQueueOpen(true)}
            className="flex items-center gap-2 px-4 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-xs font-semibold text-white shadow-lg shadow-indigo-600/30 transition-all cursor-pointer"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>Create Queue</span>
          </button>
        </div>
      </div>

      {/* KPI Stat Cards Grid */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3.5 sm:gap-4">
        <StatCard
          title="Total Queues"
          value={kpis.totalQueues ?? queues.length}
          subtext="Active departments"
          icon={Layers}
          color="indigo"
        />
        <StatCard
          title="Total Tokens"
          value={kpis.totalTokens ?? 0}
          subtext="Processed all-time"
          icon={Users}
          color="sky"
        />
        <StatCard
          title="Waiting Now"
          value={kpis.currentlyWaiting ?? 0}
          subtext="In queue lines"
          icon={Clock}
          color="amber"
        />
        <StatCard
          title="Serving Now"
          value={kpis.currentlyServing ?? 0}
          subtext="At active counters"
          icon={UserCheck}
          color="sky"
        />
        <StatCard
          title="Completed Today"
          value={kpis.completedToday ?? 0}
          subtext="Resolved tickets"
          icon={CheckCircle2}
          color="emerald"
        />
        <StatCard
          title="Cancelled Today"
          value={kpis.cancelledToday ?? 0}
          subtext="Withdrawn tickets"
          icon={XCircle}
          color="rose"
        />
      </div>

      {/* Active Queues Section */}
      <div>
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <Layers className="w-5 h-5 text-indigo-400" />
            <h3 className="text-base sm:text-lg font-bold text-white tracking-tight">
              Live Counter Queues
            </h3>
            <span className="px-2 py-0.5 rounded-full text-xs font-semibold bg-indigo-500/10 text-indigo-300 border border-indigo-500/20">
              {queues.length} {queues.length === 1 ? 'Queue' : 'Queues'}
            </span>
          </div>

          {queues.length > 0 && (
            <button
              onClick={() => navigate('/queues')}
              className="text-xs font-semibold text-indigo-400 hover:text-indigo-300 flex items-center gap-1 group cursor-pointer"
            >
              <span>Manage all queues</span>
              <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-0.5 transition-transform" />
            </button>
          )}
        </div>

        {queues.length === 0 ? (
          <div className="bg-slate-900 border border-slate-800 rounded-3xl p-8 sm:p-12 text-center flex flex-col items-center justify-center">
            <div className="w-14 h-14 rounded-2xl bg-indigo-600/15 border border-indigo-500/30 flex items-center justify-center text-indigo-400 mb-4">
              <Layers className="w-7 h-7" />
            </div>
            <h4 className="text-lg font-bold text-white tracking-tight">
              No queues created yet
            </h4>
            <p className="text-xs sm:text-sm text-slate-400 max-w-md mt-1 mb-6 leading-relaxed">
              Create your first queue (e.g. Customer Support, Billing Counter, General
              Consultation) to start issuing tokens and organizing waiting lines.
            </p>
            <button
              onClick={() => setCreateQueueOpen(true)}
              className="flex items-center gap-2 px-5 py-2.5 bg-indigo-600 hover:bg-indigo-500 text-white font-semibold text-xs rounded-xl shadow-lg shadow-indigo-600/30 transition-all cursor-pointer"
            >
              <Plus className="w-4 h-4" />
              <span>Create Your First Queue</span>
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {queues.map((queue) => (
              <QueueCard
                key={queue._id}
                queue={queue}
                onEdit={(q) => setEditQueue(q)}
                onDelete={(q) => setDeleteQueueData(q)}
              />
            ))}
          </div>
        )}
      </div>

      {/* Recent Activity Section */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 sm:p-6 shadow-sm">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <Clock className="w-5 h-5 text-indigo-400" />
            <h3 className="text-base font-bold text-white tracking-tight">
              Recent Activity Feed
            </h3>
          </div>
          <button
            onClick={() => navigate('/history')}
            className="text-xs font-semibold text-indigo-400 hover:text-indigo-300 flex items-center gap-1 cursor-pointer"
          >
            <span>View Full Audit Log</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>

        {recentTokens.length === 0 ? (
          <p className="text-xs text-slate-500 text-center py-8">
            No token activity recorded yet.
          </p>
        ) : (
          <div className="divide-y divide-slate-800/80">
            {recentTokens.map((token) => {
              const badge = getStatusBadgeStyle(token.status);
              return (
                <div
                  key={token._id}
                  className="py-3 flex items-center justify-between gap-3 text-xs"
                >
                  <div className="flex items-center gap-3 min-w-0">
                    <span className="font-mono font-bold text-xs px-2 py-0.5 rounded bg-slate-950 text-indigo-300 border border-slate-800 shrink-0">
                      {token.tokenNumber}
                    </span>
                    <div className="min-w-0 truncate">
                      <p className="font-semibold text-white truncate">
                        {token.customerName}
                      </p>
                      <p className="text-[11px] text-slate-400 truncate">
                        {token.queueId?.name || 'Queue'}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center gap-4 shrink-0">
                    <span
                      className={`inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[11px] font-semibold ${badge.bg}`}
                    >
                      <span className={`w-1.5 h-1.5 rounded-full ${badge.dot}`} />
                      {badge.label}
                    </span>
                    <span className="text-[11px] text-slate-500 hidden sm:inline-block">
                      {formatTimeAgo(token.createdAt)}
                    </span>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* Modals */}
      <CreateQueueModal
        isOpen={createQueueOpen}
        onClose={() => setCreateQueueOpen(false)}
        onQueueCreated={() => loadDashboardData(true)}
      />

      <EditQueueModal
        isOpen={!!editQueue}
        onClose={() => setEditQueue(null)}
        queue={editQueue}
        onQueueUpdated={() => loadDashboardData(true)}
      />

      <CreateTokenModal
        isOpen={createTokenOpen}
        onClose={() => setCreateTokenOpen(false)}
        queues={queues}
        onTokenCreated={() => loadDashboardData(true)}
      />

      <ConfirmDialog
        isOpen={!!deleteQueueData}
        onClose={() => setDeleteQueueData(null)}
        onConfirm={handleDeleteConfirm}
        isLoading={deleteLoading}
        title={`Delete Queue "${deleteQueueData?.name}"?`}
        message="This action will permanently delete this queue and its entire token history. Are you sure you want to proceed?"
        confirmText="Delete Queue"
      />
    </div>
  );
};

export default OverviewPage;
