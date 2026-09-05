import React from 'react';
import { CheckCircle2, ShieldCheck, Scale, FileSpreadsheet, Ban } from 'lucide-react';

export default function CoreDemands({ demands = [] }) {
  const fallbackDemands = [
    {
      id: 1,
      icon: Ban,
      title: "1. Abolish Mandatory ₹1,000 Gown Fee",
      desc: "Allow students to wear formal academic Indian/Western attire, borrow gowns from seniors, or opt for a nominal refundable rental fee (max ₹150–₹200) handled transparently."
    },
    {
      id: 2,
      icon: FileSpreadsheet,
      title: "2. Publish Full Audit of Alumni Association Funds",
      desc: "Every student has paid thousands of rupees under the 'Alumni Association' head. RRCE must release a public statement and financial breakdown on where these funds are parked and how they benefit students."
    },
    {
      id: 3,
      icon: ShieldCheck,
      title: "3. Absolute Protection from Administrative Retaliation",
      desc: "The college must formally confirm that no student will be denied hall tickets, convocation hall entry, or their degree certificate for questioning unapproved fees."
    }
  ];

  const items = demands && demands.length > 0 ? demands : fallbackDemands;

  return (
    <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-6 sm:p-8 shadow-xl">
      <div className="flex items-center gap-2 mb-2">
        <Scale className="w-5 h-5 text-rose-400" />
        <h2 className="text-xl sm:text-2xl font-black text-white tracking-tight">
          Our 3 Uncompromising Demands
        </h2>
      </div>
      <p className="text-xs sm:text-sm text-slate-400 mb-6">
        Formulated collectively by RRCE students to restore transparency and fair treatment.
      </p>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
        {items.map((item, idx) => (
          <div
            key={item.id || idx}
            className="p-5 rounded-xl bg-slate-950/80 border border-slate-800 hover:border-rose-500/40 transition flex flex-col justify-between group"
          >
            <div>
              <div className="w-9 h-9 rounded-lg bg-rose-500/10 text-rose-400 flex items-center justify-center font-bold font-mono text-sm mb-3 group-hover:bg-rose-500/20 transition">
                #{idx + 1}
              </div>
              <h3 className="font-bold text-white text-sm sm:text-base mb-2 group-hover:text-rose-200 transition">
                {item.title}
              </h3>
              <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
                {item.desc || item.description}
              </p>
            </div>
            <div className="mt-4 pt-3 border-t border-slate-900/80 flex items-center gap-1.5 text-[11px] text-emerald-400 font-semibold">
              <CheckCircle2 className="w-3.5 h-3.5" />
              <span>Non-Negotiable Student Demand</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
