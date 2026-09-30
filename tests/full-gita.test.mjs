import test from "node:test";
import assert from "node:assert/strict";
import { readFileSync } from "node:fs";

const corpus = JSON.parse(readFileSync(new URL("../src/modules/fullGita/data/gita.json", import.meta.url), "utf8"));
const bangla = JSON.parse(readFileSync(new URL("../src/modules/fullGita/data/bangla.json", import.meta.url), "utf8"));

test("full Gita snapshot has complete chapter and translation coverage", () => {
  assert.equal(corpus.chapters.length, 18);
  assert.equal(corpus.verses.length, 701);
  assert.equal(corpus.chapters.reduce((sum, chapter) => sum + chapter.verseCount, 0), 701);
  assert.equal(new Set(corpus.verses.map((verse) => `${verse.chapter}.${verse.verse}`)).size, 701);
  assert.ok(corpus.verses.every((verse) => verse.sanskrit && verse.transliteration && verse.wordMeanings && verse.translations.length === 7));
  assert.ok(corpus.verses.every((verse) => verse.translations.filter((item) => item.language === "english").length === 5));
  assert.ok(corpus.verses.every((verse) => verse.translations.filter((item) => item.language === "hindi").length === 2));
});

test("Bangla study meanings cover each source verse without replacing attributed translations", () => {
  const references = corpus.verses.map((verse) => `${verse.chapter}.${verse.verse}`);
  assert.equal(Object.keys(bangla.verses).length, 701);
  assert.ok(references.every((reference) => /[\u0980-\u09ff]/u.test(bangla.verses[reference])));
  assert.match(bangla.method, /Machine-assisted/);
});

test("landmark verses contain distinct source Sanskrit and attributed translations", () => {
  const one = corpus.verses.find((verse) => verse.chapter === 1 && verse.verse === 1);
  const fortySeven = corpus.verses.find((verse) => verse.chapter === 2 && verse.verse === 47);
  const final = corpus.verses.find((verse) => verse.chapter === 18 && verse.verse === 78);
  assert.match(one.sanskrit, /धर्मक्षेत्रे/);
  assert.match(fortySeven.sanskrit, /कर्मण्येवाधिकारस्ते/);
  assert.notEqual(one.sanskrit, fortySeven.sanskrit);
  assert.ok(final.translations.some((item) => item.author === "Swami Sivananda" && item.text.length > 20));
});
