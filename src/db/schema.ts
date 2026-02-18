import Dexie, { type Table } from 'dexie';
import type { JournalEntry } from '../types/journal';

export class JournalDatabase extends Dexie {
  entries!: Table<JournalEntry, number>;

  constructor() {
    super('JournalDB');

    this.version(1).stores({
      entries: '++id, timestamp, questionId',
    });
  }
}

export const journalDb = new JournalDatabase();
