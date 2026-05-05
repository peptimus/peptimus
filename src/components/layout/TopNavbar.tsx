import { Link } from "wouter";
import { Wallet, LogOut, Fingerprint } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useUnifiedWallet, useUnifiedWalletContext } from "@jup-ag/wallet-adapter";
import { SearchDropdown } from "./SearchDropdown";

export function TopNavbar() {
  const { connected, publicKey, disconnect } = useUnifiedWallet();
  const { setShowModal } = useUnifiedWalletContext();

  const walletAddress = publicKey?.toBase58() ?? "";
  const shortAddress = walletAddress
    ? `${walletAddress.slice(0, 4)}…${walletAddress.slice(-4)}`
    : "";

  return (
    <header className="h-14 lg:h-16 border-b border-border bg-background/90 backdrop-blur-md sticky top-0 z-40 flex items-center gap-3 px-4 lg:px-6">
      <Link href="/" className="flex items-center gap-2 cursor-pointer shrink-0">
        <img
          src={`${import.meta.env.BASE_URL}logo-nobg.png`}
          alt="Peptimus"
          className="w-8 h-8 rounded-xl object-cover shadow-[0_0_10px_rgba(0,245,255,0.25)]"
        />
        <span className="font-bold text-base tracking-widest uppercase text-foreground hidden sm:block">
          Peptimus
        </span>
      </Link>

      <div className="flex-1 max-w-sm hidden md:block">
        <SearchDropdown />
      </div>

      <div className="flex items-center gap-2 ml-auto">
        {connected ? (
          <>
            <Link href={`/app/profile/${walletAddress}`}>
              <div className="hidden sm:flex items-center gap-2 bg-muted/50 border border-border hover:border-primary/40 rounded-full py-1.5 px-3 cursor-pointer transition-all">
                <div className="w-5 h-5 rounded-full bg-primary/20 border border-primary/50 flex items-center justify-center">
                  <Fingerprint className="w-2.5 h-2.5 text-primary" />
                </div>
                <span className="text-xs font-mono text-muted-foreground">{shortAddress}</span>
                <span className="text-[9px] font-mono px-1.5 py-0.5 rounded-full bg-emerald-950/60 border border-emerald-500/30 text-emerald-400 uppercase tracking-wider">Mainnet</span>
              </div>
            </Link>
            <Button
              variant="ghost"
              size="icon"
              onClick={() => disconnect()}
              title="Disconnect wallet"
              className="w-8 h-8 text-muted-foreground hover:text-red-400 hover:bg-red-400/10 transition-colors"
            >
              <LogOut className="w-4 h-4" />
            </Button>
          </>
        ) : (
          <Button
            onClick={() => setShowModal(true)}
            size="sm"
            className="bg-primary text-primary-foreground hover:bg-primary/90 font-bold uppercase tracking-wider text-xs shadow-[0_0_12px_hsl(var(--primary)/0.3)] transition-all h-8 px-3"
          >
            <Wallet className="w-3.5 h-3.5 mr-1.5" />
            <span className="hidden sm:inline">Connect Wallet</span>
            <span className="sm:hidden">Connect</span>
          </Button>
        )}
      </div>
    </header>
  );
}
