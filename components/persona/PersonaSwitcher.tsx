"use client";

import { useState } from "react";
import Image from "next/image";
import { motion } from "framer-motion";
import { PERSONAS } from "@/lib/personas";
import { usePersonaContext } from "@/context/PersonaContext";
import { cn } from "@/lib/utils";
import type { Persona } from "@/types";

function SwitcherAvatar({ persona, active }: { persona: Persona; active: boolean }) {
  const [imageError, setImageError] = useState(false);

  const initials = persona.name
    .split(" ")
    .map((n) => n[0])
    .join("");

  const avatarSrc = persona.ui.avatar
    ? persona.ui.avatar.startsWith("/")
      ? persona.ui.avatar
      : `/${persona.ui.avatar}`
    : null;

  return (
    <span
      className={cn(
        "relative grid h-5 w-5 shrink-0 place-items-center overflow-hidden rounded-full text-[9px] font-bold",
        active ? "bg-white/20 text-white" : "bg-white/10 text-zinc-400"
      )}
    >
      {avatarSrc && !imageError ? (
        <Image
          src={avatarSrc}
          alt={persona.name}
          fill
          sizes="20px"
          className="object-cover"
          onError={() => setImageError(true)}
        />
      ) : (
        initials
      )}
    </span>
  );
}

export function PersonaSwitcher({ compact = false }: { compact?: boolean }) {
  const { personaId, switchPersona } = usePersonaContext();

  return (
    <div
      className={cn(
        "glass relative flex items-center gap-1 rounded-full p-1",
        compact ? "w-full" : "w-fit"
      )}
    >
      {Object.values(PERSONAS).map((p) => {
        const active = p.id === personaId;
        const isHitesh = p.id === "hitesh";

        return (
          <button
            key={p.id}
            onClick={() => switchPersona(p.id)}
            className={cn(
              "relative z-10 flex items-center gap-2 rounded-full px-3 py-1.5 text-xs font-medium sm:text-sm",
              compact && "flex-1 justify-center",
              active ? "text-white" : "text-zinc-400 hover:text-zinc-200"
            )}
          >
            {active && (
              <motion.span
                layoutId="persona-active-pill"
                transition={{ type: "spring", stiffness: 500, damping: 35 }}
                className={cn(
                  "absolute inset-0 -z-10 rounded-full shadow",
                  isHitesh
                    ? "bg-gradient-to-r from-emerald-500 to-green-600"
                    : `bg-gradient-to-r ${p.ui.gradient}`
                )}
              />
            )}

            <SwitcherAvatar persona={p} active={active} />

            {p.name.split(" ")[0]}
          </button>
        );
      })}
    </div>
  );
}