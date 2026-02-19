import { useState, useCallback, useMemo } from 'react';
import type { Question, ConversationLevel } from '../types/session';
import { LEVEL_ORDER } from '../types/session';
import { advanceSession, skipSessionQuestion } from './useSessionStorage';
import { getQuestionById } from '../data/starter-deck';

interface SessionFlowState {
  currentIndex: number;
  currentQuestion: Question | undefined;
  currentLevel: ConversationLevel;
  isComplete: boolean;
  progress: {
    current: number;
    total: number;
    level: ConversationLevel;
    levelIndex: number;
    levelProgress: number;
  };
  skippedIds: string[];
}

interface SessionFlowActions {
  advanceToNext: () => Promise<void>;
  skipQuestion: () => Promise<void>;
}

export function useSessionFlow(
  sessionId: number | null,
  questionsOrder: string[],
  initialIndex: number = 0,
  initialSkipped: string[] = []
): SessionFlowState & SessionFlowActions {
  const [currentIndex, setCurrentIndex] = useState(initialIndex);
  const [skippedIds, setSkippedIds] = useState<string[]>(initialSkipped);

  const questions = useMemo(
    () =>
      questionsOrder
        .map((id) => getQuestionById(id))
        .filter((q): q is Question => q !== undefined),
    [questionsOrder]
  );

  const currentQuestion = questions[currentIndex];
  const isComplete = questions.length > 0 && currentIndex >= questions.length;

  const currentLevel: ConversationLevel = currentQuestion?.level ?? 'reflection';

  const progress = useMemo(() => {
    const total = questions.length;
    const current = currentIndex;

    // Determine level progress
    const levelQuestions = questions.filter((q) => q.level === currentLevel);
    const levelStart = questions.findIndex((q) => q.level === currentLevel);
    const levelCurrent = current - levelStart;
    const levelProgress =
      levelQuestions.length > 0 ? levelCurrent / levelQuestions.length : 0;
    const levelIndex = LEVEL_ORDER.indexOf(currentLevel);

    return { current, total, level: currentLevel, levelIndex, levelProgress };
  }, [currentIndex, questions, currentLevel]);

  const advanceToNext = useCallback(async () => {
    const nextIndex = currentIndex + 1;
    setCurrentIndex(nextIndex);
    if (sessionId) {
      await advanceSession(sessionId, nextIndex);
    }
  }, [currentIndex, sessionId]);

  const skipQuestion = useCallback(async () => {
    if (!currentQuestion) return;
    const questionId = currentQuestion.id;
    setSkippedIds((prev) => [...prev, questionId]);
    if (sessionId) {
      await skipSessionQuestion(sessionId, questionId);
    }
    // Advance after skipping
    const nextIndex = currentIndex + 1;
    setCurrentIndex(nextIndex);
    if (sessionId) {
      await advanceSession(sessionId, nextIndex);
    }
  }, [currentIndex, currentQuestion, sessionId]);

  return {
    currentIndex,
    currentQuestion,
    currentLevel,
    isComplete,
    progress,
    skippedIds,
    advanceToNext,
    skipQuestion,
  };
}
