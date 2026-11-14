import React from 'react';

const StatCard = ({ title, value, subtext, icon: Icon, color = 'slate' }) => {
  const iconColors = {
    slate: 'text-[#594F45] bg-[#F8F6F0] border-[#E6E0D4] dark:text-[#D4CBBF] dark:bg-[#322A24] dark:border-[#4A3E35]',
    sky: 'text-[#8C532B] bg-[#8C532B]/10 border-[#8C532B]/20 dark:text-[#C78753] dark:bg-[#8C532B]/15 dark:border-[#8C532B]/30',
    emerald: 'text-[#2E7D32] bg-[#2E7D32]/10 border-[#2E7D32]/20 dark:text-[#4CAF50] dark:bg-[#2E7D32]/15 dark:border-[#2E7D32]/30',
    rose: 'text-[#B71C1C] bg-[#B71C1C]/10 border-[#B71C1C]/20 dark:text-[#EF5350] dark:bg-[#B71C1C]/15 dark:border-[#B71C1C]/30',
    amber: 'text-[#B87A44] bg-[#B87A44]/10 border-[#B87A44]/20 dark:text-[#D4955F] dark:bg-[#B87A44]/15 dark:border-[#B87A44]/30',
  };

  const currentIconColor = iconColors[color] || iconColors.slate;

  return (
    <div className="bg-white dark:bg-[#26201B] border border-[#E6E0D4] dark:border-[#3E342C] rounded-2xl p-4 sm:p-5 shadow-xs relative overflow-hidden transition-all duration-200 ease-out hover:border-[#8C532B]/50 hover:-translate-y-0.5 hover:shadow-md">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-xs font-semibold text-[#8C827A] dark:text-[#A69B8F] mb-1">
            {title}
          </p>
          <h4 className="text-2xl sm:text-3xl font-extrabold text-[#26221F] dark:text-[#FAF8F5] tracking-tight">
            {value}
          </h4>
          {subtext && (
            <p className="text-xs text-[#A69B8F] dark:text-[#7A6F66] mt-1 font-normal">{subtext}</p>
          )}
        </div>
        {Icon && (
          <div className={`p-2.5 rounded-xl border shrink-0 ${currentIconColor}`}>
            <Icon className="w-5 h-5" />
          </div>
        )}
      </div>
    </div>
  );
};

export default StatCard;
