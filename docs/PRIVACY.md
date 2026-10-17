# ZKSCAPE — Privacy

This document describes what the game actually does. Every claim here was checked against the
source in this package rather than assumed. Where something could not be verified, it says so.

---

## 1. Short version

- Playing ZKSCAPE sends **nothing** anywhere.
- Your PFP, your progress, your explorer name and your run history stay in **your browser's
  local storage**.
- The **online leaderboard** is opt-in. Nothing is submitted until you explicitly type a display
  name and press *Enter Leaderboard*.
- Opening the leaderboard screen **reads** from a remote server (and so reveals your IP address
  to that server) even if you never submit.
- The only external service the game contacts is the **Supabase project configured in
  `index.html`**.

---

## 2. What is stored locally

Everything is stored in `window.localStorage`. There is no cookie, no analytics script, no
tracking pixel and no third-party embed anywhere in the package.

### `zkscape.v1` — game state

One JSON object, written on every meaningful change:

| Key | What it is |
|---|---|
| `done` | Object of world id → `1`. Which worlds you have discovered. |
| `score` | Cached total score. |
| `t0` | Run clock start timestamp (ms). |
| `tEnd` | Run clock end value in seconds, once the run finishes. |
| `tz` | Set while the run clock is paused; cleared when it resumes. |
| `art` | Whether you created a Canvas artifact. |
| `pfp` | **Your profile picture, stored as a data URL.** |
| `id` | A generated local identifier, e.g. `ZK-1A2B`. Used in filenames only. |
| `pal` | The 3-colour palette extracted from your PFP. |
| `name` | Your explorer name, if you gave one. |
| `nameAsked` | Whether the name prompt has been answered/skipped. |
| `stats` | Per-category correct/incorrect counters for your answers. |
| `run` | The current or last run: question set, which were correct, how many attempts, hints used, first-try count, elapsed. |
| `rid` | A random UUID generated locally, used as your leaderboard row id **if** you submit. |
| `lbName` | The display name you typed into the leaderboard form. |
| `lbDone` | Whether you have submitted a run. |

### `zkscape.audio.v2` — audio preferences

Master volume, music volume, SFX volume and the music/SFX on-off toggles. Nothing else.

### Clearing it

**RESET PROGRESS** on the landing screen deletes `zkscape.v1` and reloads the page. The audio
key is left alone, deliberately — your volume settings survive a reset. To remove everything,
clear site data for the origin in your browser settings.

Because storage is local, progress does **not** follow you between browsers, devices, profiles
or private windows.

---

## 3. Your PFP

Your picture is processed entirely in the browser:

1. It is read from a file input or a drop event using the browser's `FileReader`.
2. It is drawn to an off-screen canvas, the background is removed and a palette is extracted.
3. The result is kept as a **data URL inside `localStorage`**.

It is then drawn onto your explorer in the hub and every world, and onto the Explorer Card.

**Your PFP is never uploaded.** The leaderboard submission payload was checked: it contains
numbers, a display name and question identifiers only — no image, no image data, no filename.

---

## 4. The wallpaper generator

The Canvas world and the landing screen process your image locally, in a `<canvas>`, using
client-side JavaScript. The background-removal and palette-extraction steps run entirely on your
machine.

**However — this does not mean every part of the game is offline.** The wallpaper generator is
local; the leaderboard is not. See below for what does and does not leave your device.

---

## 5. The online leaderboard (optional)

### Is it enabled?

The leaderboard is only active if `SUPABASE_URL` is an `https://` URL and `SUPABASE_ANON_KEY`
is non-empty in `index.html`. If either is blank, the leaderboard screen shows
*"Leaderboard temporarily unavailable"* and the game continues to work normally.

The key currently in `index.html` is a Supabase **publishable / anon** key
(`sb_publishable_…`). That is the key type Supabase intends for browser clients — it is
designed to be visible in page source, and access is limited by the database's Row Level
Security policies. **No `service_role` key is present in this package**, and none should ever
be added to `index.html`.

### What happens when you just look

Opening the leaderboard screen issues a `GET` to the configured Supabase project to read the
top 100 rows. That request necessarily reveals your IP address and user agent to that server.
No game data is sent with it.

### What happens when you submit

Submitting is entirely deliberate. It requires:

- a completed run (a final time must exist), **and**
- you type a display name and press *Enter Leaderboard*.

Only then is a `POST` sent to the `submit_run` database function. The payload is:

| Field | What it is |
|---|---|
| `id` | A random UUID generated in your browser by `crypto.randomUUID()` (or a local fallback). Not tied to your `ZK-…` id, your PFP or your name. |
| `display_name` | The 3–16 character name you typed. |
| `answers` | The ids of the 15 questions you were asked, and for each: whether you got it right and how many attempts it took. |
| `first_try`, `correct_answers`, `incorrect_answers`, `questions_answered` | Counts. |
| `worlds_completed`, `bonus_worlds_completed`, `artifacts_collected` | How far you got. |
| `hints_used` | How many hints you used. |
| `accuracy` | Your accuracy percentage. |
| `canvas_completed` | Whether you finished The Canvas. |
| `elapsed_seconds` | Your final run time. **Excludes any time the clock was paused.** |
| `score` | Your total score. |
| `breakdown` | The itemised score components. |
| `completion_percentage` | Worlds completed out of 12. |

**Not included:** your PFP, any image data, your `ZK-…` id, your IP is not in the payload (the
server sees it as a connection detail), and nothing about your wallet or keys — the game has no
concept of either.

### What the server does with it

`zkscape-supabase.sql` defines the tables, policies and the `submit_run` function. Reading it:

- `submit_run` is declared **`security definer`** and executable by `anon`. It **recomputes
  score, accuracy, rank and explorer type from scratch** and rejects the submission if the
  client-supplied numbers disagree.
- It validates that the run is real: exactly 15 answers, 15 distinct question ids, all of which
  must exist in `public.zk_questions`, with the required 2 easy / 5 medium / 8 hard mix.
- Attempt counts and the first-try/correct/incorrect totals must be internally consistent.
- Elapsed time must be a real number, at least 30 seconds, and is clamped to one week.
- A player keeps their **best** run: a higher score wins; on a tie, the lower elapsed time wins.
- Row Level Security is enabled on both tables. The only policy is a **read** policy letting
  `anon` select from `public.players`.

**Honest assessment:** this is a reasonably careful design — the client cannot inflate its own
score, and direct table writes are not exposed by any policy in this SQL file. It has **not**
been penetration-tested or reviewed by a database administrator. Treat the leaderboard as a
working feature, not a hardened public service. If you intend to run it publicly, review the
policies and grants yourself first.

**It is not cheat-proof, and cannot be.** Results are produced in the browser, so the server has
no way to prove a human actually played — someone hand-building a payload could present a
flawless run. Server-side recomputation stops the *lazy* cheat (editing your score in devtools)
but not a determined one. That is a fundamental limit of any browser leaderboard, not a defect
in this implementation.

### Public by design

Anything you submit is **readable by anyone**, including the display name you chose. Rows are
visible through the leaderboard screen. Submitting is not anonymous in the sense of being
unlinkable — a name plus a stable UUID is pseudonymous, not anonymous. Use a name you are
comfortable having displayed.

### If you never submit

No run data is ever sent. The Explorer Card is still generated and downloadable.

---

## 6. Other external contact

- **zkSNARK artwork lookup** fetches `10kpfps/zilkroad_art/<number>.webp` — a **relative path on
  whatever host you are playing from**, not a third-party service. Your browser's normal
  request for it reveals your IP address to that host, as with any other file the game loads.
- **Outbound links.** The game links to `zknoir.com`, `zilkroad.com` and an `x.com` profile.
  These are ordinary `<a href>` links; nothing is loaded from them unless you click.
- **Fonts** are embedded in `index.html` as base64 `@font-face` data, so no font CDN is
  contacted.
- **Audio** is synthesised with the Web Audio API. There is no audio CDN and no telemetry.

---

## 7. Third-party services, in one table

| Service | When contacted | What is sent |
|---|---|---|
| Supabase (your project) | Opening the leaderboard screen | Read request; your IP is visible to it |
| Supabase (your project) | Explicitly submitting a run | Display name, random UUID, run statistics (see §5) |
| `zknoir.com`, `zilkroad.com`, `x.com` | Only if you click the link | Whatever that site normally receives |

There is no analytics, no advertising, no error-reporting service and no session recording.

---

## 8. Known limitations

- **Progress is not encrypted.** It is plain JSON in `localStorage`. Anyone with access to your
  browser profile can read or edit it.
- **Progress is not backed up.** Clearing site data loses it permanently.
- **The leaderboard has no deletion path.** Once a run is submitted, there is no UI to remove it.
  Deleting a row requires database access.
- **IP addresses are visible to your host and to Supabase** simply by loading the page and the
  optional artwork. This is inherent to running a website, not something the game adds.
- **The leaderboard was not independently security-audited**, as noted in §5.
- **"Your PFP never leaves your browser"** is accurate for the PFP specifically. It is not a
  general claim that the whole application is offline — the opt-in leaderboard is not.

---

## 9. Questions

If something here does not match what you observe, trust your observation over this document and
please report it. Nothing in this document is aspirational; if a feature is described as local,
it was checked to be local.