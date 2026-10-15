// Master Dynamic Color & Ambient Liquid Lighting (Inspired by Apple Music & spoti.pw)
(function masterLiquidGlassTheme() {
  let backdropEl = null;

  function initBackdrop() {
    if (document.getElementById("liquid-ambient-backdrop")) {
      backdropEl = document.getElementById("liquid-ambient-backdrop");
      return;
    }
    backdropEl = document.createElement("div");
    backdropEl.id = "liquid-ambient-backdrop";
    document.body.prepend(backdropEl);
  }

  // Sample album image to extract vibrant primary and secondary colors
  function extractAlbumColors(imgUrl, callback) {
    if (!imgUrl) {
      callback([139, 92, 246], [236, 72, 153]);
      return;
    }

    const img = new Image();
    img.crossOrigin = "Anonymous";
    img.src = imgUrl;

    img.onload = () => {
      try {
        const canvas = document.createElement("canvas");
        const ctx = canvas.getContext("2d");
        const w = 40;
        const h = 40;
        canvas.width = w;
        canvas.height = h;
        ctx.drawImage(img, 0, 0, w, h);

        const data = ctx.getImageData(0, 0, w, h).data;
        let r1 = 0, g1 = 0, b1 = 0;
        let r2 = 0, g2 = 0, b2 = 0;
        let count1 = 0, count2 = 0;

        for (let i = 0; i < data.length; i += 16) {
          const r = data[i];
          const g = data[i + 1];
          const b = data[i + 2];

          // Filter out extreme blacks, whites, and low saturation
          const max = Math.max(r, g, b);
          const min = Math.min(r, g, b);
          const sat = max === 0 ? 0 : (max - min) / max;

          if (max > 40 && min < 225 && sat > 0.15) {
            if (count1 <= count2) {
              r1 += r; g1 += g; b1 += b;
              count1++;
            } else {
              r2 += r; g2 += g; b2 += b;
              count2++;
            }
          }
        }

        if (count1 > 0 && count2 > 0) {
          const c1 = [Math.round(r1 / count1), Math.round(g1 / count1), Math.round(b1 / count1)];
          const c2 = [Math.round(r2 / count2), Math.round(g2 / count2), Math.round(b2 / count2)];
          callback(c1, c2);
        } else {
          callback([139, 92, 246], [236, 72, 153]);
        }
      } catch {
        callback([139, 92, 246], [236, 72, 153]);
      }
    };

    img.onerror = () => {
      callback([139, 92, 246], [236, 72, 153]);
    };
  }

  function updateDynamicLighting() {
    if (!backdropEl) initBackdrop();
    if (!backdropEl) return;

    try {
      const item = window.Spicetify?.Player?.data?.item;
      const imgUrl = item?.metadata?.image_xlarge_url || item?.metadata?.image_url;

      extractAlbumColors(imgUrl, (c1, c2) => {
        backdropEl.style.background = `
          radial-gradient(circle at 18% 22%, rgba(${c1[0]}, ${c1[1]}, ${c1[2]}, 0.38) 0%, transparent 60%),
          radial-gradient(circle at 82% 78%, rgba(${c2[0]}, ${c2[1]}, ${c2[2]}, 0.32) 0%, transparent 60%),
          radial-gradient(circle at 50% 50%, rgba(15, 15, 24, 0.88) 0%, #09090E 100%)
        `;
      });
    } catch (e) {
      console.warn("[LiquidGlass] Dynamic lighting update:", e);
    }
  }

  function setup() {
    initBackdrop();
    updateDynamicLighting();

    if (window.Spicetify?.Player) {
      Spicetify.Player.addEventListener("songchange", updateDynamicLighting);
    } else {
      const poll = setInterval(() => {
        if (window.Spicetify?.Player) {
          clearInterval(poll);
          Spicetify.Player.addEventListener("songchange", updateDynamicLighting);
          updateDynamicLighting();
        }
      }, 500);
    }
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", setup);
  } else {
    setup();
  }
})();
