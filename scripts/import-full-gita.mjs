import { readFile, writeFile, mkdir } from "node:fs/promises";
import path from "node:path";

const sourceDir = process.argv[2];
if (!sourceDir) {
  console.error("Usage: node scripts/import-full-gita.mjs <directory-with-gita-json-files>");
  process.exit(1);
}

const read = async (name) => JSON.parse(await readFile(path.join(sourceDir, name), "utf8"));
const [rawChapters, rawVerses, rawTranslations] = await Promise.all([
  read("chapters.json"), read("verse.json"), read("translation.json")
]);

const clean = (value) => String(value ?? "").replace(/\u00a0/g, " ").trim();
const translationsByVerse = new Map();
for (const row of rawTranslations) {
  const list = translationsByVerse.get(row.verse_id) ?? [];
  list.push({ language: clean(row.lang), author: clean(row.authorName), text: clean(row.description) });
  translationsByVerse.set(row.verse_id, list);
}

const chapters = rawChapters.map((row) => ({
  number: row.chapter_number,
  name: clean(row.name),
  transliteration: clean(row.name_transliterated),
  englishName: clean(row.name_translation),
  meaning: clean(row.name_meaning),
  summaryEnglish: clean(row.chapter_summary),
  summaryHindi: clean(row.chapter_summary_hindi),
  verseCount: row.verses_count
})).sort((a, b) => a.number - b.number);

const verses = rawVerses.map((row) => ({
  id: row.id,
  chapter: row.chapter_number,
  verse: row.verse_number,
  sanskrit: clean(row.text),
  transliteration: clean(row.transliteration),
  wordMeanings: clean(row.word_meanings),
  translations: translationsByVerse.get(row.id) ?? []
})).sort((a, b) => a.chapter - b.chapter || a.verse - b.verse);

if (chapters.length !== 18 || verses.length !== 701 ||
    chapters.reduce((sum, chapter) => sum + chapter.verseCount, 0) !== verses.length ||
    new Set(verses.map((item) => `${item.chapter}.${item.verse}`)).size !== verses.length ||
    verses.some((item) => !item.sanskrit || !item.transliteration || item.translations.length !== 7)) {
  throw new Error("Gita source data failed chapter, verse, or translation coverage validation");
}

const destination = path.resolve("src/modules/fullGita/data/gita.json");
await mkdir(path.dirname(destination), { recursive: true });
await writeFile(destination, JSON.stringify({
  source: {
    api: "https://github.com/gita/bhagavad-gita-api",
    data: "https://github.com/gita/gita",
    dataRevision: "c6fce39595445768876ddbb8d1268a9c935e1d2b",
    importedAt: "2026-09-28"
  },
  chapters,
  verses
}));
console.log(`Imported ${chapters.length} chapters, ${verses.length} verses, and ${rawTranslations.length} attributed translations.`);
