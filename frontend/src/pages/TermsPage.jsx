import React from 'react';
import { Link } from 'react-router-dom';
import { FileText, ArrowLeft } from 'lucide-react';

const TermsPage = () => {
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
          <span className="text-xs font-mono text-slate-500">Last Revised: November 13, 2026</span>
        </div>

        <div className="space-y-4">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-md bg-cyan-50 dark:bg-cyan-500/10 border border-cyan-200 dark:border-cyan-500/20 text-xs font-mono text-cyan-700 dark:text-cyan-300 font-medium">
            <FileText className="w-4 h-4 text-cyan-500" />
            <span>Standard SaaS Terms & Conditions</span>
          </div>
          <h1 className="text-3xl font-extrabold text-slate-900 dark:text-white tracking-tight">Terms of Service</h1>
          <p className="text-sm text-slate-600 dark:text-slate-400 leading-relaxed">
            Please review these Terms of Service (&quot;Terms&quot;) governing your access and operational use of the QueueFlow queue dispatch and analytics platform.
          </p>
        </div>

        <div className="space-y-6 text-sm text-slate-700 dark:text-slate-300 leading-relaxed border-t border-slate-200 dark:border-slate-800/80 pt-6">
          <section className="space-y-2">
            <h2 className="text-lg font-bold text-slate-900 dark:text-white">1. Acceptance of Agreement</h2>
            <p>
              By registering an account, creating counter queues, or issuing customer tokens, you agree to comply with and be bound by these Terms. If you represent an organization or commercial entity, you confirm that you have the authority to bind that entity.
            </p>
          </section>

          <section className="space-y-2">
            <h2 className="text-lg font-bold text-white">2. Acceptable Use Policy</h2>
            <p>
              You agree to use QueueFlow solely for legitimate queuing, customer dispatch, and operational throughput monitoring. You shall not:
            </p>
            <ul className="list-disc pl-5 space-y-1 text-slate-400">
              <li>Deploy automated scripts or bots designed to flood counter sequences or trigger false customer volumes.</li>
              <li>Attempt to circumvent tenant isolation or probe internal endpoint infrastructure.</li>
              <li>Store prohibited, defamatory, or unlawful personal identifiers within customer notes or queue metadata.</li>
            </ul>
          </section>

          <section className="space-y-2">
            <h2 className="text-lg font-bold text-white">3. System Availability & Service Integrity</h2>
            <p>
              QueueFlow employs atomic database transactions to ensure token sequencing consistency. We maintain continuous operational uptime while reserving the right to schedule non-disruptive maintenance windows.
            </p>
          </section>

          <section className="space-y-2">
            <h2 className="text-lg font-bold text-white">4. Limitation of Liability</h2>
            <p>
              To the maximum extent permitted by applicable law, QueueFlow Operations Inc. shall not be liable for indirect, incidental, or consequential damages resulting from local network downtime, third-party ISP outages, or client hardware failures.
            </p>
          </section>

          <section className="space-y-2">
            <h2 className="text-lg font-bold text-white">5. Governing Law</h2>
            <p>
              These Terms shall be interpreted and enforced under standard commercial laws governing software-as-a-service providers.
            </p>
          </section>
        </div>
      </div>
    </div>
  );
};

export default TermsPage;
