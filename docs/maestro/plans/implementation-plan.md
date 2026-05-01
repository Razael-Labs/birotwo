# Implementation Plan: OpenTUI CLI Screensaver

## Phase 1: Setup & Scaffolding
- Initialize project with `bun init -y`.
- Install dependencies: `@opentui/core`, `@opentui/react`, `systeminformation`, `react`, `@types/react`.
- Configure `tsconfig.json` for OpenTUI React (jsxImportSource).
- Create basic directory structure.

## Phase 2: Data Collection (Hooks)
- Implement `useSystemStats` hook in `src/hooks/useSystemStats.ts`.
- Use `systeminformation.getDynamicData()` or specific functions for CPU, Memory, Disk, and Processes.
- Implement polling interval (1s).

## Phase 3: UI Components
- Implement `StatBox` in `src/components/StatBox.tsx`.
- Implement `CPUWidget`, `MemoryWidget`, `DiskWidget`, and `ProcessWidget`.
- Use bars or percentage indicators for visual impact.

## Phase 4: Main Application
- Create `src/App.tsx` to arrange widgets using flexbox.
- Implement `src/index.tsx` to bootstrap the OpenTUI renderer.

## Phase 5: Validation
- Run the application with `bun src/index.tsx`.
- Verify metrics and UI layout.
- Final adjustments for aesthetics.
