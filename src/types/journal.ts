import type { ConversationLevel } from './session';

export interface JournalEntry {
  id?: number;
  questionId: string;
  /** Session this entry belongs to */
  sessionId?: number;
  answer: string;
  /** Array of emotion tag strings */
  emotionTags: string[];
  /** Which conversation level this entry was from */
  level?: ConversationLevel;
  timestamp: number;
  updatedAt?: number;
  /** Reserved for Phase 3 cloud sync */
  cloudId?: string;
  /** Reserved for Phase 3 cloud sync */
  syncedAt?: number;
}

export const EMOTION_TAGS = [
  'happy',
  'sad',
  'thoughtful',
  'connected',
  'anxious',
  'grateful',
  'vulnerable',
  'hopeful',
] as const;

export type EmotionTag = (typeof EMOTION_TAGS)[number];
