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
    <div className="rounded-2xl border border-slate-200/90 dark:border-white/[0.08] bg-white dark:bg-[#0D121F] p-5 sm:p-6 shadow-xs dark:shadow-[0_8px_30px_rgba(0,0,0,0.5)] relative overflow-hidden transition-all">
      {/* Top Cockpit Accent Glow Bar */}
      <div
        className={`absolute top-0 left-0 right-0 h-[2px] ${
          servingToken
            ? 'bg-gradient-to-r from-transparent via-emerald-400 to-transparent'
            : 'bg-gradient-to-r from-transparent via-cyan-400/50 to-transparent'
        }`}
      />

      {servingToken ? (
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
          {/* Customer Serving Info */}
          <div className="flex items-start sm:items-center gap-4">
            <div className="w-14 h-14 rounded-2xl bg-emerald-500/10 border border-emerald-500/25 text-emerald-400 flex items-center justify-center shrink-0 shadow-[0_0_16px_rgba(16,185,129,0.25)]">
              <UserCheck className="w-7 h-7" />
            </div>

            <div>
              <div className="flex items-center gap-2 mb-1">
                <span className="px-2 py-0.5 rounded text-[10px] font-mono font-bold bg-emerald-500/15 text-emerald-400 border border-emerald-500/30 flex items-center gap-1.5">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-ping" />
                  <span>COCKPIT ACTIVE: SERVING</span>
                </span>
                <span className="font-mono text-xs px-2.5 py-0.5 rounded bg-slate-100 dark:bg-[#080B11] text-cyan-600 dark:text-cyan-400 border border-slate-200 dark:border-cyan-500/25 flex items-center gap-1.5 font-bold">
                  <span>{servingToken.tokenNumber}</span>
                  <button
                    onClick={copyTokenCode}
                    title="Copy token code"
                    className="text-slate-400 hover:text-cyan-400 transition-colors cursor-pointer"
                  >
                    {copied ? <Check className="w-3 h-3 text-emerald-400" /> : <Copy className="w-3 h-3" />}
                  </button>
                </span>
              </div>

              <h2 className="text-xl sm:text-2xl font-bold text-slate-900 dark:text-white tracking-tight">
                {servingToken.customerName}
              </h2>

              <div className="flex flex-wrap items-center gap-4 mt-1.5 text-xs text-slate-500 dark:text-slate-400 font-mono">
                {servingToken.phoneNumber && (
                  <a
                    href={`tel:${servingToken.phoneNumber}`}
                    className="flex items-center gap-1.5 text-slate-700 dark:text-slate-300 hover:text-cyan-400 transition-colors"
                  >
                    <Phone className="w-3.5 h-3.5 text-slate-400" />
                    <span>{servingToken.phoneNumber}</span>
                  </a>
                )}
                <span className="flex items-center gap-1.5 text-emerald-600 dark:text-emerald-400 font-medium">
                  <Clock className="w-3.5 h-3.5" />
                  Service Duration: <span className="font-mono font-bold text-emerald-400">{elapsed}</span>
                </span>
              </div>
            </div>
          </div>

          {/* Action: Complete Service */}
          <div className="flex items-center gap-3 shrink-0">
            <button
              onClick={() => onCompleteService(servingToken._id)}
              disabled={isCompleting}
              className="flex items-center gap-2 px-6 py-2.5 bg-emerald-500 hover:bg-emerald-400 disabled:opacity-50 text-[#080B11] font-mono font-bold text-xs rounded-xl shadow-[0_0_18px_rgba(16,185,129,0.35)] transition-all cursor-pointer"
            >
              <CheckCircle className="w-4 h-4" />
              <span>{isCompleting ? 'Finalizing...' : 'COMPLETE SERVICE'}</span>
            </button>
          </div>
        </div>
      ) : (
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-xl bg-slate-100 dark:bg-[#080B11] border border-slate-200 dark:border-white/[0.08] flex items-center justify-center text-slate-400 shrink-0">
              <Radio className="w-6 h-6 text-cyan-400" />
            </div>
            <div>
              <div className="flex items-center gap-2 mb-1">
                <span className="text-[10px] font-mono font-semibold text-slate-400 uppercase tracking-widest">
                  STANDBY TELEMETRY
                </span>
                <span className="px-2 py-0.5 rounded text-[11px] font-mono font-semibold bg-slate-100 text-slate-700 border border-slate-200 dark:bg-[#080B11] dark:text-cyan-400 dark:border-cyan-500/25">
                  {waitingCount} {waitingCount === 1 ? 'Customer' : 'Customers'} in Queue
                </span>
              </div>
              <h3 className="text-lg sm:text-xl font-bold text-slate-900 dark:text-white tracking-tight">
                Counter Ready for Next Ticket
              </h3>
              <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                {waitingCount > 0
                  ? 'Dispatch operator ready. Click "CALL NEXT" to advance the waiting queue.'
                  : 'Counter line is currently clear. Issue a token to activate dispatch.'}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-3 shrink-0">
            <button
              onClick={onCallNext}
              disabled={isCallingNext || waitingCount === 0}
              className="flex items-center gap-2 px-6 py-2.5 bg-cyan-500 hover:bg-cyan-400 disabled:opacity-30 disabled:cursor-not-allowed text-[#080B11] font-mono font-bold text-xs rounded-xl shadow-[0_0_18px_rgba(6,182,212,0.35)] transition-all cursor-pointer"
            >
              <span>{isCallingNext ? 'Dispatching...' : 'CALL NEXT'}</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default ServingBanner;
