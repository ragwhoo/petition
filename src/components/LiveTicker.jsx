import React, { useEffect, useState, useRef } from 'react';
import { Users, TrendingUp, Sparkles, CheckCircle2, ShieldCheck, Flame, BellRing } from 'lucide-react';

export default function LiveTicker({ signatureCount, targetCount = 500, recentSignatures = [] }) {
  const [displayCount, setDisplayCount] = useState(signatureCount);
  const [isPulsing, setIsPulsing] = useState(false);
  const [activeNoticeIdx, setActiveNoticeIdx] = useState(0);
  const prevCountRef = useRef(signatureCount);

  // Animate count smoothly when signature count increases
  useEffect(() => {
    if (signatureCount !== displayCount) {
      setIsPulsing(true);
      const timer = setTimeout(() => {
        setDisplayCount(signatureCount);
        setIsPulsing(false);
      }, 300);
      return () => clearTimeout(timer);
    }
  }, [signatureCount]);

  // Generate dynamic live activity events from recent signatures or defaults
  const tickerEvents = [
    ...(recentSignatures.length > 0
      ? recentSignatures.slice(0, 5).map(s => ({
          tag: 'JUST SIGNED',
          text: `${s.isAnonymous ? 'Anonymous Student' : s.name} (${s.department} ${s.year}) signed!`,
          comment: s.comment ? `"${s.comment.slice(0, 60)}${s.comment.length > 60 ? '...' : ''}"` : null,
          time: 'Active now'
        }))
      : [
          { tag: 'JUST SIGNED', text: '1RR21CS*** (Computer Science) signed the petition!', comment: '₹1000 for 1-hour gown is unacceptable', time: 'Just now' },
          { tag: 'MILESTONE', text: 'Over 65% of target reached across all final year branches!', comment: null, time: 'Trending' }
        ]),
    { tag: 'COLLEGE TARGET', text: 'Next Goal: 500 verified signatures for delegation to Principal', comment: null, time: 'Target' },
    { tag: 'SECURITY', text: 'Anonymous signatures protected. Internal marks safe from retaliation.', comment: null, time: 'Notice' }
  ];

  // Rotate activity events every 4 seconds
  useEffect(() => {
    const interval = setInterval(() => {
      setActiveNoticeIdx(prev => (prev + 1) % tickerEvents.length);
    }, 4000);
    return () => clearInterval(interval);
  }, [tickerEvents.length]);

  const percentage = Math.min(100, Math.round((signatureCount / targetCount) * 100));
  const remaining = Math.max(0, targetCount - signatureCount);
  const activeEvent = tickerEvents[activeNoticeIdx] || tickerEvents[0];

  return (
    <section className="relative overflow-hidden bg-gradient-to-r from-slate-900 via-rose-950/30 to-slate-900 border-y border-rose-900/30 shadow-inner">
      {/* Background ambient glow */}
      <div className="absolute top-0 left-1/4 w-96 h-32 bg-rose-600/10 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-0 right-1/4 w-96 h-32 bg-amber-500/10 rounded-full blur-3xl pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 sm:py-5">
        <div className="flex flex-col lg:flex-row items-center justify-between gap-4">
          
          {/* Main Counter Block */}
          <div className="flex items-center gap-4 sm:gap-6 w-full lg:w-auto justify-between sm:justify-start">
            <div className="flex items-center gap-3">
              {/* Pulsing Live Radar Indicator */}
              <div className="relative flex items-center justify-center">
                <span className="absolute inline-flex h-10 w-10 animate-ping rounded-full bg-rose-500 opacity-25"></span>
                <div className="relative w-8 h-8 rounded-full bg-rose-600 flex items-center justify-center shadow-lg shadow-rose-600/50">
                  <Flame className="w-4 h-4 text-white animate-pulse" />
                </div>
              </div>

              <div>
                <div className="flex items-center gap-2">
                  <span className="text-[10px] sm:text-xs font-black uppercase tracking-wider text-rose-400 bg-rose-500/10 px-2 py-0.5 rounded-full border border-rose-500/20">
                    Live Verified Ticker
                  </span>
                  <span className="text-[11px] text-slate-400 hidden sm:inline">
                    Updated real-time
                  </span>
                </div>
                <div className="flex items-baseline gap-2 mt-0.5">
                  <span
                    className={`font-mono text-3xl sm:text-4xl font-extrabold tracking-tight transition-all duration-300 ${
                      isPulsing ? 'text-amber-300 scale-105' : 'text-white'
                    }`}
                  >
                    {displayCount.toLocaleString()}
                  </span>
                  <span className="text-sm sm:text-base font-semibold text-slate-300">
                    / {targetCount.toLocaleString()}
                  </span>
                  <span className="text-xs text-slate-400 font-medium">RRCE Students Signed</span>
                </div>
              </div>
            </div>

            {/* Quick mini-percentage pill */}
            <div className="sm:hidden text-right">
              <span className="text-sm font-bold text-emerald-400 font-mono">{percentage}%</span>
              <p className="text-[10px] text-slate-400">of goal</p>
            </div>
          </div>

          {/* Dynamic Activity Feed Ticker */}
          <div className="w-full lg:max-w-xl bg-slate-950/70 border border-slate-800 rounded-xl px-4 py-2.5 flex items-center gap-3 overflow-hidden shadow-sm">
            <div className="shrink-0 flex items-center justify-center w-7 h-7 rounded-lg bg-slate-900 border border-slate-700 text-rose-400">
              <BellRing className="w-3.5 h-3.5 animate-bounce" />
            </div>

            <div className="min-w-0 flex-1">
              <div className="flex items-center gap-2">
                <span className="text-[10px] font-bold uppercase tracking-wider px-1.5 py-0.5 rounded bg-amber-500/20 text-amber-300 border border-amber-500/30">
                  {activeEvent.tag}
                </span>
                <span className="text-xs font-medium text-slate-200 truncate">
                  {activeEvent.text}
                </span>
              </div>
              {activeEvent.comment && (
                <p className="text-[11px] text-slate-400 italic truncate mt-0.5">
                  {activeEvent.comment}
                </p>
              )}
            </div>

            <div className="shrink-0 text-right hidden sm:block">
              <span className="text-[10px] text-slate-500 font-mono">{activeEvent.time}</span>
            </div>
          </div>

          {/* Progress Goal Summary */}
          <div className="w-full lg:w-72 shrink-0">
            <div className="flex justify-between items-center text-xs font-medium mb-1.5">
              <span className="text-slate-300 flex items-center gap-1">
                <TrendingUp className="w-3.5 h-3.5 text-emerald-400" />
                <span>{percentage}% of Target Reached</span>
              </span>
              <span className="text-slate-400 font-mono text-[11px]">
                {remaining > 0 ? `${remaining} more needed` : 'Goal Achieved!'}
              </span>
            </div>
            {/* Animated Progress Bar */}
            <div className="w-full h-2.5 bg-slate-800 rounded-full overflow-hidden p-0.5">
              <div
                className="h-full bg-gradient-to-r from-rose-500 via-amber-500 to-emerald-400 rounded-full transition-all duration-700 relative"
                style={{ width: `${percentage}%` }}
              >
                <div className="absolute inset-0 bg-white/20 animate-pulse" />
              </div>
            </div>
          </div>

        </div>
      </div>
    </section>
  );
}
