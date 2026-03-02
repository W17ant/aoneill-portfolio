# aoneill.co.uk

Personal portfolio site for Antony O'Neill — AI & ML developer and software engineer based in Manchester.

**Live:** [aoneill.co.uk](https://aoneill.co.uk)

## What's in here

- Interactive homepage with a physics-based elastic lanyard (Verlet integration, Canvas)
- Timeline, skills, featured projects, and lab experiments
- Terminal-style contact form
- GitHub activity heatmap with multi-year data
- Seasonal system (snow, halloween effects, St Patrick's, NYE countdown)
- CSP nonces, Trusted Types, and security headers via middleware
- Light/dark theme with smooth transitions

## Tech

- **Framework:** Next.js 16 (App Router, Turbopack)
- **Language:** TypeScript
- **Styling:** Tailwind CSS v4 with CSS custom properties
- **Fonts:** IBM Plex Sans, Sora (headings), JetBrains Mono (code)
- **Hosting:** Vercel
- **APIs:** GitHub GraphQL (contributions), Lighthouse scores

## Running locally

```bash
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

## Project structure

```
src/
  app/           # Pages and API routes (App Router)
  components/    # React components (home, layout, ui, experiments, seasonal)
  lib/           # Content data, availability config, utilities
  context/       # Theme context provider
public/          # Static assets, images, icons
```
