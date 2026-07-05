import { ChatMessage, Conversation, ConversationSummary, PersonaId } from "@/types";
import { generateId, truncate } from "./utils";

const INDEX_KEY = "persona-ai:conversations:index";
const CONV_PREFIX = "persona-ai:conversation:";
const ACTIVE_KEY = "persona-ai:active-conversation";
const CONVERSATIONS_UPDATED_EVENT = "persona-ai:conversations-updated";

function isBrowser() {
  return typeof window !== "undefined";
}

function notifyConversationsChanged() {
  if (isBrowser()) {
    window.dispatchEvent(new Event(CONVERSATIONS_UPDATED_EVENT));
  }
}

export function getConversationIndex(): ConversationSummary[] {
  if (!isBrowser()) return [];
  try {
    const raw = localStorage.getItem(INDEX_KEY);
    return raw ? (JSON.parse(raw) as ConversationSummary[]) : [];
  } catch {
    return [];
  }
}

function saveIndex(index: ConversationSummary[]) {
  localStorage.setItem(INDEX_KEY, JSON.stringify(index));
}

export function getConversation(id: string): Conversation | null {
  if (!isBrowser()) return null;
  try {
    const raw = localStorage.getItem(CONV_PREFIX + id);
    return raw ? (JSON.parse(raw) as Conversation) : null;
  } catch {
    return null;
  }
}

export function saveConversation(conv: Conversation) {
  if (!isBrowser()) return;
  localStorage.setItem(CONV_PREFIX + conv.id, JSON.stringify(conv));
  const index = getConversationIndex().filter((c) => c.id !== conv.id);
  const lastMsg = conv.messages[conv.messages.length - 1];
  index.unshift({
    id: conv.id,
    persona: conv.persona,
    title: conv.title,
    updatedAt: conv.updatedAt,
    preview: lastMsg ? truncate(lastMsg.content, 80) : "New conversation",
  });
  saveIndex(index);
  notifyConversationsChanged();
}

export function deleteConversation(id: string) {
  if (!isBrowser()) return;
  localStorage.removeItem(CONV_PREFIX + id);
  saveIndex(getConversationIndex().filter((c) => c.id !== id));
  if (getActiveConversationId() === id) clearActiveConversationId();
  notifyConversationsChanged();
}

export function clearAllConversations() {
  if (!isBrowser()) return;
  const index = getConversationIndex();
  index.forEach((c) => localStorage.removeItem(CONV_PREFIX + c.id));
  localStorage.removeItem(INDEX_KEY);
  localStorage.removeItem(ACTIVE_KEY);
  notifyConversationsChanged();
}

export function createConversation(persona: PersonaId): Conversation {
  const now = Date.now();
  const conv: Conversation = {
    id: generateId(),
    persona,
    title: "New conversation",
    messages: [],
    createdAt: now,
    updatedAt: now,
  };
  saveConversation(conv);
  setActiveConversationId(conv.id);
  return conv;
}

export function addMessage(convId: string, message: ChatMessage) {
  const conv = getConversation(convId);
  if (!conv) return;
  conv.messages.push(message);
  conv.updatedAt = Date.now();
  if (conv.title === "New conversation" && message.role === "user") {
    conv.title = truncate(message.content, 42);
  }
  saveConversation(conv);
  return conv;
}

export function updateConversationTitle(convId: string, title: string) {
  const conv = getConversation(convId);
  if (!conv) return;
  conv.title = title;
  saveConversation(conv);
}

export function togglePinMessage(convId: string, messageId: string) {
  const conv = getConversation(convId);
  if (!conv) return;
  conv.messages = conv.messages.map((m) =>
    m.id === messageId ? { ...m, pinned: !m.pinned } : m
  );
  saveConversation(conv);
  return conv;
}

export function setActiveConversationId(id: string) {
  if (!isBrowser()) return;
  localStorage.setItem(ACTIVE_KEY, id);
}

export function getActiveConversationId(): string | null {
  if (!isBrowser()) return null;
  return localStorage.getItem(ACTIVE_KEY);
}

export function clearActiveConversationId() {
  if (!isBrowser()) return;
  localStorage.removeItem(ACTIVE_KEY);
}

export function getOrCreateActiveConversation(persona: PersonaId): Conversation {
  const activeId = getActiveConversationId();
  if (activeId) {
    const conv = getConversation(activeId);
    if (conv && conv.persona === persona) return conv;
  }
  return createConversation(persona);
}

export function exportConversationAsMarkdown(conv: Conversation): string {
  const lines = [`# ${conv.title}`, ""];
  conv.messages.forEach((m) => {
    lines.push(`### ${m.role === "user" ? "You" : "Mentor"} — ${new Date(m.timestamp).toLocaleString()}`);
    lines.push("");
    lines.push(m.content);
    lines.push("");
  });
  return lines.join("\n");
}

export function exportConversationAsText(conv: Conversation): string {
  const lines = [conv.title, ""];
  conv.messages.forEach((m) => {
    lines.push(`[${m.role.toUpperCase()}] ${new Date(m.timestamp).toLocaleString()}`);
    lines.push(m.content);
    lines.push("");
  });
  return lines.join("\n");
}