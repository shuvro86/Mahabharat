# Full Bhagavad Gita module

## What it is

The separate reader at `/full-bhagavad-gita` uses a local snapshot of the JSON corpus consumed by [The Gita Initiative's Bhagavad Gita API](https://github.com/gita/bhagavad-gita-api). Its API application is written in FastAPI, and its ingestion code downloads `chapters.json`, `verse.json`, and `translation.json` from the related [gita/gita data repository](https://github.com/gita/gita). This module imports those same three source files into `src/modules/fullGita/data/gita.json`; it does not require a RapidAPI key or a live upstream request at page load.

**Imported corpus:** 18 chapters, 701 unique numbered verse records, and 4,907 attributed translations (seven for every verse). Five translations are English and two are Hindi. A separate `bangla.json` adds a Bangla study meaning for each verse. The reader includes Sanskrit, Bengali-script display of Sanskrit, transliteration, an English word glossary, chapter summaries, author selection, cross-translation comparison, search (including Bangla), browser speech synthesis, saved verses in `localStorage`, and direct links such as `/full-bhagavad-gita#2.47`.

The Bangla meanings were generated from Swami Sivananda's English by a machine translation service and have **not** been reviewed verse by verse against the Sanskrit. They are labeled as machine-assisted study meanings in the UI and API, not attributed to a Bengali translator. The original seven translations remain available for comparison. The build script is `scripts/build-bangla-gita.mjs`; it caches each result in `bangla.json` and needs network access if regenerating. Any future text review should revise the checked-in snapshot directly so the reviewed wording is not overwritten.

Verse and meaning listening uses the browser's speech synthesis. Bangla listening needs a Bengali voice installed in the browser or operating system; the reader reports when one is unavailable. The Bengali-script verse is Sanskrit transliterated into Bengali characters, while the Bangla meaning is a translation from English. Background flute music is opt-in, plays locally, loops, and offers a choice of five tracks plus pause, mute, and volume controls. It pauses during speech playback and resumes after speech ends.

The reader header and the main app's Bhagavad Gita tab use an AI-generated devotional illustration of Krishna as a scholar and artist. The optimized asset is `src/assets/krishna-scholar-artist.webp`, served at `/assets/krishna-scholar-artist.webp`; it is decorative artwork, not a historical or scriptural depiction.

The source's chapter 13 contains 35 numbered verses, so its chapter counts total **701**. The common “700 verses” label and alternate numbering traditions are not silently substituted. This reader stays separate from the earlier `/api/shlokas` collection, which includes generated placeholder verses. It also stays available when MongoDB is offline because it reads the checked-in JSON snapshot.

## Source and attribution

| Item | Source |
| --- | --- |
| API implementation | [`gita/bhagavad-gita-api`](https://github.com/gita/bhagavad-gita-api), revision `be08e55c421f7f6a91ae9bd541f63558a51db24d`, MIT license. |
| Source JSON | [`gita/gita`](https://github.com/gita/gita), revision `c6fce39595445768876ddbb8d1268a9c935e1d2b`, repository marked Unlicense. |
| Named translations | Swami Adidevananda, Swami Gambirananda, Swami Sivananda, Dr. S. Sankaranarayan, Shri Purohit Swami, Swami Ramsukhdas, and Swami Tejomayananda, as recorded in the dataset. |
| Bangla study meanings | Machine-assisted from Swami Sivananda's English; four landmark verse meanings were manually revised. Not a classical Bangla edition. |
| Flute music | Five recordings from Wikimedia Commons, with individual creators, source links, licenses, and conversion notes in [AUDIO_CREDITS.md](AUDIO_CREDITS.md). |

The repository license statements do not establish the rights status of every underlying named translation. Keep the author attributions and review any publication requirements before distributing this content beyond this project.

## API

| Endpoint | Result |
| --- | --- |
| `GET /api/full-gita/meta` | Source revision, counts, available translation authors, Bangla method and coverage. |
| `GET /api/full-gita/chapters` | Eighteen chapter metadata records and summaries. |
| `GET /api/full-gita/chapters/:chapter` | One chapter and all its source verses, attributed translations, and Bangla study meanings. |
| `GET /api/full-gita/verses/:chapter/:verse` | One verse, including all seven attributed translations and its Bangla study meaning. |
| `GET /api/full-gita/search?q=...` | Search Sanskrit, transliteration, word meanings, translations, Bangla meanings, or an exact chapter.verse reference; returns total and at most 60 previews. |

## Updating the snapshot

Download the upstream `chapters.json`, `verse.json`, and `translation.json` from `https://raw.githubusercontent.com/gita/gita/main/data/` into a temporary directory. Update the pinned data revision in `scripts/import-full-gita.mjs` if the source revision changes, then run:

```bash
node scripts/import-full-gita.mjs /path/to/downloaded-data
npm run test:full-gita
npm run lint
```

The import script verifies 18 chapters, 701 distinct references, and seven translations per verse before replacing the snapshot. If the upstream edition changes its numbering or coverage, review the change and update the validation deliberately.
