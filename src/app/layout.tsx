import type { Metadata } from "next";
import { Fraunces, Outfit } from 'next/font/google';
import "./globals.css";

// Display font — Fraunces is a characterful "old-style" serif with optical
// sizing. Used for headlines and big numbers. Distinctive without being loud.
const fraunces = Fraunces({
  subsets: ['latin'],
  variable: '--font-display',
  display: 'swap',
});

// Body font — Outfit is a clean geometric sans with a bit more personality
// than Inter. Used for body copy and UI.
const outfit = Outfit({
  subsets: ['latin'],
  variable: '--font-body',
  display: 'swap',
});

export const metadata: Metadata = {
  title: 'Sunsave Demo — Solar Quote Calculator',
  description:
    'Get an instant solar subscription quote for your UK home. A portfolio demo project.',
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en" className={`${fraunces.variable} ${outfit.variable}`}>
      <body className="font-body bg-stone-50 text-stone-900 antialiased">
        {children}
      </body>
    </html>
  );
}