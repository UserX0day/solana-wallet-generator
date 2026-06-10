"use client";

import { Plus, Trash2, Download, Upload, X } from "lucide-react";
import { useEffect, useState } from "react";
import {
  deriveWallet,
  isValidMnemonic,
  newMnemonic,
  type DerivedWallet,
} from "@/lib/solana";
import MnemonicCard from "./MnemonicCard";
import WalletCard from "./WalletCard";

const STORAGE_KEY = "swg:v1";

type Persisted = { mnemonic: string; indices: number[] };

export default function WalletGenerator() {
  const [mnemonic, setMnemonic] = useState<string>("");
  const [wallets, setWallets] = useState<DerivedWallet[]>([]);
  const [persist, setPersist] = useState(false);
  const [showImport, setShowImport] = useState(false);
  const [importValue, setImportValue] = useState("");
  const [importError, setImportError] = useState<string | null>(null);
  const [loaded, setLoaded] = useState(false);

  // Restore a previously persisted session (re-deriving keys, never storing them).
  useEffect(() => {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      if (raw) {
        const data = JSON.parse(raw) as Persisted;
        if (data.mnemonic && isValidMnemonic(data.mnemonic)) {
          setMnemonic(data.mnemonic);
          setWallets(
            data.indices.map((i) => deriveWallet(data.mnemonic, i)),
          );
          setPersist(true);
        }
      }
    } catch {
      // Corrupt storage — ignore and start fresh.
    }
    setLoaded(true);
  }, []);

  // Keep storage in sync only while the user has opted in.
  useEffect(() => {
    if (!loaded) return;
    if (persist && mnemonic) {
      const data: Persisted = {
        mnemonic,
        indices: wallets.map((w) => w.index),
      };
      localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
    } else {
      localStorage.removeItem(STORAGE_KEY);
    }
  }, [persist, mnemonic, wallets, loaded]);

  function nextIndex(): number {
    if (wallets.length === 0) return 0;
    return Math.max(...wallets.map((w) => w.index)) + 1;
  }

  function addWallet() {
    // Use a local variable for a freshly generated phrase: React state
    // updates are async, so reading `mnemonic` here would still be empty.
    const phrase = mnemonic || newMnemonic();
    if (!mnemonic) setMnemonic(phrase);

    const wallet = deriveWallet(phrase, nextIndex());
    setWallets((prev) => [...prev, wallet]);
  }

  function importMnemonic() {
    const phrase = importValue.trim().replace(/\s+/g, " ");
    if (!isValidMnemonic(phrase)) {
      setImportError("That is not a valid BIP39 recovery phrase.");
      return;
    }
    setMnemonic(phrase);
    setWallets([deriveWallet(phrase, 0)]);
    setShowImport(false);
    setImportValue("");
    setImportError(null);
  }

  function deleteWallet(index: number) {
    setWallets((prev) => prev.filter((w) => w.index !== index));
  }

  function clearAll() {
    setWallets([]);
    setMnemonic("");
    setPersist(false);
    localStorage.removeItem(STORAGE_KEY);
  }

  return (
    <div className="space-y-5">
      {/* Action bar */}
      <div className="flex flex-wrap items-center gap-3 rounded-2xl border border-line bg-surface p-4">
        <button
          type="button"
          onClick={addWallet}
          className="inline-flex items-center gap-2 rounded-lg bg-violet px-4 py-2.5 text-sm font-semibold text-white transition-opacity hover:opacity-90 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-violet"
        >
          <Plus size={16} />
          {wallets.length === 0 ? "Generate wallet" : "Add account"}
        </button>

        <button
          type="button"
          onClick={() => setShowImport((v) => !v)}
          className="inline-flex items-center gap-2 rounded-lg border border-line px-4 py-2.5 text-sm font-medium text-muted transition-colors hover:border-violet/60 hover:text-ink"
        >
          <Upload size={15} />
          Import phrase
        </button>

        {wallets.length > 0 && (
          <button
            type="button"
            onClick={clearAll}
            className="ml-auto inline-flex items-center gap-2 rounded-lg border border-line px-4 py-2.5 text-sm font-medium text-muted transition-colors hover:border-danger/60 hover:text-danger"
          >
            <Trash2 size={15} />
            Clear all
          </button>
        )}
      </div>

      {/* Import panel */}
      {showImport && (
        <div className="fade-in rounded-2xl border border-line bg-surface p-4">
          <div className="mb-2 flex items-center justify-between">
            <label className="text-sm font-medium">
              Paste a 12 or 24-word recovery phrase
            </label>
            <button
              type="button"
              onClick={() => {
                setShowImport(false);
                setImportError(null);
              }}
              className="text-faint hover:text-ink"
              aria-label="Close import"
            >
              <X size={16} />
            </button>
          </div>
          <textarea
            value={importValue}
            onChange={(e) => {
              setImportValue(e.target.value);
              setImportError(null);
            }}
            rows={2}
            spellCheck={false}
            placeholder="word1 word2 word3 …"
            className="w-full resize-none rounded-lg border border-line bg-surface-2 px-3 py-2.5 font-mono text-sm text-ink outline-none focus:border-violet/60"
          />
          {importError && (
            <p className="mt-2 text-sm text-danger">{importError}</p>
          )}
          <button
            type="button"
            onClick={importMnemonic}
            className="mt-3 inline-flex items-center gap-2 rounded-lg bg-violet px-4 py-2 text-sm font-semibold text-white transition-opacity hover:opacity-90"
          >
            <Download size={15} />
            Import & derive
          </button>
        </div>
      )}

      {/* Persistence toggle */}
      {mnemonic && (
        <label className="flex cursor-pointer items-start gap-3 rounded-2xl border border-line bg-surface px-4 py-3">
          <input
            type="checkbox"
            checked={persist}
            onChange={(e) => setPersist(e.target.checked)}
            className="mt-0.5 h-4 w-4 accent-violet"
          />
          <span className="text-sm text-muted">
            <span className="font-medium text-ink">Remember on this device.</span>{" "}
            Stores the recovery phrase in this browser&apos;s local storage so
            it survives a reload.{" "}
            <span className="text-danger">
              Only do this on a device you trust — it is stored unencrypted.
            </span>
          </span>
        </label>
      )}

      {mnemonic && wallets.length > 0 && <MnemonicCard mnemonic={mnemonic} />}

      {/* Wallets */}
      {wallets.length > 0 ? (
        <div className="grid gap-4 lg:grid-cols-2">
          {wallets.map((wallet) => (
            <WalletCard
              key={wallet.index}
              wallet={wallet}
              onDelete={deleteWallet}
            />
          ))}
        </div>
      ) : (
        <div className="rounded-2xl border border-dashed border-line bg-surface/50 px-6 py-16 text-center">
          <p className="text-sm text-muted">
            No wallets yet. Generate one to create a fresh recovery phrase, or
            import an existing one.
          </p>
        </div>
      )}
    </div>
  );
}
