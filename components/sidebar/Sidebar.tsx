"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { SignOutButton } from "@clerk/nextjs";
import {
  LayoutDashboard,
  Settings,
  LogOut,
  Sparkles,
  Plus,
  Trash2,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { usePersonaContext } from "@/context/PersonaContext";
import { ConversationSummary } from "@/types";
import {
  deleteConversation,
  getConversationIndex,
  setActiveConversationId,
} from "@/lib/storage";
import { getPersona } from "@/lib/personas";
import { toast } from "sonner";

const NAV_ITEMS = [
  { href: "/dashboard", label: "Dashboard", icon: LayoutDashboard },
  { href: "/dashboard/settings", label: "Settings", icon: Settings },
];

export function Sidebar() {
  const pathname = usePathname();
  const router = useRouter();
  const { startNewConversation, restoreConversation, activeConversationId } =
    usePersonaContext();

  const [conversations, setConversations] = useState<ConversationSummary[]>(
    []
  );

  const refresh = () => setConversations(getConversationIndex());

  useEffect(() => {
    refresh();
    const onUpdate = () => refresh();
    window.addEventListener("persona-ai:conversations-updated", onUpdate);
    return () =>
      window.removeEventListener("persona-ai:conversations-updated", onUpdate);
  }, [pathname]);

  // group conversations by persona, most recently updated first within each group
  const grouped = useMemo(() => {
    const groups: Record<string, ConversationSummary[]> = {};
    conversations
      .slice()
      .sort((a, b) => b.updatedAt - a.updatedAt)
      .forEach((c) => {
        groups[c.persona] = groups[c.persona] || [];
        groups[c.persona].push(c);
      });
    return groups;
  }, [conversations]);

  const restore = (c: ConversationSummary) => {
    setActiveConversationId(c.id);
    restoreConversation(c.id, c.persona);
    router.push("/dashboard");
  };

  const remove = (e: React.MouseEvent, id: string) => {
    e.stopPropagation();
    deleteConversation(id);
    refresh();
    toast.success("Conversation deleted");
  };

  return (
    <aside className="hidden h-screen w-64 flex-col border-r border-white/5 bg-card/40 lg:flex">
      <div className="flex items-center gap-2 px-6 py-5 font-semibold">
        <Link
  href="/"
  className="flex items-center gap-2 transition-opacity hover:opacity-80"
>
  <span className="grid h-8 w-8 place-items-center rounded-lg bg-gradient-to-br from-accent-purple to-accent-blue">
    <Sparkles className="h-4 w-4 text-white" />
  </span>
  Persona AI
</Link>
      </div>

      <button
        onClick={startNewConversation}
        className="mx-4 mb-2 flex items-center justify-center gap-2 rounded-xl border border-white/10 bg-white/5 px-3 py-2 text-sm text-zinc-300 transition-colors hover:bg-white/10"
      >
        <Plus className="h-4 w-4" /> New chat
      </button>

      <nav className="space-y-1 px-4">
        {NAV_ITEMS.map((item) => {
          const active = pathname === item.href;
          const Icon = item.icon;
          return (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                "flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm transition-colors",
                active
                  ? "bg-gradient-to-r from-accent-purple/20 to-accent-blue/20 text-white"
                  : "text-zinc-400 hover:bg-white/5 hover:text-zinc-200"
              )}
            >
              <Icon className="h-4 w-4" />
              {item.label}
            </Link>
          );
        })}
      </nav>

      {/* conversation list, grouped by persona — ChatGPT style */}
      <div className="mt-4 min-h-0 flex-1 space-y-4 overflow-y-auto px-4 pb-4">
        {Object.keys(grouped).length === 0 && (
          <p className="px-3 text-xs text-zinc-600">
            No conversations yet. Start a new chat above.
          </p>
        )}

        {Object.entries(grouped).map(([personaId, items]) => {
          const persona = getPersona(personaId);
          return (
            <div key={personaId}>
              <div className="mb-1.5 flex items-center gap-2 px-3">
                <span
                  className={cn(
                    "grid h-5 w-5 flex-shrink-0 place-items-center rounded-full bg-gradient-to-br text-[10px] font-semibold text-white",
                    persona.ui.gradient
                  )}
                >
                  {persona.name[0]}
                </span>
                <span className="text-xs font-medium uppercase tracking-wide text-zinc-500">
                  {persona.name}
                </span>
              </div>

              <div className="space-y-0.5">
                {items.map((c) => {
                  const isActive = c.id === activeConversationId;
                  return (
                    <button
                      key={c.id}
                      onClick={() => restore(c)}
                      className={cn(
                        "group flex w-full items-center justify-between gap-2 rounded-lg px-3 py-2 text-left text-sm transition-colors",
                        isActive
                          ? "bg-white/10 text-zinc-100"
                          : "text-zinc-400 hover:bg-white/5 hover:text-zinc-200"
                      )}
                    >
                      <span className="truncate">{c.title}</span>
                      <span
                        role="button"
                        tabIndex={0}
                        onClick={(e) => remove(e, c.id)}
                        className="shrink-0 text-zinc-600 opacity-0 transition-opacity hover:text-red-400 group-hover:opacity-100"
                      >
                        <Trash2 className="h-3.5 w-3.5" />
                      </span>
                    </button>
                  );
                })}
              </div>
            </div>
          );
        })}
      </div>

      <div className="border-t border-white/5 px-4 py-4">
        <SignOutButton>
          <button className="flex w-full items-center gap-3 rounded-xl px-3 py-2.5 text-sm text-zinc-400 transition-colors hover:bg-white/5 hover:text-red-400">
            <LogOut className="h-4 w-4" />
            Logout
          </button>
        </SignOutButton>
      </div>
    </aside>
  );
}