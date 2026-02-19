import { DECKS } from '../../data/starter-deck';
import { useActiveSessions } from '../../hooks/useSessionStorage';
import { DeckCard } from './DeckCard';
import type { AppScreen } from '../../App';

interface HomeScreenProps {
  displayName: string;
  onStartSession: (deckId: string) => void;
  onNavigate: (screen: AppScreen) => void;
  onResumeSession: (sessionId: number) => void;
}

export function HomeScreen({
  displayName,
  onStartSession,
  onNavigate,
  onResumeSession,
}: HomeScreenProps) {
  const activeSessions = useActiveSessions();

  return (
    <div className="flex flex-col min-h-dvh">
      {/* Header */}
      <header className="border-b border-sand/60 bg-cream/80 backdrop-blur-sm sticky top-0 z-10">
        <div className="max-w-2xl mx-auto px-4 py-4 flex items-center justify-between">
          <h1 className="text-lg font-serif text-charcoal">WNRS</h1>
          <span className="text-sm text-slate">Hi, {displayName}</span>
        </div>
      </header>

      {/* Content */}
      <main className="flex-1 max-w-2xl mx-auto w-full px-4 py-8">
        <div className="space-y-8">
          {/* Resume active session */}
          {activeSessions && activeSessions.length > 0 && (
            <div className="space-y-3">
              <h2 className="text-sm font-medium text-slate uppercase tracking-wide">
                Continue
              </h2>
              {activeSessions.map((session) => (
                <button
                  key={session.id}
                  onClick={() => session.id && onResumeSession(session.id)}
                  className="w-full text-left rounded-xl border border-terracotta/30 bg-terracotta/5 p-4
                             hover:bg-terracotta/10 transition-colors"
                >
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-charcoal">
                        Session in progress
                      </p>
                      <p className="text-xs text-slate mt-0.5">
                        Question {session.currentQuestionIndex + 1} of{' '}
                        {session.questionsOrder.length}
                      </p>
                    </div>
                    <span className="text-terracotta text-sm font-medium">
                      Resume
                    </span>
                  </div>
                </button>
              ))}
            </div>
          )}

          {/* Deck selection */}
          <div className="space-y-3">
            <h2 className="text-sm font-medium text-slate uppercase tracking-wide">
              Choose a deck
            </h2>
            <div className="space-y-4">
              {DECKS.map((deck) => (
                <DeckCard
                  key={deck.id}
                  deck={deck}
                  onStart={onStartSession}
                />
              ))}
            </div>
          </div>

          {/* Quick links */}
          <div className="grid grid-cols-2 gap-3">
            <button
              onClick={() => onNavigate('history')}
              className="rounded-xl border border-sand/60 bg-white/30 p-4 text-left
                         hover:bg-white/50 transition-colors"
            >
              <p className="text-sm font-medium text-charcoal">Journal</p>
              <p className="text-xs text-slate mt-0.5">Past reflections</p>
            </button>
            <button
              onClick={() => onNavigate('settings')}
              className="rounded-xl border border-sand/60 bg-white/30 p-4 text-left
                         hover:bg-white/50 transition-colors"
            >
              <p className="text-sm font-medium text-charcoal">Settings</p>
              <p className="text-xs text-slate mt-0.5">Preferences</p>
            </button>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="border-t border-sand/40 py-4">
        <p className="text-center text-xs text-slate/60">
          WNRS Companion — your data stays on this device
        </p>
      </footer>
    </div>
  );
}
