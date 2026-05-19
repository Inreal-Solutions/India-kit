#!/bin/sh
set -e

BOLD="\033[1m"
GREEN="\033[32m"
CYAN="\033[36m"
RED="\033[31m"
RESET="\033[0m"

echo ""
echo "${BOLD}${CYAN}india-kit — The Definitive Indian Dev Toolkit${RESET}"
echo ""

# Detect OS
OS="$(uname -s 2>/dev/null || echo unknown)"

install_via_npm() {
    echo "→ Installing via npm..."
    npm install -g india-kit
    echo "${GREEN}✔ Done! Run: india-kit --help${RESET}"
}

install_via_brew() {
    echo "→ Installing via Homebrew..."
    brew tap inrealsolutions/india-kit 2>/dev/null || true
    brew install india-kit
    echo "${GREEN}✔ Done! Run: india-kit --help${RESET}"
}

install_via_pip() {
    echo "→ Installing via pip..."
    pip install india-kit
    echo "${GREEN}✔ Done! Run: python -c \"import india_kit; print(india_kit.__version__)\"${RESET}"
}

# Prefer npm → brew → pip → error
if command -v npm >/dev/null 2>&1; then
    install_via_npm
elif command -v brew >/dev/null 2>&1; then
    install_via_brew
elif command -v pip >/dev/null 2>&1 || command -v pip3 >/dev/null 2>&1; then
    PIP=$(command -v pip3 || command -v pip)
    echo "→ Installing via pip..."
    $PIP install india-kit
    echo "${GREEN}✔ Done!${RESET}"
else
    echo "${RED}✘ No supported package manager found (npm, brew, pip).${RESET}"
    echo ""
    echo "Install Node.js from https://nodejs.org then re-run this script."
    echo "Or: pip install india-kit"
    exit 1
fi

echo ""
echo "${BOLD}Quick start:${RESET}"
echo "  india-kit validate pan ABCDE1234F"
echo "  india-kit validate aadhaar 234123412346"
echo "  india-kit mock pan"
echo "  india-kit gst 1000 18"
echo ""
