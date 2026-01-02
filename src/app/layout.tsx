import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-geist-sans",
});

export const metadata: Metadata = {
  title: "Pro Game Ecosystem | Play Smart. Win Big. Zero Risk.",
  description: "A transparent, decentralized gaming platform on the BEP20 Blockchain. Participate in Lucky Number Draw with 8x winnings or cashback protection.",
  keywords: ["blockchain", "gaming", "BEP20", "USDT", "decentralized", "transparent"],
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="dark">
      <body className={`${inter.variable} antialiased`}>
        {children}
      </body>
    </html>
  );
}
