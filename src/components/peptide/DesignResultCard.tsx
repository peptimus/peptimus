import { motion } from "framer-motion";
import { PeptideVariant } from "@/types/peptide";
import { Button } from "@/components/ui/button";
import { useAppStore } from "@/store/useAppStore";
import { useState } from "react";
import confetti from "canvas-confetti";
import { FlaskConical, Fingerprint, ExternalLink, ShieldCheck, Zap, Layers, BarChart2 } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { IPNFTForm, type IpnftMeta } from "./IPNFTForm";
import { Link } from "wouter";

const BASE_URL = (import.meta.env.BASE_URL || "/").replace(/\/$/, "");

function scoreLabel(value: number, type: "affinity" | "stability" | "safety") {
  if (type === "safety") {
    const inverted = 100 - value * 4;
    if (inverted >= 90) return { label: "Very Safe", color: "text-emerald-400" };
    if (inverted >= 75) return { label: "Safe", color: "text-green-400" };
    if (inverted >= 50) return { label: "Moderate", color: "text-yellow-400" };
    return { label: "Caution", color: "text-orange-400" };
  }
  if (value >= 90) return { label: "Excellent", color: "text-emerald-400" };
  if (value >= 80) return { label: "Strong", color: "text-cyan-400" };
  if (value >= 70) return { label: "Good", color: "text-blue-400" };
  return { label: "Moderate", color: "text-yellow-400" };
}

const FEATURE_COLORS: Record<string, string> = {
  "Cationic": "bg-cyan-950/50 text-cyan-400 border-cyan-500/20",
  "Alpha-helical": "bg-purple-950/50 text-purple-400 border-purple-500/20",
  "Membrane-active": "bg-rose-950/50 text-rose-400 border-rose-500/20",
  "Amphipathic": "bg-amber-950/50 text-amber-400 border-amber-500/20",
  "Hydrophobic": "bg-orange-950/50 text-orange-400 border-orange-500/20",
  "Cyclic": "bg-teal-950/50 text-teal-400 border-teal-500/20",
  "Beta-sheet": "bg-indigo-950/50 text-indigo-400 border-indigo-500/20",
  "Disulfide": "bg-yellow-950/50 text-yellow-400 border-yellow-500/20",
};

function featureClass(f: string) {
  return FEATURE_COLORS[f] ?? "bg-muted/50 text-muted-foreground border-border";
}

interface Props {
  variant: PeptideVariant;
  index: number;
  onMinted?: (mintAddress: string) => void;
}

export function DesignResultCard({ variant, index, onMinted }: Props) {
  const { addMintedNFT, mintedNFTs, walletConnected, walletAddress } = useAppStore();
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
      toast({ title: "Wallet Required", description: "Connect your Solana wallet to mint IP-NFTs.", variant: "destructive" });
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
      confetti({ particleCount: 140, spread: 75, origin: { y: 0.6 }, colors: ["#00f5ff", "#00ff9f", "#8b5cf6"] });
      toast({ title: "IP-NFT Minted · Molecule Standard", description: `Mint: ${result.mintAddress.slice(0, 8)}… · ${meta.therapeuticArea}`, className: "bg-card border-cyan-500/40" });
    } catch (err: any) {
      toast({ title: "Mint Failed", description: err?.message ?? "Minting failed", variant: "destructive" });
    } finally {
      setIsMinting(false);
    }
  };

  const affinityInfo = scoreLabel(variant.affinity, "affinity");
  const stabilityInfo = scoreLabel(variant.stability, "stability");
  const safetyInfo = scoreLabel(variant.toxicity, "safety");

  return (
    <>
      <motion.div
        initial={{ opacity: 0, y: 24 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: index * 0.1, duration: 0.45 }}
        className="bg-card border border-border rounded-2xl overflow-hidden hover:border-primary/40 transition-all group flex flex-col"
      >
        <div className="flex gap-0">
          <div className="w-[90px] shrink-0 border-r border-border/60 bg-black/30 overflow-hidden">
            <img
              src={`${BASE_URL}/api/peptides/${variant.id}/image`}
              alt={variant.sequence}
              className="w-full h-full object-cover"
              loading="lazy"
              onError={(e) => { (e.currentTarget as HTMLImageElement).style.display = "none"; }}
            />
          </div>

          <div className="flex-1 p-4 min-w-0">
            <div className="flex items-start justify-between gap-2 mb-1">
              <span className="font-mono text-xs text-primary font-bold tracking-widest truncate">{variant.id}</span>
              <span className="shrink-0 text-[10px] font-bold font-mono px-2 py-0.5 rounded bg-primary/10 text-primary border border-primary/20">
                {variant.evolutionScore}
              </span>
            </div>

            <div className="font-mono text-[11px] tracking-widest text-muted-foreground break-all leading-relaxed mb-3">
              {variant.sequence}
            </div>

            {variant.keyFeatures && variant.keyFeatures.length > 0 && (
              <div className="flex flex-wrap gap-1 mb-3">
                {variant.keyFeatures.map((f) => (
                  <span key={f} className={`text-[9px] font-mono font-bold uppercase tracking-wider px-1.5 py-0.5 rounded border ${featureClass(f)}`}>
                    {f}
                  </span>
                ))}
              </div>
            )}

            <div className="grid grid-cols-3 gap-2">
              <div className="text-center">
                <div className="flex items-center justify-center gap-0.5 mb-0.5">
                  <Zap className="w-2.5 h-2.5 text-cyan-400" />
                  <span className="text-[9px] text-muted-foreground font-mono uppercase tracking-wider">Binding</span>
                </div>
                <div className={`text-xs font-bold ${affinityInfo.color}`}>{affinityInfo.label}</div>
                <div className="text-[9px] text-muted-foreground font-mono">{variant.affinity}%</div>
              </div>
              <div className="text-center border-x border-border/40">
                <div className="flex items-center justify-center gap-0.5 mb-0.5">
                  <Layers className="w-2.5 h-2.5 text-emerald-400" />
                  <span className="text-[9px] text-muted-foreground font-mono uppercase tracking-wider">Stability</span>
                </div>
                <div className={`text-xs font-bold ${stabilityInfo.color}`}>{stabilityInfo.label}</div>
                <div className="text-[9px] text-muted-foreground font-mono">{variant.stability}%</div>
              </div>
              <div className="text-center">
                <div className="flex items-center justify-center gap-0.5 mb-0.5">
                  <ShieldCheck className="w-2.5 h-2.5 text-green-400" />
                  <span className="text-[9px] text-muted-foreground font-mono uppercase tracking-wider">Safety</span>
                </div>
                <div className={`text-xs font-bold ${safetyInfo.color}`}>{safetyInfo.label}</div>
                <div className="text-[9px] text-muted-foreground font-mono">tox {variant.toxicity}%</div>
              </div>
            </div>
          </div>
        </div>

        {variant.rationale && (
          <div className="px-4 pt-3 pb-2 border-t border-border/40 bg-muted/10">
            <p className="text-[11px] text-muted-foreground leading-relaxed italic">
              "{variant.rationale}"
            </p>
            {variant.mechanism && (
              <div className="mt-1.5 flex items-center gap-1.5">
                <span className="text-[9px] font-mono text-muted-foreground/60 uppercase tracking-wider">Mechanism:</span>
                <span className="text-[9px] font-mono text-primary/70">{variant.mechanism}</span>
              </div>
            )}
          </div>
        )}

        <div className="p-3 mt-auto border-t border-border/40 flex gap-2 items-center">
          <Button
            className={`flex-1 text-xs font-bold tracking-wider uppercase transition-all h-8 ${
              isMinted
                ? "bg-cyan-950/40 text-cyan-400 border border-cyan-500/30"
                : "bg-primary/10 text-primary hover:bg-primary/20 border border-primary/30 hover:border-primary"
            }`}
            onClick={handleMintClick}
            disabled={isMinting || isMinted}
            variant={isMinted ? "outline" : "default"}
          >
            {isMinting ? "Platform minting…" : isMinted
              ? <><Fingerprint className="mr-1.5 h-3 w-3" />IP-NFT Registered</>
              : <><FlaskConical className="mr-1.5 h-3 w-3" />Mint IP-NFT</>}
          </Button>
          <Link href={`/app/peptide/${variant.id}`}>
            <Button
              variant="ghost"
              size="sm"
              className="h-8 w-8 p-0 text-muted-foreground hover:text-primary hover:bg-primary/10 flex-shrink-0"
              title="View Full Report"
              onClick={(e) => e.stopPropagation()}
            >
              <BarChart2 className="w-3.5 h-3.5" />
            </Button>
          </Link>
          {mintAddress && (
            <a
              href={`https://explorer.solana.com/address/${mintAddress}`}
              target="_blank" rel="noopener noreferrer"
              className="text-muted-foreground hover:text-primary transition-colors"
              title="View on Solana Explorer"
            >
              <ExternalLink className="w-3.5 h-3.5" />
            </a>
          )}
        </div>
      </motion.div>

      <IPNFTForm
        open={formOpen}
        onOpenChange={setFormOpen}
        peptide={{ id: variant.id, sequence: variant.sequence, evolutionScore: variant.evolutionScore, affinity: variant.affinity, stability: variant.stability, novelty: variant.novelty }}
        onConfirm={handleIPNFTConfirm}
        isMinting={isMinting}
      />
    </>
  );
}
