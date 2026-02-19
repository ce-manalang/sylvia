import { useState, useCallback, useEffect } from 'react';
import { EmotionTagPicker } from './EmotionTagPicker';
import {
  saveJournalEntry,
  getEntryForQuestion,
  updateJournalAnswer,
  updateEntryEmotions,
} from '../../hooks/useJournalStorage';
import { LEVEL_COLORS } from '../../types/session';
import type { ConversationLevel } from '../../types/session';

interface JournalPanelProps {
  sessionId: number;
  questionId: string;
  questionText: string;
  level: ConversationLevel;
  visible: boolean;
  onClose: () => void;
}

export function JournalPanel({
  sessionId,
  questionId,
  questionText,
  level,
  visible,
  onClose,
}: JournalPanelProps) {
  const [answer, setAnswer] = useState('');
  const [emotionTags, setEmotionTags] = useState<string[]>([]);
  const [existingEntryId, setExistingEntryId] = useState<number | null>(null);
  const [saved, setSaved] = useState(false);

  // Load existing entry if user already wrote for this question
  useEffect(() => {
    if (!visible) return;
    setSaved(false);
    getEntryForQuestion(sessionId, questionId).then((entry) => {
      if (entry) {
        setAnswer(entry.answer);
        setEmotionTags(entry.emotionTags ?? []);
        setExistingEntryId(entry.id ?? null);
      } else {
        setAnswer('');
        setEmotionTags([]);
        setExistingEntryId(null);
      }
    });
  }, [visible, sessionId, questionId]);

  const handleToggleEmotion = useCallback((tag: string) => {
    setEmotionTags((prev) =>
      prev.includes(tag) ? prev.filter((t) => t !== tag) : [...prev, tag]
    );
  }, []);

  const handleSave = useCallback(async () => {
    if (!answer.trim()) return;

    if (existingEntryId) {
      // Update existing
      await updateJournalAnswer(existingEntryId, answer.trim());
      await updateEntryEmotions(existingEntryId, emotionTags);
    } else {
      // Create new
      await saveJournalEntry({
        questionId,
        sessionId,
        answer: answer.trim(),
        emotionTags,
        level,
        timestamp: Date.now(),
      });
    }

    setSaved(true);
    setTimeout(() => {
      onClose();
    }, 600);
  }, [answer, emotionTags, existingEntryId, questionId, sessionId, level, onClose]);

  if (!visible) return null;

  const accentColor = LEVEL_COLORS[level];

  return (
    <div className="fixed inset-0 z-40 flex items-end justify-center">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-charcoal/20 backdrop-blur-sm"
        onClick={onClose}
      />

      {/* Panel */}
      <div
        className="relative w-full max-w-lg bg-white rounded-t-2xl shadow-xl
                   animate-slide-up max-h-[85vh] flex flex-col"
      >
        {/* Handle */}
        <div className="flex justify-center pt-3 pb-1">
          <div className="w-10 h-1 rounded-full bg-sand" />
        </div>

        <div className="flex-1 overflow-y-auto px-6 pb-6 space-y-5">
          {/* Question context */}
          <div className="pt-2">
            <p
              className="text-sm font-medium leading-relaxed"
              style={{ color: accentColor }}
            >
              {questionText}
            </p>
          </div>

          {/* Writing area */}
          <div>
            <textarea
              value={answer}
              onChange={(e) => setAnswer(e.target.value)}
              placeholder="What comes to mind?"
              rows={5}
              autoFocus
              className="w-full px-4 py-3 rounded-lg bg-cream/50 border border-sand/60
                         text-charcoal placeholder:text-slate/40 text-sm leading-relaxed resize-none
                         focus:outline-none focus:ring-2 focus:border-terracotta"
              style={{ focusRingColor: accentColor } as React.CSSProperties}
            />
          </div>

          {/* Emotion tags */}
          <div className="space-y-2">
            <p className="text-xs text-slate">How does this make you feel?</p>
            <EmotionTagPicker
              selected={emotionTags}
              onToggle={handleToggleEmotion}
              accentColor={accentColor}
            />
          </div>

          {/* Actions */}
          <div className="flex gap-3 pt-2">
            <button
              onClick={onClose}
              className="flex-1 py-2.5 rounded-lg border border-sand text-sm text-slate
                         hover:bg-sand/20 transition-colors"
            >
              Cancel
            </button>
            <button
              onClick={handleSave}
              disabled={!answer.trim()}
              className="flex-1 py-2.5 rounded-lg text-white text-sm font-medium
                         disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
              style={{ backgroundColor: saved ? '#a8b5a0' : accentColor }}
            >
              {saved ? 'Saved' : existingEntryId ? 'Update' : 'Save'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
