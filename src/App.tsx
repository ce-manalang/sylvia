import { useEffect, useState, useCallback } from 'react';
import { initializeDatabase } from './db/init';
import { useDisplayName } from './hooks/useDisplayName';
import { createSession } from './hooks/useSessionStorage';
import { WelcomeScreen } from './components/welcome/WelcomeScreen';
import { HomeScreen } from './components/home/HomeScreen';
import { SessionScreen } from './components/session/SessionScreen';
import { JournalPanel } from './components/session/JournalPanel';
import { ReflectionScreen } from './components/reflection/ReflectionScreen';
import { HistoryScreen } from './components/history/HistoryScreen';
import { SettingsScreen } from './components/settings/SettingsScreen';
import { getQuestionById } from './data/starter-deck';
import { useSession } from './hooks/useSessionStorage';

export type AppScreen = 'home' | 'session' | 'reflection' | 'history' | 'settings';

function App() {
  const { displayName, updateDisplayName } = useDisplayName();
  const [dbReady, setDbReady] = useState(false);
  const [screen, setScreen] = useState<AppScreen>('home');
  const [activeSessionId, setActiveSessionId] = useState<number | null>(null);
  const [journalQuestionId, setJournalQuestionId] = useState<string | null>(null);
  const [journalOpen, setJournalOpen] = useState(false);

  const activeSession = useSession(activeSessionId);

  useEffect(() => {
    initializeDatabase().then(() => setDbReady(true));
  }, []);

  const handleStartSession = useCallback(async (deckId: string) => {
    const sessionId = await createSession(deckId);
    setActiveSessionId(sessionId);
    setScreen('session');
  }, []);

  const handleResumeSession = useCallback((sessionId: number) => {
    setActiveSessionId(sessionId);
    setScreen('session');
  }, []);

  const handleSessionComplete = useCallback(() => {
    setScreen('reflection');
  }, []);

  const handleReflectionComplete = useCallback(() => {
    setActiveSessionId(null);
    setScreen('home');
  }, []);

  const handleNavigate = useCallback((target: AppScreen) => {
    setScreen(target);
  }, []);

  const handleBack = useCallback(() => {
    setScreen('home');
  }, []);

  const handleExitSession = useCallback(() => {
    // Session progress saved in Dexie (active status), can be resumed
    setScreen('home');
  }, []);

  const handleOpenJournal = useCallback((questionId: string) => {
    setJournalQuestionId(questionId);
    setJournalOpen(true);
  }, []);

  const handleCloseJournal = useCallback(() => {
    setJournalOpen(false);
    setJournalQuestionId(null);
  }, []);

  if (!dbReady) {
    return (
      <div className="flex items-center justify-center min-h-dvh">
        <p className="text-slate animate-pulse">Loading...</p>
      </div>
    );
  }

  if (!displayName) {
    return <WelcomeScreen onComplete={updateDisplayName} />;
  }

  // Determine the current question for journal panel context
  const currentJournalQuestion = journalQuestionId
    ? getQuestionById(journalQuestionId)
    : null;

  switch (screen) {
    case 'session':
      if (activeSessionId) {
        return (
          <>
            <SessionScreen
              sessionId={activeSessionId}
              onComplete={handleSessionComplete}
              onExit={handleExitSession}
              onOpenJournal={handleOpenJournal}
            />
            {activeSession && journalQuestionId && currentJournalQuestion && (
              <JournalPanel
                sessionId={activeSessionId}
                questionId={journalQuestionId}
                questionText={currentJournalQuestion.text}
                level={currentJournalQuestion.level}
                visible={journalOpen}
                onClose={handleCloseJournal}
              />
            )}
          </>
        );
      }
      // No active session, go home
      return (
        <HomeScreen
          displayName={displayName}
          onStartSession={handleStartSession}
          onNavigate={handleNavigate}
          onResumeSession={handleResumeSession}
        />
      );

    case 'reflection':
      if (activeSessionId) {
        return (
          <ReflectionScreen
            sessionId={activeSessionId}
            onComplete={handleReflectionComplete}
          />
        );
      }
      return (
        <HomeScreen
          displayName={displayName}
          onStartSession={handleStartSession}
          onNavigate={handleNavigate}
          onResumeSession={handleResumeSession}
        />
      );

    case 'history':
      return <HistoryScreen onBack={handleBack} />;

    case 'settings':
      return (
        <SettingsScreen
          displayName={displayName}
          onUpdateName={updateDisplayName}
          onBack={handleBack}
        />
      );

    case 'home':
    default:
      return (
        <HomeScreen
          displayName={displayName}
          onStartSession={handleStartSession}
          onNavigate={handleNavigate}
          onResumeSession={handleResumeSession}
        />
      );
  }
}

export default App;
