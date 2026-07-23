interface StatBarProps {
  label: string;
  value: number;
  colorClass?: string;
  icon?: string;
}

export function StatBar({ label, value, colorClass = 'bg-gold-400', icon }: StatBarProps) {
  return (
    <div className="flex flex-col gap-1 min-w-0">
      <div className="flex items-center justify-between text-[11px] uppercase tracking-wide text-slate-400">
        <span className="flex items-center gap-1 truncate">
          {icon && <span>{icon}</span>}
          {label}
        </span>
        <span className="text-slate-200 font-semibold tabular-nums">{Math.round(value)}</span>
      </div>
      <div className="h-1.5 w-full rounded-full bg-court-700 overflow-hidden">
        <div
          className={`h-full rounded-full ${colorClass} transition-all duration-500`}
          style={{ width: `${Math.max(0, Math.min(100, value))}%` }}
        />
      </div>
    </div>
  );
}
