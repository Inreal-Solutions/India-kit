#!/bin/sh
set -e

REPO="Inreal-Solutions/India-kit"
BINARY="india-kit"
INSTALL_DIR="/usr/local/bin"

GREEN="\033[32m"
CYAN="\033[36m"
RED="\033[31m"
BOLD="\033[1m"
RESET="\033[0m"

echo ""
echo "${BOLD}${CYAN}india-kit — The Definitive Indian Dev Toolkit${RESET}"
echo ""

# Get latest version from GitHub
VERSION=$(curl -fsSL "https://api.github.com/repos/$REPO/releases/latest" \
  | grep '"tag_name"' | sed 's/.*"v\([^"]*\)".*/\1/')

if [ -z "$VERSION" ]; then
  echo "${RED}✘ Could not fetch latest version. Check your internet connection.${RESET}"
  exit 1
fi

echo "→ Latest version: v$VERSION"

# Detect OS and arch
OS="$(uname -s)"
ARCH="$(uname -m)"

case "$OS" in
  Linux)  PLATFORM="linux" ;;
  Darwin) PLATFORM="macos" ;;
  *)
    echo "${RED}✘ Unsupported OS: $OS${RESET}"
    echo "  Install via npm: npm install -g india-kit"
    exit 1
    ;;
esac

case "$ARCH" in
  x86_64)          CPU="x64" ;;
  arm64|aarch64)   CPU="arm64" ;;
  *)
    echo "${RED}✘ Unsupported architecture: $ARCH${RESET}"
    exit 1
    ;;
esac

BINARY_NAME="${BINARY}-${PLATFORM}-${CPU}"
URL="https://github.com/$REPO/releases/download/v$VERSION/$BINARY_NAME"

echo "→ Downloading $BINARY_NAME..."
curl -fsSL "$URL" -o "/tmp/$BINARY"
chmod +x "/tmp/$BINARY"

# Install to /usr/local/bin (try sudo if needed)
if [ -w "$INSTALL_DIR" ]; then
  mv "/tmp/$BINARY" "$INSTALL_DIR/$BINARY"
else
  echo "→ Needs sudo to install to $INSTALL_DIR"
  sudo mv "/tmp/$BINARY" "$INSTALL_DIR/$BINARY"
fi

echo "${GREEN}${BOLD}✔ india-kit v$VERSION installed!${RESET}"
echo ""
echo "Quick start:"
echo "  india-kit validate pan ABCDE1234F"
echo "  india-kit validate aadhaar 234123412346"
echo "  india-kit mock pan"
echo "  india-kit gst 1000 18"
echo ""
