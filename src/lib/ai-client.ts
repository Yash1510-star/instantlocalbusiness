/**
 * Provider-agnostic AI client.
 * Swap the provider in .env without changing any other code.
 *
 * Supported providers:
 *   openai    — GPT-4o mini (default, cheapest, best value)
 *   anthropic — Claude 3.5 Haiku (best writing quality per dollar)
 *   gemini    — Gemini 2.0 Flash (absolute cheapest)
 *
 * Set in .env.local:
 *   AI_PROVIDER=openai          (default)
 *   AI_MODEL=gpt-4o-mini        (default)
 *   OPENAI_API_KEY=sk-...
 *   ANTHROPIC_API_KEY=sk-ant-...
 *   GEMINI_API_KEY=...
 */

export type AIMessage = {
  role: "system" | "user" | "assistant";
  content: string;
};

export type AIResponse = {
  text: string;
  provider: string;
  model: string;
  inputTokens?: number;
  outputTokens?: number;
  estimatedCost?: number;
};

// Cost per 1M tokens (input / output) in USD
const COST_TABLE: Record<string, { input: number; output: number }> = {
  "gpt-4o-mini":               { input: 0.15,  output: 0.60  },
  "gpt-4o":                    { input: 2.50,  output: 10.00 },
  "claude-3-5-haiku-20241022": { input: 0.80,  output: 4.00  },
  "claude-3-5-sonnet-20241022":{ input: 3.00,  output: 15.00 },
  "gemini-2.0-flash":          { input: 0.10,  output: 0.40  },
  "deepseek-chat":             { input: 0.14,  output: 0.28  }, // DeepSeek V4 Flash (alias)
  "deepseek-v4-flash":         { input: 0.14,  output: 0.28  }, // DeepSeek V4 Flash
  "deepseek-v4-pro":           { input: 0.435, output: 0.87  }, // DeepSeek V4 Pro (discounted)
};

function estimateCost(model: string, inputTokens: number, outputTokens: number): number {
  const costs = COST_TABLE[model];
  if (!costs) return 0;
  return (inputTokens / 1_000_000) * costs.input + (outputTokens / 1_000_000) * costs.output;
}

// ─── OpenAI ──────────────────────────────────────────────────────────────────

async function callOpenAI(messages: AIMessage[], model: string): Promise<AIResponse> {
  const OpenAI = (await import("openai")).default;
  const client = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

  const response = await client.chat.completions.create({
    model,
    messages,
    temperature: 0.7,
    max_tokens: 2000,
  });

  const text = response.choices[0]?.message?.content ?? "";
  const inputTokens = response.usage?.prompt_tokens ?? 0;
  const outputTokens = response.usage?.completion_tokens ?? 0;

  return {
    text,
    provider: "openai",
    model,
    inputTokens,
    outputTokens,
    estimatedCost: estimateCost(model, inputTokens, outputTokens),
  };
}

// ─── Anthropic ───────────────────────────────────────────────────────────────

async function callAnthropic(messages: AIMessage[], model: string): Promise<AIResponse> {
  const Anthropic = (await import("@anthropic-ai/sdk")).default;
  const client = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY });

  // Anthropic separates system messages
  const systemMsg = messages.find((m) => m.role === "system")?.content ?? "";
  const userMessages = messages
    .filter((m) => m.role !== "system")
    .map((m) => ({ role: m.role as "user" | "assistant", content: m.content }));

  const response = await client.messages.create({
    model,
    max_tokens: 2000,
    system: systemMsg,
    messages: userMessages,
  });

  const text = response.content[0]?.type === "text" ? response.content[0].text : "";
  const inputTokens = response.usage.input_tokens;
  const outputTokens = response.usage.output_tokens;

  return {
    text,
    provider: "anthropic",
    model,
    inputTokens,
    outputTokens,
    estimatedCost: estimateCost(model, inputTokens, outputTokens),
  };
}

// ─── DeepSeek ────────────────────────────────────────────────────────────────
// DeepSeek uses an OpenAI-compatible API — same SDK, different base URL

async function callDeepSeek(messages: AIMessage[], model: string): Promise<AIResponse> {
  const OpenAI = (await import("openai")).default;
  const client = new OpenAI({
    apiKey: process.env.DEEPSEEK_API_KEY,
    baseURL: "https://api.deepseek.com/v1",
    timeout: 25000, // 25s timeout — fail fast instead of hanging
  });

  const response = await client.chat.completions.create({
    model,
    messages,
    temperature: 0.7,
    max_tokens: 2000,
  });

  const text = response.choices[0]?.message?.content ?? "";
  const inputTokens = response.usage?.prompt_tokens ?? 0;
  const outputTokens = response.usage?.completion_tokens ?? 0;

  return {
    text,
    provider: "deepseek",
    model,
    inputTokens,
    outputTokens,
    estimatedCost: estimateCost(model, inputTokens, outputTokens),
  };
}

// ─── Gemini ──────────────────────────────────────────────────────────────────

async function callGemini(messages: AIMessage[], model: string): Promise<AIResponse> {
  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) throw new Error("GEMINI_API_KEY not set");

  // Gemini uses a REST API — no official Node SDK needed
  const systemMsg = messages.find((m) => m.role === "system")?.content ?? "";
  const userMsg = messages
    .filter((m) => m.role !== "system")
    .map((m) => m.content)
    .join("\n\n");

  const fullPrompt = systemMsg ? `${systemMsg}\n\n${userMsg}` : userMsg;

  const res = await fetch(
    `https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent?key=${apiKey}`,
    {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        contents: [{ parts: [{ text: fullPrompt }] }],
        generationConfig: { temperature: 0.7, maxOutputTokens: 2000 },
      }),
    }
  );

  if (!res.ok) {
    const err = await res.text();
    throw new Error(`Gemini API error: ${err}`);
  }

  const data = await res.json();
  const text = data.candidates?.[0]?.content?.parts?.[0]?.text ?? "";
  const inputTokens = data.usageMetadata?.promptTokenCount ?? 0;
  const outputTokens = data.usageMetadata?.candidatesTokenCount ?? 0;

  return {
    text,
    provider: "gemini",
    model,
    inputTokens,
    outputTokens,
    estimatedCost: estimateCost(model, inputTokens, outputTokens),
  };
}

// ─── Daily spend tracking (in-memory, resets on server restart) ──────────────
// For hard guardrails, set spending limits directly on your AI provider dashboard.
// This is a soft in-process guard for extra protection.

let dailySpend = 0;
let spendDay = new Date().toDateString();

function trackSpend(cost: number) {
  const today = new Date().toDateString();
  if (today !== spendDay) {
    dailySpend = 0;
    spendDay = today;
  }
  dailySpend += cost;
}

function getDailyBudgetLimit(): number {
  return parseFloat(process.env.AI_DAILY_BUDGET_USD ?? "5.00");
}

// ─── Main exported function ──────────────────────────────────────────────────

export async function generateText(messages: AIMessage[]): Promise<AIResponse> {
  // Enforce daily spend cap
  const budget = getDailyBudgetLimit();
  if (dailySpend >= budget) {
    throw new Error(
      `Daily AI budget of $${budget} reached. Try again tomorrow or contact support.`
    );
  }

  const provider = process.env.AI_PROVIDER ?? "openai";
  const model = process.env.AI_MODEL ?? "gpt-4o-mini";

  let result: AIResponse;
  switch (provider) {
    case "anthropic":
      result = await callAnthropic(messages, model);
      break;
    case "gemini":
      result = await callGemini(messages, model);
      break;
    case "deepseek":
      result = await callDeepSeek(messages, model);
      break;
    case "openai":
    default:
      result = await callOpenAI(messages, model);
  }

  trackSpend(result.estimatedCost ?? 0);
  return result;
}
