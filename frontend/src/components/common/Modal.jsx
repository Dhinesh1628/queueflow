import React, { useEffect } from 'react';
import { X } from 'lucide-react';

const Modal = ({ isOpen, onClose, title, subtitle, children, maxWidth = 'max-w-md' }) => {
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'Escape' && isOpen) onClose();
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 overflow-y-auto">
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-[#1C1815]/50 dark:bg-[#0E0C0A]/80 backdrop-blur-sm transition-opacity"
        onClick={onClose}
      />

      {/* Modal Dialog Content */}
      <div
        className={`relative w-full ${maxWidth} bg-white dark:bg-[#26201B] border border-[#E6E0D4] dark:border-[#3E342C] rounded-2xl shadow-xl dark:shadow-[0_20px_60px_rgba(0,0,0,0.6)] p-6 sm:p-7 overflow-hidden z-10 transition-all duration-200 transform scale-100`}
      >
        <div className="flex items-start justify-between pb-4 border-b border-[#E6E0D4] dark:border-[#3E342C] mb-5">
          <div>
            <h3 className="text-lg font-semibold text-[#26221F] dark:text-[#FAF8F5] tracking-tight">{title}</h3>
            {subtitle && <p className="text-xs text-[#736A62] dark:text-[#A69B8F] mt-1 font-mono">{subtitle}</p>}
          </div>
          <button
            onClick={onClose}
            className="p-1 rounded-lg text-[#736A62] hover:text-[#26221F] dark:hover:text-white hover:bg-[#F2ECE1] dark:hover:bg-[#322A23] transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div>{children}</div>
      </div>
    </div>
  );
};

export default Modal;
