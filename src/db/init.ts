import { db } from './schema';

export async function initializeDatabase(): Promise<void> {
  try {
    await db.open();
    console.log('[DB] AppDatabase initialized successfully');
  } catch (error) {
    console.error('[DB] Failed to initialize AppDatabase:', error);
  }
}
