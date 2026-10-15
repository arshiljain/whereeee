# Deploy Script for Liquid Glass Theme and Spotify1 Extensions
$ErrorActionPreference = "Stop"

$scriptDir = Split-Path -Parent $MyInvocation.MyCommand.Path
$projectRoot = Split-Path -Parent $scriptDir

$spicetifyThemes = "$env:APPDATA\spicetify\Themes\liquid-glass"
$spicetifyExtensions = "$env:APPDATA\spicetify\Extensions"

Write-Host "==> Deploying Liquid Glass theme..." -ForegroundColor Cyan
if (!(Test-Path $spicetifyThemes)) {
    New-Item -ItemType Directory -Force -Path $spicetifyThemes | Out-Null
}
Copy-Item "$projectRoot\themes\liquid-glass\*" -Destination $spicetifyThemes -Recurse -Force

Write-Host "==> Deploying custom extensions..." -ForegroundColor Cyan
if (!(Test-Path $spicetifyExtensions)) {
    New-Item -ItemType Directory -Force -Path $spicetifyExtensions | Out-Null
}
Copy-Item "$projectRoot\extensions\*.js" -Destination $spicetifyExtensions -Force

Write-Host "==> Configuring Spicetify..." -ForegroundColor Cyan
$env:Path = [System.Environment]::GetEnvironmentVariable("Path","User") + ";" + [System.Environment]::GetEnvironmentVariable("Path","Machine")

spicetify config current_theme liquid-glass
spicetify config color_scheme LiquidGlass
spicetify config inject_css 1
spicetify config inject_theme_js 1
spicetify config replace_colors 1

# Activate extensions separated by pipe
spicetify config extensions "spotify1-brand.js|liquid-shortcuts.js|sleep-timer.js|listening-stats.js|lyrics-overlay.js"

Write-Host "==> Applying configuration to Spotify..." -ForegroundColor Green
spicetify apply

Write-Host "`n[OK] Liquid Glass and Spotify1 customizations successfully applied!" -ForegroundColor Green
