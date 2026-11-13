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
          <label className="block text-[11px] font-mono uppercase tracking-wider text-[#26221F] dark:text-[#FAF8F5] mb-1.5 font-semibold">
            Queue Name *
          </label>
          <input
            type="text"
            required
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="w-full bg-[#F8F6F0] dark:bg-[#1C1815] border border-[#E6E0D4] dark:border-[#3E342C] rounded-xl px-3.5 py-2.5 text-sm text-[#26221F] dark:text-[#FAF8F5] focus:outline-none focus:border-[#8C532B] focus:ring-1 focus:ring-[#8C532B]/30 transition-all placeholder:text-[#A69B8F]"
          />
        </div>

        <div className="grid grid-cols-3 gap-3">
          <div className="col-span-1">
            <label className="block text-[11px] font-mono uppercase tracking-wider text-[#26221F] dark:text-[#FAF8F5] mb-1.5 font-semibold">
              Prefix
            </label>
            <input
              type="text"
              maxLength={5}
              value={prefix}
              onChange={(e) => setPrefix(e.target.value.toUpperCase())}
              className="w-full uppercase font-mono bg-[#F8F6F0] dark:bg-[#1C1815] border border-[#E6E0D4] dark:border-[#3E342C] rounded-xl px-3.5 py-2.5 text-sm text-[#26221F] dark:text-[#FAF8F5] focus:outline-none focus:border-[#8C532B] focus:ring-1 focus:ring-[#8C532B]/30 transition-all"
            />
          </div>

          <div className="col-span-2">
            <label className="block text-[11px] font-mono uppercase tracking-wider text-[#26221F] dark:text-[#FAF8F5] mb-1.5 font-semibold">
              Description
            </label>
            <input
              type="text"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="w-full bg-[#F8F6F0] dark:bg-[#1C1815] border border-[#E6E0D4] dark:border-[#3E342C] rounded-xl px-3.5 py-2.5 text-sm text-[#26221F] dark:text-[#FAF8F5] focus:outline-none focus:border-[#8C532B] focus:ring-1 focus:ring-[#8C532B]/30 transition-all placeholder:text-[#A69B8F]"
            />
          </div>
        </div>

        <div className="flex items-center justify-end gap-3 pt-4 border-t border-[#E6E0D4] dark:border-[#3E342C]">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 text-xs font-mono uppercase text-[#736A62] dark:text-[#A69B8F] hover:text-[#26221F] dark:hover:text-white bg-[#F2ECE1] dark:bg-[#322A23] border border-[#E6E0D4] dark:border-[#3E342C] hover:bg-[#E6E0D4] dark:hover:bg-[#3E342C] rounded-xl transition-colors cursor-pointer"
          >
            Cancel
          </button>
          <button
            type="submit"
            disabled={loading}
            className="flex items-center gap-2 px-5 py-2 bg-[#8C532B] hover:bg-[#774421] text-white text-xs font-mono font-bold tracking-wide rounded-xl shadow-md shadow-[#8C532B]/25 disabled:opacity-50 transition-all cursor-pointer"
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
