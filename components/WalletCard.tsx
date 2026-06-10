"use client";

import { Eye, EyeOff, Trash2 } from "lucide-react";
import { useState } from "react";
import type { DerivedWallet } from "@/lib/solana";
import CopyButton from "./CopyButton";

function KeyRow({
  title,
  value,
  hint,
  secret = false,
}: {
  title: string;
  value: string;
  hint?: string;
  secret?: boolean;
}) {
  const [revealed, setRevealed] = useState(false);
  const show = !secret || revealed;

  return (
    <div className="rounded-lg border border-line bg-surface-2 p-3">
      <div className="mb-2 flex items-center justify-between gap-2">
        <span className="text-xs font-medium uppercase tracking-wide text-faint">
          {title}
        </span>
        <div className="flex gap-2">
          {secret && (
            <button
              type="button"
              onClick={() => setRevealed((v) => !v)}
              className="inline-flex items-center gap-1 rounded-md border border-line px-2 py-1 text-xs text-muted transition-colors hover:border-violet/60 hover:text-ink"
              aria-label={revealed ? "Hide private key" : "Reveal private key"}
            >
              {revealed ? <EyeOff size={12} /> : <Eye size={12} />}
            </button>
          )}
          <CopyButton value={value} />
        </div>
      </div>
      <p className="break-all font-mono text-[13px] leading-relaxed text-ink">
        {show ? value : "•".repeat(44)}
      </p>
      {hint && <p className="mt-1.5 text-xs text-faint">{hint}</p>}
    </div>
  );
}

export default function WalletCard({
  wallet,
  onDelete,
}: {
  wallet: DerivedWallet;
  onDelete: (index: number) => void;
}) {
  return (
    <article className="fade-in rounded-2xl border border-line bg-surface p-4 sm:p-5">
      <div className="mb-3 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <span className="grid h-7 w-7 place-items-center rounded-md bg-violet/15 font-mono text-sm text-violet">
            {wallet.index}
          </span>
          <div>
            <h3 className="text-sm font-semibold leading-none">
              Account {wallet.index}
            </h3>
            <p className="mt-1 font-mono text-xs text-faint">{wallet.path}</p>
          </div>
        </div>
        <button
          type="button"
          onClick={() => onDelete(wallet.index)}
          className="rounded-md border border-line p-1.5 text-faint transition-colors hover:border-danger/60 hover:text-danger"
          aria-label={`Delete account ${wallet.index}`}
        >
          <Trash2 size={15} />
        </button>
      </div>

      <div className="space-y-2.5">
        <KeyRow title="Address" value={wallet.publicKey} />
        <KeyRow
          title="Private key"
          value={wallet.secretKeyBase58}
          secret
          hint="Base58 — paste this into Phantom or Solflare to import."
        />
      </div>
    </article>
  );
}
