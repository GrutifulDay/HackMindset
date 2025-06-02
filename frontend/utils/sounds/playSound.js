export function playSound(filename) {
    const path = `frontend/assets/sounds/${filename}`;
    const audio = new Audio(chrome.runtime.getURL(path));
    audio.play();
}

let currentAudio = null;

export function toggleSound(filename, soundIcon) {
  if (!currentAudio || currentAudio.paused) {
    currentAudio = new Audio(chrome.runtime.getURL(`assets/sounds/${filename}`));
    currentAudio.play();
    soundIcon.textContent = "🔇";

    currentAudio.addEventListener("ended", () => {
      soundIcon.textContent = "📢";
      currentAudio = null;
    });
  } else {
    currentAudio.pause();
    currentAudio.currentTime = 0;
    soundIcon.textContent = "📢";
    currentAudio = null;
  }
}
