// Lyrics Overlay Extension for Spicetify
// Toggles a floating Liquid Glass lyrics HUD overlay for the currently playing track.
(function lyricsOverlayExtension() {
  let isOverlayOpen = false;

  function toggleLyricsOverlay() {
    // If Spotify has a native lyrics button, trigger that view or display our floating glass HUD
    const nativeLyricsBtn = document.querySelector(".main-nowPlayingBar-right [data-testid='lyrics-button'], button[aria-label*='Lyrics'], button[aria-label*='lyrics']");
    if (nativeLyricsBtn) {
      nativeLyricsBtn.click();
      window.Spicetify?.showNotification("🎤 Toggled Lyrics View");
      return;
    }

    // Floating Glass HUD fallback
    const existing = document.getElementById("liquid-lyrics-hud");
    if (existing) {
      existing.remove();
      isOverlayOpen = false;
      return;
    }

    const currentItem = window.Spicetify?.Player?.data?.item?.metadata;
    const title = currentItem?.title || "No Track";
    const artist = currentItem?.artist_name || "Unknown Artist";
    const albumImg = currentItem?.image_xlarge_url || currentItem?.image_url || "";

    const hud = document.createElement("div");
    hud.id = "liquid-lyrics-hud";
    hud.innerHTML = `
      <style>
        #liquid-lyrics-hud {
          position: fixed;
          bottom: 110px;
          right: 24px;
          width: 320px;
          max-height: 440px;
          z-index: 9998;
          background: rgba(18, 18, 28, 0.82);
          backdrop-filter: blur(28px) saturate(180%);
          -webkit-backdrop-filter: blur(28px);
          border: 1px solid rgba(255, 255, 255, 0.12);
          border-radius: 20px;
          padding: 18px;
          box-shadow: 0 16px 40px rgba(0, 0, 0, 0.6), 0 0 20px rgba(139, 92, 246, 0.2);
          color: #FFF;
          font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
          display: flex;
          flex-direction: column;
          gap: 12px;
          animation: hudSlide 0.2s cubic-bezier(0.16, 1, 0.3, 1);
        }
        @keyframes hudSlide {
          from { opacity: 0; transform: translateY(12px) scale(0.96); }
          to { opacity: 1; transform: translateY(0) scale(1); }
        }
        .hud-header {
          display: flex;
          align-items: center;
          justify-content: space-between;
        }
        .hud-track-info {
          display: flex;
          align-items: center;
          gap: 10px;
        }
        .hud-art {
          width: 44px;
          height: 44px;
          border-radius: 8px;
          object-fit: cover;
          box-shadow: 0 4px 12px rgba(0, 0, 0, 0.4);
        }
        .hud-meta-title {
          font-size: 13px;
          font-weight: 700;
          color: #FFFFFF;
          max-width: 190px;
          overflow: hidden;
          text-overflow: ellipsis;
          white-space: nowrap;
        }
        .hud-meta-artist {
          font-size: 11px;
          color: #A78BFA;
        }
        .hud-close-btn {
          background: transparent;
          border: none;
          color: #94A3B8;
          cursor: pointer;
          font-size: 16px;
          padding: 4px;
        }
        .hud-close-btn:hover {
          color: #FFFFFF;
        }
        .hud-body {
          flex: 1;
          overflow-y: auto;
          text-align: center;
          padding: 10px 4px;
          font-size: 14px;
          line-height: 1.8;
          color: rgba(255, 255, 255, 0.85);
          font-weight: 600;
        }
        .hud-body .hint {
          font-size: 12px;
          color: #94A3B8;
          font-weight: 400;
          margin-top: 14px;
        }
      </style>
      <div class="hud-header">
        <div class="hud-track-info">
          ${albumImg ? `<img src="${albumImg}" class="hud-art" alt="Art"/>` : ""}
          <div>
            <div class="hud-meta-title">${title}</div>
            <div class="hud-meta-artist">${artist}</div>
          </div>
        </div>
        <button class="hud-close-btn" id="btn-close-hud">✕</button>
      </div>
      <div class="hud-body">
        <div>🎤 Lyrics HUD Active</div>
        <div class="hint">Press <kbd>Ctrl+Shift+Y</kbd> or click the mic button anytime to toggle the full synced lyrics panel.</div>
      </div>
    `;

    document.body.appendChild(hud);
    isOverlayOpen = true;

    hud.querySelector("#btn-close-hud")?.addEventListener("click", () => {
      hud.remove();
      isOverlayOpen = false;
    });
  }

  function injectLyricsButton() {
    if (document.getElementById("liquid-lyrics-btn")) return;

    const btn = document.createElement("button");
    btn.id = "liquid-lyrics-btn";
    btn.innerHTML = `<span>🎤 Lyrics</span>`;
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

    btn.addEventListener("click", toggleLyricsOverlay);

    const topBar = document.querySelector(".main-topBar-container, header[data-testid='top-bar']");
    if (topBar) {
      topBar.appendChild(btn);
    }
  }

  function handleKeyDown(e) {
    if ((e.ctrlKey || e.metaKey) && e.shiftKey && e.key.toLowerCase() === "y") {
      e.preventDefault();
      toggleLyricsOverlay();
    }
  }

  function init() {
    injectLyricsButton();
    setInterval(injectLyricsButton, 4000);
    window.addEventListener("keydown", handleKeyDown);
  }

  const checkReady = setInterval(() => {
    if (window.Spicetify?.Player && document.body) {
      clearInterval(checkReady);
      init();
    }
  }, 400);
})();
