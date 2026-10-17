# ZKSCAPE HUB redesign: notes

## Files
- `index.html` (edited): shared `ZNAME` module (name sanitise/persist, pixel-font tag, name panel), one `g2.drawImage` hook so the tag
  shows in every world, `ENTRY` flow object, `hub()`/`hubLoop()` delegate to the new HUB, CSS block `#zk-hub2`, `#znm` panel markup.
- `hub/hub.js` (new): the playable HUB. Loaded via the existing `window.ZKW` plugin mechanism. Registers no world.
- `worlds/*.js`, `NPCs/`: unchanged. If `hub/hub.js` is missing/throws, the legacy ring HUB runs as before.

## Controls (same as Origin)
A/D or arrows walk, Space/W/Up jump, E/Enter/F interact, click floor/portal to walk, touch buttons on touch screens.

## Name
Stored as `S.name` (+ `S.nameAsked`) inside the existing `zkscape.v1` save. Allowed: letters, digits, space . _ - (max 16), same set the
leaderboard name already used. Drawn with a built-in bitmap font on canvas (never HTML). Empty/invalid -> `EXPLORER`.
"RESET PROGRESS" clears it with the rest of the save.

## Future intro: where it plugs in
`ENTRY` in `index.html` (search `ENTRY FLOW`). Today `ENTRY.pick()` always returns `'hub'`.
Future: return `'intro'` for brand-new players, add `ENTRY.routes.intro`, and end the intro with `ENTRY.run('origin')`.
`routes.origin` already exists (`ensureRun(); burst(()=>startWorld(0))`): the same transition HUB portals use. Nothing calls it yet.

## Test hook
`?hubdebug=1` exposes `window.__zkHub` (teleport/state) for automated tests. Inert without the flag.
