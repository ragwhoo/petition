import React, { useState } from 'react';
import confetti from 'canvas-confetti';
import { ShieldCheck, Lock, Send, CheckCircle, AlertCircle, Share2, Sparkles } from 'lucide-react';
import { signPetition, isValidUsn } from '../data/apiClient';

const DEPARTMENTS = [
  'Computer Science & Engg (CSE)',
  'Information Science & Engg (ISE)',
  'Electronics & Communication (ECE)',
  'Artificial Intelligence & ML (AI/ML)',
  'Mechanical Engineering (ME)',
  'Civil Engineering (CV)',
  'Electrical & Electronics (EEE)',
  'Robotics & Automation',
  'Master of Computer Applications (MCA)',
  'Master of Business Admin (MBA)',
  'Alumni (Graduated Batch)'
];

const YEARS = ['2025 (Final Year)', '2024 (Graduated)', '2026 (3rd Year)', '2027 (2nd Year)'];

export default function SignForm({ petitionId, onSignedSuccess, userAlreadySigned }) {
  const [formData, setFormData] = useState({
    name: '',
    usn: '',
    department: DEPARTMENTS[0],
    year: '2025',
    comment: '',
    isAnonymous: true // default to anonymous to reduce fear of retribution
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [signedState, setSignedState] = useState(userAlreadySigned);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);

    // Validation
    if (!isValidUsn(formData.usn)) {
      setError('Please enter a valid RRCE USN (e.g. 1RR21CS001).');
      return;
    }

    if (!formData.isAnonymous && !formData.name.trim()) {
      setError('Please enter your name or select "Sign Anonymously".');
      return;
    }

    setLoading(true);
    try {
      const response = await signPetition(petitionId, formData);
      
      // Trigger festive celebration confetti
      try {
        confetti({
          particleCount: 120,
          spread: 70,
          origin: { y: 0.6 },
          colors: ['#e11d48', '#f59e0b', '#10b981', '#6366f1']
        });
      } catch (err) {
        // ignore confetti errors
      }

      setSignedState(true);
      if (onSignedSuccess) {
        onSignedSuccess(response.data);
      }
    } catch (err) {
      setError(err.message || 'Failed to record signature. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const shareOnWhatsApp = () => {
    const text = `🚨 RRCE Students: I just signed the petition against the ₹1,000 Convocation Gown fee and demanding clear accounting for Alumni Association funds. Stand united! Sign here: ${window.location.href}`;
    window.open(`https://api.whatsapp.com/send?text=${encodeURIComponent(text)}`, '_blank');
  };

  if (signedState) {
    return (
      <div className="bg-gradient-to-br from-emerald-950/40 via-slate-900 to-slate-950 border border-emerald-500/40 rounded-2xl p-6 sm:p-8 text-center shadow-xl">
        <div className="w-14 h-14 rounded-2xl bg-emerald-500/20 text-emerald-400 flex items-center justify-center mx-auto mb-4 border border-emerald-500/30">
          <CheckCircle className="w-8 h-8" />
        </div>
        <h3 className="text-xl font-bold text-white mb-2">You Have Signed This Petition!</h3>
        <p className="text-sm text-slate-300 max-w-md mx-auto mb-6">
          Thank you for taking a stand for transparency and student rights at RRCE. Your voice counts toward our 500-signature goal.
        </p>

        <div className="bg-slate-950/80 border border-slate-800 rounded-xl p-4 max-w-md mx-auto mb-6 text-left text-xs text-slate-400">
          <div className="flex items-center gap-2 text-emerald-400 font-semibold mb-1">
            <ShieldCheck className="w-4 h-4" /> Signature Recorded & Protected
          </div>
          Your USN has been verified. To make an immediate impact, share this petition with your class and section WhatsApp groups.
        </div>

        <button
          onClick={shareOnWhatsApp}
          className="w-full sm:w-auto px-6 py-3 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-sm shadow-lg shadow-emerald-950 flex items-center justify-center gap-2 mx-auto transition"
        >
          <Share2 className="w-4 h-4" /> Share with RRCE Class Groups
        </button>
      </div>
    );
  }

  return (
    <div id="sign-form" className="bg-slate-900/90 border border-slate-800 rounded-2xl p-6 sm:p-8 shadow-xl relative overflow-hidden">
      {/* Decorative tag */}
      <div className="flex items-center justify-between pb-5 border-b border-slate-800 mb-6">
        <div>
          <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-bold bg-rose-500/10 text-rose-400 border border-rose-500/20 mb-1.5">
            <Lock className="w-3 h-3" /> Safe & Verified Student Signing
          </span>
          <h2 className="text-xl sm:text-2xl font-black text-white tracking-tight">
            Sign the Petition Against the ₹1,000 Gown Fee
          </h2>
        </div>
      </div>

      {error && (
        <div className="mb-5 p-3.5 rounded-xl bg-rose-950/50 border border-rose-800/60 text-rose-300 text-xs sm:text-sm flex items-start gap-2">
          <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
          <span>{error}</span>
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-4">
        {/* Privacy Switch (Anonymous vs Public) */}
        <div className="p-3.5 rounded-xl bg-slate-950 border border-slate-800/80">
          <label className="flex items-start gap-3 cursor-pointer">
            <input
              type="checkbox"
              checked={formData.isAnonymous}
              onChange={(e) => setFormData({ ...formData, isAnonymous: e.target.checked })}
              className="mt-1 h-4 w-4 rounded accent-rose-500 border-slate-700 bg-slate-900 cursor-pointer"
            />
            <div className="text-xs">
              <span className="font-bold text-slate-200 block">
                🔒 Sign Anonymously on the Public Wall (Recommended)
              </span>
              <span className="text-slate-400 block mt-0.5">
                Your USN is verified to ensure legitimate RRCE student count, but your name will be hidden as <em>"Anonymous RRCE Student"</em> to protect you from internal mark or attendance penalties.
              </span>
            </div>
          </label>
        </div>

        {/* Name (hidden or optional if anonymous) */}
        {!formData.isAnonymous && (
          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1">
              Your Full Name <span className="text-rose-400">*</span>
            </label>
            <input
              type="text"
              placeholder="e.g. Rahul Sharma"
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3.5 py-2.5 text-sm text-white placeholder-slate-500 focus:outline-none focus:border-rose-500 transition"
              required={!formData.isAnonymous}
            />
          </div>
        )}

        {/* USN Field */}
        <div>
          <div className="flex items-center justify-between mb-1">
            <label className="text-xs font-semibold text-slate-300">
              RRCE USN / Roll Number <span className="text-rose-400">*</span>
            </label>
            <span className="text-[11px] text-slate-500">Publicly masked as 1RR...***</span>
          </div>
          <input
            type="text"
            placeholder="e.g. 1RR21CS045"
            value={formData.usn}
            onChange={(e) => setFormData({ ...formData, usn: e.target.value.toUpperCase() })}
            maxLength={10}
            className="w-full font-mono uppercase bg-slate-950 border border-slate-800 rounded-xl px-3.5 py-2.5 text-sm text-white placeholder-slate-600 focus:outline-none focus:border-rose-500 tracking-wider transition"
            required
          />
        </div>

        {/* Department & Year Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1">
              Department / Branch <span className="text-rose-400">*</span>
            </label>
            <select
              value={formData.department}
              onChange={(e) => setFormData({ ...formData, department: e.target.value })}
              className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2.5 text-xs sm:text-sm text-white focus:outline-none focus:border-rose-500 transition"
            >
              {DEPARTMENTS.map((dept) => (
                <option key={dept} value={dept}>
                  {dept}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1">
              Year of Passing <span className="text-rose-400">*</span>
            </label>
            <select
              value={formData.year}
              onChange={(e) => setFormData({ ...formData, year: e.target.value })}
              className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2.5 text-xs sm:text-sm text-white focus:outline-none focus:border-rose-500 transition"
            >
              {YEARS.map((yr) => (
                <option key={yr} value={yr.split(' ')[0]}>
                  {yr}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Comment / Grievance Statement */}
        <div>
          <label className="block text-xs font-semibold text-slate-300 mb-1">
            Why are you signing? (Your personal experience / testimony)
          </label>
          <textarea
            rows={3}
            placeholder="Share why the ₹1,000 gown charge is unfair, or your thoughts on already-paid alumni fees..."
            value={formData.comment}
            onChange={(e) => setFormData({ ...formData, comment: e.target.value })}
            className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3.5 py-2.5 text-xs sm:text-sm text-white placeholder-slate-600 focus:outline-none focus:border-rose-500 transition"
          />
        </div>

        {/* Submit button */}
        <button
          type="submit"
          disabled={loading}
          className="w-full py-3.5 px-6 rounded-xl bg-gradient-to-r from-rose-600 to-rose-500 hover:from-rose-500 hover:to-rose-600 text-white font-bold text-sm shadow-xl shadow-rose-950/60 transition flex items-center justify-center gap-2 cursor-pointer active:scale-[0.99] disabled:opacity-50"
        >
          {loading ? (
            <span className="flex items-center gap-2">
              <span className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></span>
              Recording Signature...
            </span>
          ) : (
            <span className="flex items-center gap-2">
              <Send className="w-4 h-4" /> Add My Signature to Demand
            </span>
          )}
        </button>

        <p className="text-center text-[11px] text-slate-500">
          By signing, you demand voluntary convocation gowns and financial disclosure of RRCE alumni fees.
        </p>
      </form>
    </div>
  );
}
