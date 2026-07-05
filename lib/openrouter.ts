import OpenAI from "openai";

/**
 * Shared OpenRouter client.
 *
 * OpenRouter (https://openrouter.ai) exposes an OpenAI-compatible REST API,
 * so we reuse the official `openai` SDK and simply point it at OpenRouter's
 * base URL with an OpenRouter API key. Every AI request in the app must go
 * through this single client — do not instantiate the SDK anywhere else.
 */

const apiKey = process.env.OPENROUTER_API_KEY;

if (!apiKey && process.env.NODE_ENV !== "test") {
  // Don't throw at import time (would crash the whole server on boot);
  // the API route checks for this and returns a friendly error instead.
  console.warn(
    "[openrouter] OPENROUTER_API_KEY is not set. AI requests will fail until it is configured in .env.local."
  );
}

export const openrouter = new OpenAI({
  baseURL: "https://openrouter.ai/api/v1",
  apiKey: apiKey || "missing-api-key",
  defaultHeaders: {
    // Optional but recommended by OpenRouter for analytics/rate-limit tiers.
    "HTTP-Referer": process.env.NEXT_PUBLIC_APP_URL || "https://persona-ai.example.com",
    "X-Title": "Persona AI",
  },
});

/** True when a real API key has been configured. */
export const isOpenRouterConfigured = Boolean(apiKey);
