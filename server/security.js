import rateLimit from 'express-rate-limit';

export const USN_REGEX = /^1RR\d{2}[A-Z]{2}\d{3}$/;

const allowedOrigins = (process.env.CORS_ORIGINS || '')
  .split(',')
  .map(s => s.trim())
  .filter(Boolean);

export function corsOptions() {
  return {
    origin(origin, callback) {
      // No Origin header: same-origin browser GETs, curl, server-to-server (vite proxy)
      if (!origin) return callback(null, false);
      if (allowedOrigins.includes(origin)) return callback(null, origin);
      // Cross-origin browser request from an unapproved site -> no ACAO header, browser blocks it
      return callback(null, false);
    },
    methods: ['GET', 'POST'],
    allowedHeaders: ['Content-Type']
  };
}

export function securityHeaders(req, res, next) {
  res.setHeader('X-Content-Type-Options', 'nosniff');
  res.setHeader('X-Frame-Options', 'DENY');
  res.setHeader('Referrer-Policy', 'no-referrer');
  res.setHeader('Content-Security-Policy', "default-src 'none'; frame-ancestors 'none'");
  res.setHeader('Cross-Origin-Opener-Policy', 'same-origin');
  next();
}

const rateLimitMessage = { success: false, message: 'Too many requests. Please wait a moment and try again.' };

export const generalLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  limit: 300,
  standardHeaders: 'draft-7',
  legacyHeaders: false,
  message: rateLimitMessage
});

export const signLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  limit: 20,
  standardHeaders: 'draft-7',
  legacyHeaders: false,
  message: rateLimitMessage
});

export const likeLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  limit: 30,
  standardHeaders: 'draft-7',
  legacyHeaders: false,
  message: rateLimitMessage
});

export const createLimiter = rateLimit({
  windowMs: 60 * 60 * 1000,
  limit: 5,
  standardHeaders: 'draft-7',
  legacyHeaders: false,
  message: rateLimitMessage
});

export const FIELD_LIMITS = {
  name: 80,
  comment: 500,
  department: 100,
  year: 10,
  title: 200,
  summary: 2000,
  authorName: 100,
  demand: 200
};

export function sanitizeString(value, maxLen) {
  if (typeof value !== 'string') return '';
  return value.trim().slice(0, maxLen);
}