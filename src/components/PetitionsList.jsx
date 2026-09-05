import React from 'react';
import { Megaphone, Users, PlusCircle, ArrowRight, ShieldCheck } from 'lucide-react';

export default function PetitionsList({ petitions = [], activePetitionId, onSelectPetition, onOpenNewPetition }) {
  return (
    <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-6 sm:p-8 shadow-xl">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-slate-800">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <Megaphone className="w-5 h-5 text-rose-400" />
            <h2 className="text-xl sm:text-2xl font-black text-white tracking-tight">
              Active RRCE Student Campaigns
            </h2>
          </div>
          <p className="text-xs sm:text-sm text-slate-400">
            Browse and support other grievances raised by RRCE students across Mysore Road campus.
          </p>
        </div>

        <button
          onClick={onOpenNewPetition}
          className="flex items-center gap-2 px-3.5 py-2 rounded-lg bg-rose-600 hover:bg-rose-500 text-white text-xs font-bold transition shadow-md self-start sm:self-auto cursor-pointer"
        >
          <PlusCircle className="w-4 h-4" /> Start New Petition
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-6">
        {petitions.map((p) => {
          const isActive = p.id === activePetitionId;
          const count = p.signatureCount || (p.signatures ? p.signatures.length : 0);

          return (
            <div
              key={p.id}
              onClick={() => onSelectPetition(p.id)}
              className={`p-5 rounded-xl border transition cursor-pointer flex flex-col justify-between ${
                isActive
                  ? 'bg-rose-950/20 border-rose-500/50 shadow-md shadow-rose-950/40 ring-1 ring-rose-500/30'
                  : 'bg-slate-950/70 border-slate-800 hover:border-slate-700'
              }`}
            >
              <div>
                <div className="flex items-center justify-between gap-2 mb-2">
                  <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded bg-slate-800 text-slate-300">
                    {p.category}
                  </span>
                  {isActive && (
                    <span className="text-[10px] font-bold text-rose-400 flex items-center gap-1">
                      <span className="w-1.5 h-1.5 rounded-full bg-rose-400 animate-ping"></span>
                      Currently Viewing
                    </span>
                  )}
                </div>

                <h3 className="font-bold text-white text-sm sm:text-base leading-snug mb-2 hover:text-rose-300 transition">
                  {p.title}
                </h3>
                <p className="text-xs text-slate-400 line-clamp-2 mb-4">
                  {p.summary}
                </p>
              </div>

              <div className="flex items-center justify-between pt-3 border-t border-slate-900 text-xs">
                <div className="flex items-center gap-1.5 text-slate-300 font-mono">
                  <Users className="w-3.5 h-3.5 text-emerald-400" />
                  <span className="font-bold text-white">{count}</span>
                  <span className="text-slate-500">/ {p.targetSignatures} signed</span>
                </div>

                <span className="text-xs font-semibold text-rose-400 flex items-center gap-1 group">
                  View Campaign <ArrowRight className="w-3.5 h-3.5" />
                </span>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
