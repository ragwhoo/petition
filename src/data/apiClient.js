// Robust API client with automatic LocalStorage synchronization fallback
// This guarantees that the site works seamlessly locally, on Vercel serverless, and even offline!
import { initialPetitions } from '../../server/data/defaultPetitions.js';

const STORAGE_KEY = 'rrce_petitions_clean_v2';
const USER_SIGNATURES_KEY = 'rrce_user_signed_usns';

// Initialize local storage if needed
function getLocalStore() {
  try {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (saved) return JSON.parse(saved);
  } catch (e) {
    console.warn('LocalStorage not accessible', e);
  }
  return initialPetitions;
}

function saveLocalStore(data) {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
  } catch (e) {
    console.warn('LocalStorage save failed', e);
  }
}

export function getUserSignedStatus(petitionId) {
  try {
    const signed = JSON.parse(localStorage.getItem(USER_SIGNATURES_KEY) || '{}');
    return signed[petitionId] || false;
  } catch {
    return false;
  }
}

export function markUserSigned(petitionId, usn) {
  try {
    const signed = JSON.parse(localStorage.getItem(USER_SIGNATURES_KEY) || '{}');
    signed[petitionId] = { usn, signedAt: new Date().toISOString() };
    localStorage.setItem(USER_SIGNATURES_KEY, JSON.stringify(signed));
  } catch (e) {
    console.warn('Failed to mark signed', e);
  }
}

// Fetch all petitions
export async function fetchPetitions() {
  try {
    const res = await fetch('/api/petitions');
    if (res.ok) {
      const data = await res.json();
      if (data.success && data.data?.length) {
        return data.data;
      }
    }
  } catch (e) {
    console.log('Using local fallback for petitions list');
  }

  const local = getLocalStore();
  return local.map(p => ({
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
}

// Fetch petition details
export async function fetchPetitionDetails(id) {
  try {
    const res = await fetch(`/api/petitions/${id}`);
    if (res.ok) {
      const data = await res.json();
      if (data.success && data.data) {
        return data.data;
      }
    }
  } catch (e) {
    console.log('Using local fallback for petition detail');
  }

  const local = getLocalStore();
  const petition = local.find(p => p.id === id || p.slug === id);
  if (!petition) throw new Error('Petition not found');

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

  return {
    ...petition,
    signatures: safeSignatures,
    totalSignatures: petition.signatures.length
  };
}

// Sign petition
export async function signPetition(petitionId, formData) {
  try {
    const res = await fetch(`/api/petitions/${petitionId}/sign`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(formData)
    });
    const data = await res.json();
    if (res.ok && data.success) {
      markUserSigned(petitionId, formData.usn);
      return data;
    } else if (data.message) {
      throw new Error(data.message);
    }
  } catch (e) {
    if (e.message && !e.message.includes('fetch')) {
      throw e;
    }
    console.log('Falling back to local signature storage');
  }

  // Local fallback signing
  const store = getLocalStore();
  const petition = store.find(p => p.id === petitionId || p.slug === petitionId);
  if (!petition) throw new Error('Petition not found');

  const cleanUsn = formData.usn.trim().toUpperCase();
  const alreadySigned = petition.signatures.some(s => s.usn && s.usn.toUpperCase() === cleanUsn);
  if (alreadySigned) {
    throw new Error('This USN has already signed this petition.');
  }

  const newSig = {
    id: `sig-${Date.now()}`,
    name: formData.name && formData.name.trim() ? formData.name.trim() : (formData.isAnonymous ? 'Anonymous Student' : 'RRCE Student'),
    usn: cleanUsn,
    department: formData.department || 'General Engineering',
    year: formData.year || '2025',
    comment: formData.comment ? formData.comment.trim() : '',
    isAnonymous: Boolean(formData.isAnonymous),
    createdAt: new Date().toISOString(),
    likes: 0
  };

  petition.signatures.unshift(newSig);
  saveLocalStore(store);
  markUserSigned(petitionId, cleanUsn);

  let maskedUsn = cleanUsn;
  if (cleanUsn.length >= 6) {
    maskedUsn = cleanUsn.substring(0, cleanUsn.length - 3) + '***';
  }

  return {
    success: true,
    message: 'Signed successfully!',
    data: {
      signature: {
        id: newSig.id,
        name: newSig.isAnonymous ? 'Anonymous RRCE Student' : newSig.name,
        department: newSig.department,
        year: newSig.year,
        maskedUsn,
        comment: newSig.comment,
        isAnonymous: newSig.isAnonymous,
        createdAt: newSig.createdAt,
        likes: 0
      },
      totalSignatures: petition.signatures.length
    }
  };
}

// Like a comment
export async function likeComment(petitionId, sigId) {
  try {
    const res = await fetch(`/api/petitions/${petitionId}/signatures/${sigId}/like`, {
      method: 'POST'
    });
    if (res.ok) {
      const data = await res.json();
      return data.likes;
    }
  } catch (e) {
    // fallback
  }

  const store = getLocalStore();
  const petition = store.find(p => p.id === petitionId);
  if (petition) {
    const sig = petition.signatures.find(s => s.id === sigId);
    if (sig) {
      sig.likes = (sig.likes || 0) + 1;
      saveLocalStore(store);
      return sig.likes;
    }
  }
  return 1;
}

// Create new petition
export async function createPetition(petitionData) {
  try {
    const res = await fetch('/api/petitions', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(petitionData)
    });
    const data = await res.json();
    if (res.ok && data.success) {
      return data.data;
    }
  } catch (e) {
    console.log('Local fallback create petition');
  }

  const store = getLocalStore();
  const slug = petitionData.title.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)+/g, '');
  const newP = {
    id: `custom-${Date.now()}`,
    slug,
    title: petitionData.title.trim(),
    category: petitionData.category || 'Campus General',
    college: 'RajaRajeswari College of Engineering (RRCE), Bengaluru',
    targetSignatures: Number(petitionData.targetSignatures) || 200,
    createdAt: new Date().toISOString(),
    status: 'active',
    author: {
      name: petitionData.authorName?.trim() || 'RRCE Student Group',
      badge: 'Student Initiative',
      verified: false
    },
    summary: petitionData.summary.trim(),
    keyPoints: [],
    demands: Array.isArray(petitionData.demands) ? petitionData.demands.map((d, i) => ({ id: i + 1, title: d, description: '' })) : [],
    signatures: []
  };

  store.push(newP);
  saveLocalStore(store);
  return newP;
}
