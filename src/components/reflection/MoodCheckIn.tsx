const MOODS = [
  { value: 'drained', label: 'Drained', color: '#6b7280' },
  { value: 'neutral', label: 'Neutral', color: '#e8dcc8' },
  { value: 'calm', label: 'Calm', color: '#a8b5a0' },
  { value: 'energized', label: 'Energized', color: '#d4a574' },
  { value: 'inspired', label: 'Inspired', color: '#c4956a' },
] as const;

interface MoodCheckInProps {
  selected: string | null;
  onSelect: (mood: string) => void;
}

export function MoodCheckIn({ selected, onSelect }: MoodCheckInProps) {
  return (
    <div className="space-y-3">
      <h3 className="text-sm font-medium text-charcoal">
        How are you feeling after this session?
      </h3>
      <div className="flex justify-between gap-2">
        {MOODS.map((mood) => {
          const isActive = selected === mood.value;
          return (
            <button
              key={mood.value}
              onClick={() => onSelect(mood.value)}
              className="flex flex-col items-center gap-1.5 flex-1 py-3 rounded-xl transition-all"
              style={{
                backgroundColor: isActive ? `${mood.color}25` : 'transparent',
                borderWidth: 1,
                borderColor: isActive ? mood.color : '#e8dcc860',
              }}
            >
              <div
                className="w-6 h-6 rounded-full transition-transform"
                style={{
                  backgroundColor: mood.color,
                  transform: isActive ? 'scale(1.2)' : 'scale(1)',
                }}
              />
              <span
                className="text-xs transition-colors"
                style={{ color: isActive ? '#2d3436' : '#6b7280' }}
              >
                {mood.label}
              </span>
            </button>
          );
        })}
      </div>
    </div>
  );
}
