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
    <div className="bg-white dark:bg-[#26201B] border border-[#E6E0D4] dark:border-[#3E342C] rounded-2xl overflow-hidden shadow-sm">
      {/* Table Header and Search Controls */}
      <div className="p-4 sm:p-5 border-b border-[#E6E0D4] dark:border-[#3E342C] flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div className="flex items-center gap-2">
          <Layers className="w-5 h-5 text-[#8C532B] dark:text-[#C78753]" />
          <h3 className="text-base font-bold text-[#26221F] dark:text-[#FAF8F5] tracking-tight">
            Waiting Line
          </h3>
          <span className="px-2 py-0.5 rounded-full text-xs font-semibold bg-[#8C532B]/10 text-[#8C532B] dark:text-[#C78753]">
            {tokens.length} {tokens.length === 1 ? 'customer' : 'customers'}
          </span>
        </div>

        {/* Search Input */}
        <div className="relative w-full sm:w-64">
          <Search className="w-4 h-4 text-[#8C827A] absolute left-3 top-2.5" />
          <input
            type="text"
            placeholder="Search customer or token..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full bg-[#F8F6F0] dark:bg-[#1A1613] border border-[#E6E0D4] dark:border-[#3E342C] rounded-xl pl-9 pr-3.5 py-1.5 text-xs text-[#26221F] dark:text-[#FAF8F5] placeholder-[#8C827A] focus:outline-none focus:border-[#8C532B] transition-colors"
          />
        </div>
      </div>

      {/* Table Content */}
      {filteredTokens.length === 0 ? (
        <div className="p-12 text-center flex flex-col items-center justify-center">
          <div className="w-12 h-12 rounded-2xl bg-[#F8F6F0] dark:bg-[#1A1613] border border-[#E6E0D4] dark:border-[#3E342C] flex items-center justify-center text-[#8C532B] mb-3">
            <Clock className="w-6 h-6" />
          </div>
          <h4 className="text-sm font-bold text-[#26221F] dark:text-[#FAF8F5]">
            {searchTerm ? 'No matching records' : 'Waiting line is clear'}
          </h4>
          <p className="text-xs text-[#736A62] dark:text-[#A69B8F] max-w-sm mt-1 leading-relaxed">
            {searchTerm
              ? `No waiting customers match "${searchTerm}".`
              : emptyMessage}
          </p>
          {onAddPerson && !searchTerm && (
            <button
              onClick={onAddPerson}
              className="mt-4 px-5 py-2 bg-[#8C532B] hover:bg-[#774421] text-white text-xs font-mono font-bold rounded-xl shadow-sm transition-all cursor-pointer"
            >
              Add First Person
            </button>
          )}
        </div>
      ) : (
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm font-sans">
            <thead className="bg-[#FAF8F5] dark:bg-[#1A1613] text-[#8C827A] dark:text-[#A69B8F] font-semibold text-xs border-b border-[#E6E0D4] dark:border-[#3E342C]">
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
            <tbody className="divide-y divide-[#E6E0D4] dark:divide-[#3E342C]">
              {filteredTokens.map((token, index) => {
                const isFirst = index === 0;
                const isLast = index === filteredTokens.length - 1;
                const isMoving = movingTokenId === token._id;
                const isCopied = copiedId === token._id;

                return (
                  <tr
                    key={token._id}
                    className="hover:bg-[#F8F6F0] dark:hover:bg-[#2C241F] transition-colors duration-150"
                  >
                    {/* Position */}
                    <td className="py-3.5 px-4 text-center">
                      <span
                        className={`inline-flex items-center justify-center w-6 h-6 rounded-md font-bold text-xs ${
                          index === 0
                            ? 'bg-[#8C532B] text-white shadow-sm'
                            : 'bg-[#F8F6F0] dark:bg-[#1A1613] text-[#594F45] dark:text-[#D4CBBF] border border-[#E6E0D4] dark:border-[#3E342C]'
                        }`}
                      >
                        #{token.position || index + 1}
                      </span>
                    </td>

                    {/* Token Number with Copy Button */}
                    <td className="py-3.5 px-4 font-mono font-bold text-sm text-[#8C532B] dark:text-[#C78753]">
                      <div className="flex items-center gap-1.5">
                        <span>{token.tokenNumber}</span>
                        <button
                          onClick={() => copyToClipboard(token._id, token.tokenNumber)}
                          title="Copy token code"
                          className="text-[#8C827A] hover:text-[#8C532B] transition-colors cursor-pointer"
                        >
                          {isCopied ? (
                            <Check className="w-3 h-3 text-[#2E7D32]" />
                          ) : (
                            <Copy className="w-3 h-3" />
                          )}
                        </button>
                      </div>
                    </td>

                    {/* Customer */}
                    <td className="py-3.5 px-4 font-sans">
                      <div className="font-semibold text-[#26221F] dark:text-[#FAF8F5] text-xs sm:text-sm">
                        {token.customerName}
                      </div>
                      {token.notes && (
                        <p className="text-[11px] text-[#736A62] dark:text-[#A69B8F] truncate max-w-xs font-mono">
                          {token.notes}
                        </p>
                      )}
                    </td>

                    {/* Clickable Phone Number */}
                    <td className="py-3.5 px-4 text-[#736A62] dark:text-[#A69B8F] hidden md:table-cell">
                      {token.phoneNumber ? (
                        <a
                          href={`tel:${token.phoneNumber}`}
                          className="flex items-center gap-1 text-[#594F45] dark:text-[#D4CBBF] hover:text-[#8C532B] transition-colors"
                          title="Call customer"
                        >
                          <Phone className="w-3 h-3 text-[#8C827A]" />
                          <span>{token.phoneNumber}</span>
                        </a>
                      ) : (
                        <span className="text-[#8C827A]">-</span>
                      )}
                    </td>

                    {/* Wait Duration */}
                    <td className="py-3.5 px-4 text-[#736A62] dark:text-[#A69B8F]">
                      <span className="flex items-center gap-1.5 font-medium">
                        <Clock className="w-3.5 h-3.5 text-[#8C827A]" />
                        {formatDuration(token.createdAt)}
                      </span>
                    </td>

                    {/* Rearrange Reorder Buttons */}
                    <td className="py-3.5 px-4 text-center">
                      <div className="inline-flex items-center gap-1 bg-[#F8F6F0] dark:bg-[#1A1613] p-1 rounded-lg border border-[#E6E0D4] dark:border-[#3E342C]">
                        <button
                          onClick={() => onMoveUp(token)}
                          disabled={isFirst || isMoving}
                          title="Move Up"
                          className="p-1 rounded text-[#736A62] dark:text-[#A69B8F] hover:text-[#8C532B] hover:bg-[#E6E0D4] dark:hover:bg-[#322A24] disabled:opacity-20 disabled:hover:bg-transparent transition-colors cursor-pointer disabled:cursor-not-allowed"
                        >
                          <ArrowUp className="w-3.5 h-3.5" />
                        </button>
                        <button
                          onClick={() => onMoveDown(token)}
                          disabled={isLast || isMoving}
                          title="Move Down"
                          className="p-1 rounded text-[#736A62] dark:text-[#A69B8F] hover:text-[#8C532B] hover:bg-[#E6E0D4] dark:hover:bg-[#322A24] disabled:opacity-20 disabled:hover:bg-transparent transition-colors cursor-pointer disabled:cursor-not-allowed"
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
                        className="px-2.5 py-1 text-xs font-semibold text-[#B71C1C] hover:text-[#B71C1C] hover:bg-[#B71C1C]/10 border border-[#B71C1C]/30 rounded-md transition-colors cursor-pointer"
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
