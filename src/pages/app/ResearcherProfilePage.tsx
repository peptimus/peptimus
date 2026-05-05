import { useEffect, useState } from "react";
import { useRoute, Link } from "wouter";
import { motion } from "framer-motion";
import {
  User, FlaskConical, Fingerprint, TrendingUp, Award,
  ArrowLeft, Copy, CheckCircle2, Loader2, ExternalLink, Download,
} from "lucide-react";
import { useAppStore } from "@/store/useAppStore";

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
  ipnftMeta: { therapeuticArea?: string; developmentStage?: string } | null;
  createdAt: string;
}

function downloadFasta(peptides: Peptide[], filename = "peptimus_sequences.fasta") {
  const lines = peptides.map((p) =>
    `>${p.id} | score=${p.evolutionScore} | affinity=${p.affinity} | stability=${p.stability}${p.ipnftMeta?.therapeuticArea ? ` | area=${p.ipnftMeta.therapeuticArea}` : ""}\n${p.sequence}`
  );
  const blob = new Blob([lines.join("\n\n")], { type: "text/plain" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url; a.download = filename; a.click();
  URL.revokeObjectURL(url);
}

export function ResearcherProfilePage() {
  const [, params] = useRoute("/app/profile/:wallet");
  const wallet = params?.wallet ?? "";
  const [peptides, setPeptides] = useState<Peptide[]>([]);
  const [loading, setLoading] = useState(true);
  const [copied, setCopied] = useState(false);
  const { walletAddress } = useAppStore();
  const isOwn = walletAddress && walletAddress === wallet;

  useEffect(() => {
    if (!wallet) return;
    fetch(`${BASE_URL}/api/peptides?wallet=${wallet}`)
      .then((r) => r.json())
      .then((data) => setPeptides(Array.isArray(data) ? data : []))
      .catch(() => setPeptides([]))
      .finally(() => setLoading(false));
  }, [wallet]);

  const minted = peptides.filter((p) => p.mintAddress);
  const avgScore = peptides.length
    ? Math.round(peptides.reduce((s, p) => s + p.evolutionScore, 0) / peptides.length)
    : 0;
  const topScore = peptides.length ? Math.max(...peptides.map((p) => p.evolutionScore)) : 0;
  const areas = [...new Set(peptides.map((p) => p.ipnftMeta?.therapeuticArea).filter(Boolean))];

  const copyWallet = () => {
    navigator.clipboard.writeText(wallet);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="max-w-5xl mx-auto space-y-8 pb-16">
      <div className="flex items-center gap-3">
        <Link href="/app/discover">
          <button className="flex items-center gap-1.5 text-muted-foreground hover:text-foreground text-sm font-mono transition-colors">
            <ArrowLeft className="w-4 h-4" /> Back
          </button>
        </Link>
      </div>

      <motion.div
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-card border border-border rounded-2xl p-6"
      >
        <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4">
          <div className="w-16 h-16 rounded-2xl border border-primary/30 overflow-hidden shrink-0 bg-gradient-to-br from-primary/20 to-accent/20">
            {minted[0] ? (
              <img
                src={`${BASE_URL}/api/peptides/${minted[0].id}/image`}
                alt="NFT Avatar"
                className="w-full h-full object-cover"
              />
            ) : (
              <div className="w-full h-full flex items-center justify-center">
                <User className="w-8 h-8 text-primary" />
              </div>
            )}
          </div>
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2 mb-1">
              <h1 className="text-xl font-bold text-foreground">
                {isOwn ? "My Research Profile" : "Researcher"}
              </h1>
              {isOwn && (
                <span className="text-[10px] font-mono font-bold px-2 py-0.5 rounded-full border border-primary/40 bg-primary/10 text-primary uppercase tracking-wider">You</span>
              )}
            </div>
            <div className="flex items-center gap-2">
              <span className="font-mono text-sm text-muted-foreground truncate max-w-xs">{wallet}</span>
              <button onClick={copyWallet} className="text-muted-foreground hover:text-primary transition-colors shrink-0">
                {copied ? <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
              </button>
            </div>
            {areas.length > 0 && (
              <div className="flex flex-wrap gap-1.5 mt-2">
                {areas.map((a) => (
                  <span key={a} className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-cyan-950/40 border border-cyan-500/20 text-cyan-400">{a}</span>
                ))}
              </div>
            )}
          </div>
          {peptides.length > 0 && (
            <button
              onClick={() => downloadFasta(peptides, `${wallet.slice(0, 8)}_sequences.fasta`)}
              className="flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider border border-border text-muted-foreground hover:text-foreground hover:border-primary/40 px-4 py-2 rounded-xl transition-all shrink-0"
            >
              <Download className="w-3.5 h-3.5" /> Export FASTA
            </button>
          )}
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mt-6 pt-6 border-t border-border/50">
          {[
            { label: "Peptides", value: peptides.length, color: "text-foreground", icon: <FlaskConical className="w-4 h-4 text-primary" /> },
            { label: "IP-NFTs", value: minted.length, color: "text-cyan-400", icon: <Fingerprint className="w-4 h-4 text-cyan-400" /> },
            { label: "Avg Score", value: avgScore, color: "text-emerald-400", icon: <TrendingUp className="w-4 h-4 text-emerald-400" /> },
            { label: "Top Score", value: topScore, color: "text-primary", icon: <Award className="w-4 h-4 text-primary" /> },
          ].map((stat) => (
            <div key={stat.label} className="text-center bg-muted/20 rounded-xl p-4 border border-border/40">
              <div className="flex items-center justify-center mb-1">{stat.icon}</div>
              <div className={`text-2xl font-bold ${stat.color}`}>{stat.value}</div>
              <div className="text-[10px] font-mono text-muted-foreground uppercase tracking-wider mt-0.5">{stat.label}</div>
            </div>
          ))}
        </div>
      </motion.div>

      <div>
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-sm font-bold uppercase tracking-widest text-muted-foreground border-b border-border pb-2 flex-1">
            {loading ? "Loading..." : `${peptides.length} Sequences`}
          </h2>
        </div>

        {loading ? (
          <div className="flex items-center justify-center py-20 gap-3 text-muted-foreground font-mono text-sm">
            <Loader2 className="w-5 h-5 animate-spin" /> Loading...
          </div>
        ) : peptides.length === 0 ? (
          <div className="text-center py-20">
            <FlaskConical className="w-12 h-12 text-muted-foreground/20 mx-auto mb-3" />
            <p className="text-muted-foreground font-mono text-sm">NO PEPTIDES YET</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {peptides.map((p, i) => (
              <motion.div
                key={p.id}
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.04 }}
              >
                <Link href={`/app/peptide/${p.id}`}>
                  <div className="bg-card border border-border rounded-xl overflow-hidden hover:border-primary/30 transition-all cursor-pointer group">
                    <img
                      src={`${BASE_URL}/api/peptides/${p.id}/image`}
                      alt={p.id}
                      className="w-full aspect-square object-cover"
                    />
                    <div className="p-3 space-y-2">
                      <div className="flex items-center justify-between gap-2">
                        <span className="font-mono text-[10px] text-muted-foreground truncate">{p.id}</span>
                        {p.mintAddress ? (
                          <span className="text-[9px] font-mono px-1.5 py-0.5 rounded bg-cyan-950/40 text-cyan-400 border border-cyan-500/20 uppercase shrink-0">NFT</span>
                        ) : (
                          <span className="text-[9px] font-mono px-1.5 py-0.5 rounded bg-muted/40 text-muted-foreground border border-border uppercase shrink-0">Pending</span>
                        )}
                      </div>
                      <div className="font-mono text-xs text-primary tracking-widest break-all leading-relaxed">{p.sequence}</div>
                      {p.ipnftMeta?.therapeuticArea && (
                        <span className="text-[9px] font-mono px-1.5 py-0.5 rounded bg-purple-950/40 text-purple-400 border border-purple-500/20 uppercase">{p.ipnftMeta.therapeuticArea}</span>
                      )}
                      <div className="grid grid-cols-3 gap-2 pt-2 border-t border-border/40">
                        {[
                          { l: "Score", v: p.evolutionScore, c: "text-primary" },
                          { l: "Affinity", v: p.affinity, c: "text-cyan-400" },
                          { l: "Stability", v: p.stability, c: "text-emerald-400" },
                        ].map((m) => (
                          <div key={m.l} className="text-center">
                            <div className="text-[8px] text-muted-foreground font-mono uppercase">{m.l}</div>
                            <div className={`text-xs font-bold ${m.c}`}>{m.v}</div>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                </Link>
              </motion.div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
