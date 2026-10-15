// Listening Stats Panel Extension for Spicetify
// Tracks daily and session listening statistics and renders a beautiful Liquid Glass modal.
(function listeningStatsExtension() {
  const STORAGE_KEY = "spotify1:listening_stats";

  function getTodayKey() {
    return new Date().toISOString().slice(0, 10);
  }

  function loadStats() {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      const parsed = raw ? JSON.parse(raw) : {};
      const today = getTodayKey();
      if (!parsed[today]) {
        parsed[today] = { seconds: 0, tracks: 0, skips: 0 };
      }
      return parsed;
    } catch {
      return { [getTodayKey()]: { seconds: 0, tracks: 0, skips: 0 } };
    }
  }

  function saveStats(stats) {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(stats));
    } catch (e) {
      console.warn("[ListeningStats] Failed to persist stats:", e);
    }
  }

  function formatDuration(totalSeconds) {
    const hours = Math.floor(totalSeconds / 3600);
    const minutes = Math.floor((totalSeconds % 3600) / 60);
    const seconds = totalSeconds % 60;
    if (hours > 0) return `${hours}h ${minutes}m`;
    if (minutes > 0) return `${minutes}m ${seconds}s`;
    return `${seconds}s`;
  }

  let sessionSeconds = 0;
  setInterval(() => {
    if (window.Spicetify?.Player?.isPlaying()) {
      sessionSeconds++;
      const stats = loadStats();
      const today = getTodayKey();
      stats[today].seconds++;
      saveStats(stats);
    }
  }, 1000);

  function openStatsModal() {
    const existing = document.getElementById("liquid-stats-modal");
    if (existing) {
      existing.remove();
      return;
    }

    const stats = loadStats();
    const today = getTodayKey();
    const todayStats = stats[today] || { seconds: 0, tracks: 0, skips: 0 };
    const currentItem = window.Spicetify?.Player?.data?.item?.metadata;

    const modal = document.createElement("div");
    modal.id = "liquid-stats-modal";
    modal.innerHTML = `
      <style>
        #liquid-stats-modal {
          position: fixed;
          top: 70px;
          right: 210px;
          z-index: 9999;
          background: rgba(20, 20, 32, 0.88);
          backdrop-filter: blur(30px) saturate(190%);
          -webkit-backdrop-filter: blur(30px);
          border: 1px solid rgba(255, 255, 255, 0.12);
          border-radius: 20px;
          padding: 20px 24px;
          box-shadow: 0 20px 50px rgba(0, 0, 0, 0.65), 0 0 24px rgba(139, 92, 246, 0.25);
          color: #FFF;
          font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
          width: 290px;
          animation: statsIn 0.22s cubic-bezier(0.16, 1, 0.3, 1);
        }
        @keyframes statsIn {
          from { opacity: 0; transform: translateY(-10px) scale(0.95); }
          to { opacity: 1; transform: translateY(0) scale(1); }
        }
        .stats-header {
          display: flex;
          align-items: center;
          justify-content: space-between;
          margin-bottom: 16px;
        }
        .stats-title {
          font-size: 16px;
          font-weight: 700;
          display: flex;
          align-items: center;
          gap: 8px;
        }
        .stats-grid {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 10px;
          margin-bottom: 16px;
        }
        .stat-card {
          background: rgba(255, 255, 255, 0.05);
          border: 1px solid rgba(255, 255, 255, 0.08);
          border-radius: 14px;
          padding: 12px;
          text-align: center;
        }
        .stat-val {
          font-size: 18px;
          font-weight: 700;
          color: #C084FC;
          margin-bottom: 2px;
        }
        .stat-lbl {
          font-size: 11px;
          color: #94A3B8;
          text-transform: uppercase;
          letter-spacing: 0.5px;
        }
        .now-playing-box {
          background: rgba(139, 92, 246, 0.1);
          border: 1px solid rgba(139, 92, 246, 0.25);
          border-radius: 12px;
          padding: 10px 12px;
          margin-bottom: 12px;
          font-size: 12px;
        }
        .now-title {
          font-weight: 600;
          color: #FFFFFF;
          white-space: nowrap;
          overflow: hidden;
          text-overflow: ellipsis;
        }
        .now-artist {
          color: #A78BFA;
          font-size: 11px;
        }
        .reset-stats-btn {
          width: 100%;
          background: rgba(255, 255, 255, 0.05);
          border: 1px solid rgba(255, 255, 255, 0.08);
          color: #94A3B8;
          padding: 6px;
          border-radius: 8px;
          font-size: 11px;
          cursor: pointer;
          transition: background 0.2s;
        }
        .reset-stats-btn:hover {
          background: rgba(239, 68, 68, 0.2);
          color: #F87171;
        }
      </style>
      <div class="stats-header">
        <span class="stats-title">📊 Listening Stats</span>
        <span style="font-size: 11px; color: #94A3B8;">Today</span>
      </div>
      <div class="stats-grid">
        <div class="stat-card">
          <div class="stat-val">${formatDuration(todayStats.seconds)}</div>
          <div class="stat-lbl">Time Listened</div>
        </div>
        <div class="stat-card">
          <div class="stat-val">${todayStats.tracks}</div>
          <div class="stat-lbl">Songs Played</div>
        </div>
        <div class="stat-card">
          <div class="stat-val">${formatDuration(sessionSeconds)}</div>
          <div class="stat-lbl">Session Time</div>
        </div>
        <div class="stat-card">
          <div class="stat-val">${todayStats.skips}</div>
          <div class="stat-lbl">Skips</div>
        </div>
      </div>
      ${currentItem ? `
        <div class="now-playing-box">
          <div class="now-title">🎵 ${currentItem.title || "No track title"}</div>
          <div class="now-artist">${currentItem.artist_name || ""}</div>
        </div>
      ` : ""}
      <button class="reset-stats-btn" id="btn-reset-stats">Reset Today's Stats</button>
    `;

    document.body.appendChild(modal);

    modal.querySelector("#btn-reset-stats")?.addEventListener("click", () => {
      const s = loadStats();
      s[today] = { seconds: 0, tracks: 0, skips: 0 };
      sessionSeconds = 0;
      saveStats(s);
      window.Spicetify?.showNotification("📊 Stats reset for today");
      modal.remove();
    });

    const closeOnClickOutside = (e) => {
      const topBtn = document.getElementById("liquid-stats-btn");
      if (!modal.contains(e.target) && (!topBtn || !topBtn.contains(e.target))) {
        modal.remove();
        document.removeEventListener("click", closeOnClickOutside);
      }
    };
    setTimeout(() => document.addEventListener("click", closeOnClickOutside), 10);
  }

  function injectStatsButton() {
    if (document.getElementById("liquid-stats-btn")) return;

    const btn = document.createElement("button");
    btn.id = "liquid-stats-btn";
    btn.innerHTML = `<span>📊 Stats</span>`;
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

    btn.addEventListener("click", openStatsModal);

    const topBar = document.querySelector(".main-topBar-container, header[data-testid='top-bar']");
    if (topBar) {
      topBar.appendChild(btn);
    }
  }

  function init() {
    injectStatsButton();
    setInterval(injectStatsButton, 4000);

    // Track track changes and count songs
    if (window.Spicetify?.Player) {
      Spicetify.Player.addEventListener("songchange", () => {
        const stats = loadStats();
        const today = getTodayKey();
        stats[today].tracks++;
        saveStats(stats);
      });
    }
  }

  const checkReady = setInterval(() => {
    if (window.Spicetify?.Player && document.body) {
      clearInterval(checkReady);
      init();
    }
  }, 400);
})();
