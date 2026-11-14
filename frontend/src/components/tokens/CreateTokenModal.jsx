import React, { useState } from 'react';
import Modal from '../common/Modal';
import { tokenService } from '../../services/tokenService';
import { useToast } from '../../hooks/useToast';
import { playTicketChime } from '../../utils/sound';
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
        playTicketChime();
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
            <label className="block text-xs font-mono font-semibold text-[#26221F] dark:text-[#FAF8F5] uppercase tracking-wider mb-1.5">
              Select Counter Queue *
            </label>
            <select
              required
              value={selectedQueueId}
              onChange={(e) => setSelectedQueueId(e.target.value)}
              className="w-full bg-[#F8F6F0] dark:bg-[#1C1815] border border-[#E6E0D4] dark:border-[#3E342C] rounded-xl px-3.5 py-2.5 text-sm text-[#26221F] dark:text-[#FAF8F5] focus:outline-none focus:border-[#8C532B] focus:ring-1 focus:ring-[#8C532B]/30 font-mono"
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
          <label className="block text-xs font-semibold text-[#26221F] dark:text-[#FAF8F5] uppercase tracking-wider mb-1.5">
            Customer Full Name *
          </label>
          <div className="relative">
            <User className="w-4 h-4 text-[#736A62] dark:text-[#A69B8F] absolute left-3.5 top-3" />
            <input
              type="text"
              required
              placeholder="e.g. Rajesh Kumar"
              value={customerName}
              onChange={(e) => setCustomerName(e.target.value)}
              className="w-full bg-[#F8F6F0] dark:bg-[#1C1815] border border-[#E6E0D4] dark:border-[#3E342C] rounded-xl pl-10 pr-3.5 py-2.5 text-sm text-[#26221F] dark:text-[#FAF8F5] placeholder-[#A69B8F] focus:outline-none focus:border-[#8C532B] focus:ring-1 focus:ring-[#8C532B]/30 transition-colors"
            />
          </div>
        </div>

        <div>
          <label className="block text-xs font-semibold text-[#26221F] dark:text-[#FAF8F5] uppercase tracking-wider mb-1.5">
            Phone Number (Optional)
          </label>
          <div className="relative">
            <Phone className="w-4 h-4 text-[#736A62] dark:text-[#A69B8F] absolute left-3.5 top-3" />
            <input
              type="tel"
              placeholder="+91 98765 43210"
              value={phoneNumber}
              onChange={(e) => setPhoneNumber(e.target.value)}
              className="w-full bg-[#F8F6F0] dark:bg-[#1C1815] border border-[#E6E0D4] dark:border-[#3E342C] rounded-xl pl-10 pr-3.5 py-2.5 text-sm text-[#26221F] dark:text-[#FAF8F5] placeholder-[#A69B8F] focus:outline-none focus:border-[#8C532B] focus:ring-1 focus:ring-[#8C532B]/30 transition-colors"
            />
          </div>
        </div>

        <div>
          <label className="block text-xs font-mono font-semibold text-[#26221F] dark:text-[#FAF8F5] uppercase tracking-wider mb-1.5">
            Reason for Visit / Note (Optional)
          </label>
          <div className="relative">
            <FileText className="w-4 h-4 text-[#736A62] dark:text-[#A69B8F] absolute left-3.5 top-3" />
            <input
              type="text"
              placeholder="e.g. Account inquiry, payment processing..."
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              className="w-full bg-[#F8F6F0] dark:bg-[#1C1815] border border-[#E6E0D4] dark:border-[#3E342C] rounded-xl pl-10 pr-3.5 py-2.5 text-sm text-[#26221F] dark:text-[#FAF8F5] placeholder-[#A69B8F] focus:outline-none focus:border-[#8C532B] focus:ring-1 focus:ring-[#8C532B]/30 transition-colors font-mono"
            />
          </div>
        </div>

        {/* Data Minimization Notice */}
        <div className="flex items-center gap-2 p-2.5 rounded-xl bg-[#F8F6F0] dark:bg-[#1C1815] border border-[#E6E0D4] dark:border-[#3E342C] text-[11px] text-[#736A62] dark:text-[#A69B8F] font-mono">
          <ShieldCheck className="w-4 h-4 text-[#8C532B] shrink-0" />
          <span>Customer data is used solely for counter calling and is protected under GDPR minimization standards.</span>
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
            <UserPlus className="w-4 h-4" />
            <span>{loading ? 'Issuing...' : 'Generate Token'}</span>
          </button>
        </div>
      </form>
    </Modal>
  );
};

export default CreateTokenModal;
