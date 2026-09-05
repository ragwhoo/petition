import express from 'express';
import { initialPetitions } from './data/defaultPetitions.js';

const router = express.Router();

// In-memory / runtime storage seeded from defaultPetitions
let petitionsStore = JSON.parse(JSON.stringify(initialPetitions));

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
  const petition = petitionsStore.find(p => p.id === id || p.slug === id);
  
  if (!petition) {
    return res.status(404).json({ success: false, message: 'Petition not found' });
  }

  // Mask USNs for privacy on public wall: show only e.g. "1RR21CS***"
  const safeSignatures = petition.signatures.map(s => {
    let maskedUsn = s.usn;
    if (s.usn && s.usn.length >= 6) {
      maskedUsn = s.usn.substring(0, s.usn.length - 3) + '***';
    }
    return {
      id: s.id,
      name: s.isAnonymous ? 'Anonymous RRCE Student' : s.name,
      department: s.department,
      year: s.year,
      maskedUsn,
      comment: s.comment,
      isAnonymous: s.isAnonymous,
      createdAt: s.createdAt,
      likes: s.likes || 0
    };
  });

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
router.post('/petitions/:id/sign', (req, res) => {
  const { id } = req.params;
  const { name, usn, department, year, comment, isAnonymous } = req.body;

  const petition = petitionsStore.find(p => p.id === id || p.slug === id);
  if (!petition) {
    return res.status(404).json({ success: false, message: 'Petition not found' });
  }

  // Basic validation
  if (!usn || typeof usn !== 'string' || usn.trim().length < 5) {
    return res.status(400).json({ success: false, message: 'A valid USN or Roll Number is required for verification.' });
  }

  const cleanUsn = usn.trim().toUpperCase();

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
    name: name && name.trim() ? name.trim() : (isAnonymous ? 'Anonymous Student' : 'RRCE Student'),
    usn: cleanUsn,
    department: department || 'General Engineering',
    year: year || '2025',
    comment: comment ? comment.trim() : '',
    isAnonymous: Boolean(isAnonymous),
    createdAt: new Date().toISOString(),
    likes: 0
  };

  petition.signatures.unshift(newSignature);

  let maskedUsn = cleanUsn;
  if (cleanUsn.length >= 6) {
    maskedUsn = cleanUsn.substring(0, cleanUsn.length - 3) + '***';
  }

  return res.status(201).json({
    success: true,
    message: 'Petition signed successfully!',
    data: {
      signature: {
        id: newSignature.id,
        name: newSignature.isAnonymous ? 'Anonymous RRCE Student' : newSignature.name,
        department: newSignature.department,
        year: newSignature.year,
        maskedUsn,
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
router.post('/petitions/:id/signatures/:sigId/like', (req, res) => {
  const { id, sigId } = req.params;
  const petition = petitionsStore.find(p => p.id === id || p.slug === id);
  if (!petition) return res.status(404).json({ success: false, message: 'Petition not found' });

  const signature = petition.signatures.find(s => s.id === sigId);
  if (!signature) return res.status(404).json({ success: false, message: 'Signature not found' });

  signature.likes = (signature.likes || 0) + 1;
  res.json({ success: true, likes: signature.likes });
});

// POST create new petition
router.post('/petitions', (req, res) => {
  const { title, summary, category, demands, targetSignatures, authorName } = req.body;

  if (!title || !summary) {
    return res.status(400).json({ success: false, message: 'Title and summary are required' });
  }

  const slug = title.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)+/g, '');
  const newPetition = {
    id: `custom-${Date.now()}`,
    slug,
    title: title.trim(),
    category: category || 'Campus General',
    college: 'RajaRajeswari College of Engineering (RRCE), Bengaluru',
    targetSignatures: Number(targetSignatures) || 200,
    createdAt: new Date().toISOString(),
    status: 'active',
    author: {
      name: authorName?.trim() || 'RRCE Student Group',
      badge: 'Student Initiative',
      verified: false
    },
    summary: summary.trim(),
    keyPoints: [],
    demands: Array.isArray(demands) ? demands.map((d, i) => ({ id: i + 1, title: d, description: '' })) : [],
    signatures: []
  };

  petitionsStore.push(newPetition);
  res.status(201).json({ success: true, data: newPetition });
});

export default router;
