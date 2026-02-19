export type ConversationLevel = 'perception' | 'connection' | 'reflection';

export interface Question {
  id: string;
  text: string;
  level: ConversationLevel;
  deckId: string;
  /** If true, show skip affordance more prominently */
  sensitive?: boolean;
}

export interface Deck {
  id: string;
  name: string;
  description: string;
  questionCount: number;
  levels: ConversationLevel[];
  free: boolean;
}

export type SessionStatus = 'active' | 'completed' | 'abandoned';

export interface Session {
  id?: number;
  deckId: string;
  startedAt: number;
  completedAt?: number;
  currentQuestionIndex: number;
  /** Ordered question IDs for this session */
  questionsOrder: string[];
  /** Question IDs the user chose to skip */
  skippedQuestions: string[];
  status: SessionStatus;
}

export interface SessionReflection {
  id?: number;
  sessionId: number;
  favoriteQuestionId?: string;
  learnedInsight?: string;
  moodRating?: string;
  savedAt: number;
  /** Shareable summary text generated at end of session */
  shareSummary?: string;
}

export const LEVEL_ORDER: ConversationLevel[] = [
  'perception',
  'connection',
  'reflection',
];

export const LEVEL_LABELS: Record<ConversationLevel, string> = {
  perception: 'Perception',
  connection: 'Connection',
  reflection: 'Reflection',
};

export const LEVEL_COLORS: Record<ConversationLevel, string> = {
  perception: '#e8dcc8',
  connection: '#d4a574',
  reflection: '#a8b5a0',
};

export const LEVEL_TEXT_COLORS: Record<ConversationLevel, string> = {
  perception: '#2d3436',
  connection: '#2d3436',
  reflection: '#2d3436',
};
