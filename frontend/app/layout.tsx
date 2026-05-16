import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Service Request Board",
  description: "A platform to manage service requests efficiently",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="h-full scroll-smooth">
      <body className="h-full bg-gradient-to-br from-slate-50 via-blue-50 to-slate-100 flex flex-col">
        {/* Navigation */}
        <nav className="bg-gradient-to-r from-blue-600 to-blue-700 text-white shadow-lg sticky top-0 z-50">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex items-center justify-between h-16">
              <a
                href="/"
                className="flex items-center space-x-3 hover:opacity-90 transition-opacity"
              >
                <div className="w-10 h-10 bg-white rounded-lg flex items-center justify-center shadow-md">
                  <svg
                    className="w-6 h-6 text-blue-600"
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
                <span className="text-2xl font-bold hidden sm:inline">
                  Service Board
                </span>
                <span className="text-2xl font-bold sm:hidden">SB</span>
              </a>
              <div className="flex items-center space-x-8">
                <a
                  href="/"
                  className="hover:text-blue-100 transition-colors font-medium"
                >
                  Home
                </a>
              </div>
            </div>
          </div>
        </nav>

        {/* Main Content */}
        <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-12">
          {children}
        </main>

        {/* Footer */}
        <footer className="bg-white text-gray-700 py-8 mt-16 border-t border-gray-200">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center text-sm">
            <p className="text-gray-600">
              © 2026 Service Request Board. Built for technical assessments.
            </p>
          </div>
        </footer>
      </body>
    </html>
  );
}
