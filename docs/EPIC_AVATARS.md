# Epic Character portraits

The module uses 50 individually generated realistic paintings for 50 records (51 people: Ambika and Ambalika share one composition). The flat SVG busts have been replaced. These are artistic interpretations, not historically verified likenesses.

## Assets and behavior

- `src/assets/characters/`: optimized local 960 px dossier JPEGs and 480 px lazy-loaded card JPEGs.
- `docs/CHARACTER_ART_PROMPTS.json`: full prompt set and production provenance. Built-in image generation was used, once per composition.
- `src/assets/character-art-notes.js`: an individual art note for every dossier.
- `src/assets/epic-avatars.js` and `.css`: rendering, subtle framing drift, atmospheric light, narration controls, and speaking indicator.

Square frames retain heads and identifying attributes. Motion pauses outside the viewport and can be paused manually. Reduced-motion preferences disable animation. “Illuminate portrait” performs a brief lighting effect. These are animated still paintings, not rigged faces or lip-synchronized video.

Voice requires Play. Browser speech synthesis reads a labeled English dossier excerpt with Pause/Resume, Stop, volume, and a written transcript. Closing the dossier or leaving the tab stops narration. Voice availability and pronunciation depend on the browser; there are no custom actor voices or reviewed Sanskrit recordings.

## Research and interpretation

Ganguli's translation uses section numbering that can differ from critical-edition chapters. Identity and attributes guide the art; facial geometry, exact age, armor, jewels, colors, and architecture are artistic choices. The portraits show different narrative moments.

| Source | Art direction informed |
| --- | --- |
| [Asramavasika XXV](https://www.ibiblio.org/sripedia/ebooks/mb/m15/m15025.htm) | Pandava physiques, the twins, Draupadi, Subhadra, Ulupi, Chitrangada, Uttaraa. |
| [Adi CLXIX](https://sacred-texts.com/hin/m01/m01170.htm) | Draupadi's dark complexion, eyes and hair; Dhrishtadyumna's martial emergence. |
| [Adi CVI](https://www.ibiblio.org/sripedia/ebooks/mb/m01/m01107.htm) | Vyasa, the two queens, Pandu's pallor and Kuru parentage. |
| [Adi CIX](https://www.ibiblio.org/sripedia/ebooks/mb/m01/m01110.htm) | Pandu's archery, Dhritarashtra's strength, Vidura's wisdom. |
| [Adi CX](https://www.ibiblio.org/sripedia/ebooks/mb/m01/m01111.htm) | Gandhari's blindfold and relationship to Shakuni. |
| [Adi CXXXIII](https://www.ibiblio.org/sripedia/ebooks/mb/m01/m01134.htm) | Drona as an austere martial instructor. |
| [Adi CXXXIV](https://www.ibiblio.org/sripedia/ebooks/mb/m01/m01135.htm) | Arjuna's practice and Ekalavya's forest archery. |
| [Adi CLVII](https://www.ibiblio.org/sripedia/ebooks/mb/m01/m01158.htm) | Hidimbi's assumed human beauty and Ghatotkacha's distinctive bald head and strength. His fantastic form is softened here. |
| [Adi CCXVI](https://www.ibiblio.org/sripedia/ebooks/mb/m01/m01217.htm) | Ulupi's Naga identity and river setting. |
| [Adi CCXVII](https://www.ibiblio.org/sripedia/ebooks/mb/m01/m01218.htm) | Chitrangada's dynastic role and Babruvahana's parentage. |
| [Aswamedha LXXIX](https://www.ibiblio.org/sripedia/ebooks/mb/m14/m14079.htm) | Babruvahana's courteous reception of Arjuna. |
| [Vana 3.284](https://enjoylearningsanskrit.com/scriptures/mahabharata/book-3/chapter-284/) | Karna's armor and earrings; the portrait precedes their donation. |
| [Khatu Shyam devotional account](https://www.khatu.in/en/katha/krishna-pariksha) | Barbarika's three-arrow iconography, explicitly labeled as later tradition. |

Other portraits use the existing dossier's character role as a narrative brief. This does not establish verse-level sources for every physical or costume detail. Krishna's blue complexion and peacock feather follow devotional art. Iravan's regional traditions are distinguished in his note. Shikhandi is depicted as an adult male warrior. Antagonists retain human proportions and royal or military dignity.

The existing biography dataset mixes epic, later and regional traditions; it has not received a complete textual audit. Four sourced Sanskrit passages remain displayed with links (Gita 18.66 and 18.73; Mahabharata 3.284.31 and 1.94.88). The English narrator does not recite them.

## Verification

`npm run test:avatars` checks exact roster coverage, local full/card files, escaping unknown names, the dedicated paired portrait, and explicit voice playback and cancellation. `npm run lint` and `npm run build` check TypeScript.

Original PNGs remain in the generator output directory. The application depends only on the copied JPEGs in this repository.
