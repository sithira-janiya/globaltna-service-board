import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Service Board | GlobalTNA Assessment",
  description:
    "Mini service request board built with Next.js, Express, and MongoDB.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
