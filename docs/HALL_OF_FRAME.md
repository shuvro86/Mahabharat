# Hall of Frame

The Hall of Frame is a standalone dashboard module for cinematic, respectful retellings of defining Mahabharata moments. Its first feature is **Day 10 – The Bed of Arrows**, from the Bhishma Parva.

## Featured scene

- **Characters:** Bhishma, Arjuna, Shikhandi
- **Themes:** Dharma and personal duty, sacred vows, a turning point in the war
- **Interaction:** Browser speech narration, shortcuts to character dossiers, and a copyable prompt for video-generation tools
- **Artwork:** `public/assets/hall-of-frame/bhishma-day-10.png` (source copy in `src/assets/hall-of-frame/`), generated as original cinematic interpretation for this feature

The artwork and scene details are interpretive, not a claim of historical reconstruction. The image shows the moment before Bhishma's fall and avoids depicting wounds or gore. The browser's built-in speech synthesis supplies narration; voice availability varies by browser. The reduced-motion preference disables the artwork's subtle camera drift.

## Integration

- `src/modules/hallOfFrame/page.ts` renders the module's feature panel.
- `public/assets/hall-of-frame.css` defines its presentation and reduced-motion behavior.
- `public/assets/hall-of-frame.js` provides narration, prompt copying, and character navigation.
- The dashboard includes its tab in `src/app.ts`.
