"use client";

import { useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { ConversationSummary } from "@/types";
import {
  deleteConversation,
  getConversationIndex,
  setActiveConversationId,
} from "@/lib/storage";
import { formatDayLabel } from "@/lib/utils";
import { getPersona } from "@/lib/personas";
import { usePersonaContext } from "@/context/PersonaContext";
import { Trash2, MessageSquare } from "lucide-react";
import { toast } from "sonner";

export default function HistoryPage() {
  const router = useRouter();
  const { restoreConversation } = usePersonaContext();
  const [conversations, setConversations] = useState<ConversationSummary[]>([]);

  useEffect(() => {
    setConversations(getConversationIndex());
  }, []);

  const grouped = useMemo(() => {
    const groups: Record<string, ConversationSummary[]> = {};
    conversations.forEach((c) => {
      const label = formatDayLabel(c.updatedAt);
      groups[label] = groups[label] || [];
      groups[label].push(c);
    });
    return groups;
  }, [conversations]);

  const restore = (c: ConversationSummary) => {
    setActiveConversationId(c.id);
    restoreConversation(c.id, c.persona);
    router.push("/dashboard");
  };

  const remove = (id: string) => {
    deleteConversation(id);
    setConversations(getConversationIndex());
    toast.success("Conversation deleted");
  };

  if (conversations.length === 0) {
    return (
      <div className="flex h-full flex-col items-center justify-center gap-2 px-6 text-center text-zinc-500">
        <MessageSquare className="h-10 w-10" />
        <p>No conversations yet. Start chatting to see your history here.</p>
      </div>
    );
  }

  return (
    <div className="mx-auto h-full max-w-3xl overflow-y-auto px-4 py-6 sm:px-6">
      <h1 className="mb-6 text-xl font-semibold">Chat History</h1>
      {Object.entries(grouped).map(([label, items]) => (
        <div key={label} className="mb-6">
          <h2 className="mb-2 text-xs font-medium uppercase tracking-wide text-zinc-500">
            {label}
          </h2>
          <div className="space-y-2">
            {items.map((c) => {
              const persona = getPersona(c.persona);
              return (
                <div
                  key={c.id}
                  className="glass group flex items-center justify-between rounded-xl px-4 py-3 transition-colors hover:bg-white/10"
                >
                  <button
                    onClick={() => restore(c)}
                    className="flex flex-1 items-center gap-3 text-left"
                  >
                    <span
                      className={`grid h-9 w-9 flex-shrink-0 place-items-center rounded-full bg-gradient-to-br ${persona.ui.gradient} text-xs font-semibold text-white`}
                    >
                      {persona.name[0]}
                    </span>
                    <span className="min-w-0">
                      <span className="block truncate text-sm text-zinc-200">{c.title}</span>
                      <span className="block truncate text-xs text-zinc-500">{c.preview}</span>
                    </span>
                  </button>
                  <button
                    onClick={() => remove(c.id)}
                    className="ml-2 text-zinc-600 opacity-0 transition-opacity hover:text-red-400 group-hover:opacity-100"
                  >
                    <Trash2 className="h-4 w-4" />
                  </button>
                </div>
              );
            })}
          </div>
        </div>
      ))}
    </div>
  );
}
