import Dexie, { type Table } from 'dexie';
import type { JournalEntry } from '../types/journal';
import type { Session, SessionReflection } from '../types/session';

export class AppDatabase extends Dexie {
  entries!: Table<JournalEntry, number>;
  sessions!: Table<Session, number>;
  reflections!: Table<SessionReflection, number>;

  constructor() {
    super('JournalDB');

    // Version 1: original journal entries only
    this.version(1).stores({
      entries: '++id, timestamp, questionId',
    });

    // Version 2: add sessions, reflections; extend entries with sessionId
    this.version(2).stores({
      entries: '++id, timestamp, questionId, sessionId',
      sessions: '++id, deckId, startedAt, status',
      reflections: '++id, sessionId',
    });
  }
}

export const db = new AppDatabase();

// Keep backward-compatible alias
export const journalDb = db;
