require('dotenv').config();
const express = require('express');
const cors = require('cors');
const suggestRouter = require('./routes/suggest');

const app = express();
app.use(cors());
app.use(express.json());
app.use('/api', suggestRouter);

app.get('/api/health', (req, res) => {
  res.json({ ok: true, mockMode: process.env.MOCK_MODE === 'true' });
});

const PORT = process.env.PORT || 3001;

// Only listen when run directly — not when Jest imports the app
if (require.main === module) {
  app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT} (mockMode=${process.env.MOCK_MODE === 'true'})`);
  });
}

module.exports = app;