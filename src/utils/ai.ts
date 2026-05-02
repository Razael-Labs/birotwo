export type AIProvider = 1 | 2 | 3 | 4 | 5 | 6;

const PROVIDER_NAMES: Record<number, string> = {
  1: "OpenAI",
  2: "Google Gemini",
  3: "DeepSeek",
  4: "Anthropic",
  5: "OpenRouter",
  6: "Groq"
};

const PROMPT = "Provide one short, sharp sarcastic sentence in English (max 15 words) about a clumsy developer or someone who loves making bugs. Directly provide the sentence without quotes.";

function getModel(providerId: AIProvider): string {
  const tier = parseInt(process.env.AI_TIER || "1", 10);
  switch (providerId) {
    case 1:
      return process.env.OPENAI_MODEL || "gpt-4o-mini";
    case 2:
      if (process.env.GEMINI_MODEL) return process.env.GEMINI_MODEL;
      return tier >= 2 ? "gemini-1.5-pro" : "gemini-1.5-flash";
    case 3:
      return process.env.DEEPSEEK_MODEL || "deepseek-chat";
    case 4:
      return process.env.ANTHROPIC_MODEL || "claude-3-5-haiku-latest";
    case 5:
      if (process.env.OPENROUTER_MODEL) return process.env.OPENROUTER_MODEL;
      return tier >= 2 ? "anthropic/claude-3.5-sonnet" : "google/gemma-4-31b-it:free";
    case 6:
      if (process.env.GROQ_MODEL) return process.env.GROQ_MODEL;
      return tier >= 2 ? "openai/gpt-oss-120b" : "llama-3.3-70b-versatile";
    default:
      return "";
  }
}

export async function fetchSarcasm(providerId: AIProvider): Promise<{ text: string; provider: string }> {
  const providerName = PROVIDER_NAMES[providerId] || "Unknown AI";
  const apiKey = getApiKey(providerId);
  const model = getModel(providerId);

  if (!apiKey || apiKey.trim() === "" || apiKey.includes("your_")) {
    return { text: "API Key not set in .env file.", provider: providerName };
  }

  try {
    let result = "";

    switch (providerId) {
      case 1: // OpenAI
        result = await callOpenAICompatible("https://api.openai.com/v1/chat/completions", apiKey, model);
        break;
      case 2: // Gemini
        result = await callGemini(apiKey, model);
        break;
      case 3: // DeepSeek
        result = await callOpenAICompatible("https://api.deepseek.com/chat/completions", apiKey, model);
        break;
      case 4: // Anthropic
        result = await callAnthropic(apiKey, model);
        break;
      case 5: // OpenRouter
        result = await callOpenAICompatible("https://openrouter.ai/api/v1/chat/completions", apiKey, model);
        break;
      case 6: // Groq
        result = await callOpenAICompatible("https://api.groq.com/openai/v1/chat/completions", apiKey, model);
        break;
      default:
        return { text: "Unknown provider.", provider: "System" };
    }

    return { text: result.trim(), provider: providerName };
  } catch (e: any) {
    const errorMsg = e.message || "Unknown error";
    return { text: `Failed to call AI: ${errorMsg.slice(0, 60)}${errorMsg.length > 60 ? '...' : ''}`, provider: providerName };
  }
}

function getApiKey(id: AIProvider): string | undefined {
  switch (id) {
    case 1: return process.env.OPENAI_API_KEY;
    case 2: return process.env.GEMINI_API_KEY;
    case 3: return process.env.DEEPSEEK_API_KEY;
    case 4: return process.env.ANTHROPIC_API_KEY;
    case 5: return process.env.OPENROUTER_API_KEY;
    case 6: return process.env.GROQ_API_KEY;
    default: return undefined;
  }
}

async function safeJsonParse(res: Response): Promise<any> {
  const text = await res.text();
  try {
    return JSON.parse(text);
  } catch (e) {
    throw new Error(`Response not JSON: ${text.slice(0, 50)}`);
  }
}

async function callOpenAICompatible(url: string, key: string, model: string): Promise<string> {
  const res = await fetch(url, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "Authorization": `Bearer ${key}`
    },
    body: JSON.stringify({
      model,
      messages: [{ role: "user", content: PROMPT }],
      max_tokens: 50
    })
  });

  const data = await safeJsonParse(res);
  
  if (!res.ok) {
    throw new Error(data?.error?.message || data?.message || `HTTP ${res.status}`);
  }
  
  const content = data?.choices?.[0]?.message?.content;
  if (content) return content;
  
  throw new Error("Unknown API response format");
}

async function callGemini(key: string, model: string): Promise<string> {
  const res = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent?key=${key}`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      contents: [{ parts: [{ text: PROMPT }] }]
    })
  });

  const data = await safeJsonParse(res);

  if (!res.ok) {
    throw new Error(data?.error?.message || data?.message || `HTTP ${res.status}`);
  }

  const text = data?.candidates?.[0]?.content?.parts?.[0]?.text;
  if (text) return text;
  
  throw new Error("Unknown Gemini response format");
}

async function callAnthropic(key: string, model: string): Promise<string> {
  const res = await fetch("https://api.anthropic.com/v1/messages", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "x-api-key": key,
      "anthropic-version": "2023-06-01"
    },
    body: JSON.stringify({
      model,
      max_tokens: 50,
      messages: [{ role: "user", content: PROMPT }]
    })
  });

  const data = await safeJsonParse(res);

  if (!res.ok) {
    throw new Error(data?.error?.message || data?.message || `HTTP ${res.status}`);
  }

  const text = data?.content?.[0]?.text;
  if (text) return text;
  
  throw new Error("Unknown Anthropic response format");
}
