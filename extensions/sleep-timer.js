// Sleep Timer Extension for Spicetify
// Allows scheduling music to automatically stop after a designated duration or at track end.
(function sleepTimerExtension() {
  let timerId = null;
  let remainingSeconds = 0;
  let stopAtTrackEnd = false;
  let topBarButton = null;

  function formatTime(secs) {
    const m = Math.floor(secs / 60);
    const s = secs % 60;
    return `${m}:${s < 10 ? "0" : ""}${s}`;
  }

  function updateButtonLabel() {
    if (!topBarButton) return;
    const labelSpan = topBarButton.querySelector(".timer-label");
    if (!labelSpan) return;

    if (stopAtTrackEnd) {
      labelSpan.textContent = "🌙 End of Track";
      topBarButton.classList.add("active");
    } else if (remainingSeconds > 0) {
      labelSpan.textContent = `🌙 ${formatTime(remainingSeconds)}`;
      topBarButton.classList.add("active");
    } else {
      labelSpan.textContent = "🌙 Sleep Timer";
      topBarButton.classList.remove("active");
    }
  }

  function startTimer(minutes) {
    cancelTimer();
    stopAtTrackEnd = false;
    remainingSeconds = minutes * 60;
    updateButtonLabel();
    window.Spicetify?.showNotification(`🌙 Sleep timer set for ${minutes} minutes`);

    timerId = setInterval(() => {
      remainingSeconds--;
      updateButtonLabel();

      if (remainingSeconds <= 0) {
        cancelTimer();
        if (window.Spicetify?.Player?.pause) {
          window.Spicetify.Player.pause();
        }
        window.Spicetify?.showNotification("🌙 Sleep timer complete. Playback paused.");
      }
    }, 1000);
  }

  function setEndOfTrack() {
    cancelTimer();
    stopAtTrackEnd = true;
    updateButtonLabel();
    window.Spicetify?.showNotification("🌙 Playback will pause at the end of this track");

    const onSongChange = () => {
      if (stopAtTrackEnd) {
        cancelTimer();
        if (window.Spicetify?.Player?.pause) {
          window.Spicetify.Player.pause();
        }
        window.Spicetify?.showNotification("🌙 Track finished. Playback paused.");
      }
    };

    if (window.Spicetify?.Player) {
      Spicetify.Player.addEventListener("songchange", onSongChange);
    }
  }

  function cancelTimer() {
    if (timerId) {
      clearInterval(timerId);
      timerId = null;
    }
    remainingSeconds = 0;
    stopAtTrackEnd = false;
    updateButtonLabel();
  }

  function openTimerModal() {
    const existingModal = document.getElementById("liquid-sleep-timer-modal");
    if (existingModal) {
      existingModal.remove();
      return;
    }

    const modal = document.createElement("div");
    modal.id = "liquid-sleep-timer-modal";
    modal.innerHTML = `
      <style>
        #liquid-sleep-timer-modal {
          position: fixed;
          top: 70px;
          right: 90px;
          z-index: 9999;
          background: rgba(22, 22, 34, 0.85);
          backdrop-filter: blur(28px) saturate(180%);
          -webkit-backdrop-filter: blur(28px);
          border: 1px solid rgba(255, 255, 255, 0.12);
          border-radius: 18px;
          padding: 16px 20px;
          box-shadow: 0 16px 48px rgba(0, 0, 0, 0.6), 0 0 20px rgba(139, 92, 246, 0.2);
          color: #fff;
          font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
          width: 250px;
          animation: modalFadeIn 0.2s cubic-bezier(0.16, 1, 0.3, 1);
        }
        @keyframes modalFadeIn {
          from { opacity: 0; transform: translateY(-8px) scale(0.96); }
          to { opacity: 1; transform: translateY(0) scale(1); }
        }
        #liquid-sleep-timer-modal h3 {
          margin: 0 0 12px 0;
          font-size: 15px;
          font-weight: 700;
          display: flex;
          align-items: center;
          gap: 8px;
        }
        .timer-options {
          display: flex;
          flex-direction: column;
          gap: 8px;
        }
        .timer-btn {
          background: rgba(255, 255, 255, 0.06);
          border: 1px solid rgba(255, 255, 255, 0.08);
          color: #E2E8F0;
          padding: 8px 12px;
          border-radius: 10px;
          cursor: pointer;
          font-size: 13px;
          font-weight: 500;
          text-align: left;
          transition: all 0.2s ease;
        }
        .timer-btn:hover {
          background: rgba(139, 92, 246, 0.25);
          border-color: rgba(139, 92, 246, 0.5);
          transform: translateX(4px);
          color: #FFFFFF;
        }
        .timer-btn.cancel {
          background: rgba(239, 68, 68, 0.15);
          border-color: rgba(239, 68, 68, 0.3);
          color: #FCA5A5;
        }
        .timer-btn.cancel:hover {
          background: rgba(239, 68, 68, 0.3);
        }
      </style>
      <h3>🌙 Sleep Timer</h3>
      <div class="timer-options">
        <button class="timer-btn" data-time="15">⏱️ 15 Minutes</button>
        <button class="timer-btn" data-time="30">⏱️ 30 Minutes</button>
        <button class="timer-btn" data-time="45">⏱️ 45 Minutes</button>
        <button class="timer-btn" data-time="60">⏱️ 1 Hour</button>
        <button class="timer-btn" data-time="end">🎵 End of this track</button>
        ${remainingSeconds > 0 || stopAtTrackEnd ? '<button class="timer-btn cancel" data-time="cancel">❌ Turn Off Timer</button>' : ''}
      </div>
    `;

    document.body.appendChild(modal);

    modal.querySelectorAll(".timer-btn").forEach((btn) => {
      btn.addEventListener("click", () => {
        const time = btn.getAttribute("data-time");
        if (time === "end") {
          setEndOfTrack();
        } else if (time === "cancel") {
          cancelTimer();
          window.Spicetify?.showNotification("🌙 Sleep timer cancelled");
        } else {
          startTimer(parseInt(time, 10));
        }
        modal.remove();
      });
    });

    const closeOnClickOutside = (e) => {
      if (!modal.contains(e.target) && !topBarButton.contains(e.target)) {
        modal.remove();
        document.removeEventListener("click", closeOnClickOutside);
      }
    };
    setTimeout(() => document.addEventListener("click", closeOnClickOutside), 10);
  }

  function injectTopBarButton() {
    if (document.getElementById("liquid-sleep-timer-btn")) return;

    if (window.Spicetify?.Topbar?.Button) {
      topBarButton = new Spicetify.Topbar.Button("Sleep Timer", "sleep", openTimerModal).element;
      topBarButton.id = "liquid-sleep-timer-btn";
      topBarButton.innerHTML = `<span class="timer-label">🌙 Sleep Timer</span>`;
      styleButton(topBarButton);
    } else {
      // Fallback injection into top bar
      const topBarRight = document.querySelector(".main-topBar-container, header[data-testid='top-bar']");
      if (topBarRight) {
        topBarButton = document.createElement("button");
        topBarButton.id = "liquid-sleep-timer-btn";
        topBarButton.innerHTML = `<span class="timer-label">🌙 Sleep Timer</span>`;
        styleButton(topBarButton);
        topBarButton.addEventListener("click", openTimerModal);
        topBarRight.appendChild(topBarButton);
      }
    }
  }

  function styleButton(btn) {
    btn.style.background = "rgba(255, 255, 255, 0.08)";
    btn.style.border = "1px solid rgba(255, 255, 255, 0.12)";
    btn.style.borderRadius = "999px";
    btn.style.padding = "5px 12px";
    btn.style.color = "#FFFFFF";
    btn.style.fontSize = "12px";
    btn.style.fontWeight = "600";
    btn.style.cursor = "pointer";
    btn.style.backdropFilter = "blur(12px)";
    btn.style.transition = "all 0.2s ease";
    btn.style.margin = "0 6px";
  }

  function init() {
    injectTopBarButton();
    setInterval(injectTopBarButton, 4000);
  }

  const checkReady = setInterval(() => {
    if (window.Spicetify?.Player && document.body) {
      clearInterval(checkReady);
      init();
    }
  }, 400);
})();
