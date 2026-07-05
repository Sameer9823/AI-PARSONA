"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useState,
} from "react";
import { PersonaId } from "@/types";
import { getPersona } from "@/lib/personas";
import {
  createConversation,
  getActiveConversationId,
  getConversation,
} from "@/lib/storage";
import { toast } from "sonner";

interface PersonaContextValue {
  personaId: PersonaId;
  persona: ReturnType<typeof getPersona>;
  activeConversationId: string;
  switchPersona: (id: PersonaId) => void;
  startNewConversation: () => void;
  setActiveConversationId: (id: string) => void;
  restoreConversation: (id: string, persona: PersonaId) => void;
}

const PersonaContext = createContext<PersonaContextValue | null>(null);

const LAST_PERSONA_KEY = "persona-ai:last-persona";

export function PersonaProvider({ children }: { children: React.ReactNode }) {
  const [personaId, setPersonaId] = useState<PersonaId>("hitesh");
  const [activeConversationId, setActiveId] = useState<string>("");
  const [ready, setReady] = useState(false);

  useEffect(() => {
    const lastPersona = (localStorage.getItem(LAST_PERSONA_KEY) as PersonaId) || "hitesh";
    const activeId = getActiveConversationId();
    const conv = activeId ? getConversation(activeId) : null;

    if (conv && conv.persona === lastPersona) {
      setPersonaId(lastPersona);
      setActiveId(conv.id);
    } else {
      const newConv = createConversation(lastPersona);
      setPersonaId(lastPersona);
      setActiveId(newConv.id);
    }
    setReady(true);
  }, []);

  const switchPersona = useCallback(
    (id: PersonaId) => {
      if (id === personaId) return;
      localStorage.setItem(LAST_PERSONA_KEY, id);
      const conv = createConversation(id);
      setPersonaId(id);
      setActiveId(conv.id);
      toast.success(`Switched to ${getPersona(id).name}`, {
        description: "Started a fresh conversation.",
      });
    },
    [personaId]
  );

  const startNewConversation = useCallback(() => {
    const conv = createConversation(personaId);
    setActiveId(conv.id);
    toast.success("New conversation started");
  }, [personaId]);

  const restoreConversation = useCallback((id: string, persona: PersonaId) => {
    localStorage.setItem(LAST_PERSONA_KEY, persona);
    setPersonaId(persona);
    setActiveId(id);
  }, []);

  if (!ready) return null;

  return (
    <PersonaContext.Provider
      value={{
        personaId,
        persona: getPersona(personaId),
        activeConversationId,
        switchPersona,
        startNewConversation,
        setActiveConversationId: setActiveId,
        restoreConversation,
      }}
    >
      {children}
    </PersonaContext.Provider>
  );
}

export function usePersonaContext() {
  const ctx = useContext(PersonaContext);
  if (!ctx) throw new Error("usePersonaContext must be used within PersonaProvider");
  return ctx;
}