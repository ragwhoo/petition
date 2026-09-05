import React from 'react';
import { ShieldAlert, Users, PlusCircle, Share2, Award, Megaphone } from 'lucide-react';

export default function Navbar({ onOpenNewPetition, onScrollToSign, activePetitionsCount = 2 }) {
  const shareWebsite = () => {
    const shareText = `🎓 RRCE Students: Stand together against the mandatory ₹1,000 Convocation Gown fee and demand transparency for Alumni Association funds! Sign the petition here: ${window.location.href}`;
    if (navigator.share) {
      navigator.share({
        title: 'RRCE Student Voice - Petition Platform',
        text: shareText,
        url: window.location.href,
      }).catch(() => {});
    } else {
      window.open(`https://api.whatsapp.com/send?text=${encodeURIComponent(shareText)}`, '_blank');
    }
  };

  return (
    <header className="sticky top-0 z-40 bg-slate-950/90 backdrop-blur-md border-b border-slate-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Brand */}
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-rose-600 to-amber-500 flex items-center justify-center shadow-lg shadow-rose-950/50">
              <Megaphone className="w-5 h-5 text-white" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="font-extrabold text-lg sm:text-xl tracking-tight bg-gradient-to-r from-white via-slate-100 to-slate-400 bg-clip-text text-transparent">
                  RRCE Student Voice
                </span>
                <span className="hidden sm:inline-flex items-center px-2 py-0.5 rounded text-[11px] font-semibold bg-rose-500/20 text-rose-400 border border-rose-500/30">
                  RRCE Bengaluru
                </span>
              </div>
              <p className="text-[11px] text-slate-400 hidden xs:block">
                Democratic Student Advocacy & Petition Portal
              </p>
            </div>
          </div>

          {/* Quick stats & Actions */}
          <div className="flex items-center gap-2 sm:gap-4">
            <div className="hidden md:flex items-center gap-2 px-3 py-1.5 rounded-full bg-slate-900/80 border border-slate-800 text-xs text-slate-300">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
              <span>2 Active Petitions</span>
            </div>

            <button
              onClick={shareWebsite}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-emerald-950/60 border border-emerald-500/40 text-emerald-300 hover:bg-emerald-900/60 text-xs font-semibold transition shadow-sm"
              title="Share on WhatsApp / Social"
            >
              <Share2 className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">Mobilize</span>
            </button>

            <button
              onClick={onOpenNewPetition}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 text-xs font-medium transition"
            >
              <PlusCircle className="w-3.5 h-3.5 text-rose-400" />
              <span className="hidden sm:inline">Start a Petition</span>
            </button>

            <button
              onClick={onScrollToSign}
              className="px-4 py-2 rounded-lg bg-gradient-to-r from-rose-600 to-rose-500 hover:from-rose-500 hover:to-rose-600 text-white text-xs sm:text-sm font-bold shadow-lg shadow-rose-900/40 hover:shadow-rose-900/60 transition active:scale-95"
            >
              Sign Now
            </button>
          </div>
        </div>
      </div>
    </header>
  );
}
