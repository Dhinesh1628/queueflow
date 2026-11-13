/**
 * Format timestamp into standard date-time string
 */
export const formatDateTime = (dateString) => {
  if (!dateString) return '-';
  const date = new Date(dateString);
  return new Intl.DateTimeFormat('en-US', {
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  }).format(date);
};

/**
 * Format timestamp into relative elapsed or time string (e.g. "12m ago")
 */
export const formatTimeAgo = (dateString) => {
  if (!dateString) return '-';
  const diffMs = Date.now() - new Date(dateString).getTime();
  const diffSec = Math.floor(diffMs / 1000);
  if (diffSec < 60) return `${diffSec}s ago`;
  const diffMin = Math.floor(diffSec / 60);
  if (diffMin < 60) return `${diffMin}m ago`;
  const diffHrs = Math.floor(diffMin / 60);
  if (diffHrs < 24) return `${diffHrs}h ago`;
  const diffDays = Math.floor(diffHrs / 24);
  return `${diffDays}d ago`;
};

/**
 * Format duration between two timestamps
 */
export const formatDuration = (startDate, endDate) => {
  if (!startDate) return '0s';
  const end = endDate ? new Date(endDate) : new Date();
  const diffSec = Math.max(0, Math.floor((end - new Date(startDate)) / 1000));
  const mins = Math.floor(diffSec / 60);
  const secs = diffSec % 60;
  if (mins === 0) return `${secs}s`;
  if (mins < 60) return `${mins}m ${secs}s`;
  const hrs = Math.floor(mins / 60);
  const remMins = mins % 60;
  return `${hrs}h ${remMins}m`;
};

/**
 * Return CSS classes and badge styling for Token Status
 */
export const getStatusBadgeStyle = (status) => {
  switch (status?.toUpperCase()) {
    case 'WAITING':
      return {
        bg: 'bg-indigo-500/10 text-indigo-400 border border-indigo-500/30',
        dot: 'bg-indigo-400',
        label: 'Waiting',
      };
    case 'SERVING':
      return {
        bg: 'bg-sky-500/15 text-sky-300 border border-sky-500/40 animate-pulse',
        dot: 'bg-sky-400 animate-ping',
        label: 'Serving',
      };
    case 'COMPLETED':
      return {
        bg: 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/30',
        dot: 'bg-emerald-400',
        label: 'Completed',
      };
    case 'CANCELLED':
      return {
        bg: 'bg-rose-500/10 text-rose-400 border border-rose-500/30',
        dot: 'bg-rose-400',
        label: 'Cancelled',
      };
    default:
      return {
        bg: 'bg-slate-800 text-slate-400 border border-slate-700',
        dot: 'bg-slate-400',
        label: status || 'Unknown',
      };
  }
};
