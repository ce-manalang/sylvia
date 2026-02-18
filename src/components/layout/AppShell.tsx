interface AppShellProps {
  displayName: string;
}

export function AppShell({ displayName }: AppShellProps) {
  return (
    <div className="flex flex-col min-h-dvh">
      {/* Header */}
      <header className="border-b border-sand/60 bg-cream/80 backdrop-blur-sm sticky top-0 z-10">
        <div className="max-w-2xl mx-auto px-4 py-4 flex items-center justify-between">
          <h1 className="text-lg font-serif text-charcoal">WNRS</h1>
          <span className="text-sm text-slate">
            Welcome back, {displayName}
          </span>
        </div>
      </header>

      {/* Content */}
      <main className="flex-1 max-w-2xl mx-auto w-full px-4 py-8">
        <div className="space-y-6">
          <div className="rounded-xl border border-sand/60 bg-white/40 p-6 shadow-sm">
            <h2 className="text-xl font-serif text-charcoal mb-2">
              Ready for a conversation
            </h2>
            <p className="text-slate leading-relaxed">
              Your space for guided prompts, journaling, and reflection is being prepared.
              Solo conversations and deck selection are coming next.
            </p>
          </div>

          <div className="rounded-xl border border-sage/40 bg-sage/10 p-6">
            <p className="text-sm text-slate">
              Journal entries will appear here as you reflect on questions.
            </p>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="border-t border-sand/40 py-4">
        <p className="text-center text-xs text-slate/60">
          WNRS Companion — your data stays on this device
        </p>
      </footer>
    </div>
  );
}
