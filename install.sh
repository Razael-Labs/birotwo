#!/usr/bin/env bash

# Biro2 CLI Screensaver Installer
# Downloads pre-compiled binaries from GitHub Releases

REPO="Razael-Labs/birotwo"
VERSION="latest" # You can pin this to a specific version like "v1.0.0"

echo "------------------------------------------------"
echo "  [ B ] BIRO SYSTEM COMMAND INSTALLER"
echo "------------------------------------------------"

# Detect Architecture
ARCH=$(uname -m)
case $ARCH in
    x86_64)  BINARY_NAME="biro2-linux-x64" ;;
    aarch64) BINARY_NAME="biro2-linux-arm64" ;;
    arm64)   BINARY_NAME="biro2-linux-arm64" ;;
    *)       echo "ERROR: Unsupported architecture: $ARCH"; exit 1 ;;
esac

# Determine target bin directory
if [[ -d "$PREFIX/bin" ]]; then
    TARGET_BIN="$PREFIX/bin/biro2"
elif [[ -d "/usr/local/bin" ]]; then
    TARGET_BIN="/usr/local/bin/biro2"
else
    TARGET_BIN="/usr/bin/biro2"
fi

# Download URLs
if [[ "$VERSION" == "latest" ]]; then
    BASE_URL="https://github.com/$REPO/releases/latest/download"
else
    BASE_URL="https://github.com/$REPO/releases/download/$VERSION"
fi

echo "Detected architecture: $ARCH"
echo "Downloading $BINARY_NAME..."

# Download Binary and Checksum
curl -L "$BASE_URL/$BINARY_NAME" -o biro2_bin
curl -L "$BASE_URL/$BINARY_NAME.sha256" -o biro2_bin.sha256

if [[ $? -ne 0 ]]; then
    echo "ERROR: Download failed. Release might not exist yet."
    exit 1
fi

# Verify Checksum
echo "Verifying checksum..."
if command -v sha256sum >/dev/null; then
    sha256sum --check biro2_bin.sha256
elif command -v shasum >/dev/null; then
    shasum -a 256 --check biro2_bin.sha256
else
    echo "WARNING: sha256sum/shasum not found. Skipping verification."
fi

if [[ $? -ne 0 ]]; then
    echo "ERROR: Checksum verification failed! The file might be corrupted."
    rm biro2_bin biro2_bin.sha256
    exit 1
fi

echo "Installing to: $TARGET_BIN"

# Install binary
if [[ "$OSTYPE" == "linux-android"* ]]; then
    mv -f biro2_bin "$TARGET_BIN"
    chmod +x "$TARGET_BIN"
else
    echo "Requesting permission to install binary in system bin..."
    sudo mv -f biro2_bin "$TARGET_BIN"
    sudo chmod +x "$TARGET_BIN"
fi

rm -f biro2_bin.sha256

if [[ $? -eq 0 ]]; then
    echo "------------------------------------------------"
    echo "SUCCESS: Biro2 has been installed!"
    echo "         You can now run it globally using:"
    echo "         biro2"
    echo "------------------------------------------------"
else
    echo "ERROR: Installation failed. Please check permissions."
fi
