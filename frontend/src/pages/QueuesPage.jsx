import React, { useState, useEffect, useCallback } from 'react';
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
    <div className="space-y-6">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl sm:text-2xl font-extrabold text-white tracking-tight">
            Queue Management
          </h2>
          <p className="text-xs sm:text-sm text-slate-400 mt-0.5">
            Configure counters, monitor line lengths, and assign service operators
          </p>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={() => fetchQueues(true)}
            disabled={refreshing}
            className="flex items-center gap-2 px-3 py-2 rounded-xl bg-slate-900 border border-slate-800 text-xs font-semibold text-slate-300 hover:text-white transition-colors cursor-pointer"
          >
            <RefreshCw className={`w-3.5 h-3.5 ${refreshing ? 'animate-spin' : ''}`} />
            <span>Refresh</span>
          </button>

          <button
            onClick={() => setCreateQueueOpen(true)}
            className="flex items-center gap-2 px-4 py-2 bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-semibold rounded-xl shadow-lg shadow-indigo-600/30 transition-all cursor-pointer"
          >
            <Plus className="w-4 h-4" />
            <span>Create Queue</span>
          </button>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="bg-slate-900/60 border border-slate-800 rounded-2xl p-3 sm:p-4 flex items-center justify-between gap-3">
        <div className="relative flex-1 max-w-md">
          <Search className="w-4 h-4 text-slate-500 absolute left-3.5 top-2.5" />
          <input
            type="text"
            placeholder="Search queues by name or prefix..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full bg-slate-950 border border-slate-800 rounded-xl pl-10 pr-3.5 py-1.5 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 transition-colors"
          />
        </div>

        <span className="text-xs font-medium text-slate-400 shrink-0">
          Showing {filteredQueues.length} of {queues.length} {queues.length === 1 ? 'queue' : 'queues'}
        </span>
      </div>

      {/* Grid of Queues */}
      {filteredQueues.length === 0 ? (
        <div className="bg-slate-900 border border-slate-800 rounded-3xl p-12 text-center flex flex-col items-center justify-center">
          <Layers className="w-12 h-12 text-slate-600 mb-3" />
          <h4 className="text-base font-bold text-white">No queues found</h4>
          <p className="text-xs text-slate-400 max-w-sm mt-1 mb-4 leading-relaxed">
            {searchTerm
              ? `No queues match your query "${searchTerm}".`
              : 'You have not created any service queues yet.'}
          </p>
          {!searchTerm && (
            <button
              onClick={() => setCreateQueueOpen(true)}
              className="flex items-center gap-2 px-4 py-2 bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-semibold rounded-xl shadow-lg transition-all cursor-pointer"
            >
              <Plus className="w-4 h-4" />
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
