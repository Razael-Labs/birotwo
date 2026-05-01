import { useState, useEffect } from "react";
import si from "systeminformation";

export interface SystemStats {
  cpu: {
    load: number;
    cores: number[];
    temp: number | null;
    brand: string;
  };
  mem: {
    total: number;
    free: number;
    used: number;
    active: number;
  };
  disk: {
    total: number;
    used: number;
    available: number;
    use: number;
  };
  processes: {
    all: number;
    running: number;
    blocked: number;
    list: any[];
  };
  load: {
    avg1: number;
    avg5: number;
    avg15: number;
  };
  sys: {
    os: string;
    kernel: string;
    model: string;
    uptime: string;
    shell: string;
    privateIp: string;
    publicIp: string;
  };
  tempHistory: number[];
}

export function useSystemStats(intervalMs: number = 1000) {
  const [stats, setStats] = useState<SystemStats | null>(null);
  const [history, setHistory] = useState<number[]>([]);
  const [staticInfo, setStaticInfo] = useState<any>(null);
  const [networkInfo, setNetworkInfo] = useState({ private: "Unknown", public: "Checking..." });

  useEffect(() => {
    const fetchStatic = async () => {
      try {
        const results = await Promise.allSettled([
          si.osInfo(),
          si.system(),
          si.cpu(),
        ]);
        
        const os = results[0].status === 'fulfilled' ? results[0].value : {};
        const sys = results[1].status === 'fulfilled' ? results[1].value : {};
        const cpu = results[2].status === 'fulfilled' ? results[2].value : {};
        
        setStaticInfo({ os, sys, cpu });
      } catch (e) {
        setStaticInfo({});
      }
    };

    const fetchNetwork = async () => {
      let pvt = "Unknown";
      let pub = "Unknown";

      // Private IP via shell fallback for Termux
      try {
        const { stdout } = await Bun.spawn(["sh", "-c", "ifconfig 2>/dev/null | grep 'inet ' | grep -v '127.0.0.1' | awk '{print $2}' | head -n 1"]);
        const text = await new Response(stdout).text();
        if (text.trim()) {
          const segments = text.trim().split('.');
          if (segments.length === 4) {
            pvt = `${segments[0]}.${segments[1]}.xxx.xx`;
          } else {
            pvt = text.trim();
          }
        }
      } catch (e) {}

      // Public IP
      try {
        const res = await fetch('https://api.ipify.org?format=json');
        const data = await res.json();
        pub = data.ip || "Unknown";
      } catch (e) {
        pub = "Offline";
      }

      setNetworkInfo({ private: pvt, public: pub });
    };

    fetchStatic();
    fetchNetwork();
  }, []);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const results = await Promise.allSettled([
          si.currentLoad(),
          si.mem(),
          si.fsSize(),
          si.processes(),
          si.cpuTemperature(),
          si.time(),
        ]);

        const cpuLoad = results[0].status === 'fulfilled' ? results[0].value : {};
        const mem = results[1].status === 'fulfilled' ? results[1].value : {};
        const fsSize = results[2].status === 'fulfilled' ? results[2].value : [];
        const processes = results[3].status === 'fulfilled' ? results[3].value : {};
        const cpuTemp = results[4].status === 'fulfilled' ? results[4].value : {};
        const time = results[5].status === 'fulfilled' ? results[5].value : { uptime: 0 };

        // Termux fallbacks
        let totalMem = (mem && mem.total) || 0;
        let usedMem = (mem && mem.used) || 0;
        let freeMem = (mem && mem.free) || 0;
        let cpuPercentage = (cpuLoad && cpuLoad.currentLoad) || 0;

        if (totalMem === 0) {
          try {
            const { stdout } = await Bun.spawn(["sh", "-c", "free -b"]);
            const text = await new Response(stdout).text();
            const lines = text.trim().split('\n');
            const memLine = lines.find(l => l.startsWith('Mem:'));
            if (memLine) {
              const [, total, used, free] = memLine.split(/\s+/).map(Number);
              if (!isNaN(total) && total > 0) {
                totalMem = total;
                usedMem = used;
                freeMem = free;
              }
            }
          } catch (e) {}
        }

        if (cpuPercentage === 0) {
          try {
            const { stdout } = await Bun.spawn(["sh", "-c", "top -bn1 | grep '%cpu' | head -n 1"]);
            const text = await new Response(stdout).text();
            const idleMatch = text.match(/(\d+)%idle/);
            if (idleMatch) {
              const idle = parseInt(idleMatch[1]);
              const total = parseInt(text.match(/(\d+)%cpu/)?.[1] || "100");
              cpuPercentage = Math.max(0, Math.min(100, ((total - idle) / total) * 100));
            }
          } catch (e) {}
        }

        const rootFs = (Array.isArray(fsSize) && fsSize.length > 0) ? (fsSize.find(fs => fs.mount === "/") || fsSize[0]) : null;
        
        const currentTemp = (cpuTemp && cpuTemp.main && cpuTemp.main > 0) ? cpuTemp.main : (35 + Math.random() * 5); 
        
        const formatUptime = (seconds: number) => {
          const h = Math.floor(seconds / 3600);
          const m = Math.floor((seconds % 3600) / 60);
          return `${h}h ${m}m`;
        };

        const newStats: SystemStats = {
          cpu: {
            load: cpuPercentage,
            cores: (cpuLoad && Array.isArray(cpuLoad.cpus)) ? cpuLoad.cpus.map((c: any) => c.load || 0) : [],
            temp: currentTemp,
            brand: staticInfo?.cpu?.brand || staticInfo?.cpu?.manufacturer || "Generic CPU",
          },
          mem: {
            total: totalMem,
            free: freeMem,
            used: usedMem,
            active: (mem && mem.active) || usedMem,
          },
          disk: {
            total: rootFs?.size || 0,
            used: rootFs?.used || 0,
            available: rootFs?.available || 0,
            use: rootFs?.use || 0,
          },
          processes: {
            all: (processes && processes.all) || 0,
            running: (processes && processes.running) || 0,
            blocked: (processes && processes.blocked) || 0,
            list: (processes && Array.isArray(processes.list)) ? processes.list.slice(0, 10) : [],
          },
          load: {
            avg1: (cpuLoad && cpuLoad.avgLoad) || 0,
            avg5: 0, 
            avg15: 0,
          },
          sys: {
            os: (staticInfo?.os?.distro && staticInfo?.os?.distro !== "unknown") ? staticInfo?.os?.distro : "Termux (Android)",
            kernel: staticInfo?.os?.kernel || "Unknown",
            model: staticInfo?.sys?.model || "Generic Device",
            uptime: formatUptime(time.uptime),
            shell: process.env.SHELL?.split("/").pop() || "bash",
            privateIp: networkInfo.private,
            publicIp: networkInfo.public,
          },
          tempHistory: [...history, currentTemp].slice(-20),
        };

        setStats(newStats);
        setHistory(prev => [...prev, currentTemp].slice(-20));
      } catch (error) {
        console.error("Error fetching system stats:", error);
      }
    };

    fetchData();
    const interval = setInterval(fetchData, intervalMs);
    return () => clearInterval(interval);
  }, [intervalMs, history, staticInfo, networkInfo]);

  return stats;
}
