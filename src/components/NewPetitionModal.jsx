import React, { useState } from 'react';
import { X, Plus, Trash2, Megaphone, CheckCircle } from 'lucide-react';
import { createPetition } from '../data/apiClient';

const CATEGORIES = [
  'College Fees & Dues',
  'Campus Life & Canteen',
  'Hostel & Accommodation',
  'Academics & Examination',
  'Placements & Training',
  'Lab Equipment & Facilities'
];

export default function NewPetitionModal({ isOpen, onClose, onCreated }) {
  const [title, setTitle] = useState('');
  const [category, setCategory] = useState(CATEGORIES[0]);
  const [summary, setSummary] = useState('');
  const [demands, setDemands] = useState(['']);
  const [targetSignatures, setTargetSignatures] = useState(300);
  const [authorName, setAuthorName] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  if (!isOpen) return null;

  const handleAddDemand = () => {
    setDemands([...demands, '']);
  };

  const handleDemandChange = (index, value) => {
    const updated = [...demands];
    updated[index] = value;
    setDemands(updated);
  };

  const handleRemoveDemand = (index) => {
    if (demands.length <= 1) return;
    setDemands(demands.filter((_, i) => i !== index));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!title.trim()) {
      setError('Please provide a title for the petition');
      return;
    }
    if (!summary.trim()) {
      setError('Please provide a description/summary of the grievance');
      return;
    }

    setLoading(true);
    setError(null);
    try {
      const validDemands = demands.filter(d => d.trim().length > 0);
      const newPetition = await createPetition({
        title,
        category,
        summary,
        demands: validDemands,
        targetSignatures,
        authorName: authorName || 'RRCE Student Forum'
      });
      if (onCreated) {
        onCreated(newPetition);
      }
      onClose();
    } catch (err) {
      setError(err.message || 'Failed to create petition');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
      <div className="bg-slate-900 border border-slate-700 rounded-2xl w-full max-w-2xl max-h-[92vh] flex flex-col shadow-2xl">
        <div className="flex items-center justify-between p-5 border-b border-slate-800">
          <div className="flex items-center gap-2">
            <Megaphone className="w-5 h-5 text-rose-400" />
            <h3 className="font-bold text-white text-base sm:text-lg">
              Start a New Student Petition at RRCE
            </h3>
          </div>
          <button
            onClick={onClose}
            className="p-1 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 overflow-y-auto space-y-4">
          {error && (
            <div className="p-3 bg-rose-950/60 border border-rose-800 rounded-lg text-rose-300 text-xs">
              {error}
            </div>
          )}

          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1">
              Petition Title <span className="text-rose-400">*</span>
            </label>
            <input
              type="text"
              placeholder="e.g. Stop Mandatory ₹500 Placement Training Fee for Off-Campus Placed Students"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3.5 py-2.5 text-xs sm:text-sm text-white focus:outline-none focus:border-rose-500"
              required
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">
                Category
              </label>
              <select
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2.5 text-xs text-white focus:outline-none focus:border-rose-500"
              >
                {CATEGORIES.map(cat => (
                  <option key={cat} value={cat}>{cat}</option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">
                Target Signatures Goal
              </label>
              <input
                type="number"
                min="50"
                max="2000"
                step="50"
                value={targetSignatures}
                onChange={(e) => setTargetSignatures(Number(e.target.value))}
                className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2.5 text-xs text-white focus:outline-none focus:border-rose-500"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1">
              Grievance Background & Summary <span className="text-rose-400">*</span>
            </label>
            <textarea
              rows={3}
              placeholder="Explain why this issue is unfair to RRCE students, what has happened, and why collective action is needed..."
              value={summary}
              onChange={(e) => setSummary(e.target.value)}
              className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3.5 py-2.5 text-xs sm:text-sm text-white focus:outline-none focus:border-rose-500"
              required
            />
          </div>

          <div>
            <div className="flex items-center justify-between mb-1">
              <label className="text-xs font-semibold text-slate-300">
                Key Demands to College Management
              </label>
              <button
                type="button"
                onClick={handleAddDemand}
                className="text-[11px] text-rose-400 hover:text-rose-300 flex items-center gap-1 font-semibold"
              >
                <Plus className="w-3 h-3" /> Add Demand
              </button>
            </div>
            <div className="space-y-2">
              {demands.map((demand, index) => (
                <div key={index} className="flex items-center gap-2">
                  <span className="text-xs font-mono text-slate-500 w-4">{index + 1}.</span>
                  <input
                    type="text"
                    placeholder={`Demand #${index + 1} (e.g. Roll back fee or provide full financial breakdown)`}
                    value={demand}
                    onChange={(e) => handleDemandChange(index, e.target.value)}
                    className="flex-1 bg-slate-950 border border-slate-800 rounded-lg px-3 py-2 text-xs text-white focus:outline-none focus:border-rose-500"
                  />
                  {demands.length > 1 && (
                    <button
                      type="button"
                      onClick={() => handleRemoveDemand(index)}
                      className="p-1.5 text-slate-500 hover:text-rose-400 transition"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  )}
                </div>
              ))}
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1">
              Initiator / Student Body Name (Optional)
            </label>
            <input
              type="text"
              placeholder="e.g. Concerned RRCE 2026 Students or Anonymous Forum"
              value={authorName}
              onChange={(e) => setAuthorName(e.target.value)}
              className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-rose-500"
            />
          </div>

          <div className="pt-4 border-t border-slate-800 flex justify-end gap-3">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 rounded-lg bg-slate-800 text-slate-300 text-xs font-semibold hover:bg-slate-700 transition"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={loading}
              className="px-5 py-2 rounded-lg bg-rose-600 hover:bg-rose-500 text-white text-xs font-bold transition flex items-center gap-2 cursor-pointer shadow-lg shadow-rose-950"
            >
              {loading ? 'Publishing...' : 'Launch Petition'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
