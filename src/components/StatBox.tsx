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
export function ProgressBar({ percent, label, color = "#58a6ff", width }: { percent: number; label: string; color?: string; width?: number }) {
  const safePercent = isNaN(percent) || !isFinite(percent) ? 0 : Math.max(0, Math.min(100, percent));
  
  // Use provided width or a default. We subtract 2 to account for padding/margins
  const totalBlocks = Math.max(5, Math.floor((width || 25) - 2)); 
  const filledBlocks = Math.round((safePercent / 100) * totalBlocks);
  const emptyBlocks = Math.max(0, totalBlocks - filledBlocks);
  
  const bar = "█".repeat(filledBlocks) + "▒".repeat(emptyBlocks);

  return (
    <box style={{ flexDirection: "column", marginBottom: 1, flex: 1 }}>
      <box style={{ flexDirection: "row", justifyContent: "space-between", marginBottom: 0 }}>
        <text fg="#c9d1d9" bold>{label}</text>
        <text fg="#8b949e">{Math.round(safePercent)}%</text>
      </box>
      <box style={{ flexDirection: "row", height: 1, flex: 1 }}>
        <text fg={color} style={{ flex: 1 }}>{bar}</text>
      </box>
    </box>
  );
}

export function Sparkline({ data, height = 2, color = "#f85149", width }: { data: number[], height?: number, color?: string, width?: number }) {
  const sparkWidth = Math.floor(width || 20);
  if (data.length === 0) return <text fg="#484f58">Initializing...</text>;

  const min = Math.min(...data);
  const max = Math.max(...data);
  const range = max - min || 1;

  const blocks = ["▂", "▃", "▄", "▅", "▆", "▇", "█"];

  const sparkline = data.map(val => {
    const idx = Math.floor(((val - min) / range) * (blocks.length - 1));
    return blocks[idx];
  }).join("");

  // Pad or slice to keep width consistent
  const displaySpark = sparkline.slice(-sparkWidth).padStart(sparkWidth, " ");

  return (
    <box style={{ flexDirection: "column", gap: 0, height: height }}>
      <text fg={color} bold>{displaySpark}</text>
      <box style={{ flexDirection: "row", justifyContent: "space-between", height: 1 }}>
        <text fg="#8b949e" style={{ fontSize: 0.8 }}>{Math.floor(min)}°</text>
        <text fg="#8b949e" style={{ fontSize: 0.8 }}>{Math.floor(max)}°</text>
      </box>
    </box>
  );
}
