import React, { useState, useEffect, useMemo } from "react";
import { useTerminalDimensions } from "@opentui/react";
import { fetchSarcasm, AIProvider } from "../utils/ai";

type FooterStyle = "droid" | "shinkansen" | "satellite" | "pacman" | "bot";

export function Footer() {
  const { width } = useTerminalDimensions();
  const [frame, setFrame] = useState(0);
  const [aiQuote, setAiQuote] = useState<{ text: string, provider: string }>({ text: "Sistem sedang inisialisasi...", provider: "AI" });
  
  // Pick a random style once on component mount
  const style = useMemo<FooterStyle>(() => {
    const styles: FooterStyle[] = ["droid", "shinkansen", "satellite", "pacman", "bot"];
    return styles[Math.floor(Math.random() * styles.length)];
  }, []);

  useEffect(() => {
    const loadAiQuote = async () => {
      const providerId = parseInt(process.env.PROVIDER || "2") as AIProvider;
      const quote = await fetchSarcasm(providerId);
      setAiQuote(quote);
    };

    if (style === "bot") {
      loadAiQuote();
    }
  }, [style]);

  useEffect(() => {
    const interval = style === "shinkansen" ? 50 : 120;
    const timer = setInterval(() => {
      setFrame((prev) => (prev + 1) % 500);
    }, interval);
    return () => clearInterval(timer);
  }, [style]);

  const renderContent = () => {
    switch (style) {
      case "bot": {
        const eye = frame % 10 > 5 ? "󰈈" : "󰈉";
        const maxTextWidth = Math.max(10, width - 20);
        return (
          <box style={{ flexDirection: "row", alignItems: "center", padding: { left: 2 } }}>
            <box style={{ flexDirection: "column", alignItems: "center", width: 4 }}>
              <text fg="#58a6ff" bold> 󰚩 </text>
              <text fg="#58a6ff">{eye}</text>
            </box>
            <box style={{ flexDirection: "column", marginLeft: 1 }}>
              <text fg="#8b949e" style={{ fontSize: 0.8 }}> ╭{"─".repeat(Math.min(maxTextWidth, aiQuote.text.length + 2))}╮ </text>
              <box style={{ flexDirection: "row" }}>
                <text fg="#8b949e"> │ </text>
                <text fg="#c9d1d9" italic truncate="end" style={{ maxWidth: maxTextWidth }}>{aiQuote.text}</text>
                <text fg="#8b949e"> │ </text>
              </box>
              <text fg="#8b949e" style={{ fontSize: 0.8 }}> ╰{"─".repeat(Math.min(maxTextWidth, aiQuote.text.length + 2))}╯ </text>
            </box>
          </box>
        );
      }
      case "droid": {
        const pos = (frame % (width + 10)) - 10;
        return (
          <box style={{ flexDirection: "row", marginLeft: Math.max(0, pos) }}>
            <text fg="#8b949e">· · · </text>
            <text fg="#58a6ff" bold>󱚝</text>
            <text fg="#444c56">{" ".repeat(4)}</text>
            <text fg="#f85149">󰗀</text>
          </box>
        );
      }
      case "shinkansen": {
        const windChars = ["  ~  ", " ~   ", "~    ", "    ~", "   ~ "];
        const wind = windChars[frame % 5].repeat(width / 5);
        return (
          <box style={{ flexDirection: "column", alignItems: "center" }}>
            <text fg="#484f58" style={{ height: 1 }}>{wind}</text>
            <text fg="#58a6ff" bold>  󱙝󱙝󱙝󱙝󱙝󱙝󱙝󱙝󱙝󱙝󱙝󱙝󱙝󱙝󱙝󱙝󱙝󱙝󱙝󱙝󱙝󱙝󱙝󱙝󱙝󱙝󱙝󱙝󱙝󱙝󱙝󱙝󱙝󱙝󱙝󱙝󱙝󱙝󱙝󱙝 </text>
            <text fg="#30363d">  ⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯</text>
          </box>
        );
      }
      case "satellite": {
        const satellitePos = Math.floor(width / 2) + Math.sin(frame / 5) * 15;
        const beam = frame % 2 === 0 ? "󱄄" : " ";
        return (
          <box style={{ flexDirection: "column", alignItems: "flex-start", padding: { left: Math.floor(satellitePos) } }}>
            <text fg="#58a6ff" bold>󰚀</text>
            <text fg="#8b949e">{beam}</text>
          </box>
        );
      }
      case "pacman": {
        const pos = frame % (width + 5);
        const pacmanIcon = frame % 2 === 0 ? "󰚥" : "󰚦";
        return (
          <box style={{ flexDirection: "row", marginLeft: pos }}>
            <text fg="#d29922" bold>{pacmanIcon}</text>
            <text fg="#484f58"> · · · · · · · · · ·</text>
          </box>
        );
      }
    }
  };

  const getStyleName = () => {
    const names: Record<string, string> = { 
      droid: "Debug Mode", 
      shinkansen: "Aero Bullet", 
      satellite: "Cyber Scan", 
      pacman: "Retro Cruise",
      bot: `${aiQuote.provider} Assistant`
    };
    return names[style] || "Biro v2.0";
  };

  return (
    <box style={{ height: 4, borderStyle: "single", borderColor: "#30363d", border: { top: true, left: false, right: false, bottom: false }, marginTop: 1, overflow: "hidden", flexDirection: "column" }}>
      <box style={{ flex: 1, justifyContent: "center" }}>
        {renderContent()}
      </box>
      <box style={{ position: "absolute", bottom: 0, right: 1 }}>
         <text fg="#8b949e" italic>Biro v2.0 - {getStyleName()}</text>
      </box>
    </box>
  );
}
