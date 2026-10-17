# ZKSCAPE V2

**Your PFP. Your world. Your Zcash story.**

ZKSCAPE is a browser-based, side-scrolling story game about Zcash. You play an explorer who
walks through twelve hand-built worlds, each one a metaphor for a single idea from the Zcash
storybook — public history, shielded transactions, zero-knowledge proofs, viewing keys, the
memo pool, the turnstile, blocks, the consensus machine, the canvas, and the archive.

You start by picking a profile picture (your PFP). That image becomes your character: it is
drawn over your explorer in every world, in the hub, and on the Explorer Card you earn at the
end. Nothing else about it is required.

---

## What is in the box

| | |
|---|---|
| Worlds | 12 (10 core + 2 optional) |
| Engines / hubs | `hub/hub.js` — a playable hub with portals, plus a legacy ring fallback |
| Cinematics | intro (`polish/prologue.js`) and ending (`polish/finale.js`) |
| Explorer Card | `polish/card.js` — 5 tiers, downloadable PNG |
| Question bank | 15-question final archive quiz, 2 easy / 5 medium / 8 hard |
| Leaderboard | optional, opt-in, Supabase-backed |
| **Collection artwork** | **`10kpfps/zilkroad_art/` — REQUIRED, ~183 MB.** The game is Snarks-only: the landing screen takes a zkSNARK number and fetches `10kpfps/zilkroad_art/<n>.webp`. There is no upload fallback, so **without this folder nobody can enter the game.** |
| Cutscenes | `videos/` — Noir and Zilkroad watch-clips (optional; the worlds play without them) |
| Audio | synthesized in-browser (WebAudio). Optional `audio/` folder supported |
| Builds / installs | none. It is a static folder |

## Features

- **Twelve playable worlds**, each with its own physics, puzzles and NPCs.
- **A walkable hub** with portal landmarks that unlock as you discover things.
- **Your PFP as your character**, drawn live in every scene.
- **Optional explorer name**, drawn as a pixel tag above your character. Skippable.
- **Run timer** that pauses when the tab is hidden or unfocused and resumes when you come back.
- **Score breakdown** — every point is itemised and explained in-game.
- **Explorer Card** — a rank-tiered keepsake PNG you can download.
- **Optional online leaderboard** — strictly opt-in, see [docs/PRIVACY.md](docs/PRIVACY.md).
- **Showcase mode** (`?demo=1`) for recording/demoing without touching real progress.
- **Mobile support** — on-screen D-pad appears automatically on touch devices.
- **Accessibility basics** — reduced-motion support, focus-visible outlines, ARIA labels on
  controls, live regions for status messages.

---

## The twelve worlds

| # | World | Title | The question it asks |
|---|---|---|---|
| 01 | ORIGIN | The Origin | Why does Zcash exist? |
| 02 | SHIELD | Shielded Valley | Transparent or shielded? |
| 03 | PROOF | The Proof Temple | What is this place trying to verify? |
| 04 | KEYS | The Key Library | Seeing is not the same as being allowed. |
| 05 | ORCHARD | The Orchard | What grows cannot be unplanted. |
| 06 | IRONWOOD | The Ironwood | It still works. So why did it stop? |
| 07 | BLOCKS | The Block Observatory | Who decides what history is? |
| 08 | MACHINE | The Machine | What does it need from you? |
| 09 | CANVAS | The Canvas | Collect colour. Reveal the Snarks. Create your own. |
| 10 | ARCHIVE | The Archive | The final trial |
| 11 | NOIR *(optional)* | The Noir Gate | A private wallet city |
| 12 | ZILKROAD *(optional)* | The ZK Market | Shielded identities, on display |

Worlds 11 and 12 are **optional**. They live up a small terrace in the hub and only open once
you have discovered The Origin. They are not required to finish the core ten.

---

## Running it locally

The game is plain static files. Any local web server works.

**Python**
```bash
python -m http.server 8000
```
Then open <http://localhost:8000/>.

**Node**
```bash
npx serve .
```

**VS Code** — install the *Live Server* extension and right-click `index.html` → *Open with Live Server*.

Then open the printed URL. Do **not** open `index.html` as a `file://` URL: the game stores
progress in `localStorage` and loads assets by relative path, both of which behave unreliably
under the `file://` origin on some browsers.

---

## Supported browsers

**Verified by automated browser testing:** Chromium (desktop, 1280×800) and Chromium with
iPhone 13 emulation (touch input, `pointer: coarse`, 390×664). Both were exercised through
launch, cinematic, hub, all twelve worlds, mobile D-pad input and the run clock.

**Not verified by automated testing** — expected to work, but confirm by hand before release:

- Safari (desktop and iOS) — the game uses `Element.remove()`, `crypto.randomUUID()` with a
  fallback, WebAudio, Pointer Events and `CanvasRenderingContext2D`, all long-supported in
  Safari. Pointer Events are the main thing worth clicking through on a real iPhone.
- Firefox and Edge — no engine-specific APIs are used.

**Requirements:** a browser with ES2020 support, Canvas 2D, Pointer Events and WebAudio.
Local storage must be available (private-browsing modes that block it will lose progress).

### Hosting

Any static host works — GitHub Pages, Netlify, Cloudflare Pages, Vercel, S3 + CloudFront, or
any ordinary web server. There is no build step and no server-side component. See
[docs/DEPLOYMENT.md](docs/DEPLOYMENT.md) for the details, including the one CDN caveat about
the optional artwork folder.

---

## Controls

### Keyboard

| Action | Keys |
|---|---|
| Walk left | `←` or `A` |
| Walk right | `→` or `D` |
| Jump | `Space`, `↑` or `W` |
| Interact / talk / use | `E`, `Enter` or `F` |
| Close a panel | `Esc` |

Individual worlds add their own keys — for example Shielded Valley uses `Q` to raise the
privacy shield, and the ZK Market uses `↑`/`↓` and `Q` to move through menus. In-world prompts
always show the current binding for that device.

### Touch

On a touch device (or any viewport under 800px wide) an on-screen D-pad appears at the bottom
of the world: **◀ ▶** on the left, **interact** and **jump** on the right. In the hub, you can
also simply **tap the ground** to walk to that spot.

### In the hub

Walk to a portal landmark and press interact to enter. Sealed worlds tell you which discovery
unlocks them.

---

## Character selection

1. On the landing screen, **look up your zkSNARK** — enter the number of the NFT you hold
   (1–10,000). That piece becomes your character. There is no upload option: the game only
   accepts a zkSNARK, which is why the collection artwork ships with it.
2. Optionally look up a zkSNARK by number (this only fetches artwork, it is not required).
3. Press **YOUR WORLD IS READY. ENTER ZKSCAPE**.
4. The first time you arrive in the hub you may be asked for an explorer name. It is optional —
   press **SKIP**. The name is drawn above your character and can be changed later from the
   profile chip in the hub.

Your PFP is read in the browser, background-removed, and stored in `localStorage` as a data URL.
It is never uploaded.

---

## Save and reset

- Progress lives in this browser only, under the `localStorage` key **`zkscape.v1`**.
- Audio settings are stored separately under **`zkscape.audio.v2`**.
- **RESET PROGRESS** on the landing screen clears `zkscape.v1` and reloads the page. There is no
  undo and no cloud copy.
- Progress does not follow you between browsers, devices or profiles. Use a separate browser
  profile if you want a clean slate.

---

## Troubleshooting

**Nothing loads / blank page**
You probably opened `index.html` directly. Serve the folder over HTTP instead (see above).

**Progress disappeared**
Private/incognito windows, and browsers configured to clear storage on exit, both discard it.
Check that local storage is permitted for the origin.

**No sound**
Browsers block audio until you interact with the page. Click or tap once. The 🔊 button in the
bottom-right opens music / SFX / volume controls.

**I can't move on my phone**
The D-pad only appears on touch-capable or narrow viewports. If it is missing, confirm you are
serving over HTTP(S) rather than `file://`, and that the page is not zoomed far out.

**My time looks wrong**
The run clock deliberately stops while the tab is hidden or unfocused and restarts when you
return. Time spent away is excluded from the clock and from any leaderboard submission.

**The leaderboard says "temporarily unavailable"**
Either the leaderboard is not configured, the network call failed, or the run was never
completed with a final time. Your Explorer Card is still generated locally regardless — see
[docs/PRIVACY.md](docs/PRIVACY.md).

**A character is drawn as a coloured shape instead of a portrait**
Some NPC artwork is not bundled. The game draws a deliberate placeholder silhouette instead of
breaking. See *Known issues* below.

---

## Known issues

- **`NPCs/mechanist_clean.png` is not present in this package.** Ironwood and The Machine
  reference it for the character *Hob*. Both worlds already degrade gracefully — Ironwood draws
  a silhouette and The Machine draws a palette-coloured disc — so nothing breaks, but Hob has
  no portrait until the asset is added.
- **`audio/` is not present.** This is intentional: the AudioManager synthesises all music and
  sound effects with WebAudio. Dropping `.mp3` files into `audio/music/` and `audio/sfx/` will
  override them automatically.
- **`Players/` has been removed.** It held two unused sample portraits (`8494.png`,
  `8494_clean.png`) that nothing in the game referenced.

---

## Documentation

| Document | What it covers |
|---|---|
| [docs/GAME_GUIDE.md](docs/GAME_GUIDE.md) | How to play: controls, exploration, puzzles, the Archive and the Explorer Card |
| [docs/PRIVACY.md](docs/PRIVACY.md) | What is stored locally, what leaves your device, and what does not |
| [docs/DEPLOYMENT.md](docs/DEPLOYMENT.md) | Running locally, deploying as a static site, optional integrations |
| [docs/DEVELOPMENT.md](docs/DEVELOPMENT.md) | The `window.ZKW` architecture and how to add a world safely |
| [docs/RELEASE_CHECKLIST.md](docs/RELEASE_CHECKLIST.md) | A pass/fail checklist to run before shipping |

Existing development logs are kept as-is in [`docs/`](docs/): [POLISH_LOG.md](docs/POLISH_LOG.md) and [HUB_REDESIGN_NOTES.md](docs/HUB_REDESIGN_NOTES.md).

---

## Acknowledgements

See [CREDITS.md](CREDITS.md). Provenance for several assets could not be established from the
project files alone and is marked there for manual review.