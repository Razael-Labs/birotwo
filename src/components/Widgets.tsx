import React from "react";
import { SystemStats } from "../hooks/useSystemStats";
import { ProjectInfo } from "../hooks/useRecentProjects";
import { ProgressBar, Sparkline } from "./StatBox";

export const ProjectList = React.memo(({ projects, hasGit, hasGh, width }: { projects: ProjectInfo[], hasGit: boolean, hasGh: boolean, width?: number }) => {
  const formatTime = (ms: number) => {
    if (ms === 0) return "--:--";
    const date = new Date(ms);
    return date.toLocaleTimeString('en-GB', { hour: "2-digit", minute: "2-digit" });
  };

  const nameWidth = Math.max(10, Math.floor((width || 30) - 12));

  return (
    <box style={{ flexDirection: "column", flex: 1 } as any}>
      <box style={{ flexDirection: "row", height: 1, padding: 1, borderStyle: "single", borderColor: "#30363d", border: ["bottom"], marginBottom: 0 } as any}>
        <text style={{ width: nameWidth, fg: "#58a6ff", bold: true } as any}>{hasGh || hasGit ? "REPOSITORY" : "PROJECT"}</text>
        <text style={{ width: 8, fg: "#58a6ff", marginLeft: 1, bold: true, textAlign: "right" } as any}>OPENED</text>
      </box>
      <box style={{ flexDirection: "column", flex: 1 } as any}>
        {projects.length === 0 ? (
          <text style={{ fg: "#484f58", marginTop: 1, marginLeft: 1 } as any}>No projects found</text>
        ) : (
          projects.map((proj, i) => (
            <box key={i} style={{ flexDirection: "row", height: 1, padding: 1 } as any}>
              <box style={{ flexDirection: "row", width: nameWidth } as any}>
                <text style={{ fg: proj.isGit ? "#3fb950" : "#8b949e" } as any}>{proj.isGit ? " " : " "}</text>
                <text style={{ fg: "#c9d1d9", truncate: "end", flex: 1 } as any}>{proj.name}</text>
              </box>
              <text style={{ width: 8, fg: "#8b949e", textAlign: "right", marginLeft: 1 } as any}>{formatTime(proj.lastOpened)}</text>
            </box>
          ))
        )}
      </box>
      {projects.length > 0 && (
        <text style={{ fg: "#484f58", height: 1, marginTop: 0, truncate: "end" } as any}>
          Source: {hasGh ? "GitHub" : hasGit ? "Git" : "Local"}
        </text>
      )}
    </box>
  );
});

export const CPUWidget = React.memo(({ stats, width }: { stats: SystemStats, width?: number }) => {
  const sparkWidth = Math.max(10, Math.floor((width || 30) - 4));

  return (
    <box style={{ flexDirection: "column", flex: 1, justifyContent: "space-between" } as any}>
      <box style={{ flexDirection: "column", flex: 1 } as any}>
        <box style={{ flexDirection: "row", justifyContent: "space-between", height: 1 } as any}>
          <text style={{ fg: "#8b949e" } as any}>TEMP</text>
          <text style={{ fg: "#f85149", bold: true } as any}>{stats.cpu.temp ? `${Math.round(stats.cpu.temp)}°C` : "--°C"}</text>
        </box>
        
        <ProgressBar percent={stats.cpu.load} label="CPU LOAD" color="#58a6ff" width={width} />
        
        <box style={{ marginTop: 0, flexDirection: "column", flex: 1 } as any}>
          <text style={{ fg: "#8b949e", marginBottom: 0 } as any}>TEMPERATURE TREND</text>
          <Sparkline data={stats.tempHistory} color="#f85149" width={sparkWidth} />
        </box>
      </box>

      {/* Show cores if space permits */}
      {stats.cpu.cores.length <= 4 && (
        <box style={{ flexDirection: "column", marginTop: 0 } as any}>
           <text style={{ fg: "#8b949e", marginBottom: 0 } as any}>CORE LOAD</text>
           <box style={{ flexDirection: "row", gap: 1 } as any}>
              {stats.cpu.cores.slice(0, 4).map((load, i) => (
                <text key={i} style={{ fg: load > 80 ? "#f85149" : "#3fb950" } as any}>█</text>
              ))}
           </box>
        </box>
      )}
    </box>
  );
});

export const MemoryWidget = React.memo(({ stats, width }: { stats: SystemStats, width?: number }) => {
  const usedGB = (stats.mem.used / 1024 / 1024 / 1024).toFixed(1);
  const totalGB = (stats.mem.total / 1024 / 1024 / 1024).toFixed(1);
  const percent = (stats.mem.used / stats.mem.total) * 100;

  return (
    <box style={{ flexDirection: "column", flex: 1, justifyContent: "space-between" } as any}>
      <box style={{ flexDirection: "column", flex: 1 } as any}>
        <ProgressBar percent={percent} label="RAM USAGE" color="#d29922" width={width} />
        <box style={{ flexDirection: "row", justifyContent: "space-between", height: 1 } as any}>
          <text style={{ fg: "#8b949e" } as any}>Used</text>
          <text style={{ fg: "#c9d1d9" } as any}>{usedGB} GB</text>
        </box>
        <box style={{ flexDirection: "row", justifyContent: "space-between", height: 1 } as any}>
          <text style={{ fg: "#8b949e" } as any}>Total</text>
          <text style={{ fg: "#c9d1d9" } as any}>{totalGB} GB</text>
        </box>
      </box>
      
      <box style={{ flexDirection: "column", borderStyle: "single", borderColor: "#30363d", padding: 1, border: ["top"] } as any}>
        <box style={{ flexDirection: "row", justifyContent: "space-between" } as any}>
          <text style={{ fg: "#8b949e" } as any}>Free</text>
          <text style={{ fg: "#3fb950" } as any}>{(stats.mem.free / 1024 / 1024 / 1024).toFixed(1)} GB</text>
        </box>
      </box>
    </box>
  );
});

export const DiskWidget = React.memo(({ stats, width }: { stats: SystemStats, width?: number }) => {
  const usedGB = (stats.disk.used / 1024 / 1024 / 1024).toFixed(1);
  const totalGB = (stats.disk.total / 1024 / 1024 / 1024).toFixed(1);

  return (
    <box style={{ flexDirection: "column", flex: 1 } as any}>
      <ProgressBar percent={stats.disk.use} label="DISK" color="#a5d6ff" width={width} />
      <box style={{ flexDirection: "row", justifyContent: "space-between", height: 1 } as any}>
        <text style={{ fg: "#8b949e" } as any}>{usedGB}GB / {totalGB}GB</text>
        <text style={{ fg: "#c9d1d9" } as any}>{Math.round(stats.disk.use)}%</text>
      </box>
    </box>
  );
});

export const SysInfoWidget = React.memo(({ stats }: { stats: SystemStats }) => {
  const infoStyle = { flexDirection: "row", height: 1 } as any;
  const labelStyle = { width: 10, fg: "#58a6ff", bold: true } as any;
  const valueStyle = { fg: "#c9d1d9" } as any;

  return (
    <box style={{ flexDirection: "column", gap: 0 } as any}>
      <box style={infoStyle}>
        <text style={labelStyle}>OS</text>
        <text style={valueStyle}>{stats.sys.os}</text>
      </box>
      <box style={infoStyle}>
        <text style={labelStyle}>Host</text>
        <text style={valueStyle}>{stats.sys.model}</text>
      </box>
      <box style={infoStyle}>
        <text style={labelStyle}>Kernel</text>
        <text style={{ ...valueStyle, truncate: "end" } as any}>{stats.sys.kernel}</text>
      </box>
      <box style={infoStyle}>
        <text style={labelStyle}>Uptime</text>
        <text style={valueStyle}>{stats.sys.uptime}</text>
      </box>
      <box style={infoStyle}>
        <text style={labelStyle}>Shell</text>
        <text style={valueStyle}>{stats.sys.shell}</text>
      </box>
      <box style={infoStyle}>
        <text style={labelStyle}>CPU</text>
        <text style={{ ...valueStyle, truncate: "end" } as any}>{stats.cpu.brand}</text>
      </box>
      <box style={infoStyle}>
        <text style={labelStyle}>Private IP</text>
        <text style={valueStyle}>{stats.sys.privateIp}</text>
      </box>
      <box style={infoStyle}>
        <text style={labelStyle}>Public IP</text>
        <text style={{ fg: "#58a6ff" } as any}>{stats.sys.publicIp}</text>
      </box>
    </box>
  );
});

export const ProcessWidget = React.memo(({ stats, width }: { stats: SystemStats, width?: number }) => {
  return (
    <box style={{ flexDirection: "column", flex: 1 } as any}>
      <box style={{ flexDirection: "row", height: 1, padding: 1, borderStyle: "single", borderColor: "#30363d", border: ["bottom"] } as any}>
        <text style={{ width: 6, fg: "#58a6ff", bold: true } as any}>PID</text>
        <text style={{ flex: 1, fg: "#58a6ff", marginLeft: 1, bold: true } as any}>COMMAND</text>
        <text style={{ width: 6, fg: "#58a6ff", textAlign: "right", marginLeft: 1, bold: true } as any}>CPU</text>
      </box>
      <box style={{ flexDirection: "column", flex: 1 } as any}>
        {stats.processes.list.slice(0, 10).map((proc, i) => (
          <box key={i} style={{ flexDirection: "row", height: 1, padding: 1 } as any}>
            <text style={{ width: 6, fg: "#8b949e" } as any}>{proc.pid}</text>
            <text style={{ flex: 1, fg: "#c9d1d9", marginLeft: 1, truncate: "end" } as any}>{proc.name}</text>
            <text style={{ width: 6, fg: "#3fb950", textAlign: "right", marginLeft: 1 } as any}>{Math.round(proc.cpu || 0)}%</text>
          </box>
        ))}
      </box>
    </box>
  );
});
