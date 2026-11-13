/**
 * Format sequence number to human-readable token code (e.g. QF-001)
 */
const formatTokenCode = (prefix = 'QF', sequence = 1) => {
  const cleanPrefix = (prefix || 'QF').trim().toUpperCase();
  const padded = String(sequence).padStart(3, '0');
  return `${cleanPrefix}-${padded}`;
};

/**
 * Calculate duration between two dates in minutes (rounded to 1 decimal)
 */
const calculateDurationInMinutes = (startDate, endDate) => {
  if (!startDate || !endDate) return 0;
  const diffMs = new Date(endDate) - new Date(startDate);
  if (diffMs <= 0) return 0;
  return Math.round((diffMs / (1000 * 60)) * 10) / 10;
};

/**
 * Calculate duration between two dates in human readable string (e.g., "4m 20s" or "12s")
 */
const formatDurationHuman = (startDate, endDate) => {
  if (!startDate) return '0s';
  const end = endDate ? new Date(endDate) : new Date();
  const diffSec = Math.max(0, Math.floor((end - new Date(startDate)) / 1000));
  const mins = Math.floor(diffSec / 60);
  const secs = diffSec % 60;
  if (mins === 0) return `${secs}s`;
  return `${mins}m ${secs}s`;
};

module.exports = {
  formatTokenCode,
  calculateDurationInMinutes,
  formatDurationHuman,
};
