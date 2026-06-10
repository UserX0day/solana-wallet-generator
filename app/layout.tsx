import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Solana Wallet Generator",
  description:
    "Generate Solana HD wallets locally in your browser. BIP39 / BIP44, Phantom-compatible keys.",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className="min-h-screen antialiased">{children}</body>
    </html>
  );
}
