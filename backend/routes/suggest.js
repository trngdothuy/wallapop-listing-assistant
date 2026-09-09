import express from 'express';
import { getMockSuggestion } from '../services/mockService.js';
import { getAiSuggestion } from '../services/aiService.js';

const router = express.Router();

router.post('/suggest', async (req, res) => {
  const { description } = req.body;

  if (!description || typeof description !== 'string' || !description.trim()) {
    return res.status(400).json({ error: 'A non-empty "description" string is required.' });
  }

  const mockMode = process.env.MOCK_MODE !== 'false';

  try {
    if (mockMode) {
      const { suggestion, note } = getMockSuggestion(description);
      return res.status(200).json({ mockMode: true, suggestion, note });
    }

    const suggestion = await getAiSuggestion(description);

    return res.status(200).json({ mockMode, suggestion });
  } catch (err) {
    console.error('Failed to get suggestion:', err.message);
    return res.status(502).json({ error: 'Failed to get a suggestion from the AI model.' });
  }
});

export default router;