const { GoogleGenerativeAI } = require('@google/generative-ai');

const PROMPT_TEMPLATE = (description) => `
You are helping a seller on a classifieds marketplace write a better listing.

Given this rough item description:
"""
${description}
"""

Respond with ONLY a JSON object (no markdown fences, no extra text) in exactly
this shape:
{
  "title": "a clear, appealing listing title, under 80 characters",
  "tags": ["3 to 5 short search tags"],
  "priceRange": { "min": number, "max": number, "currency": "EUR" }
}
`;

async function getAiSuggestion(description) {
  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) {
    throw new Error('GEMINI_API_KEY is not set. Set it in .env or use MOCK_MODE=true.');
  }

  const genAI = new GoogleGenerativeAI(apiKey);
  const model = genAI.getGenerativeModel({ model: 'gemini-1.5-flash' });

  const result = await model.generateContent(PROMPT_TEMPLATE(description));
  const text = result.response.text();

  // Gemini sometimes wraps JSON in markdown fences despite instructions
  // not to — strip them defensively before parsing.
  const cleaned = text.replace(/```json|```/g, '').trim();

  return JSON.parse(cleaned);
}

module.exports = { getAiSuggestion };