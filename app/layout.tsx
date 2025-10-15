import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "BD Control Plane",
  description: "Multi-repo dashboard for BD (Beads) issue tracking",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className="antialiased">{children}</body>
    </html>
  );
}
