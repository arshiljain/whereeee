// Liquid Glass dynamic ambient lighting (Inspired by spoti.pw)
(function liquidGlassTheme() {
  function initAmbientBackdrop() {
    if (document.getElementById("liquid-ambient-backdrop")) return;
    const backdrop = document.createElement("div");
    backdrop.id = "liquid-ambient-backdrop";
    document.body.prepend(backdrop);

    function updateAmbientColor() {
      try {
        const item = Spicetify.Player.data?.item;
        if (!item) {
          backdrop.style.background = "radial-gradient(circle at 50% 20%, rgba(99, 102, 241, 0.25) 0%, transparent 65%)";
          return;
        }

        // Generate ambient color based on metadata or fallback to soothing purple/violet hue
        const albumImg = item.metadata?.image_url || item.metadata?.image_xlarge_url;
        if (albumImg) {
          backdrop.style.background = `radial-gradient(circle at 50% 15%, rgba(139, 92, 246, 0.35) 0%, rgba(79, 70, 229, 0.2) 40%, transparent 75%)`;
        } else {
          backdrop.style.background = `radial-gradient(circle at 50% 15%, rgba(139, 92, 246, 0.3) 0%, transparent 70%)`;
        }
      } catch (err) {
        console.warn("[LiquidGlass] Ambient color update error:", err);
      }
    }

    if (window.Spicetify?.Player) {
      Spicetify.Player.addEventListener("songchange", updateAmbientColor);
      updateAmbientColor();
    } else {
      const checkInterval = setInterval(() => {
        if (window.Spicetify?.Player) {
          clearInterval(checkInterval);
          Spicetify.Player.addEventListener("songchange", updateAmbientColor);
          updateAmbientColor();
        }
      }, 500);
    }
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", initAmbientBackdrop);
  } else {
    initAmbientBackdrop();
  }
})();
