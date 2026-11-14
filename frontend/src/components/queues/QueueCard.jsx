import React from 'react';
import { useNavigate } from 'react-router-dom';
import {
  ArrowRight,
  Trash2,
  Edit2,
  Radio,
} from 'lucide-react';
import { formatDateTime } from '../../utils/formatters';

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
            <span className="text-xs font-bold px-2 py-0.5 rounded bg-[#8C532B]/10 text-[#8C532B] dark:text-[#C78753] border border-[#8C532B]/20">
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
              <span className="w-2 h-2 rounded-full bg-[#8C532B]" />
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
        <div className="grid grid-cols-4 gap-2 py-3 border-y border-[#E6E0D4] dark:border-[#3E342C] my-3 text-center">
          <div>
            <span className="text-xs font-medium text-[#8C827A] dark:text-[#7A6F66] block">
              Waiting
            </span>
            <span className="text-sm font-bold text-[#8C532B] dark:text-[#C78753]">
              {stats.waitingCount || 0}
            </span>
          </div>
          <div>
            <span className="text-xs font-medium text-[#8C827A] dark:text-[#7A6F66] block">
              Serving
            </span>
            <span className="text-sm font-bold text-[#B87A44] dark:text-[#D4955F]">
              {stats.servingCount || 0}
            </span>
          </div>
          <div>
            <span className="text-xs font-medium text-[#8C827A] dark:text-[#7A6F66] block">
              Done
            </span>
            <span className="text-sm font-bold text-[#2E7D32] dark:text-[#4CAF50]">
              {stats.completedCount || 0}
            </span>
          </div>
          <div>
            <span className="text-xs font-medium text-[#8C827A] dark:text-[#7A6F66] block">
              Cancelled
            </span>
            <span className="text-sm font-bold text-[#B71C1C] dark:text-[#EF5350]">
              {stats.cancelledCount || 0}
            </span>
          </div>
        </div>
      </div>

      {/* Card Footer */}
      <div className="pt-2 flex items-center justify-between">
        <span className="text-xs text-[#8C827A] dark:text-[#7A6F66]">
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
