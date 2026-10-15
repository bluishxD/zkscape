# Visual polish log

Rule: render-only changes inside each world's existing drawing code. Originals are kept in `_polish_backups/`
(restore a world by copying its `.orig` file back over `worlds/<file>`).

## World 10 - THE ARCHIVE  (`worlds/10-archive.js`)  - DONE
Only `DEC.archive` was changed. Everything from the original (tablet positions/sizes/labels, title, giant arch, star hotspot,
quiz, progression) is untouched; the original drawing statements are still there and in the same order.
Added (all behind the player/hotspots):
- colonnade behind the hall with a slow parallax and rim light
- tick marks and a slow dashed inner ring on the existing arch, plus nine markers on it that light up as each world is discovered
  and a keystone that brightens with overall progress (state-driven lighting, as in the Machine)
- tablets: bevelled frame, corner studs, engraved lines, slow sheen once discovered; plinths and floor light pools anchoring them
- floor: receding seams, lit edge, low mist
Performance: static detail is cached; per-frame work is sprite blits and two batched strokes (frame rate equal to the original within noise).

## Worlds 01-09 (Origin ... Canvas) - DONE
Method: render-only additions. Every world file keeps all of its original code; the only edits to existing lines are inserted calls
to new functions (verified automatically: each original line is still an in-order subsequence of the new line). Originals are in `_polish_backups/*.js.orig`.
A tiny shared helper `polish/zkp.js` (cached glow sprites, drifting motes, edge lights, masonry lines, grit) is loaded before the worlds;
worlds guard its use with `if(window.ZKP)`.

- 01 Origin: distant ruined arcades, fluted/cracked columns with lit caps, soil strata + grass, platform undersides, trim on monuments/gate, warm dust
- 02 Shielded: rim-lit hills + mist, mullioned towers with masts, grass/flowers, shielded-zone circuit traces, dome rings, zone-tinted motes
- 03 Proof: floor slabs + conduit light spill, masonry on pillars/walls, corbels under ledges, data motes that brighten as the temple wakes
- 04 Keys: shelf cornices/plinths/brass plates, vault bolts + dial, plank floor, gap lips, ledge corbels, dust
- 05 Orchard: bark on trunks, roots/grass/spores that brighten with the grove, masonry on the stone gate, bark on the great trunk, fireflies
- 06 Ironwood: far foundry skyline + smoke, riveted plating, weeds that creep back with progress, braced pylons, foundry panels, steam, embers
- 07 Blocks: road slabs with rivets + fading support trusses, tower antennas, gulf haze + rising motes, Terrace masonry
- 08 Machine (reference, light touch): plate seams, slab edge work, entry-pillar masonry, motes
- 09 Canvas (reference, very light touch): wood grain, knots and paint flecks on the bench
Not touched: 10 Archive was done earlier; Noir and Zilkroad are being repolished separately.

Performance (headless Chromium, no GPU): within about +/-3% of the original for 8 of 9 worlds; Orchard measured about -9% before a final
grass-density reduction that was not re-measured.

## Swap (user-supplied files)
`worlds/07-blocks.js`, `09-canvas.js`, `11-noir.js`, `12-zilkroad.js` were replaced with the files supplied by the project owner.
The supplied Blocks and Canvas files turned out to be byte-identical to the polished versions that were already in the project, so those two did not change.
Noir and Zilkroad are new, full-size worlds; the previous small versions are kept in `_polish_backups/replaced_by_user/`.
Pre-polish originals of Blocks and Canvas are still in `_polish_backups/` (`07-blocks.js.orig`, `09-canvas.js.orig`).
