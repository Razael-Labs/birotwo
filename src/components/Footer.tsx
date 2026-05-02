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
  
  // Memoize layout calculations to avoid repeating them every 120ms
  const bubbleContent = React.useMemo(() => {
    const paddingLeft = 12;
    const paddingRight = 2;
    const availableWidth = Math.max(20, (width || 80) - paddingLeft - paddingRight);
    const textToDisplay = aiQuote.text;
    const borderWidth = Math.min(availableWidth, textToDisplay.length + 2);
    const borderLine = "─".repeat(borderWidth);
    
    return {
      text: textToDisplay,
      borderLine,
      availableWidth,
    };
  }, [width, aiQuote.text]);

  return (
    <box style={{ height: 4, borderStyle: "single", borderColor: "#30363d", border: ["top"], marginTop: 1, overflow: "hidden" } as any}>
      <box style={{ flexDirection: "row", alignItems: "center", padding: 1 } as any}>
        {/* AI Icon Section */}
        <box style={{ flexDirection: "column", alignItems: "center", width: 8 } as any}>
          <text style={{ fg: "#58a6ff", bold: true } as any}>  󰚩  </text>
          <text style={{ fg: "#58a6ff" } as any}>  {eye}  </text>
        </box>

        {/* Quote Bubble Section */}
        <box style={{ flexDirection: "column", marginLeft: 1 } as any}>
          <text style={{ fg: "#8b949e" } as any}>╭{bubbleContent.borderLine}╮</text>
          <box style={{ flexDirection: "row" } as any}>
            <text style={{ fg: "#8b949e" } as any}>│ </text>
            <text style={{ fg: "#c9d1d9", italic: true, truncate: "end", maxWidth: bubbleContent.availableWidth - 2 } as any}>{bubbleContent.text}</text>
            <text style={{ fg: "#8b949e" } as any}> │</text>
          </box>
          <text style={{ fg: "#8b949e" } as any}>╰{bubbleContent.borderLine}╯</text>
        </box>
      </box>

      {/* Version & Info Label */}
      <box style={{ position: "absolute", bottom: 0, right: 1 } as any}>
         <text style={{ fg: "#8b949e", italic: true } as any}>Biro v2.0 • {aiQuote.provider} Assistant</text>
      </box>
    </box>
  );
}
