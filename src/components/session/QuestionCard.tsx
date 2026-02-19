import type { Question, ConversationLevel } from '../../types/session';
import { LEVEL_COLORS, LEVEL_LABELS } from '../../types/session';
import type { SwipeState } from '../../hooks/useSwipeGesture';

interface QuestionCardProps {
  question: Question;
  level: ConversationLevel;
  questionNumber: number;
  totalQuestions: number;
  swipeState: SwipeState;
  gestureHandlers: Record<string, (e: never) => void>;
  onSkip: () => void;
  onJournal: () => void;
}

export function QuestionCard({
  question,
  level,
  questionNumber,
  totalQuestions,
  swipeState,
  gestureHandlers,
  onSkip,
  onJournal,
}: QuestionCardProps) {
  const bgColor = LEVEL_COLORS[level];
  const levelLabel = LEVEL_LABELS[level];

  // Transform based on gesture
  const { offsetX, offsetY, isDragging, isSwiping } = swipeState;
  const rotation = isDragging ? offsetX * 0.05 : 0;

  const cardStyle: React.CSSProperties = {
    backgroundColor: bgColor,
    transform: `translateX(${offsetX}px) translateY(${offsetY}px) rotate(${rotation}deg)`,
    transition: isDragging ? 'none' : isSwiping ? 'transform 250ms ease-out' : 'transform 300ms ease-out',
    touchAction: 'none',
    userSelect: 'none',
  };

  // Opacity hint: card fades slightly when being dragged away
  const opacity = isDragging
    ? Math.max(0.5, 1 - Math.abs(offsetX) / 400)
    : isSwiping
      ? 0
      : 1;

  return (
    <div
      className="relative w-full max-w-sm mx-auto aspect-[3/4] rounded-2xl shadow-lg border border-black/5
                 flex flex-col items-center justify-center p-8 cursor-grab active:cursor-grabbing select-none"
      style={{ ...cardStyle, opacity }}
      {...gestureHandlers}
    >
      {/* Level badge */}
      <div className="absolute top-4 left-4">
        <span
          className="text-xs font-medium px-2.5 py-1 rounded-full"
          style={{ backgroundColor: `${bgColor}cc`, color: '#2d3436' }}
        >
          {levelLabel}
        </span>
      </div>

      {/* Question counter */}
      <div className="absolute top-4 right-4">
        <span className="text-xs text-charcoal/50">
          {questionNumber}/{totalQuestions}
        </span>
      </div>

      {/* Question text */}
      <p className="text-xl md:text-2xl font-serif text-charcoal text-center leading-relaxed">
        {question.text}
      </p>

      {/* Sensitive indicator */}
      {question.sensitive && (
        <p className="absolute bottom-16 text-xs text-charcoal/40 italic">
          This is a sensitive question
        </p>
      )}

      {/* Bottom actions */}
      <div className="absolute bottom-4 left-4 right-4 flex items-center justify-between">
        <button
          onClick={(e) => {
            e.stopPropagation();
            onSkip();
          }}
          className="text-xs text-charcoal/40 hover:text-charcoal/70 transition-colors px-2 py-1"
        >
          Skip
        </button>

        <button
          onClick={(e) => {
            e.stopPropagation();
            onJournal();
          }}
          className="text-xs font-medium text-charcoal/60 hover:text-charcoal/90 transition-colors
                     px-3 py-1.5 rounded-lg bg-white/30 hover:bg-white/50"
        >
          Write
        </button>
      </div>
    </div>
  );
}
