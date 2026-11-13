import React from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Users,
  Clock,
  ArrowRight,
  MoreVertical,
  CheckCircle2,
  Trash2,
  Edit2,
  AlertCircle,
  Radio,
} from 'lucide-react';
import { formatDateTime } from '../../utils/formatters';

const QueueCard = ({ queue, onEdit, onDelete }) => {
  const navigate = useNavigate();
  const stats = queue.stats || {};
  const currentlyServing = stats.currentlyServingToken;

  return (
    <div className="bg-slate-900 border border-slate-800 hover:border-slate-700/80 rounded-2xl p-5 shadow-sm transition-all duration-200 flex flex-col justify-between group">
      <div>
        {/* Top Header */}
        <div className="flex items-start justify-between gap-3 mb-3">
          <div className="flex items-center gap-2.5">
            <span className="font-mono text-xs font-bold px-2 py-0.5 rounded-md bg-indigo-500/15 text-indigo-300 border border-indigo-500/30">
              {queue.prefix || 'QF'}
            </span>
            <h3
              onClick={() => navigate(`/queues/${queue._id}`)}
              className="text-base font-bold text-white group-hover:text-indigo-300 transition-colors cursor-pointer tracking-tight"
            >
              {queue.name}
            </h3>
          </div>

          {/* Actions */}
          <div className="flex items-center gap-1">
            <button
              onClick={() => onEdit(queue)}
              title="Edit Queue"
              className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
            >
              <Edit2 className="w-3.5 h-3.5" />
            </button>
            <button
              onClick={() => onDelete(queue)}
              title="Delete Queue"
              className="p-1.5 rounded-lg text-slate-400 hover:text-rose-400 hover:bg-rose-500/10 transition-colors"
            >
              <Trash2 className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>

        {queue.description && (
          <p className="text-xs text-slate-400 line-clamp-2 mb-4 leading-relaxed">
            {queue.description}
          </p>
        )}

        {/* Live Serving Banner if any */}
        {currentlyServing ? (
          <div className="mb-4 p-3 rounded-xl bg-sky-500/10 border border-sky-500/20 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-sky-400 animate-ping" />
              <div>
                <span className="text-[10px] uppercase font-bold tracking-wider text-sky-400">
                  Serving Now
                </span>
                <p className="text-xs font-semibold text-white">
                  {currentlyServing.tokenNumber} - {currentlyServing.customerName}
                </p>
              </div>
            </div>
            <span className="text-[10px] text-sky-300 bg-sky-500/20 px-2 py-0.5 rounded font-mono">
              ACTIVE
            </span>
          </div>
        ) : (
          <div className="mb-4 p-2.5 rounded-xl bg-slate-950/60 border border-slate-800/80 flex items-center gap-2 text-xs text-slate-500">
            <Radio className="w-3.5 h-3.5 text-slate-600" />
            <span>Counter idle • No customer serving</span>
          </div>
        )}

        {/* Status Metrics Grid */}
        <div className="grid grid-cols-4 gap-2 py-3 border-y border-slate-800/80 my-3 text-center">
          <div>
            <span className="text-[10px] font-medium text-slate-400 block uppercase">
              Waiting
            </span>
            <span className="text-sm font-bold text-indigo-400">
              {stats.waitingCount || 0}
            </span>
          </div>
          <div>
            <span className="text-[10px] font-medium text-slate-400 block uppercase">
              Serving
            </span>
            <span className="text-sm font-bold text-sky-400">
              {stats.servingCount || 0}
            </span>
          </div>
          <div>
            <span className="text-[10px] font-medium text-slate-400 block uppercase">
              Done
            </span>
            <span className="text-sm font-bold text-emerald-400">
              {stats.completedCount || 0}
            </span>
          </div>
          <div>
            <span className="text-[10px] font-medium text-slate-400 block uppercase">
              Cancelled
            </span>
            <span className="text-sm font-bold text-rose-400">
              {stats.cancelledCount || 0}
            </span>
          </div>
        </div>
      </div>

      {/* Card Footer */}
      <div className="pt-2 flex items-center justify-between">
        <span className="text-[11px] text-slate-500">
          Created {formatDateTime(queue.createdAt)}
        </span>
        <button
          onClick={() => navigate(`/queues/${queue._id}`)}
          className="flex items-center gap-1.5 text-xs font-semibold text-indigo-400 hover:text-indigo-300 group-hover:translate-x-0.5 transition-all cursor-pointer"
        >
          <span>Open Console</span>
          <ArrowRight className="w-3.5 h-3.5" />
        </button>
      </div>
    </div>
  );
};

export default QueueCard;
