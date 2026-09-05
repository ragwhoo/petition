import React from 'react';
import { ShieldCheck, Heart, ExternalLink, HelpCircle } from 'lucide-react';

export default function Footer() {
  return (
    <footer className="mt-20 border-t border-slate-800 bg-slate-950 py-12 text-slate-400 text-xs">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-6">
        <div className="flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="text-center md:text-left">
            <p className="text-slate-200 font-bold text-sm">
              RRCE Student Voice • Mysore Road Campus, Bengaluru
            </p>
            <p className="text-slate-500 mt-1">
              Independent student-led initiative for transparency, financial accountability, and fair convocation rights.
            </p>
          </div>

          <div className="flex items-center gap-4 text-xs text-slate-400">
            <span className="flex items-center gap-1">
              <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
              USN Privacy Shield Active
            </span>
            <span>•</span>
            <span>Non-Profit & Student Protected</span>
          </div>
        </div>

        <div className="p-4 rounded-xl bg-slate-900/60 border border-slate-800 text-[11px] leading-relaxed text-slate-400">
          <strong className="text-slate-300">Student Protection & Legal Context:</strong> Under AICTE Student Grievance Redressal Regulations and the Consumer Protection Act, students are entitled to transparent institutional fee accounting. Convocation gowns are ceremonial regalia, not compulsory academic curriculum items, and forcing ₹1,000 non-refundable payments violates fair trade practices. Anonymous signatures are masked to protect students from unfair academic retaliation.
        </div>

        <div className="text-center text-slate-600 text-[11px]">
          &copy; {new Date().getFullYear()} RRCE Student Voice. Built by students, for students.
        </div>
      </div>
    </footer>
  );
}
