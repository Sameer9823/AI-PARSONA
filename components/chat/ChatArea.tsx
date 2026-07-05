"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { ArrowDown } from "lucide-react";
import { Persona } from "@/types";
import { MessageBubble } from "./MessageBubble";
import { EmptyState } from "./EmptyState";
import { ChatInput } from "./ChatInput";
import { useChat } from "@/hooks/useChat";
import { togglePinMessage } from "@/lib/storage";
import { cn } from "@/lib/utils";

interface ChatAreaProps {
  conversationId: string;
  persona: Persona;
}

export function ChatArea({ conversationId, persona }: ChatAreaProps) {
  const { messages, isStreaming, sendMessage, regenerate, stopGeneration } =
    useChat(conversationId, persona.id);

  const scrollContainerRef = useRef<HTMLDivElement>(null);
  const bottomRef = useRef<HTMLDivElement>(null);
  const [shouldAutoScroll, setShouldAutoScroll] = useState(true);
  const [isScrolled, setIsScrolled] = useState(false);
  const [newMessageCount, setNewMessageCount] = useState(0);

  const lastAssistantId = useMemo(() => {
    return [...messages].reverse().find((m) => m.role === "assistant")?.id;
  }, [messages]);

  useEffect(() => {
    if (shouldAutoScroll) {
      bottomRef.current?.scrollIntoView({
        behavior: isStreaming ? "auto" : "smooth",
        block: "end",
      });
      setNewMessageCount(0);
    } else if (messages.length > 0) {
      setNewMessageCount((c) => c + 1);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [messages, isStreaming]);

  const handleScroll = () => {
    const el = scrollContainerRef.current;
    if (!el) return;

    const distanceFromBottom = el.scrollHeight - el.scrollTop - el.clientHeight;
    const atBottom = distanceFromBottom < 120;
    setShouldAutoScroll(atBottom);
    setIsScrolled(el.scrollTop > 8);
    if (atBottom) setNewMessageCount(0);
  };

  const scrollToBottom = () => {
    setShouldAutoScroll(true);
    setNewMessageCount(0);
    bottomRef.current?.scrollIntoView({ behavior: "smooth", block: "end" });
  };

  const handleTogglePin = (messageId: string) => {
    togglePinMessage(conversationId, messageId);
  };

  const hasMessages = messages.length > 0;

  return (
    <div className="relative flex h-full min-h-0 flex-col bg-background">
      {/* ambient backdrop, tinted to the active persona */}
      <div className="pointer-events-none absolute inset-0 overflow-hidden">
        <motion.div
          key={persona.id}
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 0.08, scale: 1 }}
          transition={{ duration: 1.2, ease: "easeOut" }}
          className={cn(
            "absolute -top-40 left-1/2 h-80 w-[40rem] -translate-x-1/2 rounded-full bg-gradient-to-br blur-3xl",
            persona.ui.gradient
          )}
        />
        <div
          className={cn(
            "absolute -bottom-32 right-0 h-64 w-64 rounded-full bg-gradient-to-tr opacity-[0.05] blur-3xl sm:h-96 sm:w-96",
            persona.ui.gradient
          )}
        />
        <div
          className="absolute inset-0 opacity-[0.025]"
          style={{
            backgroundImage:
              "radial-gradient(circle, rgba(255,255,255,0.5) 1px, transparent 1px)",
            backgroundSize: "22px 22px",
          }}
        />
      </div>

      {/* top hairline + fade, appears once scrolled — signals more content above */}
      <div
        className={cn(
          "pointer-events-none absolute inset-x-0 top-0 z-10 h-px bg-white/10 transition-opacity duration-300",
          isScrolled ? "opacity-100" : "opacity-0"
        )}
      />
      <div
        className={cn(
          "pointer-events-none absolute inset-x-0 top-0 z-10 h-8 bg-gradient-to-b from-background via-background/60 to-transparent transition-opacity duration-300",
          isScrolled ? "opacity-100" : "opacity-0"
        )}
      />

      <div
        ref={scrollContainerRef}
        onScroll={handleScroll}
        className="relative flex-1 overflow-y-auto overscroll-contain px-3 py-5 sm:px-6 sm:py-8"
      >
        {!hasMessages ? (
          <EmptyState persona={persona} onSelectQuestion={sendMessage} />
        ) : (
          <div className="mx-auto flex w-full max-w-3xl flex-col gap-4 sm:gap-5">
            <AnimatePresence initial={false}>
              {messages.map((message) => (
                <MessageBubble
                  key={message.id}
                  message={message}
                  persona={persona}
                  isLast={message.id === lastAssistantId}
                  isStreaming={isStreaming}
                  onRegenerate={regenerate}
                  onTogglePin={() => handleTogglePin(message.id)}
                />
              ))}
            </AnimatePresence>

            <div ref={bottomRef} className="h-1 w-full shrink-0" />
          </div>
        )}
      </div>

      {/* floating "jump to latest" pill */}
      <AnimatePresence>
        {hasMessages && !shouldAutoScroll && (
          <motion.button
            type="button"
            initial={{ opacity: 0, y: 10, scale: 0.9 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 10, scale: 0.9 }}
            transition={{ duration: 0.2, ease: "easeOut" }}
            onClick={scrollToBottom}
            className="glass absolute bottom-4 left-1/2 z-10 flex -translate-x-1/2 items-center gap-1.5 rounded-full border border-white/10 px-3.5 py-2 text-xs font-medium text-zinc-200 shadow-lg shadow-black/20 backdrop-blur-xl transition-colors hover:bg-white/10 active:scale-95 sm:bottom-6"
          >
            {newMessageCount > 0 && (
              <span
                className={cn(
                  "flex h-4 min-w-4 items-center justify-center rounded-full bg-gradient-to-br px-1 text-[10px] font-semibold text-white",
                  persona.ui.gradient
                )}
              >
                {newMessageCount > 9 ? "9+" : newMessageCount}
              </span>
            )}
            <ArrowDown className="h-3.5 w-3.5" />
            <span className="hidden sm:inline">
              {isStreaming ? "Jump to latest" : "Scroll to bottom"}
            </span>
          </motion.button>
        )}
      </AnimatePresence>

      <div className="relative border-t border-white/5 bg-background/80 backdrop-blur-xl [padding-bottom:env(safe-area-inset-bottom)]">
        <ChatInput
          onSend={sendMessage}
          isStreaming={isStreaming}
          onStop={stopGeneration}
        />
      </div>
    </div>
  );
}