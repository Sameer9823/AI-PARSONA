"use client";

import { useCallback, useRef, useState } from "react";
import { ChatMessage, PersonaId } from "@/types";
import { addMessage, getConversation, saveConversation } from "@/lib/storage";
import { extractStreamError } from "@/lib/stream-protocol";
import { generateId } from "@/lib/utils";
import { toast } from "sonner";

export function useChat(conversationId: string, personaId: PersonaId) {
  const [messages, setMessages] = useState<ChatMessage[]>(() => {
    const conv = getConversation(conversationId);
    return conv?.messages ?? [];
  });
  const [isStreaming, setIsStreaming] = useState(false);
  const abortRef = useRef<AbortController | null>(null);

  const reload = useCallback(() => {
    const conv = getConversation(conversationId);
    setMessages(conv?.messages ?? []);
  }, [conversationId]);

  const runStream = useCallback(
    async (history: ChatMessage[], assistantId: string) => {
      abortRef.current = new AbortController();
      setIsStreaming(true);
      try {
        const res = await fetch("/api/chat", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ persona: personaId, messages: history }),
          signal: abortRef.current.signal,
        });

        if (!res.ok || !res.body) {
          const errBody = await res.json().catch(() => ({}));
          throw new Error(errBody?.error || "Failed to get a response.");
        }

        const reader = res.body.getReader();
        const decoder = new TextDecoder();
        let acc = "";
        let streamError: string | null = null;

        while (true) {
          const { done, value } = await reader.read();
          if (done) break;
          acc += decoder.decode(value, { stream: true });

          const { content, error } = extractStreamError(acc);
          if (error) {
            streamError = error;
            setMessages((prev) =>
              prev.map((m) => (m.id === assistantId ? { ...m, content } : m))
            );
            break; // stop reading further chunks once the error marker is seen
          }

          setMessages((prev) =>
            prev.map((m) => (m.id === assistantId ? { ...m, content } : m))
          );
        }

        // Whatever we saw is authoritative for what gets persisted, with the
        // error marker (if any) stripped out.
        const { content: finalContent } = extractStreamError(acc);

        if (streamError) {
          toast.error("AI response interrupted", { description: streamError });
        }

        const persistedContent =
          finalContent || (streamError ? "_I couldn't finish that response. Please try again._" : "");

        const conv = getConversation(conversationId);
        if (conv) {
          conv.messages = conv.messages.map((m) =>
            m.id === assistantId ? { ...m, content: persistedContent } : m
          );
          conv.updatedAt = Date.now();
          saveConversation(conv);
        }
        if (streamError && !finalContent) {
          setMessages((prev) =>
            prev.map((m) => (m.id === assistantId ? { ...m, content: persistedContent } : m))
          );
        }
      } catch (err: any) {
        if (err?.name !== "AbortError") {
          toast.error("Something went wrong", {
            description: err?.message || "Please try again.",
          });
          setMessages((prev) =>
            prev.map((m) =>
              m.id === assistantId && !m.content
                ? { ...m, content: "_Sorry, I couldn't generate a response. Please try again._" }
                : m
            )
          );
        }
      } finally {
        setIsStreaming(false);
        abortRef.current = null;
      }
    },
    [conversationId, personaId]
  );

  const sendMessage = useCallback(
    async (content: string) => {
      if (!content.trim() || isStreaming) return;

      const userMsg: ChatMessage = {
        id: generateId(),
        role: "user",
        content: content.trim(),
        timestamp: Date.now(),
      };
      const assistantMsg: ChatMessage = {
        id: generateId(),
        role: "assistant",
        content: "",
        timestamp: Date.now(),
      };

      addMessage(conversationId, userMsg);
      const convAfterUser = getConversation(conversationId);
      const history = convAfterUser?.messages ?? [userMsg];

      addMessage(conversationId, assistantMsg);
      setMessages((prev) => [...prev, userMsg, assistantMsg]);

      await runStream(history, assistantMsg.id);
    },
    [conversationId, isStreaming, runStream]
  );

  const regenerate = useCallback(async () => {
    if (isStreaming) return;
    const conv = getConversation(conversationId);
    if (!conv || conv.messages.length === 0) return;

    const lastAssistantIdx = [...conv.messages]
      .map((m, i) => ({ m, i }))
      .reverse()
      .find((x) => x.m.role === "assistant")?.i;

    if (lastAssistantIdx === undefined) return;

    const history = conv.messages.slice(0, lastAssistantIdx);
    const newAssistant: ChatMessage = {
      id: generateId(),
      role: "assistant",
      content: "",
      timestamp: Date.now(),
    };
    conv.messages = [...history, newAssistant];
    saveConversation(conv);
    setMessages(conv.messages);

    await runStream(history, newAssistant.id);
  }, [conversationId, isStreaming, runStream]);

  const stopGeneration = useCallback(() => {
    abortRef.current?.abort();
  }, []);

  return { messages, isStreaming, sendMessage, regenerate, stopGeneration, reload };
}
