import React from "react";
import { useSystemStats } from "./hooks/useSystemStats";
import { useRecentProjects } from "./hooks/useRecentProjects";
import { StatBox } from "./components/StatBox";
import { CPUWidget, MemoryWidget, DiskWidget, ProcessWidget, SysInfoWidget, ProjectList } from "./components/Widgets";
import { Footer } from "./components/Footer";
import { useTerminalDimensions } from "@opentui/react";

function Clock() {
  const [time, setTime] = React.useState(new Date());
  
  React.useEffect(() => {
    const timer = setInterval(() => setTime(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  return <text style={{ fg: "#8b949e", bold: true } as any}>{time.toLocaleTimeString('en-GB', { hour12: false })}</text>;
}

export function App() {
  const stats = useSystemStats(1000);
  const { projects, hasGit, hasGh } = useRecentProjects();
  const { width, height } = useTerminalDimensions();

  if (!stats) {
    return (
      <box style={{ flex: 1, alignItems: "center", justifyContent: "center" } as any}>
        <text style={{ fg: "#58a6ff" } as any}>LOADING BIRO SYSTEM...</text>
      </box>
    );
  }

  const isSmall = width < 70;
  const borderColor = "#444c56";

  return (
    <box style={{ flex: 1, flexDirection: "column", padding: 1, overflow: "hidden" } as any}>
      {/* Header */}
      <box style={{ flexDirection: "row", justifyContent: "space-between", height: 3, borderStyle: "single", padding: 1, borderColor: borderColor, marginBottom: 1 } as any}>
        <box style={{ flexDirection: "row", gap: 1 } as any}>
          <text style={{ fg: "#58a6ff", bold: true } as any}>[ B ]</text>
          {!isSmall && <text style={{ fg: "#c9d1d9", bold: true } as any}>BIRO COMMAND</text>}
        </box>
        <Clock />
      </box>

      <box style={{ flexDirection: "column", flex: 1, gap: 1 } as any}>
        {/* Top Row: CPU & MEM */}
        <box style={{ flexDirection: "row", flex: 1, minHeight: 11 } as any}>
          <StatBox title="CPU" flex={1}>
            <CPUWidget stats={stats} />
          </StatBox>
          <StatBox title="MEM" flex={1}>
            <MemoryWidget stats={stats} />
          </StatBox>
        </box>

        {/* Bottom Area */}
        <box style={{ flexDirection: isSmall ? "column" : "row", flex: 2, gap: 1 } as any}>
          <StatBox title="PROCESSES" flex={1.5}>
            <ProcessWidget stats={stats} width={isSmall ? width : width * 0.4} />
          </StatBox>
          
          <box style={{ flexDirection: "column", flex: 1.5, gap: 1 } as any}>
            <StatBox title="PROJECTS" flex={1.5}>
              <ProjectList projects={projects} hasGit={hasGit} hasGh={hasGh} width={isSmall ? width : width * 0.4} />
            </StatBox>

            <StatBox title="SYSTEM INFO" flex={1.2}>
              <SysInfoWidget stats={stats} />
            </StatBox>
            
            {!isSmall && (
              <StatBox title="STORAGE" flex={0.8}>
                <DiskWidget stats={stats} width={width * 0.4} />
                <box style={{ marginTop: 0, padding: 1, height: 1 } as any}>
                   <text style={{ fg: "#58a6ff", bold: true } as any}>LOAD: </text>
                   <text style={{ fg: "#c9d1d9" } as any}>{stats.load.avg1.toFixed(2)}</text>
                </box>
              </StatBox>
            )}
          </box>
        </box>
      </box>
      
      {/* Footer with Train Animation */}
      <Footer />
    </box>
  );
}
