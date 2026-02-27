import type { ReactNode } from 'react';
import Link from 'next/link';
import './globals.css';

export const metadata = {
  title: 'Daily English Study',
  description: 'Read-only dashboard for daily English study',
};

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="ko">
      <body>
        <div className="shell">
          <aside className="sidebar">
            <div className="brand">Daily English Study</div>
            <nav className="nav">
              <Link href="/">Today</Link>
              <Link href="/history">History</Link>
              <Link href="/sources">Sources</Link>
            </nav>
            <div className="sidebarFooter">
              <div className="muted">Read-only</div>
            </div>
          </aside>
          <main className="main">{children}</main>
        </div>
      </body>
    </html>
  );
}
