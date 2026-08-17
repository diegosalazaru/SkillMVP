type AdPlaceholderProps = {
  className?: string;
};

export function AdPlaceholder({ className = "" }: AdPlaceholderProps) {
  return (
    <aside
      aria-label="Reserved space"
      className={`rounded-xl border border-dashed border-slate-200 bg-transparent px-3 py-2 ${className}`}
    >
      <p className="text-xs font-semibold uppercase tracking-[0.16em] text-slate-400">
        Reserved space
      </p>
    </aside>
  );
}
