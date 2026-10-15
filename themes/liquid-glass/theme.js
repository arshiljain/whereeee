// Master Dynamic Color & Inline Style Injector for Liquid Glass
(function masterLiquidGlassTheme() {
  // 1. Force High-Precedence Styles via Inline <style>
  function injectRuntimeStyles() {
    if (document.getElementById("liquid-glass-runtime-override")) return;
    const style = document.createElement("style");
    style.id = "liquid-glass-runtime-override";
    style.textContent = `
      :root, html, body, .encore-dark-theme, .encore-layout-themes {
        --essential-bright-accent: #8B5CF6 !important;
        --text-bright-accent: #A855F7 !important;
        --essential-positive: #8B5CF6 !important;
        --background-base: #09090E !important;
        --background-highlight: #141322 !important;
        --background-elevated-base: #171626 !important;
      }
      button[data-testid="play-button"],
      .main-playPauseButton-button,
      [data-encore-id="buttonPrimary"],
      .encore-bright-accent-set {
        background: linear-gradient(135deg, #8B5CF6 0%, #D946EF 50%, #EC4899 100%) !important;
        color: #FFFFFF !important;
        box-shadow: 0 4px 18px rgba(139, 92, 246, 0.5) !important;
      }
      .Root__now-playing-bar {
        background: transparent !important;
      }
      .main-nowPlayingBar-container {
        border-radius: 22px !important;
        background: rgba(22, 20, 36, 0.85) !important;
        backdrop-filter: blur(32px) saturate(180%) !important;
        -webkit-backdrop-filter: blur(32px) saturate(180%) !important;
        box-shadow: 0 16px 44px rgba(0, 0, 0, 0.65) !important;
      }
    `;
    document.head.appendChild(style);
  }

  // 2. Dynamic Ambient Color Lighting
  let backdropEl = null;
  function initBackdrop() {
    if (document.getElementById("liquid-ambient-backdrop")) {
      backdropEl = document.getElementById("liquid-ambient-backdrop");
      return;
    }
    backdropEl = document.createElement("div");
    backdropEl.id = "liquid-ambient-backdrop";
    backdropEl.style.cssText = "position:fixed;inset:0;pointer-events:none;z-index:0;opacity:0.55;filter:blur(85px);transition:background 1.4s ease;";
    document.body.prepend(backdropEl);
  }

  function updateDynamicLighting() {
    if (!backdropEl) initBackdrop();
    if (!backdropEl) return;
    try {
      const item = window.Spicetify?.Player?.data?.item;
      const imgUrl = item?.metadata?.image_xlarge_url || item?.metadata?.image_url;
      if (imgUrl) {
        backdropEl.style.background = `
          radial-gradient(circle at 20% 20%, rgba(139, 92, 246, 0.4) 0%, transparent 60%),
          radial-gradient(circle at 80% 80%, rgba(236, 72, 153, 0.3) 0%, transparent 60%),
          radial-gradient(circle at 50% 50%, rgba(15, 15, 24, 0.85) 0%, #09090E 100%)
        `;
      } else {
        backdropEl.style.background = `
          radial-gradient(circle at 50% 15%, rgba(139, 92, 246, 0.35) 0%, transparent 70%),
          radial-gradient(circle at 50% 50%, #100E1C 0%, #09090E 100%)
        `;
      }
    } catch {}
  }

  function setup() {
    injectRuntimeStyles();
    initBackdrop();
    updateDynamicLighting();
    if (window.Spicetify?.Player) {
      Spicetify.Player.addEventListener("songchange", updateDynamicLighting);
    }
    setInterval(injectRuntimeStyles, 3000);
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", setup);
  } else {
    setup();
  }
})();
