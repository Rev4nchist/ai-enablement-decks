# AI Enablement Decks

A single repo that hosts multiple AI Enablement presentations, each with its own shareable URL via GitHub Pages.

**Live site:** https://rev4nchist.github.io/ai-enablement-decks/

## Structure

```
ai-enablement-decks/
├── index.html                    ← landing page listing all decks
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

3. **Add a card to the landing page.** Open `index.html` at the repo root, find the `<div class="grid">` section, and add a block like this:
   ```html
   <a class="card" href="./orientation-april-2026/">
     <span class="tag">Orientation</span>
     <h3>Portfolio Orientation — April 2026</h3>
     <p>Team portfolio walkthrough and Q2 priorities.</p>
     <div class="meta">
       <span>April 2026</span>
       <span class="arrow">→</span>
     </div>
   </a>
   ```
   Remove the `<div class="empty">...</div>` placeholder once you have at least one real deck.

4. **Commit and push:**
   ```bash
   git add .
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
