import { useLiveQuery } from 'dexie-react-hooks';
import { db } from '../db/schema';
import type { Session, SessionReflection } from '../types/session';
import { buildSessionOrder } from '../data/starter-deck';

/**
 * Create a new session in Dexie and return its ID.
 */
export async function createSession(deckId: string): Promise<number> {
  const questionsOrder = buildSessionOrder(deckId);
  const session: Session = {
    deckId,
    startedAt: Date.now(),
    currentQuestionIndex: 0,
    questionsOrder,
    skippedQuestions: [],
    status: 'active',
  };
  const id = await db.sessions.add(session);
  return id as number;
}

/**
 * Update the current question index for a session.
 */
export async function advanceSession(
  sessionId: number,
  newIndex: number
): Promise<void> {
  await db.sessions.update(sessionId, { currentQuestionIndex: newIndex });
}

/**
 * Add a question to the skipped list.
 */
export async function skipSessionQuestion(
  sessionId: number,
  questionId: string
): Promise<void> {
  const session = await db.sessions.get(sessionId);
  if (!session) return;
  const skipped = [...session.skippedQuestions, questionId];
  await db.sessions.update(sessionId, { skippedQuestions: skipped });
}

/**
 * Mark a session as completed.
 */
export async function completeSession(sessionId: number): Promise<void> {
  await db.sessions.update(sessionId, {
    status: 'completed',
    completedAt: Date.now(),
  });
}

/**
 * Mark a session as abandoned.
 */
export async function abandonSession(sessionId: number): Promise<void> {
  await db.sessions.update(sessionId, {
    status: 'abandoned',
    completedAt: Date.now(),
  });
}

/**
 * Save an end-of-session reflection.
 */
export async function saveReflection(
  reflection: Omit<SessionReflection, 'id'>
): Promise<number> {
  const id = await db.reflections.add(reflection);
  return id as number;
}

/**
 * Get reflection for a session.
 */
export async function getReflectionForSession(
  sessionId: number
): Promise<SessionReflection | undefined> {
  return db.reflections.where('sessionId').equals(sessionId).first();
}

/**
 * Live query: all active sessions.
 */
export function useActiveSessions(): Session[] | undefined {
  return useLiveQuery(
    () => db.sessions.where('status').equals('active').toArray(),
    []
  );
}

/**
 * Live query: all completed sessions, newest first.
 */
export function usePastSessions(): Session[] | undefined {
  return useLiveQuery(
    () =>
      db.sessions
        .where('status')
        .equals('completed')
        .reverse()
        .sortBy('startedAt'),
    []
  );
}

/**
 * Live query: get a single session by ID.
 */
export function useSession(sessionId: number | null): Session | undefined {
  return useLiveQuery(
    () => (sessionId ? db.sessions.get(sessionId) : undefined),
    [sessionId]
  );
}
