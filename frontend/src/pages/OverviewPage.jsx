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
import FAQSection from '../components/common/FAQSection';
import { formatTimeAgo, getStatusBadgeStyle } from '../utils/formatters';

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
        tokenService.getTokens({ limit: 6 }),
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

  // Operational Keyboard Hotkeys: Alt+A (Dispatch Ticket), Alt+Q (Create Queue), Alt+R (Sync)
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (['INPUT', 'TEXTAREA', 'SELECT'].includes(document.activeElement?.tagName)) {
        return;
      }

      const key = e.key.toLowerCase();
      if (e.altKey && key === 'a') {
        e.preventDefault();
        if (queues.length > 0) setCreateTokenOpen(true);
      } else if (e.altKey && key === 'q') {
        e.preventDefault();
        setCreateQueueOpen(true);
      } else if (e.altKey && key === 'r') {
        e.preventDefault();
        loadDashboardData(true);
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [queues, loadDashboardData]);

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
    return <LoadingSpinner size="lg" text="Loading Queue Operations Console..." />;
  }

  return (
    <div className="space-y-8" id="main-content">
      {/* Top Banner & Quick Action Buttons */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-2">
        <div>
          <h2 className="text-xl sm:text-2xl font-bold text-[#26221F] dark:text-[#FAF8F5] tracking-tight flex items-center gap-2">
            <span>Queue Dashboard</span>
            <span className="w-2 h-2 rounded-full bg-[#2E7D32] hidden sm:inline-block" title="System online" />
          </h2>
          <p className="text-xs sm:text-sm text-[#736A62] dark:text-[#A69B8F] mt-1">
            Monitor active counters, customer tokens, and waiting times.
          </p>
        </div>

        <div className="flex items-center gap-2.5 flex-wrap">
          <button
            onClick={() => loadDashboardData(true)}
            disabled={refreshing}
            className="flex items-center gap-1.5 px-3.5 py-2 rounded-lg bg-white dark:bg-[#26201B] border border-[#E6E0D4] dark:border-[#3E342C] hover:border-[#8C532B]/40 text-xs font-medium text-[#594F45] dark:text-[#FAF8F5] shadow-xs transition-all cursor-pointer"
            title="Refresh dashboard data"
          >
            <RefreshCw className={`w-3.5 h-3.5 text-[#8C532B] dark:text-[#C78753] ${refreshing ? 'animate-spin' : ''}`} />
            <span>Refresh</span>
          </button>

          <button
            onClick={() => setCreateTokenOpen(true)}
            disabled={queues.length === 0}
            className="flex items-center gap-1.5 px-4 py-2 rounded-lg bg-white hover:bg-[#F8F6F0] dark:bg-[#26201B] dark:hover:bg-[#322A24] border border-[#E6E0D4] dark:border-[#3E342C] hover:border-[#8C532B]/40 text-xs font-semibold text-[#8C532B] dark:text-[#C78753] shadow-xs transition-all cursor-pointer disabled:opacity-40"
            title="Issue new customer token"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>Add Token</span>
          </button>

          <button
            onClick={() => setCreateQueueOpen(true)}
            className="flex items-center gap-1.5 px-4 py-2 rounded-lg bg-[#8C532B] hover:bg-[#774421] text-xs font-semibold text-white shadow-xs transition-all cursor-pointer"
            title="Create a new counter queue"
          >
            <Plus className="w-4 h-4 stroke-[2.5]" />
            <span>Create Queue</span>
          </button>
        </div>
      </div>

      {/* KPI Stat Cards Grid */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3.5 sm:gap-4">
        <StatCard
          title="Total Queues"
          value={kpis.totalQueues ?? queues.length}
          subtext="Configured counters"
          icon={Layers}
          color="slate"
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
          color="emerald"
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
            <Layers className="w-5 h-5 text-[#8C532B] dark:text-[#C78753]" />
            <h3 className="text-base sm:text-lg font-bold text-[#26221F] dark:text-[#FAF8F5] tracking-tight">
              Active Queues
            </h3>
            <span className="px-2 py-0.5 rounded-full text-xs font-semibold bg-[#8C532B]/10 text-[#8C532B] dark:text-[#C78753]">
              {queues.length}
            </span>
          </div>

          {queues.length > 0 && (
            <button
              onClick={() => navigate('/queues')}
              className="text-xs font-semibold text-[#8C532B] dark:text-[#C78753] hover:text-[#774421] flex items-center gap-1 cursor-pointer transition-colors"
            >
              <span>View all queues</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          )}
        </div>

        {queues.length === 0 ? (
          <div className="bg-white dark:bg-[#26201B] border border-[#E6E0D4] dark:border-[#3E342C] rounded-xl p-8 sm:p-12 text-center flex flex-col items-center justify-center shadow-sm">
            <div className="w-12 h-12 rounded-xl bg-[#F8F6F0] dark:bg-[#1A1613] border border-[#E6E0D4] dark:border-[#3E342C] flex items-center justify-center text-[#8C532B] mb-4">
              <Layers className="w-6 h-6" />
            </div>
            <h4 className="text-lg font-bold text-[#26221F] dark:text-[#FAF8F5] tracking-tight">
              No counter queues configured
            </h4>
            <p className="text-xs sm:text-sm text-[#736A62] dark:text-[#A69B8F] max-w-md mt-1 mb-6 leading-relaxed">
              Create your first queue counter to start generating atomic tokens and managing waiting lines.
            </p>
            <button
              onClick={() => setCreateQueueOpen(true)}
              className="flex items-center gap-2 px-5 py-2.5 bg-[#8C532B] hover:bg-[#774421] text-white font-mono font-bold text-xs uppercase tracking-wider rounded-lg shadow-sm transition-all cursor-pointer"
            >
              <Plus className="w-4 h-4 stroke-[2.5]" />
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
      <div className="bg-white dark:bg-[#26201B] border border-[#E6E0D4] dark:border-[#3E342C] rounded-xl p-5 sm:p-6 shadow-sm">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <Clock className="w-5 h-5 text-[#8C532B] dark:text-[#C78753]" />
            <h3 className="text-base font-bold text-[#26221F] dark:text-[#FAF8F5] tracking-tight">
              Recent Activity
            </h3>
          </div>
          <button
            onClick={() => navigate('/history')}
            className="text-xs font-semibold text-[#8C532B] dark:text-[#C78753] hover:text-[#774421] flex items-center gap-1 cursor-pointer transition-colors"
          >
            <span>View all history</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>

        {recentTokens.length === 0 ? (
          <p className="text-xs text-[#8C827A] text-center py-8">
            No recent activity recorded yet.
          </p>
        ) : (
          <div className="divide-y divide-[#E6E0D4] dark:divide-[#3E342C]">
            {recentTokens.map((token) => {
              const badge = getStatusBadgeStyle(token.status);
              return (
                <div
                  key={token._id}
                  className="py-3 flex items-center justify-between gap-3 text-xs"
                >
                  <div className="flex items-center gap-3 min-w-0">
                    <span className="font-mono font-bold text-xs px-2 py-0.5 rounded bg-[#F8F6F0] dark:bg-[#1A1613] text-[#8C532B] dark:text-[#C78753] border border-[#E6E0D4] dark:border-[#3E342C] shrink-0">
                      {token.tokenNumber}
                    </span>
                    <div className="min-w-0 truncate">
                      <p className="font-semibold text-[#26221F] dark:text-[#FAF8F5] truncate">
                        {token.customerName}
                      </p>
                      <p className="text-[11px] font-mono text-[#736A62] dark:text-[#A69B8F] truncate">
                        {token.queueId?.name || 'Counter'}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center gap-4 shrink-0">
                    <span
                      className={`inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded text-[11px] font-mono font-medium ${badge.bg}`}
                    >
                      <span className={`w-1.5 h-1.5 rounded-full ${badge.dot}`} />
                      {badge.label}
                    </span>
                    <span className="text-[11px] font-mono text-[#8C827A] dark:text-[#7A6F66] hidden sm:inline-block">
                      {formatTimeAgo(token.createdAt)}
                    </span>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* Expandable Operational FAQ Section */}
      <FAQSection />

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
