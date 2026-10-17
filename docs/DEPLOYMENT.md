# ZKSCAPE — Deployment

ZKSCAPE V2 is a **static site**. There is no build step, no bundler, no package manager and no
server-side component. Everything the browser needs is in this folder.

---

## 1. Serving it locally

The game uses `localStorage` and loads assets by relative path, so it must be served over HTTP
(S). Opening `index.html` as a `file://` URL is not supported.

### Python (already installed on most systems)

```bash
cd <project folder>
python -m http.server 8000
```

Open <http://localhost:8000/>.

### Node

```bash
npx serve .
```

### VS Code

Install the **Live Server** extension, right-click `index.html` → **Open with Live Server**.

### Anything else

Apache, nginx, Caddy, `php -S`, `busybox httpd` — all fine. There is nothing to configure
beyond serving the folder root.

---

## 2. Deploying as a static site

Upload the project folder as-is to any static host.

### GitHub Pages

```bash
git init
git add .
git commit -m "ZKSCAPE V2"
git branch -M main
git remote add origin https://github.com/<you>/<repo>.git
git push -u origin main
```

Then **Settings → Pages → Source: Deploy from a branch → `main` / `/ (root)`**.

### Netlify

Drag the folder onto <https://app.netlify.com/drop>. No build command, no publish directory —
the defaults are correct.

### Cloudflare Pages

Connect the repository, or drag-and-drop the folder. Build command: *leave empty*. Output
directory: `/`.

### Vercel

Import the repo. Framework preset: **Other**. Leave build command and output directory empty.

### Amazon S3 + CloudFront

Upload the folder contents to the bucket root (not a nested folder), enable static website
hosting, and put CloudFront in front if you want HTTPS and caching.

---

## 3. Required files and folders

### Required — the game will not run without these

| Path | What it is |
|---|---|
| `index.html` | The entire engine, UI, styles and question bank. Also embeds the fonts as base64. |
| `hub/hub.js` | The playable hub scene with portals, unlocking and walk-to-portal logic. |
| `worlds/01-…` … `worlds/12-…js` | The twelve worlds. All twelve are required for a complete game. |
| `polish/prologue.js` | The intro cinematic. Referenced unconditionally at boot. |
| `polish/finale.js` | The ending cinematic. |
| `polish/card.js` | The Explorer Card. |
| `polish/zkp.js` | Optional render helpers. Worlds guard their use with `if(window.ZKP)`. |
| `polish/zm.js` | Music scheduling. |
| `NPCs/*.png` | NPC portraits, including the `_clean` background-removed variants. |

> **Hosting note:** the world scripts are loaded by relative path (`worlds/01-origin.js`) and
> pushed into `window.ZKW` before the engine evaluates them. If you serve the site from a
> subdirectory, the relative paths still work. If you rewrite or proxy `/worlds/*`, make sure
> the files are served as JavaScript and are not stripped or bundled.

### Required - the game cannot start without this

| Path | What happens without it |
|---|---|
| `10kpfps/zilkroad_art/` | **The game becomes unplayable.** The landing screen only accepts a zkSNARK number, and there is no upload fallback, so `S.pfp` can never be set and the ENTER button never appears. The lookup shows "could not load". This is required, not optional. |

### Optional - the game degrades gracefully without these

| Path | What happens without it |
|---|---|
| `audio/music/*.mp3` | Falls back to the built-in WebAudio synthesis. Silent is still playable. |
| `audio/sfx/*.wav` | Same — sound effects are synthesised. |
| `videos/noirwallet.mp4`, `videos/zilkroad.mp4` | The **Watch** button for that world does nothing. The worlds still play. |
| `10kpfps/zilkroad_art/download_*.{csv,json}` | Build artifacts. Nothing reads them at runtime. |

### Size

| | |
|---|---|
| Everything except `10kpfps/` | **~18 MB** |
| `10kpfps/zilkroad_art/` | **~183 MB** (10,000 `.webp` files + logs) |
| `videos/` | ~16 MB |

> **Recommendation:** ship `10kpfps/`. It is 90% of the payload size, but it is **not** an
> optional extra — it is the only way into the game. ZKSCAPE is Snarks-only by design: the landing
> screen takes a zkSNARK number and there is no upload fallback, so remove this folder and nobody
> can play at all. If you must split it across a CDN or separate deployment, note that the lookup
> uses a **relative** path (`10kpfps/zilkroad_art/<n>.webp`), so it must be served from the same
> origin at the same relative location, or you will need to change that one line in `index.html`.
>
> Two ways to shrink the download if the platform caps package size:
> - Ship only the `.webp` files and drop the `download_*.{csv,json}` build artifacts.
> - Serve `10kpfps/` from a CDN and change the one lookup line in `index.html` to an absolute URL.

---

## 4. Optional integrations

### 4.1 Supabase leaderboard

**Status in this package: configured and functional.** The project ships with working
credentials and the matching setup file.

In `index.html`:

```js
const SUPABASE_URL='https://unckcqnvfbcpspawbbhg.supabase.co',
      SUPABASE_ANON_KEY='sb_publishable_…';
```

The leaderboard is **active only if** the URL starts with `https://` and the key is non-empty.
Blank either one and the leaderboard screen shows a graceful "temporarily unavailable" message
while the rest of the game continues unaffected.

`index.html` also contains a detailed setup comment immediately above these two lines.

#### Setting up your own Supabase project

1. Create a project at <https://supabase.com>.
2. Open **SQL Editor** and run the contents of **`zkscape-supabase.sql`** (shipped in this
   folder). It is idempotent — safe to re-run. It creates:
   - `public.zk_questions` — the question bank
   - `public.players` — one row per submitted run
   - `create index players_rank_idx` — ranking order
   - `create or replace function public.submit_run(p jsonb)` — the validating submit endpoint
   - RLS enabled on both tables, with a read-only `anon` select policy on `players`
3. Copy **Settings → API**:
   - **Project URL** → `SUPABASE_URL`
   - the **anon / publishable** key → `SUPABASE_ANON_KEY`
4. Paste both into `index.html`.
5. Reload. The leaderboard entry button on the Explorer Card becomes live.

> **Currently disabled in the hub.** The hub 🏆 leaderboard button has been removed from
> `index.html` (it was created in `#s-hub` and is no longer emitted). The leaderboard code,
> the `#clb` button on the Explorer Card and all the Supabase plumbing are still in place, so
> submissions remain reachable from the results screen. To restore the hub button, re-add the
> `insertAdjacentHTML` line for `#zlbb` and its `onclick` handler, and delete the
> `#zk #s-hub #zlbb{display:none}` rule.

#### Key handling — read this

- **Only use the `anon` / publishable key.** It is designed to be readable in page source.
- **Never** put a `service_role` key in `index.html`. That key bypasses Row Level Security and
  would let anyone with the page source read and write your entire database.
- No secret key is present in this repository. Keep it that way.

#### Before going public

`submit_run` is declared `security definer` and **recomputes the score server-side**, rejecting
submissions whose numbers disagree. It validates the question set, the difficulty mix and the
attempt consistency. That is a sound design, but it has not been independently audited. If you
intend to run this publicly, review the policies and grants, and consider:

- rate limiting at the edge (reverse proxy / Cloudflare rule)
- an Edge Function to verify the Origin header if you care about who can call it
- a data-retention policy — there is no deletion path in the UI

### 4.2 Ecosystem links

`index.html` defines:

```js
const LINKS={noir:'https://www.zknoir.com/', zilkroad:'https://zilkroad.com/'};
```

These appear as outbound links on the two optional worlds' completion screens. Edit or extend
the map as needed. A link button is disabled if its URL is absent, so there is no failure mode
from a missing entry.

### 4.3 Author link

`https://x.com/JustBluishxD` is referenced in the UI. Search `index.html` for it to change it.

---

## 5. Query parameters

| Parameter | Effect |
|---|---|
| `?demo=1` or `?showcase=1` | **Showcase mode.** Replaces your save state with a temporary one for a scripted playthrough. Saving is blocked and the leaderboard submission is disabled. Press `Esc` to exit. Useful for recording. |
| `?hubdebug=1` | Exposes `window.__zkHub` with `teleport(x,y)` and `ts()` for testing. Inactive without the flag. |

---

## 6. Caching and headers

The game is a single HTML file plus static assets. Sensible defaults:

- `index.html` — `Cache-Control: no-cache` (or short max-age) so updates land immediately.
- `worlds/*.js`, `hub/*.js`, `polish/*.js` — `Cache-Control: public, max-age=31536000, immutable`
  **only if** you version your URLs or accept that filename changes bust the cache.
- `NPCs/*.png`, `videos/*.mp4` — long cache, `immutable`.
- `audio/` — long cache if you add it.

Serve with correct MIME types. In particular:

| Extension | Content-Type |
|---|---|
| `.js` | `application/javascript` or `text/javascript` |
| `.html` | `text/html; charset=utf-8` |
| `.webp` | `image/webp` |
| `.mp4` | `video/mp4` |

GitHub Pages, Netlify, Cloudflare Pages and Vercel all set these correctly out of the box.

---

## 7. HTTPS

Use HTTPS for any public deployment. It matters here because:

- `crypto.randomUUID()` and the Web Audio API are restricted on insecure origins in some
  browsers.
- The game generates its leaderboard UUID locally; `crypto.randomUUID()` requires a **secure
  context**, and the code already includes a non-crypto fallback for the rare insecure case.
- All static hosts provide HTTPS by default. There is nothing to configure.

---

## 8. Pre-deploy checklist

1. Serve locally and confirm the game boots with no console errors.
2. Confirm all twelve worlds load from the hub.
3. If you changed the Supabase credentials, confirm the leaderboard loads and a submission
   round-trips.
4. Grep `index.html` for `service_role` — it should only ever appear in a comment telling you
   not to use it.
5. Confirm nothing still references the removed `Players/` folder (grep the docs).
6. Work through [RELEASE_CHECKLIST.md](RELEASE_CHECKLIST.md).