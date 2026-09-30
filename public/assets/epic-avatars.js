(function () {
  "use strict";

  // Portrait names and atmospheric accent colors; full art direction is documented separately.
  const rows = [
  [
    "Arjuna",
    "#e8bf72"
  ],
  [
    "Krishna",
    "#7fd5ca"
  ],
  [
    "Karna",
    "#f6c65e"
  ],
  [
    "Bhishma",
    "#a8c6d6"
  ],
  [
    "Yudhishthira",
    "#f3dc9d"
  ],
  [
    "Bheema",
    "#b8d798"
  ],
  [
    "Nakula",
    "#c9e5d8"
  ],
  [
    "Sahadeva",
    "#c2cde5"
  ],
  [
    "Draupadi",
    "#f3a364"
  ],
  [
    "Duryodhana",
    "#d4a15a"
  ],
  [
    "Dushasana",
    "#db957a"
  ],
  [
    "Gandhari",
    "#d9b7df"
  ],
  [
    "Dhritarashtra",
    "#ddbb80"
  ],
  [
    "Kunti",
    "#e8c89d"
  ],
  [
    "Drona",
    "#e7d4b0"
  ],
  [
    "Ashwatthama",
    "#a1c5f7"
  ],
  [
    "Shakuni",
    "#c5accb"
  ],
  [
    "Vyasa",
    "#e5c99b"
  ],
  [
    "Abhimanyu",
    "#eed283"
  ],
  [
    "Ghatotkacha",
    "#d0a0b7"
  ],
  [
    "Iravan",
    "#a5d6b6"
  ],
  [
    "Subhadra",
    "#f3d69c"
  ],
  [
    "Balarama",
    "#92b7ca"
  ],
  [
    "Satyaki (Yuyudhana)",
    "#a5d9c3"
  ],
  [
    "Kripacharya",
    "#d4d0ad"
  ],
  [
    "Vidura",
    "#c6d9cf"
  ],
  [
    "Sanjaya",
    "#b5d5e0"
  ],
  [
    "Dhrishtadyumna",
    "#efb266"
  ],
  [
    "Shikhandi",
    "#cebdd6"
  ],
  [
    "Ekalavya",
    "#b4cb85"
  ],
  [
    "Barbarika (Khatu Shyam)",
    "#d5a7e7"
  ],
  [
    "Shalya",
    "#dbc18b"
  ],
  [
    "Jarasandha",
    "#d8a887"
  ],
  [
    "Yuyutsu",
    "#b8d6b8"
  ],
  [
    "Kuntibhoja",
    "#dfc68f"
  ],
  [
    "Virata",
    "#afcce0"
  ],
  [
    "Uttara (Matsya Prince)",
    "#b9e1e7"
  ],
  [
    "Uttaraa (Matsya Princess)",
    "#bde4d7"
  ],
  [
    "Parikshit",
    "#eed695"
  ],
  [
    "Janamejaya",
    "#e2c19e"
  ],
  [
    "Kichaka",
    "#d4aa7b"
  ],
  [
    "Hidimbi",
    "#b9d89b"
  ],
  [
    "Ulupi",
    "#91e4cf"
  ],
  [
    "Chitrangada (Manipura)",
    "#e6b2d2"
  ],
  [
    "Babruvahana",
    "#c3cde6"
  ],
  [
    "Jayadratha",
    "#d5ac9e"
  ],
  [
    "Amba",
    "#efa99b"
  ],
  [
    "Ambika & Ambalika",
    "#e1c1d2"
  ],
  [
    "Pandu",
    "#dbc49d"
  ],
  [
    "Madri",
    "#e9c5d2"
  ]
];

  const profiles = new Map(rows.map(row => [row[0], {name: row[0], accent: row[1]}]));
  const verifiedVerses = {
    Krishna: {
      text: "सर्वधर्मान्परित्यज्य मामेकं शरणं व्रज। अहं त्वा सर्वपापेभ्यो मोक्षयिष्यामि मा शुचः॥",
      meaning: "Take refuge in Me alone; I will free you from all sins. Do not grieve.",
      source: "Bhagavad Gita 18.66, spoken by Krishna",
      url: "https://www.gitasupersite.iitk.ac.in/srimad?field_chapter_value=18&field_nsutra_value=66&language=dv"
    },
    Arjuna: {
      text: "नष्टो मोहः स्मृतिर्लब्धा त्वत्प्रसादान्मयाच्युत। स्थितोऽस्मि गतसन्देहः करिष्ये वचनं तव॥",
      meaning: "My confusion is gone. I stand firm, free of doubt, and will act on your words.",
      source: "Bhagavad Gita 18.73, spoken by Arjuna",
      url: "https://www.gitasupersite.iitk.ac.in/srimad?field_chapter_value=18&field_nsutra_value=73&language=dv"
    },
    Karna: {
      text: "वृणोमि कीर्तिं लोके हि जीवितेनापि भानुमन्। कीर्तिमानश्नुते स्वर्गं हीनकीर्तिस्तु नश्यति॥",
      meaning: "I choose honor even at the cost of life.",
      source: "Mahabharata, Vana Parva 3.284.31, spoken by Karna",
      url: "https://enjoylearningsanskrit.com/scriptures/mahabharata/book-3/chapter-284/"
    },
    Bhishma: {
      text: "अद्य प्रभृति मे दाश ब्रह्मचर्यं भविष्यति। अपुत्रस्यापि मे लोका भविष्यन्त्यक्षया दिवि॥",
      meaning: "From today I will live in celibacy; though without a son, I trust in enduring heavenly realms.",
      source: "Mahabharata, Adi Parva 1.94.88, spoken by Devavrata (Bhishma)",
      url: "https://enjoylearningsanskrit.com/scriptures/mahabharata/book-1/chapter-94/"
    }
  };
  const escapeHtml = value => String(value == null ? "" : value).replace(/[&<>"']/g, c => ({"&":"&amp;","<":"&lt;",">":"&gt;","\"":"&quot;","'":"&#39;"})[c]);
  const getProfile = name => profiles.get(name) || {name, accent:"#e2bc83"};

  const portraitSlug = name => String(name).toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "");
  function render(name, mode) {
    const p = getProfile(name);
    const modal = mode === "modal";
    const known = profiles.has(name);
    const slug = portraitSlug(name);
    const artwork = known ? `<img class="epic-avatar__portrait" src="/assets/characters/${slug}${modal ? "" : "-card"}.jpg" alt="" width="${modal ? 960 : 480}" height="${modal ? 960 : 480}" loading="${modal ? "eager" : "lazy"}" decoding="async">` : `<span class="epic-avatar__unavailable">Portrait awaiting illustration</span>`;
    return `<div class="epic-avatar epic-avatar--${modal ? "modal" : "card"}" data-name="${escapeHtml(name)}" data-active="${modal ? "true" : "false"}" role="img" aria-label="Painted portrait of ${escapeHtml(name)}" style="--epic-accent:${p.accent}">
      ${artwork}<div class="epic-avatar__light" aria-hidden="true"></div>
      <div class="epic-avatar__vignette" aria-hidden="true"></div>
      <span class="epic-avatar__caption">${escapeHtml(name)}</span>
      <span class="epic-avatar__voice" aria-hidden="true"><i></i><i></i><i></i><i></i><i></i></span>
    </div>`;
  }

  let observer = null;
  function observeCards(container) {
    if (observer) observer.disconnect();
    const cards = container.querySelectorAll(".epic-avatar--card");
    if (!("IntersectionObserver" in window)) {
      cards.forEach(node => { node.dataset.active = "true"; });
      return;
    }
    observer = new IntersectionObserver(entries => entries.forEach(entry => {
      entry.target.dataset.active = entry.isIntersecting ? "true" : "false";
    }), {rootMargin:"100px"});
    cards.forEach(node => observer.observe(node));
  }

  let currentUtterance = null;
  let speakingAvatar = null;
  let statusNode = null;
  let paused = false;
  function setStatus(message) { if (statusNode) statusNode.textContent = message; }
  function stopVoice() {
    if ("speechSynthesis" in window) window.speechSynthesis.cancel();
    if (speakingAvatar) speakingAvatar.classList.remove("epic-avatar--speaking");
    currentUtterance = null;
    speakingAvatar = null;
    paused = false;
    setStatus("Voice stopped.");
  }

  function mountDossier(character, host) {
    stopVoice();
    const avatar = host.querySelector(".epic-avatar--modal");
    const controls = document.createElement("section");
    controls.className = "epic-voice-panel";
    controls.setAttribute("aria-label", "Avatar controls");
    const lead = String(character.description || "").split(/(?<=[.!?])\s+/)[0];
    const script = `${character.name}. ${character.role}. ${lead}`;
    const title = document.createElement("h4"); title.textContent = "Portrait & narration";
    const note = document.createElement("p"); note.className = "epic-voice-note"; note.textContent = "English synthesized narration based on this character dossier. This is not a quotation from scripture.";
    const transcript = document.createElement("p"); transcript.className = "epic-voice-transcript"; transcript.textContent = script;
    const toolbar = document.createElement("div"); toolbar.className = "epic-voice-toolbar";
    const play = document.createElement("button"); play.type = "button"; play.textContent = "▶ Play voice";
    const pause = document.createElement("button"); pause.type = "button"; pause.textContent = "Pause";
    const stop = document.createElement("button"); stop.type = "button"; stop.textContent = "Stop";
    const action = document.createElement("button"); action.type = "button"; action.textContent = "✦ Illuminate portrait";
    const motion = document.createElement("button"); motion.type = "button"; motion.textContent = "Pause animation";
    const volumeLabel = document.createElement("label"); volumeLabel.textContent = "Volume ";
    const volume = document.createElement("input"); volume.type = "range"; volume.min = "0"; volume.max = "1"; volume.step = ".1"; volume.value = ".8"; volume.setAttribute("aria-label", "Voice volume"); volumeLabel.appendChild(volume);
    const status = document.createElement("p"); status.className = "epic-voice-status"; status.setAttribute("role", "status"); status.textContent = "Ready.";
    statusNode = status;
    [play,pause,stop,action,motion,volumeLabel].forEach(el => toolbar.appendChild(el));
    controls.append(title,note,transcript,toolbar,status);
    host.appendChild(controls);
    const artNote = window.EpicPortraitNotes && window.EpicPortraitNotes[character.name];
    if (artNote) {
      const noteSection = document.createElement("section"); noteSection.className = "epic-art-note";
      const heading = document.createElement("h4"); heading.textContent = "About this portrait";
      const description = document.createElement("p"); description.textContent = artNote;
      const interpretation = document.createElement("p"); interpretation.textContent = "Original artistic interpretation; facial features, costume details, and setting are not a reconstruction of historical appearance.";
      noteSection.append(heading,description,interpretation); host.appendChild(noteSection);
    }
    const verse = verifiedVerses[character.name];
    if (verse) {
      const section = document.createElement("section"); section.className = "epic-verse-panel";
      const heading = document.createElement("h4"); heading.textContent = "Textual voice";
      const original = document.createElement("p"); original.lang = "sa"; original.textContent = verse.text;
      const meaning = document.createElement("p"); meaning.textContent = verse.meaning;
      const source = document.createElement("a"); source.href = verse.url; source.target = "_blank"; source.rel = "noopener noreferrer"; source.textContent = verse.source;
      const caveat = document.createElement("p"); caveat.className = "epic-voice-note"; caveat.textContent = "The synthesized voice reads the English dossier above; Sanskrit recitation awaits a reviewed recording.";
      section.append(heading,original,meaning,source,caveat); host.appendChild(section);
    }

    play.addEventListener("click", () => {
      stopVoice();
      pause.textContent = "Pause";
      if (!("speechSynthesis" in window)) { setStatus("Voice is unavailable in this browser. The transcript remains above."); return; }
      const utterance = new SpeechSynthesisUtterance(script);
      utterance.lang = "en-US";
      utterance.rate = character.name === "Bhishma" || character.name === "Vyasa" ? .82 : .9;
      utterance.pitch = character.name === "Krishna" ? .92 : 1;
      utterance.volume = Number(volume.value);
      const voices = window.speechSynthesis.getVoices();
      const english = voices.find(voice => voice.lang && voice.lang.toLowerCase().startsWith("en"));
      if (english) utterance.voice = english;
      currentUtterance = utterance;
      speakingAvatar = avatar;
      utterance.onstart = () => { if (currentUtterance !== utterance) return; avatar.classList.add("epic-avatar--speaking"); setStatus("Speaking English narration."); };
      utterance.onend = () => { if (currentUtterance !== utterance) return; avatar.classList.remove("epic-avatar--speaking"); currentUtterance = null; speakingAvatar = null; setStatus("Narration complete."); };
      utterance.onerror = () => { if (currentUtterance !== utterance) return; avatar.classList.remove("epic-avatar--speaking"); currentUtterance = null; speakingAvatar = null; setStatus("Voice could not play. Read the transcript above."); };
      window.speechSynthesis.speak(utterance);
    });
    pause.addEventListener("click", () => {
      if (!currentUtterance) return;
      if (paused) { window.speechSynthesis.resume(); paused = false; pause.textContent = "Pause"; avatar.classList.add("epic-avatar--speaking"); setStatus("Speaking English narration."); }
      else { window.speechSynthesis.pause(); paused = true; pause.textContent = "Resume"; avatar.classList.remove("epic-avatar--speaking"); setStatus("Voice paused."); }
    });
    stop.addEventListener("click", () => { stopVoice(); pause.textContent = "Pause"; });
    action.addEventListener("click", () => {
      avatar.classList.remove("epic-avatar--signature");
      void avatar.offsetWidth;
      avatar.classList.add("epic-avatar--signature");
      setStatus(`${character.name} portrait illuminated.`);
      window.setTimeout(() => avatar.classList.remove("epic-avatar--signature"), 2400);
    });
    motion.addEventListener("click", () => {
      const still = avatar.classList.toggle("epic-avatar--still");
      motion.textContent = still ? "Resume animation" : "Pause animation";
    });
  }

  window.EpicAvatars = { render, observeCards, mountDossier, stopVoice, names: rows.map(row => row[0]) };
  window.addEventListener("beforeunload", stopVoice);
})();
