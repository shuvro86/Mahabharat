(function () {
  const story = "On the tenth day of the Kurukshetra war, Shikhandi advances before Arjuna. Bound by his vow, Bhishma lowers his bow. Arjuna releases his arrows, and the grandsire falls upon a bed of arrows. His fall changes the course of the war, while Bhishma remains alive and chooses the time of his final departure.";

  const video = function () { return document.getElementById("hall-frame-video"); };
  const videoButton = function () { return document.getElementById("hof-video-toggle"); };
  const resetVideoButton = function () {
    const button = videoButton();
    const label = document.getElementById("hof-video-label");
    if (!button || !label) return;
    const playing = video() && !video().paused && !video().ended;
    label.textContent = playing ? "Pause cinematic scene" : "Play cinematic scene";
    button.setAttribute("aria-pressed", playing ? "true" : "false");
    button.querySelector("i").className = playing ? "fa-solid fa-pause mr-2" : "fa-solid fa-play mr-2";
  };

  window.hallFrameToggleVideo = async function () {
    const scene = video();
    if (!scene) return;
    if (scene.paused || scene.ended) {
      if (scene.ended) scene.currentTime = 0;
      try { await scene.play(); } catch (_) {
        document.getElementById("hof-speech-status").textContent = "The scene could not start. Try again or use Download MP4.";
      }
    } else {
      scene.pause();
    }
    resetVideoButton();
  };

  document.addEventListener("DOMContentLoaded", function () {
    const scene = video();
    if (!scene) return;
    ["play", "pause", "ended"].forEach(function (eventName) {
      scene.addEventListener(eventName, resetVideoButton);
    });
  });

  window.hallFrameStopScene = function () {
    const scene = video();
    if (scene && !scene.paused) scene.pause();
    resetVideoButton();
  };

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
