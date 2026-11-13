import React from 'react';
import { Link } from 'react-router-dom';
import { FileText, ArrowLeft } from 'lucide-react';

const TermsPage = () => {
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
          <span className="text-xs font-mono text-[#736A62] dark:text-[#A69B8F]">Last Revised: November 13, 2026</span>
        </div>

        <div className="space-y-4">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-md bg-[#8C532B]/10 border border-[#8C532B]/25 text-xs font-mono text-[#8C532B] dark:text-[#D4A373] font-medium">
            <FileText className="w-4 h-4 text-[#8C532B] dark:text-[#D4A373]" />
            <span>Standard SaaS Terms & Conditions</span>
          </div>
          <h1 className="text-3xl font-extrabold text-[#26221F] dark:text-[#FAF8F5] tracking-tight">Terms of Service</h1>
          <p className="text-sm text-[#736A62] dark:text-[#C7BCB0] leading-relaxed">
            Please review these Terms of Service (&quot;Terms&quot;) governing your access and operational use of the QueueFlow queue dispatch and analytics platform.
          </p>
        </div>

        <div className="space-y-6 text-sm text-[#26221F] dark:text-[#FAF8F5] leading-relaxed border-t border-[#E6E0D4] dark:border-[#3E342C] pt-6">
          <section className="space-y-2">
            <h2 className="text-lg font-bold text-[#26221F] dark:text-[#FAF8F5]">1. Acceptance of Agreement</h2>
            <p className="text-[#736A62] dark:text-[#C7BCB0]">
              By registering an account, creating counter queues, or issuing customer tokens, you agree to comply with and be bound by these Terms. If you represent an organization or commercial entity, you confirm that you have the authority to bind that entity.
            </p>
          </section>

          <section className="space-y-2">
            <h2 className="text-lg font-bold text-[#26221F] dark:text-[#FAF8F5]">2. Acceptable Use Policy</h2>
            <p className="text-[#736A62] dark:text-[#C7BCB0]">
              You agree to use QueueFlow solely for legitimate queuing, customer dispatch, and operational throughput monitoring. You shall not:
            </p>
            <ul className="list-disc pl-5 space-y-1 text-[#736A62] dark:text-[#C7BCB0]">
              <li>Deploy automated scripts or bots designed to flood counter sequences or trigger false customer volumes.</li>
              <li>Attempt to circumvent tenant isolation or probe internal endpoint infrastructure.</li>
              <li>Store prohibited, defamatory, or unlawful personal identifiers within customer notes or queue metadata.</li>
            </ul>
          </section>

          <section className="space-y-2">
            <h2 className="text-lg font-bold text-[#26221F] dark:text-[#FAF8F5]">3. System Availability & Service Integrity</h2>
            <p className="text-[#736A62] dark:text-[#C7BCB0]">
              QueueFlow employs atomic database transactions to ensure token sequencing consistency. We maintain continuous operational uptime while reserving the right to schedule non-disruptive maintenance windows.
            </p>
          </section>

          <section className="space-y-2">
            <h2 className="text-lg font-bold text-[#26221F] dark:text-[#FAF8F5]">4. Limitation of Liability</h2>
            <p className="text-[#736A62] dark:text-[#C7BCB0]">
              To the maximum extent permitted by applicable law, QueueFlow Operations Inc. shall not be liable for indirect, incidental, or consequential damages resulting from local network downtime, third-party ISP outages, or client hardware failures.
            </p>
          </section>

          <section className="space-y-2">
            <h2 className="text-lg font-bold text-[#26221F] dark:text-[#FAF8F5]">5. Governing Law</h2>
            <p className="text-[#736A62] dark:text-[#C7BCB0]">
              These Terms shall be interpreted and enforced under standard commercial laws governing software-as-a-service providers.
            </p>
          </section>
        </div>
      </div>
    </div>
  );
};

export default TermsPage;
