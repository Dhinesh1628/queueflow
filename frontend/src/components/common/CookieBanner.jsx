import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { ShieldCheck, X } from 'lucide-react';

const CookieBanner = () => {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const consent = localStorage.getItem('queueflow_cookie_consent');
    if (!consent) {
      setIsVisible(true);
    }
  }, []);

  const handleAcceptAll = () => {
    localStorage.setItem('queueflow_cookie_consent', 'accepted_all');
    setIsVisible(false);
  };

  const handleEssentialOnly = () => {
    localStorage.setItem('queueflow_cookie_consent', 'essential_only');
    setIsVisible(false);
  };

  if (!isVisible) return null;

  return (
    <div className="fixed bottom-4 left-4 right-4 md:left-8 md:right-auto md:max-w-md z-50 bg-white dark:bg-[#26201B] border border-[#E6E0D4] dark:border-[#3E342C] rounded-2xl p-4 shadow-xl dark:shadow-2xl text-xs text-[#26221F] dark:text-[#FAF8F5]">
      <div className="flex items-start gap-3 mb-3">
        <ShieldCheck className="w-5 h-5 text-[#8C532B] dark:text-[#D4A373] shrink-0 mt-0.5" />
        <div>
          <h4 className="font-semibold text-[#26221F] dark:text-[#FAF8F5] text-sm">Privacy & Cookie Preferences</h4>
          <p className="text-[#736A62] dark:text-[#C7BCB0] mt-1 leading-relaxed">
            QueueFlow uses strictly essential session storage for authentication and queue state integrity. We do not use third-party advertising trackers or sell personal data.
          </p>
        </div>
      </div>

      <div className="flex items-center justify-between gap-2 pt-2 border-t border-[#E6E0D4] dark:border-[#3E342C]">
        <Link
          to="/cookies"
          className="text-[#8C532B] dark:text-[#D4A373] hover:text-[#774421] underline font-medium"
        >
          Cookie Policy
        </Link>

        <div className="flex items-center gap-2">
          <button
            onClick={handleEssentialOnly}
            className="px-3 py-1.5 bg-[#F2ECE1] hover:bg-[#E6E0D4] dark:bg-[#322A23] dark:hover:bg-[#3E342C] text-[#26221F] dark:text-[#FAF8F5] font-semibold rounded-xl transition-colors cursor-pointer"
          >
            Essential Only
          </button>
          <button
            onClick={handleAcceptAll}
            className="px-3 py-1.5 bg-[#8C532B] hover:bg-[#774421] text-white font-semibold rounded-xl shadow-sm transition-colors cursor-pointer"
          >
            Accept All
          </button>
        </div>
      </div>
    </div>
  );
};

export default CookieBanner;
