import React from 'react';
import { Link } from 'react-router-dom';
import { Cookie, ArrowLeft } from 'lucide-react';

const CookiePolicyPage = () => {
  return (
    <div className="min-h-screen bg-[#F8F6F0] dark:bg-[#1C1815] text-[#26221F] dark:text-[#FAF8F5] py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto space-y-8">
        <div className="flex items-center justify-between pb-4 border-b border-[#E6E0D4] dark:border-[#3E342C]">
          <Link
            to="/"
            className="flex items-center gap-2 text-xs font-mono uppercase text-[#8C532B] dark:text-[#D4A373] hover:text-[#774421] dark:hover:text-white transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Back to Dashboard</span>
          </Link>
          <span className="text-xs font-mono text-[#736A62] dark:text-[#A69B8F]">Last Updated: November 13, 2026</span>
        </div>

        <div className="space-y-4">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-md bg-[#8C532B]/10 border border-[#8C532B]/25 text-xs font-mono text-[#8C532B] dark:text-[#D4A373] font-medium">
            <Cookie className="w-4 h-4 text-[#8C532B] dark:text-[#D4A373]" />
            <span>Essential Storage & Cookie Transparency</span>
          </div>
          <h1 className="text-3xl font-extrabold text-[#26221F] dark:text-[#FAF8F5] tracking-tight">Cookie Policy</h1>
          <p className="text-sm text-[#736A62] dark:text-[#C7BCB0] leading-relaxed">
            This Cookie Policy describes how QueueFlow utilizes client-side storage technologies to support queue management workflows.
          </p>
        </div>

        <div className="space-y-6 text-sm text-[#26221F] dark:text-[#FAF8F5] leading-relaxed border-t border-[#E6E0D4] dark:border-[#3E342C] pt-6">
          <section className="space-y-2">
            <h2 className="text-lg font-bold text-[#26221F] dark:text-[#FAF8F5]">1. Strictly Essential Storage Only</h2>
            <p className="text-[#736A62] dark:text-[#C7BCB0]">
              Unlike marketing-heavy consumer sites, QueueFlow does NOT deploy tracking pixels, third-party social beacons, or behavioral advertising cookies. We only use strictly essential local storage tokens:
            </p>
            <div className="overflow-x-auto my-3">
              <table className="w-full text-left text-xs border border-[#E6E0D4] dark:border-[#3E342C] rounded-lg">
                <thead className="bg-[#FAF8F5] dark:bg-[#26201B] text-[#26221F] dark:text-[#FAF8F5] uppercase font-semibold">
                  <tr>
                    <th className="p-3 border-b border-[#E6E0D4] dark:border-[#3E342C]">Storage Key</th>
                    <th className="p-3 border-b border-[#E6E0D4] dark:border-[#3E342C]">Classification</th>
                    <th className="p-3 border-b border-[#E6E0D4] dark:border-[#3E342C]">Operational Purpose</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#E6E0D4] dark:divide-[#3E342C]">
                  <tr>
                    <td className="p-3 font-mono text-[#8C532B] dark:text-[#D4A373]">queueflow_token</td>
                    <td className="p-3">Strictly Necessary</td>
                    <td className="p-3 text-[#736A62] dark:text-[#C7BCB0]">Maintains cryptographically signed JWT session authorization between page requests.</td>
                  </tr>
                  <tr>
                    <td className="p-3 font-mono text-[#8C532B] dark:text-[#D4A373]">queueflow_manager</td>
                    <td className="p-3">Strictly Necessary</td>
                    <td className="p-3 text-[#736A62] dark:text-[#C7BCB0]">Caches active manager profile identity to eliminate unnecessary network re-fetches.</td>
                  </tr>
                  <tr>
                    <td className="p-3 font-mono text-[#8C532B] dark:text-[#D4A373]">queueflow_cookie_consent</td>
                    <td className="p-3">Compliance Preference</td>
                    <td className="p-3 text-[#736A62] dark:text-[#C7BCB0]">Stores GDPR cookie banner confirmation state.</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </section>

          <section className="space-y-2">
            <h2 className="text-lg font-bold text-[#26221F] dark:text-[#FAF8F5]">2. Managing Client Storage</h2>
            <p className="text-[#736A62] dark:text-[#C7BCB0]">
              You can clear your local session storage at any moment by clicking &quot;Logout&quot; in the bottom navigation menu or through your browser&apos;s developer tools and privacy settings. Clearing session storage will terminate your active queue console session.
            </p>
          </section>
        </div>
      </div>
    </div>
  );
};

export default CookiePolicyPage;
