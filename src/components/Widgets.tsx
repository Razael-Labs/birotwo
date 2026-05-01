import React from "react";
import { SystemStats } from "../hooks/useSystemStats";
import { ProgressBar, Sparkline } from "./StatBox";

export function CPUWidget({ stats }: { stats: SystemStats }) {
  return (
    <box style={{ flexDirection: "column" }}>
      <box style={{ flexDirection: "row", justifyContent: "space-between", height: 1 }}>
        <ProgressBar percent={stats.cpu.load} label="Total" color="#58a6ff" />
        <text fg="#f85149" bold>{stats.cpu.temp ? `${Math.round(stats.cpu.temp)}°C` : "--°C"}</text>
      </box>
      
      <box style={{ marginTop: 1, flexDirection: "column" }}>
        <text fg="#8b949e" style={{ fontSize: 1, marginBottom: 0 }}>TEMPERATURE TREND</text>
        <Sparkline data={stats.tempHistory} color="#f85149" />
      </box>

      {/* Hide cores on very small displays to save vertical space */}
      {stats.cpu.cores.length <= 4 && (
        <box style={{ flexDirection: "column", marginTop: 0 }}>
          {stats.cpu.cores.slice(0, 2).map((load, i) => (
            <ProgressBar key={i} percent={load} label={`U${i}`} color="#3fb950" />
          ))}
        </box>
      )}
    </box>
  );
}

export function MemoryWidget({ stats }: { stats: SystemStats }) {
  const usedGB = (stats.mem.used / 1024 / 1024 / 1024).toFixed(1);
  const totalGB = (stats.mem.total / 1024 / 1024 / 1024).toFixed(1);
  const percent = (stats.mem.used / stats.mem.total) * 100;

  return (
    <box style={{ flexDirection: "column" }}>
      <ProgressBar percent={percent} label="RAM" color="#d29922" />
      <box style={{ flexDirection: "row", justifyContent: "space-between", height: 1 }}>
        <text fg="#8b949e">Usage</text>
        <text fg="#c9d1d9">{usedGB}G/{totalGB}G</text>
      </box>
    </box>
  );
}

export function DiskWidget({ stats }: { stats: SystemStats }) {
  const usedGB = (stats.disk.used / 1024 / 1024 / 1024).toFixed(1);
  const totalGB = (stats.disk.total / 1024 / 1024 / 1024).toFixed(1);

  return (
    <box style={{ flexDirection: "column" }}>
      <ProgressBar percent={stats.disk.use} label="Disk" color="#a5d6ff" />
      <box style={{ flexDirection: "row", justifyContent: "space-between", height: 1 }}>
        <text fg="#8b949e">Space</text>
        <text fg="#c9d1d9">{usedGB}G/{totalGB}G</text>
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

export function ProcessWidget({ stats }: { stats: SystemStats }) {
  return (
    <box style={{ flexDirection: "column", flex: 1 }}>
      {/* Absolute Header - No Flex */}
      <box style={{ flexDirection: "row", height: 1, padding: { left: 1, right: 1 }, borderStyle: "single", borderColor: "#30363d", border: { top: false, left: false, right: false, bottom: true } }}>
        <text style={{ width: 6, fg: "#58a6ff", bold: true }}>PID</text>
        <text style={{ width: 12, fg: "#58a6ff", marginLeft: 1, bold: true }}>COMMAND</text>
        <text style={{ width: 6, fg: "#58a6ff", textAlign: "right", marginLeft: 1, bold: true }}>CPU</text>
        <text style={{ width: 6, fg: "#58a6ff", textAlign: "right", marginLeft: 1, bold: true }}>MEM</text>
      </box>
      {/* Absolute Rows */}
      <box style={{ flexDirection: "column" }}>
        {stats.processes.list.slice(0, 5).map((proc, i) => (
          <box key={i} style={{ flexDirection: "row", height: 1, padding: { left: 1, right: 1 } }}>
            <text style={{ width: 6, fg: "#8b949e" }}>{proc.pid}</text>
            <text style={{ width: 12, fg: "#c9d1d9", marginLeft: 1 }} truncate="end">{proc.name}</text>
            <text style={{ width: 6, fg: "#3fb950", textAlign: "right", marginLeft: 1 }}>{Math.round(proc.cpu || 0)}%</text>
            <text style={{ width: 6, fg: "#d29922", textAlign: "right", marginLeft: 1 }}>{Math.round(proc.mem || 0)}%</text>
          </box>
        ))}
      </box>
      <text style={{ fg: "#484f58", height: 1, marginTop: 0 }} truncate="end">
        Th: {stats.processes.all} | Act: {stats.processes.running}
      </text>
    </box>
  );
}
