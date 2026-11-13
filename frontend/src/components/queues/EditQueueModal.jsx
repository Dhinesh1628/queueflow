import React, { useState, useEffect } from 'react';
import Modal from '../common/Modal';
import { queueService } from '../../services/queueService';
import { useToast } from '../../hooks/useToast';
import { Check } from 'lucide-react';

const EditQueueModal = ({ isOpen, onClose, queue, onQueueUpdated }) => {
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [prefix, setPrefix] = useState('');
  const [loading, setLoading] = useState(false);
  const toast = useToast();

  useEffect(() => {
    if (queue) {
      setName(queue.name || '');
      setDescription(queue.description || '');
      setPrefix(queue.prefix || 'QF');
    }
  }, [queue]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!name.trim()) {
      toast.error('Queue name is required');
      return;
    }

    try {
      setLoading(true);
      const res = await queueService.updateQueue(queue._id, {
        name: name.trim(),
        description: description.trim(),
        prefix: prefix.trim().toUpperCase(),
      });

      if (res.success) {
        toast.success(`Queue "${name.trim()}" updated successfully!`);
        onClose();
        if (onQueueUpdated) onQueueUpdated(res.data);
      }
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to update queue');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="Edit Counter Queue"
      subtitle="Modify queue details and configuration"
      maxWidth="max-w-md"
    >
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-[11px] font-mono uppercase tracking-wider text-slate-700 dark:text-cyan-400/80 mb-1.5">
            Queue Name *
          </label>
          <input
            type="text"
            required
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="w-full bg-slate-50 dark:bg-[#080B11] border border-slate-200 dark:border-white/10 rounded-lg px-3.5 py-2.5 text-sm text-slate-900 dark:text-white focus:outline-none focus:border-cyan-500 focus:ring-1 focus:ring-cyan-500/30 transition-all placeholder:text-slate-500"
          />
        </div>

        <div className="grid grid-cols-3 gap-3">
          <div className="col-span-1">
            <label className="block text-[11px] font-mono uppercase tracking-wider text-slate-700 dark:text-cyan-400/80 mb-1.5">
              Prefix
            </label>
            <input
              type="text"
              maxLength={5}
              value={prefix}
              onChange={(e) => setPrefix(e.target.value.toUpperCase())}
              className="w-full uppercase font-mono bg-slate-50 dark:bg-[#080B11] border border-slate-200 dark:border-white/10 rounded-lg px-3.5 py-2.5 text-sm text-slate-900 dark:text-cyan-300 focus:outline-none focus:border-cyan-500 focus:ring-1 focus:ring-cyan-500/30 transition-all"
            />
          </div>

          <div className="col-span-2">
            <label className="block text-[11px] font-mono uppercase tracking-wider text-slate-700 dark:text-cyan-400/80 mb-1.5">
              Description
            </label>
            <input
              type="text"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="w-full bg-slate-50 dark:bg-[#080B11] border border-slate-200 dark:border-white/10 rounded-lg px-3.5 py-2.5 text-sm text-slate-900 dark:text-white focus:outline-none focus:border-cyan-500 focus:ring-1 focus:ring-cyan-500/30 transition-all placeholder:text-slate-500"
            />
          </div>
        </div>

        <div className="flex items-center justify-end gap-3 pt-4 border-t border-slate-100 dark:border-white/[0.08]">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 text-xs font-mono uppercase text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white bg-slate-100 dark:bg-white/[0.04] border border-transparent dark:border-white/[0.06] hover:bg-slate-200 dark:hover:bg-white/[0.08] rounded-lg transition-colors cursor-pointer"
          >
            Cancel
          </button>
          <button
            type="submit"
            disabled={loading}
            className="flex items-center gap-2 px-4 py-2 bg-cyan-500 hover:bg-cyan-400 text-slate-950 text-xs font-mono font-bold tracking-wide rounded-lg shadow-md shadow-cyan-500/20 disabled:opacity-50 transition-all cursor-pointer"
          >
            <Check className="w-4 h-4" />
            <span>{loading ? 'SAVING...' : 'SAVE CHANGES'}</span>
          </button>
        </div>
      </form>
    </Modal>
  );
};

export default EditQueueModal;
