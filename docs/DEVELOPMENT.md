# ZKSCAPE — Development

This document describes how the codebase is put together and, more importantly, how to change
it without quietly breaking things.

---

## 1. The big picture

ZKSCAPE is one HTML file plus a set of plain scripts. There is **no build step**. What you edit
is what runs.

```
index.html          the engine: state, screens, HUD, audio, scoring, leaderboard, CSS
  └─ also the <script> tags that load everything below, in a specific order

polish/             cinematic + presentation modules (optional-feeling, but loaded eagerly)
  ├─ zkp.js         tiny stateless render helpers (window.ZKP)
  ├─ prologue.js    the intro cinematic      (window.ZKPRO)
  ├─ finale.js      the ending cinematic     (window.ZKFIN)
  ├─ card.js        the Explorer Card        (window.ZKCARD)
  └─ zm.js          a lookahead music scheduler (window.ZKMUS)

worlds/             twelve self-contained worlds (01-origin.js … 12-zilkroad.js)
hub/hub.js          the playable hub, also pushed through window.ZKW

NPCs/               NPC portrait images (+ *_clean.png background-removed variants)
Players/            (removed - held two unused sample portraits; nothing referenced it)
10kpfps/            REQUIRED zkSNARK artwork served from 10kpfps/zilkroad_art/<id>.webp (~183 MB).
                    Without it the game is unplayable - the landing screen only accepts a zkSNARK
                    number and there is no upload fallback, so S.pfp can never be set.
videos/             optional world videos (noirwallet.mp4, zilkroad.mp4)
```

---

## 2. The `window.ZKW` world-plugin architecture

This is the single most important thing to understand.

`hub/hub.js` and each `worlds/*.js` are **not** executed normally. Their entire body is wrapped
in a function and pushed as a **string** onto an array:

```js
// worlds/01-origin.js
window.ZKW = window.ZKW || [];
ZKW.push(function(){
  /* …the whole world… */
});
```

Then, at the very bottom of the engine in `index.html` (line ~1138), after everything else is
defined:

```js
(window.ZKW || []).forEach(f => eval('(' + f + ')()'));
```

**Consequences you must respect:**

- A world file's top-level statements only run **after** the whole engine has been parsed. It is
  safe for worlds to reference `W`, `DEC`, `bg`, `avatar`, `startWorld`, `stopWorld`, `$z`, `g2`,
  `AM`, `S`, `ZNAME`, etc.
- **Order matters only for override precedence.** Because each world's `stopWorld` wrapper calls
  the previously-registered one, a single `stopWorld()` call runs the wrappers in *reverse*
  registration order. See §6 — this bit us for real.
- `eval` means worlds must be syntactically self-contained. A world cannot `import`, and
  top-level `const`/`let` live inside the eval scope, not the global scope. Keep state in an
  IIFE or on a single object.
- Adding a `<script src="worlds/13-foo.js">` **before** the engine's final eval line is all it
  takes to load a new world. Keep the ordering of the `<script>` tags in the `<head>`/`<body>`.

### What a world registers

Inside its `ZKW.push(function(){ … })`, a world registers four things:

| Registration | Purpose |
|---|---|
| `W.push({ id, n, title, sub, desc, q, deep, bonus?, … })` | World metadata for the hub and cards. `id` must be unique. `n` is the short name on the portal. |
| `A[id] = '…'` | The artifact / collectible name shown in the inventory and on completion. |
| `LM[id] = function(x, y, s, c, t, a, B) { … }` | The hub's vector emblem, drawn on the portal marker. `B()` is a `beginPath` helper. |
| `DEC[id] = function(w, h, gy, t, p) { … }` | The per-frame draw/update entry the engine calls. |

A world also **wraps engine hooks** rather than replacing them, so only the active world
renders. The hooks a world wraps are: `bg`, `avatar`, `startWorld`, `stopWorld`, and (for some)
`fact`, `complete`, `enter`, `finish`. Each world guards itself with an `isX()` predicate:

```js
const isO = () => run && cur && cur.id === 'origin' && O && O.on;
```

Every wrapped hook calls the original when the predicate is false. If you add a world, follow
this pattern exactly — it is what keeps eleven inactive worlds from drawing over the active one.

---

## 3. Responsibilities of each file

### `index.html` — the engine
Holds almost everything shared:
- the single `window.ZKSCAPE = (function(){ … })()` IIFE and its public surface
  (`close, end, enter, state, W, Q, video, BANK, pickSet, stats, ident`)
- all game state `S` and its `save()` to `localStorage` (`zkscape.v1`)
- screens (`#s-land`, `#s-hub`, `#s-world`, `#s-end`, `#s-lb`), HUD, confirm/panel overlays
- the canvas + `g2` 2D context, `DEC`, `bg`, `fore`, `avatar`, and the render `loop()`
- the run clock (`S.t0` / `S.tEnd` / `S.tz`) and `pauseClock` / `resumeClock` / `tzFold`
- `stats()`, `ident()`, `breakdown()` — the scoring formulas (mirrored server-side)
- the AudioManager (`window` internal `AM`) with the synth fallback
- the Supabase leaderboard client
- `removeBg`, `extract` and the theme/palette helpers
- all CSS, including three base64-embedded fonts

### `hub/hub.js` — the hub scene
A full side-scrolling hub with its own physics, its own player (`HX`) and its own input (`K`).
It replaces the legacy ring-of-portals fallback: if `HUBX` is set, `hub()` delegates to it. It
owns portal layout, unlock rules, walk-to-portal, and returns to the world you came from.
It is registered through `window.ZKW` like a world, but it is not a `W[]` world.

### `worlds/NN-*.js` — the worlds
Each is fully self-contained: its own scene constants, physics, puzzles, NPC art, dialogue,
input map, and touch D-pad. Worlds share only the engine's helpers and `ZKP`/`AM`. Copy an
existing world file as the starting point for a new one — they are all built from the same
template.

### `polish/` — presentation
- `zkp.js` → `window.ZKP`: stateless render helpers (glow sprites, motes). Worlds guard use
  with `if(window.ZKP)`, so this file is safe to remove.
- `prologue.js` → `window.ZKPRO`: the ~14s intro cinematic. **There is no skip** — it plays to
  its natural handoff (`T_HAND = 12.72`).
- `finale.js` → `window.ZKFIN`: the ending cinematic.
- `card.js` → `window.ZKCARD`: draws the Explorer Card into a provided canvas; `exportCanvas()`
  returns it for download. Five tiers keyed off the score-based rank.
- `zm.js` → `window.ZKMUS`: a lookahead scheduler so WebAudio timing isn't jittery.

### `NPCs/`
`NPCs/` holds portraits; worlds reference `NPCs/<name>_clean.png` and use `removeBg` if the clean
variant is missing. The old `Players/` folder (two unused sample portraits) has been removed.

---

## 4. How to add a world safely

1. **Copy a template.** Start from the closest existing world. `05-orchard.js` or
   `06-ironwood.js` are good mid-sized examples.
2. **Give it a unique `id`** and push it to `W`. Add its `<script>` tag in `index.html` among the
   other `worlds/*.js` tags, keeping them before the engine's final `ZKW` eval.
3. **Register `A[id]`, `LM[id]`, and `DEC[id]`.** The hub will not show a portal without `W`, the
   inventory needs `A`, and the hub emblem falls back to the Zilkroad one if `LM` is missing.
4. **Wrap the engine hooks** with an `isX()` guard (see §2). Do not overwrite a hook outright.
5. **Guard the touch D-pad** — see §5. This is the easiest thing to get wrong.
6. **Guard your global input listeners** with a one-time flag, the way the existing worlds do:
   ```js
   if (!window.__zkOK) { window.__zkOK = 1; /* addEventListener(...) */ }
   ```
   Worlds share one `window`; without this, every world adds another keydown handler that fights
   the active one.
7. **Test on desktop AND on touch emulation.** Desktop keyboard can work while the touch D-pad
   is dead, which is exactly the class of bug in §5.

---

## 5. The touch D-pad — and the bug this architecture invites

Each world builds its own on-screen control bar:

```js
function ctl(on){
  let c = $z('<id>ctl');
  if (c && c.dataset.own !== '<world>') { c.remove(); c = null; }   // ownership guard
  if (!c) {
    c = document.createElement('div');
    c.id = '<id>ctl';
    c.dataset.own = '<world>';                                     // stamp ownership
    /* …styles + buttons whose handlers close over this world's own input object K… */
  }
  c.style.display = on && coarse ? 'flex' : 'none';
}
```

Two rules, both learned the hard way:

- **The DOM id must be unique per world.** Because `ctl(0)` also runs during `stopWorld()`, and
  the `stopWorld` wrappers chain in reverse order, a shared id is claimed at *page load* by
  whichever world is registered last — long before you enter either world. The other world then
  silently re-shows a D-pad whose buttons write into the wrong world. The `dataset.own` guard
  makes this fail safe even if someone reintroduces a duplicate id.
- **The buttons close over the world's local input object.** They are not re-bound by `ctl(1)`.
  If a world's bar was built by another world, pressing it does nothing to the visible one.

---

## 6. Constraints that prevent regressions

- **The `stopWorld` wrapper chain runs in reverse registration order.** Worlds wrap like
  `stopWorld = function(){ …; ctl(0); OLD_stop(); }`. A single call therefore runs world 12
  first, world 01 last. Code that assumes "my cleanup runs before theirs" will surprise you.
- **`W` order is load order**, and the hub renders portals in `W` order, and unlocking is
  `open = i => W[i].bonus ? !!S.done.origin : (i===0 || S.done[W[i-1].id])`. Inserting a world in
  the middle reshuffles unlock order. Add new worlds at the end, or set `bonus:1`.
- **The engine eval is `eval('(' + fn + ')()')`.** Worlds cannot rely on being able to `import`,
  and a syntax error in any world file is thrown at boot, before anything renders.
- **Scoring formulas live in two places**: `breakdown()`/`stats()` in `index.html` *and*
  `submit_run` in the SQL. They must stay in sync or submissions are rejected. If you change a
  score component, change both.
- **`S` is persisted wholesale on every `save()`** to one `localStorage` key. Do not stash large
  or non-serialisable values in it.
- **Audio is optional.** The AudioManager synthesises everything; `audio/music/*.mp3` and
  `audio/sfx/*.wav` override it if present. Removing `audio/` is safe; removing the synth
  fallback is not.
- **`?demo=1` / `?showcase=1`** swaps in a temporary `S` and blocks persistence
  (`Storage.prototype.setItem` is stubbed) and leaderboard submission. `DR` guards read this flag.
  Any code that mutates `S` during showcase mode must respect `DR`.
- **`?hubdebug=1`** exposes `window.__zkHub` (`teleport`, `ts`). Inactive without the flag — keep
  it that way; it is a test affordance, not a feature.

---

## 7. The cinematic modules and the Explorer Card

- **Prologue (`prologue.js`)** builds a full-screen overlay canvas, runs ~13.8s of shots, then
  hands off to `ad.done()` which restores the hub. It borrows the engine's own world renderer
  for the backdrop but mutes audio and never accepts player input. There is no skip path; the
  only non-natural exit is the `catch` at the end of its frame loop (`handoff(true)`), a safety
  valve if rendering throws.
- **Finale (`finale.js`)** mirrors that structure for the ending.
- **Explorer Card (`card.js`)** is handed the existing `#cc` canvas plus only data the game
  already tracks (PFP image, palette, `ident()`, `stats()`, `W`, name, `fmtN`, `fmtT`, reduce).
  It renders five rank tiers and exposes `show()`, `exportCanvas()`, `cancel()`. `index.html`'s
  `end()` calls `ZKCARD.show(...)` and falls back to the original inline drawing if the module
  is absent. The download button uses `exportCanvas()` when present.

---

## 8. A note on the Supabase client and server

`index.html` ships with a **publishable** (`sb_publishable_…`) Supabase key. That is the
correct, intended client key type. The matching `submit_run` function is `security definer` and
**recomputes every score server-side**, rejecting mismatches. Keep it that way:

- Never put a `service_role` key in `index.html`.
- If you edit `stats()` or `breakdown()`, mirror the change in `submit_run`.
- See `docs/PRIVACY.md` for exactly what leaves the device, and only when.

---

## 9. Testing notes

Automated browser verification was run with Playwright/Chromium:
- desktop (1280×800) — boot, cinematic, hub, worlds, clock, no console errors
- iPhone 13 emulation — touch D-pad on all 12 worlds, pointer-event hit-testing

Use `?hubdebug=1` and `window.__zkHub.teleport(x, y)` to jump around while testing. Some worlds
also expose small state hooks for tests (`window.__zv`, `__nv`, `__cv`, `__zkM` — the last needs
`window.__ZKTEST` set before load).