import type { JournalEntry } from '../../types/journal';
import { getQuestionById } from '../../data/starter-deck';

interface FavoriteAnswerProps {
  entries: JournalEntry[];
  selectedId: string | null;
  onSelect: (questionId: string) => void;
}

export function FavoriteAnswer({
  entries,
  selectedId,
  onSelect,
}: FavoriteAnswerProps) {
  if (entries.length === 0) {
    return null;
  }

  return (
    <div className="space-y-3">
      <h3 className="text-sm font-medium text-charcoal">
        Which reflection resonated most with you?
      </h3>
      <div className="space-y-2">
        {entries.map((entry) => {
          const question = getQuestionById(entry.questionId);
          const isSelected = selectedId === entry.questionId;

          return (
            <button
              key={entry.id}
              onClick={() => onSelect(entry.questionId)}
              className="w-full text-left rounded-xl p-4 transition-all border"
              style={{
                backgroundColor: isSelected ? '#d4a57415' : '#ffffff40',
                borderColor: isSelected ? '#d4a574' : '#e8dcc860',
              }}
            >
              <p className="text-xs text-slate mb-1.5">
                {question?.text ?? 'Question'}
              </p>
              <p className="text-sm text-charcoal leading-relaxed line-clamp-2">
                {entry.answer}
              </p>
              {entry.emotionTags.length > 0 && (
                <div className="flex gap-1 mt-2">
                  {entry.emotionTags.map((tag) => (
                    <span
                      key={tag}
                      className="text-xs text-slate/70 bg-sand/30 px-2 py-0.5 rounded-full"
                    >
                      {tag}
                    </span>
                  ))}
                </div>
              )}
            </button>
          );
        })}
      </div>
    </div>
  );
}
