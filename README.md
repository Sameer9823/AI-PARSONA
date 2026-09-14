# Persona AI

Learn from AI versions of your favorite mentors — chat with AI personas modeled
on the **public teaching styles** of **Hitesh Choudhary** and **Piyush Garg**.

Built with Next.js 15 (App Router), TypeScript, Tailwind CSS, Clerk Authentication,
LangChain, and Google Gemini (or OpenAI).

> ⚠️ **Not affiliated with, endorsed by, or an official product of Hitesh Choudhary
> or Piyush Garg.** This is a fan-made educational project. Persona prompts are
> built only from publicly available content (official websites, YouTube,
> blogs, GitHub, LinkedIn, X/Twitter) — see `lib/personas.ts` and
> `lib/prompts.ts`, and the "Reference sources" links in the app's Settings page.

---

## 1. Quick Start

```bash
# 1. Install dependencies
npm install

# 2. Copy env template and fill in your keys
cp .env.example .env.local

# 3. Run the dev server
npm run dev
```


### Required environment variables (`.env.local`)

| Variable | Description |
|---|---|
| `NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY` | From your [Clerk dashboard](https://dashboard.clerk.com) |
| `CLERK_SECRET_KEY` | From your Clerk dashboard |
| `OPENROUTER_API_KEY` | From [openrouter.ai/keys](https://openrouter.ai/keys) — the **only** LLM provider used by this app |
| `NEXT_PUBLIC_APP_URL` | Optional; sent as OpenRouter's `HTTP-Referer` analytics header |

In Clerk, enable **Google**, **GitHub**, and **Email** as sign-in methods, and
set the redirect URLs to match `.env.example`.

---

## 2. Tech Stack

- **Frontend:** Next.js 15 App Router, TypeScript, Tailwind CSS, Framer Motion, Lucide React
- **Auth:** Clerk (Google / GitHub / Email)
- **AI:** [OpenRouter](https://openrouter.ai) via the official `openai` SDK — a single OpenAI-compatible client routes requests to any model OpenRouter hosts (Gemini, GPT, Claude, Llama, Qwen, ...)
- **Markdown/Code:** `react-markdown` + `remark-gfm` + `react-syntax-highlighter`
- **Storage:** Browser `localStorage` only — no database
- **Toasts:** Sonner
- **Deployment:** Vercel (or any Node host that supports the Next.js App Router)

---

## 3. Folder Structure

```
persona-ai/
├── app/
│   ├── page.tsx                  # Landing page
│   ├── layout.tsx                # Root layout + ClerkProvider + metadata
│   ├── sign-in/ sign-up/         # Clerk auth pages
│   ├── dashboard/                # Protected app shell
│   │   ├── layout.tsx            # Sidebar + navbar + PersonaProvider
│   │   ├── page.tsx              # Chat screen
│   │   ├── history/page.tsx      # Grouped chat history
│   │   └── settings/page.tsx     # Profile, export, danger zone
│   └── api/chat/route.ts         # Streaming chat endpoint (OpenRouter)
├── components/
│   ├── chat/                     # ChatArea, ChatInput, MessageBubble, Markdown, CodeBlock...
│   ├── persona/                  # PersonaSwitcher
│   ├── sidebar/ navbar/ landing/
├── context/PersonaContext.tsx    # Active persona + conversation state
├── hooks/useChat.ts              # Streaming send/regenerate/stop logic
├── lib/
│   ├── config.ts                 # AI_MODEL — the ONLY place the model id is defined
│   ├── openrouter.ts             # Shared OpenAI-SDK client pointed at OpenRouter
│   ├── ai.ts                     # Builds messages + streams a persona completion
│   ├── stream-protocol.ts        # Lets mid-stream errors surface as toasts, not chat text
│   ├── prompts.ts                # Persona system prompts + memory summarization
│   ├── personas.ts               # Persona metadata + public reference links
│   ├── storage.ts                # localStorage CRUD for conversations
│   └── utils.ts
├── middleware.ts                 # Clerk route protection
└── types/index.ts
```

---

## 4. How the persona chat works

1. `lib/prompts.ts` defines a detailed system prompt per persona (teaching
   style, tone, catchphrases, restrictions) — **unchanged** by the OpenRouter
   migration.
2. Only the **last ~12 messages** (`MEMORY_WINDOW` in `lib/config.ts`) are
   sent verbatim to the model; anything older is condensed into a short
   summary block appended to the system prompt as "Retrieved Context"
   (`buildMemory` in `lib/prompts.ts`).
3. `lib/openrouter.ts` creates a single, shared `openai` SDK client
   configured with `baseURL: "https://openrouter.ai/api/v1"` and
   `apiKey: process.env.OPENROUTER_API_KEY`. **Every** AI call in the app
   goes through this one client — there is no direct Gemini or OpenAI SDK
   usage anywhere.
4. `lib/config.ts` exports `AI_MODEL`, the single source of truth for which
   model OpenRouter should route to (e.g. `google/gemini-2.5-flash`,
   `openai/gpt-4.1-mini`, `anthropic/claude-3.7-sonnet`, ...). Changing
   providers/models means editing **only this one line** — no other file
   needs to change.
5. `lib/ai.ts` builds the OpenAI-style `messages` array (`system` + trimmed
   history) and calls `openrouter.chat.completions.create({ model: AI_MODEL,
   stream: true, ... })`, yielding plain text chunks as they arrive.
6. `app/api/chat/route.ts` is a Clerk-protected streaming endpoint. It pipes
   those chunks back to the client as a raw `ReadableStream` — never
   exposing `OPENROUTER_API_KEY` to the browser. If OpenRouter isn't
   configured at all, it fails fast with a normal JSON 500 response; if a
   failure happens *after* streaming has already started (rate limit,
   dropped connection, empty completion, etc.), the friendly error message is
   smuggled through the stream using a marker (`lib/stream-protocol.ts`) so
   the frontend can show a toast instead of rendering it as chat content.
7. `hooks/useChat.ts` reads the stream chunk-by-chunk, updates the
   in-progress assistant message for a ChatGPT-style token effect, detects
   the error marker if present (toast + graceful fallback text), and powers
   **Stop Generation** via `AbortController`.
8. Every conversation is persisted to `localStorage` (`lib/storage.ts`) keyed
   by persona, and restored automatically on reload.

Switching personas (via the pill switcher) always starts a **brand-new
conversation** — it does not carry over context, per the spec.

### Changing the model

Edit `lib/config.ts` only:

```ts
export const AI_MODEL = "google/gemini-2.5-flash";

// export const AI_MODEL = "openai/gpt-4.1-mini";
// export const AI_MODEL = "anthropic/claude-3.7-sonnet";
// export const AI_MODEL = "meta-llama/llama-3.3-70b-instruct";
// export const AI_MODEL = "qwen/qwen3-235b-a22b";
```

Any model id listed on [openrouter.ai/models](https://openrouter.ai/models)
works — no other file requires modification.

### Error handling

`lib/ai.ts` normalizes every failure mode into a friendly `AIRequestError`
message, surfaced to the user as a Sonner toast:

| Failure | User sees |
|---|---|
| Missing/invalid `OPENROUTER_API_KEY` | "Invalid or missing OpenRouter API key..." |
| HTTP 429 from OpenRouter | "OpenRouter rate limit reached. Please wait a moment..." |
| HTTP 5xx from OpenRouter | "OpenRouter is temporarily unavailable..." |
| Network error / DNS failure | "Network error while reaching OpenRouter..." |
| Timeout / aborted request | "The request timed out..." |
| Empty completion (no tokens returned) | "The model returned an empty response..." |

---

## 5. Implemented features

- Clerk auth (Google / GitHub / Email), protected `/dashboard` and `/api/chat`
- Landing page: animated gradient hero, glass persona cards, CTA, footer, SEO metadata + OG/Twitter cards
- Dashboard: fixed sidebar (desktop), bottom nav (mobile), collapsible persona pill switcher
- Streaming responses with Markdown, GFM tables/lists, syntax-highlighted code blocks with copy button
- Copy message, Regenerate last answer, Stop generation, timestamps, avatars
- Empty state with persona greeting + clickable sample questions
- Chat history grouped by Today / Yesterday / Last Week, click to restore, delete
- Settings: profile, current persona + public reference sources, dark theme note, export chat (Markdown/Text), delete all local data (with confirm)
- Mobile-first responsive layout, auto-resizing input, character counter, keyboard shortcuts (Enter / Shift+Enter)
- Skeleton/shimmer loading states, error boundary with retry
- `manifest.json` + favicon for basic PWA installability

## 6. Roadmap / not yet wired up

These were listed as "bonus/stretch" items in the spec and are good next
iterations, intentionally left out to keep this build focused and correct:

- **Persona Comparison Mode** (split-screen, both personas answer the same question)
- **AI-generated follow-up questions** after each response
- **In-chat search** across the current conversation
- A dedicated **Pinned Messages** view (pin toggle exists on each message, but there's no separate pinned list yet)
- **Manual conversation rename** (titles currently auto-generate from the first message)
- **PDF export** (Markdown/TXT export is implemented)
- Full offline PWA support (service worker + caching — manifest only today)

---

## 7. Deployment (Vercel)

1. Push this repo to GitHub.
2. Import it into Vercel.
3. Add the environment variables from `.env.example` in Project Settings → Environment Variables.
4. Deploy. Update Clerk's allowed redirect URLs to your production domain.

---

## 8. Persona reference sources

Prompts are built solely from public material:

**Hitesh Choudhary** — [hiteshchoudhary.com](https://hiteshchoudhary.com) · [YouTube](https://www.youtube.com/@chaiaurcode) · [X](https://twitter.com/Hiteshdotcom) · [LinkedIn](https://www.linkedin.com/in/hiteshchoudhary) · [GitHub](https://github.com/hiteshchoudhary)

**Piyush Garg** — [piyushgarg.dev](https://piyushgarg.dev) · [YouTube](https://www.youtube.com/@piyushgargdev) · [X](https://twitter.com/piyushgarg_dev) · [LinkedIn](https://www.linkedin.com/in/piyush-garg-5865811b6) · [GitHub](https://github.com/piyushgarg-dev)
