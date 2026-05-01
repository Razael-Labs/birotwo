import React from "react";

export interface StatBoxProps {
  title: string;
  children: React.ReactNode;
  flex?: number;
  height?: number | string;
  style?: any;
}

export function StatBox({ title, children, flex, height, style }: StatBoxProps) {
  return (
    <box
      title={` ${title} `}
      style={{
        borderStyle: "single",
        padding: { left: 1, right: 1 },
        flex: flex || 1,
        height: height,
        flexDirection: "column",
        borderColor: "#444c56",
        titleColor: "#58a6ff",
        overflow: "hidden", 
        ...style,
      }}
    >
      <box style={{ flexDirection: "column", flex: 1, marginTop: 0 }}>
        {children}
      </box>
    </box>
  );
}
export function ProgressBar({ percent, label, color = "#58a6ff" }: { percent: number; label: string; color?: string }) {
  // Ultra-compact bar for small screens
  const barWidth = 10;
  const safePercent = Math.max(0, Math.min(100, isNaN(percent) ? 0 : percent));
  const filled = Math.round((safePercent / 100) * barWidth);
  const empty = barWidth - filled;
  const bar = "█".repeat(filled) + "░".repeat(empty);

  return (
    <box style={{ flexDirection: "row", height: 1, alignItems: "center" }}>
      <text style={{ width: 6, fg: "#c9d1d9" }} truncate="end">{label}</text>
      <text fg={color} style={{ marginLeft: 1 }}>{bar}</text>
      <text style={{ width: 5, fg: "#8b949e", textAlign: "right" }}>{Math.round(safePercent)}%</text>
    </box>
  );
}

export function Sparkline({ data, height = 2, color = "#f85149" }: { data: number[], height?: number, color?: string }) {
  const fixedWidth = 20;
  if (data.length === 0) return <text fg="#484f58">Initializing...</text>;

  const min = Math.min(...data);
  const max = Math.max(...data);
  const range = max - min || 1;

  const blocks = ["▂", "▃", "▄", "▅", "▆", "▇", "█"];

  const sparkline = data.map(val => {
    const idx = Math.floor(((val - min) / range) * (blocks.length - 1));
    return blocks[idx];
  }).join("");

  // Pad with spaces to keep width consistent
  const paddedSpark = sparkline.padStart(fixedWidth, " ");

  return (
    <box style={{ flexDirection: "column", gap: 0, height: 2 }}>
      <text fg={color} bold>{paddedSpark}</text>
      <box style={{ flexDirection: "row", justifyContent: "space-between", height: 1 }}>
        <text fg="#8b949e" style={{ fontSize: 0.8 }}>{Math.floor(min)}°</text>
        <text fg="#8b949e" style={{ fontSize: 0.8 }}>{Math.floor(max)}°</text>
      </box>
    </box>
  );
}
