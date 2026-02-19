import { useLiveQuery } from 'dexie-react-hooks';
import { db } from '../../db/schema';
import { usePastSessions } from '../../hooks/useSessionStorage';
import { SessionCard } from './SessionCard';
import type { JournalEntry } from '../../types/journal';
import type { SessionReflection } from '../../types/session';

interface HistoryScreenProps {
  onBack: () => void;
}

export function HistoryScreen({ onBack }: HistoryScreenProps) {
  const sessions = usePastSessions();

  // Load all entries and reflections for completed sessions
  const allEntries = useLiveQuery(() => db.entries.toArray(), []);
  const allReflections = useLiveQuery(() => db.reflections.toArray(), []);

  // Group entries by session
  const entriesBySession = new Map<number, JournalEntry[]>();
  if (allEntries) {
    for (const entry of allEntries) {
      if (entry.sessionId != null) {
        const list = entriesBySession.get(entry.sessionId) ?? [];
        list.push(entry);
        entriesBySession.set(entry.sessionId, list);
      }
    }
  }

  // Map reflections by session
  const reflectionBySession = new Map<number, SessionReflection>();
  if (allReflections) {
    for (const r of allReflections) {
      reflectionBySession.set(r.sessionId, r);
    }
  }

  return (
    <div className="min-h-dvh bg-cream">
      {/* Header */}
      <header className="border-b border-sand/60 bg-cream/80 backdrop-blur-sm sticky top-0 z-10">
        <div className="max-w-2xl mx-auto px-4 py-4 flex items-center gap-3">
          <button
            onClick={onBack}
            className="text-sm text-slate hover:text-charcoal transition-colors"
          >
            Back
          </button>
          <h1 className="text-lg font-serif text-charcoal">Session History</h1>
        </div>
      </header>

      {/* Content */}
      <main className="max-w-2xl mx-auto w-full px-4 py-6">
        {sessions === undefined ? (
          <p className="text-slate text-sm animate-pulse">Loading...</p>
        ) : sessions.length === 0 ? (
          <div className="text-center py-16 space-y-3">
            <p className="text-charcoal font-serif text-lg">No sessions yet</p>
            <p className="text-sm text-slate">
              Start a conversation to see your history here.
            </p>
          </div>
        ) : (
          <div className="space-y-3">
            {sessions.map((session) => {
              const sessionEntries =
                session.id != null
                  ? entriesBySession.get(session.id) ?? []
                  : [];
              const reflection =
                session.id != null
                  ? reflectionBySession.get(session.id)
                  : undefined;

              return (
                <SessionCard
                  key={session.id}
                  session={session}
                  entries={sessionEntries}
                  moodRating={reflection?.moodRating}
                />
              );
            })}
          </div>
        )}
      </main>
    </div>
  );
}
