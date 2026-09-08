const fs = require('fs');
const path = require('path');

const examples = JSON.parse(
  fs.readFileSync(path.join(__dirname, '..', 'mocks', 'examples.json'), 'utf-8')
);

/**
 * Returns a mock AI response. Real models occasionally return incomplete
 * or nonsensical output, so a few of the canned examples are deliberately
 * broken (empty fields, min > max, missing priceRange). We rotate through
 * them at random so the frontend gets exercised against both good and bad
 * shapes over repeated calls.
 */
function getMockSuggestion() {
  const index = Math.floor(Math.random() * examples.length);
  return examples[index];
}

module.exports = { getMockSuggestion };