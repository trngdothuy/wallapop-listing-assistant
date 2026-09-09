import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const examples = JSON.parse(
  fs.readFileSync(path.join(__dirname, '..', 'mocks', 'examples.json'), 'utf-8')
);

const KNOWN_DESCRIPTIONS = {
  'Vintage leather jacket, worn once, size M': examples[0],
  'Nintendo Switch OLED with 3 games, great condition': examples[1],
  'IKEA white desk, some scratches': examples[2],
  'Canon DSLR camera 18-55mm lens': examples[3],
  'Kids bicycle 16 inch barely used': examples[4],
  'Wooden bookshelf 5 shelves': examples[5],
  '!@#$%^&*()_+': examples[6],
  'great item good condition buy now!!!': examples[7],
};

const OUT_OF_SCOPE_NOTE =
  "This description isn't one of the saved mock examples, so mock mode " +
  'returned a random saved response — it may not be related to what you typed.';

/**
 * Returns a mock AI response.
 *
 * If the description exactly matches one of the known example inputs, we
 * return its real saved response with no note. For anything else, we fall
 * back to a random pick from the pool (which includes a couple of
 * deliberately broken/nonsensical entries, since real models occasionally
 * return exactly that) and flag it with a `note` so the frontend can make
 * clear the response isn't necessarily related to the input.
 */
export function getMockSuggestion(description) {
  if (Object.prototype.hasOwnProperty.call(KNOWN_DESCRIPTIONS, description)) {
    return { suggestion: KNOWN_DESCRIPTIONS[description], note: null };
  }

  const index = Math.floor(Math.random() * examples.length);
  return { suggestion: examples[index], note: OUT_OF_SCOPE_NOTE };
}