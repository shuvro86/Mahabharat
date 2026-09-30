# Hall of Frame

The Hall of Frame is a standalone dashboard module for cinematic, respectful retellings of defining Mahabharata moments. Its first feature is **Day 10 – The Bed of Arrows**, from the Bhishma Parva.

## Featured scene

- **Characters:** Bhishma, Arjuna, Shikhandi
- **Themes:** Dharma and personal duty, sacred vows, a turning point in the war
- **Interaction:** Playable/downloadable cinematic MP4, browser speech narration, shortcuts to character dossiers, and a copyable prompt for video-generation tools
- **Artwork and video:** `public/assets/hall-of-frame/bhishma-day-10.png` and `bhishma-day-10.mp4` (source copies in `src/assets/hall-of-frame/`), generated/rendered as original cinematic interpretations for this feature

The artwork and scene details are interpretive, not a claim of historical reconstruction. The video animates the artwork with a slow battlefield pan, drifting dust, title cards, and a symbolic, non-graphic arrow-light sequence; it is not generated footage of rigged or independently animated characters. The browser's built-in speech synthesis supplies narration; voice availability varies by browser. The reduced-motion preference disables the artwork's subtle camera drift.

## Integration

- `src/modules/hallOfFrame/page.ts` renders the module's feature panel.
- `public/assets/hall-of-frame.css` defines its presentation and reduced-motion behavior.
- `public/assets/hall-of-frame.js` provides narration, prompt copying, and character navigation.
- `scripts/render-hall-of-frame.swift` renders the 12-second, 720p H.264 scene from the hero artwork using macOS AVFoundation.
- The dashboard includes its tab in `src/app.ts`.
