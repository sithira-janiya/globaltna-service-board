import "./globals.css";

export const metadata = {
  title: "Mini Service Request Board",
  description: "A platform to manage service requests efficiently",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en" className="h-full">
      <body className="h-full bg-gray-50">
        <nav className="bg-blue-600 text-white shadow-md">
          <div className="max-w-6xl mx-auto px-4 py-4 flex items-center justify-between">
            <h1 className="text-2xl font-bold">Service Board</h1>
            <div className="space-x-4">
              <a href="/" className="hover:text-blue-100 transition">
                Home
              </a>
            </div>
          </div>
        </nav>
        <main className="max-w-6xl mx-auto px-4 py-8">{children}</main>
        <footer className="bg-gray-200 text-gray-700 py-4 mt-16">
          <div className="max-w-6xl mx-auto px-4 text-center text-sm">
            © 2026 Mini Service Request Board. Clean and simple.
          </div>
        </footer>
      </body>
    </html>
  );
}
