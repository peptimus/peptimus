import { UnifiedWalletProvider } from "@jup-ag/wallet-adapter";
import type { ReactNode } from "react";

const HELIUS_API_KEY = import.meta.env.VITE_HELIUS_API_KEY ?? "";
const RPC_ENDPOINT = HELIUS_API_KEY
  ? `https://mainnet.helius-rpc.com/?api-key=${HELIUS_API_KEY}`
  : "https://api.mainnet-beta.solana.com";

export function WalletProvider({ children }: { children: ReactNode }) {
  return (
    <UnifiedWalletProvider
      wallets={[]}
      config={{
        autoConnect: true,
        env: "mainnet-beta",
        metadata: {
          name: "Peptimus",
          description: "Decentralized AI Peptide Design on Solana",
          url: "https://peptimus.xyz",
          iconUrls: ["https://peptimus.xyz/favicon.ico"],
        },
        theme: "dark",
        walletlistExplanation: {
          href: "https://station.jup.ag/docs/additional-topics/wallet-list",
        },
        connectionConfig: {
          endpoint: RPC_ENDPOINT,
          commitment: "confirmed",
        },
      }}
    >
      {children}
    </UnifiedWalletProvider>
  );
}
