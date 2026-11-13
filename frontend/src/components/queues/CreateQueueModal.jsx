import React, { useState } from 'react';
import Modal from '../common/Modal';
import { queueService } from '../../services/queueService';
import { useToast } from '../../hooks/useToast';
import { Plus } from 'lucide-react';

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
      title="Create New Counter Queue"
      subtitle="Define a service desk or department counter"
      maxWidth="max-w-md"
    >
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-xs font-mono font-semibold text-[#26221F] dark:text-[#FAF8F5] uppercase tracking-wider mb-1.5">
            Queue Name *
          </label>
          <input
            type="text"
            required
            placeholder="e.g. Customer Support, Billing Counter..."
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="w-full bg-[#F8F6F0] dark:bg-[#1C1815] border border-[#E6E0D4] dark:border-[#3E342C] rounded-xl px-3.5 py-2.5 text-sm text-[#26221F] dark:text-[#FAF8F5] placeholder-[#A69B8F] focus:outline-none focus:border-[#8C532B] focus:ring-1 focus:ring-[#8C532B]/30 transition-colors"
          />
        </div>

        <div className="grid grid-cols-3 gap-3">
          <div className="col-span-1">
            <label className="block text-xs font-mono font-semibold text-[#26221F] dark:text-[#FAF8F5] uppercase tracking-wider mb-1.5">
              Prefix
            </label>
            <input
              type="text"
              maxLength={5}
              placeholder="QF"
              value={prefix}
              onChange={(e) => setPrefix(e.target.value.toUpperCase())}
              className="w-full uppercase font-mono bg-[#F8F6F0] dark:bg-[#1C1815] border border-[#E6E0D4] dark:border-[#3E342C] rounded-xl px-3.5 py-2.5 text-sm text-[#26221F] dark:text-[#FAF8F5] placeholder-[#A69B8F] focus:outline-none focus:border-[#8C532B] focus:ring-1 focus:ring-[#8C532B]/30 transition-colors"
            />
            <span className="text-[10px] text-[#736A62] dark:text-[#A69B8F] font-mono mt-1 block">e.g. CS-001</span>
          </div>

          <div className="col-span-2">
            <label className="block text-xs font-mono font-semibold text-[#26221F] dark:text-[#FAF8F5] uppercase tracking-wider mb-1.5">
              Description (Optional)
            </label>
            <input
              type="text"
              placeholder="Counter purpose or location"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="w-full bg-[#F8F6F0] dark:bg-[#1C1815] border border-[#E6E0D4] dark:border-[#3E342C] rounded-xl px-3.5 py-2.5 text-sm text-[#26221F] dark:text-[#FAF8F5] placeholder-[#A69B8F] focus:outline-none focus:border-[#8C532B] focus:ring-1 focus:ring-[#8C532B]/30 transition-colors font-mono"
            />
          </div>
        </div>

        <div className="flex items-center justify-end gap-3 pt-4 border-t border-[#E6E0D4] dark:border-[#3E342C]">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 text-xs font-mono font-medium text-[#736A62] dark:text-[#A69B8F] hover:text-[#26221F] dark:hover:text-white bg-[#F2ECE1] dark:bg-[#322A23] border border-[#E6E0D4] dark:border-[#3E342C] hover:bg-[#E6E0D4] dark:hover:bg-[#3E342C] rounded-xl transition-colors cursor-pointer"
          >
            Cancel
          </button>
          <button
            type="submit"
            disabled={loading}
            className="flex items-center gap-2 px-5 py-2 bg-[#8C532B] hover:bg-[#774421] disabled:opacity-50 text-white text-xs font-mono font-bold rounded-xl shadow-[0_2px_12px_rgba(140,83,43,0.3)] transition-all cursor-pointer"
          >
            <Plus className="w-4 h-4" />
            <span>{loading ? 'Initializing...' : 'Create Queue Counter'}</span>
          </button>
        </div>
      </form>
    </Modal>
  );
};

export default CreateQueueModal;
