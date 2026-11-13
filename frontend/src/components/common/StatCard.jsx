import React from 'react';

const StatCard = ({ title, value, subtext, icon: Icon, color = 'indigo' }) => {
  const colorSchemes = {
    indigo: {
      border: 'hover:border-indigo-500/40',
      iconBg: 'bg-indigo-500/10 text-indigo-400 border border-indigo-500/20',
      glow: 'group-hover:bg-indigo-500/5',
    },
    sky: {
      border: 'hover:border-sky-500/40',
      iconBg: 'bg-sky-500/10 text-sky-400 border border-sky-500/20',
      glow: 'group-hover:bg-sky-500/5',
    },
    emerald: {
      border: 'hover:border-emerald-500/40',
      iconBg: 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20',
      glow: 'group-hover:bg-emerald-500/5',
    },
    rose: {
      border: 'hover:border-rose-500/40',
      iconBg: 'bg-rose-500/10 text-rose-400 border border-rose-500/20',
      glow: 'group-hover:bg-rose-500/5',
    },
    amber: {
      border: 'hover:border-amber-500/40',
      iconBg: 'bg-amber-500/10 text-amber-400 border border-amber-500/20',
      glow: 'group-hover:bg-amber-500/5',
    },
  };

  const scheme = colorSchemes[color] || colorSchemes.indigo;

  return (
    <div
      className={`relative group bg-slate-900/80 border border-slate-800 rounded-2xl p-5 shadow-sm transition-all duration-200 overflow-hidden ${scheme.border}`}
    >
      <div
        className={`absolute inset-0 transition-colors duration-300 pointer-events-none ${scheme.glow}`}
      />
      <div className="relative flex items-center justify-between">
        <div>
          <p className="text-xs font-medium uppercase tracking-wider text-slate-400 mb-1">
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
          <div className={`p-3 rounded-xl shrink-0 ${scheme.iconBg}`}>
            <Icon className="w-5 h-5" />
          </div>
        )}
      </div>
    </div>
  );
};

export default StatCard;
