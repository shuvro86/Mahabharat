(function () {
  const story = "On the tenth day of the Kurukshetra war, Shikhandi advances before Arjuna. Bound by his vow, Bhishma lowers his bow. Arjuna releases his arrows, and the grandsire falls upon a bed of arrows. His fall changes the course of the war, while Bhishma remains alive and chooses the time of his final departure.";

  window.hallFrameReadStory = function () {
    if (!("speechSynthesis" in window)) {
      document.getElementById("hof-speech-status").textContent = "Narration is not available in this browser. You can read the story above.";
      return;
    }
    window.speechSynthesis.cancel();
    const line = new SpeechSynthesisUtterance(story);
    line.lang = "en-IN";
    line.rate = 0.92;
    line.onend = function () { document.getElementById("hof-read-label").textContent = "Hear the moment"; };
    line.onerror = function () { document.getElementById("hof-read-label").textContent = "Hear the moment"; };
    document.getElementById("hof-read-label").textContent = "Narrating…";
    window.speechSynthesis.speak(line);
  };

  window.hallFrameStopStory = function () {
    if ("speechSynthesis" in window) window.speechSynthesis.cancel();
    const label = document.getElementById("hof-read-label");
    if (label) label.textContent = "Hear the moment";
  };

  window.hallFrameFindCharacter = function (name) {
    if (typeof switchTab === "function") switchTab("characters");
    const search = document.getElementById("character-search");
    if (search) {
      search.value = name;
      if (typeof fetchCharacters === "function") fetchCharacters();
    }
  };

  window.hallFrameCopyPrompt = async function () {
    const prompt = document.getElementById("hall-frame-prompt").textContent.trim();
    const status = document.getElementById("hof-copy-status");
    try {
      await navigator.clipboard.writeText(prompt);
      status.textContent = "Prompt copied.";
    } catch (_) {
      status.textContent = "Select and copy the prompt text above.";
    }
  };
})();
