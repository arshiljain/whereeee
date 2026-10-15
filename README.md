# Spotify1: Liquid Glass UI & Productivity Suite

<div align="center">

**A translucent, acrylic glassmorphism interface and personal productivity suite for the Spotify Desktop client.**

Inspired by the Apple Music live canvas aesthetic and iOS/macOS Liquid Glass design.

</div>

---

## Overview

**Spotify1** transforms the desktop listening experience with deep obsidian surfaces, real-time Gaussian frosted glass blurs, ambient mesh backdrops that dynamically sample your active album artwork, and a built-in suite of workflow extensions.

### Core Highlights

- **Frosted Acrylic Surfaces**: Multi-layer translucent blur (`backdrop-filter: blur(36px) saturate(190%)`) across navigation sidebars, viewports, and modals.
- **Floating Capsule Dock**: Detached, rounded bottom player dock with ambient neon glow and glass borders.
- **Dynamic Mesh Lighting**: Canvas-driven background lighting that samples live album art colors on track change.
- **Reimagined Controls**: Radiant gradient action buttons, custom glowing seekbar, and pill search inputs.
- **Full Extension Suite**: Instant shortcuts, sleep timer, listening statistics dashboard, lyrics HUD, and personalized branding.

---

## Features

### 1. Liquid Glass Theme
- **Obsidian & Frosted Glass Palette**: Deep dark base (`#09090E`) contrasted with translucent acrylic overlays.
- **Encore System Alignment**: Direct mapping across all modern desktop UI variables, replacing legacy green accents with radiant purple/magenta gradients.
- **Interactive Micro-Animations**: Smooth 3D card elevation, hover scaling, and transition timing.

### 2. Built-in Extensions
| Extension | Key Features | Activation |
| :--- | :--- | :--- |
| **`spotify1-brand.js`** | Updates window title to `Spotify1 - Track · Artist` and injects glass header branding badge | Automatic |
| **`liquid-shortcuts.js`** | Global keyboard controls for playback, track navigation, shuffle, and favorites | Keyboard |
| **`sleep-timer.js`** | Integrated timer (15m, 30m, 45m, 60m, or end of track) with real-time countdown badge | Top bar `🌙` |
| **`listening-stats.js`** | Daily & session metrics dashboard (total time, track counts, skips) | Top bar `📊` |
| **`lyrics-overlay.js`** | Floating frosted-glass lyrics HUD and quick-toggle | `Ctrl+Shift+Y` or Top bar `🎤` |

---

## Keyboard Shortcuts

| Shortcut | Action |
| :--- | :--- |
| `Ctrl + Shift + →` / `Alt + J` | Skip to next track |
| `Ctrl + Shift + ←` / `Alt + K` | Return to previous track |
| `Ctrl + Shift + S` / `Alt + S` | Toggle shuffle |
| `Ctrl + Shift + L` / `Alt + L` | Toggle favorite / like track |
| `Alt + Space` | Play / pause |
| `Ctrl + Shift + Y` | Toggle lyrics HUD |

---

## Installation & Setup Guide

### Prerequisites
1. **Spotify Desktop**: Official standalone Windows desktop application installed at `%APPDATA%\Spotify` *(not the Microsoft Store package)*.
2. **Injection Runtime**: The client uses the [Spicetify](https://spicetify.app) injection CLI to safely apply theme CSS and extension JavaScript into the desktop client without modifying executable binaries:
   ```powershell
   iwr -useb https://raw.githubusercontent.com/spicetify/cli/main/install.ps1 | iex
   ```

### Quick Deploy

1. Clone this repository:
   ```powershell
   git clone https://github.com/arshiljain/whereeee.git spotify1-custom
   cd spotify1-custom
   ```

2. Run the deployment script:
   ```powershell
   powershell -ExecutionPolicy Bypass -File .\scripts\deploy.ps1
   ```

3. Launch Spotify. Your new Liquid Glass interface and all extensions will be active.

---

## Maintenance & Recovery

### After Spotify Client Updates
Spotify updates will occasionally replace the user interface files. To re-patch and re-apply all customizations:
```powershell
powershell -ExecutionPolicy Bypass -File .\scripts\reapply-after-update.ps1
```

### Reverting to Vanilla Spotify
To completely remove all modifications and restore the clean stock client:
```powershell
powershell -ExecutionPolicy Bypass -File .\scripts\restore.ps1
```

---

## Project Structure

```
├── themes/
│   └── liquid-glass/
│       ├── color.ini       # Color definitions & palette mappings
│       ├── user.css        # Frosted glass, floating dock, and Encore variable overrides
│       └── theme.js        # Dynamic canvas-based album art color extraction
├── extensions/
│   ├── spotify1-brand.js   # Title and header branding
│   ├── liquid-shortcuts.js # Global shortcuts & toast notifications
│   ├── sleep-timer.js      # Sleep timer with countdown badge
│   ├── listening-stats.js  # Listening statistics modal dashboard
│   └── lyrics-overlay.js   # Floating lyrics HUD
└── scripts/
    ├── deploy.ps1               # Automated deployment script
    ├── reapply-after-update.ps1 # Post-update re-patcher
    └── restore.ps1              # Full vanilla restore script
```

---

## License

MIT License. Free to use, modify, and distribute for personal desktop customization.
