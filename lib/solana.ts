import { Buffer as NodeBuffer } from "buffer";
import {
  generateMnemonic,
  mnemonicToSeedSync,
  validateMnemonic,
} from "bip39";
import { derivePath } from "ed25519-hd-key";
import nacl from "tweetnacl";
import bs58 from "bs58";

// bip39 and ed25519-hd-key rely on Node's Buffer, which the browser
// does not provide. Polyfill it once, before any of them run.
if (typeof globalThis.Buffer === "undefined") {
  globalThis.Buffer = NodeBuffer;
}

export type DerivedWallet = {
  /** Account index used in the derivation path. */
  index: number;
  /** Full BIP44 derivation path. */
  path: string;
  /** Solana address (base58 of the 32-byte public key). */
  publicKey: string;
  /** 64-byte secret key, base58 encoded — the format Phantom/Solflare import. */
  secretKeyBase58: string;
  /** Same secret key as a JSON byte array — the solana-keygen / CLI format. */
  secretKeyJson: string;
};

/**
 * Create a fresh BIP39 mnemonic.
 * 128 bits = 12 words, 256 bits = 24 words.
 */
export function newMnemonic(strength: 128 | 256 = 128): string {
  return generateMnemonic(strength);
}

/** Check that a phrase is a valid BIP39 mnemonic. */
export function isValidMnemonic(mnemonic: string): boolean {
  return validateMnemonic(mnemonic.trim());
}

/**
 * Derive a Solana wallet from a mnemonic at the given account index.
 *
 * Uses the Phantom-compatible path m/44'/501'/{index}'/0', so index 0
 * matches both Phantom's first account and `solana-keygen`'s default.
 */
export function deriveWallet(mnemonic: string, index: number): DerivedWallet {
  const path = `m/44'/501'/${index}'/0'`;
  const seed = mnemonicToSeedSync(mnemonic.trim());
  const seedHex = Buffer.from(seed).toString("hex");
  const { key } = derivePath(path, seedHex);
  const keypair = nacl.sign.keyPair.fromSeed(key);

  return {
    index,
    path,
    publicKey: bs58.encode(keypair.publicKey),
    secretKeyBase58: bs58.encode(keypair.secretKey),
    secretKeyJson: JSON.stringify(Array.from(keypair.secretKey)),
  };
}
