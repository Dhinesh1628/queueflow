import React from 'react';

const StatCard = ({ title, value, subtext, icon: Icon, color = 'slate' }) => {
  const iconColors = {
    slate: 'text-slate-600 bg-slate-100 border-slate-200 dark:text-slate-300 dark:bg-white/[0.05] dark:border-white/[0.08]',
    sky: 'text-sky-600 bg-sky-50 border-sky-100 dark:text-cyan-400 dark:bg-cyan-500/10 dark:border-cyan-500/25 dark:shadow-[0_0_10px_rgba(6,182,212,0.2)]',
    emerald: 'text-emerald-600 bg-emerald-50 border-emerald-100 dark:text-emerald-400 dark:bg-emerald-500/10 dark:border-emerald-500/25 dark:shadow-[0_0_10px_rgba(16,185,129,0.2)]',
    rose: 'text-rose-600 bg-rose-50 border-rose-100 dark:text-rose-400 dark:bg-rose-500/10 dark:border-rose-500/25 dark:shadow-[0_0_10px_rgba(244,63,94,0.2)]',
    amber: 'text-amber-600 bg-amber-50 border-amber-100 dark:text-amber-400 dark:bg-amber-500/10 dark:border-amber-500/25 dark:shadow-[0_0_10px_rgba(245,158,11,0.2)]',
  };

  const currentIconColor = iconColors[color] || iconColors.slate;

  return (
    <div className="bg-white dark:bg-[#0D121F] border border-slate-200/90 dark:border-white/[0.08] rounded-xl p-4 sm:p-5 shadow-xs dark:shadow-[0_4px_20px_rgba(0,0,0,0.35)] relative overflow-hidden transition-all hover:border-cyan-500/30">
      <div className="flex items-center justify-between">
        <div>
          <p className="font-mono text-[11px] font-semibold uppercase tracking-wider text-slate-500 dark:text-slate-400 mb-1">
            {title}
          </p>
          <h4 className="font-mono text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white tracking-tight">
            {value}
          </h4>
          {subtext && (
            <p className="font-mono text-[11px] text-slate-400 dark:text-slate-400 mt-1 font-medium">{subtext}</p>
          )}
        </div>
        {Icon && (
          <div className={`p-2.5 rounded-lg border shrink-0 ${currentIconColor}`}>
            <Icon className="w-5 h-5" />
          </div>
        )}
      </div>
    </div>
  );
};

export default StatCard;
