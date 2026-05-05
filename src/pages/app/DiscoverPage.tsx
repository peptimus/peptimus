import { Compass, TrendingUp, Sparkles, Loader2, FlaskConical } from "lucide-react";
import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Link, useLocation } from "wouter";
import { useAppStore } from "@/store/useAppStore";

const BASE_URL = (import.meta.env.BASE_URL || "/").replace(/\/$/, "");

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
  therapeuticArea: string | null;
  mechanism: string | null;
  ipnftMeta: { therapeuticArea?: string; ipType?: string } | null;
  createdAt: string;
}

function percentile(score: number) {
  if (score >= 97) return "Top 1%";
  if (score >= 93) return "Top 5%";
  if (score >= 88) return "Top 10%";
  return "Top 25%";
}

export function DiscoverPage() {
  const { setSelectedPeptide } = useAppStore();
  const [trending, setTrending] = useState<DBPeptide[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const load = async () => {
      try {
        const res = await fetch(`${BASE_URL}/api/peptides`);
        if (!res.ok) throw new Error();
        const all: DBPeptide[] = await res.json();
        const sorted = [...all].sort((a, b) => b.evolutionScore - a.evolutionScore);
        setTrending(sorted.slice(0, 6));
      } catch {
        setTrending([]);
      } finally {
        setLoading(false);
      }
    };
    load();
  }, []);

  return (
    <div className="max-w-5xl mx-auto space-y-10 pb-12">
      <div className="space-y-1">
        <h1 className="text-3xl font-bold uppercase tracking-widest text-foreground flex items-center gap-3">
          <Compass className="w-8 h-8 text-primary" />
          Discover
        </h1>
        <p className="text-muted-foreground text-sm">Top-scoring sequences from the protocol, ranked by evolution score.</p>
      </div>

      <section>
        <div className="flex items-center gap-2 mb-6 border-b border-border pb-2">
          <TrendingUp className="w-5 h-5 text-secondary" />
          <h2 className="text-xl font-bold uppercase tracking-wider">Top Structures</h2>
          {!loading && (
            <span className="ml-auto text-xs font-mono text-muted-foreground">{trending.length} RESULTS</span>
          )}
        </div>

        {loading ? (
          <div className="flex items-center justify-center py-20 gap-3 text-muted-foreground font-mono text-sm">
            <Loader2 className="w-5 h-5 animate-spin" />
            LOADING FROM NETWORK…
          </div>
        ) : trending.length === 0 ? (
          <div className="text-center py-20 space-y-3">
            <FlaskConical className="w-12 h-12 text-muted-foreground/30 mx-auto" />
            <p className="text-muted-foreground font-mono text-sm">NO PEPTIDES YET. GENERATE SOME IN AI STUDIO.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            {trending.map((p, i) => (
              <Link key={p.id} href={`/app/peptide/${p.id}`}>
              <motion.div
                initial={{ opacity: 0, y: 16 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.07 }}
                className="flex bg-card border border-border rounded-xl overflow-hidden hover:border-secondary/40 transition-colors group cursor-pointer"
                onClick={() => setSelectedPeptide({
                  id: p.id,
                  sequence: p.sequence,
                  affinity: p.affinity,
                  stability: p.stability,
                  novelty: p.novelty,
                  toxicity: p.toxicity,
                  evolutionScore: p.evolutionScore,
                })}
              >
                <div className="w-[120px] shrink-0 border-r border-border bg-black/30 overflow-hidden">
                  <img
                    src={`${BASE_URL}/api/peptides/${p.id}/image`}
                    alt={p.sequence}
                    className="w-full h-full object-cover"
                    loading="lazy"
                    onError={(e) => { (e.currentTarget as HTMLImageElement).style.display = "none"; }}
                  />
                </div>
                <div className="flex-1 p-4 flex flex-col justify-between min-w-0">
                  <div className="flex items-start justify-between gap-2 mb-2">
                    <span className="font-mono text-sm text-secondary font-bold truncate">{p.id}</span>
                    <span className="text-[10px] shrink-0 bg-secondary/10 text-secondary px-2 py-0.5 rounded border border-secondary/20 font-mono">
                      {percentile(p.evolutionScore)}
                    </span>
                  </div>

                  {(p.therapeuticArea || p.ipnftMeta?.therapeuticArea) && (
                    <div className="mb-2">
                      <span className="text-[10px] font-semibold text-primary/80 bg-primary/8 border border-primary/20 px-2 py-0.5 rounded-full">
                        {p.therapeuticArea ?? p.ipnftMeta?.therapeuticArea}
                      </span>
                    </div>
                  )}

                  <div className="font-mono text-xs tracking-widest text-muted-foreground group-hover:text-foreground transition-colors break-all mb-3 leading-relaxed">
                    {p.sequence}
                  </div>

                  {p.mechanism && (
                    <p className="text-[10px] text-muted-foreground/60 leading-snug mb-2 line-clamp-2">{p.mechanism}</p>
                  )}

                  <div className="flex items-center gap-4">
                    <div>
                      <div className="text-[9px] text-muted-foreground uppercase tracking-widest font-mono">Score</div>
                      <div className="font-bold text-foreground text-sm">{p.evolutionScore}</div>
                    </div>
                    <div>
                      <div className="text-[9px] text-muted-foreground uppercase tracking-widest font-mono">Affinity</div>
                      <div className="font-bold text-cyan-400 text-sm">{p.affinity}%</div>
                    </div>
                    <div>
                      <div className="text-[9px] text-muted-foreground uppercase tracking-widest font-mono">Stability</div>
                      <div className="font-bold text-emerald-400 text-sm">{p.stability}%</div>
                    </div>
                    {p.mintAddress && (
                      <div className="ml-auto">
                        <span className="text-[9px] font-mono px-1.5 py-0.5 rounded bg-cyan-400/10 text-cyan-400 border border-cyan-400/20 uppercase tracking-wider">
                          IP-NFT
                        </span>
                      </div>
                    )}
                  </div>

                  {p.ipnftMeta?.therapeuticArea && (
                    <div className="mt-2">
                      <span className="text-[9px] font-mono px-1.5 py-0.5 rounded bg-purple-400/10 text-purple-400 border border-purple-400/20 uppercase tracking-wider">
                        {p.ipnftMeta.therapeuticArea}
                      </span>
                    </div>
                  )}
                </div>
              </motion.div>
              </Link>
            ))}
          </div>
        )}
      </section>

      <section className="bg-primary/5 border border-primary/20 rounded-xl p-8 text-center relative overflow-hidden">
        <div
          className="absolute inset-0 opacity-30 pointer-events-none"
          style={{
            backgroundImage: `url("data:image/svg+xml,%3Csvg width='40' height='40' viewBox='0 0 40 40' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath d='M20 20.5V18H0v-2h20v-2h2v2h20v2H22v2.5h18v2H22v18h-2v-18H0v-2h20z' fill='%2300f5ff' fill-opacity='0.07' fill-rule='evenodd'/%3E%3C/svg%3E")`,
          }}
        />
        <div className="relative z-10">
          <Sparkles className="w-12 h-12 text-primary mx-auto mb-4" />
          <h3 className="text-2xl font-bold uppercase tracking-wider mb-2">Bounty Program</h3>
          <p className="text-muted-foreground max-w-lg mx-auto mb-6 text-sm">
            Help discover novel antimicrobial peptides. The protocol rewards sequences exceeding 95% stability score with $PTMS governance tokens.
          </p>
          <Link href="/app/bounty">
            <button className="bg-primary/10 text-primary border border-primary hover:bg-primary hover:text-primary-foreground transition-colors px-6 py-2 rounded uppercase font-bold tracking-widest text-sm">
              View Active Bounties
            </button>
          </Link>
        </div>
      </section>
    </div>
  );
}
