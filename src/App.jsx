import React, { useState, useEffect } from 'react';
import { fetchPetitionDetails, signPetition, getUserSignedStatus, isValidUsn } from './data/apiClient';

const DEPARTMENTS = [
  'Computer Science & Engineering',
  'Information Science & Engineering',
  'Electronics & Communication Engineering',
  'Mechanical Engineering',
  'Civil Engineering',
  'Artificial Intelligence & Machine Learning',
  'Electrical & Electronics Engineering',
  'Robotics & Automation',
  'Master of Computer Applications (MCA)',
  'Master of Business Administration (MBA)',
  'Other / Alumni'
];

export default function App() {
  const petitionId = 'rrce-gown-fee';
  const [petition, setPetition] = useState(null);
  const [loading, setLoading] = useState(true);
  const [signed, setSigned] = useState(false);
  const [displayCount, setDisplayCount] = useState(0);
  const [isNumberPulsing, setIsNumberPulsing] = useState(false);
  const [copied, setCopied] = useState(false);

  const [formData, setFormData] = useState({
    name: '',
    usn: '',
    department: DEPARTMENTS[0],
    year: '2025',
    comment: '',
    isAnonymous: true
  });
  const [formError, setFormError] = useState(null);
  const [submitting, setSubmitting] = useState(false);

  // Load petition data
  const loadData = async () => {
    try {
      const data = await fetchPetitionDetails(petitionId);
      setPetition(data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
    setSigned(getUserSignedStatus(petitionId));

    // Live polling ticker every 6 seconds
    const timer = setInterval(() => {
      fetchPetitionDetails(petitionId)
        .then(data => {
          if (data) setPetition(data);
        })
        .catch(() => {});
    }, 6000);

    return () => clearInterval(timer);
  }, []);

  // Smooth live tick-up animation
  useEffect(() => {
    const target = petition?.signatures?.length || 0;
    if (target === 0) {
      setDisplayCount(0);
      return;
    }

    let start = 0;
    const duration = 1000; // 1s smooth count-up
    const startTime = performance.now();

    const animate = (now) => {
      const elapsed = now - startTime;
      const progress = Math.min(elapsed / duration, 1);
      const ease = 1 - Math.pow(1 - progress, 4);
      const current = Math.round(start + (target - start) * ease);
      setDisplayCount(current);

      if (progress < 1) {
        requestAnimationFrame(animate);
      } else {
        setDisplayCount(target);
      }
    };

    requestAnimationFrame(animate);
  }, [petition?.signatures?.length]);

  const handleSign = async (e) => {
    e.preventDefault();
    setFormError(null);

    if (!isValidUsn(formData.usn)) {
      setFormError('Please enter a valid RRCE USN (e.g. 1RR21CS001).');
      return;
    }

    if (!formData.isAnonymous && !formData.name.trim()) {
      setFormError('Please enter your name or check "Keep my name anonymous".');
      return;
    }

    setSubmitting(true);
    try {
      const res = await signPetition(petitionId, formData);
      setSigned(true);
      if (res.data) {
        setIsNumberPulsing(true);
        setTimeout(() => setIsNumberPulsing(false), 800);
        setPetition(prev => ({
          ...prev,
          signatures: [res.data.signature, ...(prev?.signatures || [])],
          totalSignatures: res.data.totalSignatures
        }));
        setDisplayCount(res.data.totalSignatures);
      }
    } catch (err) {
      setFormError(err.message || 'Error recording signature.');
    } finally {
      setSubmitting(false);
    }
  };

  const handleShare = () => {
    const text = `Student Petition - RRCE:\nRegarding the ₹1,000 Convocation Gown fee and clarity on Alumni Association fees.\nRead and sign here: ${window.location.href}`;
    if (navigator.share) {
      navigator.share({
        title: 'RRCE Student Petition',
        text: text,
        url: window.location.href,
      }).catch(() => {});
    } else {
      window.open(`https://api.whatsapp.com/send?text=${encodeURIComponent(text)}`, '_blank');
    }
  };

  const handleCopy = () => {
    navigator.clipboard.writeText(window.location.href);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const scrollToSign = () => {
    const el = document.getElementById('sign-section');
    if (el) {
      el.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  };

  const signatureCount = petition?.signatures?.length || 0;
  const targetCount = petition?.targetSignatures || 500;
  const percentage = Math.min(100, Math.round((displayCount / targetCount) * 100));

  // Split into 4 digits: starts as ['0', '0', '0', '1']
  const digits = String(displayCount).padStart(4, '0').split('');

  return (
    <div className="min-h-screen bg-white text-black font-sans leading-relaxed pb-24 sm:pb-12">
      <div className="max-w-2xl mx-auto px-4 sm:px-6 py-6 sm:py-10">

        {/* HERO SECTION: Extremely Big 4-Digit Ticker + Necessary Context */}
        <section className="border-3 border-black p-5 sm:p-7 mb-7 bg-white shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]">
          <div className="flex items-center justify-between gap-2 border-b-2 border-black pb-3 mb-4">
            <div className="flex items-center gap-2">
              <span className="inline-block w-3 h-3 rounded-full bg-black animate-ping"></span>
              <span className="text-[11px] sm:text-xs uppercase tracking-wider font-extrabold text-black font-mono">
                Live Student Petition • RRCE
              </span>
            </div>
            <span className="text-[11px] font-mono font-semibold text-gray-700">
              To: Principal Dr. R. Balakrishna
            </span>
          </div>

          <h1 className="text-xl sm:text-2xl font-black text-black leading-snug mb-3">
            Stop Mandatory ₹1,000 Gown Fee & Demand Transparency for Alumni Association Funds
          </h1>

          <p className="text-xs sm:text-sm text-gray-700 leading-relaxed mb-4">
            Students at RajaRajeswari College of Engineering (RRCE) are being asked to pay a mandatory <strong>₹1,000</strong> for a convocation gown that will only be used for 1–2 hours during photos. Having already paid alumni fees with zero breakdown or accounting, we respectfully appeal to Principal Dr. R. Balakrishna and the college administration to make gowns optional and provide transparency on prior funds.
          </p>

          {/* THE EXTREMELY BIG 4-DIGIT TICKER (starts as 0001) */}
          <div className="border-3 border-black p-4 sm:p-6 bg-gray-50 my-4 text-center">
            <div className="text-xs uppercase font-extrabold tracking-widest text-black font-mono mb-3">
              Verified Student Signatures
            </div>

            {/* 4 Huge Individual Digit Boxes */}
            <div className={`flex items-center justify-center gap-2 sm:gap-3.5 my-2 transition-transform duration-200 ${isNumberPulsing ? 'scale-105' : ''}`}>
              {digits.map((digit, idx) => (
                <div
                  key={idx}
                  className="w-16 xs:w-18 sm:w-24 md:w-28 h-22 xs:h-26 sm:h-32 md:h-36 border-3 sm:border-4 border-black bg-white flex items-center justify-center font-mono font-black text-5xl xs:text-6xl sm:text-7xl md:text-8xl text-black shadow-[3px_3px_0px_0px_rgba(0,0,0,1)] sm:shadow-[5px_5px_0px_0px_rgba(0,0,0,1)]"
                >
                  {digit}
                </div>
              ))}
            </div>

            {/* Target & Progress Bar */}
            <div className="mt-4 flex flex-col sm:flex-row items-center justify-between gap-1 text-xs font-mono text-gray-800 max-w-md mx-auto pt-3 border-t-2 border-black">
              <span className="font-bold">Goal: 0500 Signatures</span>
              <span className="font-black text-black">{percentage}% of Target Reached</span>
            </div>

            <div className="w-full h-3.5 border-2 border-black bg-white p-0.5 mt-2 max-w-md mx-auto">
              <div
                className="h-full bg-black transition-all duration-500"
                style={{ width: `${percentage}%` }}
              ></div>
            </div>
          </div>

          {/* Hero Quick Action Buttons */}
          <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2.5 mt-5">
            <button
              type="button"
              onClick={scrollToSign}
              className="flex-1 py-3.5 px-5 bg-black text-white text-xs font-bold uppercase tracking-wider hover:bg-gray-800 active:scale-95 transition text-center cursor-pointer shadow-[2px_2px_0px_0px_rgba(0,0,0,1)]"
            >
              Add Your Signature Below ↓
            </button>
            <button
              type="button"
              onClick={handleShare}
              className="py-3.5 px-5 border-2 border-black text-black text-xs font-bold uppercase tracking-wider hover:bg-gray-100 active:scale-95 transition text-center cursor-pointer"
            >
              Share on WhatsApp 💬
            </button>
          </div>
        </section>

        {/* Concise Detail & Demands */}
        <article className="space-y-5 text-sm sm:text-base text-gray-800 leading-relaxed border-b border-gray-300 pb-7 mb-7">
          <div>
            <h2 className="text-sm sm:text-base font-bold text-black uppercase tracking-wide border-b border-gray-200 pb-1 mb-2">
              1. The Context & Issue
            </h2>
            <p>
              Students at RajaRajeswari College of Engineering (RRCE) are being mandated to pay ₹1,000 for convocation gowns. This gown is worn for barely 1–2 hours for photography and the formal stage procession, after which students have no use for it. Charging ₹1,000 non-refundable imposes an unnecessary financial burden on students and families at the conclusion of 4 years of study.
            </p>
          </div>

          <div>
            <h2 className="text-sm sm:text-base font-bold text-black uppercase tracking-wide border-b border-gray-200 pb-1 mb-2">
              2. Already-Paid Alumni Association Fees
            </h2>
            <p>
              Every student has already paid substantial fees under the head of <strong>Alumni Association Fees</strong> during admission and semester enrollments. No statement, itemized breakdown, or clear record of how these funds were spent has ever been shared with students. Asking for an additional ₹1,000 without explaining prior collections creates understandable concern.
            </p>
          </div>

          <div>
            <h2 className="text-sm sm:text-base font-bold text-black uppercase tracking-wide border-b border-gray-200 pb-1 mb-2">
              3. Our Respectful Appeal to Administration
            </h2>
            <ul className="list-disc pl-5 space-y-2 text-xs sm:text-sm">
              <li>
                <strong>Make Gowns Optional:</strong> Permit students to either rent gowns on a nominal refundable deposit basis (₹150–₹200), arrange their own, or attend in formal attire.
              </li>
              <li>
                <strong>Provide Fee Transparency:</strong> Publish a brief breakdown explaining where already-collected Alumni Association funds have been allocated.
              </li>
              <li>
                <strong>Open Dialogue:</strong> Reassure students that raising these constructive financial queries will not affect academic proceedings.
              </li>
            </ul>
          </div>
        </article>

        {/* Sign Form Section */}
        <section id="sign-section" className="border-2 border-black p-4 sm:p-6 mb-7 bg-white scroll-mt-4">
          <h2 className="text-base sm:text-lg font-bold text-black uppercase tracking-wide mb-1">
            Add Your Signature
          </h2>
          <p className="text-xs text-gray-600 mb-5">
            Requires your RRCE USN to verify authenticity. You may choose to sign anonymously on the public list.
          </p>

          {signed ? (
            <div className="p-4 border-2 border-black bg-gray-50 text-center space-y-3">
              <p className="font-bold text-black text-sm sm:text-base">✓ Your signature has been recorded.</p>
              <p className="text-xs text-gray-600">
                Please share this petition with your batchmates and class groups so our collective concern can be presented to the administration.
              </p>
              <div className="pt-2 flex flex-col sm:flex-row justify-center gap-2">
                <button
                  type="button"
                  onClick={handleShare}
                  className="w-full sm:w-auto px-5 py-3 bg-black text-white text-xs font-semibold hover:bg-gray-800 active:scale-95 transition"
                >
                  Share on WhatsApp
                </button>
                <button
                  type="button"
                  onClick={handleCopy}
                  className="w-full sm:w-auto px-4 py-3 border-2 border-black text-black text-xs font-semibold hover:bg-gray-100 active:scale-95 transition"
                >
                  {copied ? 'Link Copied!' : 'Copy Page Link'}
                </button>
              </div>
            </div>
          ) : (
            <form onSubmit={handleSign} className="space-y-4">
              {formError && (
                <div className="p-3 border-2 border-red-600 bg-red-50 text-red-800 text-xs font-medium">
                  {formError}
                </div>
              )}

              {/* Anonymous Checkbox */}
              <div className="border border-gray-300 p-3 bg-gray-50">
                <label className="flex items-start gap-2.5 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={formData.isAnonymous}
                    onChange={(e) => setFormData({ ...formData, isAnonymous: e.target.checked })}
                    className="mt-0.5 h-4 w-4 accent-black cursor-pointer"
                  />
                  <span className="text-xs text-gray-700 leading-snug">
                    <strong>Keep my name anonymous on the public list</strong> (USN is verified internally to prevent duplicates, but shown as "Anonymous Student" publicly).
                  </span>
                </label>
              </div>

              {/* Name (if not anonymous) */}
              {!formData.isAnonymous && (
                <div>
                  <label className="block text-xs font-bold text-gray-700 mb-1 uppercase tracking-wider">
                    Full Name <span className="text-red-600">*</span>
                  </label>
                  <input
                    type="text"
                    placeholder="e.g. Rahul Sharma"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    className="w-full border-2 border-black p-2.5 text-base sm:text-sm focus:outline-none focus:ring-1 focus:ring-black bg-white"
                    required={!formData.isAnonymous}
                  />
                </div>
              )}

              {/* USN */}
              <div>
                <div className="flex justify-between items-center mb-1">
                  <label className="text-xs font-bold text-gray-700 uppercase tracking-wider">
                    RRCE USN / Roll Number <span className="text-red-600">*</span>
                  </label>
                  <span className="text-[11px] text-gray-500 font-mono">Masked as 1RR...***</span>
                </div>
                <input
                  type="text"
                  placeholder="1RR21CS045"
                  value={formData.usn}
                  onChange={(e) => setFormData({ ...formData, usn: e.target.value.toUpperCase() })}
                  maxLength={10}
                  className="w-full border-2 border-black p-2.5 font-mono uppercase text-base sm:text-sm tracking-wider focus:outline-none focus:ring-1 focus:ring-black bg-white"
                  required
                />
              </div>

              {/* Department & Passing Year */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-gray-700 mb-1 uppercase tracking-wider">
                    Department
                  </label>
                  <select
                    value={formData.department}
                    onChange={(e) => setFormData({ ...formData, department: e.target.value })}
                    className="w-full border-2 border-black p-2.5 text-base sm:text-xs focus:outline-none focus:ring-1 focus:ring-black bg-white"
                  >
                    {DEPARTMENTS.map(d => (
                      <option key={d} value={d}>{d}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-bold text-gray-700 mb-1 uppercase tracking-wider">
                    Passing Year
                  </label>
                  <select
                    value={formData.year}
                    onChange={(e) => setFormData({ ...formData, year: e.target.value })}
                    className="w-full border-2 border-black p-2.5 text-base sm:text-xs focus:outline-none focus:ring-1 focus:ring-black bg-white"
                  >
                    <option value="2025">2025 (Final Year)</option>
                    <option value="2024">2024 (Graduated)</option>
                    <option value="2026">2026 (3rd Year)</option>
                    <option value="2027">2027 (2nd Year)</option>
                  </select>
                </div>
              </div>

              {/* Comment */}
              <div>
                <label className="block text-xs font-bold text-gray-700 mb-1 uppercase tracking-wider">
                  Brief Note / Reason (Optional)
                </label>
                <textarea
                  rows={2}
                  placeholder="Share your perspective on the gown fee or alumni fee..."
                  value={formData.comment}
                  onChange={(e) => setFormData({ ...formData, comment: e.target.value })}
                  className="w-full border-2 border-black p-2.5 text-base sm:text-xs focus:outline-none focus:ring-1 focus:ring-black bg-white"
                />
              </div>

              {/* Submit Button */}
              <button
                type="submit"
                disabled={submitting}
                className="w-full bg-black text-white font-bold py-3.5 text-sm uppercase tracking-wider hover:bg-gray-800 active:scale-[0.99] cursor-pointer disabled:opacity-50 transition"
              >
                {submitting ? 'Recording Signature...' : 'Add My Signature'}
              </button>
            </form>
          )}
        </section>

        {/* Recent Signatures List */}
        <section className="border-t-2 border-black pt-5">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-sm sm:text-base font-bold text-black uppercase tracking-wide">
              Recent Signatures ({signatureCount})
            </h3>
            <span className="text-[11px] font-mono text-gray-500">Live Updating</span>
          </div>

          {petition?.signatures && petition.signatures.length > 0 ? (
            <div className="divide-y divide-gray-200">
              {petition.signatures.map((sig) => (
                <div key={sig.id} className="py-3 text-xs sm:text-sm">
                  <div className="flex flex-wrap items-baseline justify-between gap-1 mb-1">
                    <div>
                      <span className="font-bold text-black mr-2">
                        {sig.isAnonymous ? 'Anonymous Student' : sig.name}
                      </span>
                      <span className="font-mono text-gray-500 text-xs">({sig.maskedUsn})</span>
                    </div>
                    <span className="text-[11px] text-gray-500">
                      {sig.department} • {sig.year}
                    </span>
                  </div>
                  {sig.comment && (
                    <p className="text-gray-700 italic pl-2.5 border-l-2 border-gray-400 my-1 text-xs sm:text-sm">
                      "{sig.comment}"
                    </p>
                  )}
                </div>
              ))}
            </div>
          ) : (
            <p className="text-xs text-gray-500 italic">No signatures recorded yet.</p>
          )}
        </section>

        {/* Footer */}
        <footer className="mt-10 pt-5 border-t border-gray-200 text-center text-[11px] text-gray-500 font-mono">
          RRCE Student Representation • Prepared for submission to Principal Dr. R. Balakrishna & RRCE College Administration
        </footer>

      </div>

      {/* Floating Sticky Mobile Quick Action Bar */}
      <div className="sm:hidden fixed bottom-0 left-0 right-0 z-50 bg-white border-t-2 border-black p-2.5 px-4 flex items-center justify-between shadow-2xl">
        <div className="flex items-baseline gap-1.5 font-mono">
          <span className="text-base font-black text-black">{String(displayCount).padStart(4, '0')}</span>
          <span className="text-[11px] text-gray-500">signed</span>
        </div>
        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={scrollToSign}
            className="px-3.5 py-2 bg-black text-white text-xs font-bold uppercase tracking-wider active:scale-95 transition"
          >
            Sign Now
          </button>
          <button
            type="button"
            onClick={handleShare}
            className="px-3 py-2 border border-black text-black text-xs font-bold active:scale-95 transition"
          >
            WhatsApp
          </button>
        </div>
      </div>

    </div>
  );
}
