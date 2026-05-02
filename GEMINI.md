# Biro2 Project Context

Biro2 is a modern, interactive CLI screensaver and real-time system monitoring tool built with **React** and **OpenTUI**, running on the **Bun** runtime. It provides a "Command Center" aesthetic inspired by GitHub Dark.

## Project Overview

- **Core Technologies:** Bun, React 19, OpenTUI (@opentui/core, @opentui/react), systeminformation.
- **Architecture:** 
  - **Entry Point:** `src/index.tsx` initializes the `createCliRenderer` and renders the root component.
  - **Main Logic:** `src/App.tsx` handles the top-level layout and responsive behavior.
  - **Data Fetching:** `src/hooks/useSystemStats.ts` is a custom hook that polls system data every second.
  - **Components:** Modular widgets in `src/components/` for CPU, Memory, Disk, Processes, and System Info.
- **Target Platform:** Optimized for terminal environments, including mobile-friendly layouts for Termux (Android).

## Building and Running

### Development
To run the project directly using Bun:
```bash
bun src/index.tsx
```

### Installation
To install the pre-compiled global binary:
```bash
chmod +x install.sh
./install.sh
```
The installer automatically detects your architecture (x64 or ARM64), downloads the latest binary from **GitHub Releases**, and verifies its integrity using **SHA256 checksums**. You do not need to have Bun or the source code present to run the installer.

### Development & CI/CD
This project uses **GitHub Actions** to automate releases. When a new tag (e.g., `v1.0.0`) is pushed:
1. The project is compiled for Linux x64 and ARM64.
2. SHA256 checksums are generated for each binary.
3. A new GitHub Release is created with the binaries and checksums as assets.

### Production Usage
Once installed, run the standalone binary from anywhere:
```bash
biro2
```
This binary is self-contained and optimized for faster startup.

## Development Conventions

- **TypeScript:** The project uses TypeScript. Ensure type safety for all new components and hooks.
- **Responsive Layout:** Components should handle different terminal dimensions gracefully. Use the `isSmall` flag from `useTerminalDimensions` where appropriate.
- **Styling:** Layouts are built using a Flexbox-like system provided by OpenTUI. Borders, padding, and colors follow the GitHub Dark aesthetic.
- **Efficiency:** The system information polling interval is configurable (default 1000ms). Minimize expensive computations inside the render loop.

## Key Files

- `src/index.tsx`: CLI renderer setup and root mounting.
- `src/App.tsx`: Main application layout and responsive logic.
- `src/hooks/useSystemStats.ts`: System data orchestration and network discovery.
- `src/components/Widgets.tsx`: Visual implementation of system stats.
- `src/components/StatBox.tsx`: Reusable layout container and UI primitives (ProgressBar, Sparkline).
- `package.json`: Dependency management and Bun configuration.
- `install.sh`: Installation script for global CLI access.
