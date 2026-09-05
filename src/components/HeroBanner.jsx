import React from 'react';
import { AlertCircle, ShieldAlert, CheckCircle2, Award, Building2, UserCheck, ArrowDown, Share2 } from 'lucide-react';

export default function HeroBanner({ petition, onScrollToSign }) {
  const handleWhatsApp = () => {
    const text = `🚨 *URGENT RRCE ACTION*: Students are protesting the unfair mandatory ₹1,000 Gown Fee and demanding transparency for already-paid Alumni Association funds! Sign & support here: ${window.location.href}`;
    window.open(`https://api.whatsapp.com/send?text=${encodeURIComponent(text)}`, '_blank');
  };

  return (
    <section className="relative pt-8 pb-10 sm:py-12 overflow-hidden">
      {/* Background glow lines */}
      <div className="absolute inset-0 bg-gradient-to-b from-rose-950/20 via-transparent to-transparent pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative">
        {/* Top Badges */}
        <div className="flex flex-wrap items-center gap-2 sm:gap-3 mb-4">
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-black uppercase tracking-wider bg-rose-500/20 text-rose-300 border border-rose-500/40 animate-pulse-glow">
            <ShieldAlert className="w-3.5 h-3.5 text-rose-400" />
            Urgent Student Action • 2025 Convocation
          </span>
          <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-medium bg-slate-900 text-slate-300 border border-slate-800">
            <Building2 className="w-3 h-3 text-amber-400" />
            RajaRajeswari College of Engineering (RRCE)
          </span>
          <span className="hidden sm:inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-medium bg-slate-900 text-emerald-400 border border-slate-800">
            <UserCheck className="w-3 h-3" />
            Anonymous USN Protection Active
          </span>
        </div>

        {/* Petition Main Title */}
        <h1 className="text-2xl sm:text-4xl lg:text-5xl font-extrabold text-white tracking-tight leading-tight sm:leading-snug max-w-5xl">
          Stop Mandatory <span className="text-transparent bg-clip-text bg-gradient-to-r from-rose-400 via-rose-300 to-amber-300">₹1,000 Gown Fee</span> & Demand Clear Accounts of Paid <span className="underline decoration-rose-500 decoration-wavy decoration-2">Alumni Funds</span>
        </h1>

        {/* Narrative & Context */}
        <div className="mt-5 text-sm sm:text-base text-slate-300 max-w-4xl leading-relaxed space-y-3">
          <p>
            Final year engineering students at <strong>RajaRajeswari College of Engineering (RRCE)</strong> are being forced to pay <strong>₹1,000</strong> for convocation gowns that will be worn for barely <strong>1–2 hours</strong> during photos. Furthermore, thousands of rupees have already been collected from our pockets during admission under <strong>"Alumni Association Fees"</strong> with zero financial accountability, no balance sheets, and no tangible alumni benefits provided.
          </p>
          <p className="text-slate-400 text-xs sm:text-sm">
            We demand an immediate revocation of the mandatory gown charge (replacing it with nominal ₹150 refundable rental or self-provided attire) and a published audit of all alumni funds.
          </p>
        </div>

        {/* Target Authorities Pill */}
        <div className="mt-6 flex flex-wrap items-center gap-4 text-xs text-slate-400 bg-slate-900/60 p-3.5 rounded-xl border border-slate-800 max-w-3xl">
          <span className="font-bold text-slate-200">Official Representation Addressed To:</span>
          <span className="bg-slate-950 px-2 py-1 rounded border border-slate-800 text-slate-300">
            Principal Dr. J. Amutharaj (RRCE)
          </span>
          <span className="bg-slate-950 px-2 py-1 rounded border border-slate-800 text-slate-300">
            Moogambigai Trust Management
          </span>
          <span className="bg-slate-950 px-2 py-1 rounded border border-slate-800 text-slate-300">
            VTU Grievance Redressal Cell
          </span>
        </div>

        {/* CTA Button Row */}
        <div className="mt-7 flex flex-wrap items-center gap-3">
          <button
            onClick={onScrollToSign}
            className="px-6 py-3 rounded-xl bg-gradient-to-r from-rose-600 via-rose-500 to-rose-600 hover:from-rose-500 hover:to-rose-600 text-white font-bold text-sm shadow-xl shadow-rose-950/60 flex items-center gap-2 cursor-pointer transition active:scale-95"
          >
            <ArrowDown className="w-4 h-4 animate-bounce" />
            <span>Sign the Petition (Safe & Anonymous)</span>
          </button>

          <button
            onClick={handleWhatsApp}
            className="px-5 py-3 rounded-xl bg-emerald-950/70 hover:bg-emerald-900/70 text-emerald-300 border border-emerald-500/40 font-semibold text-sm flex items-center gap-2 transition"
          >
            <Share2 className="w-4 h-4" />
            <span>Share to Class WhatsApp Groups</span>
          </button>
        </div>
      </div>
    </section>
  );
}
