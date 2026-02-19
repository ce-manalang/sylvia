import { useState, useCallback } from 'react';

interface SettingsScreenProps {
  displayName: string;
  onUpdateName: (name: string) => void;
  onBack: () => void;
}

const CONTENT_WARNINGS_KEY = 'settings:contentWarnings';

export function SettingsScreen({
  displayName,
  onUpdateName,
  onBack,
}: SettingsScreenProps) {
  const [editingName, setEditingName] = useState(false);
  const [nameValue, setNameValue] = useState(displayName);
  const [contentWarnings, setContentWarnings] = useState(() => {
    return localStorage.getItem(CONTENT_WARNINGS_KEY) !== 'false';
  });

  const handleSaveName = useCallback(() => {
    if (nameValue.trim()) {
      onUpdateName(nameValue.trim());
      setEditingName(false);
    }
  }, [nameValue, onUpdateName]);

  const handleToggleWarnings = useCallback(() => {
    setContentWarnings((prev) => {
      const next = !prev;
      localStorage.setItem(CONTENT_WARNINGS_KEY, String(next));
      return next;
    });
  }, []);

  return (
    <div className="min-h-dvh bg-cream">
      {/* Header */}
      <header className="border-b border-sand/60 bg-cream/80 backdrop-blur-sm sticky top-0 z-10">
        <div className="max-w-2xl mx-auto px-4 py-4 flex items-center gap-3">
          <button
            onClick={onBack}
            className="text-sm text-slate hover:text-charcoal transition-colors"
          >
            Back
          </button>
          <h1 className="text-lg font-serif text-charcoal">Settings</h1>
        </div>
      </header>

      {/* Content */}
      <main className="max-w-2xl mx-auto w-full px-4 py-6 space-y-8">
        {/* Profile section */}
        <section className="space-y-3">
          <h2 className="text-xs font-medium text-slate uppercase tracking-wide">
            Profile
          </h2>
          <div className="rounded-xl border border-sand/60 bg-white/40 overflow-hidden">
            <div className="px-4 py-3 flex items-center justify-between">
              <div>
                <p className="text-xs text-slate">Display name</p>
                {editingName ? (
                  <div className="flex items-center gap-2 mt-1">
                    <input
                      type="text"
                      value={nameValue}
                      onChange={(e) => setNameValue(e.target.value)}
                      autoFocus
                      className="px-2 py-1 rounded border border-sand text-sm text-charcoal
                                 bg-cream/50 focus:outline-none focus:ring-1 focus:ring-terracotta/40"
                    />
                    <button
                      onClick={handleSaveName}
                      className="text-xs text-terracotta font-medium"
                    >
                      Save
                    </button>
                    <button
                      onClick={() => {
                        setEditingName(false);
                        setNameValue(displayName);
                      }}
                      className="text-xs text-slate"
                    >
                      Cancel
                    </button>
                  </div>
                ) : (
                  <p className="text-sm text-charcoal mt-0.5">{displayName}</p>
                )}
              </div>
              {!editingName && (
                <button
                  onClick={() => setEditingName(true)}
                  className="text-xs text-terracotta font-medium"
                >
                  Edit
                </button>
              )}
            </div>
          </div>
        </section>

        {/* Preferences section */}
        <section className="space-y-3">
          <h2 className="text-xs font-medium text-slate uppercase tracking-wide">
            Preferences
          </h2>
          <div className="rounded-xl border border-sand/60 bg-white/40 overflow-hidden">
            <div className="px-4 py-3 flex items-center justify-between">
              <div>
                <p className="text-sm text-charcoal">Content warnings</p>
                <p className="text-xs text-slate mt-0.5">
                  Show indicators on sensitive questions
                </p>
              </div>
              <button
                onClick={handleToggleWarnings}
                className={`relative w-10 h-6 rounded-full transition-colors ${
                  contentWarnings ? 'bg-terracotta' : 'bg-sand'
                }`}
              >
                <div
                  className={`absolute top-0.5 w-5 h-5 rounded-full bg-white shadow-sm transition-transform ${
                    contentWarnings ? 'left-[18px]' : 'left-0.5'
                  }`}
                />
              </button>
            </div>
          </div>
        </section>

        {/* Data section */}
        <section className="space-y-3">
          <h2 className="text-xs font-medium text-slate uppercase tracking-wide">
            Data
          </h2>
          <div className="rounded-xl border border-sand/60 bg-white/40 overflow-hidden">
            <div className="px-4 py-3">
              <p className="text-sm text-charcoal">Local storage</p>
              <p className="text-xs text-slate mt-0.5">
                All your data is stored locally on this device. Nothing is sent
                to any server.
              </p>
            </div>
          </div>
        </section>

        {/* About section */}
        <section className="space-y-3">
          <h2 className="text-xs font-medium text-slate uppercase tracking-wide">
            About
          </h2>
          <div className="rounded-xl border border-sand/60 bg-white/40 overflow-hidden">
            <div className="px-4 py-3">
              <p className="text-sm text-charcoal">WNRS Companion</p>
              <p className="text-xs text-slate mt-0.5">
                Version 0.1.0 — A space for meaningful conversations and quiet
                reflection.
              </p>
            </div>
          </div>
        </section>
      </main>
    </div>
  );
}
