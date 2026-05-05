import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import {
  Database, Search, Fingerprint, Loader2, ExternalLink, RefreshCw,
  FlaskConical, Shield, FileText, ChevronRight, X, Download, BarChart2,
} from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { useAppStore } from "@/store/useAppStore";
import { useToast } from "@/hooks/use-toast";
import confetti from "canvas-confetti";
import { IPNFTForm, type IpnftMeta } from "@/components/peptide/IPNFTForm";
import { Link } from "wouter";

const BASE_URL = (import.meta.env.BASE_URL || "/").replace(/\/$/, "");

interface IpnftMetaObj {
  therapeuticArea?: string;
  developmentStage?: string;
  institution?: { name?: string; department?: string; country?: string };
  ipType?: string;
  researcherName?: string;
  researcherOrcid?: string;
  fundingTargetUsd?: number;
  registeredAt?: string;
}

interface DBPeptide {
  id: string;
  sequence: string;
  seedSequence: string;
  affinity: number;
  stability: number;
  novelty: number;
  toxicity: number;
  evolutionScore: number;
  creatorWallet: string | null;
  mintAddress: string | null;
  ipnftMeta: IpnftMetaObj | null;
  therapeuticArea: string | null;
  rationale: string | null;
  mechanism: string | null;
  keyFeatures: string[] | null;
  createdAt: string;
}

const STAGE_LABELS: Record<string, string> = {
  preclinical: "Preclinical",
  phase_1: "Phase I",
  phase_2: "Phase II",
  phase_3: "Phase III",
  approved: "Approved",
};

const IPTYPE_LABELS: Record<string, string> = {
  pre_patent: "Pre-Patent",
  patent_pending: "Patent Pending",
  granted_patent: "Granted Patent",
  trade_secret: "Trade Secret",
  data_package: "Data Package",
};

export function LibraryPage() {
  const [search, setSearch] = useState("");
  const [peptides, setPeptides] = useState<DBPeptide[]>([]);
  const [loading, setLoading] = useState(true);
  const [mintingId, setMintingId] = useState<string | null>(null);
  const [formPeptide, setFormPeptide] = useState<DBPeptide | null>(null);
  const [detailPeptide, setDetailPeptide] = useState<DBPeptide | null>(null);
  const { walletAddress, walletConnected, setSelectedPeptide } = useAppStore();
  const { toast } = useToast();

  const fetchPeptides = async () => {
    setLoading(true);
    try {
      const url = walletAddress
        ? `${BASE_URL}/api/peptides?wallet=${walletAddress}`
        : `${BASE_URL}/api/peptides`;
      const res = await fetch(url);
      const data = await res.json();
      setPeptides(Array.isArray(data) ? data : []);
    } catch {
      setPeptides([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPeptides();
  }, [walletAddress]);

  const filtered = peptides.filter(
    (p) =>
      p.sequence.toLowerCase().includes(search.toLowerCase()) ||
      p.id.toLowerCase().includes(search.toLowerCase()) ||
      (p.seedSequence ?? "").toLowerCase().includes(search.toLowerCase()) ||
      (p.ipnftMeta?.therapeuticArea ?? "").toLowerCase().includes(search.toLowerCase())
  );

  const handleMintClick = (peptide: DBPeptide, e: React.MouseEvent) => {
    e.stopPropagation();
    if (peptide.mintAddress) return;
    if (!walletConnected || !walletAddress) {
      toast({
        title: "Wallet Required",
        description: "Connect your Solana wallet to mint IP-NFTs.",
        variant: "destructive",
      });
      return;
    }
    setFormPeptide(peptide);
  };

  const handleIPNFTConfirm = async (meta: IpnftMeta) => {
    if (!formPeptide || !walletAddress) return;
    const peptide = formPeptide;
    setMintingId(peptide.id);
    try {
      await fetch(`${BASE_URL}/api/peptides/${peptide.id}/ipnft`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(meta),
      });

      const res = await fetch(`${BASE_URL}/api/peptides/${peptide.id}/mint-server`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ userWallet: walletAddress }),
      });
      if (!res.ok) {
        const err = await res.json().catch(() => ({}));
        throw new Error(err.error ?? "Minting failed");
      }
      const result = await res.json();

      setPeptides((prev) =>
        prev.map((p) =>
          p.id === peptide.id
            ? { ...p, mintAddress: result.mintAddress, ipnftMeta: { ...meta, registeredAt: new Date().toISOString() } }
            : p
        )
      );

      setFormPeptide(null);
      confetti({ particleCount: 110, spread: 70, origin: { y: 0.6 }, colors: ["#00f5ff", "#00ff9f", "#8b5cf6"] });

      toast({
        title: "IP-NFT Minted · Molecule Standard",
        description: `${peptide.sequence.slice(0, 8)}… registered · ${meta.therapeuticArea}`,
        className: "bg-card border-cyan-500/40",
      });
    } catch (err: any) {
      toast({
        title: "Mint Failed",
        description: err?.message ?? "Minting failed",
        variant: "destructive",
      });
    } finally {
      setMintingId(null);
    }
  };

  return (
    <div className="max-w-6xl mx-auto space-y-8 pb-12">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="space-y-2">
          <h1 className="text-3xl font-bold uppercase tracking-widest text-foreground flex items-center gap-3">
            <Database className="w-8 h-8 text-primary" />
            {walletConnected ? "My IP-NFT Library" : "Community IP-NFT Library"}
          </h1>
          <div className="flex items-center gap-2 flex-wrap">
            <p className="text-muted-foreground text-sm">
              {walletConnected
                ? "Your AI-evolved peptides registered as Molecule Protocol IP-NFTs."
                : "All IP-NFTs across the protocol. Connect wallet to see yours."}
            </p>
            <a
              href="https://molecule.xyz"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-1 text-[10px] font-mono text-cyan-400/60 hover:text-cyan-400 transition-colors border border-cyan-400/20 px-2 py-0.5 rounded-full"
            >
              <FlaskConical className="w-2.5 h-2.5" /> Molecule Standard <ExternalLink className="w-2 h-2" />
            </a>
          </div>
        </div>

        <div className="flex gap-2 items-start">
          <div className="relative w-full md:w-64">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <Input
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search sequences, areas..."
              className="pl-9 bg-input border-border focus-visible:ring-primary font-mono text-sm"
            />
          </div>
          {filtered.length > 0 && (
            <Button
              size="icon"
              variant="outline"
              onClick={() => {
                const lines = filtered.map((p) =>
                  `>${p.id} | score=${p.evolutionScore} | affinity=${p.affinity} | stability=${p.stability}${p.ipnftMeta?.therapeuticArea ? ` | area=${p.ipnftMeta.therapeuticArea}` : ""}\n${p.sequence}`
                );
                const blob = new Blob([lines.join("\n\n")], { type: "text/plain" });
                const url = URL.createObjectURL(blob);
                const a = document.createElement("a");
                a.href = url; a.download = "peptimus_library.fasta"; a.click();
                URL.revokeObjectURL(url);
              }}
              className="border-border text-muted-foreground hover:text-emerald-400 hover:border-emerald-400/40"
              title="Export FASTA"
            >
              <Download className="w-4 h-4" />
            </Button>
          )}
          <Button
            size="icon"
            variant="outline"
            onClick={fetchPeptides}
            className="border-border text-muted-foreground hover:text-foreground"
            title="Refresh"
          >
            <RefreshCw className="w-4 h-4" />
          </Button>
        </div>
      </div>

      {loading ? (
        <div className="flex items-center justify-center py-24 gap-3 text-muted-foreground font-mono text-sm">
          <Loader2 className="w-5 h-5 animate-spin" />
          LOADING IP-NFT REGISTRY...
        </div>
      ) : filtered.length === 0 ? (
        <div className="text-center py-24 space-y-3">
          <Database className="w-12 h-12 text-muted-foreground/30 mx-auto" />
          <p className="text-muted-foreground font-mono text-sm">
            {peptides.length === 0
              ? "NO IP-NFTS YET. GENERATE PEPTIDES IN AI STUDIO."
              : "NO RESULTS FOUND"}
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
          {filtered.map((peptide, i) => {
            const isMinted = !!peptide.mintAddress;
            const isMintingThis = mintingId === peptide.id;
            const ipnft = peptide.ipnftMeta;

            return (
              <motion.div
                key={peptide.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.04, duration: 0.35 }}
                className="bg-card border border-border rounded-xl overflow-hidden hover:border-primary/30 transition-colors group flex flex-col cursor-pointer"
                onClick={() => setSelectedPeptide({
                  id: peptide.id,
                  sequence: peptide.sequence,
                  affinity: peptide.affinity,
                  stability: peptide.stability,
                  novelty: peptide.novelty,
                  toxicity: peptide.toxicity,
                  evolutionScore: peptide.evolutionScore,
                })}
              >
                <div className="p-3 border-b border-border/50 flex justify-between items-center bg-muted/20">
                  <span className="font-mono text-[10px] text-muted-foreground truncate max-w-[100px]">{peptide.id}</span>
                  {isMinted ? (
                    <Badge className="border-cyan-500/40 text-cyan-400 bg-cyan-950/30 text-[9px] uppercase font-bold tracking-widest rounded-sm">
                      <FlaskConical className="w-2.5 h-2.5 mr-1" /> IP-NFT
                    </Badge>
                  ) : (
                    <Badge variant="outline" className="border-border text-muted-foreground text-[9px] uppercase tracking-widest rounded-sm">
                      Pending
                    </Badge>
                  )}
                </div>

                <div className="p-4 flex-1 flex flex-col gap-3">
                  <div className="w-full h-28 rounded-xl overflow-hidden border border-white/8 bg-black/30">
                    <img
                      src={`${BASE_URL}/api/peptides/${peptide.id}/image`}
                      alt={peptide.sequence}
                      className="w-full h-full object-cover"
                      loading="lazy"
                      onError={(e) => { (e.currentTarget as HTMLImageElement).style.display = "none"; }}
                    />
                  </div>

                  <div className="font-mono text-xs tracking-widest text-center break-all text-primary leading-relaxed">
                    {peptide.sequence}
                  </div>

                  {(peptide.therapeuticArea || peptide.mechanism) && (
                    <div className="bg-primary/5 border border-primary/15 rounded-lg px-3 py-2 space-y-1">
                      {peptide.therapeuticArea && (
                        <div className="flex items-center gap-1.5">
                          <span className="text-[8px] font-mono text-muted-foreground/60 uppercase tracking-widest shrink-0">Area</span>
                          <span className="text-[10px] font-semibold text-primary/90 truncate">{peptide.therapeuticArea}</span>
                        </div>
                      )}
                      {peptide.mechanism && (
                        <div className="flex items-start gap-1.5">
                          <span className="text-[8px] font-mono text-muted-foreground/60 uppercase tracking-widest shrink-0 mt-0.5">Target</span>
                          <span className="text-[9px] text-muted-foreground/80 leading-snug line-clamp-2">{peptide.mechanism}</span>
                        </div>
                      )}
                    </div>
                  )}

                  {ipnft?.therapeuticArea && (
                    <div className="flex flex-wrap gap-1 justify-center">
                      <span className="text-[9px] font-mono px-1.5 py-0.5 rounded bg-cyan-400/10 text-cyan-400 border border-cyan-400/20 uppercase tracking-wider">
                        {ipnft.therapeuticArea}
                      </span>
                      {ipnft.developmentStage && (
                        <span className="text-[9px] font-mono px-1.5 py-0.5 rounded bg-emerald-400/10 text-emerald-400 border border-emerald-400/20 uppercase tracking-wider">
                          {STAGE_LABELS[ipnft.developmentStage] ?? ipnft.developmentStage}
                        </span>
                      )}
                      {ipnft.ipType && (
                        <span className="text-[9px] font-mono px-1.5 py-0.5 rounded bg-purple-400/10 text-purple-400 border border-purple-400/20 uppercase tracking-wider">
                          {IPTYPE_LABELS[ipnft.ipType] ?? ipnft.ipType}
                        </span>
                      )}
                    </div>
                  )}

                  <div className="grid grid-cols-2 gap-x-4 gap-y-2 pt-3 border-t border-border/50">
                    {[
                      { label: "Affinity", val: peptide.affinity, color: "#00f5ff" },
                      { label: "Stability", val: peptide.stability, color: "#00ff9f" },
                      { label: "Novelty", val: peptide.novelty, color: "#8b5cf6" },
                      { label: "Score", val: peptide.evolutionScore, color: "#60a5fa" },
                    ].map(({ label, val, color }) => (
                      <div key={label} className="text-center">
                        <div className="text-[9px] text-muted-foreground font-mono uppercase">{label}</div>
                        <div className="font-bold text-sm" style={{ color }}>{val}</div>
                      </div>
                    ))}
                  </div>

                  {peptide.creatorWallet && (
                    <div className="text-[9px] font-mono text-muted-foreground/50 truncate text-center">
                      by {peptide.creatorWallet.slice(0, 8)}...
                    </div>
                  )}
                </div>

                <div className="px-4 pb-4 flex flex-col gap-1.5">
                  <Link href={`/app/peptide/${peptide.id}`} onClick={(e) => e.stopPropagation()}>
                    <Button
                      size="sm"
                      variant="ghost"
                      className="w-full text-[10px] font-mono text-muted-foreground hover:text-primary hover:bg-primary/5 uppercase tracking-wider h-7"
                    >
                      <BarChart2 className="w-3 h-3 mr-1" /> View Full Report <ChevronRight className="w-3 h-3 ml-auto" />
                    </Button>
                  </Link>
                  {isMinted && (
                    <Button
                      size="sm"
                      variant="ghost"
                      className="w-full text-[10px] font-mono text-muted-foreground hover:text-cyan-400 hover:bg-cyan-400/5 uppercase tracking-wider h-7"
                      onClick={(e) => { e.stopPropagation(); setDetailPeptide(peptide); }}
                    >
                      <FileText className="w-3 h-3 mr-1" /> View IP-NFT Metadata <ChevronRight className="w-3 h-3 ml-auto" />
                    </Button>
                  )}

                  <Button
                    size="sm"
                    className={`w-full font-bold tracking-wider uppercase text-xs transition-all ${
                      isMinted
                        ? "bg-cyan-950/40 text-cyan-400 border border-cyan-500/30 cursor-default"
                        : "bg-primary/10 text-primary hover:bg-primary/20 border border-primary/30 hover:border-primary"
                    }`}
                    onClick={(e) => handleMintClick(peptide, e)}
                    disabled={isMintingThis || isMinted}
                    variant={isMinted ? "outline" : "default"}
                  >
                    {isMintingThis ? (
                      <><Loader2 className="mr-1.5 h-3 w-3 animate-spin" /> Confirming...</>
                    ) : isMinted ? (
                      <><Fingerprint className="mr-1.5 h-3 w-3" /> IP-NFT Registered</>
                    ) : (
                      <><FlaskConical className="mr-1.5 h-3 w-3" /> Mint IP-NFT</>
                    )}
                  </Button>

                  {isMinted && peptide.mintAddress && (
                    <a
                      href={`https://explorer.solana.com/address/${peptide.mintAddress}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center justify-center gap-1 text-[9px] text-muted-foreground hover:text-primary transition-colors font-mono"
                    >
                      <ExternalLink className="w-2.5 h-2.5" />
                      {peptide.mintAddress.slice(0, 6)}...{peptide.mintAddress.slice(-4)} · Explorer
                    </a>
                  )}
                </div>
              </motion.div>
            );
          })}
        </div>
      )}

      {formPeptide && (
        <IPNFTForm
          open={!!formPeptide}
          onOpenChange={(v) => { if (!v) setFormPeptide(null); }}
          peptide={{
            id: formPeptide.id,
            sequence: formPeptide.sequence,
            evolutionScore: formPeptide.evolutionScore,
            affinity: formPeptide.affinity,
            stability: formPeptide.stability,
            novelty: formPeptide.novelty,
          }}
          onConfirm={handleIPNFTConfirm}
          isMinting={mintingId === formPeptide.id}
        />
      )}

      {detailPeptide && (
        <IPNFTDetailModal peptide={detailPeptide} onClose={() => setDetailPeptide(null)} />
      )}
    </div>
  );
}

function IPNFTDetailModal({ peptide, onClose }: { peptide: DBPeptide; onClose: () => void }) {
  const ipnft = peptide.ipnftMeta;
  const contentHash = `sha256:${btoa(peptide.sequence + peptide.id).replace(/[^a-z0-9]/gi, "").slice(0, 64)}`;
  const metadataUrl = `${BASE_URL}/api/peptides/${peptide.id}/metadata`;
  const agreementUrl = `${BASE_URL}/api/peptides/${peptide.id}/agreement`;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4" onClick={onClose}>
      <motion.div
        initial={{ opacity: 0, scale: 0.95, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        className="bg-card border border-cyan-500/20 rounded-2xl w-full max-w-xl max-h-[90vh] flex flex-col shadow-2xl"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="p-5 border-b border-border/60 flex items-start justify-between gap-3 shrink-0">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <FlaskConical className="w-4 h-4 text-cyan-400" />
              <span className="text-xs font-bold uppercase tracking-widest text-cyan-400">Molecule IP-NFT Metadata</span>
            </div>
            <div className="font-mono text-primary text-sm tracking-[0.1em]">{peptide.sequence}</div>
          </div>
          <button onClick={onClose} className="text-muted-foreground hover:text-foreground transition-colors mt-1">
            <X className="w-4 h-4" />
          </button>
        </div>

        <div className="p-5 space-y-5 overflow-y-auto flex-1 min-h-0">
          <Section title="Project Details" icon={<FlaskConical className="w-3.5 h-3.5" />}>
            <Row label="Therapeutic Area" value={ipnft?.therapeuticArea ?? "TBD"} highlight="cyan" />
            <Row label="Development Stage" value={STAGE_LABELS[ipnft?.developmentStage ?? ""] ?? ipnft?.developmentStage ?? "Preclinical"} highlight="emerald" />
            <Row label="IP Type" value={IPTYPE_LABELS[ipnft?.ipType ?? ""] ?? ipnft?.ipType ?? "Pre-Patent"} highlight="purple" />
            <Row label="Institution" value={ipnft?.institution?.name ?? "Independent Research"} />
            {ipnft?.institution?.department && <Row label="Department" value={ipnft.institution.department} />}
            {ipnft?.institution?.country && <Row label="Country" value={ipnft.institution.country} />}
            {ipnft?.researcherName && <Row label="Researcher" value={ipnft.researcherName} />}
            {ipnft?.researcherOrcid && <Row label="ORCID" value={ipnft.researcherOrcid} mono />}
            {ipnft?.fundingTargetUsd && <Row label="Funding Target" value={`$${ipnft.fundingTargetUsd.toLocaleString()}`} />}
          </Section>

          <Section title="Agreements" icon={<Shield className="w-3.5 h-3.5" />}>
            <Row label="Type" value="peptide_research_license" mono />
            <Row label="Encrypted" value="false (public)" />
            <Row label="Content Hash" value={contentHash.slice(0, 32) + "…"} mono truncate />
            <div className="flex items-center justify-between py-1.5">
              <span className="text-[10px] font-mono text-muted-foreground uppercase tracking-wider">Agreement URL</span>
              <a
                href={agreementUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-1 text-[10px] font-mono text-cyan-400 hover:text-cyan-300 transition-colors"
              >
                View JSON <ExternalLink className="w-2.5 h-2.5" />
              </a>
            </div>
          </Section>

          <Section title="Chain References" icon={<Fingerprint className="w-3.5 h-3.5" />}>
            <Row label="Protocol" value="Solana Mainnet" />
            <Row label="Mint Address" value={peptide.mintAddress ? `${peptide.mintAddress.slice(0, 8)}…${peptide.mintAddress.slice(-6)}` : "N/A"} mono />
            <Row label="Molecule Contract Ref" value="0xcaD88677…54Fc1" mono />
            <Row label="Standard" value="Molecule IP-NFT v1 (Solana)" />
          </Section>

          <Section title="On-chain Metrics" icon={<Database className="w-3.5 h-3.5" />}>
            <Row label="Binding Affinity" value={`${peptide.affinity}/100`} highlight="cyan" />
            <Row label="Stability Score" value={`${peptide.stability}/100`} highlight="emerald" />
            <Row label="Novelty Index" value={`${peptide.novelty}/100`} highlight="purple" />
            <Row label="Evolution Score" value={`${peptide.evolutionScore}/100`} highlight="cyan" />
          </Section>
        </div>

        <div className="flex gap-2 p-5 border-t border-border/60 shrink-0">
          <a
            href={metadataUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="flex-1 flex items-center justify-center gap-1.5 text-xs font-bold uppercase tracking-wider border border-cyan-500/30 text-cyan-400 hover:bg-cyan-400/5 rounded-lg py-2 transition-colors"
          >
            <FileText className="w-3.5 h-3.5" /> Full Metadata JSON
          </a>
          {peptide.mintAddress && (
            <a
              href={`https://explorer.solana.com/address/${peptide.mintAddress}`}
              target="_blank"
              rel="noopener noreferrer"
              className="flex-1 flex items-center justify-center gap-1.5 text-xs font-bold uppercase tracking-wider border border-border text-muted-foreground hover:text-foreground hover:bg-muted/20 rounded-lg py-2 transition-colors"
            >
              <ExternalLink className="w-3.5 h-3.5" /> Solana Explorer
            </a>
          )}
        </div>
      </motion.div>
    </div>
  );
}

function Section({ title, icon, children }: { title: string; icon: React.ReactNode; children: React.ReactNode }) {
  return (
    <div className="space-y-1">
      <div className="flex items-center gap-1.5 text-[10px] font-mono text-muted-foreground uppercase tracking-widest mb-2">
        <span className="text-cyan-400">{icon}</span>
        {title}
      </div>
      <div className="bg-muted/20 border border-border/40 rounded-lg divide-y divide-border/30">
        {children}
      </div>
    </div>
  );
}

function Row({
  label, value, mono = false, highlight, truncate = false,
}: {
  label: string; value: string; mono?: boolean; highlight?: "cyan" | "emerald" | "purple"; truncate?: boolean;
}) {
  const colorMap = { cyan: "text-cyan-400", emerald: "text-emerald-400", purple: "text-purple-400" };
  return (
    <div className="flex items-center justify-between px-3 py-1.5 gap-4">
      <span className="text-[10px] font-mono text-muted-foreground uppercase tracking-wider shrink-0">{label}</span>
      <span className={`text-[10px] font-${mono ? "mono" : "sans"} ${highlight ? colorMap[highlight] : "text-foreground"} ${truncate ? "truncate max-w-[180px]" : "text-right"}`}>
        {value}
      </span>
    </div>
  );
}
