import React from 'react';

const LoadingSpinner = ({ size = 'md', text = 'Loading...' }) => {
  const sizeClasses = {
    sm: 'w-4 h-4 border-2',
    md: 'w-8 h-8 border-3',
    lg: 'w-12 h-12 border-4',
  };

  return (
    <div className="flex flex-col items-center justify-center p-8 gap-3">
      <div
        className={`${sizeClasses[size] || sizeClasses.md} rounded-full border-[#8C532B]/20 border-t-[#8C532B] dark:border-t-[#D4A373] animate-spin`}
      />
      {text && <p className="text-xs font-mono font-medium text-[#736A62] dark:text-[#A69B8F] tracking-wide">{text}</p>}
    </div>
  );
};

export default LoadingSpinner;
