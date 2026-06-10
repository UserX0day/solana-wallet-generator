import { ExternalLink, KeyRound, ShieldCheck, WifiOff } from "lucide-react";
import WalletGenerator from "@/components/WalletGenerator";

export default function Home() {
  return (
    <main className="mx-auto max-w-3xl px-4 py-10 sm:py-16">
      <header className="mb-8">
        <div className="mb-3 inline-flex items-center gap-2 rounded-full border border-line bg-surface px-3 py-1 text-xs text-muted">
          <span className="h-1.5 w-1.5 rounded-full bg-mint" />
          Runs fully in your browser
        </div>
        <h1 className="text-3xl font-bold tracking-tight sm:text-4xl">
          Solana Wallet Generator
        </h1>
        <p className="mt-3 max-w-xl text-muted">
          Create hierarchical-deterministic Solana wallets from a single BIP39
          recovery phrase. Keys are derived locally and are ready to import into
          Phantom or Solflare.
        </p>

        <div className="mt-5 flex flex-wrap gap-2 text-xs text-muted">
          <span className="inline-flex items-center gap-1.5 rounded-md border border-line bg-surface px-2.5 py-1.5">
            <KeyRound size={13} className="text-violet" />
            BIP39 / BIP44
          </span>
          <span className="inline-flex items-center gap-1.5 rounded-md border border-line bg-surface px-2.5 py-1.5">
            <ShieldCheck size={13} className="text-mint" />
            m/44&apos;/501&apos;/i&apos;/0&apos;
          </span>
          <span className="inline-flex items-center gap-1.5 rounded-md border border-line bg-surface px-2.5 py-1.5">
            <WifiOff size={13} className="text-faint" />
            No network calls
          </span>
        </div>
      </header>

      <WalletGenerator />

      <footer className="mt-12 flex items-center justify-between border-t border-line pt-6 text-xs text-faint">
        <p>
          Generated keys never leave this page. For real funds, prefer a
          hardware wallet.
        </p>
        <a
          href="https://github.com/Rahulhanje/SolanaWalletGenerator"
          target="_blank"
          rel="noreferrer"
          className="inline-flex items-center gap-1.5 transition-colors hover:text-ink"
        >
          <ExternalLink size={13} />
          Source
        </a>
      </footer>
    </main>
  );
}
