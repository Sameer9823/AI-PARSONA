"use client";

import { useEffect, useRef, useState } from "react";
import { ArrowUp, Square } from "lucide-react";
import { cn } from "@/lib/utils";

const MAX_CHARS = 4000;

export function ChatInput({
  onSend,
  isStreaming,
  onStop,
}: {
  onSend: (text: string) => void;
  isStreaming: boolean;
  onStop: () => void;
}) {
  const [value, setValue] = useState("");
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  useEffect(() => {
    const el = textareaRef.current;
    if (!el) return;
    el.style.height = "auto";
    el.style.height = Math.min(el.scrollHeight, 200) + "px";
  }, [value]);

  const submit = () => {
    if (!value.trim() || isStreaming) return;
    onSend(value);
    setValue("");
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      submit();
    }
  };

  return (
    <div className="border-t border-white/5 bg-background/80 p-3 backdrop-blur-xl sm:p-4">
      <div className="glass mx-auto flex max-w-3xl items-end gap-2 rounded-2xl p-2 sm:p-3">
        <textarea
          ref={textareaRef}
          value={value}
          onChange={(e) => setValue(e.target.value.slice(0, MAX_CHARS))}
          onKeyDown={handleKeyDown}
          rows={1}
          placeholder="Message your mentor..."
          className="max-h-[200px] flex-1 resize-none bg-transparent px-2 py-1.5 text-sm text-zinc-100 outline-none placeholder:text-zinc-500"
        />
        <span className="hidden pb-2 text-[11px] text-zinc-500 sm:block">
          {value.length}/{MAX_CHARS}
        </span>

        {isStreaming ? (
          <button
            onClick={onStop}
            className="grid h-9 w-9 flex-shrink-0 place-items-center rounded-full bg-red-500/90 text-white transition-transform hover:scale-105"
            aria-label="Stop generation"
          >
            <Square className="h-4 w-4 fill-current" />
          </button>
        ) : (
          <button
            onClick={submit}
            disabled={!value.trim()}
            className={cn(
              "grid h-9 w-9 flex-shrink-0 place-items-center rounded-full transition-transform",
              value.trim()
                ? "bg-gradient-to-br from-accent-purple to-accent-blue text-white hover:scale-105"
                : "bg-white/10 text-zinc-500"
            )}
            aria-label="Send message"
          >
            <ArrowUp className="h-4 w-4" />
          </button>
        )}
      </div>
      <p className="mt-1.5 text-center text-[11px] text-zinc-600">
        Enter to send • Shift + Enter for new line
      </p>
    </div>
  );
}
