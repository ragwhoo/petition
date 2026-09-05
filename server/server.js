import { createApp } from './app.js';

const app = createApp();
const PORT = process.env.PORT || 3001;

app.listen(PORT, () => {
  console.log(`[API Server] Running at http://localhost:${PORT}`);
});