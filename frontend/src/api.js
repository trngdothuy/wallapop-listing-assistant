const API_BASE = import.meta.env.VITE_API_BASE || 'http://localhost:3001';

export async function fetchSuggestion(description) {
  const res = await fetch(`${API_BASE}/api/suggest`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ description }),
  });

  const data = await res.json();

  if (!res.ok) {
    throw new Error(data.error || 'Something went wrong.');
  }

  return data; // { mockMode, suggestion }
}