import React, { useState, useEffect } from 'react';
import {
  UserCheck,
  Clock,
  CheckCircle,
  Phone,
  Sparkles,
  ArrowRight,
  Flame,
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

  return (
    <div className="relative rounded-2xl overflow-hidden border border-slate-800 bg-gradient-to-r from-slate-900 via-slate-900/90 to-slate-950 p-6 sm:p-7 shadow-xl">
      {/* Background ambient lighting */}
      <div className="absolute top-0 right-0 -mr-16 -mt-16 w-64 h-64 bg-indigo-500/10 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-0 left-1/3 -mb-16 w-64 h-64 bg-sky-500/10 rounded-full blur-3xl pointer-events-none" />

      {servingToken ? (
        <div className="relative flex flex-col md:flex-row md:items-center justify-between gap-6">
          {/* Customer Serving Info */}
          <div className="flex items-start sm:items-center gap-4">
            <div className="w-16 h-16 rounded-2xl bg-gradient-to-tr from-sky-500 to-indigo-600 flex items-center justify-center text-white shadow-lg shadow-sky-500/20 shrink-0">
              <UserCheck className="w-8 h-8" />
            </div>

            <div>
              <div className="flex items-center gap-2 mb-1">
                <span className="flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-sky-500/20 text-sky-300 border border-sky-500/30">
                  <span className="w-1.5 h-1.5 rounded-full bg-sky-400 animate-ping" />
                  CURRENTLY SERVING
                </span>
                <span className="font-mono text-xs px-2 py-0.5 rounded bg-slate-800 text-slate-300">
                  {servingToken.tokenNumber}
                </span>
              </div>

              <h2 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
                {servingToken.customerName}
              </h2>

              <div className="flex flex-wrap items-center gap-4 mt-2 text-xs text-slate-400">
                {servingToken.phoneNumber && (
                  <span className="flex items-center gap-1.5">
                    <Phone className="w-3.5 h-3.5 text-slate-500" />
                    {servingToken.phoneNumber}
                  </span>
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
              className="flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 disabled:opacity-50 text-white font-bold text-sm rounded-xl shadow-lg shadow-emerald-950/50 transition-all transform hover:scale-[1.02] cursor-pointer"
            >
              <CheckCircle className="w-5 h-5" />
              <span>{isCompleting ? 'Finishing...' : 'COMPLETE SERVICE'}</span>
            </button>
          </div>
        </div>
      ) : (
        <div className="relative flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="flex items-center gap-4">
            <div className="w-14 h-14 rounded-2xl bg-slate-800 border border-slate-700/60 flex items-center justify-center text-slate-400 shrink-0">
              <Flame className="w-7 h-7 text-indigo-400" />
            </div>
            <div>
              <div className="flex items-center gap-2 mb-1">
                <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">
                  Service Counter Ready
                </span>
                <span className="px-2 py-0.5 rounded text-[11px] font-semibold bg-indigo-500/10 text-indigo-400 border border-indigo-500/20">
                  {waitingCount} {waitingCount === 1 ? 'Person' : 'People'} Waiting
                </span>
              </div>
              <h3 className="text-xl sm:text-2xl font-bold text-white tracking-tight">
                No Customer Currently Being Served
              </h3>
              <p className="text-xs text-slate-400 mt-1">
                {waitingCount > 0
                  ? 'Click "CALL NEXT" to begin serving the first waiting customer.'
                  : 'The waiting queue is currently empty. Add people to the queue to begin.'}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-3 shrink-0">
            <button
              onClick={onCallNext}
              disabled={isCallingNext || waitingCount === 0}
              className="flex items-center gap-2.5 px-6 py-3 bg-gradient-to-r from-indigo-600 to-sky-600 hover:from-indigo-500 hover:to-sky-500 disabled:opacity-40 disabled:cursor-not-allowed text-white font-bold text-sm rounded-xl shadow-lg shadow-indigo-600/30 transition-all transform hover:scale-[1.02] cursor-pointer"
            >
              <Sparkles className="w-4 h-4" />
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
