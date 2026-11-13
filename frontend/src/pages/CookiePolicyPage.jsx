import React from 'react';
import { Link } from 'react-router-dom';
import { Cookie, ArrowLeft } from 'lucide-react';

const CookiePolicyPage = () => {
  return (
    <div className="min-h-screen bg-slate-50 dark:bg-[#080B11] text-slate-800 dark:text-slate-100 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto space-y-8">
        <div className="flex items-center justify-between pb-4 border-b border-slate-200 dark:border-white/[0.08]">
          <Link
            to="/"
            className="flex items-center gap-2 text-xs font-mono uppercase text-cyan-600 dark:text-cyan-400 hover:text-cyan-700 dark:hover:text-cyan-300 transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Back to Dashboard</span>
          </Link>
          <span className="text-xs font-mono text-slate-500">Last Updated: November 13, 2026</span>
        </div>

        <div className="space-y-4">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-md bg-cyan-50 dark:bg-cyan-500/10 border border-cyan-200 dark:border-cyan-500/20 text-xs font-mono text-cyan-700 dark:text-cyan-300 font-medium">
            <Cookie className="w-4 h-4 text-cyan-500" />
            <span>Essential Storage & Cookie Transparency</span>
          </div>
          <h1 className="text-3xl font-extrabold text-slate-900 dark:text-white tracking-tight">Cookie Policy</h1>
          <p className="text-sm text-slate-600 dark:text-slate-400 leading-relaxed">
            This Cookie Policy describes how QueueFlow utilizes client-side storage technologies to support queue management workflows.
          </p>
        </div>

        <div className="space-y-6 text-sm text-slate-700 dark:text-slate-300 leading-relaxed border-t border-slate-200 dark:border-slate-800/80 pt-6">
          <section className="space-y-2">
            <h2 className="text-lg font-bold text-slate-900 dark:text-white">1. Strictly Essential Storage Only</h2>
            <p>
              Unlike marketing-heavy consumer sites, QueueFlow does NOT deploy tracking pixels, third-party social beacons, or behavioral advertising cookies. We only use strictly essential local storage tokens:
            </p>
            <div className="overflow-x-auto my-3">
              <table className="w-full text-left text-xs border border-slate-800">
                <thead className="bg-slate-900 text-slate-300 uppercase font-semibold">
                  <tr>
                    <th className="p-3 border-b border-slate-800">Storage Key</th>
                    <th className="p-3 border-b border-slate-800">Classification</th>
                    <th className="p-3 border-b border-slate-800">Operational Purpose</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-800/60">
                  <tr>
                    <td className="p-3 font-mono text-sky-400">queueflow_token</td>
                    <td className="p-3">Strictly Necessary</td>
                    <td className="p-3 text-slate-400">Maintains cryptographically signed JWT session authorization between page requests.</td>
                  </tr>
                  <tr>
                    <td className="p-3 font-mono text-sky-400">queueflow_manager</td>
                    <td className="p-3">Strictly Necessary</td>
                    <td className="p-3 text-slate-400">Caches active manager profile identity to eliminate unnecessary network re-fetches.</td>
                  </tr>
                  <tr>
                    <td className="p-3 font-mono text-sky-400">queueflow_cookie_consent</td>
                    <td className="p-3">Compliance Preference</td>
                    <td className="p-3 text-slate-400">Stores GDPR cookie banner confirmation state.</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </section>

          <section className="space-y-2">
            <h2 className="text-lg font-bold text-white">2. Managing Client Storage</h2>
            <p>
              You can clear your local session storage at any moment by clicking &quot;Logout&quot; in the bottom navigation menu or through your browser&apos;s developer tools and privacy settings. Clearing session storage will terminate your active queue console session.
            </p>
          </section>
        </div>
      </div>
    </div>
  );
};

export default CookiePolicyPage;
