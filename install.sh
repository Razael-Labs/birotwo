#!/usr/bin/env bash

# Biro2 CLI Screensaver Installer
# Sets up a global 'biro2' command

PROJECT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
BIN_PATH="$PROJECT_DIR/bin/biro2"

# Make the wrapper executable
chmod +x "$BIN_PATH"

echo "------------------------------------------------"
echo "  [ B ] BIRO SYSTEM COMMAND INSTALLER"
echo "------------------------------------------------"

# Determine target bin directory
if [[ -d "$PREFIX/bin" ]]; then
    # Termux environment
    TARGET_BIN="$PREFIX/bin/biro2"
elif [[ -d "/usr/local/bin" ]]; then
    # Standard Linux environment
    TARGET_BIN="/usr/local/bin/biro2"
else
    # Fallback to a common bin
    TARGET_BIN="/usr/bin/biro2"
fi

echo "Installing command to: $TARGET_BIN"

# Create symlink (might need sudo on Linux)
if [[ "$OSTYPE" == "linux-android"* ]]; then
    ln -sf "$BIN_PATH" "$TARGET_BIN"
else
    echo "Requesting permission to create symlink in system bin..."
    sudo ln -sf "$BIN_PATH" "$TARGET_BIN"
fi

if [[ $? -eq 0 ]]; then
    echo "------------------------------------------------"
    echo "SUCCESS: You can now run the screensaver using:"
    echo "         biro2"
    echo "------------------------------------------------"
else
    echo "ERROR: Installation failed. Please check permissions."
fi
