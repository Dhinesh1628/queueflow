import React, { useState, useEffect, useCallback } from 'react';
import { Link } from 'react-router-dom';
import { Layers, Plus, Search, RefreshCw } from 'lucide-react';
import { queueService } from '../services/queueService';
import { useToast } from '../hooks/useToast';
import QueueCard from '../components/queues/QueueCard';
import CreateQueueModal from '../components/queues/CreateQueueModal';
import EditQueueModal from '../components/queues/EditQueueModal';
import ConfirmDialog from '../components/common/ConfirmDialog';
import LoadingSpinner from '../components/common/LoadingSpinner';

const QueuesPage = () => {
  const [queues, setQueues] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  // Modals
  const [createQueueOpen, setCreateQueueOpen] = useState(false);
  const [editQueue, setEditQueue] = useState(null);
  const [deleteQueueData, setDeleteQueueData] = useState(null);
  const [deleteLoading, setDeleteLoading] = useState(false);

  const toast = useToast();

  const fetchQueues = useCallback(async (isSilent = false) => {
    if (!isSilent) setLoading(true);
    else setRefreshing(true);

    try {
      const res = await queueService.getQueues();
      if (res.success) {
        setQueues(res.data);
      }
    } catch (err) {
      toast.error('Failed to load queues');
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }, [toast]);

  useEffect(() => {
    fetchQueues();
  }, [fetchQueues]);

  const handleDeleteConfirm = async () => {
    if (!deleteQueueData) return;
    try {
      setDeleteLoading(true);
      const res = await queueService.deleteQueue(deleteQueueData._id);
      if (res.success) {
        toast.success(res.message);
        setDeleteQueueData(null);
        fetchQueues(true);
      }
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to delete queue');
    } finally {
      setDeleteLoading(false);
    }
  };

  const filteredQueues = queues.filter((q) => {
    if (!searchTerm.trim()) return true;
    const term = searchTerm.toLowerCase();
    return (
      q.name.toLowerCase().includes(term) ||
      q.prefix.toLowerCase().includes(term) ||
      (q.description && q.description.toLowerCase().includes(term))
    );
  });

  if (loading) {
    return <LoadingSpinner size="lg" text="Loading Queues..." />;
  }

  return (
    <div className="space-y-6" id="main-content">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <nav aria-label="Breadcrumb" className="text-[11px] font-mono uppercase tracking-wider text-[#8C827A] dark:text-[#C78753] mb-1">
            <Link to="/" className="hover:text-[#8C532B] transition-colors">DASHBOARD</Link>
            <span className="mx-1.5 text-[#D4CBBF] dark:text-[#4A3E35]">/</span>
            <span className="text-[#26221F] dark:text-[#FAF8F5] font-bold">COUNTER_QUEUES</span>
          </nav>
          <h2 className="text-xl sm:text-2xl font-bold text-[#26221F] dark:text-[#FAF8F5] tracking-tight font-mono">
            COUNTER QUEUE FLEET
          </h2>
          <p className="text-xs sm:text-sm font-mono text-[#736A62] dark:text-[#A69B8F] mt-0.5">
            COUNTER CONFIGURATION, WAITING LIST TELEMETRY & TICKET CAPACITY
          </p>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={() => fetchQueues(true)}
            disabled={refreshing}
            className="flex items-center gap-2 px-3.5 py-2 rounded-lg bg-white dark:bg-[#26201B] border border-[#E6E0D4] dark:border-[#3E342C] hover:border-[#8C532B]/40 text-xs font-mono uppercase text-[#594F45] dark:text-[#FAF8F5] shadow-xs transition-all cursor-pointer"
          >
            <RefreshCw className={`w-3.5 h-3.5 text-[#8C532B] dark:text-[#C78753] ${refreshing ? 'animate-spin' : ''}`} />
            <span>SYNC</span>
          </button>

          <button
            onClick={() => setCreateQueueOpen(true)}
            className="flex items-center gap-2 px-4 py-2 bg-[#8C532B] hover:bg-[#774421] text-white text-xs font-mono font-bold uppercase tracking-wider rounded-lg shadow-sm transition-all cursor-pointer"
          >
            <Plus className="w-4 h-4 stroke-[2.5]" />
            <span>CREATE QUEUE</span>
          </button>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="bg-white dark:bg-[#26201B] border border-[#E6E0D4] dark:border-[#3E342C] rounded-xl p-3 sm:p-4 flex items-center justify-between gap-3 shadow-sm">
        <div className="relative flex-1 max-w-md">
          <Search className="w-4 h-4 text-[#8C827A] absolute left-3.5 top-2.5" />
          <input
            type="text"
            placeholder="Search queues by name or prefix..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full bg-[#F8F6F0] dark:bg-[#1A1613] border border-[#E6E0D4] dark:border-[#3E342C] rounded-lg pl-10 pr-3.5 py-1.5 text-xs text-[#26221F] dark:text-[#FAF8F5] placeholder-[#8C827A] focus:outline-none focus:border-[#8C532B] font-mono transition-all"
          />
        </div>

        <span className="text-xs font-mono uppercase text-[#8C827A] dark:text-[#C78753] shrink-0">
          TELEMETRY: {filteredQueues.length} / {queues.length} {queues.length === 1 ? 'CONSOLE' : 'CONSOLES'}
        </span>
      </div>

      {/* Grid of Queues */}
      {filteredQueues.length === 0 ? (
        <div className="bg-white dark:bg-[#26201B] border border-[#E6E0D4] dark:border-[#3E342C] rounded-xl p-12 text-center flex flex-col items-center justify-center shadow-sm">
          <Layers className="w-12 h-12 text-[#8C532B] mb-3" />
          <h4 className="text-base font-bold text-[#26221F] dark:text-[#FAF8F5] font-mono">NO COUNTER CONSOLES LOCATED</h4>
          <p className="text-xs font-mono text-[#736A62] dark:text-[#A69B8F] max-w-sm mt-1 mb-4 leading-relaxed">
            {searchTerm
              ? `No queues match query "${searchTerm}".`
              : 'You have not initialized any counter consoles yet.'}
          </p>
          {!searchTerm && (
            <button
              onClick={() => setCreateQueueOpen(true)}
              className="flex items-center gap-2 px-4 py-2 bg-[#8C532B] hover:bg-[#774421] text-white text-xs font-mono font-bold uppercase tracking-wider rounded-lg shadow-sm transition-all cursor-pointer"
            >
              <Plus className="w-4 h-4 stroke-[2.5]" />
              <span>Create Queue</span>
            </button>
          )}
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {filteredQueues.map((queue) => (
            <QueueCard
              key={queue._id}
              queue={queue}
              onEdit={(q) => setEditQueue(q)}
              onDelete={(q) => setDeleteQueueData(q)}
            />
          ))}
        </div>
      )}

      {/* Modals */}
      <CreateQueueModal
        isOpen={createQueueOpen}
        onClose={() => setCreateQueueOpen(false)}
        onQueueCreated={() => fetchQueues(true)}
      />

      <EditQueueModal
        isOpen={!!editQueue}
        onClose={() => setEditQueue(null)}
        queue={editQueue}
        onQueueUpdated={() => fetchQueues(true)}
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

export default QueuesPage;
