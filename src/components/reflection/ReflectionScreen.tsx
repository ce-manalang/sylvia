import { useState, useCallback, useEffect } from 'react';
import { useSession, completeSession, saveReflection } from '../../hooks/useSessionStorage';
import { useSessionEntries } from '../../hooks/useJournalStorage';
import { MoodCheckIn } from './MoodCheckIn';
import { FavoriteAnswer } from './FavoriteAnswer';
import { LearnedInsight } from './LearnedInsight';
import { DECKS } from '../../data/starter-deck';

interface ReflectionScreenProps {
  sessionId: number;
  onComplete: () => void;
}

export function ReflectionScreen({
  sessionId,
  onComplete,
}: ReflectionScreenProps) {
  const session = useSession(sessionId);
  const entries = useSessionEntries(sessionId);

  const [mood, setMood] = useState<string | null>(null);
  const [favoriteId, setFavoriteId] = useState<string | null>(null);
  const [insight, setInsight] = useState('');
  const [saving, setSaving] = useState(false);
  const [shareMessage, setShareMessage] = useState('');

  // Precompute deck info
  const deck = session ? DECKS.find((d) => d.id === session.deckId) : null;
  const answeredCount = entries?.length ?? 0;
  const skippedCount = session?.skippedQuestions.length ?? 0;
  const totalQuestions = session?.questionsOrder.length ?? 0;

  // Auto-scroll to top on mount
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  const handleSave = useCallback(async () => {
    if (saving) return;
    setSaving(true);

    try {
      // Build share summary text
      const parts: string[] = [];
      parts.push(`Session: ${deck?.name ?? 'Conversation'}`);
      if (mood) parts.push(`Mood: ${mood}`);
      if (insight.trim()) parts.push(`Insight: ${insight.trim()}`);
      const shareSummary = parts.join('\n');

      await saveReflection({
        sessionId,
        favoriteQuestionId: favoriteId ?? undefined,
        learnedInsight: insight.trim() || undefined,
        moodRating: mood ?? undefined,
        savedAt: Date.now(),
        shareSummary,
      });

      await completeSession(sessionId);
      onComplete();
    } catch (error) {
      console.error('[Reflection] Failed to save:', error);
      setSaving(false);
    }
  }, [sessionId, mood, favoriteId, insight, deck, saving, onComplete]);

  const handleShare = useCallback(async () => {
    const parts: string[] = [];
    parts.push(`I just had a ${deck?.name ?? ''} session on WNRS Companion.`);
    if (mood) parts.push(`Feeling: ${mood}`);
    if (insight.trim()) parts.push(`Takeaway: "${insight.trim()}"`);

    const text = parts.join('\n');

    try {
      await navigator.clipboard.writeText(text);
      setShareMessage('Copied to clipboard');
      setTimeout(() => setShareMessage(''), 2000);
    } catch {
      // Fallback: do nothing silently
      setShareMessage('Could not copy');
      setTimeout(() => setShareMessage(''), 2000);
    }
  }, [deck, mood, insight]);

  if (!session) {
    return (
      <div className="flex items-center justify-center min-h-dvh">
        <p className="text-slate animate-pulse">Loading reflection...</p>
      </div>
    );
  }

  return (
    <div className="min-h-dvh bg-cream">
      <div className="max-w-lg mx-auto px-4 py-8 space-y-8">
        {/* Header */}
        <div className="text-center space-y-2">
          <h1 className="text-2xl font-serif text-charcoal">
            Session Complete
          </h1>
          <p className="text-sm text-slate">
            {deck?.name ?? 'Conversation'} — {answeredCount} reflections,{' '}
            {skippedCount > 0 ? `${skippedCount} skipped, ` : ''}
            {totalQuestions} questions
          </p>
        </div>

        {/* Divider */}
        <div className="border-t border-sand/60" />

        {/* Mood check-in */}
        <MoodCheckIn selected={mood} onSelect={setMood} />

        {/* Favorite answer */}
        {entries && entries.length > 0 && (
          <>
            <div className="border-t border-sand/30" />
            <FavoriteAnswer
              entries={entries}
              selectedId={favoriteId}
              onSelect={setFavoriteId}
            />
          </>
        )}

        {/* Learned insight */}
        <div className="border-t border-sand/30" />
        <LearnedInsight value={insight} onChange={setInsight} />

        {/* Actions */}
        <div className="space-y-3 pt-4">
          <button
            onClick={handleSave}
            disabled={saving}
            className="w-full py-3 rounded-lg bg-terracotta text-white font-medium text-sm
                       hover:bg-terracotta/90 disabled:opacity-50 transition-colors"
          >
            {saving ? 'Saving...' : 'Save & Finish'}
          </button>

          <button
            onClick={handleShare}
            className="w-full py-2.5 rounded-lg border border-sand text-sm text-slate
                       hover:bg-sand/20 transition-colors"
          >
            {shareMessage || 'Share insight'}
          </button>

          <button
            onClick={onComplete}
            className="w-full py-2 text-xs text-slate/50 hover:text-slate transition-colors"
          >
            Skip reflection
          </button>
        </div>
      </div>
    </div>
  );
}
