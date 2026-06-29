import type { ComponentPropsWithoutRef, ReactNode } from "react";

type CardProps = ComponentPropsWithoutRef<"div"> & {
  title?: string;
  eyebrow?: string;
  action?: ReactNode;
};

export function Card({ title, eyebrow, action, className = "", children, ...props }: CardProps) {
  return (
    <div className={`rounded-lg border border-line bg-ink-850/90 p-4 shadow-panel backdrop-blur md:p-5 ${className}`} {...props}>
      {(title || eyebrow || action) && (
        <div className="mb-4 flex items-start justify-between gap-4">
          <div>
            {eyebrow ? <p className="text-xs font-semibold uppercase tracking-[0.16em] text-slate-500">{eyebrow}</p> : null}
            {title ? <h2 className="mt-1 text-lg font-semibold text-white">{title}</h2> : null}
          </div>
          {action}
        </div>
      )}
      {children}
    </div>
  );
}
