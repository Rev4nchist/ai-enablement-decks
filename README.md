# AI Enablement Decks

A single repo that hosts multiple AI Enablement presentations, each with its own shareable URL via GitHub Pages.

**Live site:** https://rev4nchist.github.io/ai-enablement-decks/

## Structure

```
ai-enablement-decks/
├── index.html                    ← landing page (data-driven; renders cards from decks.json)
├── decks.json                    ← the deck manifest — add an entry per deck
├── <deck-slug>/
│   └── index.html                ← the deck itself
├── <another-deck>/
│   └── index.html
└── .github/workflows/pages.yml   ← auto-deploys on push to main
```

Each subfolder that contains an `index.html` automatically gets its own URL:

```
https://rev4nchist.github.io/ai-enablement-decks/<deck-slug>/
```

No extra config, no new workflow, no Pages re-enable. Push and it ships.

## Adding a New Deck

1. **Create a subfolder** using a short slug (lowercase, hyphens, no spaces):
   ```bash
   mkdir orientation-april-2026
   ```

2. **Drop the HTML file inside as `index.html`** (rename it if needed):
   ```bash
   cp ~/Downloads/some-deck.html orientation-april-2026/index.html
   ```
   If the deck has assets (images, CSS, JS), put them in the same folder.

3. **Register the deck in `decks.json`.** The landing page builds its cards from this manifest at runtime — editing `index.html` directly does nothing. Add an object to the `decks` array:
   ```json
   {
     "id": "orientation-april-2026",
     "section": "portfolio",
     "tag": "Orientation",
     "title": "Portfolio Orientation — April 2026",
     "description": "Team portfolio walkthrough and Q2 priorities.",
     "href": "./orientation-april-2026/",
     "meta": "April 2026",
     "date": "2026-04",
     "status": "shipped"
   }
   ```
   - `section` must match a `sections[].id` — currently `portfolio`, `project-presentations`, `claude-cowork`, `claude-code-ccv3`, `mcp-capabilities`, `msft-ai` (or add a new one to the `sections` array).
   - `status` is optional: `shipped` | `in-build` | `briefing` | `draft`. Add `"featured": true` to give a card a highlighted treatment.
   - `href` must be `./<deck-slug>/` with the trailing slash; `title` should match the deck's own `<title>`.
   - **Validate before committing** — a broken `decks.json` blanks the whole hub:
     ```bash
     node -e "JSON.parse(require('fs').readFileSync('decks.json','utf8')); console.log('ok')"
     ```

4. **Commit and push** the folder and the manifest together:
   ```bash
   git add orientation-april-2026/ decks.json
   git commit -m "Add orientation-april-2026 deck"
   git push
   ```

5. **Wait ~30s for the Pages workflow** to finish, then visit your new share URL:
   ```
   https://rev4nchist.github.io/ai-enablement-decks/orientation-april-2026/
   ```

## Tips

- **Slug naming:** Use `<topic>-<month-year>` or `<topic>-<version>` so URLs stay self-explanatory (e.g. `orientation-april-2026`, `q2-portfolio-review`, `mcp-capabilities-v2`).
- **Self-contained HTML:** Prefer decks that inline their CSS and use external fonts/CDN assets. Reduces asset-management overhead per folder.
- **Asset folders:** If a deck has its own images, nest them inside the deck folder (e.g. `orientation-april-2026/assets/hero.png`). Relative paths in the HTML will just work.
- **Archiving old decks:** Move outdated decks into an `_archive/` folder if you want to keep them accessible but hidden from the landing page.
- **Testing locally:** Open `index.html` directly in a browser, or run `python -m http.server 8000` from the repo root to test subfolder routing.

## Deploy Workflow

`.github/workflows/pages.yml` handles everything automatically:

- Triggers on every push to `main` (and via manual `workflow_dispatch`)
- Uploads the entire repo as a Pages artifact
- Deploys to `https://rev4nchist.github.io/ai-enablement-decks/`
- Uses `enablement: true` so Pages self-enables on first run (no manual setup needed)

Check deploy status:
```bash
gh run list --repo Rev4nchist/ai-enablement-decks --limit 5
```
