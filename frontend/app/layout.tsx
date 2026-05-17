import type { Metadata } from "next";
import { Manrope } from "next/font/google";
import "./globals.css";

const manrope = Manrope({
  subsets: ["latin"],
  display: "swap",
  variable: "--font-manrope",
});

export const metadata: Metadata = {
  title: "Service Board",
  description: "Track service requests, update progress, and keep work moving.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`h-full scroll-smooth ${manrope.variable}`}>
      <body className="min-h-full text-slate-900">
        <div className="relative min-h-screen overflow-x-clip">
          <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_top_left,_rgba(59,130,246,0.16),_transparent_35%),radial-gradient(circle_at_top_right,_rgba(14,165,233,0.12),_transparent_30%),linear-gradient(180deg,_#f8fbff_0%,_#eef5ff_100%)]" />
          <div className="pointer-events-none absolute inset-x-0 top-0 h-24 bg-gradient-to-b from-white/70 to-transparent" />

          <div className="relative flex min-h-screen flex-col">
            <nav className="sticky top-0 z-50 border-b border-white/50 bg-white/75 shadow-sm backdrop-blur-xl">
              <div className="mx-auto flex min-h-20 max-w-7xl items-center justify-between gap-4 px-4 py-4 sm:px-6 lg:px-8">
                <a
                  href="/"
                  className="flex items-center gap-3 transition-opacity hover:opacity-80"
                >
                  <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-slate-900 text-white shadow-lg shadow-slate-900/20">
                    <svg
                      className="h-6 w-6"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2"
                      />
                    </svg>
                  </div>
                  <div>
                    <p className="text-sm uppercase tracking-[0.24em] text-slate-500">
                      Operations
                    </p>
                    <span className="block text-lg font-semibold tracking-tight">
                      Service Board
                    </span>
                  </div>
                </a>
                <a
                  href="/jobs/new"
                  className="whitespace-nowrap rounded-full bg-slate-900 px-4 py-2.5 text-sm font-semibold text-white shadow-lg shadow-slate-900/15 transition-transform hover:-translate-y-0.5"
                >
                  New request
                </a>
              </div>
            </nav>

            <main className="flex-1">
              <div className="mx-auto w-full max-w-7xl px-4 py-8 sm:px-6 lg:px-8 lg:py-10">
                {children}
              </div>
            </main>

            <footer className="border-t border-white/60 bg-white/60 py-6 backdrop-blur">
              <div className="mx-auto max-w-7xl px-4 text-center text-sm text-slate-500 sm:px-6 lg:px-8">
                Service Board keeps request tracking simple for teams and
                residents.
              </div>
            </footer>
          </div>
        </div>
      </body>
    </html>
  );
}
