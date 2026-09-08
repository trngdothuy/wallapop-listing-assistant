import { useState } from 'react';
import { fetchSuggestion } from './api';
import './index.css';

function isPriceRangeSane(priceRange) {
  if (!priceRange) return false;
  const { min, max } = priceRange;
  if (min == null || max == null) return false;
  if (typeof min !== 'number' || typeof max !== 'number') return false;
  if (min > max) return false;
  return true;
}

export default function App() {
  const [description, setDescription] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [result, setResult] = useState(null);

  async function handleSubmit(e) {
    e.preventDefault();
    if (!description.trim()) return;

    setLoading(true);
    setError(null);
    setResult(null);

    try {
      const data = await fetchSuggestion(description);
      setResult(data);
      console.log('Suggestion result:', data);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }

  const suggestion = result?.suggestion;

  return (
    <div className="page">
      <div className="card">
        <h1>Wallapop Listing Assistant</h1>
        <p className="subtitle">
          Paste a rough description of what you're selling and get a better title, tags, and a suggested price range.
        </p>

        <form onSubmit={handleSubmit}>
          <textarea
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder="e.g. Vintage leather jacket, worn once, size M"
            rows={4}
          />
          <button type="submit" disabled={loading || !description.trim()}>
            {loading ? 'Thinking…' : 'Get suggestions'}
          </button>
        </form>

        {result?.mockMode && (
          <div className="badge">Mock mode - showing a saved example response</div>
        )}

        {error && <div className="error">⚠ {error}</div>}

        {suggestion && (
          <div className="result">
            <div className="field">
              <span className="label">Title</span>
              <p>{suggestion.title?.trim() ? suggestion.title : 'Error: No title suggested'}</p>
            </div>

            <div className="field">
              <span className="label">Tags</span>
              {suggestion.tags && suggestion.tags.length > 0 ? (
                <div className="tags">
                  {suggestion.tags.map((tag, i) => (
                    <span key={i} className="tag">{tag}</span>
                  ))}
                </div>
              ) : (
                <p className="muted">Error: No tags suggested</p>
              )}
            </div>

            <div className="field">
              <span className="label">Suggested price range</span>
              {isPriceRangeSane(suggestion.priceRange) ? (
                <p>
                  {suggestion.priceRange.min} – {suggestion.priceRange.max}{' '}
                  {suggestion.priceRange.currency || ''}
                </p>
              ) : (
                <p className="muted">Error: The model didn't return a usable price range</p>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}