import React, { useState } from 'react';
import { HelpCircle, AlertTriangle, CheckCircle, Calculator, TrendingDown, DollarSign, FileSpreadsheet } from 'lucide-react';

export default function CostComparison() {
  const [studentCount, setStudentCount] = useState(850);
  const totalGownExtortion = studentCount * 1000;
  const reasonableCost = studentCount * 150;
  const excessAmount = totalGownExtortion - reasonableCost;

  return (
    <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-6 sm:p-8 shadow-xl relative overflow-hidden">
      {/* Background decoration */}
      <div className="absolute -right-20 -top-20 w-60 h-60 bg-rose-500/10 rounded-full blur-3xl pointer-events-none" />

      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-6 border-b border-slate-800">
        <div>
          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-bold bg-amber-500/10 text-amber-400 border border-amber-500/20 mb-2">
            <AlertTriangle className="w-3.5 h-3.5" /> Financial Reality Check
          </span>
          <h2 className="text-xl sm:text-2xl font-black text-white tracking-tight">
            The Math RRCE Administration Won’t Show You
          </h2>
          <p className="text-sm text-slate-400 mt-1">
            Comparing RRCE's mandatory demands against standard academic practices and our already-paid alumni funds.
          </p>
        </div>

        {/* Badge */}
        <div className="bg-rose-950/60 border border-rose-800/40 rounded-xl px-4 py-2 text-right">
          <span className="text-[11px] uppercase tracking-wider text-rose-300 font-bold block">
            Non-Refundable Gown Fee
          </span>
          <span className="text-2xl font-mono font-black text-rose-400">₹1,000 / Student</span>
        </div>
      </div>

      {/* Comparison Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 my-6">
        {/* Card 1: Gown Fee */}
        <div className="rounded-xl bg-slate-950/80 border border-rose-900/40 p-5 relative">
          <div className="flex items-center justify-between mb-3">
            <h3 className="font-bold text-rose-300 flex items-center gap-2">
              <span className="w-6 h-6 rounded-full bg-rose-500/20 text-rose-400 flex items-center justify-center text-xs">✕</span>
              The ₹1,000 Gown Charge
            </h3>
            <span className="text-xs bg-rose-500/10 text-rose-400 px-2 py-0.5 rounded font-mono font-medium">1.5 hrs use</span>
          </div>
          <ul className="space-y-2.5 text-xs sm:text-sm text-slate-300">
            <li className="flex items-start gap-2">
              <span className="text-rose-400 font-bold">•</span>
              <span><strong>Used only for photos:</strong> Gowns are worn for barely 60–90 minutes during the ceremony and then collected back or left in closets.</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-rose-400 font-bold">•</span>
              <span><strong>Exorbitant markup:</strong> Standard bulk gown rental in Bengaluru is ₹150–₹250 (mostly refundable deposit).</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-rose-400 font-bold">•</span>
              <span><strong>Forced obligation:</strong> Threatening to deny degree folders or seating unless this ₹1,000 is paid violates student rights.</span>
            </li>
          </ul>
        </div>

        {/* Card 2: The Unaccounted Alumni Fee */}
        <div className="rounded-xl bg-slate-950/80 border border-amber-900/40 p-5 relative">
          <div className="flex items-center justify-between mb-3">
            <h3 className="font-bold text-amber-300 flex items-center gap-2">
              <span className="w-6 h-6 rounded-full bg-amber-500/20 text-amber-400 flex items-center justify-center text-xs">?</span>
              The Hidden Alumni Association Fee
            </h3>
            <span className="text-xs bg-amber-500/10 text-amber-400 px-2 py-0.5 rounded font-mono font-medium">Already Paid</span>
          </div>
          <ul className="space-y-2.5 text-xs sm:text-sm text-slate-300">
            <li className="flex items-start gap-2">
              <span className="text-amber-400 font-bold">•</span>
              <span><strong>Thousands already extracted:</strong> During admission and semester fees, every student was charged under the 'Alumni Association' head.</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-amber-400 font-bold">•</span>
              <span><strong>Zero accountability:</strong> Where is the audited balance sheet? No alumni network, portal, or career services have been provided.</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-amber-400 font-bold">•</span>
              <span><strong>Double-charging students:</strong> If alumni funds exist, why is an extra ₹1,000 demanded for convocation expenses?</span>
            </li>
          </ul>
        </div>
      </div>

      {/* Interactive Batch Extraction Calculator */}
      <div className="bg-slate-950/90 border border-slate-800 rounded-xl p-5">
        <div className="flex items-center gap-2 text-slate-300 text-xs font-bold uppercase tracking-wider mb-2">
          <Calculator className="w-4 h-4 text-emerald-400" />
          <span>Interactive RRCE Batch Fee Impact Calculator</span>
        </div>

        <div className="flex flex-col lg:flex-row items-center justify-between gap-6">
          <div className="w-full lg:w-1/2">
            <div className="flex justify-between items-center text-xs text-slate-300 mb-1">
              <span>Estimated Final Year Students in Batch:</span>
              <span className="font-mono font-bold text-white bg-slate-800 px-2 py-0.5 rounded">
                {studentCount} Students
              </span>
            </div>
            <input
              type="range"
              min="300"
              max="1500"
              step="50"
              value={studentCount}
              onChange={(e) => setStudentCount(Number(e.target.value))}
              className="w-full accent-rose-500 cursor-pointer h-2 bg-slate-800 rounded-lg appearance-none"
            />
            <div className="flex justify-between text-[10px] text-slate-500 mt-1">
              <span>300 (Small batch)</span>
              <span>850 (Current RRCE batch est.)</span>
              <span>1,500 (All branches + PG)</span>
            </div>
          </div>

          <div className="w-full lg:w-1/2 grid grid-cols-2 gap-3">
            <div className="bg-rose-950/30 border border-rose-900/30 rounded-lg p-3 text-center">
              <p className="text-[11px] text-rose-300 font-medium">RRCE Mandatory Gown Collection</p>
              <p className="font-mono text-lg sm:text-xl font-extrabold text-rose-400 mt-1">
                ₹{totalGownExtortion.toLocaleString('en-IN')}
              </p>
              <span className="text-[10px] text-rose-400/80">From our pockets</span>
            </div>

            <div className="bg-emerald-950/30 border border-emerald-900/30 rounded-lg p-3 text-center">
              <p className="text-[11px] text-emerald-300 font-medium">Excess Extraction Over Fair Rental</p>
              <p className="font-mono text-lg sm:text-xl font-extrabold text-emerald-400 mt-1">
                +₹{excessAmount.toLocaleString('en-IN')}
              </p>
              <span className="text-[10px] text-emerald-400/80">Unjustified student burden</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
