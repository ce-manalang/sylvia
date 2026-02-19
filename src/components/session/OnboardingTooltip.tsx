import { useEffect } from 'react';

interface OnboardingTooltipProps {
  text: string;
  visible: boolean;
  onDismiss: () => void;
  /** Position relative to center: 'top' | 'bottom' */
  position?: 'top' | 'bottom';
}

export function OnboardingTooltip({
  text,
  visible,
  onDismiss,
  position = 'bottom',
}: OnboardingTooltipProps) {
  // Auto-dismiss after 4 seconds
  useEffect(() => {
    if (!visible) return;
    const timer = setTimeout(onDismiss, 4000);
    return () => clearTimeout(timer);
  }, [visible, onDismiss]);

  if (!visible) return null;

  const posClass =
    position === 'top'
      ? 'bottom-full mb-3'
      : 'top-full mt-3';

  return (
    <div
      className={`absolute left-1/2 -translate-x-1/2 ${posClass} z-30
                  animate-fade-in pointer-events-auto`}
      onClick={onDismiss}
    >
      <div className="bg-charcoal/90 text-white text-sm px-4 py-2.5 rounded-lg shadow-lg
                      whitespace-nowrap backdrop-blur-sm">
        {text}
        <div
          className={`absolute left-1/2 -translate-x-1/2 w-2 h-2 bg-charcoal/90 rotate-45
                      ${position === 'top' ? 'top-full -mt-1' : 'bottom-full mb-0 -mb-1'}`}
        />
      </div>
    </div>
  );
}
