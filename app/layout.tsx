import type { Metadata } from 'next';
import './globals.css';
import Link from 'next/link';

export const metadata: Metadata = {
  title: 'TinyLink',
  description: 'Simple URL shortener with stats',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className="min-h-screen bg-slate-100 text-slate-900">
        <div className="flex min-h-screen flex-col">
          <header className="border-b bg-white/80 backdrop-blur">
            <div className="mx-auto flex max-w-5xl items-center justify-between px-4 py-3">
              <Link href="/" className="flex items-center gap-2">
                <span className="flex h-8 w-8 items-center justify-center rounded-full bg-slate-900 text-xs font-bold text-white">
                  TL
                </span>
                <span className="text-lg font-semibold tracking-tight">
                  TinyLink
                </span>
              </Link>
              <nav className="flex items-center gap-4 text-sm text-slate-600">
                <Link href="/" className="hover:text-slate-900">
                  Dashboard
                </Link>
                <span className="text-xs rounded-full bg-slate-100 px-2 py-0.5 text-slate-500">
                  v1.0
                </span>
              </nav>
            </div>
          </header>

          <main className="flex-1 bg-slate-100">
            <div className="mx-auto max-w-5xl px-4 py-8">
              <div className="rounded-2xl bg-white p-6 shadow-sm">
                {children}
              </div>
            </div>
          </main>

          <footer className="border-t bg-white/80 backdrop-blur">
            <div className="mx-auto flex max-w-5xl items-center justify-between px-4 py-3 text-xs text-slate-500">
              <span>TinyLink · URL shortener demo</span>
              <span>Health: GET /healthz</span>
            </div>
          </footer>
        </div>
      </body>
    </html>
  );
}