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
      <div className="flex items-center gap-1.5 text-xs text-[#8C827A] dark:text-[#C78753]">
        <TrendingUp className="w-3 h-3 text-[#8C532B] dark:text-[#C78753]" />
        <span>Activity</span>
      </div>
      <div className="w-24 h-6 relative shrink-0">
        <svg viewBox={`0 0 ${width} ${height}`} className="w-full h-full overflow-visible">
          <defs>
            <linearGradient id={gradientId} x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#8C532B" stopOpacity="0.35" />
              <stop offset="100%" stopColor="#8C532B" stopOpacity="0" />
            </linearGradient>
          </defs>
          <path d={areaD} fill={`url(#${gradientId})`} />
          <path d={pathD} fill="none" stroke="#8C532B" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
          <circle cx={lastPoint.x} cy={lastPoint.y} r="2.5" fill="#8C532B" />
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
    <div className="bg-white dark:bg-[#26201B] border border-[#E6E0D4] dark:border-[#3E342C] hover:border-[#8C532B]/50 hover:-translate-y-0.5 hover:shadow-md rounded-2xl p-5 shadow-xs transition-all duration-200 ease-out flex flex-col justify-between group">
      <div>
        {/* Top Header */}
        <div className="flex items-start justify-between gap-3 mb-3">
          <div className="flex items-center gap-2">
            <span className="font-mono text-xs font-bold px-2 py-0.5 rounded bg-[#8C532B]/10 text-[#8C532B] dark:text-[#C78753] border border-[#8C532B]/20">
              {queue.prefix || 'QF'}
            </span>
            <h3
              onClick={() => navigate(`/queues/${queue._id}`)}
              className="text-base font-bold text-[#26221F] dark:text-[#FAF8F5] group-hover:text-[#8C532B] transition-colors cursor-pointer tracking-tight"
            >
              {queue.name}
            </h3>
          </div>

          {/* Actions */}
          <div className="flex items-center gap-1">
            <button
              onClick={() => onEdit(queue)}
              title="Edit Queue"
              className="p-1.5 rounded text-[#8C827A] hover:text-[#26221F] dark:hover:text-[#FAF8F5] hover:bg-[#F8F6F0] dark:hover:bg-[#322A24] transition-colors cursor-pointer"
            >
              <Edit2 className="w-3.5 h-3.5" />
            </button>
            <button
              onClick={() => onDelete(queue)}
              title="Delete Queue"
              className="p-1.5 rounded text-[#8C827A] hover:text-[#B71C1C] hover:bg-[#B71C1C]/10 transition-colors cursor-pointer"
            >
              <Trash2 className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>

        {queue.description && (
          <p className="text-xs text-[#736A62] dark:text-[#A69B8F] line-clamp-2 mb-4 leading-relaxed">
            {queue.description}
          </p>
        )}

        {/* Live Serving Banner if any */}
        {currentlyServing ? (
          <div className="mb-4 p-3 rounded-xl bg-[#8C532B]/10 border border-[#8C532B]/20 flex items-center justify-between">
            <div className="flex items-center gap-2.5">
              <span className="w-2 h-2 rounded-full bg-[#8C532B] animate-pulse" />
              <div>
                <span className="text-[11px] font-semibold tracking-wide text-[#8C532B] dark:text-[#C78753] uppercase block">
                  Now Serving
                </span>
                <p className="text-xs font-bold text-[#26221F] dark:text-[#FAF8F5]">
                  {currentlyServing.tokenNumber} — {currentlyServing.customerName}
                </p>
              </div>
            </div>
            <span className="text-[10px] text-[#8C532B] dark:text-[#C78753] bg-[#8C532B]/15 px-2 py-0.5 rounded font-semibold border border-[#8C532B]/25">
              IN SERVICE
            </span>
          </div>
        ) : (
          <div className="mb-4 p-2.5 rounded-xl bg-[#F8F6F0] dark:bg-[#1A1613] border border-[#E6E0D4] dark:border-[#3E342C] flex items-center gap-2 text-xs text-[#736A62] dark:text-[#A69B8F]">
            <Radio className="w-3.5 h-3.5 text-[#8C532B] dark:text-[#C78753]" />
            <span>Counter idle • Ready for next token</span>
          </div>
        )}

        {/* Status Metrics Grid */}
        <div className="grid grid-cols-4 gap-2 py-3 border-y border-[#E6E0D4] dark:border-[#3E342C] my-3 text-center font-mono">
          <div>
            <span className="text-[10px] font-medium text-[#8C827A] dark:text-[#7A6F66] block uppercase">
              Waiting
            </span>
            <span className="text-sm font-bold text-[#8C532B] dark:text-[#C78753]">
              {stats.waitingCount || 0}
            </span>
          </div>
          <div>
            <span className="text-[10px] font-medium text-[#8C827A] dark:text-[#7A6F66] block uppercase">
              Serving
            </span>
            <span className="text-sm font-bold text-[#B87A44] dark:text-[#D4955F]">
              {stats.servingCount || 0}
            </span>
          </div>
          <div>
            <span className="text-[10px] font-medium text-[#8C827A] dark:text-[#7A6F66] block uppercase">
              Done
            </span>
            <span className="text-sm font-bold text-[#2E7D32] dark:text-[#4CAF50]">
              {stats.completedCount || 0}
            </span>
          </div>
          <div>
            <span className="text-[10px] font-medium text-[#8C827A] dark:text-[#7A6F66] block uppercase">
              Cancelled
            </span>
            <span className="text-sm font-bold text-[#B71C1C] dark:text-[#EF5350]">
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
        <span className="text-[10px] text-[#8C827A] dark:text-[#7A6F66]">
          Created {formatDateTime(queue.createdAt)}
        </span>
        <button
          onClick={() => navigate(`/queues/${queue._id}`)}
          className="flex items-center gap-1.5 text-xs font-semibold text-[#8C532B] dark:text-[#C78753] hover:text-[#774421] transition-colors cursor-pointer"
        >
          <span>Open Console</span>
          <ArrowRight className="w-3.5 h-3.5" />
        </button>
      </div>
    </div>
  );
};

export default QueueCard;
