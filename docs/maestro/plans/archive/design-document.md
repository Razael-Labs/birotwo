# Design Document: OpenTUI CLI Screensaver

## 1. Overview
The goal is to build a functional and visually appealing CLI screensaver using OpenTUI. The application will monitor and display various system metrics in real-time.

## 2. Requirements
- Display CPU usage (overall and per-core).
- Display RAM usage (Used, Free, Total).
- Display Disk usage (Root partition).
- Display top processes (CPU/Memory).
- Display background processes/system load.
- Real-time updates (e.g., every 1 second).
- Clean, modular layout with borders and colors.
- Interactive exit (Ctrl+C).

## 3. Architecture
- **Framework**: OpenTUI with React bindings.
- **Metrics**: `systeminformation` library for cross-platform system data.
- **State Management**: React `useState` and `useEffect` for polling and updates.
- **Layout**: Flexbox-based layout using OpenTUI `<box>` and `<text>` components.

## 4. Component Breakdown
### 4.1 `useSystemStats` Hook
A custom hook that encapsulates polling logic:
- `cpu`: load, temperatures (if available).
- `mem`: total, free, used, active.
- `fsSize`: disk usage.
- `processes`: list of processes.

### 4.2 `StatBox` Component
A reusable wrapper for widgets:
- Props: `title`, `children`, `flex`, `style`.
- Visual: Bordered box with a title.

### 4.3 `Dashboard` Component
The root UI component:
- Top Row: CPU and RAM stats.
- Middle Row: Disk usage and System Load.
- Bottom Row: Process list.

## 5. Implementation Plan
1. Initialize Bun project and install `@opentui/core`, `@opentui/react`, and `systeminformation`.
2. Create `src/hooks/useSystemStats.ts`.
3. Create `src/components/StatBox.tsx` and specific widgets.
4. Assemble `src/App.tsx`.
5. Create `src/index.tsx` to initialize the renderer.

## 6. Testing Strategy
- Manual verification of metrics against system tools (top, htop, df).
- Verification of UI responsiveness (resizing terminal).
- Long-running stability test (memory leaks).
