import { ChatMessage, PersonaId } from "@/types";
import { buildMemory, buildSystemPrompt } from "./prompts";
import { openrouter, isOpenRouterConfigured } from "./openrouter";
import { AI_MODEL, AI_TEMPERATURE, MEMORY_WINDOW } from "./config";
import type { ChatCompletionMessageParam } from "openai/resources/chat/completions";

/**
 * A normalized, user-facing error thrown for any AI failure. The API route
 * catches this and forwards `message` to the client, which shows it as a
 * toast notification.
 */
export class AIRequestError extends Error {
  status?: number;
  constructor(message: string, status?: number) {
    super(message);
    this.name = "AIRequestError";
    this.status = status;
  }
}

/**
 * Builds the OpenAI-compatible message array: system prompt (persona +
 * summarized older context) followed by the trimmed recent conversation.
 * Shared by both streaming and any future non-streaming callers.
 */
export function buildChatMessages(
  persona: PersonaId,
  history: ChatMessage[]
): ChatCompletionMessageParam[] {
  const { recent, summary } = buildMemory(history, MEMORY_WINDOW);
  const systemPrompt = buildSystemPrompt(persona, summary);

  const messages: ChatCompletionMessageParam[] = [
    { role: "system", content: systemPrompt },
  ];

  for (const m of recent) {
    // Skip any empty in-flight assistant placeholder from being sent back.
    if (!m.content) continue;
    messages.push({
      role: m.role === "user" ? "user" : "assistant",
      content: m.content,
    });
  }

  return messages;
}

function toFriendlyError(err: unknown): AIRequestError {
  // The OpenAI SDK throws `APIError` subclasses with a `status` code for
  // HTTP-level failures, and generic errors for network/timeout issues.
  const anyErr = err as any;
  const status: number | undefined = anyErr?.status;

  if (status === 401 || status === 403) {
    return new AIRequestError(
      "Invalid or missing OpenRouter API key. Please check OPENROUTER_API_KEY in your environment.",
      status
    );
  }
  if (status === 429) {
    return new AIRequestError(
      "OpenRouter rate limit reached. Please wait a moment and try again.",
      status
    );
  }
  if (status && status >= 500) {
    return new AIRequestError(
      "OpenRouter is temporarily unavailable. Please try again shortly.",
      status
    );
  }
  if (anyErr?.name === "AbortError" || anyErr?.code === "ETIMEDOUT") {
    return new AIRequestError("The request timed out. Please try again.");
  }
  if (anyErr?.code === "ENOTFOUND" || anyErr?.code === "ECONNREFUSED") {
    return new AIRequestError(
      "Network error while reaching OpenRouter. Check your connection and try again."
    );
  }

  return new AIRequestError(
    anyErr?.message || "Something went wrong while generating a response."
  );
}

/**
 * Streams a persona chat completion from OpenRouter, yielding plain text
 * chunks as they arrive. Throws `AIRequestError` with a friendly message on
 * any failure (invalid key, rate limit, network/timeout, etc).
 */
export async function* streamPersonaResponse(
  persona: PersonaId,
  history: ChatMessage[]
) {
  if (!isOpenRouterConfigured) {
    throw new AIRequestError(
      "OpenRouter API key is not configured. Set OPENROUTER_API_KEY in .env.local."
    );
  }

  const messages = buildChatMessages(persona, history);

  let stream: Awaited<ReturnType<typeof openrouter.chat.completions.create>>;
  try {
    stream = await openrouter.chat.completions.create({
      model: AI_MODEL,
      temperature: AI_TEMPERATURE,
      messages,
      stream: true,
    });
  } catch (err) {
    throw toFriendlyError(err);
  }

  let receivedAnyText = false;

  try {
  
    for await (const chunk of stream) {
      const text = chunk?.choices?.[0]?.delta?.content ?? "";
      if (text) {
        receivedAnyText = true;
        yield text;
      }
    }
  } catch (err) {
    throw toFriendlyError(err);
  }

  if (!receivedAnyText) {
    throw new AIRequestError(
      "The model returned an empty response. Please try again or rephrase your question."
    );
  }
}
