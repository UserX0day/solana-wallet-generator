# Solana Wallet Generator

A modern, local-first web app for generating hierarchical-deterministic (HD)
Solana wallets from a single BIP39 recovery phrase. Built with **Next.js 16**,
**React 19**, **TypeScript** and **Tailwind CSS v4**.

All key material is derived **in the browser** — nothing is sent over the network.

## Features

- **BIP39 / BIP44 derivation** along the Phantom-compatible path
  `m/44'/501'/{account}'/0'`, so account 0 matches both Phantom's first
  account and `solana-keygen`'s default.
- **Phantom / Solflare-ready keys** — addresses and private keys are output in
  **base58**, the format those wallets import. (The original version emitted
  hex, which is not importable.)
- **Import** an existing 12- or 24-word phrase (validated with BIP39).
- **Multiple accounts** from one phrase, with reveal/copy/delete per account.
- **Opt-in persistence** — by default nothing is stored. You can choose to keep
  the phrase in local storage; only the phrase + account indices are stored and
  keys are re-derived on load (private keys are never written to disk).

## What changed vs. the original

- Fixed the bug where the **first wallet was derived from an empty mnemonic**
  (React state is async — a local variable is now used for the fresh phrase).
- Switched key output from **hex to base58** so keys actually import into wallets.
- Switched to the **Phantom account path** `m/44'/501'/{i}'/0'`.
- Fixed a **duplicate-index bug** after deleting a wallet (next index is now
  `max(index) + 1`).
- Private keys are no longer persisted in plaintext; persistence is opt-in.
- Upgraded every dependency to its current major (Next 14→16, React 18→19,
  Tailwind 3→4) and verified with a production build.

## Getting started

```bash
npm install
npm run dev
```

Open http://localhost:3000.

```bash
npm run build && npm start   # production build
```

## Security notes

This is a convenient generator, not a vault. Keys live in the page (and, if you
opt in, in unencrypted local storage). **For real funds, use a hardware wallet.**
Treat any phrase generated here as compromised if the device is not fully trusted.

## Tech

`bip39` · `ed25519-hd-key` · `tweetnacl` · `bs58` · `@solana/web3.js`
