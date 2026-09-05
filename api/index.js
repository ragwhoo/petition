import express from 'express';
import cors from 'cors';
import apiRouter from '../server/apiRouter.js';

const app = express();

app.use(cors());
app.use(express.json());

// Routes mounted at root because Vercel routes /api to this serverless function
app.use('/api', apiRouter);
// Also support direct route without /api prefix if rewritten
app.use('/', apiRouter);

export default app;
