# ai-enablement-decks — Claude instructions

This repo hosts multiple AI Enablement presentations as a single GitHub Pages site. Each deck is a self-contained HTML file in its own subfolder. The root `index.html` is a **data-driven hub**: at load it fetches `./decks.json` and renders a card for every deck listed there. **`decks.json` is the source of truth for the hub — `index.html` has no hardcoded cards.**

**Live site:** https://rev4nchist.github.io/ai-enablement-decks/

## MANDATORY: when adding a new deck, register it in decks.json

A new deck is two things, committed together:
1. a subfolder `<deck-slug>/index.html` (the deck itself), and
2. a new entry in **`decks.json`** so the hub renders a card for it.

Hand-editing `index.html` does **nothing** — it builds its cards from `decks.json` at runtime. If you add the folder but not the manifest entry, the deck is live at its own URL but invisible from the hub.

### Steps

1. **Create the deck subfolder** with a short, descriptive slug (lowercase, hyphens). The file MUST be named `index.html`:
   ```
   mkdir <deck-slug>
   cp <source>.html <deck-slug>/index.html
   ```
2. **Add an entry to the `decks` array in `decks.json`.** Match this schema (and the style of the existing entries):
   ```json
   {
     "id": "<deck-slug>",
     "section": "<section-id>",
     "tag": "Short category label",
     "title": "Deck title (match the deck's own <title>)",
     "description": "One-sentence description of what's in the deck.",
     "href": "./<deck-slug>/",
     "meta": "Date or version label",
     "date": "2026-05-29",
     "status": "shipped",
     "featured": true
   }
   ```
   - **`section`** MUST match a `sections[].id`. Current sections: `portfolio`, `project-presentations`, `claude-cowork`, `claude-code-ccv3`, `mcp-capabilities`, `msft-ai`. To add a new section, append `{ "id": "...", "title": "..." }` to the `sections` array.
   - **`status`** is one of `shipped` | `in-build` | `briefing` | `draft` (renders a colored pill). Omit the field if none apply.
   - **`href`** MUST be `./<deck-slug>/` with the trailing slash — Pages serves `<slug>/index.html` as `<slug>/`.
   - **`date`** is `YYYY-MM-DD` or `YYYY-MM` (drives the auto-formatted date). **`meta`** is the human label shown on the card (e.g. `"VP Briefing · May 2026"`); if present it's displayed instead of the formatted date.
   - **`featured: true`** (optional) gives the card a highlighted gradient treatment.
3. **Validate the JSON before committing** — a broken `decks.json` blanks the entire hub:
   ```
   node -e "JSON.parse(require('fs').readFileSync('decks.json','utf8')); console.log('ok')"
   ```
4. **Commit and push** the folder AND the manifest in one commit:
   ```
   git add <deck-slug>/ decks.json
   git commit -m "Add <deck-slug> deck"
   git push
   ```
5. **Verify deploy** after ~30 seconds:
   ```
   gh run list --repo Rev4nchist/ai-enablement-decks --limit 3
   ```
   Then open `https://rev4nchist.github.io/ai-enablement-decks/<deck-slug>/` (the deck) and the root URL (confirm the card appears in the hub).

## Verification checklist (before claiming done)

- [ ] New subfolder exists at repo root containing `index.html`
- [ ] New entry added to the `decks` array in `decks.json`
- [ ] `decks.json` still parses as valid JSON (ran the node check)
- [ ] Entry's `section` matches an existing `sections[].id`
- [ ] `href` is `./<deck-slug>/` (trailing slash, matches the folder name exactly)
- [ ] `title` matches the deck's own `<title>` tag
- [ ] Commit includes BOTH the new folder AND `decks.json`
- [ ] `gh run list` shows a `success` status for the triggered deploy
- [ ] Both URLs load: root hub (card visible) + deck subfolder

## Anti-patterns to avoid

- **DO NOT** add a deck without adding it to `decks.json`. The hub renders from the manifest — a folder alone has no discoverable link from the root URL.
- **DO NOT** hand-edit cards into `index.html`. It has no static cards; it builds them from `decks.json` at runtime, so markup edits are ignored.
- **DO NOT** commit a `decks.json` that fails to parse — it blanks the whole hub. Always run the node validation first.
- **DO NOT** put HTML files at the repo root (only `index.html` lives there — it's the hub). Every deck lives in its own subfolder.
- **DO NOT** rename the deck file to anything other than `index.html`. Pages serves `<slug>/index.html` as `<slug>/`; any other name produces an ugly URL.
- **DO NOT** modify `.github/workflows/pages.yml` unless explicitly asked. It's already wired up correctly.

## Architecture reference

```
ai-enablement-decks/
├── index.html                       ← hub / landing page (data-driven renderer; do NOT hand-edit cards)
├── decks.json                       ← SOURCE OF TRUTH for the hub — add an entry per deck
├── CLAUDE.md                        ← this file
├── README.md                        ← human-readable version of the same workflow
├── <deck-slug>/
│   └── index.html                   ← the deck itself
└── .github/workflows/pages.yml      ← auto-deploys on push to main
```

- The hub (`index.html`) fetches `decks.json` and renders one card per entry — sections, filter chips, and the table-of-contents are all derived from the manifest.
- One repo, one Pages workflow, unlimited decks.
- Each subfolder gets its own shareable URL automatically.
- Push to `main` triggers the deploy — no manual steps.
- Repo is **public** (Pages on free tier requires public repos).
