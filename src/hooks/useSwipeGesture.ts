import { useRef, useCallback, useState } from 'react';

export interface SwipeState {
  /** Current horizontal offset during drag */
  offsetX: number;
  /** Current vertical offset during drag */
  offsetY: number;
  /** Whether the user is actively dragging */
  isDragging: boolean;
  /** Whether a swipe-away animation is in progress */
  isSwiping: boolean;
  /** Direction of the completed swipe */
  swipeDirection: 'left' | 'up' | null;
}

interface SwipeConfig {
  /** Minimum distance in px to count as a swipe (default: 60) */
  threshold?: number;
  /** Maximum duration in ms for a tap (default: 300) */
  tapMaxDuration?: number;
  /** Maximum movement in px for a tap (default: 15) */
  tapMaxDistance?: number;
  onSwipe?: () => void;
  onTap?: () => void;
}

const SWIPE_THRESHOLD = 60;
const TAP_MAX_DURATION = 300;
const TAP_MAX_DISTANCE = 15;
const SWIPE_EXIT_DURATION = 250;

export function useSwipeGesture(config: SwipeConfig = {}) {
  const {
    threshold = SWIPE_THRESHOLD,
    tapMaxDuration = TAP_MAX_DURATION,
    tapMaxDistance = TAP_MAX_DISTANCE,
    onSwipe,
    onTap,
  } = config;

  const [state, setState] = useState<SwipeState>({
    offsetX: 0,
    offsetY: 0,
    isDragging: false,
    isSwiping: false,
    swipeDirection: null,
  });

  const startPos = useRef({ x: 0, y: 0 });
  const startTime = useRef(0);
  const isTracking = useRef(false);

  const getEventPos = (
    e: React.TouchEvent | React.MouseEvent
  ): { x: number; y: number } => {
    if ('touches' in e) {
      const touch = e.touches[0] ?? e.changedTouches[0];
      return touch ? { x: touch.clientX, y: touch.clientY } : { x: 0, y: 0 };
    }
    return { x: e.clientX, y: e.clientY };
  };

  const handleStart = useCallback(
    (e: React.TouchEvent | React.MouseEvent) => {
      const pos = getEventPos(e);
      startPos.current = pos;
      startTime.current = Date.now();
      isTracking.current = true;
      setState((s) => ({ ...s, isDragging: true, offsetX: 0, offsetY: 0 }));
    },
    []
  );

  const handleMove = useCallback(
    (e: React.TouchEvent | React.MouseEvent) => {
      if (!isTracking.current) return;
      const pos = getEventPos(e);
      const dx = pos.x - startPos.current.x;
      const dy = pos.y - startPos.current.y;
      setState((s) => ({ ...s, offsetX: dx, offsetY: dy }));
    },
    []
  );

  const handleEnd = useCallback(
    (e: React.TouchEvent | React.MouseEvent) => {
      if (!isTracking.current) return;
      isTracking.current = false;

      const pos = getEventPos(e);
      const dx = pos.x - startPos.current.x;
      const dy = pos.y - startPos.current.y;
      const distance = Math.sqrt(dx * dx + dy * dy);
      const duration = Date.now() - startTime.current;

      // Check for tap
      if (distance < tapMaxDistance && duration < tapMaxDuration) {
        setState({
          offsetX: 0,
          offsetY: 0,
          isDragging: false,
          isSwiping: false,
          swipeDirection: null,
        });
        onTap?.();
        return;
      }

      // Check for swipe
      const absX = Math.abs(dx);
      const absY = Math.abs(dy);

      if (absX > threshold || absY > threshold) {
        const direction: 'left' | 'up' =
          absX > absY ? 'left' : 'up';

        // Animate exit
        const exitX = direction === 'left' ? (dx < 0 ? -500 : 500) : 0;
        const exitY = direction === 'up' ? -500 : 0;

        setState({
          offsetX: exitX,
          offsetY: exitY,
          isDragging: false,
          isSwiping: true,
          swipeDirection: direction,
        });

        // After animation, reset and notify
        setTimeout(() => {
          setState({
            offsetX: 0,
            offsetY: 0,
            isDragging: false,
            isSwiping: false,
            swipeDirection: null,
          });
          onSwipe?.();
        }, SWIPE_EXIT_DURATION);
        return;
      }

      // Not enough movement, snap back
      setState({
        offsetX: 0,
        offsetY: 0,
        isDragging: false,
        isSwiping: false,
        swipeDirection: null,
      });
    },
    [threshold, tapMaxDistance, tapMaxDuration, onSwipe, onTap]
  );

  const handlers = {
    onTouchStart: handleStart,
    onTouchMove: handleMove,
    onTouchEnd: handleEnd,
    onMouseDown: handleStart,
    onMouseMove: handleMove,
    onMouseUp: handleEnd,
    onMouseLeave: handleEnd,
  };

  return { state, handlers };
}
