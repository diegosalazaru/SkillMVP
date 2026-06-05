type AdPlaceholderProps = {
  className?: string;
};

export function AdPlaceholder({ className = "" }: AdPlaceholderProps) {
  return (
    <aside
      aria-label="Ad space"
      className={`rounded-xl border border-slate-200 bg-slate-50/80 px-4 py-4 ${className}`}
    >
      <p className="text-xs font-semibold uppercase tracking-[0.16em] text-slate-400">
        Ad space
      </p>
    </aside>
  );
}
