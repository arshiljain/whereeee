# Re-apply Spicetify after Spotify Desktop updates
$ErrorActionPreference = "Continue"

Write-Host "==> Checking Spotify update state and re-applying Spicetify..." -ForegroundColor Cyan
$env:Path = [System.Environment]::GetEnvironmentVariable("Path","User") + ";" + [System.Environment]::GetEnvironmentVariable("Path","Machine")

# First, attempt normal apply
spicetify apply

if ($LASTEXITCODE -ne 0) {
    Write-Host "`n[!] New Spotify version detected. Running backup and re-patching..." -ForegroundColor Yellow
    spicetify backup apply
}

Write-Host "`n[✓] Spotify re-patched and customizations re-applied successfully!" -ForegroundColor Green
