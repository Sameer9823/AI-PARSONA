"use client";

import { useUser } from "@clerk/nextjs";
import { useState } from "react";
import { toast } from "sonner";
import {
  clearAllConversations,
  exportConversationAsMarkdown,
  exportConversationAsText,
  getConversation,
} from "@/lib/storage";
import { usePersonaContext } from "@/context/PersonaContext";
import { PERSONAS } from "@/lib/personas";
import { ExternalLink, Trash2, Download, AlertTriangle } from "lucide-react";

function downloadFile(filename: string, content: string) {
  const blob = new Blob([content], { type: "text/plain;charset=utf-8" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = filename;
  a.click();
  URL.revokeObjectURL(url);
}

export default function SettingsPage() {
  const { user } = useUser();
  const { persona, personaId, activeConversationId, startNewConversation } =
    usePersonaContext();
  const [confirmClear, setConfirmClear] = useState(false);

  const exportChat = (format: "md" | "txt") => {
    const conv = getConversation(activeConversationId);
    if (!conv || conv.messages.length === 0) {
      toast.error("No messages to export in the current conversation.");
      return;
    }
    const content =
      format === "md" ? exportConversationAsMarkdown(conv) : exportConversationAsText(conv);
    downloadFile(`${conv.title.replace(/\s+/g, "_")}.${format}`, content);
    toast.success(`Exported as .${format}`);
  };

  const handleClearAll = () => {
    if (!confirmClear) {
      setConfirmClear(true);
      setTimeout(() => setConfirmClear(false), 4000);
      return;
    }
    clearAllConversations();
    startNewConversation();
    toast.success("All local chat data cleared");
    setConfirmClear(false);
  };

  return (
    <div className="mx-auto h-full max-w-2xl overflow-y-auto px-4 py-6 sm:px-6">
      <h1 className="mb-6 text-xl font-semibold">Settings</h1>

      <section className="glass mb-6 rounded-2xl p-5">
        <h2 className="mb-3 text-sm font-medium text-zinc-400">Profile</h2>
        <div className="flex items-center gap-3">
          {user?.imageUrl && (
            // eslint-disable-next-line @next/next/no-img-element
            <img
              src={user.imageUrl}
              alt={user.fullName ?? "Profile"}
              className="h-12 w-12 rounded-full border border-white/10"
            />
          )}
          <div>
            <p className="text-sm font-medium">{user?.fullName || user?.username}</p>
            <p className="text-xs text-zinc-500">
              {user?.primaryEmailAddress?.emailAddress}
            </p>
          </div>
        </div>
      </section>

      <section className="glass mb-6 rounded-2xl p-5">
        <h2 className="mb-3 text-sm font-medium text-zinc-400">Current Persona</h2>
        <div className="flex items-center gap-3">
          <span
            className={`grid h-10 w-10 place-items-center rounded-full bg-gradient-to-br ${persona.ui.gradient} text-sm font-semibold text-white`}
          >
            {persona.name[0]}
          </span>
          <div>
            <p className="text-sm font-medium">{persona.name}</p>
            <p className="text-xs text-zinc-500">{persona.role}</p>
          </div>
        </div>

        <div className="mt-4 space-y-1.5">
          <p className="text-xs font-medium text-zinc-500">Public reference sources</p>
          {persona.sources.map((s) => (
            <a
              key={s.url}
              href={s.url}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-1.5 text-xs text-zinc-400 hover:text-zinc-200"
            >
              <ExternalLink className="h-3 w-3" /> {s.label}
            </a>
          ))}
        </div>
      </section>

      <section className="glass mb-6 rounded-2xl p-5">
        <h2 className="mb-3 text-sm font-medium text-zinc-400">Theme</h2>
        <p className="text-sm text-zinc-300">
          Persona AI uses a premium dark theme by default. Light mode is not
          available in this build.
        </p>
      </section>

      <section className="glass mb-6 rounded-2xl p-5">
        <h2 className="mb-3 text-sm font-medium text-zinc-400">Export Chat</h2>
        <div className="flex gap-3">
          <button
            onClick={() => exportChat("md")}
            className="flex items-center gap-2 rounded-xl border border-white/10 px-4 py-2 text-sm hover:bg-white/5"
          >
            <Download className="h-4 w-4" /> Markdown
          </button>
          <button
            onClick={() => exportChat("txt")}
            className="flex items-center gap-2 rounded-xl border border-white/10 px-4 py-2 text-sm hover:bg-white/5"
          >
            <Download className="h-4 w-4" /> Text
          </button>
        </div>
      </section>

      <section className="glass rounded-2xl p-5">
        <h2 className="mb-3 text-sm font-medium text-red-400">Danger Zone</h2>
        <button
          onClick={handleClearAll}
          className="flex items-center gap-2 rounded-xl border border-red-500/30 bg-red-500/10 px-4 py-2 text-sm text-red-300 hover:bg-red-500/20"
        >
          {confirmClear ? <AlertTriangle className="h-4 w-4" /> : <Trash2 className="h-4 w-4" />}
          {confirmClear ? "Click again to confirm" : "Delete all local chat data"}
        </button>
      </section>
    </div>
  );
}
