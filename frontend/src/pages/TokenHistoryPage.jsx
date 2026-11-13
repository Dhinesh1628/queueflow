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
            <History className="w-5 h-5 text-sky-400" />
            <h2 className="text-xl sm:text-2xl font-bold text-white tracking-tight">
              Token History & Audit Log
            </h2>
          </div>
          <p className="text-xs sm:text-sm text-slate-400 mt-0.5">
            Complete lifecycle records of all customer tokens and service durations
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => window.print()}
            className="flex items-center gap-1.5 px-3 py-2 rounded-lg bg-slate-900 border border-slate-800 text-xs font-semibold text-slate-300 hover:text-white transition-colors cursor-pointer"
            title="Print log"
          >
            <Printer className="w-3.5 h-3.5" />
            <span>Print Log</span>
          </button>

          <button
            onClick={() => fetchTokens(true)}
            disabled={refreshing}
            className="flex items-center gap-2 px-3 py-2 rounded-lg bg-slate-900 border border-slate-800 text-xs font-semibold text-slate-300 hover:text-white transition-colors cursor-pointer"
          >
            <RefreshCw className={`w-3.5 h-3.5 ${refreshing ? 'animate-spin' : ''}`} />
            <span>Refresh</span>
          </button>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="bg-slate-900 border border-slate-800 rounded-xl p-4 flex flex-col md:flex-row items-center justify-between gap-3 shadow-sm">
        {/* Search */}
        <div className="relative w-full md:w-72">
          <Search className="w-4 h-4 text-slate-500 absolute left-3.5 top-3" />
          <input
            type="text"
            placeholder="Search by name, token #, phone..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full bg-slate-950 border border-slate-800 rounded-lg pl-10 pr-3.5 py-2 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-sky-500 focus:ring-1 focus:ring-sky-500"
          />
        </div>

        {/* Dropdowns */}
        <div className="flex items-center gap-2.5 w-full md:w-auto">
          {/* Queue Filter */}
          <select
            value={selectedQueue}
            onChange={(e) => setSelectedQueue(e.target.value)}
            className="bg-slate-950 border border-slate-800 rounded-lg px-3 py-2 text-xs text-slate-200 focus:outline-none focus:border-sky-500 flex-1 md:flex-initial"
          >
            <option value="">All Queues</option>
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
            className="bg-slate-950 border border-slate-800 rounded-lg px-3 py-2 text-xs text-slate-200 focus:outline-none focus:border-sky-500 flex-1 md:flex-initial"
          >
            <option value="">All Statuses</option>
            <option value="WAITING">Waiting</option>
            <option value="SERVING">Serving</option>
            <option value="COMPLETED">Completed</option>
            <option value="CANCELLED">Cancelled</option>
          </select>
        </div>
      </div>

      {/* Audit Log Table */}
      <div className="bg-slate-900 border border-slate-800 rounded-xl overflow-hidden shadow-sm">
        {tokens.length === 0 ? (
          <div className="p-12 text-center flex flex-col items-center justify-center">
            <History className="w-12 h-12 text-slate-600 mb-3" />
            <h4 className="text-sm font-semibold text-slate-200">
              No token history found
            </h4>
            <p className="text-xs text-slate-400 max-w-sm mt-1">
              Try adjusting your search criteria or queue filter to locate records.
            </p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-950 text-slate-400 font-semibold uppercase tracking-wider text-[11px] border-b border-slate-800">
                <tr>
                  <th className="py-3 px-4">Token #</th>
                  <th className="py-3 px-4">Customer Name</th>
                  <th className="py-3 px-4">Queue</th>
                  <th className="py-3 px-4">Status</th>
                  <th className="py-3 px-4">Created</th>
                  <th className="py-3 px-4">Service Details</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/60">
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
                      className="hover:bg-slate-800/40 transition-colors"
                    >
                      <td className="py-3.5 px-4 font-mono font-bold text-sm text-sky-400">
                        <div className="flex items-center gap-1.5">
                          <span>{token.tokenNumber}</span>
                          <button
                            onClick={() => copyTokenCode(token._id, token.tokenNumber)}
                            title="Copy token code"
                            className="text-slate-500 hover:text-white transition-colors cursor-pointer"
                          >
                            {isCopied ? <Check className="w-3 h-3 text-emerald-400" /> : <Copy className="w-3 h-3" />}
                          </button>
                        </div>
                      </td>
                      <td className="py-3.5 px-4">
                        <div className="font-semibold text-white">
                          {token.customerName}
                        </div>
                        {token.phoneNumber && (
                          <a
                            href={`tel:${token.phoneNumber}`}
                            className="text-[11px] text-slate-400 hover:text-sky-400 flex items-center gap-1 font-mono mt-0.5 transition-colors"
                          >
                            <Phone className="w-3 h-3 text-slate-500" />
                            <span>{token.phoneNumber}</span>
                          </a>
                        )}
                      </td>
                      <td className="py-3.5 px-4 text-slate-300 font-medium">
                        {token.queueId?.name || 'General Counter'}
                      </td>
                      <td className="py-3.5 px-4">
                        <span
                          className={`inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded text-[11px] font-semibold ${badge.bg}`}
                        >
                          <span className={`w-1.5 h-1.5 rounded-full ${badge.dot}`} />
                          {badge.label}
                        </span>
                      </td>
                      <td className="py-3.5 px-4 text-slate-400">
                        {formatDateTime(token.createdAt)}
                      </td>
                      <td className="py-3.5 px-4 text-slate-300">
                        {token.status === 'COMPLETED' ? (
                          <span className="flex items-center gap-1.5 text-emerald-400 font-medium">
                            <CheckCircle className="w-3.5 h-3.5" />
                            <span>Served in {serviceDuration}</span>
                          </span>
                        ) : token.status === 'SERVING' ? (
                          <span className="flex items-center gap-1.5 text-amber-400 font-medium">
                            <Clock className="w-3.5 h-3.5" />
                            <span>Serving ({serviceDuration})</span>
                          </span>
                        ) : (
                          <span className="text-slate-600">-</span>
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
