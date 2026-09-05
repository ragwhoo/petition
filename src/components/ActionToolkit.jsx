import React, { useState } from 'react';
import { Share2, FileText, Download, Copy, Check, MessageCircle, Send } from 'lucide-react';

export default function ActionToolkit({ petition, onOpenLetterModal }) {
  const [copiedLink, setCopiedLink] = useState(false);

  const shareText = `🎓 *RRCE STUDENTS STAND TOGETHER!*

RRCE is demanding a mandatory *₹1,000 fee for Convocation Gowns* (used for just 1-2 hours) on top of unaccounted *Alumni Association fees* we already paid!

We are demanding:
1️⃣ Make gown optional or nominal ₹150 refundable rental
2️⃣ Complete audit of already-paid Alumni Association funds
3️⃣ Zero retaliation on students

👉 *Sign the petition now (Anonymous option available):*
${window.location.href}

Forward to all RRCE class groups & batchmates!`;

  const handleWhatsAppShare = () => {
    window.open(`https://api.whatsapp.com/send?text=${encodeURIComponent(shareText)}`, '_blank');
  };

  const handleCopyLink = () => {
    navigator.clipboard.writeText(window.location.href);
    setCopiedLink(true);
    setTimeout(() => setCopiedLink(false), 2000);
  };

  const handleExportCSV = () => {
    if (!petition || !petition.signatures) return;
    
    const headers = ['ID', 'Student Name / Status', 'Department', 'Batch Year', 'Masked USN', 'Testimony / Reason', 'Signed Date'];
    const rows = petition.signatures.map(s => [
      s.id,
      s.isAnonymous ? 'Anonymous Student' : `"${s.name.replace(/"/g, '""')}"`,
      `"${s.department || ''}"`,
      s.year || '',
      s.maskedUsn || '',
      `"${(s.comment || '').replace(/"/g, '""')}"`,
      new Date(s.createdAt).toISOString()
    ]);

    const csvContent = 'data:text/csv;charset=utf-8,' + [headers.join(','), ...rows.map(e => e.join(','))].join('\n');
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `RRCE_Gown_Petition_Signatures_${new Date().toISOString().slice(0,10)}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-6 sm:p-8 shadow-xl">
      <div className="pb-4 border-b border-slate-800 mb-6">
        <h3 className="text-lg sm:text-xl font-bold text-white tracking-tight flex items-center gap-2">
          <Send className="w-5 h-5 text-rose-400" />
          Mobilize & Escalate Action Kit
        </h3>
        <p className="text-xs sm:text-sm text-slate-400 mt-1">
          Petitions succeed through numbers. Help spread the word across all 2025/2026 RRCE engineering branches.
        </p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Action 1: WhatsApp */}
        <button
          onClick={handleWhatsAppShare}
          className="p-4 rounded-xl bg-emerald-950/40 hover:bg-emerald-900/50 border border-emerald-500/40 text-left transition group cursor-pointer"
        >
          <div className="w-8 h-8 rounded-lg bg-emerald-500/20 text-emerald-400 flex items-center justify-center mb-3 group-hover:scale-110 transition">
            <MessageCircle className="w-4 h-4" />
          </div>
          <h4 className="text-xs font-bold text-emerald-300">WhatsApp Class Broadcast</h4>
          <p className="text-[11px] text-slate-400 mt-1">
            Send ready-formatted alert directly to your section & batch groups.
          </p>
        </button>

        {/* Action 2: Copy Link */}
        <button
          onClick={handleCopyLink}
          className="p-4 rounded-xl bg-slate-950/70 hover:bg-slate-800/80 border border-slate-800 text-left transition group cursor-pointer"
        >
          <div className="w-8 h-8 rounded-lg bg-slate-800 text-rose-400 flex items-center justify-center mb-3 group-hover:scale-110 transition">
            {copiedLink ? <Check className="w-4 h-4 text-emerald-400" /> : <Copy className="w-4 h-4" />}
          </div>
          <h4 className="text-xs font-bold text-white">
            {copiedLink ? 'Link Copied!' : 'Copy Campaign Link'}
          </h4>
          <p className="text-[11px] text-slate-400 mt-1">
            Share on Instagram stories, Telegram channels, and Discord servers.
          </p>
        </button>

        {/* Action 3: Formal Letter */}
        <button
          onClick={onOpenLetterModal}
          className="p-4 rounded-xl bg-slate-950/70 hover:bg-slate-800/80 border border-slate-800 text-left transition group cursor-pointer"
        >
          <div className="w-8 h-8 rounded-lg bg-slate-800 text-amber-400 flex items-center justify-center mb-3 group-hover:scale-110 transition">
            <FileText className="w-4 h-4" />
          </div>
          <h4 className="text-xs font-bold text-white">Official Representation</h4>
          <p className="text-[11px] text-slate-400 mt-1">
            Generate formal letter addressed to Principal & VTU Grievance Cell.
          </p>
        </button>

        {/* Action 4: Download CSV */}
        <button
          onClick={handleExportCSV}
          className="p-4 rounded-xl bg-slate-950/70 hover:bg-slate-800/80 border border-slate-800 text-left transition group cursor-pointer"
        >
          <div className="w-8 h-8 rounded-lg bg-slate-800 text-indigo-400 flex items-center justify-center mb-3 group-hover:scale-110 transition">
            <Download className="w-4 h-4" />
          </div>
          <h4 className="text-xs font-bold text-white">Export Signatures (.CSV)</h4>
          <p className="text-[11px] text-slate-400 mt-1">
            Download verified signature records for submitting a physical memorandum.
          </p>
        </button>
      </div>
    </div>
  );
}
