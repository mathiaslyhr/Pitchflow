import Link from "next/link";

/*
  Shared app chrome — header + page frame used by the board now and the
  dashboard later. The brand mark lives here; route-specific controls (e.g.
  the board's formation select / JSON toggle) stay inside their own pages.
*/
export default function AppShell({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex min-h-full flex-col bg-ink text-text">
      <header className="border-b border-border">
        <div className="mx-auto flex w-full max-w-[1360px] items-center justify-between px-4 py-3 sm:px-6">
          <Link href="/board" className="flex items-center gap-2.5">
            <span
              aria-hidden="true"
              className="inline-block size-3.5 rotate-45 rounded bg-brand"
            />
            <span className="text-[22px] font-bold tracking-[-0.02em]">
              Pitchflow
            </span>
          </Link>
          {/* nav slot — dashboard / account links land here later */}
          <nav aria-label="Primary" />
        </div>
      </header>
      <main className="flex flex-1 flex-col">{children}</main>
    </div>
  );
}
