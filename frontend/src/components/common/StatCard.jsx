import React from 'react';

const StatCard = ({ title, value, subtext, icon: Icon, color = 'slate' }) => {
  const iconColors = {
    slate: 'text-slate-600 bg-slate-100 border-slate-200 dark:text-slate-400 dark:bg-slate-800 dark:border-slate-700',
    sky: 'text-sky-600 bg-sky-50 border-sky-100 dark:text-sky-400 dark:bg-sky-950/60 dark:border-sky-800/60',
    emerald: 'text-emerald-600 bg-emerald-50 border-emerald-100 dark:text-emerald-400 dark:bg-emerald-950/60 dark:border-emerald-800/60',
    rose: 'text-rose-600 bg-rose-50 border-rose-100 dark:text-rose-400 dark:bg-rose-950/60 dark:border-rose-800/60',
    amber: 'text-amber-600 bg-amber-50 border-amber-100 dark:text-amber-400 dark:bg-amber-950/60 dark:border-amber-800/60',
  };

  const currentIconColor = iconColors[color] || iconColors.slate;

  return (
    <div className="bg-white dark:bg-slate-900 border border-slate-200/90 dark:border-slate-800 rounded-xl p-4 sm:p-5 shadow-xs transition-colors">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-xs font-semibold uppercase tracking-wider text-slate-500 dark:text-slate-400 mb-1">
            {title}
          </p>
          <h4 className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white tracking-tight">
            {value}
          </h4>
          {subtext && (
            <p className="text-xs text-slate-400 mt-1 font-medium">{subtext}</p>
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
