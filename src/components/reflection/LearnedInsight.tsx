interface LearnedInsightProps {
  value: string;
  onChange: (value: string) => void;
}

export function LearnedInsight({ value, onChange }: LearnedInsightProps) {
  return (
    <div className="space-y-3">
      <h3 className="text-sm font-medium text-charcoal">
        One thing I learned about myself...
      </h3>
      <textarea
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder="Optional — take a moment to capture any insight"
        rows={3}
        className="w-full px-4 py-3 rounded-lg bg-cream/50 border border-sand/60
                   text-charcoal placeholder:text-slate/40 text-sm leading-relaxed resize-none
                   focus:outline-none focus:ring-2 focus:ring-terracotta/40 focus:border-terracotta"
      />
    </div>
  );
}
