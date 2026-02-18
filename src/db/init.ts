import { journalDb } from './schema';

export async function initializeDatabase(): Promise<void> {
  try {
    await journalDb.open();
    console.log('[DB] JournalDB initialized successfully');
  } catch (error) {
    console.error('[DB] Failed to initialize JournalDB:', error);
  }
}
