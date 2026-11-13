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
 * Return CSS classes and badge styling for Token Status matching CKD design guidelines
 */
export const getStatusBadgeStyle = (status) => {
  switch (status?.toUpperCase()) {
    case 'WAITING':
      return {
        bg: 'bg-sky-50 text-sky-700 border border-sky-200 dark:bg-sky-950/60 dark:text-sky-300 dark:border-sky-800',
        dot: 'bg-sky-500',
        label: 'Waiting',
      };
    case 'SERVING':
      return {
        bg: 'bg-amber-50 text-amber-700 border border-amber-200 dark:bg-amber-950/60 dark:text-amber-300 dark:border-amber-800',
        dot: 'bg-amber-500 animate-ping',
        label: 'Serving',
      };
    case 'COMPLETED':
      return {
        bg: 'bg-emerald-50 text-emerald-700 border border-emerald-200 dark:bg-emerald-950/60 dark:text-emerald-300 dark:border-emerald-800',
        dot: 'bg-emerald-500',
        label: 'Completed',
      };
    case 'CANCELLED':
      return {
        bg: 'bg-rose-50 text-rose-700 border border-rose-200 dark:bg-rose-950/60 dark:text-rose-300 dark:border-rose-800',
        dot: 'bg-rose-500',
        label: 'Cancelled',
      };
    default:
      return {
        bg: 'bg-slate-100 text-slate-700 border border-slate-200 dark:bg-slate-800 dark:text-slate-300 dark:border-slate-700',
        dot: 'bg-slate-400',
        label: status || 'Unknown',
      };
  }
};
