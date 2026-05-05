import { motion } from "framer-motion";
import { PeptideVariant } from "@/types/peptide";
import { NeonProgressBar } from "../ui/NeonProgressBar";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { useAppStore } from "@/store/useAppStore";
import { useState } from "react";
import confetti from "canvas-confetti";
import { ExternalLink, FlaskConical, Fingerprint } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { IPNFTForm, type IpnftMeta } from "./IPNFTForm";

const BASE_URL = (import.meta.env.BASE_URL || "/").replace(/\/$/, "");

interface PeptideCardProps {
  variant: PeptideVariant;
  index: number;
  onMinted?: (mintAddress: string) => void;
}

export function PeptideCard({ variant, index, onMinted }: PeptideCardProps) {
  const { setSelectedPeptide, addMintedNFT, mintedNFTs, walletConnected, walletAddress } = useAppStore();
  const [isMinting, setIsMinting] = useState(false);
  const [formOpen, setFormOpen] = useState(false);
  const [mintAddress, setMintAddress] = useState<string | null>(
    (variant as any).mintAddress ?? null
  );
  const { toast } = useToast();

  const isMinted = mintedNFTs.includes(variant.sequence) || !!mintAddress;

  const handleMintClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (!walletConnected || !walletAddress) {
      toast({
        title: "Wallet Required",
        description: "Connect your Solana wallet to mint IP-NFTs.",
        variant: "destructive",
      });
      return;
    }
    setFormOpen(true);
  };

  const handleIPNFTConfirm = async (meta: IpnftMeta) => {
    if (!walletAddress) return;
    setIsMinting(true);
    try {
      await fetch(`${BASE_URL}/api/peptides/${variant.id}/ipnft`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(meta),
      });

      const res = await fetch(`${BASE_URL}/api/peptides/${variant.id}/mint-server`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ userWallet: walletAddress }),
      });
      if (!res.ok) {
        const err = await res.json().catch(() => ({}));
        throw new Error(err.error ?? "Minting failed");
      }
      const result = await res.json();

      setMintAddress(result.mintAddress);
      addMintedNFT(variant.sequence);
      onMinted?.(result.mintAddress);
      setFormOpen(false);

      confetti({
        particleCount: 140,
        spread: 75,
        origin: { y: 0.6 },
        colors: ["#00f5ff", "#00ff9f", "#8b5cf6"],
      });

      toast({
        title: "IP-NFT Minted · Molecule Standard",
        description: `Mint: ${result.mintAddress.slice(0, 8)}... · ${meta.therapeuticArea}`,
        className: "bg-card border-cyan-500/40",
      });
    } catch (err: any) {
      toast({
        title: "Mint Failed",
        description: err?.message ?? "Minting failed",
        variant: "destructive",
      });
    } finally {
      setIsMinting(false);
    }
  };

  return (
    <>
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: index * 0.08, duration: 0.4 }}
        className="bg-card border border-border rounded-xl overflow-hidden hover:border-primary/50 transition-colors cursor-pointer group flex flex-col h-full"
        onClick={() => setSelectedPeptide(variant)}
      >
        <div className="p-4 border-b border-border/50 flex justify-between items-center bg-muted/30">
          <span className="font-mono text-primary text-sm font-bold tracking-wider truncate max-w-[120px]">{variant.id}</span>
          <div className="flex items-center gap-2">
            {isMinted && (
              <Badge className="border-cyan-500/40 text-cyan-400 bg-cyan-950/30 text-[9px] uppercase font-bold tracking-widest rounded-sm">
                <FlaskConical className="w-2.5 h-2.5 mr-1" /> IP-NFT
              </Badge>
            )}
            <span className="text-xs text-muted-foreground bg-background px-2 py-1 rounded-md border border-border">
              SCORE: <span className="text-foreground font-bold">{variant.evolutionScore}</span>
            </span>
          </div>
        </div>

        <div className="p-4 flex-1 flex flex-col gap-4">
          <div className="w-full h-52 rounded-xl overflow-hidden border border-white/8 bg-black/30">
            <img
              src={`${BASE_URL}/api/peptides/${variant.id}/image`}
              alt={variant.sequence}
              className="w-full h-full object-cover"
              loading="lazy"
              onError={(e) => { (e.currentTarget as HTMLImageElement).style.display = "none"; }}
            />
          </div>

          <div className="font-mono text-sm tracking-[0.2em] text-center break-all text-muted-foreground group-hover:text-foreground transition-colors">
            {variant.sequence}
          </div>

          <div className="space-y-3 mt-2">
            <NeonProgressBar value={variant.affinity} color="cyan" label="Affinity" />
            <NeonProgressBar value={variant.stability} color="emerald" label="Stability" />
            <NeonProgressBar value={variant.novelty} color="purple" label="Novelty" />
          </div>
        </div>

        <div className="p-4 pt-0 mt-auto flex flex-col gap-2">
          <Button
            className={`w-full font-bold tracking-wider uppercase transition-all ${
              isMinted
                ? "bg-cyan-950/40 text-cyan-400 border border-cyan-500/30"
                : "bg-primary/10 text-primary hover:bg-primary/20 border border-primary/30 hover:border-primary shadow-[0_0_15px_hsl(var(--primary)/0.1)] hover:shadow-[0_0_20px_hsl(var(--primary)/0.3)]"
            }`}
            onClick={handleMintClick}
            disabled={isMinting || isMinted}
            variant={isMinted ? "outline" : "default"}
          >
            {isMinting ? (
              "Platform minting…"
            ) : isMinted ? (
              <><Fingerprint className="mr-2 h-4 w-4" /> IP-NFT Registered</>
            ) : (
              <><FlaskConical className="mr-2 h-4 w-4" /> Mint IP-NFT</>
            )}
          </Button>

          {mintAddress && (
            <a
              href={`https://explorer.solana.com/address/${mintAddress}`}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center justify-center gap-1 text-[10px] text-muted-foreground hover:text-primary transition-colors font-mono"
              onClick={(e) => e.stopPropagation()}
            >
              <ExternalLink className="w-3 h-3" />
              {mintAddress.slice(0, 8)}...{mintAddress.slice(-6)} · Solana Explorer
            </a>
          )}
        </div>
      </motion.div>

      <IPNFTForm
        open={formOpen}
        onOpenChange={setFormOpen}
        peptide={{
          id: variant.id,
          sequence: variant.sequence,
          evolutionScore: variant.evolutionScore,
          affinity: variant.affinity,
          stability: variant.stability,
          novelty: variant.novelty,
        }}
        onConfirm={handleIPNFTConfirm}
        isMinting={isMinting}
      />
    </>
  );
}
