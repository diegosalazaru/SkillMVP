type AdPlaceholderProps = {
  className?: string;
};

export function AdPlaceholder({ className = "" }: AdPlaceholderProps) {
  return (
    <aside
      aria-label="Publicidad"
      className={`rounded-xl border border-slate-300 bg-slate-100/80 px-4 py-5 ${className}`}
    >
      <p className="text-xs font-semibold uppercase tracking-[0.16em] text-slate-500">
        Publicidad
      </p>
      <div className="mt-2 flex h-20 items-center justify-center rounded-lg border border-dashed border-slate-400 bg-slate-200 text-sm font-medium text-slate-600">
        Ad space
      </div>
    </aside>
  );
}
