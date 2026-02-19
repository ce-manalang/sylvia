import type { Deck } from '../../types/session';
import { LEVEL_COLORS, LEVEL_LABELS } from '../../types/session';

interface DeckCardProps {
  deck: Deck;
  onStart: (deckId: string) => void;
}

export function DeckCard({ deck, onStart }: DeckCardProps) {
  return (
    <div className="rounded-2xl border border-sand/60 bg-white/50 p-6 shadow-sm">
      <div className="space-y-4">
        <div>
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-serif text-charcoal">{deck.name}</h3>
            {deck.free && (
              <span className="text-xs font-medium text-sage bg-sage/15 px-2 py-0.5 rounded-full">
                Free
              </span>
            )}
          </div>
          <p className="text-sm text-slate mt-1 leading-relaxed">
            {deck.description}
          </p>
        </div>

        {/* Level indicators */}
        <div className="flex gap-2">
          {deck.levels.map((level) => (
            <div key={level} className="flex items-center gap-1.5">
              <div
                className="w-2.5 h-2.5 rounded-full"
                style={{ backgroundColor: LEVEL_COLORS[level] }}
              />
              <span className="text-xs text-slate">{LEVEL_LABELS[level]}</span>
            </div>
          ))}
        </div>

        <div className="flex items-center justify-between pt-1">
          <span className="text-xs text-slate/70">
            {deck.questionCount} questions
          </span>
          <button
            onClick={() => onStart(deck.id)}
            className="px-5 py-2 rounded-lg bg-terracotta text-white text-sm font-medium
                       hover:bg-terracotta/90 active:bg-terracotta/80
                       transition-colors"
          >
            Start
          </button>
        </div>
      </div>
    </div>
  );
}
