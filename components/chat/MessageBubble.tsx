"use client";

import { useState } from "react";
import Image from "next/image";
import { motion } from "framer-motion";
import { ChatMessage, Persona } from "@/types";
import { cn, formatTime } from "@/lib/utils";
import { Markdown } from "./Markdown";
import { Check, Copy, Pin, RotateCcw, User } from "lucide-react";
import { toast } from "sonner";

interface MessageBubbleProps {
  message: ChatMessage;
  persona: Persona;
  isLast: boolean;
  isStreaming: boolean;
  onRegenerate: () => void;
  onTogglePin: () => void;
}

function AssistantAvatar({ persona }: { persona: Persona }) {
  const [imageError, setImageError] = useState(false);

  const avatarSrc = persona.ui.avatar
    ? persona.ui.avatar.startsWith("/")
      ? persona.ui.avatar
      : `/${persona.ui.avatar}`
    : null;

  return (
    <div
      className={cn(
        "relative grid h-8 w-8 flex-shrink-0 place-items-center overflow-hidden rounded-full text-xs font-semibold text-white",
        `bg-gradient-to-br ${persona.ui.gradient}`
      )}
      aria-hidden="true"
    >
      {avatarSrc && !imageError ? (
        <Image
          src={avatarSrc}
          alt={persona.name}
          fill
          sizes="32px"
          className="object-cover"
          onError={() => setImageError(true)}
        />
      ) : (
        persona.name[0]
      )}
    </div>
  );
}

export function MessageBubble({
  message,
  persona,
  isLast,
  isStreaming,
  onRegenerate,
  onTogglePin,
}: MessageBubbleProps) {
  const [copied, setCopied] = useState(false);
  const [isCopying, setIsCopying] = useState(false);

  const isUser = message.role === "user";
  const isAssistant = message.role === "assistant";
  const showThinking = !message.content && isStreaming && isLast;

  const handleCopy = async () => {
    if (!message.content || isCopying) return;

    try {
      setIsCopying(true);

      if ("clipboard" in navigator && navigator.clipboard?.writeText) {
        await navigator.clipboard.writeText(message.content);
      } else {
        throw new Error("Clipboard API not available");
      }

      setCopied(true);
      toast.success("Copied to clipboard");
      window.setTimeout(() => setCopied(false), 1500);
    } catch {
      toast.error("Failed to copy message");
    } finally {
      setIsCopying(false);
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.25 }}
      className={cn(
        "flex gap-3 px-1",
        isUser ? "flex-row-reverse" : "flex-row"
      )}
    >
      {isUser ? (
        <div
          className="grid h-8 w-8 flex-shrink-0 place-items-center rounded-full bg-zinc-700 text-xs font-semibold text-white"
          aria-hidden="true"
        >
          <User className="h-4 w-4" />
        </div>
      ) : (
        <AssistantAvatar persona={persona} />
      )}

      <div
        className={cn(
          "max-w-[85%] sm:max-w-[75%]",
          isUser && "flex flex-col items-end"
        )}
      >
        <div
          className={cn(
            "rounded-2xl px-4 py-3",
            isUser
              ? "bg-gradient-to-br from-accent-purple to-accent-blue text-white"
              : "border border-white/5 bg-card"
          )}
        >
          {message.content ? (
            isUser ? (
              <p className="whitespace-pre-wrap text-[0.95rem]">
                {message.content}
              </p>
            ) : (
              <Markdown content={message.content} />
            )
          ) : showThinking ? (
            <span className="text-sm text-zinc-500" aria-live="polite">
              Thinking...
            </span>
          ) : null}
        </div>

        <div className="mt-1 flex items-center gap-2 px-1 text-[11px] text-zinc-500">
          <span>{formatTime(message.timestamp)}</span>

          {isAssistant && !!message.content && (
            <>
              <button
                type="button"
                onClick={handleCopy}
                disabled={isCopying}
                aria-label={copied ? "Copied message" : "Copy message"}
                title={copied ? "Copied" : "Copy"}
                className="flex items-center gap-1 rounded-sm hover:text-zinc-300 disabled:cursor-not-allowed disabled:opacity-60"
              >
                {copied ? (
                  <Check className="h-3 w-3" />
                ) : (
                  <Copy className="h-3 w-3" />
                )}
              </button>

              <button
                type="button"
                onClick={onTogglePin}
                aria-label={message.pinned ? "Unpin message" : "Pin message"}
                title={message.pinned ? "Unpin" : "Pin"}
                className="flex items-center gap-1 rounded-sm hover:text-zinc-300"
              >
                <Pin
                  className={cn(
                    "h-3 w-3",
                    message.pinned && "fill-current text-accent-purple"
                  )}
                />
              </button>

              {isLast && (
                <button
                  type="button"
                  onClick={onRegenerate}
                  aria-label="Regenerate response"
                  title="Regenerate"
                  className="flex items-center gap-1 rounded-sm hover:text-zinc-300"
                >
                  <RotateCcw className="h-3 w-3" />
                  <span>Regenerate</span>
                </button>
              )}
            </>
          )}
        </div>
      </div>
    </motion.div>
  );
}