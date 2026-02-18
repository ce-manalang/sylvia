import { useState } from 'react';

interface WelcomeScreenProps {
  onComplete: (name: string) => void;
}

export function WelcomeScreen({ onComplete }: WelcomeScreenProps) {
  const [name, setName] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (name.trim()) {
      onComplete(name.trim());
    }
  };

  return (
    <div className="flex items-center justify-center min-h-dvh p-6">
      <div className="w-full max-w-sm space-y-8 text-center">
        <div className="space-y-3">
          <h1 className="text-4xl font-serif text-charcoal">
            Welcome
          </h1>
          <p className="text-slate text-lg leading-relaxed">
            A space for meaningful conversations and quiet reflection.
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="space-y-2">
            <label htmlFor="displayName" className="block text-sm text-slate">
              What should we call you?
            </label>
            <input
              id="displayName"
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Your name"
              autoFocus
              className="w-full px-4 py-3 rounded-lg bg-white/60 border border-sand
                         text-charcoal placeholder:text-slate/50
                         focus:outline-none focus:ring-2 focus:ring-terracotta/40 focus:border-terracotta
                         transition-colors"
            />
            <p className="text-xs text-slate/70">
              Stored locally on your device for personalization.
            </p>
          </div>

          <button
            type="submit"
            disabled={!name.trim()}
            className="w-full py-3 px-6 rounded-lg
                       bg-terracotta text-white font-medium
                       hover:bg-terracotta/90 active:bg-terracotta/80
                       disabled:opacity-40 disabled:cursor-not-allowed
                       transition-colors"
          >
            Get started
          </button>
        </form>
      </div>
    </div>
  );
}
