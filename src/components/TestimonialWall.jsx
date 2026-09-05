import React, { useState } from 'react';
import { MessageSquare, ThumbsUp, Shield, Filter, Award, Sparkles } from 'lucide-react';
import { likeComment } from '../data/apiClient';

export default function TestimonialWall({ petitionId, signatures = [] }) {
  const [filterDept, setFilterDept] = useState('ALL');
  const [likesMap, setLikesMap] = useState({});

  // Collect unique departments from signatures
  const departments = ['ALL', ...new Set(signatures.map(s => s.department).filter(Boolean))];

  // Filter signatures that have comments
  const signaturesWithComments = signatures.filter(s => s.comment && s.comment.trim().length > 0);

  const filtered = signaturesWithComments.filter(s => {
    if (filterDept === 'ALL') return true;
    return s.department === filterDept;
  });

  const handleLike = async (sigId) => {
    const current = likesMap[sigId] !== undefined ? likesMap[sigId] : (signatures.find(s => s.id === sigId)?.likes || 0);
    setLikesMap(prev => ({ ...prev, [sigId]: current + 1 }));
    try {
      await likeComment(petitionId, sigId);
    } catch (e) {
      // ignore
    }
  };

  return (
    <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-6 sm:p-8 shadow-xl">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-slate-800">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <MessageSquare className="w-5 h-5 text-rose-400" />
            <h2 className="text-xl sm:text-2xl font-black text-white tracking-tight">
              Student Voices & Grievances Wall
            </h2>
          </div>
          <p className="text-xs sm:text-sm text-slate-400">
            Real testimonies from RRCE students on why mandatory gown fees and unaccounted alumni funds must stop.
          </p>
        </div>

        {/* Filter Dropdown */}
        <div className="flex items-center gap-2">
          <Filter className="w-3.5 h-3.5 text-slate-400" />
          <select
            value={filterDept}
            onChange={(e) => setFilterDept(e.target.value)}
            className="bg-slate-950 border border-slate-800 text-xs text-slate-300 rounded-lg px-2.5 py-1.5 focus:outline-none focus:border-rose-500"
          >
            {departments.map((dept) => (
              <option key={dept} value={dept}>
                {dept === 'ALL' ? 'All Departments' : dept.split('(')[0].trim()}
              </option>
            ))}
          </select>
        </div>
      </div>

      {filtered.length === 0 ? (
        <div className="text-center py-12 text-slate-500 text-sm">
          No comments submitted for this department yet. Be the first to speak up!
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-6">
          {filtered.map((sig) => {
            const currentLikes = likesMap[sig.id] !== undefined ? likesMap[sig.id] : (sig.likes || 0);

            return (
              <div
                key={sig.id}
                className="bg-slate-950/70 border border-slate-800/90 hover:border-slate-700/90 rounded-xl p-4 sm:p-5 flex flex-col justify-between transition group shadow-sm"
              >
                <div>
                  <div className="flex items-center justify-between gap-2 mb-2">
                    <div className="flex items-center gap-2">
                      {sig.isAnonymous ? (
                        <span className="inline-flex items-center gap-1 text-xs font-bold text-amber-400 bg-amber-500/10 px-2 py-0.5 rounded-full border border-amber-500/20">
                          <Shield className="w-3 h-3" /> Anonymous Student
                        </span>
                      ) : (
                        <span className="text-xs font-bold text-white group-hover:text-rose-300 transition">
                          {sig.name}
                        </span>
                      )}
                      <span className="font-mono text-[10px] text-slate-500 bg-slate-900 px-1.5 py-0.5 rounded">
                        {sig.maskedUsn}
                      </span>
                    </div>

                    <span className="text-[10px] text-slate-500">
                      {new Date(sig.createdAt).toLocaleDateString('en-IN', {
                        day: 'numeric',
                        month: 'short'
                      })}
                    </span>
                  </div>

                  <p className="text-xs sm:text-sm text-slate-300 leading-relaxed italic mb-3">
                    "{sig.comment}"
                  </p>
                </div>

                <div className="flex items-center justify-between pt-2 border-t border-slate-900/60 text-[11px] text-slate-400">
                  <span className="font-medium text-slate-400 truncate max-w-[200px]">
                    {sig.department} • Batch {sig.year}
                  </span>

                  <button
                    onClick={() => handleLike(sig.id)}
                    className="flex items-center gap-1 px-2 py-1 rounded bg-slate-900 hover:bg-rose-950/40 hover:text-rose-400 text-slate-400 text-[11px] transition border border-slate-800"
                    title="I agree with this concern"
                  >
                    <ThumbsUp className="w-3 h-3" />
                    <span>{currentLikes} Agree</span>
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
