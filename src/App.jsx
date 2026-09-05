import React, { useState, useEffect } from 'react';
import { fetchPetitionDetails, signPetition, getUserSignedStatus } from './data/apiClient';

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

  const handleSign = async (e) => {
    e.preventDefault();
    setFormError(null);

    if (!formData.usn.trim() || formData.usn.trim().length < 5) {
      setFormError('Please enter your valid RRCE USN (e.g. 1RR21CS001).');
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
        setPetition(prev => ({
          ...prev,
          signatures: [res.data.signature, ...(prev?.signatures || [])],
          totalSignatures: res.data.totalSignatures
        }));
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
  const percentage = Math.min(100, Math.round((signatureCount / targetCount) * 100));

  return (
    <div className="min-h-screen bg-white text-black font-sans leading-relaxed pb-24 sm:pb-12">
      <div className="max-w-2xl mx-auto px-4 sm:px-6 py-6 sm:py-10">

        {/* Document Header */}
        <header className="border-b-2 border-black pb-5 mb-6 text-left">
          <div className="inline-block border border-black px-2 py-0.5 text-[10px] sm:text-xs font-mono uppercase tracking-wider mb-2">
            RRCE Student Representation
          </div>
          <p className="text-xs uppercase tracking-wider font-semibold text-gray-600 mb-1">
            RajaRajeswari College of Engineering (RRCE), Bengaluru
          </p>
          <h1 className="text-xl sm:text-2xl font-bold tracking-tight text-black leading-snug">
            Student Petition: Convocation Gown Fee & Alumni Fee Transparency
          </h1>
          <p className="text-[11px] sm:text-xs text-gray-500 mt-2 font-mono">
            Date: {new Date().toLocaleDateString('en-IN', { month: 'short', year: 'numeric' })} • To: College Administration & Principal
          </p>
        </header>

        {/* Mobile-Friendly Live Signature Ticker */}
        <section className="border-2 border-black p-4 sm:p-5 mb-6 bg-gray-50">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div>
              <div className="flex items-center gap-2">
                <span className="inline-block w-2.5 h-2.5 rounded-full bg-black animate-ping"></span>
                <span className="text-[11px] sm:text-xs uppercase tracking-wider font-bold text-gray-800">
                  Live Signature Ticker
                </span>
              </div>
              <div className="mt-1 flex items-baseline gap-2">
                <span className="text-3xl sm:text-4xl font-extrabold font-mono text-black">
                  {signatureCount}
                </span>
                <span className="text-xs sm:text-sm text-gray-600 font-medium">
                  / {targetCount} Students Signed
                </span>
              </div>
            </div>

            <div className="w-full sm:w-48 text-left sm:text-right">
              <div className="flex sm:justify-end items-center gap-2 text-xs text-gray-600 mb-1 font-mono">
                <span>Milestone:</span>
                <strong className="text-black font-bold">{percentage}%</strong>
              </div>
              <div className="w-full h-3 border border-black bg-white p-0.5">
                <div
                  className="h-full bg-black transition-all duration-500"
                  style={{ width: `${percentage}%` }}
                ></div>
              </div>
            </div>
          </div>
        </section>

        {/* Factual Statement & Explanation */}
        <article className="space-y-5 text-sm sm:text-base text-gray-800 leading-relaxed border-b border-gray-300 pb-7 mb-7">
          <div>
            <h2 className="text-sm sm:text-base font-bold text-black uppercase tracking-wide border-b border-gray-200 pb-1 mb-2">
              1. The Context
            </h2>
            <p>
              Students at RajaRajeswari College of Engineering (RRCE) are being requested to pay a mandatory fee of <strong>₹1,000</strong> for a convocation gown for the graduation ceremony.
            </p>
          </div>

          <div>
            <h2 className="text-sm sm:text-base font-bold text-black uppercase tracking-wide border-b border-gray-200 pb-1 mb-2">
              2. Why Students Feel This Fee is Unnecessary
            </h2>
            <p className="mb-2">
              The convocation gown is worn for a brief period—approximately 1 to 2 hours—solely for the stage ceremony and photographs. After the event, students have no practical utility for it.
            </p>
            <p>
              Charging ₹1,000 as a non-refundable requirement places an avoidable financial burden on students at the end of four years of engineering study. In most academic institutions, convocation attire is either rented on a nominal refundable deposit basis (typically ₹150–₹200) or made voluntary.
            </p>
          </div>

          <div>
            <h2 className="text-sm sm:text-base font-bold text-black uppercase tracking-wide border-b border-gray-200 pb-1 mb-2">
              3. Clarity Regarding Already-Paid Alumni Association Fees
            </h2>
            <p className="mb-2">
              During admission and throughout our academic tenure, every student has already paid designated fees under the head of <strong>Alumni Association Fees</strong>.
            </p>
            <p>
              To date, students have not received any information, itemized breakdown, or awareness of what services, programs, or resources those fees were intended for or how they have been utilized. Asking students to pay an additional ₹1,000 for graduation attire without addressing the fees already collected creates genuine confusion and concern.
            </p>
          </div>

          <div>
            <h2 className="text-sm sm:text-base font-bold text-black uppercase tracking-wide border-b border-gray-200 pb-1 mb-2">
              4. Our Respectful Appeal to College Administration
            </h2>
            <ul className="list-disc pl-5 space-y-2 text-xs sm:text-sm">
              <li>
                <strong>Make the Gown Fee Optional:</strong> Allow students to either rent the gown at a nominal refundable rate, borrow or arrange their own gown, or attend the ceremony in standard formal attire without compulsory deduction.
              </li>
              <li>
                <strong>Provide Transparency on Alumni Funds:</strong> Share a clear, simple explanation or accounting summary of the Alumni Association fees already collected so students understand how their money has been utilized.
              </li>
              <li>
                <strong>Ensure Open Communication:</strong> Confirm that students can freely raise and discuss these valid financial concerns with the administration without hesitation or worry regarding academic proceedings.
              </li>
            </ul>
          </div>
        </article>

        {/* Mobile-Friendly Sign Form Section */}
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

        {/* Share Section */}
        <section className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 p-4 border border-gray-300 bg-gray-50 mb-8">
          <div>
            <p className="text-xs font-bold text-black">Share with RRCE Classmates</p>
            <p className="text-[11px] text-gray-500">Every verified signature helps present our collective voice.</p>
          </div>
          <div className="flex gap-2">
            <button
              type="button"
              onClick={handleShare}
              className="flex-1 sm:flex-none px-4 py-2.5 bg-black text-white text-xs font-semibold hover:bg-gray-800 text-center"
            >
              Share on WhatsApp
            </button>
            <button
              type="button"
              onClick={handleCopy}
              className="px-3 py-2.5 border border-black text-black text-xs font-semibold hover:bg-white text-center"
            >
              {copied ? 'Copied' : 'Copy Link'}
            </button>
          </div>
        </section>

        {/* Signatures List */}
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
        <footer className="mt-10 pt-5 border-t border-gray-200 text-center text-[11px] text-gray-400 font-mono">
          RRCE Student Representation • Prepared for submission to College Authorities
        </footer>

      </div>

      {/* Floating Sticky Mobile Quick Action Bar */}
      <div className="sm:hidden fixed bottom-0 left-0 right-0 z-50 bg-white border-t-2 border-black p-2.5 px-4 flex items-center justify-between shadow-2xl">
        <div className="flex items-baseline gap-1.5">
          <span className="text-sm font-extrabold font-mono text-black">{signatureCount}</span>
          <span className="text-[11px] text-gray-500 font-medium">signed</span>
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
