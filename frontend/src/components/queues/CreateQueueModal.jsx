import React, { useState } from 'react';
import Modal from '../common/Modal';
import { queueService } from '../../services/queueService';
import { useToast } from '../../hooks/useToast';
import { Layers, Plus, Hash } from 'lucide-react';

const CreateQueueModal = ({ isOpen, onClose, onQueueCreated }) => {
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [prefix, setPrefix] = useState('QF');
  const [loading, setLoading] = useState(false);
  const toast = useToast();

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!name.trim()) {
      toast.error('Queue name is required');
      return;
    }

    try {
      setLoading(true);
      const res = await queueService.createQueue({
        name: name.trim(),
        description: description.trim(),
        prefix: (prefix || 'QF').trim().toUpperCase(),
      });

      if (res.success) {
        toast.success(`Queue "${name.trim()}" created successfully!`);
        setName('');
        setDescription('');
        setPrefix('QF');
        onClose();
        if (onQueueCreated) onQueueCreated(res.data);
      }
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to create queue');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="Create New Queue"
      subtitle="Define a new department or service queue"
      maxWidth="max-w-md"
    >
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-1.5">
            Queue Name *
          </label>
          <div className="relative">
            <input
              type="text"
              required
              placeholder="e.g. Customer Support, Billing Desk..."
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3.5 py-2.5 text-sm text-white placeholder-slate-500 focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 transition-colors"
            />
          </div>
        </div>

        <div className="grid grid-cols-3 gap-3">
          <div className="col-span-1">
            <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-1.5">
              Prefix
            </label>
            <div className="relative">
              <input
                type="text"
                maxLength={5}
                placeholder="QF"
                value={prefix}
                onChange={(e) => setPrefix(e.target.value.toUpperCase())}
                className="w-full uppercase font-mono bg-slate-950 border border-slate-800 rounded-xl px-3.5 py-2.5 text-sm text-white placeholder-slate-500 focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 transition-colors"
              />
            </div>
            <span className="text-[10px] text-slate-500 mt-1 block">e.g. CS-001</span>
          </div>

          <div className="col-span-2">
            <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-1.5">
              Description (Optional)
            </label>
            <input
              type="text"
              placeholder="Purpose of this service counter"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3.5 py-2.5 text-sm text-white placeholder-slate-500 focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 transition-colors"
            />
          </div>
        </div>

        <div className="flex items-center justify-end gap-3 pt-4 border-t border-slate-800">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 text-xs font-medium text-slate-400 hover:text-white bg-slate-800/80 hover:bg-slate-800 rounded-xl transition-colors"
          >
            Cancel
          </button>
          <button
            type="submit"
            disabled={loading}
            className="flex items-center gap-2 px-5 py-2 bg-indigo-600 hover:bg-indigo-500 disabled:opacity-50 text-white text-xs font-semibold rounded-xl shadow-lg shadow-indigo-600/30 transition-all cursor-pointer"
          >
            <Plus className="w-4 h-4" />
            {loading ? 'Creating...' : 'Create Queue'}
          </button>
        </div>
      </form>
    </Modal>
  );
};

export default CreateQueueModal;
