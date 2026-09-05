import express from 'express';
import cors from 'cors';
import apiRouter from './apiRouter.js';
import { corsOptions, securityHeaders, generalLimiter } from './security.js';

export function createApp() {
  const app = express();

  app.set('trust proxy', 1);
  app.disable('x-powered-by');

  app.use(securityHeaders);
  app.use(cors(corsOptions()));
  app.use(express.json({ limit: '16kb' }));

  app.get('/health', (req, res) => {
    res.json({ status: 'ok', time: new Date().toISOString() });
  });

  app.use('/api', generalLimiter);
  app.use('/api', apiRouter);

  return app;
}

export default createApp;