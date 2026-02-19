import { useState, useEffect, useCallback, useRef } from 'react';

interface TimerOverlayProps {
  /** Timer duration in seconds */
  duration: number;
  onComplete: () => void;
  isActive: boolean;
  onCancel: () => void;
}

export function TimerOverlay({
  duration,
  onComplete,
  isActive,
  onCancel,
}: TimerOverlayProps) {
  const [remaining, setRemaining] = useState(duration);
  const [paused, setPaused] = useState(false);
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);

  useEffect(() => {
    setRemaining(duration);
    setPaused(false);
  }, [duration, isActive]);

  useEffect(() => {
    if (!isActive || paused) {
      if (intervalRef.current) clearInterval(intervalRef.current);
      return;
    }

    intervalRef.current = setInterval(() => {
      setRemaining((prev) => {
        if (prev <= 1) {
          if (intervalRef.current) clearInterval(intervalRef.current);
          onComplete();
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current);
    };
  }, [isActive, paused, onComplete]);

  const togglePause = useCallback(() => {
    setPaused((p) => !p);
  }, []);

  if (!isActive) return null;

  const progress = 1 - remaining / duration;
  const minutes = Math.floor(remaining / 60);
  const seconds = remaining % 60;
  const timeStr = `${minutes}:${seconds.toString().padStart(2, '0')}`;

  return (
    <div className="fixed bottom-6 left-1/2 -translate-x-1/2 z-20">
      <div className="bg-white/90 backdrop-blur-sm rounded-full shadow-lg border border-sand/60
                      px-4 py-2 flex items-center gap-3">
        {/* Progress ring */}
        <svg width="28" height="28" viewBox="0 0 28 28">
          <circle
            cx="14"
            cy="14"
            r="12"
            fill="none"
            stroke="#e8dcc8"
            strokeWidth="2"
          />
          <circle
            cx="14"
            cy="14"
            r="12"
            fill="none"
            stroke="#d4a574"
            strokeWidth="2"
            strokeDasharray={`${progress * 75.4} 75.4`}
            strokeLinecap="round"
            transform="rotate(-90 14 14)"
            className="transition-all duration-1000 ease-linear"
          />
        </svg>

        <span className="text-sm font-medium text-charcoal tabular-nums">
          {timeStr}
        </span>

        <button
          onClick={togglePause}
          className="text-xs text-slate hover:text-charcoal transition-colors"
        >
          {paused ? 'Resume' : 'Pause'}
        </button>

        <button
          onClick={onCancel}
          className="text-xs text-slate/50 hover:text-slate transition-colors"
        >
          Stop
        </button>
      </div>
    </div>
  );
}

/** Timer setup control (shown before timer is active) */
interface TimerSetupProps {
  onStart: (seconds: number) => void;
  isVisible: boolean;
}

export function TimerSetup({ onStart, isVisible }: TimerSetupProps) {
  if (!isVisible) return null;

  const presets = [
    { label: '30s', seconds: 30 },
    { label: '1m', seconds: 60 },
    { label: '2m', seconds: 120 },
    { label: '5m', seconds: 300 },
  ];

  return (
    <div className="flex items-center gap-2">
      <span className="text-xs text-slate/60">Timer:</span>
      {presets.map((p) => (
        <button
          key={p.seconds}
          onClick={() => onStart(p.seconds)}
          className="text-xs text-slate hover:text-charcoal px-2 py-1 rounded-md
                     hover:bg-sand/30 transition-colors"
        >
          {p.label}
        </button>
      ))}
    </div>
  );
}
