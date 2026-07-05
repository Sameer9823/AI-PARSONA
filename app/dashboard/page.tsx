"use client";

import { ChatArea } from "@/components/chat/ChatArea";
import { usePersonaContext } from "@/context/PersonaContext";

export default function DashboardPage() {
  const { persona, activeConversationId } = usePersonaContext();

  return (
    <div className="h-full">
      <ChatArea
        key={activeConversationId}
        conversationId={activeConversationId}
        persona={persona}
      />
    </div>
  );
}
