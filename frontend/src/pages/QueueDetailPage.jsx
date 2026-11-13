import React, { useState, useEffect, useCallback } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import {
  ArrowLeft,
  Plus,
  RefreshCw,
  Sparkles,
  Edit2,
  Trash2,
  Users,
  Clock,
  UserCheck,
  CheckCircle2,
  XCircle,
} from 'lucide-react';
import { queueService } from '../services/queueService';
import { tokenService } from '../services/tokenService';
import { useToast } from '../hooks/useToast';
import ServingBanner from '../components/tokens/ServingBanner';
import TokenTable from '../components/tokens/TokenTable';
import CreateTokenModal from '../components/tokens/CreateTokenModal';
import EditQueueModal from '../components/queues/EditQueueModal';
import ConfirmDialog from '../components/common/ConfirmDialog';
import LoadingSpinner from '../components/common/LoadingSpinner';
import StatCard from '../components/common/StatCard';
import { formatDateTime } from '../utils/formatters';

const QueueDetailPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const toast = useToast();

  const [queue, setQueue] = useState(null);
  const [waitingTokens, setWaitingTokens] = useState([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  // Operation loading states
  const [isCallingNext, setIsCallingNext] = useState(false);
  const [isCompleting, setIsCompleting] = useState(false);
  const [movingTokenId, setMovingTokenId] = useState(null);

  // Modals
  const [createTokenOpen, setCreateTokenOpen] = useState(false);
  const [editQueueOpen, setEditQueueOpen] = useState(false);
  const [cancelTokenData, setCancelTokenData] = useState(null);
  const [cancelLoading, setCancelLoading] = useState(false);
  const [deleteQueueOpen, setDeleteQueueOpen] = useState(false);
  const [deleteLoading, setDeleteLoading] = useState(false);

  // Load queue details and waiting tokens
  const loadQueueData = useCallback(async (isSilent = false) => {
    if (!isSilent) setLoading(true);
    else setRefreshing(true);

    try {
      const [queueRes, tokensRes] = await Promise.all([
        queueService.getQueueById(id),
        tokenService.getTokens({ queueId: id, status: 'WAITING', limit: 100 }),
      ]);

      if (queueRes.success) {
        setQueue(queueRes.data);
      }
      if (tokensRes.success) {
        setWaitingTokens(tokensRes.data);
      }
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to load queue details');
      if (err.response?.status === 404) {
        navigate('/queues');
      }
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }, [id, navigate, toast]);

  useEffect(() => {
    loadQueueData();
    // Auto-refresh interval every 10 seconds for real-time sync
    const timer = setInterval(() => loadQueueData(true), 10000);
    return () => clearInterval(timer);
  }, [loadQueueData]);

  // Handle CALL NEXT
  const handleCallNext = async () => {
    try {
      setIsCallingNext(true);
      const res = await tokenService.callNext(id);
      if (res.success) {
        toast.success(res.message);
        loadQueueData(true);
      }
    } catch (err) {
      toast.error(err.response?.data?.message || 'Could not call next customer');
    } finally {
      setIsCallingNext(false);
    }
  };

  // Handle COMPLETE SERVICE
  const handleCompleteService = async (tokenId) => {
    try {
      setIsCompleting(true);
      const res = await tokenService.completeService(id, tokenId);
      if (res.success) {
        toast.success(res.message);
        loadQueueData(true);
      }
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to complete service');
    } finally {
      setIsCompleting(false);
    }
  };

  // Handle Move Token UP
  const handleMoveUp = async (token) => {
    try {
      setMovingTokenId(token._id);
      const res = await tokenService.moveTokenPosition(token._id, 'up');
      if (res.success) {
        toast.success(`Token ${token.tokenNumber} moved up in queue`);
        loadQueueData(true);
      }
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to move token');
    } finally {
      setMovingTokenId(null);
    }
  };

  // Handle Move Token DOWN
  const handleMoveDown = async (token) => {
    try {
      setMovingTokenId(token._id);
      const res = await tokenService.moveTokenPosition(token._id, 'down');
      if (res.success) {
        toast.success(`Token ${token.tokenNumber} moved down in queue`);
        loadQueueData(true);
      }
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to move token');
    } finally {
      setMovingTokenId(null);
    }
  };

  // Handle Cancel Token Confirm
  const handleCancelConfirm = async () => {
    if (!cancelTokenData) return;
    try {
      setCancelLoading(true);
      const res = await tokenService.cancelToken(cancelTokenData._id);
      if (res.success) {
        toast.success(res.message);
        setCancelTokenData(null);
        loadQueueData(true);
      }
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to cancel token');
    } finally {
      setCancelLoading(false);
    }
  };

  // Handle Delete Queue
  const handleDeleteQueue = async () => {
    try {
      setDeleteLoading(true);
      const res = await queueService.deleteQueue(id);
      if (res.success) {
        toast.success(res.message);
        navigate('/queues');
      }
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to delete queue');
    } finally {
      setDeleteLoading(false);
    }
  };

  if (loading || !queue) {
    return <LoadingSpinner size="lg" text="Loading Queue Operations Console..." />;
  }

  const stats = queue.stats || {};
  const currentlyServing = stats.currentlyServingToken;

  return (
    <div className="space-y-6">
      {/* Top Header Bar */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-2">
        <div className="flex items-center gap-3">
          <button
            onClick={() => navigate('/queues')}
            className="p-2 rounded-xl bg-slate-900 border border-slate-800 text-slate-400 hover:text-white hover:bg-slate-800 transition-colors cursor-pointer"
          >
            <ArrowLeft className="w-5 h-5" />
          </button>
          <div>
            <div className="flex items-center gap-2">
              <span className="font-mono text-xs font-bold px-2 py-0.5 rounded-md bg-indigo-500/15 text-indigo-300 border border-indigo-500/30">
                {queue.prefix}
              </span>
              <h2 className="text-xl sm:text-2xl font-extrabold text-white tracking-tight">
                {queue.name}
              </h2>
            </div>
            {queue.description && (
              <p className="text-xs text-slate-400 mt-1">{queue.description}</p>
            )}
          </div>
        </div>

        {/* Action Controls */}
        <div className="flex items-center gap-2.5 flex-wrap">
          <button
            onClick={() => loadQueueData(true)}
            disabled={refreshing}
            className="flex items-center gap-2 px-3 py-2 rounded-xl bg-slate-900 border border-slate-800 text-xs font-semibold text-slate-300 hover:text-white transition-colors cursor-pointer"
          >
            <RefreshCw className={`w-3.5 h-3.5 ${refreshing ? 'animate-spin' : ''}`} />
            <span>Sync</span>
          </button>

          <button
            onClick={() => setEditQueueOpen(true)}
            className="flex items-center gap-1.5 px-3 py-2 rounded-xl bg-slate-900 border border-slate-800 text-xs font-semibold text-slate-300 hover:text-white transition-colors cursor-pointer"
          >
            <Edit2 className="w-3.5 h-3.5" />
            <span>Edit</span>
          </button>

          <button
            onClick={() => setDeleteQueueOpen(true)}
            className="p-2 rounded-xl bg-slate-900 border border-slate-800 text-slate-400 hover:text-rose-400 hover:bg-rose-500/10 transition-colors cursor-pointer"
            title="Delete Queue"
          >
            <Trash2 className="w-4 h-4" />
          </button>

          <button
            onClick={() => setCreateTokenOpen(true)}
            className="flex items-center gap-2 px-4 py-2 bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-semibold rounded-xl shadow-lg shadow-indigo-600/30 transition-all cursor-pointer"
          >
            <Plus className="w-4 h-4" />
            <span>Add Person</span>
          </button>
        </div>
      </div>

      {/* Hero Serving Banner */}
      <ServingBanner
        servingToken={currentlyServing}
        waitingCount={waitingTokens.length}
        onCallNext={handleCallNext}
        onCompleteService={handleCompleteService}
        isCallingNext={isCallingNext}
        isCompleting={isCompleting}
      />

      {/* Queue Stat Metrics */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3 sm:gap-4">
        <StatCard
          title="Waiting Tokens"
          value={stats.waitingCount ?? waitingTokens.length}
          subtext="Active in waiting line"
          icon={Clock}
          color="indigo"
        />
        <StatCard
          title="Currently Serving"
          value={stats.servingCount ?? (currentlyServing ? 1 : 0)}
          subtext="At service desk"
          icon={UserCheck}
          color="sky"
        />
        <StatCard
          title="Completed"
          value={stats.completedCount ?? 0}
          subtext="Served today"
          icon={CheckCircle2}
          color="emerald"
        />
        <StatCard
          title="Cancelled"
          value={stats.cancelledCount ?? 0}
          subtext="Withdrawn tokens"
          icon={XCircle}
          color="rose"
        />
      </div>

      {/* Active Waiting List Table */}
      <div>
        <TokenTable
          tokens={waitingTokens}
          onMoveUp={handleMoveUp}
          onMoveDown={handleMoveDown}
          onCancel={(token) => setCancelTokenData(token)}
          movingTokenId={movingTokenId}
          onAddPerson={() => setCreateTokenOpen(true)}
          emptyMessage="No customers are currently waiting in this queue. Click 'Add Person' to issue a new token."
        />
      </div>

      {/* Modals & Dialogs */}
      <CreateTokenModal
        isOpen={createTokenOpen}
        onClose={() => setCreateTokenOpen(false)}
        queueId={queue._id}
        onTokenCreated={() => loadQueueData(true)}
      />

      <EditQueueModal
        isOpen={editQueueOpen}
        onClose={() => setEditQueueOpen(false)}
        queue={queue}
        onQueueUpdated={() => loadQueueData(true)}
      />

      <ConfirmDialog
        isOpen={!!cancelTokenData}
        onClose={() => setCancelTokenData(null)}
        onConfirm={handleCancelConfirm}
        isLoading={cancelLoading}
        title={`Cancel Token ${cancelTokenData?.tokenNumber}?`}
        message={`Are you sure you want to cancel the token for ${cancelTokenData?.customerName}? This will preserve historical records and automatically recalculate positions for all waiting customers.`}
        confirmText="Cancel Token"
      />

      <ConfirmDialog
        isOpen={deleteQueueOpen}
        onClose={() => setDeleteQueueOpen(false)}
        onConfirm={handleDeleteQueue}
        isLoading={deleteLoading}
        title={`Delete Queue "${queue.name}"?`}
        message="Are you sure you want to delete this queue? All waiting, serving, completed, and cancelled tokens associated with this queue will also be permanently deleted."
        confirmText="Delete Queue"
      />
    </div>
  );
};

export default QueueDetailPage;
