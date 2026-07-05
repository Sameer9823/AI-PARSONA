"use client";

import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { SignInButton, SignedIn, SignedOut } from "@clerk/nextjs";
import Link from "next/link";
import {
  ArrowRight,
  ChevronDown,
  Sparkles,
  Code2,
  Zap,
  Brain,
  MessageSquare,
  ShieldCheck,
  Braces,
  History,
  Rocket,
  UserCheck,
  Send,
  Plus,
} from "lucide-react";
import { PersonaCard } from "./PersonaCard";
import { PERSONAS } from "@/lib/personas";

const TECH_BADGES = [
  { label: "Gemini 2.5 Flash" },
  { label: "LangChain" },
  { label: "Next.js 15" },
  { label: "Clerk Auth" },
];

const STATS = [
  { value: "2", label: "AI Mentors" },
  { value: "24/7", label: "Availability" },
  { value: "100%", label: "Free to chat" },
];

const CHAT_SCRIPT = [
  { from: "user", text: "How do React Hooks work?" },
  {
    from: "hitesh",
    name: "HC",
    text: "Think of Hooks as a way to plug into React's lifecycle without writing a class. useState is your memory, useEffect is your reaction to change.",
  },
  { from: "user", text: "Node vs Express?" },
  {
    from: "piyush",
    name: "PG",
    text: "Express sits on top of Node — it just gives you routing, middleware, and structure so you're not reinventing the wheel.",
    code: "app.get('/api/users', getUsers)",
  },
];

const FEATURES = [
  {
    icon: Brain,
    title: "Persona-driven answers",
    description:
      "Every response is shaped by a mentor's real teaching style — not a generic chatbot voice.",
  },
  {
    icon: MessageSquare,
    title: "Streaming conversations",
    description:
      "Replies stream in token by token over SSE, so it feels like a real mentor typing back to you.",
  },
  {
    icon: Braces,
    title: "Code that actually runs",
    description:
      "Ask for a snippet and get properly formatted, syntax-highlighted code you can copy straight into your editor.",
  },
  {
    icon: History,
    title: "Full chat history",
    description:
      "Every conversation is saved to your account, so you can pick up a thread days later without losing context.",
  },
  {
    icon: ShieldCheck,
    title: "Secure by default",
    description:
      "Authentication is handled by Clerk, so your sessions and data stay protected without extra setup.",
  },
  {
    icon: Rocket,
    title: "Built for real topics",
    description:
      "React, Node, system design, DSA, and career advice — the exact areas these mentors are known for.",
  },
];

const STEPS = [
  {
    number: "01",
    icon: UserCheck,
    title: "Sign in",
    description:
      "Create an account in seconds with Clerk — no lengthy forms, just a click.",
  },
  {
    number: "02",
    icon: Sparkles,
    title: "Pick your mentor",
    description:
      "Choose between Hitesh AI and Piyush AI depending on what you want to learn.",
  },
  {
    number: "03",
    icon: Send,
    title: "Start chatting",
    description:
      "Ask your question and get a response shaped by that mentor's real teaching style, streamed live.",
  },
];


const FAQS = [
  {
    question: "Are these the real Hitesh Choudhary and Piyush Garg?",
    answer:
      "No. These are AI personas modeled on their publicly available teaching style and content. They aren't affiliated with or endorsed by either mentor.",
  },
  {
    question: "What can I actually ask?",
    answer:
      "Anything around React, Node.js, backend architecture, system design, DSA, or general dev career advice — the areas each persona is tuned for.",
  },
  {
    question: "Is my chat history saved?",
    answer:
      "Yes. Once you sign in with Clerk, every conversation is stored to your account so you can return to it later.",
  },
  {
    question: "What powers the responses?",
    answer:
      "Persona AI is powered by Meta Llama through OpenRouter. Responses combine advanced language models with custom persona instructions and conversation context to create engaging, educational interactions inspired by different teaching styles.",
  },
  {
    question: "Is Persona AI free to use?",
    answer:
      "Yes, chatting with both mentors is free. Just sign in to get started.",
  },
];

function useTypedChat() {
  const [visible, setVisible] = useState(0);
  const [typing, setTyping] = useState(false);

  useEffect(() => {
    let mounted = true;
    let i = 0;

    const step = () => {
      if (!mounted) return;
      setTyping(true);
      const delay = i === 0 ? 400 : 1100;
      setTimeout(() => {
        if (!mounted) return;
        setTyping(false);
        setVisible(i + 1);
        i += 1;
        if (i < CHAT_SCRIPT.length) {
          setTimeout(step, 900);
        } else {
          setTimeout(() => {
            if (!mounted) return;
            i = 0;
            setVisible(0);
            step();
          }, 2600);
        }
      }, delay);
    };

    step();
    return () => {
      mounted = false;
    };
  }, []);

  return { visible, typing };
}

function TypingDots() {
  return (
    <span className="inline-flex items-center gap-1">
      <span className="h-1.5 w-1.5 animate-bounce rounded-full bg-zinc-400 [animation-delay:-0.3s]" />
      <span className="h-1.5 w-1.5 animate-bounce rounded-full bg-zinc-400 [animation-delay:-0.15s]" />
      <span className="h-1.5 w-1.5 animate-bounce rounded-full bg-zinc-400" />
    </span>
  );
}

function ChatPreview() {
  const { visible, typing } = useTypedChat();
  const nextIsHitesh =
    CHAT_SCRIPT[visible] && CHAT_SCRIPT[visible].from === "hitesh";
  const nextIsPiyush =
    CHAT_SCRIPT[visible] && CHAT_SCRIPT[visible].from === "piyush";

  return (
    <motion.div
      initial={{ opacity: 0, y: 30, rotate: -1 }}
      animate={{ opacity: 1, y: 0, rotate: 0 }}
      transition={{ duration: 0.7, delay: 0.3 }}
      className="glass relative w-full max-w-md overflow-hidden rounded-2xl border border-white/10 shadow-2xl shadow-accent-purple/20"
    >
      <div className="flex items-center gap-2 border-b border-white/5 bg-white/[0.02] px-4 py-3">
        <div className="flex gap-1.5">
          <span className="h-2.5 w-2.5 rounded-full bg-red-400/60" />
          <span className="h-2.5 w-2.5 rounded-full bg-yellow-400/60" />
          <span className="h-2.5 w-2.5 rounded-full bg-green-400/60" />
        </div>
        <span className="ml-2 text-xs text-zinc-500">persona-ai — chat</span>
      </div>

      <div className="flex h-80 flex-col gap-3 overflow-hidden px-4 py-4 sm:h-96">
        {CHAT_SCRIPT.slice(0, visible).map((msg, idx) => (
          <motion.div
            key={idx}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.35 }}
            className={
              msg.from === "user"
                ? "ml-auto max-w-[80%] rounded-2xl rounded-br-sm bg-white/10 px-3.5 py-2 text-sm text-zinc-100"
                : "mr-auto max-w-[85%] space-y-2"
            }
          >
            {msg.from !== "user" && (
              <div className="mb-1 flex items-center gap-1.5 text-[11px] font-medium">
                <span
                  className={
                    msg.from === "hitesh"
                      ? "grid h-5 w-5 place-items-center rounded-md bg-gradient-to-br from-accent-purple to-fuchsia-500 text-[10px] text-white"
                      : "grid h-5 w-5 place-items-center rounded-md bg-gradient-to-br from-accent-blue to-cyan-400 text-[10px] text-white"
                  }
                >
                  {msg.from === "hitesh" ? "H" : "P"}
                </span>
                <span className="text-zinc-400">{msg.name}</span>
              </div>
            )}
            <div
              className={
                msg.from === "user"
                  ? ""
                  : "rounded-2xl rounded-tl-sm border border-white/5 bg-white/[0.04] px-3.5 py-2.5 text-sm text-zinc-300"
              }
            >
              {msg.text}
              {msg.code && (
                <div className="mt-2 flex items-center gap-1.5 rounded-lg bg-black/40 px-2.5 py-1.5 font-mono text-[11px] text-emerald-300">
                  <Code2 className="h-3 w-3 shrink-0 text-emerald-400" />
                  {msg.code}
                </div>
              )}
            </div>
          </motion.div>
        ))}

        {typing && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="mr-auto max-w-[70%]"
          >
            <div className="mb-1 flex items-center gap-1.5 text-[11px] font-medium">
              <span
                className={
                  nextIsHitesh
                    ? "grid h-5 w-5 place-items-center rounded-md bg-gradient-to-br from-accent-purple to-fuchsia-500 text-[10px] text-white"
                    : nextIsPiyush
                    ? "grid h-5 w-5 place-items-center rounded-md bg-gradient-to-br from-accent-blue to-cyan-400 text-[10px] text-white"
                    : "hidden"
                }
              >
                {nextIsHitesh ? "H" : nextIsPiyush ? "P" : ""}
              </span>
            </div>
            <div className="rounded-2xl rounded-tl-sm border border-white/5 bg-white/[0.04] px-3.5 py-2.5">
              <TypingDots />
            </div>
          </motion.div>
        )}
      </div>

      <div className="flex items-center gap-2 border-t border-white/5 bg-white/[0.02] px-4 py-3">
        <div className="flex-1 rounded-full border border-white/10 bg-white/[0.03] px-3 py-1.5 text-xs text-zinc-500">
          Ask anything
          <span className="ml-0.5 inline-block h-3.5 w-px animate-pulse bg-zinc-400 align-middle" />
        </div>
        <span className="grid h-7 w-7 shrink-0 place-items-center rounded-full bg-gradient-to-br from-accent-purple to-accent-blue">
          <Zap className="h-3.5 w-3.5 text-white" />
        </span>
      </div>
    </motion.div>
  );
}

function FaqItem({
  question,
  answer,
  isOpen,
  onToggle,
}: {
  question: string;
  answer: string;
  isOpen: boolean;
  onToggle: () => void;
}) {
  return (
    <div className="glass overflow-hidden rounded-xl border border-white/5">
      <button
        onClick={onToggle}
        className="flex w-full items-center justify-between gap-4 px-5 py-4 text-left"
      >
        <span className="text-sm font-medium text-zinc-100 sm:text-base">
          {question}
        </span>
        <Plus
          className={`h-4 w-4 shrink-0 text-zinc-400 transition-transform duration-300 ${
            isOpen ? "rotate-45" : ""
          }`}
        />
      </button>
      <AnimatePresence initial={false}>
        {isOpen && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.25, ease: "easeInOut" }}
            className="overflow-hidden"
          >
            <p className="px-5 pb-4 text-sm leading-relaxed text-zinc-400">
              {answer}
            </p>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

export function Hero() {
  const [openFaq, setOpenFaq] = useState<number | null>(0);

  return (
    <>
      {/* ---------------- HERO BANNER ---------------- */}
      <section className="relative overflow-hidden bg-aurora-gradient pb-20 pt-16 sm:pb-28 sm:pt-24 lg:pb-36 lg:pt-28">
        {/* dot grid */}
        <div
          className="pointer-events-none absolute inset-0 opacity-[0.12] [mask-image:radial-gradient(ellipse_at_center,black_0%,transparent_70%)]"
          style={{
            backgroundImage:
              "radial-gradient(circle, rgba(255,255,255,0.4) 1px, transparent 1px)",
            backgroundSize: "26px 26px",
          }}
        />

        {/* ambient blobs */}
        <div className="pointer-events-none absolute -top-24 left-1/4 h-72 w-72 -translate-x-1/2 rounded-full bg-accent-purple/25 blur-3xl animate-blob" />
        <div className="pointer-events-none absolute top-32 right-0 h-64 w-64 rounded-full bg-accent-blue/25 blur-3xl animate-blob [animation-delay:2s]" />
        <div className="pointer-events-none absolute bottom-0 left-0 h-56 w-56 rounded-full bg-fuchsia-500/15 blur-3xl animate-blob [animation-delay:4s]" />

  

        <div className="relative mx-auto grid max-w-7xl grid-cols-1 items-center gap-y-16 px-4 sm:px-6 lg:grid-cols-[1.1fr,1fr] lg:gap-x-12 xl:gap-x-20">
          {/* ---- copy column ---- */}
          <div className="flex flex-col items-center text-center lg:items-start lg:text-left">
            <motion.div
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              className="glass inline-flex items-center gap-2 rounded-full px-4 py-1.5 text-xs text-zinc-300"
            >
              <Sparkles className="h-3.5 w-3.5 shrink-0 text-accent-purple" />
            Powered by OpenRouter × Meta Llama
            </motion.div>

            <motion.h1
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.1 }}
              className="mt-6 text-[2.75rem] font-bold leading-[1.08] tracking-tight sm:text-6xl sm:leading-[1.05] lg:text-[4.25rem] lg:leading-[1.02] xl:text-7xl"
            >
              Learn From{" "}
              <span className="bg-gradient-to-r from-accent-purple via-fuchsia-400 to-accent-blue bg-clip-text text-transparent">
                AI Versions
              </span>{" "}
              of Your Favorite Mentors
            </motion.h1>

            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="mt-6 max-w-md text-balance text-base leading-relaxed text-zinc-400 sm:max-w-xl sm:text-lg lg:max-w-lg"
            >
              Chat with AI mentors modeled on the public teaching styles of
              Hitesh Choudhary and Piyush Garg. Ask about React, Node, system
              design, or your dev career — get answers in their voice.
            </motion.p>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.3 }}
              className="mt-9 flex w-full flex-col gap-3 sm:w-auto sm:flex-row sm:items-center sm:justify-center lg:justify-start"
            >
              <SignedOut>
                <SignInButton mode="modal">
                  <button className="group inline-flex w-full items-center justify-center gap-2 rounded-full bg-gradient-to-r from-accent-purple to-accent-blue px-7 py-3.5 text-sm font-semibold text-white shadow-lg shadow-accent-purple/25 transition-all hover:scale-[1.03] hover:shadow-accent-purple/40 sm:w-auto">
                    Start Learning
                    <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
                  </button>
                </SignInButton>
              </SignedOut>
              <SignedIn>
                <Link
                  href="/dashboard"
                  className="group inline-flex w-full items-center justify-center gap-2 rounded-full bg-gradient-to-r from-accent-purple to-accent-blue px-7 py-3.5 text-sm font-semibold text-white shadow-lg shadow-accent-purple/25 transition-all hover:scale-[1.03] hover:shadow-accent-purple/40 sm:w-auto"
                >
                  Start Learning
                  <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
                </Link>
              </SignedIn>
              <a
                href="#mentors"
                className="glass inline-flex w-full items-center justify-center gap-2 rounded-full border border-white/10 px-7 py-3.5 text-sm font-semibold text-zinc-200 transition-all hover:border-white/20 hover:bg-white/[0.06] sm:w-auto"
              >
                Meet the Mentors
              </a>
            </motion.div>

            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.6, delay: 0.45 }}
              className="mt-8 flex flex-wrap items-center justify-center gap-2 lg:justify-start"
            >
              {TECH_BADGES.map((badge) => (
                <span
                  key={badge.label}
                  className="whitespace-nowrap rounded-full border border-white/10 bg-white/[0.03] px-3 py-1 text-[11px] text-zinc-400"
                >
                  {badge.label}
                </span>
              ))}
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.55 }}
              className="mt-10 grid w-full max-w-sm grid-cols-3 gap-3 border-t border-white/5 pt-6 sm:max-w-none sm:gap-6 lg:max-w-md"
            >
              {STATS.map((stat) => (
                <div key={stat.label} className="text-center lg:text-left">
                  <div className="text-xl font-bold text-white sm:text-2xl lg:text-3xl">
                    {stat.value}
                  </div>
                  <div className="mt-0.5 text-[11px] text-zinc-500 sm:text-xs">
                    {stat.label}
                  </div>
                </div>
              ))}
            </motion.div>
          </div>

          {/* ---- chat preview column ---- */}
          <div className="relative flex justify-center lg:justify-end">
            <div className="pointer-events-none absolute inset-0 -z-10 hidden place-items-center lg:grid">
              <div className="h-[26rem] w-[26rem] rounded-full bg-accent-purple/10 blur-[100px]" />
            </div>
            <ChatPreview />
          </div>
        </div>

        {/* scroll indicator */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1, y: [0, 8, 0] }}
          transition={{ opacity: { delay: 1 }, y: { duration: 1.8, repeat: Infinity, ease: "easeInOut" } }}
          className="pointer-events-none absolute bottom-6 left-1/2 hidden -translate-x-1/2 flex-col items-center gap-1 text-zinc-500 lg:flex"
        >
          <span className="text-[10px] uppercase tracking-widest">Scroll</span>
          <ChevronDown className="h-4 w-4" />
        </motion.div>
      </section>

      {/* ---------------- FEATURES ---------------- */}
      <section id="features" className="relative border-t border-white/5 bg-background py-20 sm:py-28">
        <div className="mx-auto max-w-6xl px-4 sm:px-6">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
            className="mx-auto max-w-2xl text-center"
          >
            <span className="text-xs font-medium uppercase tracking-widest text-accent-purple">
              Features
            </span>
            <h2 className="mt-3 text-3xl font-bold tracking-tight sm:text-4xl">
              Everything you'd want from a mentor, on demand
            </h2>
            <p className="mt-4 text-zinc-400">
              Persona AI isn't a generic chatbot — it's built around how these
              mentors actually teach.
            </p>
          </motion.div>

          <div className="mt-14 grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {FEATURES.map((feature, i) => (
              <motion.div
                key={feature.title}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: i * 0.08 }}
                className="glass group rounded-2xl border border-white/5 p-6 transition-colors hover:border-white/10"
              >
                <div className="grid h-11 w-11 place-items-center rounded-xl bg-gradient-to-br from-accent-purple/20 to-accent-blue/20 text-accent-purple transition-transform group-hover:scale-110">
                  <feature.icon className="h-5 w-5" />
                </div>
                <h3 className="mt-4 text-lg font-semibold">{feature.title}</h3>
                <p className="mt-2 text-sm leading-relaxed text-zinc-400">
                  {feature.description}
                </p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ---------------- MENTORS ---------------- */}
      <section id="mentors" className="relative border-t border-white/5 bg-background py-20 sm:py-28">
        <div className="mx-auto max-w-6xl px-4 sm:px-6">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
            className="mx-auto max-w-2xl text-center"
          >
            <span className="text-xs font-medium uppercase tracking-widest text-accent-blue">
              Mentors
            </span>
            <h2 className="mt-3 text-3xl font-bold tracking-tight sm:text-4xl">
              Meet the two mentors
            </h2>
            <p className="mt-4 text-zinc-400">
              Each persona is tuned to a distinct teaching style and area of
              strength.
            </p>
          </motion.div>

           <div className="mx-auto mt-12 grid max-w-4xl grid-cols-1 gap-6 sm:grid-cols-2">
        {Object.values(PERSONAS).map((persona, index) => (
          <PersonaCard key={persona.id} persona={persona} index={index} />
        ))}
      </div>

          <div className="mt-10 flex justify-center">
            <SignedOut>
              <SignInButton mode="modal">
                <button className="inline-flex items-center gap-2 rounded-full bg-gradient-to-r from-accent-purple to-accent-blue px-6 py-3 text-sm font-semibold text-white shadow-lg shadow-accent-purple/25 transition-transform hover:scale-105">
                  Chat with a mentor
                  <ArrowRight className="h-4 w-4" />
                </button>
              </SignInButton>
            </SignedOut>
            <SignedIn>
              <Link
                href="/dashboard"
                className="inline-flex items-center gap-2 rounded-full bg-gradient-to-r from-accent-purple to-accent-blue px-6 py-3 text-sm font-semibold text-white shadow-lg shadow-accent-purple/25 transition-transform hover:scale-105"
              >
                Chat with a mentor
                <ArrowRight className="h-4 w-4" />
              </Link>
            </SignedIn>
          </div>
        </div>
      </section>

      {/* ---------------- HOW IT WORKS ---------------- */}
      <section id="how-it-works" className="relative border-t border-white/5 bg-background py-20 sm:py-28">
        <div className="mx-auto max-w-5xl px-4 sm:px-6">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
            className="mx-auto max-w-2xl text-center"
          >
            <span className="text-xs font-medium uppercase tracking-widest text-accent-purple">
              How it works
            </span>
            <h2 className="mt-3 text-3xl font-bold tracking-tight sm:text-4xl">
              From sign-in to your first answer
            </h2>
            <p className="mt-4 text-zinc-400">
              Three steps, no setup required.
            </p>
          </motion.div>

          <div className="relative mt-16 grid grid-cols-1 gap-10 sm:grid-cols-3">
            <div className="pointer-events-none absolute left-0 right-0 top-6 hidden h-px bg-gradient-to-r from-transparent via-white/10 to-transparent sm:block" />
            {STEPS.map((step, i) => (
              <motion.div
                key={step.number}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: i * 0.12 }}
                className="relative text-center"
              >
                <div className="glass relative z-10 mx-auto grid h-14 w-14 place-items-center rounded-2xl border border-white/10 text-accent-purple">
                  <step.icon className="h-6 w-6" />
                </div>
                <span className="mt-4 block text-xs font-mono text-zinc-600">
                  {step.number}
                </span>
                <h3 className="mt-1 text-lg font-semibold">{step.title}</h3>
                <p className="mx-auto mt-2 max-w-xs text-sm leading-relaxed text-zinc-400">
                  {step.description}
                </p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ---------------- FAQ ---------------- */}
      <section id="faq" className="relative border-t border-white/5 bg-background py-20 sm:py-28">
        <div className="mx-auto max-w-3xl px-4 sm:px-6">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
            className="mx-auto max-w-2xl text-center"
          >
            <span className="text-xs font-medium uppercase tracking-widest text-accent-blue">
              FAQ
            </span>
            <h2 className="mt-3 text-3xl font-bold tracking-tight sm:text-4xl">
              Common questions
            </h2>
          </motion.div>

          <div className="mt-12 space-y-3">
            {FAQS.map((faq, i) => (
              <FaqItem
                key={faq.question}
                question={faq.question}
                answer={faq.answer}
                isOpen={openFaq === i}
                onToggle={() => setOpenFaq(openFaq === i ? null : i)}
              />
            ))}
          </div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
            className="glass mt-14 rounded-2xl border border-white/5 p-8 text-center"
          >
            <h3 className="text-2xl font-bold tracking-tight">
              Ready to start learning?
            </h3>
            <p className="mx-auto mt-2 max-w-md text-sm text-zinc-400">
              Sign in and ask your first question — Hitesh AI and Piyush AI
              are ready when you are.
            </p>
            <div className="mt-6 flex justify-center">
              <SignedOut>
                <SignInButton mode="modal">
                  <button className="inline-flex items-center gap-2 rounded-full bg-gradient-to-r from-accent-purple to-accent-blue px-7 py-3.5 text-sm font-semibold text-white shadow-lg shadow-accent-purple/25 transition-transform hover:scale-105">
                    Start Learning
                    <ArrowRight className="h-4 w-4" />
                  </button>
                </SignInButton>
              </SignedOut>
              <SignedIn>
                <Link
                  href="/dashboard"
                  className="inline-flex items-center gap-2 rounded-full bg-gradient-to-r from-accent-purple to-accent-blue px-7 py-3.5 text-sm font-semibold text-white shadow-lg shadow-accent-purple/25 transition-transform hover:scale-105"
                >
                  Start Learning
                  <ArrowRight className="h-4 w-4" />
                </Link>
              </SignedIn>
            </div>
          </motion.div>
        </div>

        
      </section>
    </>
  );
}