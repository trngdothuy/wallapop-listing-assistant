# Wallapop Listing Assistant
### By Trang Do Thuy in 2026 for Wallpop Software Engineer Graduate Program

A small tool that takes a rough item description (e.g. *"Vintage leather jacket, worn once, size M"*) and suggests a better listing title, 3–5 search tags, and a suggested price range — powered by Google Gemini.

## Stack

- **Backend:** Node.js + Express (`/backend`)
- **Frontend:** React + Vite (`/frontend`)
- **AI provider:** Google Gemini (`gemini-1.5-flash`, free tier)

## Running it — mock mode (no API key needed)

This is the fastest way to see it working, with zero setup.

```bash
# Backend
cd backend
npm install
cp .env.example .env      # MOCK_MODE is already "true" in the example
npm start                 # runs on http://localhost:3001

# Frontend (separate terminal)
cd frontend
npm install
cp .env.example .env
npm run dev                # runs on http://localhost:5173
```

Open http://localhost:5173, paste any description, and submit. The backend will return one of several saved example responses instead of calling Gemini. A few of those saved responses are **deliberately broken or nonsensical** (empty title, no tags, a price range where min > max, a missing field) — that's on purpose, to prove the frontend degrades gracefully instead of assuming the AI always returns clean data. You'll see a "Mock mode" badge on screen so it's obvious what's happening.

Mock mode recognizes a fixed set of known descriptions and returns their real, saved Gemini response for those exact strings:

- `Vintage leather jacket, worn once, size M`
- `Nintendo Switch OLED with 3 games, great condition`
- `IKEA white desk, some scratches`
- `Canon DSLR camera 18-55mm lens`
- `Kids bicycle 16 inch barely used`
- `Wooden bookshelf 5 shelves`
- `!@#$%^&*()_+` — deliberately broken example (empty title, no tags, no
  usable price range). Paste this to see the frontend's fallback UI for a
  suggestion with missing fields.
- `great item good condition buy now!!!` — another deliberately broken
  example (a nonsense price range where min > max). Paste this to see the
  frontend's fallback UI for a price range the model got backwards.

Paste one of these exactly to see a real, input-relevant response — the two
above are worth trying specifically if you want to see how the app handles
a broken AI response, without relying on random luck.

For any other description, mock mode falls back to a random saved response
from the same pool — this is expected, not a bug: the response body
includes a `note` field explaining that the description isn't a recognized
example and the result may not be related to what was typed.

## Running it with real Gemini calls

1. Get a free API key at https://aistudio.google.com/apikey
2. In `backend/.env`, set:

   ```
   MOCK_MODE=false
   GEMINI_API_KEY=your-key-here
   ```
3. Restart the backend (`npm start`).

## API

`POST /api/suggest`

```json
// request
{ "description": "Vintage leather jacket, worn once, size M" }

// response
{
  "mockMode": true,
  "suggestion": {
    "title": "Vintage Leather Jacket - Size M, Worn Once",
    "tags": ["vintage", "leather jacket", "size M", "outerwear", "unisex"],
    "priceRange": { "min": 45, "max": 80, "currency": "EUR" }
  }
}
```

## Tests

## Tests

```bash
cd backend && npm test
cd frontend && npm run test
```

**Backend** — 10 tests, focused on the contract of the one endpoint and the
mock-mode behavior specifically, since that's where the real risk and the
task's actual requirements live for a scope this small:

- **Input validation** — empty, missing, and whitespace-only `description`
  all return 400. Cheapest bugs to introduce, first thing worth catching.
- **Mock mode tests** — returns `mockMode: true` when `MOCK_MODE`
  is unset, and stays true when explicitly set to `"true"`. This directly
  encodes the "clone and run with no setup" requirement — if that default
  ever regresses, the suite catches it immediately.
- **Mock pool tests** — the pool contains at least one deliberately
  broken/incomplete example, and broken examples stay a minority (like a
  real model would be). Guards against someone "cleaning up" the mock data
  later and accidentally removing the one thing the task specifically asked
  for.
- **Known and unknown description tests** — a known description (both
  a normal one and a deliberately broken one) returns its exact saved
  suggestion with no `note`; an unrecognized description returns a random
  suggestion from the pool with a `note` explaining it may not be related to
  the input.

**Frontend** — 3 tests covering the three states the single screen can actually be in: a well-formed suggestion renders correctly, a broken/incomplete suggestion renders fallback text instead of blank space or `undefined`, and a failed request shows an error message. The broken-suggestion case matters most — the backend tests prove the broken data exists, but only a frontend test proves the seller-facing screen actually survives it.

I didn't chase full coverage on either side because the task explicitly asks for
judgment about what's worth testing over exhaustiveness, not maximum
coverage. I selected these tests since I think they are the most common and risky behaviours that our project may face. 

## Time spent

~ 6 hours. See `AI_JOURNEY.md` for how AI tools were used throughout, and below for what I'd do with more time.

## What I'd do with more time

- Limitation of characters in text field input (with word counts)
- Validation of text field (for example: must include valid character strings, avoid bad injections,...)
- Advanced CSS, with Wallpop's logos, colors, etc
- Loading/error states could use a bit more polish (skeleton loader or loading badge)
- Save, edit, delete descriptions
- Save input text fields to localStorage so users dont have to enter repeatedly
- Write more tests (For example: Frontend tests for the malformed-response fallback UI)
- Time out limitation for AI responses 
- A couple more mock examples with different "flavours" of brokenness (e.g. a title that's way too long, non-EUR currency)