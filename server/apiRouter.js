import express from 'express';
import { initialPetitions } from './data/defaultPetitions.js';
import {
  USN_REGEX,
  signLimiter,
  likeLimiter,
  createLimiter,
  FIELD_LIMITS,
  sanitizeString
} from './security.js';

const router = express.Router();

// In-memory / runtime storage seeded from defaultPetitions
let petitionsStore = JSON.parse(JSON.stringify(initialPetitions));

function findPetition(id) {
  return petitionsStore.find(p => p.id === id || p.slug === id);
}

function maskUsn(usn) {
  if (usn && usn.length >= 6) {
    return usn.substring(0, usn.length - 3) + '***';
  }
  return usn;
}

// GET all petitions
router.get('/petitions', (req, res) => {
  const summaryList = petitionsStore.map(p => ({
    id: p.id,
    slug: p.slug,
    title: p.title,
    category: p.category,
    college: p.college,
    targetSignatures: p.targetSignatures,
    signatureCount: p.signatures.length,
    status: p.status,
    author: p.author,
    createdAt: p.createdAt,
    summary: p.summary
  }));
  res.json({ success: true, data: summaryList });
});

// GET single petition by ID or slug
router.get('/petitions/:id', (req, res) => {
  const { id } = req.params;
  const petition = findPetition(id);

  if (!petition) {
    return res.status(404).json({ success: false, message: 'Petition not found' });
  }

  // Mask USNs for privacy on public wall: show only e.g. "1RR21CS***"
  const safeSignatures = petition.signatures.map(s => ({
    id: s.id,
    name: s.isAnonymous ? 'Anonymous RRCE Student' : s.name,
    department: s.department,
    year: s.year,
    maskedUsn: maskUsn(s.usn),
    comment: s.comment,
    isAnonymous: s.isAnonymous,
    createdAt: s.createdAt,
    likes: s.likes || 0
  }));

  res.json({
    success: true,
    data: {
      ...petition,
      signatures: safeSignatures,
      totalSignatures: petition.signatures.length
    }
  });
});

// POST sign petition
router.post('/petitions/:id/sign', signLimiter, (req, res) => {
  const { id } = req.params;
  const { name, usn, department, year, comment, isAnonymous } = req.body;

  const petition = findPetition(id);
  if (!petition) {
    return res.status(404).json({ success: false, message: 'Petition not found' });
  }

  if (!usn || typeof usn !== 'string') {
    return res.status(400).json({ success: false, message: 'A valid RRCE USN (e.g. 1RR21CS045) is required for verification.' });
  }

  const cleanUsn = usn.trim().toUpperCase();
  if (!USN_REGEX.test(cleanUsn)) {
    return res.status(400).json({
      success: false,
      message: 'Please enter a valid RRCE USN format (e.g. 1RR21CS045).'
    });
  }

  // Check duplicate signature by USN
  const alreadySigned = petition.signatures.some(s => s.usn && s.usn.toUpperCase() === cleanUsn);
  if (alreadySigned) {
    return res.status(400).json({
      success: false,
      message: 'This USN has already signed this petition. Each student may only sign once to maintain petition credibility.'
    });
  }

  const newSignature = {
    id: `sig-${Date.now()}-${Math.floor(Math.random() * 1000)}`,
    name: sanitizeString(name, FIELD_LIMITS.name) || (isAnonymous ? 'Anonymous Student' : 'RRCE Student'),
    usn: cleanUsn,
    department: sanitizeString(department, FIELD_LIMITS.department) || 'General Engineering',
    year: sanitizeString(year, FIELD_LIMITS.year) || '2026',
    comment: sanitizeString(comment, FIELD_LIMITS.comment),
    isAnonymous: Boolean(isAnonymous),
    createdAt: new Date().toISOString(),
    likes: 0
  };

  petition.signatures.unshift(newSignature);

  return res.status(201).json({
    success: true,
    message: 'Petition signed successfully!',
    data: {
      signature: {
        id: newSignature.id,
        name: newSignature.isAnonymous ? 'Anonymous RRCE Student' : newSignature.name,
        department: newSignature.department,
        year: newSignature.year,
        maskedUsn: maskUsn(cleanUsn),
        comment: newSignature.comment,
        isAnonymous: newSignature.isAnonymous,
        createdAt: newSignature.createdAt,
        likes: 0
      },
      totalSignatures: petition.signatures.length
    }
  });
});

// POST like/support a comment
router.post('/petitions/:id/signatures/:sigId/like', likeLimiter, (req, res) => {
  const { id, sigId } = req.params;
  const petition = findPetition(id);
  if (!petition) return res.status(404).json({ success: false, message: 'Petition not found' });

  const signature = petition.signatures.find(s => s.id === sigId);
  if (!signature) return res.status(404).json({ success: false, message: 'Signature not found' });

  signature.likes = (signature.likes || 0) + 1;
  res.json({ success: true, likes: signature.likes });
});

// POST create new petition
router.post('/petitions', createLimiter, (req, res) => {
  const { title, summary, category, demands, targetSignatures, authorName } = req.body;

  const cleanTitle = sanitizeString(title, FIELD_LIMITS.title);
  const cleanSummary = sanitizeString(summary, FIELD_LIMITS.summary);

  if (!cleanTitle || !cleanSummary) {
    return res.status(400).json({ success: false, message: 'Title and summary are required' });
  }

  let target = Number(targetSignatures);
  if (!Number.isFinite(target)) target = 200;
  target = Math.min(2000, Math.max(50, Math.round(target)));

  const cleanDemands = Array.isArray(demands)
    ? demands
        .map(d => sanitizeString(d, FIELD_LIMITS.demand))
        .filter(Boolean)
        .slice(0, 10)
    : [];

  const slug = cleanTitle.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)+/g, '');
  const newPetition = {
    id: `custom-${Date.now()}`,
    slug,
    title: cleanTitle,
    category: sanitizeString(category, 100) || 'Campus General',
    college: 'RajaRajeswari College of Engineering (RRCE), Bengaluru',
    targetSignatures: target,
    createdAt: new Date().toISOString(),
    status: 'active',
    author: {
      name: sanitizeString(authorName, FIELD_LIMITS.authorName) || 'RRCE Student Group',
      badge: 'Student Initiative',
      verified: false
    },
    summary: cleanSummary,
    keyPoints: [],
    demands: cleanDemands.map((d, i) => ({ id: i + 1, title: d, description: '' })),
    signatures: []
  };

  petitionsStore.push(newPetition);
  res.status(201).json({ success: true, data: newPetition });
});

export default router;