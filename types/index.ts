export type PersonaId = "hitesh" | "piyush";

export type MessageRole = "system" | "user" | "assistant";

export interface PersonaSource {
  label: string;
  url: string;
  type?: "official" | "platform" | "social" | "community";
}

export interface PersonaPersonality {
  tone: string;
  communication: string;
  teachingStyle: string;
  expertise: string[];
}

export interface PersonaSignaturePhrases {
  opening: string[];
  transition: string[];
  explanation: string[];
  emphasis: string[];
  encouragement: string[];
  closing: string[];
}

export interface PersonaPromptPolicy {
  identityMode: "simulation";
  disclosure: string;
  mustDo: string[];
  mustNotDo: string[];
}

export interface PersonaPublicProfile {
  description: string;
  audience?: string[];
  strengths?: string[];
}

export interface PersonaUI {
  color: string;
  gradient: string;
  tagline: string;
  avatar: string;
  greeting: string;
}

export interface PersonaMetadata {
  language?: "hinglish" | "english";
  responseDepth?: "beginner" | "mixed" | "advanced";
  preferredFormats?: Array<"headings" | "bullets" | "code" | "tables" | "diagrams">;
}

export interface Persona {
  id: PersonaId;

  // Basic Information
  name: string;
  role: string;
  website: string;

  // UI
  ui: PersonaUI;

  // Public Persona Description
  publicProfile: PersonaPublicProfile;

  // AI Persona
  personality: PersonaPersonality;

  /**
   * Frequently used words, phrases and catchphrases
   */
  vocabulary: string[];

  /**
   * Grouped signature phrases for more natural variation
   */
  signaturePhrases: PersonaSignaturePhrases;

  /**
   * Rules that define how the AI should respond
   */
  responseStyle: string[];

  /**
   * Prompt behavior and safety constraints
   */
  promptPolicy: PersonaPromptPolicy;

  /**
   * Complete system prompt used by the LLM
   */
  systemPrompt: string;

  /**
   * Suggested prompts shown in the UI
   */
  sampleQuestions: string[];

  /**
   * Public sources used for persona creation
   */
  sources: PersonaSource[];

  /**
   * Optional app-level rendering and behavior hints
   */
  metadata?: PersonaMetadata;
}

export interface ChatMessage {
  id: string;
  role: MessageRole;
  content: string;
  timestamp: number;
  pinned?: boolean;
  regenerated?: boolean;
  copied?: boolean;
}

export interface Conversation {
  id: string;
  persona: PersonaId;
  title: string;
  messages: ChatMessage[];
  createdAt: number;
  updatedAt: number;
}

export interface ConversationSummary {
  id: string;
  persona: PersonaId;
  title: string;
  updatedAt: number;
  preview: string;
}

export interface ChatRequest {
  persona: PersonaId;
  message: string;
  history: ChatMessage[];
}

export interface ChatResponse {
  message: ChatMessage;
}

export interface AIConfig {
  provider: "openrouter";
  model: string;
  maxTokens: number;
  temperature: number;
  stream: boolean;
}