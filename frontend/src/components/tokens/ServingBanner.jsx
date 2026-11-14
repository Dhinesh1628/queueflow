import React, { useState, useEffect } from 'react';
import {
  UserCheck,
  Clock,
  CheckCircle,
  Phone,
  Copy,
  Check,
  ArrowRight,
  Radio,
} from 'lucide-react';
import { formatDuration } from '../../utils/formatters';
import { playCallNextChime, playCompleteChime } from '../../utils/sound';

const ServingBanner = ({
  servingToken,
  waitingCount = 0,
  onCallNext,
  onCompleteService,
  isCallingNext = false,
  isCompleting = false,
}) => {
  const [elapsed, setElapsed] = useState('0s');
  const [copied, setCopied] = useState(false);

  const handleComplete = (id) => {
    playCompleteChime();
    onCompleteService(id);
  };

  const handleCall = () => {
    playCallNextChime();
    onCallNext();
  };

  useEffect(() => {
    if (!servingToken || !servingToken.serviceStartedAt) {
      setElapsed('0s');
      return;
    }

    const updateTimer = () => {
      setElapsed(formatDuration(servingToken.serviceStartedAt));
    };

    updateTimer();
    const interval = setInterval(updateTimer, 1000);
    return () => clearInterval(interval);
  }, [servingToken]);

  const copyTokenCode = () => {
    if (!servingToken) return;
    navigator.clipboard.writeText(servingToken.tokenNumber);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="rounded-2xl border border-[#E6E0D4] dark:border-[#3E342C] bg-white dark:bg-[#26201B] p-5 sm:p-6 shadow-sm relative overflow-hidden transition-all">
      {/* Top Accent Warm Glow Bar */}
      <div className="absolute top-0 left-0 right-0 h-[2px] bg-gradient-to-r from-transparent via-[#8C532B] to-transparent" />

      {servingToken ? (
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
          {/* Customer Serving Info */}
          <div className="flex items-start sm:items-center gap-4">
            <div className="w-14 h-14 rounded-2xl bg-[#8C532B]/10 border border-[#8C532B]/20 text-[#8C532B] dark:text-[#C78753] flex items-center justify-center shrink-0 shadow-sm">
              <UserCheck className="w-7 h-7" />
            </div>

            <div>
              <div className="flex items-center gap-2 mb-1">
                <span className="px-2 py-0.5 rounded text-[11px] font-semibold bg-[#8C532B]/10 text-[#8C532B] dark:text-[#C78753] border border-[#8C532B]/20 flex items-center gap-1.5">
                  <span className="w-1.5 h-1.5 rounded-full bg-[#8C532B]" />
                  <span>Currently Serving</span>
                </span>
                <span className="text-xs px-2.5 py-0.5 rounded bg-[#F8F6F0] dark:bg-[#1A1613] text-[#26221F] dark:text-[#FAF8F5] border border-[#E6E0D4] dark:border-[#3E342C] flex items-center gap-1.5 font-bold">
                  <span>{servingToken.tokenNumber}</span>
                  <button
                    onClick={copyTokenCode}
                    title="Copy token code"
                    className="text-[#8C827A] hover:text-[#8C532B] transition-colors cursor-pointer"
                  >
                    {copied ? <Check className="w-3 h-3 text-[#2E7D32]" /> : <Copy className="w-3 h-3" />}
                  </button>
                </span>
              </div>

              <h2 className="text-xl sm:text-2xl font-bold text-[#26221F] dark:text-[#FAF8F5] tracking-tight">
                {servingToken.customerName}
              </h2>

              <div className="flex flex-wrap items-center gap-4 mt-1.5 text-xs text-[#736A62] dark:text-[#A69B8F] font-mono">
                {servingToken.phoneNumber && (
                  <a
                    href={`tel:${servingToken.phoneNumber}`}
                    className="flex items-center gap-1.5 text-[#594F45] dark:text-[#D4CBBF] hover:text-[#8C532B] transition-colors"
                  >
                    <Phone className="w-3.5 h-3.5 text-[#8C827A]" />
                    <span>{servingToken.phoneNumber}</span>
                  </a>
                )}
                <span className="flex items-center gap-1.5 text-[#2E7D32] dark:text-[#4CAF50] font-medium">
                  <Clock className="w-3.5 h-3.5" />
                  Service Duration: <span className="font-mono font-bold text-[#8C532B] dark:text-[#C78753]">{elapsed}</span>
                </span>
              </div>
            </div>
          </div>

          {/* Action: Complete Service */}
          <div className="flex items-center gap-3 shrink-0">
            <button
              onClick={() => handleComplete(servingToken._id)}
              disabled={isCompleting}
              className="flex items-center gap-2 px-5 py-2.5 bg-[#26221F] hover:bg-[#151210] dark:bg-[#FAF8F5] dark:hover:bg-[#E6E0D4] text-[#FAF8F5] dark:text-[#26221F] disabled:opacity-50 font-semibold text-xs rounded-xl shadow-xs transition-all cursor-pointer"
            >
              <CheckCircle className="w-4 h-4" />
              <span>{isCompleting ? 'Completing...' : 'Complete Service'}</span>
            </button>
          </div>
        </div>
      ) : (
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-xl bg-[#F8F6F0] dark:bg-[#1A1613] border border-[#E6E0D4] dark:border-[#3E342C] flex items-center justify-center text-[#8C532B] dark:text-[#C78753] shrink-0">
              <Radio className="w-6 h-6" />
            </div>
            <div>
              <div className="flex items-center gap-2 mb-1">
                <span className="text-xs font-semibold text-[#8C827A]">
                  Counter Idle
                </span>
                <span className="px-2 py-0.5 rounded-full text-xs font-medium bg-[#8C532B]/10 text-[#8C532B] dark:text-[#C78753]">
                  {waitingCount} {waitingCount === 1 ? 'customer' : 'customers'} waiting
                </span>
              </div>
              <h3 className="text-lg sm:text-xl font-bold text-[#26221F] dark:text-[#FAF8F5] tracking-tight">
                Ready for Next Ticket
              </h3>
              <p className="text-xs text-[#736A62] dark:text-[#A69B8F] mt-0.5">
                {waitingCount > 0
                  ? 'Click "Call Next" to bring up the first waiting customer.'
                  : 'Waiting line is currently empty.'}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-3 shrink-0">
            <button
              onClick={handleCall}
              disabled={isCallingNext || waitingCount === 0}
              className="flex items-center gap-2 px-6 py-2.5 bg-[#8C532B] hover:bg-[#774421] text-white disabled:opacity-30 disabled:cursor-not-allowed font-semibold text-xs rounded-xl shadow-xs transition-all cursor-pointer"
            >
              <span>{isCallingNext ? 'Calling...' : 'Call Next'}</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default ServingBanner;
