import React, { useState, useEffect, useCallback } from 'react';
import {
  History,
  Search,
  RefreshCw,
  Phone,
  Clock,
  CheckCircle,
  Copy,
  Check,
  Printer,
} from 'lucide-react';
import { tokenService } from '../services/tokenService';
import { queueService } from '../services/queueService';
import { useToast } from '../hooks/useToast';
import LoadingSpinner from '../components/common/LoadingSpinner';
import {
  formatDateTime,
  formatDuration,
  getStatusBadgeStyle,
} from '../utils/formatters';

const TokenHistoryPage = () => {
  const [tokens, setTokens] = useState([]);
  const [queues, setQueues] = useState([]);
  const [selectedQueue, setSelectedQueue] = useState('');
  const [selectedStatus, setSelectedStatus] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [copiedId, setCopiedId] = useState(null);
  const toast = useToast();

  const fetchTokens = useCallback(async (isSilent = false) => {
    if (!isSilent) setLoading(true);
    else setRefreshing(true);

    try {
      const params = { limit: 100 };
      if (selectedQueue) params.queueId = selectedQueue;
      if (selectedStatus) params.status = selectedStatus;
      if (searchTerm.trim()) params.search = searchTerm.trim();

      const [tokenRes, queueRes] = await Promise.all([
        tokenService.getTokens(params),
        queueService.getQueues(),
      ]);

      if (tokenRes.success) setTokens(tokenRes.data);
      if (queueRes.success) setQueues(queueRes.data);
    } catch (err) {
      toast.error('Failed to load token history');
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }, [selectedQueue, selectedStatus, searchTerm, toast]);

  useEffect(() => {
    fetchTokens();
  }, [fetchTokens]);

  const copyTokenCode = (id, text) => {
    navigator.clipboard.writeText(text);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  if (loading) {
    return <LoadingSpinner size="lg" text="Loading Token Audit Trail..." />;
  }

  return (
    <div className="space-y-6" id="main-content">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-2">
        <div>
          <div className="flex items-center gap-2">
            <History className="w-5 h-5 text-[#8C532B] dark:text-[#C78753]" />
            <h2 className="text-xl sm:text-2xl font-bold text-[#26221F] dark:text-[#FAF8F5] tracking-tight font-mono">
              AUDIT TELEMETRY & TOKEN LOG
            </h2>
          </div>
          <p className="text-xs sm:text-sm font-mono text-[#736A62] dark:text-[#A69B8F] mt-0.5">
            IMMUTABLE LIFECYCLE AUDIT OF ALL GENERATED TOKENS AND DURATION TIMESTAMPS
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => window.print()}
            className="flex items-center gap-1.5 px-3 py-2 rounded-lg bg-white dark:bg-[#26201B] border border-[#E6E0D4] dark:border-[#3E342C] hover:border-[#8C532B]/40 text-xs font-mono uppercase text-[#594F45] dark:text-[#FAF8F5] shadow-xs transition-all cursor-pointer"
            title="Print log"
          >
            <Printer className="w-3.5 h-3.5 text-[#8C532B] dark:text-[#C78753]" />
            <span>PRINT LOG</span>
          </button>

          <button
            onClick={() => fetchTokens(true)}
            disabled={refreshing}
            className="flex items-center gap-2 px-3.5 py-2 rounded-lg bg-white dark:bg-[#26201B] border border-[#E6E0D4] dark:border-[#3E342C] hover:border-[#8C532B]/40 text-xs font-mono uppercase text-[#594F45] dark:text-[#FAF8F5] shadow-xs transition-all cursor-pointer"
          >
            <RefreshCw className={`w-3.5 h-3.5 text-[#8C532B] dark:text-[#C78753] ${refreshing ? 'animate-spin' : ''}`} />
            <span>SYNC</span>
          </button>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="bg-white dark:bg-[#26201B] border border-[#E6E0D4] dark:border-[#3E342C] rounded-xl p-4 flex flex-col md:flex-row items-center justify-between gap-3 shadow-sm">
        {/* Search */}
        <div className="relative w-full md:w-80">
          <Search className="w-4 h-4 text-[#8C827A] absolute left-3.5 top-3" />
          <input
            type="text"
            placeholder="Search by name, token #, phone..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full bg-[#F8F6F0] dark:bg-[#1A1613] border border-[#E6E0D4] dark:border-[#3E342C] rounded-lg pl-10 pr-3.5 py-2 text-xs text-[#26221F] dark:text-[#FAF8F5] placeholder-[#8C827A] focus:outline-none focus:border-[#8C532B] font-mono transition-all"
          />
        </div>

        {/* Dropdowns */}
        <div className="flex items-center gap-2.5 w-full md:w-auto font-mono text-xs">
          {/* Queue Filter */}
          <select
            value={selectedQueue}
            onChange={(e) => setSelectedQueue(e.target.value)}
            className="bg-[#F8F6F0] dark:bg-[#1A1613] border border-[#E6E0D4] dark:border-[#3E342C] rounded-lg px-3 py-2 text-xs text-[#26221F] dark:text-[#FAF8F5] focus:outline-none focus:border-[#8C532B] flex-1 md:flex-initial transition-all"
          >
            <option value="">ALL QUEUES</option>
            {queues.map((q) => (
              <option key={q._id} value={q._id}>
                {q.name} ({q.prefix})
              </option>
            ))}
          </select>

          {/* Status Filter */}
          <select
            value={selectedStatus}
            onChange={(e) => setSelectedStatus(e.target.value)}
            className="bg-[#F8F6F0] dark:bg-[#1A1613] border border-[#E6E0D4] dark:border-[#3E342C] rounded-lg px-3 py-2 text-xs text-[#26221F] dark:text-[#FAF8F5] focus:outline-none focus:border-[#8C532B] flex-1 md:flex-initial transition-all"
          >
            <option value="">ALL STATUSES</option>
            <option value="WAITING">WAITING</option>
            <option value="SERVING">SERVING</option>
            <option value="COMPLETED">COMPLETED</option>
            <option value="CANCELLED">CANCELLED</option>
          </select>
        </div>
      </div>

      {/* Audit Log Table */}
      <div className="bg-white dark:bg-[#26201B] border border-[#E6E0D4] dark:border-[#3E342C] rounded-xl overflow-hidden shadow-sm">
        {tokens.length === 0 ? (
          <div className="p-12 text-center flex flex-col items-center justify-center">
            <History className="w-12 h-12 text-[#8C827A] mb-3" />
            <h4 className="text-sm font-semibold text-[#26221F] dark:text-[#FAF8F5] font-mono">
              NO AUDIT RECORDS FOUND
            </h4>
            <p className="text-xs font-mono text-[#736A62] dark:text-[#A69B8F] max-w-sm mt-1">
              Try adjusting your query parameters or counter filter.
            </p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-[#FAF8F5] dark:bg-[#1A1613] text-[#8C827A] dark:text-[#A69B8F] font-mono uppercase tracking-wider text-[11px] border-b border-[#E6E0D4] dark:border-[#3E342C]">
                <tr>
                  <th className="py-3 px-4">Token #</th>
                  <th className="py-3 px-4">Customer Name</th>
                  <th className="py-3 px-4">Counter</th>
                  <th className="py-3 px-4">Status</th>
                  <th className="py-3 px-4">Created</th>
                  <th className="py-3 px-4">Service Details</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#E6E0D4] dark:divide-[#3E342C]">
                {tokens.map((token) => {
                  const badge = getStatusBadgeStyle(token.status);
                  const isCopied = copiedId === token._id;
                  const serviceDuration =
                    token.serviceStartedAt && token.serviceCompletedAt
                      ? formatDuration(token.serviceStartedAt, token.serviceCompletedAt)
                      : token.serviceStartedAt
                      ? `${formatDuration(token.serviceStartedAt)} (In progress)`
                      : '-';

                  return (
                    <tr
                      key={token._id}
                      className="hover:bg-[#FAF8F5] dark:hover:bg-[#322A24] transition-colors"
                    >
                      <td className="py-3.5 px-4 font-mono font-bold text-sm text-[#8C532B] dark:text-[#C78753]">
                        <div className="flex items-center gap-1.5">
                          <span>{token.tokenNumber}</span>
                          <button
                            onClick={() => copyTokenCode(token._id, token.tokenNumber)}
                            title="Copy token code"
                            className="text-[#8C827A] hover:text-[#8C532B] transition-colors cursor-pointer"
                          >
                            {isCopied ? <Check className="w-3 h-3 text-[#2E7D32]" /> : <Copy className="w-3 h-3" />}
                          </button>
                        </div>
                      </td>
                      <td className="py-3.5 px-4">
                        <div className="font-semibold text-[#26221F] dark:text-[#FAF8F5]">
                          {token.customerName}
                        </div>
                        {token.phoneNumber && (
                          <a
                            href={`tel:${token.phoneNumber}`}
                            className="text-[11px] text-[#736A62] dark:text-[#A69B8F] hover:text-[#8C532B] flex items-center gap-1 font-mono mt-0.5 transition-colors"
                          >
                            <Phone className="w-3 h-3 text-[#8C827A]" />
                            <span>{token.phoneNumber}</span>
                          </a>
                        )}
                      </td>
                      <td className="py-3.5 px-4 text-[#594F45] dark:text-[#D4CBBF] font-mono">
                        {token.queueId?.name || 'General Counter'}
                      </td>
                      <td className="py-3.5 px-4">
                        <span
                          className={`inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded text-[11px] font-mono font-semibold ${badge.bg}`}
                        >
                          <span className={`w-1.5 h-1.5 rounded-full ${badge.dot}`} />
                          {badge.label}
                        </span>
                      </td>
                      <td className="py-3.5 px-4 text-[#736A62] dark:text-[#A69B8F] font-mono text-[11px]">
                        {formatDateTime(token.createdAt)}
                      </td>
                      <td className="py-3.5 px-4 text-[#594F45] dark:text-[#D4CBBF] font-mono text-[11px]">
                        {token.status === 'COMPLETED' ? (
                          <span className="flex items-center gap-1.5 text-[#2E7D32] dark:text-[#4CAF50] font-medium">
                            <CheckCircle className="w-3.5 h-3.5" />
                            <span>Served in {serviceDuration}</span>
                          </span>
                        ) : token.status === 'SERVING' ? (
                          <span className="flex items-center gap-1.5 text-[#B87A44] dark:text-[#D4955F] font-medium">
                            <Clock className="w-3.5 h-3.5" />
                            <span>Serving ({serviceDuration})</span>
                          </span>
                        ) : (
                          <span className="text-[#8C827A]">-</span>
                        )}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
};

export default TokenHistoryPage;
