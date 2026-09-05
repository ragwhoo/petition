import { createApp } from '../server/app.js';

// Vercel routes /api to this serverless function. The router is mounted at
// /api in createApp(), so the original request path is preserved.
export default createApp();