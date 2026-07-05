"use client";

import { motion } from "framer-motion";
import { Sparkles, Github, Linkedin, Globe, Mail } from "lucide-react";

const FOOTER_LINKS = [
  { label: "Features", href: "#features" },
  { label: "Mentors", href: "#mentors" },
  { label: "FAQ", href: "#faq" },
  { label: "GitHub", href: "https://github.com/Sameer9823" },
];

const SOCIAL_LINKS = [
  { key: "github", Icon: Github, href: "https://github.com/Sameer9823" },
  { key: "linkedin", Icon: Linkedin, href: "https://linkedin.com/in/sameer-selokar-60435224b" },
  { key: "portfolio", Icon: Globe, href: "https://sameer-selokar.vercel.app" },
  { key: "email", Icon: Mail, href: "mailto:sameerselokar9823@gmail.com" },
];

const BUILT_WITH = ["Next.js", "Llama", "OpenRouter", "Clerk"];

export function Footer() {
  return (
    <footer className="glass relative mx-auto mt-6 max-w-6xl overflow-hidden rounded-t-2xl border border-white/5 border-b-0 px-4 pb-3 pt-4 sm:px-6">
      {/* animated top gradient border */}
      <div className="absolute inset-x-0 top-0 h-px overflow-hidden">
        <motion.div
          animate={{ x: ["-100%", "100%"] }}
          transition={{ duration: 4, repeat: Infinity, ease: "linear" }}
          className="h-full w-1/2 bg-gradient-to-r from-transparent via-accent-purple to-transparent"
        />
      </div>

      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        {/* left: logo + description */}
        <div className="flex items-center gap-2">
          <span className="grid h-7 w-7 place-items-center rounded-lg bg-gradient-to-br from-accent-purple to-accent-blue">
            <Sparkles className="h-3.5 w-3.5 text-white" />
          </span>
          <div className="leading-tight">
            <p className="text-sm font-semibold">Persona AI</p>
            <p className="text-[11px] text-zinc-500">Learn from AI mentors</p>
          </div>
        </div>

        {/* center: links */}
        <nav className="flex flex-wrap items-center justify-center gap-x-4 gap-y-1">
          {FOOTER_LINKS.map((link) => (
            <a
              key={link.label}
              href={link.href}
              target={link.href.startsWith("http") ? "_blank" : undefined}
              rel={link.href.startsWith("http") ? "noopener noreferrer" : undefined}
              className="text-xs text-zinc-400 transition-colors hover:text-zinc-100"
            >
              {link.label}
            </a>
          ))}
        </nav>

        {/* right: social icons */}
        <div className="flex items-center justify-center gap-1.5">
          {SOCIAL_LINKS.map(({ key, Icon, href }) => (
            <a
              key={key}
              href={href}
              target="_blank"
              rel="noopener noreferrer"
              className="grid h-7 w-7 place-items-center rounded-full border border-white/10 text-zinc-400 transition-all hover:-translate-y-0.5 hover:border-white/20 hover:text-zinc-100"
            >
              <Icon className="h-3.5 w-3.5" />
            </a>
          ))}
        </div>
      </div>

      {/* bottom line */}
      <div className="mt-2.5 flex flex-col items-center gap-1 border-t border-white/5 pt-2 text-center sm:flex-row sm:justify-between sm:text-left">
        <p className="text-[11px] text-zinc-500">
          © {new Date().getFullYear()} Persona AI. Built for educational
          purposes.
        </p>
        <p className="flex items-center gap-1.5 text-[11px] text-zinc-500">
          Built with
          {BUILT_WITH.map((tech, i) => (
            <span key={tech}>
              <span className="text-zinc-400">{tech}</span>
              {i < BUILT_WITH.length - 1 && <span className="mx-0.5">·</span>}
            </span>
          ))}
        </p>
      </div>
    </footer>
  );
}