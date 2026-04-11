# ai-enablement-decks — Claude instructions

This repo hosts multiple AI Enablement presentations as a single GitHub Pages site. Each deck is a self-contained HTML file in its own subfolder. The root `index.html` is the **landing page hub** that links to every deck.

**Live site:** https://rev4nchist.github.io/ai-enablement-decks/

## MANDATORY: when adding a new deck, update the hub

Whenever you add a new deck to this repo (a new subfolder containing an `index.html`), you **MUST** also update the landing page at `./index.html` in the same commit. The landing page IS the hub — without a card, the new deck has no discoverable link from the root URL.

### Steps

1. **Create the deck subfolder** with a short, descriptive slug (lowercase, hyphens):
   ```
   mkdir <deck-slug>
   cp <source>.html <deck-slug>/index.html
   ```
2. **Pick the right section** in `./index.html`. Current sections:
   - `Team & Orientation` — orientation decks, onboarding, team process
   - `Tooling & Workflows` — day-to-day tooling, dev environments, power-user guides
   - `MCP Capabilities` — MCP server projects, FastMCP builds, kickoffs
   If none fit, add a new `<section class="decks">` following the existing pattern.
3. **Add a card block** inside the right section's `<div class="grid">`. Use this template and match the existing style exactly:
   ```html
   <a class="card" href="./<deck-slug>/">
     <span class="tag">Short category label</span>
     <h3>Deck title (match the deck's own <title>)</h3>
     <p>One-sentence description of what's in the deck.</p>
     <div class="meta">
       <span>Date or version label</span>
       <span class="arrow">→</span>
     </div>
   </a>
   ```
4. **Remove the empty-state placeholder** (`<div class="empty">…</div>`) if it's still present — it shouldn't be once there are real decks, but double-check.
5. **Commit and push** in one commit:
   ```
   git add <deck-slug>/ index.html
   git commit -m "Add <deck-slug> deck"
   git push
   ```
6. **Verify deploy** after ~30 seconds:
   ```
   gh run list --repo Rev4nchist/ai-enablement-decks --limit 3
   ```
   Then open `https://rev4nchist.github.io/ai-enablement-decks/<deck-slug>/` to confirm the new deck is live, and the root URL to confirm the card appears in the hub.

## Verification checklist (before claiming done)

- [ ] New subfolder exists at repo root containing `index.html`
- [ ] Card was added to the correct section in root `index.html`
- [ ] `href` in the card matches the subfolder name exactly (trailing slash)
- [ ] Card `h3` matches the deck's own `<title>` tag
- [ ] Commit includes BOTH the new folder AND the root `index.html` change
- [ ] `gh run list` shows a `success` status for the triggered deploy
- [ ] Both URLs load in a browser (or fetch): root hub + deck subfolder

## Anti-patterns to avoid

- **DO NOT** add a deck without updating the hub. The hub is not optional — it's how people discover decks.
- **DO NOT** put HTML files at the repo root (only `index.html` lives there — it's the hub). Every deck must live in its own subfolder.
- **DO NOT** rename the deck file to anything other than `index.html`. GitHub Pages serves `<slug>/index.html` as `<slug>/`; any other name produces an ugly URL.
- **DO NOT** invent new visual styles for cards. Copy the existing card block exactly — they share CSS variables and hover states.
- **DO NOT** modify `.github/workflows/pages.yml` unless explicitly asked. It's already wired up correctly.

## Architecture reference

```
ai-enablement-decks/
├── index.html                       ← hub / landing page (edit when adding decks)
├── CLAUDE.md                        ← this file
├── README.md                        ← human-readable version of the same workflow
├── <deck-slug>/
│   └── index.html                   ← the deck itself
└── .github/workflows/pages.yml      ← auto-deploys on push to main
```

- One repo, one Pages workflow, unlimited decks
- Each subfolder gets its own shareable URL automatically
- Push to `main` triggers the deploy — no manual steps
- Repo is **public** (Pages on free tier requires public repos)
