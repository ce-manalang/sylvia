import type { Deck, Question, ConversationLevel } from '../types/session';

export const STARTER_DECK: Deck = {
  id: 'starter',
  name: 'Getting Started',
  description:
    'A gentle introduction to meaningful self-reflection. 18 questions across three levels of depth.',
  questionCount: 18,
  levels: ['perception', 'connection', 'reflection'],
  free: true,
};

export const STARTER_QUESTIONS: Question[] = [
  // ── Level 1: Perception (surface-level self-awareness) ──
  {
    id: 'starter-p1',
    text: "What's something you've been thinking about lately?",
    level: 'perception',
    deckId: 'starter',
  },
  {
    id: 'starter-p2',
    text: 'What does a perfect day look like for you?',
    level: 'perception',
    deckId: 'starter',
  },
  {
    id: 'starter-p3',
    text: 'What song has been stuck in your head recently, and why do you think it chose you?',
    level: 'perception',
    deckId: 'starter',
  },
  {
    id: 'starter-p4',
    text: 'What small moment from today are you most likely to remember?',
    level: 'perception',
    deckId: 'starter',
  },
  {
    id: 'starter-p5',
    text: 'If you could have dinner with anyone, living or not, who would it be?',
    level: 'perception',
    deckId: 'starter',
  },
  {
    id: 'starter-p6',
    text: 'What is something you do just for yourself, with no audience?',
    level: 'perception',
    deckId: 'starter',
  },

  // ── Level 2: Connection (relationships, vulnerability) ──
  {
    id: 'starter-c1',
    text: 'What is something you wish people understood about you without you having to explain it?',
    level: 'connection',
    deckId: 'starter',
  },
  {
    id: 'starter-c2',
    text: 'When was the last time you felt truly seen by someone?',
    level: 'connection',
    deckId: 'starter',
  },
  {
    id: 'starter-c3',
    text: 'What is a boundary you have learned to set, and what did it cost you?',
    level: 'connection',
    deckId: 'starter',
    sensitive: true,
  },
  {
    id: 'starter-c4',
    text: 'What conversation have you been avoiding, and what would it take to have it?',
    level: 'connection',
    deckId: 'starter',
    sensitive: true,
  },
  {
    id: 'starter-c5',
    text: 'Who in your life makes you feel safe enough to be honest?',
    level: 'connection',
    deckId: 'starter',
  },
  {
    id: 'starter-c6',
    text: 'What is something kind someone did for you that you never forgot?',
    level: 'connection',
    deckId: 'starter',
  },

  // ── Level 3: Reflection (deep introspection) ──
  {
    id: 'starter-r1',
    text: 'What would you tell your younger self if you could send one message back?',
    level: 'reflection',
    deckId: 'starter',
  },
  {
    id: 'starter-r2',
    text: 'What are you most afraid to admit to yourself?',
    level: 'reflection',
    deckId: 'starter',
    sensitive: true,
  },
  {
    id: 'starter-r3',
    text: 'What part of yourself have you outgrown but not yet let go of?',
    level: 'reflection',
    deckId: 'starter',
  },
  {
    id: 'starter-r4',
    text: 'If your life had a theme for this chapter, what would you call it?',
    level: 'reflection',
    deckId: 'starter',
  },
  {
    id: 'starter-r5',
    text: 'What does forgiveness mean to you right now?',
    level: 'reflection',
    deckId: 'starter',
  },
  {
    id: 'starter-r6',
    text: 'What would change if you truly believed you were enough?',
    level: 'reflection',
    deckId: 'starter',
  },
];

/** All available decks */
export const DECKS: Deck[] = [STARTER_DECK];

/** Get all questions for a given deck */
export function getQuestionsForDeck(deckId: string): Question[] {
  return STARTER_QUESTIONS.filter((q) => q.deckId === deckId);
}

/** Get questions for a specific deck and level */
export function getQuestionsByLevel(
  deckId: string,
  level: ConversationLevel
): Question[] {
  return STARTER_QUESTIONS.filter(
    (q) => q.deckId === deckId && q.level === level
  );
}

/**
 * Build the ordered question list for a session.
 * Questions follow the 3-level progression: all Perception, then Connection, then Reflection.
 * Within each level, order is preserved (not shuffled) for consistent experience.
 */
export function buildSessionOrder(deckId: string): string[] {
  const levels: ConversationLevel[] = [
    'perception',
    'connection',
    'reflection',
  ];
  const ordered: string[] = [];
  for (const level of levels) {
    const questions = getQuestionsByLevel(deckId, level);
    for (const q of questions) {
      ordered.push(q.id);
    }
  }
  return ordered;
}

/** Look up a question by ID */
export function getQuestionById(questionId: string): Question | undefined {
  return STARTER_QUESTIONS.find((q) => q.id === questionId);
}
