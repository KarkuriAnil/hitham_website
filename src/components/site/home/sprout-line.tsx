export function SproutLine({ className }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 320 200"
      className={className}
      fill="none"
      aria-hidden="true"
    >
      <path
        d="M160 200 V100"
        stroke="var(--hi-sage)"
        strokeWidth="2"
        className="sprout-path"
        style={{ "--sprout-delay": "0s" } as React.CSSProperties}
      />
      <path
        d="M160 130 C 140 110, 120 100, 95 95"
        stroke="var(--hi-sage)"
        strokeWidth="1.5"
        className="sprout-path"
        style={{ "--sprout-delay": "0.5s" } as React.CSSProperties}
      />
      <path
        d="M160 110 C 180 90, 205 82, 230 78"
        stroke="var(--hi-sage)"
        strokeWidth="1.5"
        className="sprout-path"
        style={{ "--sprout-delay": "0.7s" } as React.CSSProperties}
      />
      <path
        d="M160 100 C 158 70, 152 45, 140 20"
        stroke="var(--hi-gold)"
        strokeWidth="1.5"
        className="sprout-path"
        style={{ "--sprout-delay": "0.9s" } as React.CSSProperties}
      />
      <circle cx="95" cy="95" r="3" fill="var(--hi-sage-light)" className="fade-up" style={{ animationDelay: "1.1s" }} />
      <circle cx="230" cy="78" r="3" fill="var(--hi-sage-light)" className="fade-up" style={{ animationDelay: "1.3s" }} />
      <circle cx="140" cy="20" r="4" fill="var(--hi-gold)" className="fade-up" style={{ animationDelay: "1.5s" }} />
    </svg>
  );
}
