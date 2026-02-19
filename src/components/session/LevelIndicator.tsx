import type { ConversationLevel } from '../../types/session';
import { LEVEL_LABELS, LEVEL_COLORS, LEVEL_ORDER } from '../../types/session';

interface LevelIndicatorProps {
  currentLevel: ConversationLevel;
  levelIndex: number;
  levelProgress: number;
}

export function LevelIndicator({
  currentLevel,
  levelIndex,
  levelProgress,
}: LevelIndicatorProps) {
  return (
    <div className="space-y-2">
      {/* Level label */}
      <p className="text-xs font-medium text-slate text-center">
        Level {levelIndex + 1}: {LEVEL_LABELS[currentLevel]}
      </p>

      {/* Progress segments */}
      <div className="flex gap-1.5">
        {LEVEL_ORDER.map((level, i) => {
          const isActive = i === levelIndex;
          const isCompleted = i < levelIndex;
          const fillPercent = isCompleted
            ? 100
            : isActive
              ? Math.max(0, Math.min(100, levelProgress * 100))
              : 0;

          return (
            <div
              key={level}
              className="flex-1 h-1.5 rounded-full overflow-hidden"
              style={{ backgroundColor: `${LEVEL_COLORS[level]}40` }}
            >
              <div
                className="h-full rounded-full transition-all duration-300 ease-out"
                style={{
                  width: `${fillPercent}%`,
                  backgroundColor: LEVEL_COLORS[level],
                }}
              />
            </div>
          );
        })}
      </div>
    </div>
  );
}
