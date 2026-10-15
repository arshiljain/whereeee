// Spotify1 Branding Extension for Spicetify
// Dynamically personalizes window title and in-app header branding to 'Spotify1' without binary modifications.
(function spotify1Brand() {
  const BRAND_NAME = "Spotify1";

  function updateTitle() {
    try {
      const data = window.Spicetify?.Player?.data;
      if (data?.item?.metadata?.title) {
        const title = data.item.metadata.title;
        const artist = data.item.metadata.artist_name || "";
        document.title = `${BRAND_NAME} - ${title} ${artist ? "· " + artist : ""}`;
      } else {
        document.title = BRAND_NAME;
      }
    } catch {
      document.title = BRAND_NAME;
    }
  }

  function injectBrandBadge() {
    // Look for top bar navigation / logo area
    const topBar = document.querySelector(".main-topBar-container, header[data-testid='top-bar']");
    if (!topBar) return;

    if (!document.getElementById("spotify1-brand-indicator")) {
      const brandBadge = document.createElement("div");
      brandBadge.id = "spotify1-brand-indicator";
      brandBadge.className = "spotify1-brand-badge";
      brandBadge.innerHTML = `
        <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">
          <circle cx="12" cy="12" r="10"></circle>
          <path d="M8 12l8-5v10z" fill="currentColor"></path>
        </svg>
        <span>Spotify1</span>
      `;
      brandBadge.style.margin = "0 14px";
      brandBadge.style.cursor = "default";
      brandBadge.title = "Personalized Client";

      // Place after back/forward navigation buttons if present
      const navButtons = topBar.querySelector(".main-topBar-historyButtons, .main-topBar-navigation");
      if (navButtons && navButtons.parentNode) {
        navButtons.parentNode.insertBefore(brandBadge, navButtons.nextSibling);
      } else {
        topBar.prepend(brandBadge);
      }
    }
  }

  function init() {
    updateTitle();
    injectBrandBadge();

    // Listen to track changes
    if (window.Spicetify?.Player) {
      Spicetify.Player.addEventListener("songchange", updateTitle);
    }

    // Interval and MutationObserver to ensure title & badge stay robust across navigation
    setInterval(updateTitle, 2000);
    setInterval(injectBrandBadge, 3000);
  }

  const checkReady = setInterval(() => {
    if (window.Spicetify?.Player && document.body) {
      clearInterval(checkReady);
      init();
    }
  }, 400);
})();
