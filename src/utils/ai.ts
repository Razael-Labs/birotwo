export type AIProvider = 1 | 2 | 3 | 4 | 5 | 6;

const PROVIDER_NAMES: Record<number, string> = {
  1: "OpenAI",
  2: "Google Gemini",
  3: "DeepSeek",
  4: "Anthropic",
  5: "OpenRouter",
  6: "Groq"
};

const PROMPT = "Berikan satu kalimat sarkasme pendek dan tajam dalam bahasa Indonesia (maksimal 15 kata) tentang developer yang ceroboh atau suka membuat bug. Langsung berikan kalimatnya saja, tanpa tanda kutip.";

export async function fetchSarcasm(providerId: AIProvider): Promise<{ text: string; provider: string }> {
  const providerName = PROVIDER_NAMES[providerId] || "Unknown AI";
  const apiKey = getApiKey(providerId);

  if (!apiKey || apiKey.includes("your_")) {
    return { text: "API Key belum diatur di file .env. Saya diam saja ya.", provider: providerName };
  }

  try {
    let result = "";

    switch (providerId) {
      case 1: // OpenAI
        result = await callOpenAICompatible("https://api.openai.com/v1/chat/completions", apiKey, "gpt-3.5-turbo");
        break;
      case 2: // Gemini
        result = await callGemini(apiKey);
        break;
      case 3: // DeepSeek
        result = await callOpenAICompatible("https://api.deepseek.com/chat/completions", apiKey, "deepseek-chat");
        break;
      case 4: // Anthropic
        result = await callAnthropic(apiKey);
        break;
      case 5: // OpenRouter
        result = await callOpenAICompatible("https://openrouter.ai/api/v1/chat/completions", apiKey, "google/gemini-pro-1.5-exp-0827:free");
        break;
      case 6: // Groq
        result = await callOpenAICompatible("https://api.groq.com/openai/v1/chat/completions", apiKey, "llama3-8b-8192");
        break;
      default:
        return { text: "Provider tidak dikenal.", provider: "System" };
    }

    return { text: result.trim(), provider: providerName };
  } catch (e: any) {
    return { text: `Gagal memanggil AI: ${e.message}`, provider: providerName };
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
  const data: any = await res.json();
  return data.choices[0].message.content;
}

async function callGemini(key: string): Promise<string> {
  const res = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${key}`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      contents: [{ parts: [{ text: PROMPT }] }]
    })
  });
  const data: any = await res.json();
  return data.candidates[0].content.parts[0].text;
}

async function callAnthropic(key: string): Promise<string> {
  const res = await fetch("https://api.anthropic.com/v1/messages", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "x-api-key": key,
      "anthropic-version": "2023-06-01"
    },
    body: JSON.stringify({
      model: "claude-3-haiku-20240307",
      max_tokens: 50,
      messages: [{ role: "user", content: PROMPT }]
    })
  });
  const data: any = await res.json();
  return data.content[0].text;
}
