# india-kit Windows installer — downloads standalone binary from GitHub Releases
# Usage: irm https://raw.githubusercontent.com/Inreal-Solutions/India-kit/main/install.ps1 | iex

$ErrorActionPreference = "Stop"
$REPO = "Inreal-Solutions/India-kit"
$BINARY = "india-kit"

Write-Host ""
Write-Host "india-kit — The Definitive Indian Dev Toolkit" -ForegroundColor Cyan
Write-Host ""

# Get latest version
$release = Invoke-RestMethod "https://api.github.com/repos/$REPO/releases/latest"
$VERSION = $release.tag_name -replace '^v', ''
Write-Host "-> Latest version: v$VERSION" -ForegroundColor Yellow

# Download binary
$BINARY_NAME = "india-kit-win-x64.exe"
$URL = "https://github.com/$REPO/releases/download/v$VERSION/$BINARY_NAME"
$INSTALL_DIR = "$env:LOCALAPPDATA\india-kit"
$DEST = "$INSTALL_DIR\india-kit.exe"

New-Item -ItemType Directory -Force -Path $INSTALL_DIR | Out-Null
Write-Host "-> Downloading $BINARY_NAME..." -ForegroundColor Yellow
Invoke-WebRequest -Uri $URL -OutFile $DEST

# Add to PATH if not already there
$userPath = [Environment]::GetEnvironmentVariable("PATH", "User")
if ($userPath -notlike "*$INSTALL_DIR*") {
    [Environment]::SetEnvironmentVariable("PATH", "$userPath;$INSTALL_DIR", "User")
    $env:PATH += ";$INSTALL_DIR"
    Write-Host "-> Added $INSTALL_DIR to PATH" -ForegroundColor Yellow
}

Write-Host ""
Write-Host "✔ india-kit v$VERSION installed!" -ForegroundColor Green
Write-Host ""
Write-Host "Quick start:"
Write-Host "  india-kit validate pan ABCDE1234F"
Write-Host "  india-kit validate aadhaar 234123412346"
Write-Host "  india-kit mock pan"
Write-Host "  india-kit gst 1000 18"
Write-Host ""
Write-Host "Note: Restart your terminal for PATH changes to take effect." -ForegroundColor DarkGray
Write-Host ""
