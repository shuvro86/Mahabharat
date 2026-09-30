import { readFileSync, writeFileSync } from "node:fs";

const source = JSON.parse(readFileSync(new URL("../src/modules/fullGita/data/gita.json", import.meta.url), "utf8"));
const target = new URL("../src/modules/fullGita/data/bangla.json", import.meta.url);
let existing = {};
try { existing = JSON.parse(readFileSync(target, "utf8")).verses ?? {}; } catch { /* first build */ }

async function translate(text) {
  const url = new URL("https://translate.googleapis.com/translate_a/single");
  url.search = new URLSearchParams({ client: "gtx", sl: "en", tl: "bn", dt: "t", q: text }).toString();
  for (let attempt = 0; attempt < 4; attempt++) {
    try {
      const response = await fetch(url);
      if (!response.ok) throw new Error(`HTTP ${response.status}`);
      const body = await response.json();
      const result = body[0].map((part) => part[0]).join("").trim();
      if (!/[\u0980-\u09ff]/u.test(result)) throw new Error("No Bangla script in response");
      return result;
    } catch (error) {
      if (attempt === 3) throw error;
      await new Promise((resolve) => setTimeout(resolve, 700 * (attempt + 1)));
    }
  }
}

const pending = source.verses.filter((verse) => !existing[`${verse.chapter}.${verse.verse}`]);
let cursor = 0;
let finished = 0;
async function worker() {
  while (cursor < pending.length) {
    const verse = pending[cursor++];
    const key = `${verse.chapter}.${verse.verse}`;
    const english = verse.translations.find((entry) => entry.author === "Swami Sivananda")?.text;
    if (!english) throw new Error(`Missing source translation at ${key}`);
    existing[key] = await translate(english);
    finished++;
    if (finished % 25 === 0 || finished === pending.length) {
      writeFileSync(target, JSON.stringify({ sourceAuthor: "Swami Sivananda", method: "Machine-assisted Bangla study rendering from English; unreviewed, not an attributed classical translation", verses: existing }, null, 2) + "\n");
      process.stdout.write(`Translated ${finished}/${pending.length}\n`);
    }
  }
}
await Promise.all(Array.from({ length: 6 }, () => worker()));
if (Object.keys(existing).length !== 701) throw new Error(`Expected 701 Bangla meanings, found ${Object.keys(existing).length}`);
