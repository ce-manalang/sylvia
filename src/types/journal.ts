export interface JournalEntry {
  id?: number;
  questionId: string;
  answer: string;
  emotionTag: string;
  timestamp: number;
  updatedAt?: number;
  /** Reserved for Phase 3 cloud sync */
  cloudId?: string;
  /** Reserved for Phase 3 cloud sync */
  syncedAt?: number;
}
