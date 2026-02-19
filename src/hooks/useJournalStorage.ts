import { useLiveQuery } from 'dexie-react-hooks';
import { db } from '../db/schema';
import type { JournalEntry } from '../types/journal';

/**
 * Live-updating query of all journal entries from IndexedDB.
 * Returns undefined while data is loading.
 */
export function useJournalEntries(): JournalEntry[] | undefined {
  return useLiveQuery(
    () => db.entries.orderBy('timestamp').reverse().toArray(),
    []
  );
}

/**
 * Live query: get journal entries for a specific session.
 */
export function useSessionEntries(
  sessionId: number | null
): JournalEntry[] | undefined {
  return useLiveQuery(
    (): Promise<JournalEntry[]> =>
      sessionId
        ? db.entries.where('sessionId').equals(sessionId).toArray()
        : Promise.resolve([]),
    [sessionId]
  );
}

/**
 * Save a journal entry to IndexedDB.
 */
export async function saveJournalEntry(
  entry: Omit<JournalEntry, 'id'>
): Promise<number> {
  const id = await db.entries.add(entry as JournalEntry);
  return id as number;
}

/**
 * Update an existing journal entry's answer text.
 */
export async function updateJournalAnswer(
  entryId: number,
  answer: string
): Promise<void> {
  await db.entries.update(entryId, { answer, updatedAt: Date.now() });
}

/**
 * Update emotion tags for a journal entry.
 */
export async function updateEntryEmotions(
  entryId: number,
  emotionTags: string[]
): Promise<void> {
  await db.entries.update(entryId, { emotionTags, updatedAt: Date.now() });
}

/**
 * Get all entries for a session (non-live, for one-time reads).
 */
export async function getEntriesForSession(
  sessionId: number
): Promise<JournalEntry[]> {
  return db.entries.where('sessionId').equals(sessionId).toArray();
}

/**
 * Get a single entry by question ID and session ID.
 */
export async function getEntryForQuestion(
  sessionId: number,
  questionId: string
): Promise<JournalEntry | undefined> {
  return db.entries
    .where('sessionId')
    .equals(sessionId)
    .filter((e) => e.questionId === questionId)
    .first();
}
