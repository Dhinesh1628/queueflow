import React, { useState } from 'react';
import Modal from '../common/Modal';
import { tokenService } from '../../services/tokenService';
import { useToast } from '../../hooks/useToast';
import { UserPlus, User, Phone, FileText, ShieldCheck } from 'lucide-react';

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
      title="Add Person to Waiting Line"
      subtitle="Issue an atomic sequence token for service dispatch"
      maxWidth="max-w-md"
    >
      <form onSubmit={handleSubmit} className="space-y-4">
        {/* Queue Selector if not predefined */}
        {!queueId && (
          <div>
            <label className="block text-xs font-mono font-semibold text-slate-700 dark:text-slate-300 uppercase tracking-wider mb-1.5">
              Select Counter Queue *
            </label>
            <select
              required
              value={selectedQueueId}
              onChange={(e) => setSelectedQueueId(e.target.value)}
              className="w-full bg-slate-50 dark:bg-[#080B11] border border-slate-200 dark:border-white/[0.08] rounded-xl px-3.5 py-2.5 text-sm text-slate-900 dark:text-white focus:outline-none focus:border-cyan-400 focus:ring-1 focus:ring-cyan-400/20 font-mono"
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
          <label className="block text-xs font-mono font-semibold text-slate-700 dark:text-slate-300 uppercase tracking-wider mb-1.5">
            Customer Full Name *
          </label>
          <div className="relative">
            <User className="w-4 h-4 text-slate-400 dark:text-slate-500 absolute left-3.5 top-3" />
            <input
              type="text"
              required
              placeholder="e.g. Jonathan Doe"
              value={customerName}
              onChange={(e) => setCustomerName(e.target.value)}
              className="w-full bg-slate-50 dark:bg-[#080B11] border border-slate-200 dark:border-white/[0.08] rounded-xl pl-10 pr-3.5 py-2.5 text-sm text-slate-900 dark:text-white placeholder-slate-400 dark:placeholder-slate-500 focus:outline-none focus:border-cyan-400 focus:ring-1 focus:ring-cyan-400/20 transition-colors"
            />
          </div>
        </div>

        <div>
          <label className="block text-xs font-mono font-semibold text-slate-700 dark:text-slate-300 uppercase tracking-wider mb-1.5">
            Phone Number (Optional)
          </label>
          <div className="relative">
            <Phone className="w-4 h-4 text-slate-400 dark:text-slate-500 absolute left-3.5 top-3" />
            <input
              type="tel"
              placeholder="+1 (555) 000-0000"
              value={phoneNumber}
              onChange={(e) => setPhoneNumber(e.target.value)}
              className="w-full bg-slate-50 dark:bg-[#080B11] border border-slate-200 dark:border-white/[0.08] rounded-xl pl-10 pr-3.5 py-2.5 text-sm text-slate-900 dark:text-white placeholder-slate-400 dark:placeholder-slate-500 focus:outline-none focus:border-cyan-400 focus:ring-1 focus:ring-cyan-400/20 transition-colors font-mono"
            />
          </div>
        </div>

        <div>
          <label className="block text-xs font-mono font-semibold text-slate-700 dark:text-slate-300 uppercase tracking-wider mb-1.5">
            Reason for Visit / Note (Optional)
          </label>
          <div className="relative">
            <FileText className="w-4 h-4 text-slate-400 dark:text-slate-500 absolute left-3.5 top-3" />
            <input
              type="text"
              placeholder="e.g. Account inquiry, payment processing..."
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              className="w-full bg-slate-50 dark:bg-[#080B11] border border-slate-200 dark:border-white/[0.08] rounded-xl pl-10 pr-3.5 py-2.5 text-sm text-slate-900 dark:text-white placeholder-slate-400 dark:placeholder-slate-500 focus:outline-none focus:border-cyan-400 focus:ring-1 focus:ring-cyan-400/20 transition-colors font-mono"
            />
          </div>
        </div>

        {/* Data Minimization Notice */}
        <div className="flex items-center gap-2 p-2.5 rounded-xl bg-slate-50 dark:bg-[#080B11] border border-slate-200 dark:border-white/[0.08] text-[11px] text-slate-600 dark:text-slate-400 font-mono">
          <ShieldCheck className="w-4 h-4 text-cyan-400 shrink-0" />
          <span>Customer data is used solely for counter calling and is protected under GDPR minimization standards.</span>
        </div>

        <div className="flex items-center justify-end gap-3 pt-4 border-t border-slate-100 dark:border-white/[0.08]">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 text-xs font-mono font-medium text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white bg-slate-100 dark:bg-white/[0.04] dark:border dark:border-white/[0.08] hover:bg-slate-200 dark:hover:bg-white/[0.08] rounded-xl transition-colors cursor-pointer"
          >
            Cancel
          </button>
          <button
            type="submit"
            disabled={loading}
            className="flex items-center gap-2 px-5 py-2 bg-cyan-500 hover:bg-cyan-400 disabled:opacity-50 text-[#080B11] text-xs font-mono font-bold rounded-xl shadow-[0_0_15px_rgba(6,182,212,0.3)] transition-all cursor-pointer"
          >
            <UserPlus className="w-4 h-4" />
            <span>{loading ? 'Issuing...' : 'Generate Token'}</span>
          </button>
        </div>
      </form>
    </Modal>
  );
};

export default CreateTokenModal;
