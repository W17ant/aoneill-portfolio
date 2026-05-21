# aoneill.co.uk

Personal portfolio site for Antony O'Neill — AI & ML developer and software engineer based in Manchester. Also doubles as the host for client demo sites and the documentation surface for [Jarvis](https://github.com/W17ant/Jarvis).

**Live:** [aoneill.co.uk](https://aoneill.co.uk)

## What's in here

### Portfolio
- Interactive homepage with a physics-based elastic lanyard (Verlet integration, Canvas)
- Timeline, skills, featured projects (Jarvis, Agent Office, Twitter Sentiment Classification, Snake RL, Heart Disease, Doom Scroll Detection, Keep It What, and more), and lab experiments
- Terminal-style contact form
- GitHub activity heatmap with multi-year data
- Seasonal system (snow, halloween effects, St Patrick's, NYE countdown)
- CSP nonces, Trusted Types, and security headers via middleware
- Light/dark theme with smooth transitions

### Hosted alongside
- **`/arc`** — full [Jarvis](https://github.com/W17ant/Jarvis) documentation (quickstart, plugin authoring, tool reference, privacy, troubleshooting) — wired in as a git subtree so the published docs always track the shipped binary
- **`/tomthevacuumman`** — client demo site
- **`/renovaelabs/`** (light) and **`/renovaelabs-dark/`** — dual-theme branded landing for Renovae Labs

## Tech

- **Framework:** Next.js 16 (App Router, Turbopack)
- **Language:** TypeScript
- **Styling:** Tailwind CSS v4 with CSS custom properties
- **Fonts:** IBM Plex Sans, Sora (headings), JetBrains Mono (code)
- **Hosting:** Vercel (production on `main`, preview URLs per PR)
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
  app/                 # Pages and API routes (App Router)
    projects/          # Projects index + per-project detail pages
    arc/               # Jarvis docs (git subtree from W17ant/Jarvis)
  components/          # React components (home, layout, ui, experiments, seasonal)
  lib/                 # Content data, availability config, utilities
  context/             # Theme context provider
public/
  arc/                 # Jarvis docs static assets
  renovaelabs/         # Renovae Labs landing (light)
  renovaelabs-dark/    # Renovae Labs landing (dark)
  tomthevacuumman/     # Tom the Vacuum Man client demo
  images/              # Project logos and static images
e2e/                   # Playwright end-to-end tests
```
