import { useEffect, useState } from "react";
import { useRoute, Link } from "wouter";
import { motion } from "framer-motion";
import {
  ArrowLeft, FlaskConical, Fingerprint, ExternalLink, Copy,
  ShieldCheck, Zap, Layers, Dna, Tag, CheckCircle2, Loader2, Download, ArrowLeftRight,
} from "lucide-react";
import { MoleculeViewer } from "@/components/molecules/MoleculeViewer";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { NeonProgressBar } from "@/components/ui/NeonProgressBar";

const BASE_URL = (import.meta.env.BASE_URL || "/").replace(/\/$/, "");

interface Peptide {
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
  therapeuticArea: string | null;
  rationale: string | null;
  mechanism: string | null;
  keyFeatures: string[] | null;
  ipnftMeta: {
    therapeuticArea?: string;
    developmentStage?: string;
    ipType?: string;
    institution?: { name?: string; department?: string; country?: string };
    researcherName?: string;
    fundingTargetUsd?: number;
  } | null;
  createdAt: string;
}

const STAGE_LABELS: Record<string, string> = {
  preclinical: "Preclinical", phase_1: "Phase I", phase_2: "Phase II",
  phase_3: "Phase III", approved: "Approved",
};

function scoreLabel(value: number, type: "affinity" | "stability" | "safety") {
  if (type === "safety") {
    const s = 100 - value * 4;
    if (s >= 90) return { label: "Very Safe", color: "text-emerald-400" };
    if (s >= 75) return { label: "Safe", color: "text-green-400" };
    if (s >= 50) return { label: "Moderate", color: "text-yellow-400" };
    return { label: "Caution", color: "text-orange-400" };
  }
  if (value >= 90) return { label: "Excellent", color: "text-emerald-400" };
  if (value >= 80) return { label: "Strong", color: "text-cyan-400" };
  if (value >= 70) return { label: "Good", color: "text-blue-400" };
  return { label: "Moderate", color: "text-yellow-400" };
}

export function PeptideDetailPage() {
  const [, params] = useRoute("/app/peptide/:id");
  const id = params?.id ?? "";
  const [peptide, setPeptide] = useState<Peptide | null>(null);
  const [loading, setLoading] = useState(true);
  const [copied, setCopied] = useState(false);
  const { toast } = useToast();

  useEffect(() => {
    if (!id) return;
    fetch(`${BASE_URL}/api/peptides/${id}`)
      .then((r) => r.json())
      .then((data) => { if (data && !data.error) setPeptide(data); })
      .catch(() => {})
      .finally(() => setLoading(false));
  }, [id]);

  const copySequence = () => {
    if (!peptide) return;
    navigator.clipboard.writeText(peptide.sequence);
    setCopied(true);
    toast({ title: "Copied!", description: "Sequence copied to clipboard." });
    setTimeout(() => setCopied(false), 2000);
  };

  const copyLink = () => {
    navigator.clipboard.writeText(window.location.href);
    toast({ title: "Link Copied!", description: "Share this URL to show this peptide." });
  };

  const downloadFasta = () => {
    if (!peptide) return;
    const created = new Date(peptide.createdAt).toLocaleDateString("en-US", { year: "numeric", month: "long", day: "numeric" });
    const safetyScore = Math.max(0, 100 - peptide.toxicity * 4);
    const lines = [
      "PEPTIMUS SEQUENCE REPORT",
      "═".repeat(48),
      "",
      `Peptide ID       : ${peptide.id}`,
      `Sequence         : ${peptide.sequence}`,
      `Length           : ${peptide.sequence.length} amino acids`,
      `Seed / Goal      : ${peptide.seedSequence || "N/A"}`,
      "",
      "PREDICTED PROPERTIES",
      "─".repeat(48),
      `Evolution Score  : ${peptide.evolutionScore} / 100`,
      `Binding Affinity : ${peptide.affinity}%`,
      `Stability Score  : ${peptide.stability}%`,
      `Novelty Index    : ${peptide.novelty}%`,
      `Toxicity         : ${peptide.toxicity}%  (lower = safer, safety score ${safetyScore}%)`,
      "",
      "CHAIN INFORMATION",
      "─".repeat(48),
      `Network          : Solana Mainnet`,
      `Creator Wallet   : ${peptide.creatorWallet ?? "Anonymous"}`,
      `Created          : ${created}`,
      `Mint Address     : ${peptide.mintAddress ?? "Not minted"}`,
    ];

    if (peptide.ipnftMeta) {
      const m = peptide.ipnftMeta;
      lines.push(
        "",
        "IP-NFT METADATA",
        "─".repeat(48),
        `Therapeutic Area : ${m.therapeuticArea ?? "N/A"}`,
        `Development Stage: ${m.developmentStage ?? "N/A"}`,
        `IP Type          : ${m.ipType ?? "N/A"}`,
        `Researcher       : ${m.researcherName ?? "N/A"}`,
        `Institution      : ${m.institution?.name ?? "N/A"}${m.institution?.department ? ", " + m.institution.department : ""}`,
        `Country          : ${m.institution?.country ?? "N/A"}`,
        `Funding Target   : ${m.fundingTargetUsd ? "$" + m.fundingTargetUsd.toLocaleString() : "N/A"}`,
      );
    }

    lines.push(
      "",
      "FASTA FORMAT (for bioinformatics tools)",
      "─".repeat(48),
      `>${peptide.id} score=${peptide.evolutionScore} affinity=${peptide.affinity} stability=${peptide.stability} novelty=${peptide.novelty} toxicity=${peptide.toxicity}`,
      peptide.sequence,
      "",
      "═".repeat(48),
      "Generated by Peptimus - Decentralized AI Peptide Design",
      "https://peptimus.replit.app",
    );

    const blob = new Blob([lines.join("\n")], { type: "text/plain" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url; a.download = `${peptide.id}-report.txt`; a.click();
    URL.revokeObjectURL(url);
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-24 gap-3 text-muted-foreground font-mono">
        <Loader2 className="w-5 h-5 animate-spin" />
        Loading peptide...
      </div>
    );
  }

  if (!peptide) {
    return (
      <div className="text-center py-24 space-y-3">
        <Dna className="w-12 h-12 text-muted-foreground/30 mx-auto" />
        <p className="text-muted-foreground font-mono">Peptide not found.</p>
        <Link href="/app/discover"><Button variant="outline" size="sm">Back to Discover</Button></Link>
      </div>
    );
  }

  const affinityInfo = scoreLabel(peptide.affinity, "affinity");
  const stabilityInfo = scoreLabel(peptide.stability, "stability");
  const safetyInfo = scoreLabel(peptide.toxicity, "safety");
  const ipnft = peptide.ipnftMeta;

  return (
    <div className="max-w-4xl mx-auto space-y-6 pb-16">
      <div className="flex items-center gap-3">
        <Link href="/app/discover">
          <button className="flex items-center gap-1.5 text-muted-foreground hover:text-foreground text-sm font-mono transition-colors">
            <ArrowLeft className="w-4 h-4" /> Back
          </button>
        </Link>
        <span className="text-border">·</span>
        <span className="font-mono text-xs text-muted-foreground">{peptide.id}</span>
        <div className="ml-auto flex items-center gap-2">
          <button onClick={downloadFasta} className="flex items-center gap-1.5 text-[10px] font-mono text-muted-foreground hover:text-emerald-400 border border-border hover:border-emerald-400/40 px-2.5 py-1 rounded-lg transition-all">
            <Download className="w-3 h-3" /> Report
          </button>
          <Link href={`/app/compare?a=${id}`}>
            <button className="flex items-center gap-1.5 text-[10px] font-mono text-muted-foreground hover:text-primary border border-border hover:border-primary/40 px-2.5 py-1 rounded-lg transition-all">
              <ArrowLeftRight className="w-3 h-3" /> Compare
            </button>
          </Link>
          <button onClick={copyLink} className="flex items-center gap-1.5 text-[10px] font-mono text-muted-foreground hover:text-primary border border-border hover:border-primary/40 px-2.5 py-1 rounded-lg transition-all">
            <Copy className="w-3 h-3" /> Share
          </button>
        </div>
      </div>

      {(peptide.therapeuticArea || peptide.rationale || peptide.mechanism) && (
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-primary/5 border border-primary/20 rounded-2xl p-5 space-y-3"
        >
          {peptide.therapeuticArea && (
            <div className="flex items-center gap-3 flex-wrap">
              <span className="text-[9px] font-mono text-muted-foreground uppercase tracking-widest">Designed for</span>
              <span className="text-sm font-bold text-primary">{peptide.therapeuticArea}</span>
              {peptide.mechanism && (
                <>
                  <span className="text-muted-foreground/30">·</span>
                  <span className="text-xs text-muted-foreground/80 italic">{peptide.mechanism}</span>
                </>
              )}
            </div>
          )}
          {!peptide.therapeuticArea && peptide.mechanism && (
            <div className="flex items-center gap-3">
              <span className="text-[9px] font-mono text-muted-foreground uppercase tracking-widest">Mechanism</span>
              <span className="text-xs text-muted-foreground/80">{peptide.mechanism}</span>
            </div>
          )}
          {peptide.rationale && (
            <p className="text-xs text-muted-foreground/80 leading-relaxed border-t border-primary/10 pt-3">
              {peptide.rationale}
            </p>
          )}
          <div className="flex items-center gap-1.5">
            <span className="text-[8px] font-mono text-muted-foreground/40 uppercase tracking-widest">AI Predicted · Not experimentally validated</span>
          </div>
        </motion.div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          className="lg:col-span-1 bg-card border border-border rounded-2xl overflow-hidden"
        >
          <MoleculeViewer sequence={peptide.sequence} size="large" />
          <div className="p-4 space-y-3">
            <div>
              <div className="text-[9px] font-mono text-muted-foreground uppercase tracking-widest mb-1">Amino Acid Sequence</div>
              <div className="flex items-start gap-2">
                <div className="font-mono text-xs tracking-widest text-primary break-all leading-relaxed flex-1">{peptide.sequence}</div>
                <button onClick={copySequence} className="shrink-0 text-muted-foreground hover:text-primary transition-colors mt-0.5">
                  {copied ? <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                </button>
              </div>
            </div>
            <div className="pt-2 border-t border-border/50">
              <div className="flex items-center justify-between mb-2">
                <span className="text-[9px] font-mono text-muted-foreground uppercase tracking-widest">Evolution Score</span>
                <span className="text-2xl font-bold text-foreground">{peptide.evolutionScore}</span>
              </div>
              <div className="h-1.5 w-full bg-muted rounded-full overflow-hidden">
                <div className="h-full bg-gradient-to-r from-primary to-accent rounded-full" style={{ width: `${peptide.evolutionScore}%` }} />
              </div>
            </div>
            {peptide.mintAddress ? (
              <a
                href={`https://explorer.solana.com/address/${peptide.mintAddress}`}
                target="_blank" rel="noopener noreferrer"
                className="flex items-center justify-center gap-1.5 text-[10px] font-mono text-cyan-400 hover:text-cyan-300 border border-cyan-500/20 hover:border-cyan-500/40 rounded-lg py-2 transition-all w-full"
              >
                <Fingerprint className="w-3 h-3" /> IP-NFT · Solana Explorer <ExternalLink className="w-2.5 h-2.5" />
              </a>
            ) : (
              <Link href="/app/library">
                <div className="flex items-center justify-center gap-1.5 text-[10px] font-mono text-primary border border-primary/30 hover:border-primary/60 rounded-lg py-2 transition-all w-full cursor-pointer">
                  <FlaskConical className="w-3 h-3" /> Mint as IP-NFT
                </div>
              </Link>
            )}
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.08 }}
          className="lg:col-span-2 space-y-4"
        >
          <div className="bg-card border border-border rounded-2xl p-5 space-y-5">
            <h2 className="text-sm font-bold uppercase tracking-widest text-muted-foreground flex items-center gap-2">
              <Zap className="w-4 h-4 text-primary" /> Predicted Properties
            </h2>

            <div className="grid grid-cols-3 gap-4">
              {[
                { label: "Binding", icon: <Zap className="w-3.5 h-3.5 text-cyan-400" />, info: affinityInfo, val: peptide.affinity },
                { label: "Stability", icon: <Layers className="w-3.5 h-3.5 text-emerald-400" />, info: stabilityInfo, val: peptide.stability },
                { label: "Safety", icon: <ShieldCheck className="w-3.5 h-3.5 text-green-400" />, info: safetyInfo, val: `tox ${peptide.toxicity}%` },
              ].map((m) => (
                <div key={m.label} className="bg-muted/30 rounded-xl p-3 text-center">
                  <div className="flex items-center justify-center gap-1 mb-1">{m.icon}<span className="text-[9px] font-mono text-muted-foreground uppercase tracking-wider">{m.label}</span></div>
                  <div className={`text-sm font-bold ${m.info.color}`}>{m.info.label}</div>
                  <div className="text-[10px] text-muted-foreground font-mono">{m.val}</div>
                </div>
              ))}
            </div>

            <div className="space-y-3 pt-2">
              <NeonProgressBar value={peptide.affinity} color="cyan" label="Binding Affinity" />
              <NeonProgressBar value={peptide.stability} color="emerald" label="Stability Score" />
              <NeonProgressBar value={peptide.novelty} color="purple" label="Novelty Index" />
              <NeonProgressBar value={peptide.toxicity} color="purple" label="Toxicity (lower=safer)" />
            </div>
          </div>

          <div className="bg-card border border-border rounded-2xl p-5 space-y-4">
            <h2 className="text-sm font-bold uppercase tracking-widest text-muted-foreground flex items-center gap-2">
              <Tag className="w-4 h-4 text-primary" /> Origin & Metadata
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
              {[
                { label: "Peptide ID", value: peptide.id, mono: true },
                { label: "Seed / Goal", value: peptide.seedSequence || "N/A", mono: true },
                { label: "Creator", value: peptide.creatorWallet ? `${peptide.creatorWallet.slice(0, 8)}…${peptide.creatorWallet.slice(-6)}` : "Anonymous", mono: true },
                { label: "Created", value: new Date(peptide.createdAt).toLocaleDateString("en-US", { year: "numeric", month: "short", day: "numeric" }) },
                { label: "Chain", value: "Solana Mainnet", mono: true },
                { label: "Mint Address", value: peptide.mintAddress ? `${peptide.mintAddress.slice(0, 8)}…` : "Not minted", mono: true, highlight: !!peptide.mintAddress },
              ].map((row) => (
                <div key={row.label} className="space-y-0.5">
                  <div className="text-[9px] font-mono text-muted-foreground uppercase tracking-wider">{row.label}</div>
                  <div className={`${row.mono ? "font-mono" : ""} ${row.highlight ? "text-cyan-400" : "text-foreground"} text-xs break-all`}>{row.value}</div>
                </div>
              ))}
            </div>
          </div>

          {ipnft && (
            <div className="bg-card border border-cyan-500/20 rounded-2xl p-5 space-y-4">
              <h2 className="text-sm font-bold uppercase tracking-widest text-cyan-400 flex items-center gap-2">
                <Fingerprint className="w-4 h-4" /> IP-NFT Registration
              </h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                {[
                  ipnft.therapeuticArea && { label: "Therapeutic Area", value: ipnft.therapeuticArea },
                  ipnft.developmentStage && { label: "Development Stage", value: STAGE_LABELS[ipnft.developmentStage] ?? ipnft.developmentStage },
                  ipnft.ipType && { label: "IP Type", value: ipnft.ipType },
                  ipnft.institution?.name && { label: "Institution", value: ipnft.institution.name },
                  ipnft.researcherName && { label: "Researcher", value: ipnft.researcherName },
                  ipnft.fundingTargetUsd && { label: "Funding Target", value: `$${ipnft.fundingTargetUsd.toLocaleString()}` },
                ].filter(Boolean).map((row: any) => (
                  <div key={row.label} className="space-y-0.5">
                    <div className="text-[9px] font-mono text-muted-foreground uppercase tracking-wider">{row.label}</div>
                    <div className="text-foreground text-xs">{row.value}</div>
                  </div>
                ))}
              </div>
              <a
                href={`${BASE_URL}/api/peptides/${peptide.id}/metadata`}
                target="_blank" rel="noopener noreferrer"
                className="flex items-center gap-1.5 text-[10px] font-mono text-cyan-400 hover:text-cyan-300 transition-colors"
              >
                <ExternalLink className="w-3 h-3" /> View Full Metadata JSON
              </a>
            </div>
          )}
        </motion.div>
      </div>
    </div>
  );
}
