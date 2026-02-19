import { EMOTION_TAGS } from '../../types/journal';

interface EmotionTagPickerProps {
  selected: string[];
  onToggle: (tag: string) => void;
  accentColor?: string;
}

export function EmotionTagPicker({
  selected,
  onToggle,
  accentColor = '#d4a574',
}: EmotionTagPickerProps) {
  return (
    <div className="flex flex-wrap gap-2">
      {EMOTION_TAGS.map((tag) => {
        const isSelected = selected.includes(tag);
        return (
          <button
            key={tag}
            onClick={() => onToggle(tag)}
            className="px-3 py-1.5 rounded-full text-xs font-medium transition-colors border"
            style={{
              backgroundColor: isSelected ? accentColor : 'transparent',
              borderColor: isSelected ? accentColor : '#e8dcc8',
              color: isSelected ? '#fff' : '#6b7280',
            }}
          >
            {tag}
          </button>
        );
      })}
    </div>
  );
}
