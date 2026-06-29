export function PageHeader({ eyebrow, title, description }: { eyebrow?: string; title: string; description?: string }) {
  return (
    <div className="mb-6">
      {eyebrow ? <p className="text-xs font-semibold uppercase tracking-[0.2em] text-teal">{eyebrow}</p> : null}
      <h1 className="mt-2 text-3xl font-bold text-white md:text-5xl">{title}</h1>
      {description ? <p className="mt-3 max-w-3xl text-sm leading-6 text-slate-400 md:text-base">{description}</p> : null}
    </div>
  );
}
