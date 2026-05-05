import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Loader2 } from "lucide-react";
import { useWallet } from "@solana/wallet-adapter-react";
import { useAppStore } from "@/store/useAppStore";

interface WalletModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

const WALLETS = [
  {
    name: "Phantom",
    icon: "https://raw.githubusercontent.com/solana-labs/wallet-adapter/master/packages/wallets/icons/phantom.svg",
    adapter: "Phantom",
  },
  {
    name: "Solflare",
    icon: "https://raw.githubusercontent.com/solana-labs/wallet-adapter/master/packages/wallets/icons/solflare.svg",
    adapter: "Solflare",
  },
];

export function WalletModal({ open, onOpenChange }: WalletModalProps) {
  const { wallets, select, connect, connecting } = useWallet();
  const { setWalletConnected } = useAppStore();
  const [selected, setSelected] = useState<string | null>(null);

  const handleConnect = async (adapterName: string) => {
    try {
      setSelected(adapterName);
      const wallet = wallets.find((w) => w.adapter.name === adapterName);
      if (!wallet) {
        window.open(
          adapterName === "Phantom"
            ? "https://phantom.app/"
            : "https://solflare.com/",
          "_blank"
        );
        return;
      }
      select(wallet.adapter.name as any);
      await connect();
      setWalletConnected(true);
      onOpenChange(false);
    } catch (err) {
      console.error("Wallet connect error:", err);
    } finally {
      setSelected(null);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-sm bg-[#0d1321] border border-white/10">
        <DialogHeader>
          <DialogTitle className="text-center text-xl font-bold uppercase tracking-wider" style={{ color: "#00f5ff" }}>
            Connect Wallet
          </DialogTitle>
          <DialogDescription className="text-center text-white/40 text-sm">
            Connect your Solana wallet to access Peptimus
          </DialogDescription>
        </DialogHeader>

        <div className="flex flex-col gap-3 py-4">
          {WALLETS.map((w) => {
            const isConnecting = connecting && selected === w.adapter;
            return (
              <Button
                key={w.name}
                variant="outline"
                className="w-full h-14 flex items-center gap-4 px-5 border border-white/10 bg-white/5 hover:bg-white/10 hover:border-white/20 text-white font-semibold tracking-wide transition-all"
                onClick={() => handleConnect(w.adapter)}
                disabled={connecting}
              >
                {isConnecting ? (
                  <Loader2 className="w-5 h-5 animate-spin text-cyan-400" />
                ) : (
                  <img src={w.icon} alt={w.name} className="w-7 h-7 rounded-full" onError={(e) => { (e.target as HTMLImageElement).style.display = 'none'; }} />
                )}
                <span>{isConnecting ? "Connecting..." : w.name}</span>
              </Button>
            );
          })}

          <p className="text-xs text-white/25 text-center pt-2">
            By connecting, you agree to the decentralized research protocol.
          </p>
        </div>
      </DialogContent>
    </Dialog>
  );
}
