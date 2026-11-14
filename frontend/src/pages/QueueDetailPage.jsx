import React, { useState, useEffect, useCallback } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import {
  ArrowLeft,
  Plus,
  RefreshCw,
  Edit2,
  Trash2,
  Clock,
  UserCheck,
  CheckCircle2,
  XCircle,
  Copy,
  Check,
  Printer,
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

const QueueDetailPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const toast = useToast();

  const [queue, setQueue] = useState(null);
  const [waitingTokens, setWaitingTokens] = useState([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [copiedLink, setCopiedLink] = useState(false);

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
    const timer = setInterval(() => loadQueueData(true), 10000);
    return () => clearInterval(timer);
  }, [loadQueueData]);

  // Operational Keyboard Hotkeys: Alt+N (Call Next), Alt+C (Complete Service), Alt+A (Add Person)
  useEffect(() => {
    const handleKeyDown = (e) => {
      // Ignore if user is currently typing in an input or textarea
      if (['INPUT', 'TEXTAREA', 'SELECT'].includes(document.activeElement?.tagName)) {
        return;
      }

      const key = e.key.toLowerCase();
      if (e.altKey && key === 'n') {
        e.preventDefault();
        if (!isCallingNext && waitingTokens.length > 0) {
          handleCallNext();
        }
      } else if (e.altKey && key === 'c') {
        e.preventDefault();
        if (!isCompleting && queue?.stats?.currentlyServingToken?._id) {
          handleCompleteService(queue.stats.currentlyServingToken._id);
        }
      } else if (e.altKey && key === 'a') {
        e.preventDefault();
        setCreateTokenOpen(true);
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isCallingNext, isCompleting, waitingTokens, queue]);

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

  const handleMoveUp = async (token) => {
    try {
      setMovingTokenId(token._id);
      const res = await tokenService.moveTokenPosition(token._id, 'up');
      if (res.success) {
        toast.success(`Token ${token.tokenNumber} moved up`);
        loadQueueData(true);
      }
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to move token');
    } finally {
      setMovingTokenId(null);
    }
  };

  const handleMoveDown = async (token) => {
    try {
      setMovingTokenId(token._id);
      const res = await tokenService.moveTokenPosition(token._id, 'down');
      if (res.success) {
        toast.success(`Token ${token.tokenNumber} moved down`);
        loadQueueData(true);
      }
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to move token');
    } finally {
      setMovingTokenId(null);
    }
  };

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

  const handleCopyLink = () => {
    navigator.clipboard.writeText(window.location.href);
    setCopiedLink(true);
    setTimeout(() => setCopiedLink(false), 2000);
  };

  if (loading || !queue) {
    return <LoadingSpinner size="lg" text="Loading Queue Operations Console..." />;
  }

  const stats = queue.stats || {};
  const currentlyServing = stats.currentlyServingToken;

  return (
    <div className="space-y-6" id="main-content">
      {/* Breadcrumb Navigation */}
      <nav aria-label="Breadcrumb" className="text-xs text-[#8C827A] dark:text-[#C78753] flex items-center gap-1.5 font-medium">
        <Link to="/" className="hover:text-[#8C532B] transition-colors">Dashboard</Link>
        <span className="text-[#D4CBBF] dark:text-[#4A3E35]">/</span>
        <Link to="/queues" className="hover:text-[#8C532B] transition-colors">Queues</Link>
        <span className="text-[#D4CBBF] dark:text-[#4A3E35]">/</span>
        <span className="text-[#26221F] dark:text-[#FAF8F5] font-semibold">{queue.name}</span>
      </nav>

      {/* Top Header Bar */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-2">
        <div className="flex items-center gap-3">
          <button
            onClick={() => navigate('/queues')}
            className="p-2 rounded-lg bg-white dark:bg-[#26201B] border border-[#E6E0D4] dark:border-[#3E342C] text-[#736A62] dark:text-[#A69B8F] hover:text-[#26221F] dark:hover:text-[#FAF8F5] hover:bg-[#F8F6F0] dark:hover:bg-[#322A24] shadow-xs transition-all cursor-pointer"
            title="Return to Queues list"
          >
            <ArrowLeft className="w-5 h-5" />
          </button>
          <div>
            <div className="flex items-center gap-2">
              <span className="text-xs font-semibold px-2 py-0.5 rounded bg-[#8C532B]/10 text-[#8C532B] dark:text-[#C78753] border border-[#8C532B]/20">
                {queue.prefix}
              </span>
              <h2 className="text-xl sm:text-2xl font-bold text-[#26221F] dark:text-[#FAF8F5] tracking-tight">
                {queue.name}
              </h2>
            </div>
            {queue.description && (
              <p className="text-xs text-[#736A62] dark:text-[#A69B8F] mt-1">{queue.description}</p>
            )}
          </div>
        </div>

        {/* Action Controls */}
        <div className="flex items-center gap-2 flex-wrap">
          <button
            onClick={handleCopyLink}
            className="flex items-center gap-1.5 px-3 py-2 rounded-lg bg-white dark:bg-[#26201B] border border-[#E6E0D4] dark:border-[#3E342C] hover:border-[#8C532B]/40 text-xs font-medium text-[#594F45] dark:text-[#FAF8F5] shadow-xs transition-all cursor-pointer"
            title="Copy queue URL"
          >
            {copiedLink ? <Check className="w-3.5 h-3.5 text-[#2E7D32]" /> : <Copy className="w-3.5 h-3.5 text-[#8C532B] dark:text-[#C78753]" />}
            <span>{copiedLink ? 'Copied' : 'Share'}</span>
          </button>

          <button
            onClick={() => window.print()}
            className="flex items-center gap-1.5 px-3 py-2 rounded-lg bg-white dark:bg-[#26201B] border border-[#E6E0D4] dark:border-[#3E342C] hover:border-[#8C532B]/40 text-xs font-medium text-[#594F45] dark:text-[#FAF8F5] shadow-xs transition-all cursor-pointer"
            title="Print queue list"
          >
            <Printer className="w-3.5 h-3.5 text-[#8C532B] dark:text-[#C78753]" />
            <span>Print</span>
          </button>

          <button
            onClick={() => loadQueueData(true)}
            disabled={refreshing}
            className="flex items-center gap-1.5 px-3 py-2 rounded-lg bg-white dark:bg-[#26201B] border border-[#E6E0D4] dark:border-[#3E342C] hover:border-[#8C532B]/40 text-xs font-medium text-[#594F45] dark:text-[#FAF8F5] shadow-xs transition-all cursor-pointer"
          >
            <RefreshCw className={`w-3.5 h-3.5 text-[#8C532B] dark:text-[#C78753] ${refreshing ? 'animate-spin' : ''}`} />
            <span>Refresh</span>
          </button>

          <button
            onClick={() => setEditQueueOpen(true)}
            className="flex items-center gap-1.5 px-3 py-2 rounded-lg bg-white dark:bg-[#26201B] border border-[#E6E0D4] dark:border-[#3E342C] hover:border-[#8C532B]/40 text-xs font-medium text-[#594F45] dark:text-[#FAF8F5] shadow-xs transition-all cursor-pointer"
          >
            <Edit2 className="w-3.5 h-3.5 text-[#8C532B] dark:text-[#C78753]" />
            <span>Edit</span>
          </button>

          <button
            onClick={() => setDeleteQueueOpen(true)}
            className="p-2 rounded-lg bg-white dark:bg-[#26201B] border border-[#E6E0D4] dark:border-[#3E342C] hover:border-[#B71C1C]/40 text-[#736A62] hover:text-[#B71C1C] hover:bg-[#B71C1C]/10 shadow-xs transition-all cursor-pointer"
            title="Delete Queue"
          >
            <Trash2 className="w-4 h-4" />
          </button>

          <button
            onClick={() => setCreateTokenOpen(true)}
            className="flex items-center gap-1.5 px-4 py-2 bg-[#8C532B] hover:bg-[#774421] text-white text-xs font-semibold rounded-lg shadow-xs transition-all cursor-pointer"
            title="Add a new customer token"
          >
            <Plus className="w-4 h-4 stroke-[2.5]" />
            <span>Add Token</span>
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
          title="Waiting Line"
          value={stats.waitingCount ?? waitingTokens.length}
          subtext="Active waiting line"
          icon={Clock}
          color="sky"
        />
        <StatCard
          title="Currently Serving"
          value={stats.servingCount ?? (currentlyServing ? 1 : 0)}
          subtext="At service desk"
          icon={UserCheck}
          color="amber"
        />
        <StatCard
          title="Completed"
          value={stats.completedCount ?? 0}
          subtext="Resolved tickets"
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
          emptyMessage="No customers are currently waiting in this line. Click 'Add Person' to issue a new token."
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
        title={`Cancel Ticket ${cancelTokenData?.tokenNumber}?`}
        message={`Are you sure you want to cancel the ticket for ${cancelTokenData?.customerName}? This will preserve historical audit logs and automatically re-index positions for all remaining waiting customers.`}
        confirmText="Cancel Ticket"
      />

      <ConfirmDialog
        isOpen={deleteQueueOpen}
        onClose={() => setDeleteQueueOpen(false)}
        onConfirm={handleDeleteQueue}
        isLoading={deleteLoading}
        title={`Delete Queue "${queue.name}"?`}
        message="Are you sure you want to delete this queue? All waiting, serving, completed, and cancelled tickets associated with this queue will also be permanently deleted."
        confirmText="Delete Queue"
      />
    </div>
  );
};

export default QueueDetailPage;
