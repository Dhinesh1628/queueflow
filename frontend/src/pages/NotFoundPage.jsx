import React from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { ArrowLeft, HelpCircle } from 'lucide-react';

const NotFoundPage = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-[#F8F6F0] dark:bg-[#1C1815] text-[#26221F] dark:text-[#FAF8F5] flex flex-col items-center justify-center p-6 text-center transition-colors">
      <div className="w-14 h-14 rounded-2xl bg-white dark:bg-[#26201B] border border-[#E6E0D4] dark:border-[#3E342C] flex items-center justify-center text-[#8C532B] dark:text-[#D4A373] mb-4 shadow-sm">
        <HelpCircle className="w-7 h-7" />
      </div>
      <h1 className="text-4xl font-extrabold text-[#26221F] dark:text-[#FAF8F5] tracking-tight">404</h1>
      <h2 className="text-base font-bold text-[#26221F] dark:text-[#FAF8F5] mt-2">Page or Counter Not Found</h2>
      <p className="text-xs text-[#736A62] dark:text-[#A69B8F] max-w-sm mt-1 mb-6 leading-relaxed">
        The counter console or address you navigated to does not exist or has been relocated.
      </p>
      <div className="flex items-center gap-3">
        <button
          onClick={() => navigate('/')}
          className="flex items-center gap-2 px-4 py-2 bg-[#8C532B] hover:bg-[#774421] text-white text-xs font-semibold rounded-xl shadow-sm transition-colors cursor-pointer"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Return to Dashboard</span>
        </button>
        <Link
          to="/queues"
          className="px-4 py-2 bg-white hover:bg-[#F2ECE1] dark:bg-[#26201B] dark:hover:bg-[#322A23] border border-[#E6E0D4] dark:border-[#3E342C] text-[#26221F] dark:text-[#FAF8F5] text-xs font-semibold rounded-xl shadow-xs transition-colors"
        >
          View Active Queues
        </Link>
      </div>
    </div>
  );
};

export default NotFoundPage;
