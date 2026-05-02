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
        padding: 1,
        flex: flex || 1,
        height: height,
        flexDirection: "column",
        borderColor: "#444c56",
        titleColor: "#58a6ff",
        overflow: "hidden", 
        ...style,
      } as any}
    >
      <box style={{ flexDirection: "column", flex: 1, marginTop: 0 } as any}>
        {children}
      </box>
    </box>
  );
}
export const ProgressBar = React.memo(({ percent, label, color = "#58a6ff", width }: { percent: number; label: string; color?: string; width?: number }) => {
  const safePercent = isNaN(percent) || !isFinite(percent) ? 0 : Math.max(0, Math.min(100, percent));
  
  // Use provided width or a default. We subtract 2 to account for padding/margins
  const totalBlocks = Math.max(5, Math.floor((width || 25) - 2)); 
  const filledBlocks = Math.round((safePercent / 100) * totalBlocks);
  const emptyBlocks = Math.max(0, totalBlocks - filledBlocks);
  
  const bar = "█".repeat(filledBlocks) + "▒".repeat(emptyBlocks);

  return (
    <box style={{ flexDirection: "column", marginBottom: 1, flex: 1 } as any}>
      <box style={{ flexDirection: "row", justifyContent: "space-between", marginBottom: 0 } as any}>
        <text style={{ fg: "#c9d1d9", bold: true } as any}>{label}</text>
        <text style={{ fg: "#8b949e" } as any}>{Math.round(safePercent)}%</text>
      </box>
      <box style={{ flexDirection: "row", height: 1, flex: 1 } as any}>
        <text style={{ fg: color, flex: 1 } as any}>{bar}</text>
      </box>
    </box>
  );
});

export const Sparkline = React.memo(({ data, height = 2, color = "#f85149", width }: { data: number[], height?: number, color?: string, width?: number }) => {
  const sparkWidth = Math.floor(width || 20);
  if (data.length === 0) return <text style={{ fg: "#484f58" } as any}>Initializing...</text>;

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
    <box style={{ flexDirection: "column", gap: 0, height: height } as any}>
      <text style={{ fg: color, bold: true } as any}>{displaySpark}</text>
      <box style={{ flexDirection: "row", justifyContent: "space-between", height: 1 } as any}>
        <text style={{ fg: "#8b949e" } as any}>{Math.floor(min)}°</text>
        <text style={{ fg: "#8b949e" } as any}>{Math.floor(max)}°</text>
      </box>
    </box>
  );
});
