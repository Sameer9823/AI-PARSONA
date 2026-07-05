"use client";

import { motion } from "framer-motion";

type PersonaId = "hitesh" | "piyush";

interface TypingIndicatorProps {
  personaId: PersonaId;
}

const TYPING_QUOTES: Record<PersonaId, string> = {
  hitesh: "Haan ji, isko aaram se samajhte hain...",
  piyush: "Chaliye, isko step by step break karte hain...",
};

export function TypingIndicator({ personaId }: TypingIndicatorProps) {
  const quote = TYPING_QUOTES[personaId];

  return (
    <div className="flex w-fit items-center gap-1.5 rounded-2xl bg-card px-4 py-3">
      {[0, 1, 2].map((i) => (
        <motion.span
          key={i}
          className="h-2 w-2 rounded-full bg-zinc-400"
          animate={{ y: [0, -5, 0] }}
          transition={{
            duration: 0.8,
            repeat: Infinity,
            delay: i * 0.15,
            ease: "easeInOut",
          }}
        />
      ))}

      <span className="ml-1 text-xs text-zinc-500">"{quote}"</span>
    </div>
  );
}