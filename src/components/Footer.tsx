import React, { useState, useEffect } from "react";
import { useTerminalDimensions } from "@opentui/react";
import { fetchSarcasm, AIProvider } from "../utils/ai";

export function Footer() {
  const { width } = useTerminalDimensions();
  const [frame, setFrame] = useState(0);
  const [aiQuote, setAiQuote] = useState<{ text: string, provider: string }>({ 
    text: "System initializing...", 
    provider: "AI" 
  });

  useEffect(() => {
    const loadAiQuote = async () => {
      const providerId = parseInt(process.env.PROVIDER || "2") as AIProvider;
      const quote = await fetchSarcasm(providerId);
      setAiQuote(quote);
    };

    loadAiQuote();
  }, []);

  useEffect(() => {
    const timer = setInterval(() => {
      setFrame((prev) => (prev + 1) % 500);
    }, 120);
    return () => clearInterval(timer);
  }, []);

  const eye = frame % 10 > 5 ? "󰈈" : "󰈉";
  
  // Robust layout calculation
  const paddingLeft = 12;
  const paddingRight = 2;
  const availableWidth = Math.max(20, width - paddingLeft - paddingRight);
  const textToDisplay = aiQuote.text;
  
  // Calculate dynamic border width based on content, but capped at available width
  const borderWidth = Math.min(availableWidth, textToDisplay.length + 2);

  return (
    <box style={{ height: 4, borderStyle: "single", borderColor: "#30363d", border: { top: true, left: false, right: false, bottom: false }, marginTop: 1, overflow: "hidden" }}>
      <box style={{ flexDirection: "row", alignItems: "center", padding: { left: 2, top: 0 } }}>
        {/* AI Icon Section */}
        <box style={{ flexDirection: "column", alignItems: "center", width: 8 }}>
          <text fg="#58a6ff" bold>  󰚩  </text>
          <text fg="#58a6ff">  {eye}  </text>
        </box>

        {/* Quote Bubble Section */}
        <box style={{ flexDirection: "column", marginLeft: 1 }}>
          <text fg="#8b949e">╭{"─".repeat(borderWidth)}╮</text>
          <box style={{ flexDirection: "row" }}>
            <text fg="#8b949e">│ </text>
            <text fg="#c9d1d9" italic truncate="end" style={{ maxWidth: availableWidth - 2 }}>{textToDisplay}</text>
            <text fg="#8b949e"> │</text>
          </box>
          <text fg="#8b949e">╰{"─".repeat(borderWidth)}╯</text>
        </box>
      </box>

      {/* Version & Info Label */}
      <box style={{ position: "absolute", bottom: 0, right: 1 }}>
         <text fg="#8b949e" italic>Biro v2.0 • {aiQuote.provider} Assistant</text>
      </box>
    </box>
  );
}
