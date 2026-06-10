"use client";

import { Eye, EyeOff, ShieldAlert } from "lucide-react";
import { useState } from "react";
import CopyButton from "./CopyButton";

export default function MnemonicCard({ mnemonic }: { mnemonic: string }) {
  const [revealed, setRevealed] = useState(false);
  const words = mnemonic.split(" ");

  return (
    <section className="fade-in rounded-2xl border border-line bg-surface p-5 sm:p-6">
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div>
          <h2 className="text-lg font-semibold tracking-tight">
            Secret recovery phrase
          </h2>
          <p className="mt-1 flex items-center gap-1.5 text-sm text-danger">
            <ShieldAlert size={15} />
            Anyone with these words controls every wallet below.
          </p>
        </div>
        <div className="flex gap-2">
          <button
            type="button"
            onClick={() => setRevealed((v) => !v)}
            className="inline-flex items-center gap-1.5 rounded-md border border-line px-2.5 py-1.5 text-xs font-medium text-muted transition-colors hover:border-violet/60 hover:text-ink focus-visible:outline-2 focus-visible:outline-violet"
          >
            {revealed ? <EyeOff size={13} /> : <Eye size={13} />}
            {revealed ? "Hide" : "Reveal"}
          </button>
          <CopyButton value={mnemonic} label="Copy phrase" />
        </div>
      </div>

      <div className="mt-4 grid grid-cols-2 gap-2 sm:grid-cols-3 md:grid-cols-4">
        {words.map((word, i) => (
          <div
            key={i}
            className="flex items-center gap-2 rounded-lg border border-line bg-surface-2 px-3 py-2.5"
          >
            <span className="w-5 select-none text-right font-mono text-xs text-faint">
              {i + 1}
            </span>
            <span className="font-mono text-sm">
              {revealed ? word : "••••••"}
            </span>
          </div>
        ))}
      </div>
    </section>
  );
}
