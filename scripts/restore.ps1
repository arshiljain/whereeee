# Revert Spotify to Stock / Vanilla State
$ErrorActionPreference = "Stop"

Write-Host "==> Restoring Spotify to original unmodified state..." -ForegroundColor Yellow
$env:Path = [System.Environment]::GetEnvironmentVariable("Path","User") + ";" + [System.Environment]::GetEnvironmentVariable("Path","Machine")

spicetify restore

Write-Host "`n[✓] Spotify restored successfully. All Spicetify modifications removed." -ForegroundColor Green
