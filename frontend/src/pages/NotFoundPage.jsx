import React from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { ArrowLeft, HelpCircle } from 'lucide-react';

const NotFoundPage = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 flex flex-col items-center justify-center p-6 text-center transition-colors">
      <div className="w-14 h-14 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 flex items-center justify-center text-sky-600 dark:text-sky-400 mb-4 shadow-xs">
        <HelpCircle className="w-7 h-7" />
      </div>
      <h1 className="text-4xl font-extrabold text-slate-900 dark:text-white tracking-tight">404</h1>
      <h2 className="text-base font-bold text-slate-800 dark:text-slate-300 mt-2">Page or Counter Not Found</h2>
      <p className="text-xs text-slate-500 dark:text-slate-400 max-w-sm mt-1 mb-6 leading-relaxed">
        The counter console or address you navigated to does not exist or has been relocated.
      </p>
      <div className="flex items-center gap-3">
        <button
          onClick={() => navigate('/')}
          className="flex items-center gap-2 px-4 py-2 bg-sky-600 hover:bg-sky-500 text-white text-xs font-semibold rounded-lg shadow-sm transition-colors cursor-pointer"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Return to Dashboard</span>
        </button>
        <Link
          to="/queues"
          className="px-4 py-2 bg-white hover:bg-slate-100 dark:bg-slate-900 dark:hover:bg-slate-800 border border-slate-200 dark:border-slate-800 text-slate-700 dark:text-slate-300 text-xs font-semibold rounded-lg shadow-xs transition-colors"
        >
          View Active Queues
        </Link>
      </div>
    </div>
  );
};

export default NotFoundPage;
