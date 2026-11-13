import React from 'react';

const StatCard = ({ title, value, subtext, icon: Icon, color = 'slate' }) => {
  const iconColors = {
    slate: 'text-slate-400 bg-slate-800 border-slate-700',
    sky: 'text-sky-400 bg-sky-950/60 border-sky-800/60',
    emerald: 'text-emerald-400 bg-emerald-950/60 border-emerald-800/60',
    rose: 'text-rose-400 bg-rose-950/60 border-rose-800/60',
    amber: 'text-amber-400 bg-amber-950/60 border-amber-800/60',
  };

  const currentIconColor = iconColors[color] || iconColors.slate;

  return (
    <div className="bg-slate-900 border border-slate-800 rounded-xl p-4 sm:p-5 shadow-sm">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-xs font-semibold uppercase tracking-wider text-slate-400 mb-1">
            {title}
          </p>
          <h4 className="text-2xl sm:text-3xl font-bold text-white tracking-tight">
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
