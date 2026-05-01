import { useState, useEffect } from "react";
import { readdir, stat } from "node:fs/promises";
import { join } from "node:path";

export interface ProjectInfo {
  name: string;
  path: string;
  isGit: boolean;
  lastOpened: number;
}

export function useRecentProjects() {
  const [projects, setProjects] = useState<ProjectInfo[]>([]);
  const [hasGit, setHasGit] = useState(false);
  const [hasGh, setHasGh] = useState(false);

  useEffect(() => {
    const checkTools = async () => {
      try {
        const gitCheck = await Bun.spawn(["which", "git"]).exited;
        const ghCheck = await Bun.spawn(["which", "gh"]).exited;
        setHasGit(gitCheck === 0);
        setHasGh(ghCheck === 0);
      } catch (e) {
        setHasGit(false);
        setHasGh(false);
      }
    };

    checkTools();
  }, []);

  useEffect(() => {
    const fetchProjects = async () => {
      const historyFile = ".biro_history.json";
      let history: Record<string, number> = {};

      try {
        const file = Bun.file(historyFile);
        if (await file.exists()) {
          history = await file.json();
        }
      } catch (e) {}

      // Record current project as opened
      const currentPath = process.cwd();
      const currentName = currentPath.split("/").pop() || "current";
      history[currentName] = Date.now();

      try {
        await Bun.write(historyFile, JSON.stringify(history, null, 2));
      } catch (e) {}

      // Scan parent directory for other projects
      const projectList: ProjectInfo[] = [];
      try {
        const parentPath = "..";
        const entries = await readdir(parentPath, { withFileTypes: true });
        
        for (const entry of entries) {
          if (!entry.isDirectory()) continue;
          const dirName = entry.name;
          
          // Skip hidden folders or node_modules
          if (dirName.startsWith(".") || dirName === "node_modules") continue;

          const fullPath = join(parentPath, dirName);
          let isGit = false;
          try {
            const gitStat = await stat(join(fullPath, ".git"));
            isGit = gitStat.isDirectory();
          } catch (e) {}
          
          projectList.push({
            name: dirName,
            path: fullPath,
            isGit,
            lastOpened: history[dirName] || 0
          });
        }
      } catch (e) {
        console.error("Error scanning projects:", e);
      }

      // Sort by lastOpened, then by name
      projectList.sort((a, b) => {
        if (b.lastOpened !== a.lastOpened) return b.lastOpened - a.lastOpened;
        return a.name.localeCompare(b.name);
      });

      setProjects(projectList.slice(0, 8)); // Take up to 8
    };

    fetchProjects();
  }, [hasGit, hasGh]);

  return { projects, hasGit, hasGh };
}
