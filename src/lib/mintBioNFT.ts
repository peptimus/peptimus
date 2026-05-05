import { createUmi } from "@metaplex-foundation/umi-bundle-defaults";
import { walletAdapterIdentity } from "@metaplex-foundation/umi-signer-wallet-adapters";
import {
  createNft,
  mplTokenMetadata,
} from "@metaplex-foundation/mpl-token-metadata";
import { generateSigner, percentAmount } from "@metaplex-foundation/umi";
import type { WalletAdapter } from "@solana/wallet-adapter-base";

const BASE_URL = (import.meta.env.BASE_URL || "/").replace(/\/$/, "");
const HELIUS_API_KEY = import.meta.env.VITE_HELIUS_API_KEY ?? "";
const MAINNET_RPC = HELIUS_API_KEY
  ? `https://mainnet.helius-rpc.com/?api-key=${HELIUS_API_KEY}`
  : "https://api.mainnet-beta.solana.com";

export interface MintResult {
  mintAddress: string;
  txSignature: string;
}

export async function mintBioNFT(
  adapter: WalletAdapter,
  peptide: {
    id: string;
    sequence: string;
    evolutionScore: number;
    therapeuticArea?: string;
  }
): Promise<MintResult> {
  const umi = createUmi(MAINNET_RPC).use(mplTokenMetadata());
  umi.use(walletAdapterIdentity(adapter));

  const mint = generateSigner(umi);

  const origin =
    typeof window !== "undefined"
      ? window.location.origin
      : "https://peptimus.xyz";

  const metadataUri = `${origin}${BASE_URL}/api/peptides/${peptide.id}/metadata`;

  const area = peptide.therapeuticArea ?? "Research";
  const nftName = `Peptimus IP-NFT · ${area} · ${peptide.sequence.substring(0, 8)}`;

  const { signature } = await createNft(umi, {
    mint,
    name: nftName,
    symbol: "BIONFT",
    uri: metadataUri,
    sellerFeeBasisPoints: percentAmount(5),
    isMutable: false,
  }).sendAndConfirm(umi, { confirm: { commitment: "confirmed" } });

  const mintAddress = mint.publicKey.toString();

  await fetch(`${BASE_URL}/api/peptides/${peptide.id}/mint`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ mintAddress }),
  });

  return {
    mintAddress,
    txSignature: Buffer.from(signature).toString("base64"),
  };
}
