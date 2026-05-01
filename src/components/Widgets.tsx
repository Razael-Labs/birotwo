import React from "react";
import { SystemStats } from "../hooks/useSystemStats";
import { ProjectInfo } from "../hooks/useRecentProjects";
import { ProgressBar, Sparkline } from "./StatBox";

export function ProjectList({ projects, hasGit, hasGh, width }: { projects: ProjectInfo[], hasGit: boolean, hasGh: boolean, width?: number }) {
  const formatTime = (ms: number) => {
    if (ms === 0) return "--:--";
    const date = new Date(ms);
    return date.toLocaleTimeString('en-GB', { hour: "2-digit", minute: "2-digit" });
  };

  const nameWidth = Math.max(10, Math.floor((width || 30) - 12));

  return (
    <box style={{ flexDirection: "column", flex: 1 }}>
      <box style={{ flexDirection: "row", height: 1, padding: { left: 1, right: 1 }, borderStyle: "single", borderColor: "#30363d", border: { top: false, left: false, right: false, bottom: true }, marginBottom: 0 }}>
        <text style={{ width: nameWidth, fg: "#58a6ff", bold: true }}>{hasGh || hasGit ? "REPOSITORY" : "PROJECT"}</text>
        <text style={{ width: 8, fg: "#58a6ff", marginLeft: 1, bold: true, textAlign: "right" }}>OPENED</text>
      </box>
      <box style={{ flexDirection: "column", flex: 1 }}>
        {projects.length === 0 ? (
          <text fg="#484f58" style={{ marginTop: 1, marginLeft: 1 }}>No projects found</text>
        ) : (
          projects.map((proj, i) => (
            <box key={i} style={{ flexDirection: "row", height: 1, padding: { left: 1, right: 1 } }}>
              <box style={{ flexDirection: "row", width: nameWidth }}>
                <text fg={proj.isGit ? "#3fb950" : "#8b949e"}>{proj.isGit ? " " : " "}</text>
                <text fg="#c9d1d9" truncate="end" style={{ flex: 1 }}>{proj.name}</text>
              </box>
              <text style={{ width: 8, fg: "#8b949e", textAlign: "right", marginLeft: 1 }}>{formatTime(proj.lastOpened)}</text>
            </box>
          ))
        )}
      </box>
      {projects.length > 0 && (
        <text style={{ fg: "#484f58", height: 1, marginTop: 0 }} truncate="end">
          Source: {hasGh ? "GitHub" : hasGit ? "Git" : "Local"}
        </text>
      )}
    </box>
  );
}

export function CPUWidget({ stats, width }: { stats: SystemStats, width?: number }) {
  const sparkWidth = Math.max(10, Math.floor((width || 30) - 4));

  return (
    <box style={{ flexDirection: "column", flex: 1, justifyContent: "space-between" }}>
      <box style={{ flexDirection: "column", flex: 1 }}>
        <box style={{ flexDirection: "row", justifyContent: "space-between", height: 1 }}>
          <text fg="#8b949e">TEMP</text>
          <text fg="#f85149" bold>{stats.cpu.temp ? `${Math.round(stats.cpu.temp)}°C` : "--°C"}</text>
        </box>
        
        <ProgressBar percent={stats.cpu.load} label="CPU LOAD" color="#58a6ff" width={width} />
        
        <box style={{ marginTop: 0, flexDirection: "column", flex: 1 }}>
          <text fg="#8b949e" style={{ fontSize: 1, marginBottom: 0 }}>TEMPERATURE TREND</text>
          <Sparkline data={stats.tempHistory} color="#f85149" width={sparkWidth} />
        </box>
      </box>

      {/* Show cores if space permits */}
      {stats.cpu.cores.length <= 4 && (
        <box style={{ flexDirection: "column", marginTop: 0 }}>
           <text fg="#8b949e" style={{ marginBottom: 0 }}>CORE LOAD</text>
           <box style={{ flexDirection: "row", gap: 1 }}>
              {stats.cpu.cores.slice(0, 4).map((load, i) => (
                <text key={i} fg={load > 80 ? "#f85149" : "#3fb950"}>█</text>
              ))}
           </box>
        </box>
      )}
    </box>
  );
}

export function MemoryWidget({ stats, width }: { stats: SystemStats, width?: number }) {
  const usedGB = (stats.mem.used / 1024 / 1024 / 1024).toFixed(1);
  const totalGB = (stats.mem.total / 1024 / 1024 / 1024).toFixed(1);
  const percent = (stats.mem.used / stats.mem.total) * 100;

  return (
    <box style={{ flexDirection: "column", flex: 1, justifyContent: "space-between" }}>
      <box style={{ flexDirection: "column", flex: 1 }}>
        <ProgressBar percent={percent} label="RAM USAGE" color="#d29922" width={width} />
        <box style={{ flexDirection: "row", justifyContent: "space-between", height: 1 }}>
          <text fg="#8b949e">Used</text>
          <text fg="#c9d1d9">{usedGB} GB</text>
        </box>
        <box style={{ flexDirection: "row", justifyContent: "space-between", height: 1 }}>
          <text fg="#8b949e">Total</text>
          <text fg="#c9d1d9">{totalGB} GB</text>
        </box>
      </box>
      
      <box style={{ flexDirection: "column", borderStyle: "single", borderColor: "#30363d", padding: { left: 1, right: 1 }, border: { top: true, left: false, right: false, bottom: false } }}>
        <box style={{ flexDirection: "row", justifyContent: "space-between" }}>
          <text fg="#8b949e">Free</text>
          <text fg="#3fb950">{(stats.mem.free / 1024 / 1024 / 1024).toFixed(1)} GB</text>
        </box>
      </box>
    </box>
  );
}

export function DiskWidget({ stats, width }: { stats: SystemStats, width?: number }) {
  const usedGB = (stats.disk.used / 1024 / 1024 / 1024).toFixed(1);
  const totalGB = (stats.disk.total / 1024 / 1024 / 1024).toFixed(1);

  return (
    <box style={{ flexDirection: "column", flex: 1 }}>
      <ProgressBar percent={stats.disk.use} label="DISK" color="#a5d6ff" width={width} />
      <box style={{ flexDirection: "row", justifyContent: "space-between", height: 1 }}>
        <text fg="#8b949e">{usedGB}GB / {totalGB}GB</text>
        <text fg="#c9d1d9">{Math.round(stats.disk.use)}%</text>
      </box>
    </box>
  );
}

export function SysInfoWidget({ stats }: { stats: SystemStats }) {
  const infoStyle = { flexDirection: "row", height: 1 };
  const labelStyle = { width: 10, fg: "#58a6ff", bold: true };
  const valueStyle = { fg: "#c9d1d9" };

  return (
    <box style={{ flexDirection: "column", gap: 0 }}>
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
        <text style={valueStyle} truncate="end">{stats.sys.kernel}</text>
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
        <text style={valueStyle} truncate="end">{stats.cpu.brand}</text>
      </box>
      <box style={infoStyle}>
        <text style={labelStyle}>Private IP</text>
        <text style={valueStyle}>{stats.sys.privateIp}</text>
      </box>
      <box style={infoStyle}>
        <text style={labelStyle}>Public IP</text>
        <text style={{ fg: "#58a6ff" }}>{stats.sys.publicIp}</text>
      </box>
    </box>
  );
}

export function ProcessWidget({ stats, width }: { stats: SystemStats, width?: number }) {
  return (
    <box style={{ flexDirection: "column", flex: 1 }}>
      <box style={{ flexDirection: "row", height: 1, padding: { left: 1, right: 1 }, borderStyle: "single", borderColor: "#30363d", border: { top: false, left: false, right: false, bottom: true } }}>
        <text style={{ width: 6, fg: "#58a6ff", bold: true }}>PID</text>
        <text style={{ flex: 1, fg: "#58a6ff", marginLeft: 1, bold: true }}>COMMAND</text>
        <text style={{ width: 6, fg: "#58a6ff", textAlign: "right", marginLeft: 1, bold: true }}>CPU</text>
      </box>
      <box style={{ flexDirection: "column", flex: 1 }}>
        {stats.processes.list.slice(0, 10).map((proc, i) => (
          <box key={i} style={{ flexDirection: "row", height: 1, padding: { left: 1, right: 1 } }}>
            <text style={{ width: 6, fg: "#8b949e" }}>{proc.pid}</text>
            <text style={{ flex: 1, fg: "#c9d1d9", marginLeft: 1 }} truncate="end">{proc.name}</text>
            <text style={{ width: 6, fg: "#3fb950", textAlign: "right", marginLeft: 1 }}>{Math.round(proc.cpu || 0)}%</text>
          </box>
        ))}
      </box>
    </box>
  );
}
