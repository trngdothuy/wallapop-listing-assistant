import 'dotenv/config';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { getAiSuggestion } from '../services/aiService.js';

const __dirname = path.dirname(fileURLToPath(import.meta.url));

const descriptions = [
  'Vintage leather jacket, worn once, size M',
  'Nintendo Switch OLED with 3 games, great condition',
  'IKEA white desk, some scratches',
  'Canon DSLR camera 18-55mm lens',
  'Kids bicycle 16 inch barely used',
  'Wooden bookshelf 5 shelves',
];

const brokenExamples = [
  { title: '', tags: [], priceRange: { min: null, max: null, currency: 'EUR' } },
  { title: 'great item good condition buy now!!!', tags: ['item'], priceRange: { min: 50, max: 10, currency: 'EUR' } },
];

const goodExamples = [];
for (const desc of descriptions) {
  console.log(`Fetching: ${desc}`);
  const suggestion = await getAiSuggestion(desc);
  goodExamples.push(suggestion);
}

const all = [...goodExamples, ...brokenExamples];
fs.writeFileSync(
  path.join(__dirname, '..', 'mocks', 'examples.json'),
  JSON.stringify(all, null, 2)
);
console.log('Saved mocks/examples.json with', all.length, 'examples.');