// Liquid Shortcuts Extension for Spicetify
// Adds global customizable shortcuts for skip, like, shuffle, and playback control with on-screen feedback.
(function liquidShortcuts() {
  function isInputFocused() {
    const active = document.activeElement;
    if (!active) return false;
    const tag = active.tagName.toLowerCase();
    return tag === "input" || tag === "textarea" || active.isContentEditable;
  }

  function handleKeyDown(event) {
    if (isInputFocused()) return;

    const ctrlOrCmd = event.ctrlKey || event.metaKey;
    const shift = event.shiftKey;
    const alt = event.altKey;

    // Skip Next: Ctrl + Shift + ArrowRight OR Alt + J
    if ((ctrlOrCmd && shift && event.key === "ArrowRight") || (alt && event.key.toLowerCase() === "j")) {
      event.preventDefault();
      if (window.Spicetify?.Player?.next) {
        Spicetify.Player.next();
      } else if (window.Spicetify?.Player?.playNext) {
        Spicetify.Player.playNext();
      }
      window.Spicetify?.showNotification("⏭️ Skipped to next track");
      return;
    }

    // Skip Previous: Ctrl + Shift + ArrowLeft OR Alt + K
    if ((ctrlOrCmd && shift && event.key === "ArrowLeft") || (alt && event.key.toLowerCase() === "k")) {
      event.preventDefault();
      if (window.Spicetify?.Player?.back) {
        Spicetify.Player.back();
      } else if (window.Spicetify?.Player?.playPrev) {
        Spicetify.Player.playPrev();
      }
      window.Spicetify?.showNotification("⏮️ Returned to previous track");
      return;
    }

    // Toggle Shuffle: Ctrl + Shift + S OR Alt + S
    if ((ctrlOrCmd && shift && event.key.toLowerCase() === "s") || (alt && event.key.toLowerCase() === "s")) {
      event.preventDefault();
      if (window.Spicetify?.Player?.toggleShuffle) {
        Spicetify.Player.toggleShuffle();
        const isShuffle = Spicetify.Player.data?.shuffle;
        window.Spicetify?.showNotification(isShuffle ? "🔀 Shuffle: Off" : "🔀 Shuffle: On");
      }
      return;
    }

    // Toggle Like / Favorite: Ctrl + Shift + L OR Alt + L
    if ((ctrlOrCmd && shift && event.key.toLowerCase() === "l") || (alt && event.key.toLowerCase() === "l")) {
      event.preventDefault();
      if (window.Spicetify?.Player?.toggleHeart) {
        Spicetify.Player.toggleHeart();
        window.Spicetify?.showNotification("❤️ Toggled favorite for current track");
      } else {
        // Fallback: click like button in bottom player
        const likeBtn = document.querySelector(".main-nowPlayingBar-left [data-testid='add-button']");
        if (likeBtn) {
          likeBtn.click();
          window.Spicetify?.showNotification("❤️ Toggled favorite");
        }
      }
      return;
    }

    // Play/Pause shortcut: Alt + Space
    if (alt && event.code === "Space") {
      event.preventDefault();
      if (window.Spicetify?.Player?.togglePlay) {
        Spicetify.Player.togglePlay();
        const isPlaying = Spicetify.Player.isPlaying();
        window.Spicetify?.showNotification(isPlaying ? "⏸️ Paused" : "▶️ Playing");
      }
    }
  }

  function init() {
    window.addEventListener("keydown", handleKeyDown, true);
    console.log("[LiquidShortcuts] Keyboard shortcuts registered: Ctrl+Shift+Right (Skip), Ctrl+Shift+Left (Prev), Ctrl+Shift+S (Shuffle), Ctrl+Shift+L (Like).");
  }

  const checkReady = setInterval(() => {
    if (window.Spicetify?.Player) {
      clearInterval(checkReady);
      init();
    }
  }, 400);
})();
