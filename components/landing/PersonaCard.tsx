"use client";

import { useRef, useState } from "react";
import Image from "next/image";
import {
  motion,
  useMotionValue,
  useSpring,
  useTransform,
} from "framer-motion";
import { Persona } from "@/types";
import { cn } from "@/lib/utils";
import { ExternalLink, Globe, Youtube, Linkedin, Github, Twitter } from "lucide-react";

const SOURCE_ICONS: Record<string, typeof Globe> = {
  "Official Website": Globe,
  "YouTube (Chai aur Code)": Youtube,
  "YouTube": Youtube,
  "GitHub": Github,
  "LinkedIn": Linkedin,
  "X": Twitter,
};

function getSourceIcon(label: string) {
  return SOURCE_ICONS[label] ?? Globe;
}

export function PersonaCard({
  persona,
  index,
}: {
  persona: Persona;
  index: number;
}) {
  const cardRef = useRef<HTMLDivElement>(null);
  const [imageError, setImageError] = useState(false);
  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);

  const rotateX = useSpring(
    useTransform(mouseY, [-0.5, 0.5], [8, -8]),
    { stiffness: 200, damping: 20 }
  );
  const rotateY = useSpring(
    useTransform(mouseX, [-0.5, 0.5], [-8, 8]),
    { stiffness: 200, damping: 20 }
  );

  function handleMouseMove(e: React.MouseEvent<HTMLDivElement>) {
    const rect = cardRef.current?.getBoundingClientRect();
    if (!rect) return;
    mouseX.set((e.clientX - rect.left) / rect.width - 0.5);
    mouseY.set((e.clientY - rect.top) / rect.height - 0.5);
  }

  function handleMouseLeave() {
    mouseX.set(0);
    mouseY.set(0);
  }

  const initials = persona.name
    .split(" ")
    .map((n) => n[0])
    .join("");

  // website is shown separately as "Reference source", so exclude it from the icon row
  const iconLinks = persona.sources.filter((s) => s.label !== "Official Website");

  return (
    <motion.div
      ref={cardRef}
      style={{ rotateX, rotateY, transformPerspective: 800 }}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      initial={{ opacity: 0, y: 24 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      whileHover={{ scale: 1.03 }}
      transition={{ duration: 0.5, delay: index * 0.1 }}
      className="glass group relative overflow-hidden rounded-2xl border border-white/5 p-6 transition-shadow hover:shadow-2xl hover:shadow-accent-purple/10"
    >
      <div
        className={cn(
          "absolute -top-16 -right-16 h-40 w-40 rounded-full bg-gradient-to-br opacity-30 blur-2xl transition-opacity duration-500 group-hover:opacity-50",
          persona.ui.gradient
        )}
      />

      <div className="relative" style={{ transform: "translateZ(30px)" }}>
        <div
          className={cn(
            "relative mb-4 grid h-20 w-20 place-items-center overflow-hidden rounded-2xl bg-gradient-to-br text-3xl font-bold text-white shadow-lg",
            persona.ui.gradient
          )}
        >
          {persona.ui.avatar && !imageError ? (
            <Image
              src={
                persona.ui.avatar.startsWith("/")
                  ? persona.ui.avatar
                  : `/${persona.ui.avatar}`
              }
              alt={persona.name}
              fill
              sizes="80px"
              className="object-cover"
              onError={() => setImageError(true)}
            />
          ) : (
            initials
          )}
        </div>

        <h3 className="text-2xl font-semibold tracking-tight">
          {persona.name}
        </h3>
        <p className="mt-1 text-sm text-zinc-400">{persona.role}</p>
        <p className="mt-3 text-sm leading-relaxed text-zinc-300">
          {persona.ui.tagline}
        </p>

        {persona.personality.expertise.length > 0 && (
          <div className="mt-4 flex flex-wrap gap-1.5">
            {persona.personality.expertise.slice(0, 5).map((tag) => (
              <span
                key={tag}
                className="rounded-full border border-white/10 bg-white/[0.04] px-2.5 py-1 text-[11px] text-zinc-300"
              >
                {tag}
              </span>
            ))}
          </div>
        )}

        <div className="mt-5 flex items-center justify-between border-t border-white/5 pt-4">
          <a
            href={persona.website}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-1.5 text-xs text-zinc-400 transition-colors hover:text-zinc-200"
          >
            Reference source
            <ExternalLink className="h-3 w-3" />
          </a>

          {iconLinks.length > 0 && (
            <div className="flex items-center gap-2">
              {iconLinks.map(({ label, url }) => {
                const Icon = getSourceIcon(label);
                return (
                  <a
                    key={label}
                    href={url}
                    target="_blank"
                    rel="noopener noreferrer"
                    aria-label={label}
                    className="grid h-7 w-7 place-items-center rounded-full border border-white/10 text-zinc-400 transition-colors hover:border-white/20 hover:text-zinc-100"
                  >
                    <Icon className="h-3.5 w-3.5" />
                  </a>
                );
              })}
            </div>
          )}
        </div>
      </div>
    </motion.div>
  );
}