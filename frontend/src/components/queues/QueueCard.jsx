import React, { useId } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  ArrowRight,
  Trash2,
  Edit2,
  Radio,
  TrendingUp,
} from 'lucide-react';
import { formatDateTime } from '../../utils/formatters';

const MiniSparkline = ({ waiting = 0, completed = 0, serving = 0 }) => {
  const gradientId = useId();
  // Build a 7-point waveform based on queue load dynamics
  const base = Math.max(1, completed);
  const w = Math.max(0, waiting);
  const s = Math.max(0, serving);

  const points = [
    Math.max(2, Math.round(base * 0.3)),
    Math.max(3, Math.round(base * 0.55)),
    Math.max(1, Math.round(base * 0.8)),
    Math.max(4, Math.round(base * 0.65 + w * 0.3)),
    Math.max(2, Math.round(w * 0.6 + s)),
    Math.max(5, Math.round(w * 0.85 + s)),
    Math.max(2, w + s + 1),
  ];

  const max = Math.max(...points, 6);
  const min = Math.min(...points, 0);
  const range = max - min || 1;

  const width = 100;
  const height = 24;

  const coords = points.map((val, idx) => {
    const x = (idx / (points.length - 1)) * width;
    const y = height - ((val - min) / range) * (height - 6) - 3;
    return { x, y };
  });

  const pathD = coords.reduce((acc, pt, idx) => {
    return idx === 0 ? `M ${pt.x} ${pt.y}` : `${acc} L ${pt.x} ${pt.y}`;
  }, '');

  const areaD = `${pathD} L 100 ${height} L 0 ${height} Z`;
  const lastPoint = coords[coords.length - 1];

  return (
    <div className="w-full flex items-center justify-between gap-3 pt-1 pb-2">
      <div className="flex items-center gap-1.5 text-[10px] font-mono text-slate-400 dark:text-cyan-400/70">
        <TrendingUp className="w-3 h-3 text-cyan-400" />
        <span>LOAD VELOCITY</span>
      </div>
      <div className="w-24 h-6 relative shrink-0">
        <svg viewBox={`0 0 ${width} ${height}`} className="w-full h-full overflow-visible">
          <defs>
            <linearGradient id={gradientId} x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#06B6D4" stopOpacity="0.45" />
              <stop offset="100%" stopColor="#06B6D4" stopOpacity="0" />
            </linearGradient>
          </defs>
          <path d={areaD} fill={`url(#${gradientId})`} />
          <path d={pathD} fill="none" stroke="#06B6D4" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
          <circle cx={lastPoint.x} cy={lastPoint.y} r="2" fill="#00F0FF" />
          <circle cx={lastPoint.x} cy={lastPoint.y} r="4" fill="#00F0FF" className="animate-ping" opacity="0.6" />
        </svg>
      </div>
    </div>
  );
};

const QueueCard = ({ queue, onEdit, onDelete }) => {
  const navigate = useNavigate();
  const stats = queue.stats || {};
  const currentlyServing = stats.currentlyServingToken;

  return (
    <div className="bg-white dark:bg-[#0D121F] border border-slate-200/90 dark:border-white/[0.08] hover:border-cyan-500/30 rounded-2xl p-5 shadow-xs dark:shadow-[0_4px_20px_rgba(0,0,0,0.3)] transition-all flex flex-col justify-between group">
      <div>
        {/* Top Header */}
        <div className="flex items-start justify-between gap-3 mb-3">
          <div className="flex items-center gap-2">
            <span className="font-mono text-xs font-bold px-2 py-0.5 rounded bg-cyan-500/10 text-cyan-600 dark:text-cyan-400 border border-cyan-500/25">
              {queue.prefix || 'QF'}
            </span>
            <h3
              onClick={() => navigate(`/queues/${queue._id}`)}
              className="text-base font-bold text-slate-900 dark:text-white group-hover:text-cyan-400 transition-colors cursor-pointer tracking-tight"
            >
              {queue.name}
            </h3>
          </div>

          {/* Actions */}
          <div className="flex items-center gap-1">
            <button
              onClick={() => onEdit(queue)}
              title="Edit Queue"
              className="p-1.5 rounded text-slate-400 hover:text-slate-700 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-white/[0.06] transition-colors cursor-pointer"
            >
              <Edit2 className="w-3.5 h-3.5" />
            </button>
            <button
              onClick={() => onDelete(queue)}
              title="Delete Queue"
              className="p-1.5 rounded text-slate-400 hover:text-rose-500 hover:bg-rose-50 dark:hover:bg-rose-950/40 transition-colors cursor-pointer"
            >
              <Trash2 className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>

        {queue.description && (
          <p className="text-xs text-slate-500 dark:text-slate-400 line-clamp-2 mb-4 leading-relaxed font-mono">
            {queue.description}
          </p>
        )}

        {/* Live Serving Banner if any */}
        {currentlyServing ? (
          <div className="mb-4 p-3 rounded-xl bg-emerald-500/10 border border-emerald-500/25 flex items-center justify-between">
            <div className="flex items-center gap-2.5">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping" />
              <div>
                <span className="text-[10px] font-mono font-bold tracking-wider text-emerald-600 dark:text-emerald-400 uppercase">
                  DISPATCH SERVING
                </span>
                <p className="text-xs font-semibold text-slate-900 dark:text-white font-mono">
                  {currentlyServing.tokenNumber} - {currentlyServing.customerName}
                </p>
              </div>
            </div>
            <span className="text-[10px] text-emerald-400 bg-emerald-950/60 px-2 py-0.5 rounded font-mono font-bold border border-emerald-500/25">
              ACTIVE
            </span>
          </div>
        ) : (
          <div className="mb-4 p-2.5 rounded-xl bg-slate-50 dark:bg-[#080B11] border border-slate-200/60 dark:border-white/[0.06] flex items-center gap-2 text-xs text-slate-500 dark:text-slate-400 font-mono">
            <Radio className="w-3.5 h-3.5 text-cyan-400" />
            <span>Telemetry idle • Counter in standby</span>
          </div>
        )}

        {/* Status Metrics Grid */}
        <div className="grid grid-cols-4 gap-2 py-3 border-y border-slate-100 dark:border-white/[0.08] my-3 text-center font-mono">
          <div>
            <span className="text-[10px] font-medium text-slate-400 block uppercase">
              Waiting
            </span>
            <span className="text-sm font-bold text-cyan-600 dark:text-cyan-400">
              {stats.waitingCount || 0}
            </span>
          </div>
          <div>
            <span className="text-[10px] font-medium text-slate-400 block uppercase">
              Serving
            </span>
            <span className="text-sm font-bold text-amber-600 dark:text-amber-400">
              {stats.servingCount || 0}
            </span>
          </div>
          <div>
            <span className="text-[10px] font-medium text-slate-400 block uppercase">
              Done
            </span>
            <span className="text-sm font-bold text-emerald-600 dark:text-emerald-400">
              {stats.completedCount || 0}
            </span>
          </div>
          <div>
            <span className="text-[10px] font-medium text-slate-400 block uppercase">
              Cancelled
            </span>
            <span className="text-sm font-bold text-rose-600 dark:text-rose-400">
              {stats.cancelledCount || 0}
            </span>
          </div>
        </div>
        {/* Mini Sparkline Load Velocity */}
        <MiniSparkline
          waiting={stats.waitingCount || 0}
          completed={stats.completedCount || 0}
          serving={stats.servingCount || 0}
        />
      </div>

      {/* Card Footer */}
      <div className="pt-2 flex items-center justify-between font-mono">
        <span className="text-[10px] text-slate-400">
          Created {formatDateTime(queue.createdAt)}
        </span>
        <button
          onClick={() => navigate(`/queues/${queue._id}`)}
          className="flex items-center gap-1.5 text-xs font-semibold text-cyan-600 dark:text-cyan-400 hover:text-cyan-300 transition-colors cursor-pointer"
        >
          <span>Open Console</span>
          <ArrowRight className="w-3.5 h-3.5" />
        </button>
      </div>
    </div>
  );
};

export default QueueCard;
