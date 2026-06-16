import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Pitchflow",
  description: "FM26 tactic board — design your shape in and out of possession.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="da" className="h-full antialiased">
      <body className="min-h-full flex flex-col">{children}</body>
    </html>
  );
}
