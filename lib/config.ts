/**
 * Central model configuration.
 *
 * This is the ONLY place the active LLM model should be defined. Every AI
 * request in the app (lib/openrouter.ts -> app/api/chat/route.ts) imports
 * `AI_MODEL` from here, so switching models is a one-line change — no other
 * file needs to be touched.
 *
 * Models are routed through OpenRouter (https://openrouter.ai), which exposes
 * a single OpenAI-compatible API for many underlying providers.
 */

export const AI_MODEL = "meta-llama/llama-3.3-70b-instruct";

// Swap the line above with any of these (or another OpenRouter model id)
// to change providers without touching any other file:
// export const AI_MODEL = "openai/gpt-4.1-mini";
// export const AI_MODEL = "anthropic/claude-3.7-sonnet";
// export const AI_MODEL = "meta-llama/llama-3.3-70b-instruct";
// export const AI_MODEL = "qwen/qwen3-235b-a22b";

/** Sampling temperature used for all persona chat completions. */
export const AI_TEMPERATURE = 0.7;

/** How many of the most recent messages to send verbatim (see lib/prompts.ts). */
export const MEMORY_WINDOW = 12;
