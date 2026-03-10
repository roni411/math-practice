import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "תרגול מתמטיקה | בגרות 471",
  description: "תרגול יומי לבגרות מתמטיקה 4 יחידות, קוד 471",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="he" dir="rtl">
      <body className="antialiased bg-gray-50 min-h-screen">
        {children}
      </body>
    </html>
  );
}
