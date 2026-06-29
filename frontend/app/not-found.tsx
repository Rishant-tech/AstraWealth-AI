import Link from "next/link";

export default function NotFound() {
  return (
    <section className="mx-auto flex min-h-[70vh] max-w-3xl flex-col items-center justify-center px-4 text-center">
      <p className="text-sm uppercase tracking-[0.2em] text-rose">404</p>
      <h1 className="mt-3 text-3xl font-bold text-white">Route not found</h1>
      <p className="mt-3 text-slate-400">This analysis view is not available in the current app.</p>
      <Link href="/dashboard" className="mt-6 rounded-lg bg-teal px-5 py-3 text-sm font-semibold text-ink-950">
        Go to dashboard
      </Link>
    </section>
  );
}
