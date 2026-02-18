import { useLiveQuery } from 'dexie-react-hooks';
import { journalDb } from '../db/schema';
import type { JournalEntry } from '../types/journal';

/**
 * Live-updating query of all journal entries from IndexedDB.
 * Returns undefined while data is loading.
 */
export function useJournalEntries(): JournalEntry[] | undefined {
  return useLiveQuery(
    () => journalDb.entries.orderBy('timestamp').reverse().toArray(),
    []
  );
}
