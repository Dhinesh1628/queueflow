import React, { useState } from 'react';
import {
  ArrowUp,
  ArrowDown,
  XCircle,
  Search,
  Clock,
  Phone,
  User,
  AlertCircle,
  Layers,
} from 'lucide-react';
import { formatDuration, formatDateTime, getStatusBadgeStyle } from '../../utils/formatters';

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

  // Filter tokens based on search input
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
    <div className="bg-slate-900 border border-slate-800 rounded-2xl overflow-hidden shadow-sm">
      {/* Table Header and Search Controls */}
      <div className="p-4 sm:p-5 border-b border-slate-800 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div className="flex items-center gap-2">
          <Layers className="w-5 h-5 text-indigo-400" />
          <h3 className="text-base font-bold text-white tracking-tight">
            Waiting List
          </h3>
          <span className="px-2 py-0.5 rounded-full text-xs font-semibold bg-indigo-500/10 text-indigo-300 border border-indigo-500/20">
            {tokens.length} {tokens.length === 1 ? 'Customer' : 'Customers'}
          </span>
        </div>

        {/* Search Input */}
        <div className="relative w-full sm:w-64">
          <Search className="w-4 h-4 text-slate-500 absolute left-3 top-2.5" />
          <input
            type="text"
            placeholder="Search waiting list..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full bg-slate-950 border border-slate-800 rounded-xl pl-9 pr-3.5 py-1.5 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 transition-colors"
          />
        </div>
      </div>

      {/* Table Content */}
      {filteredTokens.length === 0 ? (
        <div className="p-12 text-center flex flex-col items-center justify-center">
          <div className="w-12 h-12 rounded-2xl bg-slate-800/80 border border-slate-700/60 flex items-center justify-center text-slate-400 mb-3">
            <Clock className="w-6 h-6 text-slate-500" />
          </div>
          <h4 className="text-sm font-semibold text-slate-200">
            {searchTerm ? 'No matching customers found' : 'Waiting list is empty'}
          </h4>
          <p className="text-xs text-slate-500 max-w-sm mt-1 leading-relaxed">
            {searchTerm
              ? `No waiting customers match "${searchTerm}". Try another search term.`
              : emptyMessage}
          </p>
          {onAddPerson && !searchTerm && (
            <button
              onClick={onAddPerson}
              className="mt-4 px-4 py-2 bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-semibold rounded-xl shadow-lg shadow-indigo-600/20 transition-all cursor-pointer"
            >
              Add First Person
            </button>
          )}
        </div>
      ) : (
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-950/50 text-slate-400 font-semibold uppercase tracking-wider text-[11px] border-b border-slate-800">
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
            <tbody className="divide-y divide-slate-800/60">
              {filteredTokens.map((token, index) => {
                const isFirst = index === 0;
                const isLast = index === filteredTokens.length - 1;
                const isMoving = movingTokenId === token._id;

                return (
                  <tr
                    key={token._id}
                    className="hover:bg-slate-800/40 transition-colors group"
                  >
                    {/* Position */}
                    <td className="py-3.5 px-4 text-center">
                      <span
                        className={`inline-flex items-center justify-center w-6 h-6 rounded-lg font-bold text-xs ${
                          index === 0
                            ? 'bg-indigo-600 text-white shadow-sm shadow-indigo-600/40'
                            : 'bg-slate-800 text-slate-300'
                        }`}
                      >
                        #{token.position || index + 1}
                      </span>
                    </td>

                    {/* Token Number */}
                    <td className="py-3.5 px-4 font-mono font-bold text-sm text-indigo-300">
                      {token.tokenNumber}
                    </td>

                    {/* Customer */}
                    <td className="py-3.5 px-4">
                      <div className="font-semibold text-white text-xs sm:text-sm">
                        {token.customerName}
                      </div>
                      {token.notes && (
                        <p className="text-[11px] text-slate-400 truncate max-w-xs">
                          {token.notes}
                        </p>
                      )}
                    </td>

                    {/* Phone */}
                    <td className="py-3.5 px-4 text-slate-400 hidden md:table-cell">
                      {token.phoneNumber ? (
                        <span className="flex items-center gap-1 font-mono">
                          <Phone className="w-3 h-3 text-slate-500" />
                          {token.phoneNumber}
                        </span>
                      ) : (
                        <span className="text-slate-600">-</span>
                      )}
                    </td>

                    {/* Wait Duration */}
                    <td className="py-3.5 px-4 text-slate-300">
                      <span className="flex items-center gap-1.5 font-medium text-slate-300">
                        <Clock className="w-3.5 h-3.5 text-slate-500" />
                        {formatDuration(token.createdAt)}
                      </span>
                    </td>

                    {/* Rearrange Reorder Buttons */}
                    <td className="py-3.5 px-4 text-center">
                      <div className="inline-flex items-center gap-1 bg-slate-950/80 p-1 rounded-xl border border-slate-800">
                        <button
                          onClick={() => onMoveUp(token)}
                          disabled={isFirst || isMoving}
                          title="Move Up"
                          className="p-1 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 disabled:opacity-20 disabled:hover:bg-transparent transition-colors cursor-pointer disabled:cursor-not-allowed"
                        >
                          <ArrowUp className="w-3.5 h-3.5" />
                        </button>
                        <button
                          onClick={() => onMoveDown(token)}
                          disabled={isLast || isMoving}
                          title="Move Down"
                          className="p-1 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 disabled:opacity-20 disabled:hover:bg-transparent transition-colors cursor-pointer disabled:cursor-not-allowed"
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
                        className="px-2.5 py-1 text-xs font-semibold text-rose-400 hover:text-rose-300 hover:bg-rose-500/10 border border-rose-500/20 rounded-lg transition-colors cursor-pointer"
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
