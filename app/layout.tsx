import type { ReactNode } from 'react';
import Link from 'next/link';
import './globals.css';

export const metadata = {
  title: 'Daily English Study',
  description: 'Read-only dashboard for daily English study',
};

function NavLink({ href, children }: { href: string; children: ReactNode }) {
  return (
    <Link
      href={href}
      className="rounded-xl px-3 py-2 text-sm font-semibold text-slate-700 hover:bg-white/70 hover:text-slate-900"
    >
      {children}
    </Link>
  );
}

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="ko">
      <body>
        <div className="min-h-screen bg-gradient-to-b from-emerald-50/70 to-slate-50">
          <div className="mx-auto flex max-w-6xl gap-4 px-4 py-4">
            <aside className="hidden w-64 shrink-0 rounded-2xl border border-slate-200 bg-white/70 p-4 backdrop-blur md:block">
              <div className="text-base font-extrabold tracking-tight">Daily English Study</div>
              <div className="mt-1 text-xs text-slate-500">Read-only dashboard</div>

              <nav className="mt-4 flex flex-col gap-1">
                <NavLink href="/">Today</NavLink>
                <NavLink href="/history">History</NavLink>
                <NavLink href="/sources">Sources</NavLink>
              </nav>

              <div className="mt-6 text-xs text-slate-500">
                Tip: data sync runs daily at 23:57 (KST)
              </div>
            </aside>

            <main className="min-w-0 flex-1">
              <div className="mb-3 flex items-center justify-between rounded-2xl border border-slate-200 bg-white/70 px-4 py-3 backdrop-blur md:hidden">
                <div className="text-sm font-extrabold tracking-tight">Daily English Study</div>
                <div className="flex gap-1">
                  <NavLink href="/">Today</NavLink>
                  <NavLink href="/history">History</NavLink>
                  <NavLink href="/sources">Sources</NavLink>
                </div>
              </div>

              {children}
            </main>
          </div>
        </div>
      </body>
    </html>
  );
}
