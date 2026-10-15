# Spotify Liquid Glass Customizations ("Spotify1")

Personalized UI suite for Spotify Desktop using [Spicetify](https://spicetify.app), inspired by the **Liquid Glass** aesthetic (`spoti.pw` / Apple Music translucent frosted design).

## Features

1. **Liquid Glass Theme (`themes/liquid-glass`)**:
   - Translucent frosted-glass backdrop blur (`backdrop-filter`)
   - Floating dock-style now playing player bar with ambient dynamic glow
   - Acrylic glass sidebars and rounded cards
   - Pill-shaped modern buttons and search inputs
   - Smooth gradient progress bars

2. **Custom Extensions (`extensions/`)**:
   - **`spotify1-brand.js`**: Personalizes app window title and header navigation badge to "Spotify1" without binary modification.
   - **`liquid-shortcuts.js`**:
     - `Ctrl + Shift + Right` / `Alt + J`: Skip to next track
     - `Ctrl + Shift + Left` / `Alt + K`: Previous track
     - `Ctrl + Shift + S` / `Alt + S`: Toggle shuffle
     - `Ctrl + Shift + L` / `Alt + L`: Toggle like / favorite
     - `Alt + Space`: Play / pause
   - **`sleep-timer.js`**: Interactive timer (15m, 30m, 45m, 60m, or end of track) with a live countdown display in the top bar.
   - **`listening-stats.js`**: Daily and session listening metrics modal (time listened today, tracks played, skips).
   - **`lyrics-overlay.js`**: Floating lyrics HUD and view toggle (`Ctrl + Shift + Y` or top bar button).

## How to Apply

Run the deploy script in PowerShell:
```powershell
powershell -ExecutionPolicy Bypass -File .\scripts\deploy.ps1
```

## How to Re-Apply After Spotify Updates

Spotify auto-updates will periodically replace `xpui.spa`. To re-apply everything in one command:
```powershell
powershell -ExecutionPolicy Bypass -File .\scripts\reapply-after-update.ps1
```
Or directly via the CLI:
```powershell
spicetify backup apply
```

## How to Revert to Stock Vanilla Spotify

To cleanly remove all modifications and restore the original Spotify files:
```powershell
powershell -ExecutionPolicy Bypass -File .\scripts\restore.ps1
```
Or directly via the CLI:
```powershell
spicetify restore
```
