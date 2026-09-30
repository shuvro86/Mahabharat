import { Router, Request, Response } from "express";
import corpus from "./data/gita.json";
import bangla from "./data/bangla.json";

const router = Router();
const chapters = corpus.chapters;
const verses = corpus.verses;
const byReference = new Map(verses.map((item) => [`${item.chapter}.${item.verse}`, item]));
const banglaVerses = bangla.verses as Record<string, string>;
const withBangla = (item: typeof verses[number]) => ({ ...item, bangla: banglaVerses[`${item.chapter}.${item.verse}`] ?? null });

function chapterNumber(value: string): number | null {
  const number = Number(value);
  return Number.isInteger(number) && number >= 1 && number <= 18 ? number : null;
}

router.get("/meta", (_req: Request, res: Response) => {
  res.json({ source: corpus.source, chapterCount: chapters.length, verseCount: verses.length,
    bangla: { coverage: Object.keys(banglaVerses).length, sourceAuthor: bangla.sourceAuthor, method: bangla.method },
    translationAuthors: [...new Set(verses[0].translations.map((item) => `${item.language}: ${item.author}`))] });
});

router.get("/chapters", (_req: Request, res: Response) => {
  res.json(chapters);
});

router.get("/chapters/:chapter", (req: Request, res: Response) => {
  const number = chapterNumber(req.params.chapter);
  if (number === null) return res.status(400).json({ error: "Chapter must be between 1 and 18." });
  const chapter = chapters[number - 1];
  res.json({ chapter, verses: verses.filter((item) => item.chapter === number).map(withBangla) });
});

router.get("/verses/:chapter/:verse", (req: Request, res: Response) => {
  const chapter = chapterNumber(req.params.chapter);
  const verse = Number(req.params.verse);
  if (chapter === null || !Number.isInteger(verse) || verse < 1) {
    return res.status(400).json({ error: "Invalid chapter or verse number." });
  }
  const item = byReference.get(`${chapter}.${verse}`);
  if (!item) return res.status(404).json({ error: "Verse not found." });
  res.json(withBangla(item));
});

router.get("/search", (req: Request, res: Response) => {
  const query = typeof req.query.q === "string" ? req.query.q.trim() : "";
  if (query.length < 2 || query.length > 100) {
    return res.status(400).json({ error: "Search must be 2–100 characters." });
  }
  const needle = query.toLocaleLowerCase();
  const matches = verses.filter((item) =>
    `${item.chapter}.${item.verse}` === needle ||
    [item.sanskrit, item.transliteration, item.wordMeanings,
      ...item.translations.map((translation) => translation.text), banglaVerses[`${item.chapter}.${item.verse}`] ?? ""]
      .some((field) => field.toLocaleLowerCase().includes(needle))
  );
  res.json({ query, total: matches.length, results: matches.slice(0, 60).map((item) => ({
    chapter: item.chapter, verse: item.verse, sanskrit: item.sanskrit,
    transliteration: item.transliteration,
    preview: /[\u0980-\u09ff]/u.test(query) ? banglaVerses[`${item.chapter}.${item.verse}`] : item.translations.find((translation) => translation.author === "Swami Sivananda")?.text ?? ""
  })) });
});

export default router;
