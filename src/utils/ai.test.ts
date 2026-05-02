import { expect, test, mock, describe, beforeEach, afterEach } from "bun:test";
import { fetchSarcasm, AIProvider } from "./ai";

describe("AI Model Tiers", () => {
  const originalEnv = { ...process.env };

  beforeEach(() => {
    process.env = { ...originalEnv };
  });

  afterEach(() => {
    process.env = originalEnv;
  });

  test("OpenRouter Tier 1 (Free) should use google/gemma-4-31b-it:free", async () => {
    process.env.AI_TIER = "1";
    process.env.OPENROUTER_API_KEY = "test-key";
    
    const fetchMock = mock((url, init) => {
      const body = JSON.parse(init.body);
      return Response.json({
        choices: [{ message: { content: `Model used: ${body.model}` } }]
      });
    });
    
    global.fetch = fetchMock;
    
    const result = await fetchSarcasm(5);
    expect(result.text).toContain("google/gemma-4-31b-it:free");
  });

  test("OpenRouter Tier 2 (Paid) should use anthropic/claude-3.5-sonnet", async () => {
    process.env.AI_TIER = "2";
    process.env.OPENROUTER_API_KEY = "test-key";
    
    const fetchMock = mock((url, init) => {
      const body = JSON.parse(init.body);
      return Response.json({
        choices: [{ message: { content: `Model used: ${body.model}` } }]
      });
    });
    
    global.fetch = fetchMock;
    
    const result = await fetchSarcasm(5);
    expect(result.text).toContain("anthropic/claude-3.5-sonnet");
  });

  test("Groq Tier 2 should use openai/gpt-oss-120b", async () => {
    process.env.AI_TIER = "2";
    process.env.GROQ_API_KEY = "test-key";
    
    const fetchMock = mock((url, init) => {
      const body = JSON.parse(init.body);
      return Response.json({
        choices: [{ message: { content: `Model used: ${body.model}` } }]
      });
    });
    
    global.fetch = fetchMock;
    
    const result = await fetchSarcasm(6);
    expect(result.text).toContain("openai/gpt-oss-120b");
  });

  test("Manual override should take precedence", async () => {
    process.env.AI_TIER = "2";
    process.env.OPENROUTER_API_KEY = "test-key";
    process.env.OPENROUTER_MODEL = "custom-model";
    
    const fetchMock = mock((url, init) => {
      const body = JSON.parse(init.body);
      return Response.json({
        choices: [{ message: { content: `Model used: ${body.model}` } }]
      });
    });
    
    global.fetch = fetchMock;
    
    const result = await fetchSarcasm(5);
    expect(result.text).toContain("custom-model");
  });
});
