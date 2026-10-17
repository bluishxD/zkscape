# ZKSCAPE — Credits

This file records where each asset came from and who it belongs to. Third-party artwork is
credited to its creators and is not claimed by this project.

ZKSCAPE is an independent, unofficial, educational project about Zcash. It is not affiliated
with, endorsed by, or sponsored by the Electric Coin Company or any other Zcash organisation.

---

## 1. Technology and concepts

- **Zcash** — the subject of the game. Educational material on shielded transactions,
  zero-knowledge proofs (zk-SNARKs), viewing keys, the memo pool, consensus and the nullifier
  model is drawn from Zcash's public documentation.
- Official ecosystem links referenced by the game: <https://www.zknoir.com/> and
  <https://zilkroad.com/>.
- Supabase (PostgreSQL + PostgREST + PostgRPC) — optional backing store for the online
  leaderboard.

## 2. Code and design

- All game code, world design, puzzle design, dialogue, level layout, art direction and the
  Explorer Card were written for this project.
- The author's public profile, linked from the game: <https://x.com/JustBluishxD>.

## 3. Fonts

The game embeds three fonts directly in `index.html` as base64 `@font-face` data. They are
served from the file itself — no font CDN is contacted at runtime.

| Family | Weights | Provenance |
|---|---|---|
| **Abril Fatface** | 400 | Google Fonts, by **TypeTogether**. Open Font License. |
| **Caveat** | 600 | Google Fonts, by **Impallari Type**. SIL Open Font License. |
| **Bricolage Grotesque** | 400, 600 | Google Fonts, by **Mathieu Triay**. SIL Open Font License. |

> **Manual review:** the exact font files bundled here could not be matched back to a specific
> upstream release from inside the package alone. Confirm the versions and their OFL
> attribution files before any public distribution.

## 4. Audio

- **All music and every sound effect are synthesised at runtime** with the Web Audio API.
  There are no third-party audio assets in this package and no audio is downloaded.
- An **optional** `audio/music/` and `audio/sfx/` folder is supported: dropping `.mp3` / `.wav`
  files there overrides the synthesis automatically. No such files ship in this package, so
  there is nothing to attribute.

## 5. Artwork

### 5.1 NPC portraits — `NPCs/`

| File | Character | Provenance |
|---|---|---|
| `zkSNARK_clean.png` | the guide | Third-party — part of the Zcash art collection |
| `3Deez_clean.png` | 3Deez | Third-party — part of the Zcash art collection |
| `winterspring_clean.png` | Winter Spring | Third-party — part of the Zcash art collection |
| `jeff_clean.png` | Jeff | Third-party — part of the Zcash art collection |
| `Gary_clean.png` | Gary | Third-party — part of the Zcash art collection |
| `hialdu_clean.png` | hialdu | Third-party — part of the Zcash art collection |
| `tokenshark_clean.png` | tokenshark | Third-party — part of the Zcash art collection |
| `mechanist_clean.png` | (Hob) | **Not present in this package.** Referenced by Ironwood and The Machine; both worlds draw a deliberate placeholder instead. |

Each `_clean.png` is a background-removed variant of the same-named original, generated
in-browser by the game's own `removeBg()` routine.

> These portraits are **not original work for this project**. They are characters from the
> Zcash art collection, used here as the NPCs who guide the player. They remain the property of
> their respective creators. Nothing in this project claims ownership of them.

### 5.2 User-supplied profile pictures

Player profile pictures are supplied by the player at runtime, processed entirely in the browser
(`removeBg`, palette extraction, canvas). They are stored locally and never uploaded. They are
not project assets and carry no attribution obligation — but players should be aware that a
public leaderboard shows their **chosen display name**, not their image.

### 5.3 zkSNARK collection — `10kpfps/zilkroad_art/`

A directory of 10,000 numbered `.webp` images plus `download_log.csv` and `download_state.json`
(build artifacts, not read at runtime).

These are **zkSNARK artworks from the collection, each held as an NFT by an individual owner**.
They are included so that an NFT holder can look up and play with their own piece — the lookup
box on the landing screen takes an NFT number and fetches `10kpfps/zilkroad_art/<id>.webp`.

The artwork is **not original to this project and is not owned by it.** It stays the property of
the artists and the people who hold those NFTs. This project provides a way to view and play
with one's own NFT; it does not claim any rights over the underlying art.

> This game is built for a competition hosted by the collection's creators, so bundling the
> collection artwork is within the terms under which the game was commissioned.
> The NFT lookup shows a clear "could not load" message if the artwork cannot be reached.
>
> **Why the collection is bundled.** The game only accepts a zkSNARK as a character's profile
> picture — there is no upload option, so a player cannot bring an arbitrary image. Bundling the
> artwork is what makes the game playable at all: an NFT holder enters their number, and that is
> the piece they play as.
>
> This is why `10kpfps/zilkroad_art/` is **required**, not optional. Remove it and no one can
> enter the game, because there is no other way to obtain a character.

### 5.4 Videos — `videos/`

| File | Used by | Provenance |
|---|---|---|
| `noirwallet.mp4` | The Noir Gate (optional world) | Original work by the author |
| `zilkroad.mp4` | The ZK Market (optional world) | Original work by the author |

Both clips were created for this project by its author.

### 5.5 `Players/` (removed)

Formerly held `8494.png` and `8494_clean.png`. **Not referenced anywhere by the game**, so the
folder has been removed from the release. Nothing is owed for it.

### 5.6 In-game generated visuals

Everything else you see — world backdrops, portal emblems (`LM[id]` vector functions), particle
effects, glows, the Explorer Card, the wallpaper/artifact generator output — is drawn
procedurally at runtime by the game's own canvas code and is original to the project.

---

## 6. Third-party software

| Component | Use | Licence |
|---|---|---|
| Supabase | optional leaderboard backend | Apache 2.0 (service) |
| Python / Node / any static host | local serving | respective licences |

No runtime JavaScript libraries, frameworks, CDNs, analytics services or tag managers are used.
`index.html` is self-contained apart from the project's own scripts and the images in `NPCs/`.

---

## 7. Before you publish — open items

Nothing outstanding. All artwork, fonts and media in this package are accounted for above:

- NPC portraits and the zkSNARK collection — collection artwork, used under the terms of the
  competition hosted by the collection's creators
- `videos/` — original work by the author
- fonts — SIL Open Font License
- `Players/` — removed; it held two unused sample portraits that nothing referenced
- everything else — drawn procedurally at runtime by the game's own code