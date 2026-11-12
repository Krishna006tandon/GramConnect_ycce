export function ReadinessRing({ percentage = 0, size = 76, stroke = 7, label }) {
  const clamped = Math.max(0, Math.min(100, percentage));
  const radius = (size - stroke) / 2;
  const circumference = 2 * Math.PI * radius;
  const offset = circumference - (clamped / 100) * circumference;

  return (
    <div className="inline-flex items-center gap-3">
      <div className="relative inline-flex items-center justify-center" style={{ width: size, height: size }}>
        <svg width={size} height={size} className="-rotate-90">
          <circle
            cx={size / 2}
            cy={size / 2}
            r={radius}
            fill="transparent"
            stroke="var(--gc-border)"
            strokeWidth={stroke}
          />
          <circle
            cx={size / 2}
            cy={size / 2}
            r={radius}
            fill="transparent"
            stroke="var(--gc-primary)"
            strokeWidth={stroke}
            strokeLinecap="round"
            strokeDasharray={circumference}
            strokeDashoffset={offset}
            className="transition-all duration-500"
          />
        </svg>
        <span className="absolute text-sm font-extrabold" style={{ color: "var(--gc-text)" }}>
          {clamped}%
        </span>
      </div>
      {label && <div className="text-xs font-semibold" style={{ color: "var(--gc-muted)" }}>{label}</div>}
    </div>
  );
}
