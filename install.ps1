# india-kit Windows installer
# Usage: irm https://raw.githubusercontent.com/Inreal-Solutions/India-kit/main/install.ps1 | iex

$ErrorActionPreference = "Stop"

Write-Host ""
Write-Host "india-kit — The Definitive Indian Dev Toolkit" -ForegroundColor Cyan
Write-Host ""

function Install-Via-Npm {
    Write-Host "-> Installing via npm..." -ForegroundColor Yellow
    npm install -g india-kit
    Write-Host "✔ Done! Run: india-kit --help" -ForegroundColor Green
}

function Install-Via-Scoop {
    Write-Host "-> Installing via Scoop..." -ForegroundColor Yellow
    scoop bucket add india-kit https://github.com/Inreal-Solutions/scoop-india-kit 2>$null
    scoop install india-kit
    Write-Host "✔ Done! Run: india-kit --help" -ForegroundColor Green
}

function Install-Via-Choco {
    Write-Host "-> Installing via Chocolatey..." -ForegroundColor Yellow
    choco install india-kit -y
    Write-Host "✔ Done! Run: india-kit --help" -ForegroundColor Green
}

# Prefer npm → scoop → choco → error
if (Get-Command npm -ErrorAction SilentlyContinue) {
    Install-Via-Npm
} elseif (Get-Command scoop -ErrorAction SilentlyContinue) {
    Install-Via-Scoop
} elseif (Get-Command choco -ErrorAction SilentlyContinue) {
    Install-Via-Choco
} else {
    Write-Host "✘ No supported package manager found (npm, scoop, choco)." -ForegroundColor Red
    Write-Host ""
    Write-Host "Install Node.js from https://nodejs.org then re-run this script."
    exit 1
}

Write-Host ""
Write-Host "Quick start:" -ForegroundColor White
Write-Host "  india-kit validate pan ABCDE1234F"
Write-Host "  india-kit validate aadhaar 234123412346"
Write-Host "  india-kit mock pan"
Write-Host "  india-kit gst 1000 18"
Write-Host ""
