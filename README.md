# folio.ai — AI Portfolio Generator

An AI-powered portfolio generator built with React and Claude (Anthropic API).
Fill in your details, pick a tone, and get a beautifully written portfolio in seconds.

## Project Structure

```
ai-portfolio-generator/
├── index.html                  ← Vite entry point
├── package.json
├── vite.config.js
└── src/
    ├── main.jsx                ← React root
    └── PortfolioGenerator.jsx  ← Main component (all logic + styles)
```

## Quick Start (Vite — Recommended)

```bash
npm install
npm run dev
```

Open http://localhost:3000

## How It Works

1. **Form** — Enter your name, title, bio, skills, up to 3 projects, and contact links
2. **Tone** — Pick from: Professional, Creative, Technical, Bold & Direct, Warm & Human
3. **Generate** — Hits the Anthropic API (`claude-sonnet-4-20250514`) to write:
   - A poetic tagline
   - Compelling 3–4 sentence About section
   - Clean skill chips
   - Project write-ups with impact framing
   - A short CTA line
4. **Preview** — Renders a dark editorial-style portfolio card
5. **Copy** — One-click copy of all portfolio text

## API

The app calls `https://api.anthropic.com/v1/messages` directly from the browser.
API authentication is handled by the Claude.ai runtime — no `.env` or API key needed
when running inside the Claude artifact environment.

If you deploy this outside Claude.ai (e.g. to Vercel/Netlify), you'll need a
backend proxy to keep your API key secret:

```
Browser → /api/generate (your backend) → Anthropic API
```

Example backend (Node/Express):
```js
app.post('/api/generate', async (req, res) => {
  const response = await fetch('https://api.anthropic.com/v1/messages', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'x-api-key': process.env.ANTHROPIC_API_KEY,
      'anthropic-version': '2023-06-01',
    },
    body: JSON.stringify(req.body),
  });
  res.json(await response.json());
});
```

Then change the fetch URL in `PortfolioGenerator.jsx` from
`https://api.anthropic.com/v1/messages` to `/api/generate`.

## Design

- **Typography**: Playfair Display (display) + DM Mono (labels) + DM Sans (body)
- **Theme**: Dark editorial — near-black `#0d0d0d` base, warm gold `#c8a96e` accents
- **Layout**: Responsive grid-based portfolio card with hero, skills, contact, projects
- **No external CSS framework** — all styles are scoped to `.folio-*` and `.p-*` classes
