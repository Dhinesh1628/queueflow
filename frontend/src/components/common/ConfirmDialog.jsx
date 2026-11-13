import React from 'react';
import Modal from './Modal';
import { AlertTriangle } from 'lucide-react';

const ConfirmDialog = ({
  isOpen,
  onClose,
  onConfirm,
  title = 'Confirm Action',
  message = 'Are you sure you want to proceed?',
  confirmText = 'Confirm',
  cancelText = 'Cancel',
  isDanger = true,
  isLoading = false,
}) => {
  return (
    <Modal isOpen={isOpen} onClose={onClose} title={title} maxWidth="max-w-sm">
      <div className="space-y-4">
        <div className="flex items-start gap-3">
          <div
            className={`p-2.5 rounded-xl shrink-0 ${
              isDanger
                ? 'bg-[#B71C1C]/10 text-[#B71C1C] dark:text-[#E57373] border border-[#B71C1C]/25'
                : 'bg-[#8C532B]/10 text-[#8C532B] dark:text-[#D4A373] border border-[#8C532B]/25'
            }`}
          >
            <AlertTriangle className="w-5 h-5" />
          </div>
          <p className="text-sm text-[#736A62] dark:text-[#C7BCB0] leading-relaxed pt-0.5">{message}</p>
        </div>

        <div className="flex items-center justify-end gap-3 pt-3">
          <button
            type="button"
            onClick={onClose}
            disabled={isLoading}
            className="px-4 py-2 text-xs font-mono uppercase text-[#736A62] dark:text-[#C7BCB0] hover:text-[#26221F] dark:hover:text-white bg-[#F2ECE1] hover:bg-[#E6E0D4] dark:bg-[#322A23] border border-[#E6E0D4] dark:border-[#3E342C] dark:hover:bg-[#3E342C] rounded-xl transition-colors cursor-pointer"
          >
            {cancelText}
          </button>
          <button
            type="button"
            onClick={onConfirm}
            disabled={isLoading}
            className={`px-4 py-2 text-xs font-mono font-bold uppercase rounded-xl text-white shadow-md transition-all cursor-pointer ${
              isDanger
                ? 'bg-[#B71C1C] hover:bg-[#991515] shadow-[#B71C1C]/25'
                : 'bg-[#8C532B] hover:bg-[#774421] shadow-[#8C532B]/25'
            } disabled:opacity-50`}
          >
            {isLoading ? 'Processing...' : confirmText}
          </button>
        </div>
      </div>
    </Modal>
  );
};

export default ConfirmDialog;
