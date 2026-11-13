import React, { useState } from 'react';
import {
  ArrowUp,
  ArrowDown,
  Search,
  Clock,
  Phone,
  Layers,
  Copy,
  Check,
} from 'lucide-react';
import { formatDuration } from '../../utils/formatters';

const TokenTable = ({
  tokens = [],
  onMoveUp,
  onMoveDown,
  onCancel,
  movingTokenId = null,
  emptyMessage = 'No customers currently waiting in this queue.',
  onAddPerson = null,
}) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [copiedId, setCopiedId] = useState(null);

  const copyToClipboard = (id, text) => {
    navigator.clipboard.writeText(text);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  const filteredTokens = tokens.filter((t) => {
    if (!searchTerm.trim()) return true;
    const term = searchTerm.toLowerCase();
    return (
      t.customerName?.toLowerCase().includes(term) ||
      t.tokenNumber?.toLowerCase().includes(term) ||
      t.phoneNumber?.includes(term)
    );
  });

  return (
    <div className="bg-white dark:bg-[#0D121F] border border-slate-200 dark:border-white/[0.08] rounded-2xl overflow-hidden shadow-xs dark:shadow-[0_4px_24px_rgba(0,0,0,0.35)]">
      {/* Table Header and Search Controls */}
      <div className="p-4 sm:p-5 border-b border-slate-200 dark:border-white/[0.08] flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div className="flex items-center gap-2">
          <Layers className="w-5 h-5 text-cyan-600 dark:text-cyan-400" />
          <h3 className="text-base font-bold text-slate-900 dark:text-white tracking-tight">
            Waiting Telemetry Queue
          </h3>
          <span className="px-2 py-0.5 rounded text-xs font-mono font-semibold bg-cyan-500/10 text-cyan-600 dark:text-cyan-400 border border-cyan-500/25">
            {tokens.length} {tokens.length === 1 ? 'Customer' : 'Customers'}
          </span>
        </div>

        {/* Search Input */}
        <div className="relative w-full sm:w-64">
          <Search className="w-4 h-4 text-slate-400 dark:text-slate-500 absolute left-3 top-2.5" />
          <input
            type="text"
            placeholder="Search telemetry line..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full bg-slate-50 dark:bg-[#080B11] border border-slate-200 dark:border-white/[0.08] rounded-xl pl-9 pr-3.5 py-1.5 text-xs text-slate-900 dark:text-white placeholder-slate-400 dark:placeholder-slate-500 focus:outline-none focus:border-cyan-400 focus:ring-1 focus:ring-cyan-400/20 transition-colors font-mono"
          />
        </div>
      </div>

      {/* Table Content */}
      {filteredTokens.length === 0 ? (
        <div className="p-12 text-center flex flex-col items-center justify-center">
          <div className="w-12 h-12 rounded-2xl bg-slate-100 dark:bg-[#080B11] border border-slate-200 dark:border-white/[0.08] flex items-center justify-center text-slate-400 dark:text-slate-500 mb-3">
            <Clock className="w-6 h-6 text-cyan-400" />
          </div>
          <h4 className="text-sm font-bold text-slate-800 dark:text-slate-200 font-mono">
            {searchTerm ? 'No matching queue records' : 'Waiting line is clear'}
          </h4>
          <p className="text-xs text-slate-500 dark:text-slate-400 max-w-sm mt-1 leading-relaxed">
            {searchTerm
              ? `No waiting customers match "${searchTerm}".`
              : emptyMessage}
          </p>
          {onAddPerson && !searchTerm && (
            <button
              onClick={onAddPerson}
              className="mt-4 px-5 py-2 bg-cyan-500 hover:bg-cyan-400 text-[#080B11] text-xs font-mono font-bold rounded-xl shadow-[0_0_15px_rgba(6,182,212,0.3)] transition-all cursor-pointer"
            >
              Add First Person
            </button>
          )}
        </div>
      ) : (
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs font-mono">
            <thead className="bg-slate-50/70 dark:bg-[#080B11] text-slate-500 dark:text-slate-400 font-semibold uppercase tracking-wider text-[11px] border-b border-slate-200 dark:border-white/[0.08]">
              <tr>
                <th className="py-3 px-4 w-16 text-center">Pos</th>
                <th className="py-3 px-4">Token #</th>
                <th className="py-3 px-4">Customer</th>
                <th className="py-3 px-4 hidden md:table-cell">Phone</th>
                <th className="py-3 px-4">Wait Time</th>
                <th className="py-3 px-4 text-center">Rearrange</th>
                <th className="py-3 px-4 text-right">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-white/[0.05]">
              {filteredTokens.map((token, index) => {
                const isFirst = index === 0;
                const isLast = index === filteredTokens.length - 1;
                const isMoving = movingTokenId === token._id;
                const isCopied = copiedId === token._id;

                return (
                  <tr
                    key={token._id}
                    className="hover:bg-slate-50/80 dark:hover:bg-white/[0.03] transition-colors"
                  >
                    {/* Position */}
                    <td className="py-3.5 px-4 text-center">
                      <span
                        className={`inline-flex items-center justify-center w-6 h-6 rounded-md font-bold text-xs ${
                          index === 0
                            ? 'bg-cyan-500 text-[#080B11] shadow-[0_0_10px_rgba(6,182,212,0.35)]'
                            : 'bg-slate-100 dark:bg-[#080B11] text-slate-700 dark:text-slate-400 border border-slate-200 dark:border-white/[0.08]'
                        }`}
                      >
                        #{token.position || index + 1}
                      </span>
                    </td>

                    {/* Token Number with Copy Button */}
                    <td className="py-3.5 px-4 font-mono font-bold text-sm text-cyan-600 dark:text-cyan-400">
                      <div className="flex items-center gap-1.5">
                        <span>{token.tokenNumber}</span>
                        <button
                          onClick={() => copyToClipboard(token._id, token.tokenNumber)}
                          title="Copy token code"
                          className="text-slate-400 hover:text-cyan-400 transition-colors cursor-pointer"
                        >
                          {isCopied ? (
                            <Check className="w-3 h-3 text-emerald-400" />
                          ) : (
                            <Copy className="w-3 h-3" />
                          )}
                        </button>
                      </div>
                    </td>

                    {/* Customer */}
                    <td className="py-3.5 px-4 font-sans">
                      <div className="font-semibold text-slate-900 dark:text-white text-xs sm:text-sm">
                        {token.customerName}
                      </div>
                      {token.notes && (
                        <p className="text-[11px] text-slate-500 dark:text-slate-400 truncate max-w-xs font-mono">
                          {token.notes}
                        </p>
                      )}
                    </td>

                    {/* Clickable Phone Number */}
                    <td className="py-3.5 px-4 text-slate-500 dark:text-slate-400 hidden md:table-cell">
                      {token.phoneNumber ? (
                        <a
                          href={`tel:${token.phoneNumber}`}
                          className="flex items-center gap-1 text-slate-600 dark:text-slate-300 hover:text-cyan-400 transition-colors"
                          title="Call customer"
                        >
                          <Phone className="w-3 h-3 text-slate-400 dark:text-slate-500" />
                          <span>{token.phoneNumber}</span>
                        </a>
                      ) : (
                        <span className="text-slate-400 dark:text-slate-600">-</span>
                      )}
                    </td>

                    {/* Wait Duration */}
                    <td className="py-3.5 px-4 text-slate-600 dark:text-slate-300">
                      <span className="flex items-center gap-1.5 font-medium text-slate-600 dark:text-slate-300">
                        <Clock className="w-3.5 h-3.5 text-slate-400 dark:text-slate-500" />
                        {formatDuration(token.createdAt)}
                      </span>
                    </td>

                    {/* Rearrange Reorder Buttons */}
                    <td className="py-3.5 px-4 text-center">
                      <div className="inline-flex items-center gap-1 bg-slate-100 dark:bg-[#080B11] p-1 rounded-lg border border-slate-200 dark:border-white/[0.08]">
                        <button
                          onClick={() => onMoveUp(token)}
                          disabled={isFirst || isMoving}
                          title="Move Up"
                          className="p-1 rounded text-slate-500 dark:text-slate-400 hover:text-cyan-400 hover:bg-slate-200 dark:hover:bg-white/[0.06] disabled:opacity-20 disabled:hover:bg-transparent transition-colors cursor-pointer disabled:cursor-not-allowed"
                        >
                          <ArrowUp className="w-3.5 h-3.5" />
                        </button>
                        <button
                          onClick={() => onMoveDown(token)}
                          disabled={isLast || isMoving}
                          title="Move Down"
                          className="p-1 rounded text-slate-500 dark:text-slate-400 hover:text-cyan-400 hover:bg-slate-200 dark:hover:bg-white/[0.06] disabled:opacity-20 disabled:hover:bg-transparent transition-colors cursor-pointer disabled:cursor-not-allowed"
                        >
                          <ArrowDown className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </td>

                    {/* Cancel Action */}
                    <td className="py-3.5 px-4 text-right">
                      <button
                        onClick={() => onCancel(token)}
                        title="Cancel Token"
                        className="px-2.5 py-1 text-xs font-semibold text-rose-500 hover:text-rose-400 hover:bg-rose-950/40 border border-rose-900/60 rounded-md transition-colors cursor-pointer"
                      >
                        Cancel
                      </button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default TokenTable;
