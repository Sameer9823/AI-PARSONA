"use client";

import { UserButton, useUser } from "@clerk/nextjs";
import { PersonaSwitcher } from "@/components/persona/PersonaSwitcher";
import { usePersonaContext } from "@/context/PersonaContext";

export function DashboardNavbar() {
  const { user } = useUser();
  const { persona } = usePersonaContext();

  return (
    <header className="flex items-center justify-between gap-3 border-b border-white/5 bg-background/60 px-4 py-3 backdrop-blur-xl sm:px-6">
      <div className="min-w-0">
        <p className="truncate text-sm font-medium text-zinc-200">
          {persona.name}
        </p>
        <p className="truncate text-xs text-zinc-500">{persona.role}</p>
      </div>

      <div className="hidden sm:block">
        <PersonaSwitcher />
      </div>

      <div className="flex items-center gap-3">
        <span className="hidden text-sm text-zinc-400 md:inline">
          {user?.firstName || user?.username || "Learner"}
        </span>
        <UserButton afterSignOutUrl="/" />
      </div>
    </header>
  );
}
