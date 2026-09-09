import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { vi, describe, test, expect, beforeEach } from 'vitest';
import App from './App';
import { fetchSuggestion } from './api';

vi.mock('./api', () => ({
    fetchSuggestion: vi.fn(),
}));

beforeEach(() => {
  vi.mocked(fetchSuggestion).mockReset();
});

test('renders a well-formed suggestion normally', async () => {
  vi.mocked(fetchSuggestion).mockResolvedValue({
    mockMode: true,
    suggestion: {
      title: 'Vintage Leather Jacket - Size M',
      tags: ['vintage', 'leather', 'size M'],
      priceRange: { min: 45, max: 80, currency: 'EUR' },
    },
  });

  render(<App />);
  fireEvent.change(screen.getByPlaceholderText(/vintage leather jacket/i), {
    target: { value: 'vintage leather jacket, worn once' },
  });
  fireEvent.click(screen.getByText(/get suggestions/i));

  await waitFor(() => {
    expect(screen.getByText('Title')).toBeInTheDocument();
    expect(screen.getByText('Tags')).toBeInTheDocument();
    expect(screen.getByText('Suggested price range')).toBeInTheDocument();
  });
});

// Test that the app handles broken/incomplete suggestions gracefully, showing fallback text instead of crashing or displaying raw JSON
test('renders fallback text when the suggestion is broken/incomplete', async () => {
  vi.mocked(fetchSuggestion).mockResolvedValue({
    mockMode: true,
    suggestion: { title: '', tags: [], priceRange: { min: 50, max: 10, currency: 'EUR' } },
  });

  render(<App />);
  fireEvent.change(screen.getByPlaceholderText(/vintage leather jacket/i), {
    target: { value: 'anything' },
  });
  fireEvent.click(screen.getByText(/get suggestions/i));

  await waitFor(() => {
    expect(screen.getByText(/Error: No title suggested/i)).toBeInTheDocument();
    expect(screen.getByText(/Error: No tags suggested/i)).toBeInTheDocument();
    expect(screen.getByText(/Error: The model didn't return a usable price range/i)).toBeInTheDocument();
  });
});

// Test that the app shows an error message when the API request fails, simulating a network or server error
test('shows an error message when the request fails', async () => {
  vi.mocked(fetchSuggestion).mockRejectedValue(new Error('Failed to get a suggestion from the AI model.'));

  render(<App />);
  fireEvent.change(screen.getByPlaceholderText(/vintage leather jacket/i), {
    target: { value: 'anything' },
  });
  fireEvent.click(screen.getByText(/get suggestions/i));

  await waitFor(() => {
    expect(screen.getByText(/failed to get a suggestion/i)).toBeInTheDocument();
  });
});