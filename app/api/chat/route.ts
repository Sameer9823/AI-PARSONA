import { NextRequest } from "next/server";
import { auth } from "@clerk/nextjs/server";
import { AIRequestError, streamPersonaResponse } from "@/lib/ai";
import { isOpenRouterConfigured } from "@/lib/openrouter";
import { encodeStreamError } from "@/lib/stream-protocol";
import { ChatMessage, PersonaId } from "@/types";

// Node runtime is required (not edge) since the OpenAI SDK relies on Node's
// http/https client internals for streaming.
export const runtime = "nodejs";

interface ChatRequestBody {
  persona: PersonaId;
  messages: ChatMessage[];
}

export async function POST(req: NextRequest) {
  const { userId } = await auth();
  if (!userId) {
    return new Response(JSON.stringify({ error: "Unauthorized" }), {
      status: 401,
    });
  }

  let body: ChatRequestBody;
  try {
    body = await req.json();
  } catch {
    return new Response(JSON.stringify({ error: "Invalid JSON body" }), {
      status: 400,
    });
  }

  const { persona, messages } = body;
  if (!persona || !Array.isArray(messages)) {
    return new Response(
      JSON.stringify({ error: "persona and messages are required" }),
      { status: 400 }
    );
  }

  // Fail fast (before opening the stream) if OpenRouter isn't configured at
  // all — this is the one case where we can still return a normal JSON error
  // with a real HTTP status, since no bytes have been sent to the client yet.
  if (!isOpenRouterConfigured) {
    return new Response(
      JSON.stringify({
        error:
          "OpenRouter API key is not configured. Set OPENROUTER_API_KEY in your environment.",
      }),
      { status: 500 }
    );
  }

  const encoder = new TextEncoder();

  const stream = new ReadableStream({
    async start(controller) {
      try {
        for await (const chunk of streamPersonaResponse(persona, messages)) {
          controller.enqueue(encoder.encode(chunk));
        }
        controller.close();
      } catch (err) {
        // Streaming has already started, so we can't change the HTTP status
        // here — instead we smuggle a friendly, user-facing error message
        // through the stream itself (see lib/stream-protocol.ts) so the
        // frontend can show a toast instead of rendering it as chat content.
        const message =
          err instanceof AIRequestError
            ? err.message
            : "Something went wrong while generating a response.";
        controller.enqueue(encoder.encode(encodeStreamError(message)));
        controller.close();
      }
    },
    cancel() {
      // Client aborted (Stop Generation) — the underlying OpenRouter request
      // is torn down automatically when this stream's consumer disconnects.
    },
  });

  return new Response(stream, {
    headers: {
      "Content-Type": "text/plain; charset=utf-8",
      "Cache-Control": "no-cache",
      "X-Content-Type-Options": "nosniff",
    },
  });
}
