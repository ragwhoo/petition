import React, { useState } from 'react';
import { X, Copy, Check, Printer, Mail, FileText } from 'lucide-react';

export default function FormalLetterModal({ petition, signatureCount, isOpen, onClose }) {
  const [copied, setCopied] = useState(false);

  if (!isOpen) return null;

  const letterDate = new Date().toLocaleDateString('en-IN', {
    day: 'numeric',
    month: 'long',
    year: 'numeric'
  });

  const letterText = `Date: ${letterDate}

To,
The Principal,
RajaRajeswari College of Engineering (RRCE),
Ramohalli Cross, Kumbalgodu, Mysore Road,
Bengaluru, Karnataka - 560074.

Copy forwarded for kind information to:
1. The Registrar & VTU Grievance Redressal Cell, Visvesvaraya Technological University (VTU), Belagavi.
2. The Management & Trustees, Moogambigai Charitable and Educational Trust.

SUBJECT: FORMAL REPRESENTATION ON BEHALF OF GRADUATING STUDENTS REGARDING MANDATORY ₹1,000 CONVOCATION GOWN FEE AND CLARIFICATION ON ALUMNI ASSOCIATION FUNDS.

Respected Principal Sir / Authorities,

We, the graduating undergraduate and postgraduate students of RajaRajeswari College of Engineering (RRCE), submit this collective representation backed by ${signatureCount} verified student signatures.

We wish to bring the following urgent concerns to your immediate attention:

1. MANDATORY ₹1,000 GOWN FEE IS UNJUSTIFIED:
Students are being compelled to pay a mandatory, non-refundable fee of ₹1,000 for a convocation gown that is worn for barely 1–2 hours during the photo session and ceremony. Standard bulk rental rates across institutions in Bengaluru range between ₹150 to ₹250 (as a refundable security deposit). Imposing an arbitrary ₹1,000 charge without the option to opt out or wear traditional academic formals places an undue financial burden on our families.

2. TRANSPARENCY ON ALUMNI ASSOCIATION FUNDS:
Every graduating student has already paid substantial fees under the head of 'Alumni Association' during admission and academic progression. To date, no itemized financial statement, alumni portal, networking initiative, or activity report has been published regarding how these funds have been utilized. Collecting additional mandatory convocation fees without accounting for already-collected alumni funds violates basic principles of institutional transparency.

3. OUR FORMAL RESOLUTIONS & REQUESTS:
a) Make convocation gowns optional, or provide them at a nominal, refundable rental rate not exceeding ₹150–₹200.
b) Issue an itemized financial statement detailing the utilization of Alumni Association fees collected over the last four academic cycles.
c) Issue an official assurance that no student will be denied their degree certificate, entry to the convocation hall, or face academic penalization for raising these legitimate administrative concerns.

We trust the management will uphold student welfare and resolve this matter amicably before the scheduled convocation.

Yours sincerely,
On behalf of ${signatureCount} Students & Alumni of RRCE
(Verified Digital Signatures on Record)`;

  const handleCopy = () => {
    navigator.clipboard.writeText(letterText);
    setCopied(true);
    setTimeout(() => setCopied(false), 2500);
  };

  const handlePrint = () => {
    window.print();
  };

  const handleEmail = () => {
    const subject = encodeURIComponent('Representation: Revocation of Mandatory Gown Fee & Alumni Fund Transparency - RRCE Students');
    const body = encodeURIComponent(letterText);
    window.open(`mailto:principal@rrce.org?cc=info@rrce.org&subject=${subject}&body=${body}`, '_blank');
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
      <div className="bg-slate-900 border border-slate-700 rounded-2xl w-full max-w-3xl max-h-[90vh] flex flex-col shadow-2xl">
        {/* Header */}
        <div className="flex items-center justify-between p-5 border-b border-slate-800">
          <div className="flex items-center gap-2">
            <FileText className="w-5 h-5 text-rose-400" />
            <h3 className="font-bold text-white text-base sm:text-lg">
              Official Student Representation Letter
            </h3>
          </div>
          <button
            onClick={onClose}
            className="p-1 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Body / Letter Preview */}
        <div className="p-6 overflow-y-auto font-mono text-xs sm:text-sm text-slate-300 leading-relaxed bg-slate-950 m-4 rounded-xl border border-slate-800 whitespace-pre-wrap select-text">
          {letterText}
        </div>

        {/* Footer Actions */}
        <div className="flex flex-wrap items-center justify-between gap-3 p-5 border-t border-slate-800 bg-slate-900/60">
          <span className="text-xs text-slate-400">
            Backed by <strong className="text-rose-400">{signatureCount}</strong> verified RRCE students
          </span>

          <div className="flex items-center gap-2">
            <button
              onClick={handleCopy}
              className="flex items-center gap-1.5 px-3.5 py-2 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-semibold transition border border-slate-700"
            >
              {copied ? <Check className="w-4 h-4 text-emerald-400" /> : <Copy className="w-4 h-4" />}
              <span>{copied ? 'Copied to Clipboard!' : 'Copy Letter'}</span>
            </button>

            <button
              onClick={handleEmail}
              className="flex items-center gap-1.5 px-3.5 py-2 rounded-lg bg-rose-950/60 hover:bg-rose-900/60 text-rose-300 text-xs font-semibold transition border border-rose-800/40"
            >
              <Mail className="w-4 h-4" />
              <span>Email Principal</span>
            </button>

            <button
              onClick={handlePrint}
              className="flex items-center gap-1.5 px-3.5 py-2 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-semibold transition shadow-md"
            >
              <Printer className="w-4 h-4" />
              <span>Print / Save PDF</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
