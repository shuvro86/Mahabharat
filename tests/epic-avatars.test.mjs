import test from "node:test";
import assert from "node:assert/strict";
import fs from "node:fs";
import vm from "node:vm";
import { createHash } from "node:crypto";

const seed = fs.readFileSync(new URL("../src/utils/characterData.ts", import.meta.url), "utf8");
const roster = [...seed.matchAll(/^    name: "([^"]+)"/gm)].map(match => match[1]);
const context = {window: {addEventListener() {}}};
vm.runInNewContext(fs.readFileSync(new URL("../src/assets/epic-avatars.js", import.meta.url), "utf8"), context);
const avatars = context.window.EpicAvatars;

test("every seeded character has a local illustrated avatar profile", () => {
  const hashes = new Set();
  assert.equal(roster.length, 50);
  assert.equal(avatars.names.length, roster.length);
  assert.deepEqual([...avatars.names].sort(), [...roster].sort());
  for (const name of roster) {
    const markup = avatars.render(name, "card");
    const source = markup.match(/src="(\/assets\/characters\/[^"]+)"/)[1];
    assert.ok(fs.statSync(new URL("../src" + source, import.meta.url)).size > 10000, name);
    const full = source.replace("-card.jpg", ".jpg");
    assert.ok(fs.statSync(new URL("../src" + full, import.meta.url)).size > 10000, name);
    hashes.add(createHash("sha256").update(fs.readFileSync(new URL("../src" + full, import.meta.url))).digest("hex"));
    assert.match(markup, /loading="lazy"/);
    assert.doesNotMatch(markup, /<svg|unsplash/i);
  }
  assert.equal(hashes.size, roster.length, "Every record must have its own painting");
});

test("every portrait has an individual interpretation note", () => {
  const notesContext = {window: {}};
  vm.runInNewContext(fs.readFileSync(new URL("../src/assets/character-art-notes.js", import.meta.url), "utf8"), notesContext);
  assert.deepEqual(Object.keys(notesContext.window.EpicPortraitNotes).sort(), [...roster].sort());
});

test("paired queens use their dedicated painting and unknown names are escaped", () => {
  const pair = avatars.render("Ambika & Ambalika", "modal");
  assert.match(pair, /ambika-ambalika.jpg/);
  assert.match(pair, /loading="eager"/);
  const unknown = avatars.render('<img src=x onerror="alert(1)">', "card");
  assert.doesNotMatch(unknown, /<img src=x/);
  assert.match(unknown, /&lt;img/);
});

test("dossier voice requires Play and Stop cancels speaking", () => {
  const speech = {spoken: [], cancelled: 0, getVoices: () => [{lang: "en-US"}], speak(utterance) { this.spoken.push(utterance); utterance.onstart?.(); }, cancel() { this.cancelled++; }};
  const makeElement = tag => ({
    tag, children: [], listeners: {}, classList: {add() {}, remove() {}, toggle() { return true; }},
    append(...children) { this.children.push(...children); }, appendChild(child) { this.children.push(child); },
    addEventListener(event, callback) { this.listeners[event] = callback; }, setAttribute() {},
    querySelector(selector) { return selector === ".epic-avatar--modal" ? avatar : null; }
  });
  const avatar = makeElement("div");
  const host = makeElement("section");
  const browser = {speechSynthesis: speech, addEventListener() {}};
  const sandbox = {window: browser, document: {createElement: makeElement}, SpeechSynthesisUtterance: class { constructor(text) { this.text = text; } }};
  vm.runInNewContext(fs.readFileSync(new URL("../src/assets/epic-avatars.js", import.meta.url), "utf8"), sandbox);
  sandbox.window.EpicAvatars.mountDossier({name: "Arjuna", role: "Archer", description: "He carries Gandiva. More text."}, host);
  assert.equal(speech.spoken.length, 0);
  const panel = host.children[0];
  const toolbar = panel.children.find(child => child.className === "epic-voice-toolbar");
  const play = toolbar.children.find(child => child.textContent === "▶ Play voice");
  const stop = toolbar.children.find(child => child.textContent === "Stop");
  play.listeners.click();
  assert.equal(speech.spoken.length, 1);
  assert.match(speech.spoken[0].text, /Arjuna\. Archer\. He carries Gandiva\./);
  stop.listeners.click();
  assert.ok(speech.cancelled >= 2);
  assert.equal(host.children.length, 2); // controls and sourced verse
});
