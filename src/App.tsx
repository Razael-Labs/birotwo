import React from "react";
import { useSystemStats } from "./hooks/useSystemStats";
import { StatBox } from "./components/StatBox";
import { CPUWidget, MemoryWidget, DiskWidget, ProcessWidget, SysInfoWidget } from "./components/Widgets";
import { useTerminalDimensions } from "@opentui/react";

export function App() {
  const stats = useSystemStats(1000);
  const { width, height } = useTerminalDimensions();
  const [time, setTime] = React.useState(new Date());

  React.useEffect(() => {
    const timer = setInterval(() => setTime(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  if (!stats) {
    return (
      <box style={{ flex: 1, alignItems: "center", justifyContent: "center" }}>
        <text fg="#58a6ff">LOADING BIRO SYSTEM...</text>
      </box>
    );
  }

  const isSmall = width < 70;
  const borderColor = "#444c56";

  return (
    <box style={{ flex: 1, flexDirection: "column", padding: 1, overflow: "hidden" }}>
      {/* Header */}
      <box style={{ flexDirection: "row", justifyContent: "space-between", height: 3, borderStyle: "single", padding: { left: 1, right: 1 }, borderColor: borderColor, marginBottom: 1 }}>
        <box style={{ flexDirection: "row", gap: 1 }}>
          <text fg="#58a6ff" bold>[ B ]</text>
          {!isSmall && <text fg="#c9d1d9" bold>BIRO COMMAND</text>}
        </box>
        <text fg="#8b949e" bold>{time.toLocaleTimeString('en-GB', { hour12: false })}</text>
      </box>

      <box style={{ flexDirection: "column", flex: 1, gap: 1 }}>
        {/* Top Row: CPU & MEM */}
        <box style={{ flexDirection: "row", height: 9 }}>
          <StatBox title="CPU" flex={1}>
            <CPUWidget stats={stats} />
          </StatBox>
          <StatBox title="MEM" flex={1}>
            <MemoryWidget stats={stats} />
          </StatBox>
        </box>

        {/* Bottom Area */}
        <box style={{ flexDirection: isSmall ? "column" : "row", flex: 1, gap: 1 }}>
          <StatBox title="PROCESSES" flex={1.5}>
            <ProcessWidget stats={stats} />
          </StatBox>
          
          <box style={{ flexDirection: "column", flex: 1.2, gap: 1 }}>
            <StatBox title="SYSTEM INFO" flex={2}>
              <SysInfoWidget stats={stats} />
            </StatBox>
            
            {!isSmall && (
              <StatBox title="STORAGE" flex={1}>
                <DiskWidget stats={stats} />
                <box style={{ marginTop: 0, padding: { left: 1 }, height: 1 }}>
                   <text fg="#58a6ff" bold>LOAD: </text>
                   <text fg="#c9d1d9">{stats.load.avg1.toFixed(2)}</text>
                </box>
              </StatBox>
            )}
          </box>
        </box>
      </box>
    </box>
  );
}
