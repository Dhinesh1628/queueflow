import React, { useState } from 'react';
import { ChevronDown, ChevronUp, HelpCircle } from 'lucide-react';

const faqs = [
  {
    q: 'How does atomic token generation prevent duplicate ticket numbers?',
    a: 'QueueFlow increments a database counter sequence per queue atomically via MongoDB native operators. Even during simultaneous customer additions, each token code (e.g. CS-001, CS-002) is guaranteed unique without numbering collision.',
  },
  {
    q: 'Can a currently serving customer be moved in the queue?',
    a: 'No. Once a ticket is marked as SERVING via CALL NEXT, it is locked into service until completed or cancelled. Only WAITING tokens can be rearranged up or down the line.',
  },
  {
    q: 'How are waiting times and service durations calculated in analytics?',
    a: 'Wait duration is computed using the exact delta between ticket creation and the service start timestamp. Service duration is measured between service start and service completion. Zero simulated or hardcoded values are used.',
  },
  {
    q: 'What happens to token history when a ticket is cancelled?',
    a: 'Cancelled tokens are retained in the database for auditing and throughput analytics, but are immediately removed from the active waiting line. Remaining waiting tickets have their positions automatically re-indexed.',
  },
  {
    q: 'How can an organization request complete data deletion?',
    a: 'Queue managers can execute a full GDPR Right to Erasure request under Settings > Account Deletion, which permanently purges all queues, customer tokens, and manager records.',
  },
];

const FAQSection = () => {
  const [openIndex, setOpenIndex] = useState(null);

  const toggle = (idx) => {
    setOpenIndex(openIndex === idx ? null : idx);
  };

  return (
    <div className="bg-slate-900 border border-slate-800 rounded-xl p-6 shadow-sm">
      <div className="flex items-center gap-2 mb-4">
        <HelpCircle className="w-5 h-5 text-sky-400" />
        <h3 className="text-base font-bold text-white tracking-tight">
          Frequently Asked Operational Questions
        </h3>
      </div>

      <div className="divide-y divide-slate-800">
        {faqs.map((item, idx) => {
          const isOpen = openIndex === idx;
          return (
            <div key={idx} className="py-3.5">
              <button
                type="button"
                onClick={() => toggle(idx)}
                aria-expanded={isOpen}
                className="w-full flex items-center justify-between text-left gap-4 text-sm font-semibold text-slate-200 hover:text-white transition-colors cursor-pointer"
              >
                <span>{item.q}</span>
                {isOpen ? (
                  <ChevronUp className="w-4 h-4 text-sky-400 shrink-0" />
                ) : (
                  <ChevronDown className="w-4 h-4 text-slate-500 shrink-0" />
                )}
              </button>
              {isOpen && (
                <p className="text-xs text-slate-400 mt-2 leading-relaxed pl-1">
                  {item.a}
                </p>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default FAQSection;
