import React from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { ArrowLeft, HelpCircle } from 'lucide-react';

const NotFoundPage = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-slate-950 flex flex-col items-center justify-center p-6 text-center">
      <div className="w-14 h-14 rounded-xl bg-slate-900 border border-slate-800 flex items-center justify-center text-sky-400 mb-4">
        <HelpCircle className="w-7 h-7" />
      </div>
      <h1 className="text-4xl font-extrabold text-white tracking-tight">404</h1>
      <h2 className="text-base font-bold text-slate-300 mt-2">Page or Counter Not Found</h2>
      <p className="text-xs text-slate-400 max-w-sm mt-1 mb-6 leading-relaxed">
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
          className="px-4 py-2 bg-slate-900 hover:bg-slate-800 border border-slate-800 text-slate-300 text-xs font-semibold rounded-lg transition-colors"
        >
          View Active Queues
        </Link>
      </div>
    </div>
  );
};

export default NotFoundPage;
