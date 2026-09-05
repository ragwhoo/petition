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
    window.open(`https://api.whatsapp.com/send?text=${encodeURIComponent(text)}`, '_blank');
  };

  const handleCopy = () => {
    navigator.clipboard.writeText(window.location.href);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const signatureCount = petition?.signatures?.length || 0;
  const targetCount = petition?.targetSignatures || 500;

  return (
    <div className="min-h-screen bg-white text-black py-8 px-4 sm:px-6 lg:px-8 max-w-3xl mx-auto font-sans leading-relaxed">
      
      {/* Document Header */}
      <header className="border-b-2 border-black pb-6 mb-8 text-center sm:text-left">
        <p className="text-xs uppercase tracking-widest font-semibold text-gray-600 mb-1">
          RajaRajeswari College of Engineering (RRCE), Bengaluru
        </p>
        <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-black">
          Student Petition: Convocation Gown Fee & Alumni Fee Transparency
        </h1>
        <p className="text-xs text-gray-500 mt-2 font-mono">
          Document Date: {new Date().toLocaleDateString('en-IN', { month: 'long', year: 'numeric' })} | Target: College Administration & Principal
        </p>
      </header>

      {/* Live Signature Ticker */}
      <section className="border-2 border-black p-5 mb-8 bg-gray-50">
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2">
              <span className="inline-block w-2.5 h-2.5 rounded-full bg-black animate-ping"></span>
              <span className="text-xs uppercase tracking-wider font-bold text-gray-700">
                Live Signature Ticker
              </span>
            </div>
            <div className="mt-1 flex items-baseline gap-2">
              <span className="text-4xl sm:text-5xl font-extrabold font-mono text-black">
                {signatureCount}
              </span>
              <span className="text-sm text-gray-600 font-medium">
                / {targetCount} Students Signed
              </span>
            </div>
          </div>

          <div className="text-center sm:text-right">
            <div className="text-xs text-gray-600 mb-1">Milestone Progress</div>
            <div className="w-48 h-3 border border-black bg-white p-0.5">
              <div
                className="h-full bg-black transition-all duration-500"
                style={{ width: `${Math.min(100, Math.round((signatureCount / targetCount) * 100))}%` }}
              ></div>
            </div>
            <span className="text-xs font-mono font-semibold text-gray-800 block mt-1">
              {Math.min(100, Math.round((signatureCount / targetCount) * 100))}% of Goal
            </span>
          </div>
        </div>
      </section>

      {/* Explanation of the Issue */}
      <article className="space-y-6 text-sm sm:text-base text-gray-800 leading-relaxed border-b border-gray-300 pb-8 mb-8">
        <div>
          <h2 className="text-lg font-bold text-black uppercase tracking-wide border-b border-gray-200 pb-1 mb-3">
            1. The Context
          </h2>
          <p>
            Students at RajaRajeswari College of Engineering (RRCE) are being requested to pay a mandatory fee of <strong>₹1,000</strong> for a convocation gown for the upcoming graduation ceremony.
          </p>
        </div>

        <div>
          <h2 className="text-lg font-bold text-black uppercase tracking-wide border-b border-gray-200 pb-1 mb-3">
            2. Why Students Feel This Fee is Unnecessary
          </h2>
          <p className="mb-2">
            The convocation gown is worn for a brief period—approximately 1 to 2 hours—solely for the formal stage procession and photograph sessions. After the ceremony, students have no practical utility or purpose for the gown.
          </p>
          <p>
            Charging ₹1,000 as a non-refundable requirement places an avoidable financial burden on students and their families at the very end of four years of engineering study. In most academic institutions, convocation attire is either rented on a nominal refundable deposit basis (typically ₹150–₹200) or made voluntary.
          </p>
        </div>

        <div>
          <h2 className="text-lg font-bold text-black uppercase tracking-wide border-b border-gray-200 pb-1 mb-3">
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
          <h2 className="text-lg font-bold text-black uppercase tracking-wide border-b border-gray-200 pb-1 mb-3">
            4. Our Respectful Appeal to College Administration
          </h2>
          <ul className="list-disc pl-5 space-y-2">
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

      {/* Sign Form Section */}
      <section className="border-2 border-black p-6 mb-8 bg-white">
        <h2 className="text-lg font-bold text-black uppercase tracking-wide mb-2">
          Add Your Signature to This Representation
        </h2>
        <p className="text-xs text-gray-600 mb-6">
          To maintain validity, signatures require an RRCE USN. You may choose to sign anonymously on the public list to protect your privacy.
        </p>

        {signed ? (
          <div className="p-4 border border-black bg-gray-50 text-center space-y-2">
            <p className="font-bold text-black">✓ Thank you. Your signature has been recorded.</p>
            <p className="text-xs text-gray-600">
              Please share this page with your batchmates and class groups so our collective concern can be presented to the administration.
            </p>
            <div className="pt-2 flex justify-center gap-3">
              <button
                onClick={handleShare}
                className="px-4 py-2 bg-black text-white text-xs font-semibold hover:bg-gray-800"
              >
                Share on WhatsApp
              </button>
              <button
                onClick={handleCopy}
                className="px-4 py-2 border border-black text-black text-xs font-semibold hover:bg-gray-100"
              >
                {copied ? 'Link Copied' : 'Copy Page Link'}
              </button>
            </div>
          </div>
        ) : (
          <form onSubmit={handleSign} className="space-y-4 text-sm">
            {formError && (
              <div className="p-3 border border-red-600 bg-red-50 text-red-700 text-xs">
                {formError}
              </div>
            )}

            <div className="border border-gray-300 p-3 bg-gray-50">
              <label className="flex items-start gap-2 cursor-pointer">
                <input
                  type="checkbox"
                  checked={formData.isAnonymous}
                  onChange={(e) => setFormData({ ...formData, isAnonymous: e.target.checked })}
                  className="mt-1"
                />
                <span className="text-xs text-gray-700">
                  <strong>Keep my name anonymous on the public list</strong> (Your USN is verified internally to prevent duplicate entries, but your name will be displayed only as "Anonymous Student").
                </span>
              </label>
            </div>

            {!formData.isAnonymous && (
              <div>
                <label className="block text-xs font-semibold text-gray-700 mb-1">
                  Full Name
                </label>
                <input
                  type="text"
                  placeholder="Your Name"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  className="w-full border border-black p-2 text-sm focus:outline-none"
                  required={!formData.isAnonymous}
                />
              </div>
            )}

            <div>
              <label className="block text-xs font-semibold text-gray-700 mb-1">
                RRCE USN / Roll Number <span className="text-gray-400 font-normal">(e.g. 1RR21CS001 — Masked publicly as 1RR...***)</span>
              </label>
              <input
                type="text"
                placeholder="1RR21..."
                value={formData.usn}
                onChange={(e) => setFormData({ ...formData, usn: e.target.value.toUpperCase() })}
                maxLength={10}
                className="w-full border border-black p-2 font-mono uppercase text-sm focus:outline-none"
                required
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-semibold text-gray-700 mb-1">
                  Department / Branch
                </label>
                <select
                  value={formData.department}
                  onChange={(e) => setFormData({ ...formData, department: e.target.value })}
                  className="w-full border border-black p-2 text-xs focus:outline-none"
                >
                  {DEPARTMENTS.map(d => (
                    <option key={d} value={d}>{d}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-xs font-semibold text-gray-700 mb-1">
                  Year of Passing
                </label>
                <select
                  value={formData.year}
                  onChange={(e) => setFormData({ ...formData, year: e.target.value })}
                  className="w-full border border-black p-2 text-xs focus:outline-none"
                >
                  <option value="2025">2025 (Final Year)</option>
                  <option value="2024">2024 (Graduated)</option>
                  <option value="2026">2026 (3rd Year)</option>
                  <option value="2027">2027 (2nd Year)</option>
                </select>
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-gray-700 mb-1">
                Brief Comment / Note (Optional)
              </label>
              <textarea
                rows={2}
                placeholder="Share your perspective on the gown fee or alumni fee..."
                value={formData.comment}
                onChange={(e) => setFormData({ ...formData, comment: e.target.value })}
                className="w-full border border-black p-2 text-xs focus:outline-none"
              />
            </div>

            <button
              type="submit"
              disabled={submitting}
              className="w-full bg-black text-white font-bold py-3 text-sm hover:bg-gray-800 cursor-pointer disabled:opacity-50"
            >
              {submitting ? 'Recording Signature...' : 'Sign This Petition'}
            </button>
          </form>
        )}
      </section>

      {/* Share Actions */}
      <section className="flex flex-wrap items-center justify-between gap-4 p-4 border border-gray-300 bg-gray-50 mb-8">
        <div>
          <p className="text-xs font-bold text-black">Share with RRCE Classmates</p>
          <p className="text-xs text-gray-500">Every verified signature helps present a collective student voice.</p>
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={handleShare}
            className="px-4 py-2 bg-black text-white text-xs font-semibold hover:bg-gray-800"
          >
            Share on WhatsApp
          </button>
          <button
            onClick={handleCopy}
            className="px-3 py-2 border border-black text-black text-xs font-semibold hover:bg-white"
          >
            {copied ? 'Copied' : 'Copy Link'}
          </button>
        </div>
      </section>

      {/* Signatures List */}
      <section className="border-t-2 border-black pt-6">
        <h3 className="text-base font-bold text-black uppercase tracking-wide mb-4">
          Recent Signatures ({signatureCount})
        </h3>

        {petition?.signatures && petition.signatures.length > 0 ? (
          <div className="space-y-3">
            {petition.signatures.map((sig) => (
              <div key={sig.id} className="border-b border-gray-200 pb-3 text-xs sm:text-sm">
                <div className="flex items-center justify-between text-xs text-gray-600 mb-1">
                  <div>
                    <span className="font-bold text-black mr-2">
                      {sig.isAnonymous ? 'Anonymous Student' : sig.name}
                    </span>
                    <span className="font-mono text-gray-500">({sig.maskedUsn})</span>
                  </div>
                  <span className="text-gray-400">
                    {sig.department} • {sig.year}
                  </span>
                </div>
                {sig.comment && (
                  <p className="text-gray-700 italic pl-2 border-l-2 border-gray-300 my-1">
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

      {/* Simple Clean Footer */}
      <footer className="mt-12 pt-6 border-t border-gray-200 text-center text-xs text-gray-400 font-mono">
        RRCE Student Representation • Prepared for submission to College Authorities
      </footer>

    </div>
  );
}
