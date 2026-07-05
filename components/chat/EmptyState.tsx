"use client";

import { useState } from "react";
import Image from "next/image";
import { motion } from "framer-motion";
import { Persona } from "@/types";
import { cn } from "@/lib/utils";

function HeroAvatar({ persona }: { persona: Persona }) {
  const [imageError, setImageError] = useState(false);

  const avatarSrc = persona.ui.avatar
    ? persona.ui.avatar.startsWith("/")
      ? persona.ui.avatar
      : `/${persona.ui.avatar}`
    : null;

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.8 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.4 }}
      className={cn(
        "relative mb-5 grid h-20 w-20 place-items-center overflow-hidden rounded-3xl bg-gradient-to-br text-3xl font-bold text-white shadow-lg animate-float",
        persona.ui.gradient
      )}
    >
      {avatarSrc && !imageError ? (
        <Image
          src={avatarSrc}
          alt={persona.name}
          fill
          sizes="80px"
          className="object-cover"
          onError={() => setImageError(true)}
        />
      ) : (
        persona.name[0]
      )}
    </motion.div>
  );
}

export function EmptyState({
  persona,
  onSelectQuestion,
}: {
  persona: Persona;
  onSelectQuestion: (q: string) => void;
}) {
  return (
    <div className="flex min-h-full flex-col items-center justify-center px-4 py-8 text-center">
      <HeroAvatar persona={persona} />
      <h2 className="text-xl font-semibold">{persona.ui.greeting}</h2>
      <p className="mt-2 max-w-md text-sm text-zinc-400">
        Ask anything about web dev, backend, or your career — {persona.name.split(" ")[0]}-style.
      </p>

      <div className="mt-6 grid w-full max-w-lg grid-cols-1 gap-2 sm:grid-cols-2">
        {persona.sampleQuestions.map((q) => (
          <button
            key={q}
            onClick={() => onSelectQuestion(q)}
            className="glass rounded-xl px-4 py-3 text-left text-sm text-zinc-300 transition-colors hover:bg-white/10"
          >
            {q}
          </button>
        ))}
      </div>
    </div>
  );
}