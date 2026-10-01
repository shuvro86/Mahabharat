export function hallOfFramePage(): string {
  return `
  <div id="tab-hall-of-frame" class="hidden space-y-6 hall-of-frame">
    <header class="border-b border-gray-800/80 pb-4">
      <p class="text-[10px] uppercase font-bold tracking-[.24em] text-amber-400">Stories that shaped the epic</p>
      <h2 class="epic-title mt-2 text-2xl md:text-3xl font-bold text-amber-300 tracking-wide">Hall of Frame</h2>
      <p class="mt-2 max-w-2xl text-sm text-gray-400">A cinematic gallery of defining Mahabharata moments, presented with care for the people and vows at their center.</p>
    </header>

    <article class="hof-feature overflow-hidden rounded-2xl border border-amber-500/30 bg-[#0a0d13] shadow-2xl">
      <div class="hof-video-frame">
        <iframe src="/assets/hall-of-frame/player.html" title="Day 10 – The Bed of Arrows, Bhishma Parva" allow="fullscreen; picture-in-picture" allowfullscreen loading="eager"></iframe>
      </div>
      <div class="flex flex-wrap items-center justify-between gap-4 border-b border-gray-800/70 p-5 md:p-7">
        <div>
          <span class="hof-day-badge">Bhishma Parva · Day 10</span>
          <h3 class="epic-title mt-3 text-2xl md:text-3xl font-black text-amber-200">The Bed of Arrows</h3>
          <p class="mt-2 max-w-2xl text-sm leading-relaxed text-gray-300">A turning point at sunset: Bhishma lowers his bow, and Arjuna faces the cost of a duty he cannot set aside.</p>
        </div>
        <div class="flex flex-wrap gap-2">
          <button type="button" onclick="hallFrameReadStory()" class="hof-primary"><i class="fa-solid fa-volume-high mr-2"></i><span id="hof-read-label">Hear the moment</span></button>
          <button type="button" onclick="hallFrameStopStory()" class="hof-secondary">Stop narration</button>
        </div>
      </div>

      <div class="grid gap-6 p-5 md:grid-cols-[1.05fr_.95fr] md:p-8">
        <section aria-labelledby="hof-story-title" class="space-y-4">
          <div>
            <p class="text-[10px] uppercase font-bold tracking-[.22em] text-amber-500">The moment</p>
            <h4 id="hof-story-title" class="epic-title mt-1 text-lg font-bold text-amber-200">A vow meets the turning tide of war</h4>
          </div>
          <p class="epic-text text-sm leading-7 text-gray-300">On the tenth day of battle, Shikhandi advances before Arjuna. Bhishma, bound by his vow not to fight Shikhandi, lowers his weapon. Arjuna releases the arrows that bring the grandsire down; Bhishma remains alive upon their points, choosing the moment of his final departure.</p>
          <p class="text-xs leading-relaxed text-gray-500">This scene is an artistic retelling based on the Mahabharata’s Bhishma Parva. Its visual details are interpretive; the gallery does not present them as a historical reconstruction.</p>
          <div class="flex flex-wrap gap-2 pt-1" aria-label="Key characters">
            <button class="hof-character" onclick="hallFrameFindCharacter('Bhishma')">Bhishma <span>Grandsire</span></button>
            <button class="hof-character" onclick="hallFrameFindCharacter('Arjuna')">Arjuna <span>Archer</span></button>
            <button class="hof-character" onclick="hallFrameFindCharacter('Shikhandi')">Shikhandi <span>Warrior</span></button>
          </div>
        </section>

        <aside class="hof-theme-card space-y-4 rounded-xl border border-amber-500/15 p-5">
          <div>
            <p class="text-[10px] uppercase font-bold tracking-[.22em] text-amber-500">Core theme</p>
            <p class="mt-1 text-sm font-semibold text-gray-100">Dharma vs. personal duty</p>
          </div>
          <div class="grid grid-cols-2 gap-3">
            <div class="hof-meta"><span>Moment</span><strong>Sacred vows</strong></div>
            <div class="hof-meta"><span>Impact</span><strong>War’s turning point</strong></div>
          </div>
          <details class="hof-prompt rounded-lg border border-gray-700/70 bg-black/20 p-4">
            <summary class="cursor-pointer text-xs font-bold text-amber-200">Open the cinematic video prompt</summary>
            <p id="hall-frame-prompt" class="mt-3 text-xs leading-6 text-gray-300">A thrilling, epic cinematic shot on the dark, dusty battlefield of Kurukshetra at sunset. Shikhandi stands fearlessly ahead of Arjuna’s war chariot, bow drawn. Bhishma, majestic with long white hair and weathered golden armor, gazes forward with a calm, solemn expression, honoring his sacred vow and slowly lowering his grand bow. Behind Shikhandi, Arjuna—his eyes brimming with reluctance and fierce determination—pulls back the string of the mighty Gandiva bow. A dramatic camera pan follows a massive, lightning-fast barrage of glowing arrows as they streak through the air toward Bhishma. Use a symbolic, non-graphic impact: no wounds or gore. Dust particles float in fiery rim light, volumetric god-rays break through the dying sun, and war smoke fills the distance. Ultra-detailed textures, emotionally grave dark epic fantasy tone, cinematic 8K composition.</p>
            <button type="button" onclick="hallFrameCopyPrompt()" class="hof-secondary mt-3"><i class="fa-regular fa-copy mr-1"></i> Copy prompt</button>
          </details>
          <p id="hof-copy-status" class="min-h-4 text-[11px] text-emerald-300" aria-live="polite"></p>
        </aside>
      </div>
    </article>
    <p id="hof-speech-status" class="sr-only" aria-live="polite"></p>
  </div>`;
}
