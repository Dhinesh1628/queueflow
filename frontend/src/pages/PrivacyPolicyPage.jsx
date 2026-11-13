import React from 'react';
import { Link } from 'react-router-dom';
import { ShieldCheck, ArrowLeft } from 'lucide-react';

const PrivacyPolicyPage = () => {
  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto space-y-8">
        <div className="flex items-center justify-between pb-4 border-b border-slate-800">
          <Link
            to="/"
            className="flex items-center gap-2 text-xs font-semibold text-sky-400 hover:text-sky-300 transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Back to Dashboard</span>
          </Link>
          <span className="text-xs text-slate-500">Effective Date: November 13, 2026</span>
        </div>

        <div className="space-y-4">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-md bg-sky-500/10 border border-sky-500/20 text-xs text-sky-300 font-medium">
            <ShieldCheck className="w-4 h-4" />
            <span>GDPR & CCPA Compliant Privacy Policy</span>
          </div>
          <h1 className="text-3xl font-extrabold text-white tracking-tight">Privacy Policy</h1>
          <p className="text-sm text-slate-400 leading-relaxed">
            QueueFlow (&quot;we&quot;, &quot;our&quot;, or &quot;us&quot;) is committed to protecting the privacy of queue managers, counter staff, and customers visiting registered service desks. This Privacy Policy outlines our principles of data minimization and operational security.
          </p>
        </div>

        <div className="space-y-6 text-sm text-slate-300 leading-relaxed border-t border-slate-800/80 pt-6">
          <section className="space-y-2">
            <h2 className="text-lg font-bold text-white">1. Data Minimization & Information Collected</h2>
            <p>
              In accordance with Article 5(1)(c) of the General Data Protection Regulation (GDPR), we strictly enforce data minimization:
            </p>
            <ul className="list-disc pl-5 space-y-1 text-slate-400">
              <li><strong className="text-slate-200">Manager Information:</strong> Full name, professional email address, and encrypted credentials (hashed using bcrypt) required to maintain tenancy.</li>
              <li><strong className="text-slate-200">Customer Queue Data:</strong> Full name and an optional contact phone number collected solely for the operational purpose of calling and dispatching customer tickets.</li>
              <li><strong className="text-slate-200">Usage Telemetry:</strong> Anonymized timestamps (ticket creation, service start, service completion) used to calculate counter throughput and average wait durations.</li>
            </ul>
          </section>

          <section className="space-y-2">
            <h2 className="text-lg font-bold text-white">2. Purpose of Processing</h2>
            <p>
              Data is processed strictly to provide counter queue sequencing, ticket reordering, service completion metrics, and tenant isolation. We never sell, lease, or monetize customer data to third-party ad brokers or data aggregators.
            </p>
          </section>

          <section className="space-y-2">
            <h2 className="text-lg font-bold text-white">3. Data Retention & Right to Erasure (GDPR Article 17)</h2>
            <p>
              Queue managers possess full autonomy to delete counter queues, cancel active tokens, or execute complete account erasure. When a manager initiates account deletion via Settings, all associated queue definitions, waiting lines, and historical tickets are permanently deleted from MongoDB Atlas replica sets.
            </p>
          </section>

          <section className="space-y-2">
            <h2 className="text-lg font-bold text-white">4. Security Measures</h2>
            <p>
              All transit traffic is secured using TLS encryption. Password authentication uses salted one-way hashing algorithms. API endpoints are safeguarded using Helmet HTTP security headers, CORS origin verification, and rate limiting against distributed brute-force attempts.
            </p>
          </section>

          <section className="space-y-2">
            <h2 className="text-lg font-bold text-white">5. Contact & Privacy Inquiries</h2>
            <p>
              For data protection inquiries or to submit an official data subject access request (DSAR), please contact our Data Protection Officer at:
            </p>
            <p className="font-mono text-xs text-sky-400">
              privacy@queueflow.io • QueueFlow Operations Inc.
            </p>
          </section>
        </div>
      </div>
    </div>
  );
};

export default PrivacyPolicyPage;
