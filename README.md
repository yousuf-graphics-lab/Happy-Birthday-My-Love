# FOR SAMIYA 💕

A small, cinematic birthday surprise built as a seven-screen journey — midnight
skies, a wax-sealed envelope, a cake you blow out, a handwritten letter, a
bouquet with a poem, a photo gallery, ten reasons, and one last surprise.

Everything is self-contained: no audio files, no external fonts, no image
assets. The music is synthesised live with the Web Audio API, the atmosphere and
confetti are drawn on canvas, and any photos she adds never leave her device.

## The journey

| # | Screen | What happens |
|---|--------|--------------|
| 1 | **The Welcome** | A floating envelope with a wax seal. Opening it breaks the seal, releases golden particles, starts the music and carries you inside. |
| 2 | **The Reveal** | Her name shimmering in gradient, a three-layer cake with five candles. Blow into the microphone (or tap the flames) to make a wish. |
| 3 | **The Letter** | A midnight stationery card where the handwritten letter writes itself a paragraph at a time, ending with a signature and a gold divider. |
| 4 | **The Bouquet** | An empty wrapped bouquet with stems draws itself, then seven roses, peonies, lilies and gold blooms spring into it, followed by a poem and a petal shower. |
| 5 | **Our Memories** | A glass-framed gallery for up to ten photos, with a swipeable lightbox. Photos are compressed and stored locally only. |
| 6 | **Ten Reasons** | Ten reasons hidden inside a rose — each touch unfolds a petal and lets one reason drift out, until the rose is in full bloom. |
| 7 | **The Finale** | Aurora, a glowing heart, the last lines of the message, confetti, and a button to live it all again. |

A discreet floating bar carries previous / next, progress dots, replay, and
music and sound-effect toggles. There is no conventional navigation bar.

## Running it

```bash
npm install
npm run dev      # http://localhost:3000
npm run build    # production build
npm start        # serve the build
```

The microphone is optional and only requested when the listener taps the mic
button; the candles work by tap as well.

## Where to edit things

- **All copy** — `src/lib/content.ts` (headings, letter, poem, captions, the ten reasons, finale lines)
- **Look and feel** — `src/app/globals.css` (palette, glass surfaces, keyframes) and `src/app/layout.tsx` (fonts, metadata)
- **Music and sound effects** — `src/lib/audio.ts` (chords, arpeggio, SFX synthesis)
- **Photos** — `src/lib/storage.ts` (compression, ten-photo limit, localStorage)
- **Social preview** — `src/app/opengraph-image.tsx` and `src/app/icon.svg`

## Notes

- Fonts (Playfair Display, Inter, Caveat, Noto Sans Devanagari) are self-hosted
  through `@fontsource`; the OG image uses two TTFs in `src/assets/fonts`
  because Satori cannot read `woff2`.
- Set `NEXT_PUBLIC_SITE_URL` when deploying so social preview URLs resolve.
- Audio never autoplays: the first tap on the envelope unlocks the audio context.

Made with love, for Samiya. 💗
