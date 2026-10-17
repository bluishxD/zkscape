# ZKSCAPE V2 — Release Checklist

Work top to bottom. Every item is a pass/fail you should personally confirm in a browser before
shipping. Tick the box only once you have actually done it.

Automated coverage so far is Chromium desktop + Chromium iPhone 13 emulation. Items marked
**manual** have not been machine-verified.

---

## 1. New-player launch flow — manual

- [ ] Serve over HTTP (not `file://`); open the site; page loads with no console errors
- [ ] Landing shows the ZKSCAPE title and the tagline **"Your PFP. Your world. Your Zcash story."**
- [ ] Browser tab title reads **"ZKSCAPE V2 — …"** (not the old wallpaper-generator title)
- [ ] Entering a valid zkSNARK number (1–10,000) loads that artwork and reveals ENTER ZKSCAPE
- [ ] An invalid number shows a clear error rather than hanging
- [ ] A number whose artwork is missing shows the "could not load" message
- [ ] No upload path exists on the landing screen (Snarks only, by design)
- [ ] zkSNARK lookup: a valid number loads art; an invalid number shows the clear
      "could not load" message rather than breaking
- [ ] "YOUR WORLD IS READY. ENTER ZKSCAPE" button appears
- [ ] Press it → intro cinematic plays **start to finish with no skip button** and no errors
- [ ] Cinematic hands off to the hub automatically
- [ ] Explorer-name prompt appears on first hub visit; both **ENTER** and **SKIP** work
- [ ] Name (if given) is drawn above the character

## 2. Character selection and PFP persistence

- [ ] PFP survives a page reload
- [ ] PFP survives leaving the world and returning to the hub
- [ ] Palette is extracted from the PFP and tints the UI
- [ ] Explorer name can be changed from the hub profile chip
- [ ] Explorer name is sanitised (only letters/digits/space `. _ -`, max 16)
- [ ] PFP is never uploaded (see `docs/PRIVACY.md`; confirm no network request carries image data)

## 3. All 12 worlds — manual

For each world: enter from the hub, walk both ways, jump, talk, complete it, return to hub.

- [ ] 01 Origin
- [ ] 02 Shielded Valley
- [ ] 03 Proof Temple
- [ ] 04 Key Library
- [ ] 05 Orchard
- [ ] 06 Ironwood
- [ ] 07 Block Observatory
- [ ] 08 Machine
- [ ] 09 Canvas
- [ ] 10 Archive
- [ ] 11 Noir Gate *(optional)*
- [ ] 12 ZK Market *(optional)*

Cross-cutting:

- [ ] Hub portals unlock in the correct order
- [ ] The two optional worlds stay sealed until Origin is discovered
- [ ] Each world shows its correct artifact name in the inventory
- [ ] **RETURN TO HUB** button works from every world
- [ ] Every world renders its hub emblem on its portal (no blank marker)

## 4. Archive completion and Explorer Card — manual

- [ ] Archive unlocks only after worlds 01–09
- [ ] Final trial is 15 questions (2 easy / 5 medium / 8 hard), no repeats within a run
- [ ] Hints are available and are tracked
- [ ] Finishing the run stops the clock and shows the itemised score breakdown
- [ ] Explorer Card renders with your PFP, palette, name, rank and stats
- [ ] Card tier matches rank (Iron Tablet / Bronze Compass / Silver Octagon / Crimson Bastion / Prismatic Relic)
- [ ] **DOWNLOAD EXPLORER CARD** saves a PNG
- [ ] Card generates even when the leaderboard is unreachable

## 5. Cinematic skip and completion paths — manual

- [ ] Intro cinematic has **no skip button** (removed; verified in Chromium)
- [ ] Escape does not skip the intro
- [ ] Intro always reaches its natural handoff
- [ ] Ending cinematic plays and completes (or its own skip, if you keep it)
- [ ] Cinematics do not leave a stuck overlay that blocks the hub

## 6. Save / reset behaviour — manual

- [ ] Progress persists across reload
- [ ] Progress persists across closing and reopening the browser
- [ ] **RESET PROGRESS** clears progress and reloads to the landing screen
- [ ] Reset does not leave a broken hub state
- [ ] Reset does not clear audio volume preferences (by design)

## 7. Run-clock pause behaviour — verified in Chromium

- [ ] Clock runs while the tab is focused (confirmed)
- [ ] Clock **freezes** when the tab is hidden or window blurred (confirmed)
- [ ] Clock **resumes** on return (confirmed)
- [ ] Time spent away is excluded from the final time (confirmed)
- [ ] Paused gap survives closing/reopening the tab (confirmed via reload)
- [ ] Paused time is not submitted to the leaderboard

## 8. Audio fallback and mobile controls

- [ ] First user gesture unlocks audio (browser autoplay policy)
- [ ] Music and SFX play with no `audio/` folder present (synth fallback) — **manual**
- [ ] 🔊 panel toggles music, SFX and master volume; settings persist
- [ ] Mobile: on-screen D-pad appears on a touch device / narrow viewport — **manual on real hardware**
- [ ] Mobile: walking, jumping and interacting all work from the D-pad
      *(automated: all 12 worlds on iPhone-13 emulation passed)*
- [ ] Hub: tapping the ground walks the explorer there
- [ ] No control-bar id collisions between worlds (fixed for `octl`; each world stamps `dataset.own`)

## 9. Asset loading and console errors — manual

- [ ] No 404s for required assets (scripts, worlds, hub, polish, NPCs)
- [ ] Only *known* optional 404s remain (absent `audio/`, absent `mechanist_clean.png`)
- [ ] No JavaScript exceptions on load, in the hub, or in any world
- [ ] Fonts render (they are base64-embedded; no font CDN needed)
- [ ] Videos (optional) play if present; Watch button is harmless if absent

## 10. External integrations — manual

- [ ] Leaderboard reads and renders (four tabs)
- [ ] Submitting a run stores it and highlights "you"
- [ ] Leaderboard fails **gracefully** when the network is down or the key is blank
- [ ] Explorer Card still downloads when the leaderboard is down
- [ ] **No `service_role` key anywhere in the shipped HTML** (grep to confirm)
- [ ] `?demo=1` showcase mode runs without touching real progress or the leaderboard
- [ ] Outbound ecosystem links open correctly

## 11. Final packaging

- [ ] `index.html`, `hub/`, `worlds/`, `polish/`, `NPCs/`, `videos/` present
- [ ] `zkscape-supabase.sql` present if you intend people to self-host the leaderboard
- [ ] `README.md`, `docs/`, `CREDITS.md` present
- [ ] `docs/POLISH_LOG.md` and `docs/HUB_REDESIGN_NOTES.md` left intact
- [ ] `10kpfps/` shipped (183 MB) — **required, not optional.** Without it nobody can enter the game.
- [ ] No stale references to the removed `Players/` folder remain in the docs
- [ ] Served over HTTPS in production
- [ ] Correct MIME types (`.js`, `.webp`, `.mp4`)
- [ ] Caching set so `index.html` updates but assets cache

---

## Sign-off

- [ ] Tested in Safari / real iOS — **manual** (not machine-verified)
- [ ] Tested in Firefox or Edge — **manual**
- [ ] A second person has played it start to finish

**Tester:** ____________  **Date:** ____________  **Build/commit:** ____________