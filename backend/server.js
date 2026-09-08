import 'dotenv/config';
import express from 'express';
import cors from 'cors';
import router from './routes/suggest.js';

const app = express();
app.use(cors());
app.use(express.json());
app.use('/api', router);

app.get('/api/health', (req, res) => {
  res.json({ ok: true, mockMode: process.env.MOCK_MODE === 'true' });
});

const PORT = process.env.PORT || 3001;

// Only listen when run directly — not when Jest imports the app
// if (require.main === module) {
// ESM equivalent of the old `require.main === module` guard
if (import.meta.url === `file://${process.argv[1]}`) {
  app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT} (mockMode=${process.env.MOCK_MODE === 'true'})`);
  });
}

export default app;