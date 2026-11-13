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
    <div className="rounded-xl border border-slate-800 bg-slate-900 p-5 sm:p-6 shadow-sm">
      {servingToken ? (
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
          {/* Customer Serving Info */}
          <div className="flex items-start sm:items-center gap-4">
            <div className="w-14 h-14 rounded-xl bg-sky-950 border border-sky-800 text-sky-400 flex items-center justify-center shrink-0">
              <UserCheck className="w-7 h-7" />
            </div>

            <div>
              <div className="flex items-center gap-2 mb-1">
                <span className="px-2 py-0.5 rounded text-[11px] font-bold bg-sky-950 text-sky-400 border border-sky-800">
                  CURRENTLY SERVING
                </span>
                <span className="font-mono text-xs px-2 py-0.5 rounded bg-slate-950 text-slate-300 border border-slate-800 flex items-center gap-1.5">
                  <span>{servingToken.tokenNumber}</span>
                  <button
                    onClick={copyTokenCode}
                    title="Copy token code"
                    className="text-slate-500 hover:text-white transition-colors cursor-pointer"
                  >
                    {copied ? <Check className="w-3 h-3 text-emerald-400" /> : <Copy className="w-3 h-3" />}
                  </button>
                </span>
              </div>

              <h2 className="text-xl sm:text-2xl font-bold text-white tracking-tight">
                {servingToken.customerName}
              </h2>

              <div className="flex flex-wrap items-center gap-4 mt-1.5 text-xs text-slate-400">
                {servingToken.phoneNumber && (
                  <a
                    href={`tel:${servingToken.phoneNumber}`}
                    className="flex items-center gap-1.5 text-slate-300 hover:text-sky-400 transition-colors"
                  >
                    <Phone className="w-3.5 h-3.5 text-slate-500" />
                    <span>{servingToken.phoneNumber}</span>
                  </a>
                )}
                <span className="flex items-center gap-1.5 text-sky-400 font-medium">
                  <Clock className="w-3.5 h-3.5" />
                  Service Duration: <span className="font-mono font-bold">{elapsed}</span>
                </span>
              </div>
            </div>
          </div>

          {/* Action: Complete Service */}
          <div className="flex items-center gap-3 shrink-0">
            <button
              onClick={() => onCompleteService(servingToken._id)}
              disabled={isCompleting}
              className="flex items-center gap-2 px-5 py-2.5 bg-emerald-600 hover:bg-emerald-500 disabled:opacity-50 text-white font-semibold text-xs rounded-lg shadow-sm transition-colors cursor-pointer"
            >
              <CheckCircle className="w-4 h-4" />
              <span>{isCompleting ? 'Finishing...' : 'COMPLETE SERVICE'}</span>
            </button>
          </div>
        </div>
      ) : (
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-xl bg-slate-950 border border-slate-800 flex items-center justify-center text-slate-500 shrink-0">
              <Radio className="w-6 h-6 text-slate-400" />
            </div>
            <div>
              <div className="flex items-center gap-2 mb-1">
                <span className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider">
                  Service Counter Idle
                </span>
                <span className="px-2 py-0.5 rounded text-[11px] font-semibold bg-slate-800 text-slate-300 border border-slate-700">
                  {waitingCount} {waitingCount === 1 ? 'Customer' : 'Customers'} Waiting
                </span>
              </div>
              <h3 className="text-lg sm:text-xl font-bold text-white tracking-tight">
                No Customer Currently Being Served
              </h3>
              <p className="text-xs text-slate-400 mt-0.5">
                {waitingCount > 0
                  ? 'Click "CALL NEXT" to begin serving the first customer in the line.'
                  : 'The waiting queue is currently empty. Add a person to the queue to begin.'}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-3 shrink-0">
            <button
              onClick={onCallNext}
              disabled={isCallingNext || waitingCount === 0}
              className="flex items-center gap-2 px-5 py-2.5 bg-sky-600 hover:bg-sky-500 disabled:opacity-40 disabled:cursor-not-allowed text-white font-semibold text-xs rounded-lg shadow-sm transition-colors cursor-pointer"
            >
              <span>{isCallingNext ? 'Calling...' : 'CALL NEXT'}</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default ServingBanner;
