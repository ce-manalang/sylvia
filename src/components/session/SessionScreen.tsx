import { useState, useCallback } from 'react';
import { useSession } from '../../hooks/useSessionStorage';
import { useSessionFlow } from '../../hooks/useSessionFlow';
import { useSwipeGesture } from '../../hooks/useSwipeGesture';
import { useOnboarding } from '../../hooks/useOnboarding';
import { QuestionCard } from './QuestionCard';
import { LevelIndicator } from './LevelIndicator';
import { TimerOverlay, TimerSetup } from './TimerOverlay';
import { OnboardingTooltip } from './OnboardingTooltip';

interface SessionScreenProps {
  sessionId: number;
  onComplete: () => void;
  onExit: () => void;
  onOpenJournal: (questionId: string) => void;
}

export function SessionScreen({
  sessionId,
  onComplete,
  onExit,
  onOpenJournal,
}: SessionScreenProps) {
  const session = useSession(sessionId);
  const [showExitConfirm, setShowExitConfirm] = useState(false);
  const [timerActive, setTimerActive] = useState(false);
  const [timerDuration, setTimerDuration] = useState(0);

  const {
    shouldShowTooltip,
    markTooltipSeen,
  } = useOnboarding();

  const {
    currentQuestion,
    currentLevel,
    isComplete,
    progress,
    advanceToNext,
    skipQuestion,
  } = useSessionFlow(
    sessionId,
    session?.questionsOrder ?? [],
    session?.currentQuestionIndex ?? 0,
    session?.skippedQuestions ?? []
  );

  const handleAdvance = useCallback(async () => {
    markTooltipSeen('swipe');
    await advanceToNext();
  }, [advanceToNext, markTooltipSeen]);

  const handleSkip = useCallback(async () => {
    markTooltipSeen('skip');
    await skipQuestion();
  }, [skipQuestion, markTooltipSeen]);

  const handleJournal = useCallback(() => {
    markTooltipSeen('journal');
    if (currentQuestion) {
      onOpenJournal(currentQuestion.id);
    }
  }, [currentQuestion, onOpenJournal, markTooltipSeen]);

  const { state: swipeState, handlers: gestureHandlers } = useSwipeGesture({
    onSwipe: handleAdvance,
    onTap: handleAdvance,
  });

  const handleTimerStart = useCallback((seconds: number) => {
    setTimerDuration(seconds);
    setTimerActive(true);
  }, []);

  const handleTimerComplete = useCallback(() => {
    setTimerActive(false);
  }, []);

  const handleTimerCancel = useCallback(() => {
    setTimerActive(false);
  }, []);

  // Session complete
  if (isComplete) {
    // Trigger completion callback
    onComplete();
    return null;
  }

  // Loading state
  if (!session || !currentQuestion) {
    return (
      <div className="flex items-center justify-center min-h-dvh">
        <p className="text-slate animate-pulse">Loading session...</p>
      </div>
    );
  }

  return (
    <div className="flex flex-col min-h-dvh bg-cream">
      {/* Top bar */}
      <div className="px-4 pt-4 pb-2">
        <div className="flex items-center justify-between mb-3">
          <button
            onClick={() => setShowExitConfirm(true)}
            className="text-sm text-slate hover:text-charcoal transition-colors p-1"
          >
            Exit
          </button>

          <TimerSetup
            onStart={handleTimerStart}
            isVisible={!timerActive}
          />
        </div>

        <LevelIndicator
          currentLevel={currentLevel}
          levelIndex={progress.levelIndex}
          levelProgress={progress.levelProgress}
        />
      </div>

      {/* Card area */}
      <div className="flex-1 flex items-center justify-center px-6 py-4 relative">
        <div className="relative w-full max-w-sm">
          <QuestionCard
            question={currentQuestion}
            level={currentLevel}
            questionNumber={progress.current + 1}
            totalQuestions={progress.total}
            swipeState={swipeState}
            gestureHandlers={gestureHandlers}
            onSkip={handleSkip}
            onJournal={handleJournal}
          />

          {/* Onboarding tooltips */}
          {progress.current === 0 && shouldShowTooltip('swipe') && (
            <OnboardingTooltip
              text="Swipe or tap to see the next question"
              visible
              onDismiss={() => markTooltipSeen('swipe')}
              position="bottom"
            />
          )}
          {progress.current === 1 && shouldShowTooltip('journal') && (
            <OnboardingTooltip
              text="Tap Write to journal your thoughts"
              visible
              onDismiss={() => markTooltipSeen('journal')}
              position="bottom"
            />
          )}
        </div>
      </div>

      {/* Subtle hint at bottom */}
      <div className="pb-4 text-center">
        <p className="text-xs text-slate/40">
          {progress.current + 1} of {progress.total}
        </p>
      </div>

      {/* Timer overlay */}
      <TimerOverlay
        duration={timerDuration}
        isActive={timerActive}
        onComplete={handleTimerComplete}
        onCancel={handleTimerCancel}
      />

      {/* Exit confirmation */}
      {showExitConfirm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-charcoal/30 backdrop-blur-sm">
          <div className="bg-white rounded-xl shadow-xl p-6 mx-6 max-w-sm w-full space-y-4">
            <h3 className="text-lg font-serif text-charcoal">Leave session?</h3>
            <p className="text-sm text-slate">
              Your progress and journal entries are saved. You can resume this
              session later from the home screen.
            </p>
            <div className="flex gap-3">
              <button
                onClick={() => setShowExitConfirm(false)}
                className="flex-1 py-2 rounded-lg border border-sand text-sm text-charcoal
                           hover:bg-sand/20 transition-colors"
              >
                Stay
              </button>
              <button
                onClick={onExit}
                className="flex-1 py-2 rounded-lg bg-terracotta text-white text-sm
                           hover:bg-terracotta/90 transition-colors"
              >
                Leave
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
