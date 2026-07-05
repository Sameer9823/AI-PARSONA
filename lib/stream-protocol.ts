/**
 * Tiny isomorphic protocol used to smuggle a graceful error message inside an
 * otherwise plain-text streaming response.
 *
 * The `/api/chat` route streams raw text chunks (no SSE/JSON framing) so the
 * client can render tokens as they arrive. If the AI provider fails *after*
 * streaming has already started (e.g. a mid-stream rate limit), we can't
 * change the HTTP status anymore — so instead we append a chunk wrapped in a
 * marker that's vanishingly unlikely to appear in real model output. The
 * client (see hooks/useChat.ts) detects the marker, strips it from the
 * visible message, and surfaces the error as a toast instead.
 */

const MARKER = "\u241F__PERSONA_AI_STREAM_ERROR__\u241F";

export function encodeStreamError(message: string): string {
  return `${MARKER}${message}${MARKER}`;
}

export function extractStreamError(
  raw: string
): { content: string; error: string | null } {
  const start = raw.indexOf(MARKER);
  if (start === -1) return { content: raw, error: null };

  const end = raw.indexOf(MARKER, start + MARKER.length);
  const content = raw.slice(0, start);
  const error =
    end === -1
      ? raw.slice(start + MARKER.length)
      : raw.slice(start + MARKER.length, end);

  return { content, error: error || "Something went wrong. Please try again." };
}
