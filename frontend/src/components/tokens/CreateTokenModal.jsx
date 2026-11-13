import React, { useState } from 'react';
import Modal from '../common/Modal';
import { tokenService } from '../../services/tokenService';
import { useToast } from '../../hooks/useToast';
import { UserPlus, User, Phone, FileText } from 'lucide-react';

const CreateTokenModal = ({
  isOpen,
  onClose,
  queueId,
  queues = [],
  onTokenCreated,
}) => {
  const [selectedQueueId, setSelectedQueueId] = useState(queueId || '');
  const [customerName, setCustomerName] = useState('');
  const [phoneNumber, setPhoneNumber] = useState('');
  const [notes, setNotes] = useState('');
  const [loading, setLoading] = useState(false);
  const toast = useToast();

  const currentQueueId = queueId || selectedQueueId;

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!currentQueueId) {
      toast.error('Please select a queue');
      return;
    }
    if (!customerName.trim()) {
      toast.error('Customer name is required');
      return;
    }

    try {
      setLoading(true);
      const res = await tokenService.createToken({
        queueId: currentQueueId,
        customerName: customerName.trim(),
        phoneNumber: phoneNumber.trim(),
        notes: notes.trim(),
      });

      if (res.success) {
        toast.success(
          `Token ${res.data.tokenNumber} generated for ${res.data.customerName}!`
        );
        setCustomerName('');
        setPhoneNumber('');
        setNotes('');
        onClose();
        if (onTokenCreated) onTokenCreated(res.data);
      }
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to issue token');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="Add Person to Queue"
      subtitle="Issue a new sequence token and add customer to waiting list"
      maxWidth="max-w-md"
    >
      <form onSubmit={handleSubmit} className="space-y-4">
        {/* Queue Selector if not predefined */}
        {!queueId && (
          <div>
            <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-1.5">
              Select Queue *
            </label>
            <select
              required
              value={selectedQueueId}
              onChange={(e) => setSelectedQueueId(e.target.value)}
              className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3.5 py-2.5 text-sm text-white focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500"
            >
              <option value="">Select a queue...</option>
              {queues.map((q) => (
                <option key={q._id} value={q._id}>
                  {q.name} ({q.prefix})
                </option>
              ))}
            </select>
          </div>
        )}

        <div>
          <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-1.5">
            Customer Full Name *
          </label>
          <div className="relative">
            <User className="w-4 h-4 text-slate-500 absolute left-3.5 top-3" />
            <input
              type="text"
              required
              placeholder="e.g. Jonathan Doe"
              value={customerName}
              onChange={(e) => setCustomerName(e.target.value)}
              className="w-full bg-slate-950 border border-slate-800 rounded-xl pl-10 pr-3.5 py-2.5 text-sm text-white placeholder-slate-500 focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 transition-colors"
            />
          </div>
        </div>

        <div>
          <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-1.5">
            Phone Number (Optional)
          </label>
          <div className="relative">
            <Phone className="w-4 h-4 text-slate-500 absolute left-3.5 top-3" />
            <input
              type="tel"
              placeholder="+1 (555) 000-0000"
              value={phoneNumber}
              onChange={(e) => setPhoneNumber(e.target.value)}
              className="w-full bg-slate-950 border border-slate-800 rounded-xl pl-10 pr-3.5 py-2.5 text-sm text-white placeholder-slate-500 focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 transition-colors"
            />
          </div>
        </div>

        <div>
          <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-1.5">
            Notes / Reason for Visit (Optional)
          </label>
          <div className="relative">
            <FileText className="w-4 h-4 text-slate-500 absolute left-3.5 top-3" />
            <input
              type="text"
              placeholder="e.g. Account inquiries, card replacement..."
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              className="w-full bg-slate-950 border border-slate-800 rounded-xl pl-10 pr-3.5 py-2.5 text-sm text-white placeholder-slate-500 focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 transition-colors"
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
            <UserPlus className="w-4 h-4" />
            {loading ? 'Issuing...' : 'Generate Token'}
          </button>
        </div>
      </form>
    </Modal>
  );
};

export default CreateTokenModal;
