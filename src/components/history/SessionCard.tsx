import { useState } from 'react';
import type { Session } from '../../types/session';
import type { JournalEntry } from '../../types/journal';
import { DECKS, getQuestionById } from '../../data/starter-deck';

interface SessionCardProps {
  session: Session;
  entries: JournalEntry[];
  moodRating?: string;
}

export function SessionCard({ session, entries, moodRating }: SessionCardProps) {
  const [expanded, setExpanded] = useState(false);
  const deck = DECKS.find((d) => d.id === session.deckId);

  const date = new Date(session.startedAt);
  const dateStr = date.toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  });
  const timeStr = date.toLocaleTimeString('en-US', {
    hour: 'numeric',
    minute: '2-digit',
  });

  return (
    <div className="rounded-xl border border-sand/60 bg-white/50 overflow-hidden">
      <button
        onClick={() => setExpanded(!expanded)}
        className="w-full text-left p-4 hover:bg-sand/10 transition-colors"
      >
        <div className="flex items-start justify-between">
          <div>
            <p className="text-sm font-medium text-charcoal">
              {deck?.name ?? 'Session'}
            </p>
            <p className="text-xs text-slate mt-0.5">
              {dateStr} at {timeStr}
            </p>
          </div>
          <div className="flex items-center gap-2">
            {moodRating && (
              <span className="text-xs bg-sage/15 text-sage px-2 py-0.5 rounded-full">
                {moodRating}
              </span>
            )}
            <span className="text-xs text-slate/50">
              {entries.length} {entries.length === 1 ? 'entry' : 'entries'}
            </span>
            <svg
              className={`w-4 h-4 text-slate/40 transition-transform ${expanded ? 'rotate-180' : ''}`}
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              strokeWidth={2}
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M19 9l-7 7-7-7"
              />
            </svg>
          </div>
        </div>
      </button>

      {expanded && entries.length > 0 && (
        <div className="border-t border-sand/40 px-4 py-3 space-y-3">
          {entries.map((entry) => {
            const question = getQuestionById(entry.questionId);
            return (
              <div key={entry.id} className="space-y-1">
                <p className="text-xs text-slate">
                  {question?.text ?? 'Question'}
                </p>
                <p className="text-sm text-charcoal leading-relaxed">
                  {entry.answer}
                </p>
                {entry.emotionTags.length > 0 && (
                  <div className="flex gap-1">
                    {entry.emotionTags.map((tag) => (
                      <span
                        key={tag}
                        className="text-xs text-slate/60 bg-sand/20 px-1.5 py-0.5 rounded-full"
                      >
                        {tag}
                      </span>
                    ))}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}

      {expanded && entries.length === 0 && (
        <div className="border-t border-sand/40 px-4 py-3">
          <p className="text-xs text-slate/50 italic">
            No journal entries for this session
          </p>
        </div>
      )}
    </div>
  );
}
