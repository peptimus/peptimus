import { useState, useEffect } from "react";
import { Users, FlaskConical, Fingerprint, Loader2, TrendingUp, ExternalLink } from "lucide-react";
import { motion } from "framer-motion";
import { formatDistanceToNow } from "date-fns";

const BASE_URL = (import.meta.env.BASE_URL || "/").replace(/\/$/, "");

interface DBPeptide {
  id: string;
  sequence: string;
  evolutionScore: number;
  affinity: number;
  stability: number;
  creatorWallet: string | null;
  mintAddress: string | null;
  ipnftMeta: { therapeuticArea?: string } | null;
  createdAt: string;
}

interface Contributor {
  wallet: string;
  peptideCount: number;
  mintCount: number;
  topScore: number;
  nftId: string | null;
}

interface SiteStats {
  peptidesGenerated: number;
  ipnftsMinted: number;
  contributors: number;
  topScore: number;
}

function walletShort(w: string) {
  return `${w.slice(0, 6)}…${w.slice(-4)}`;
}

export function CommunityPage() {
  const [peptides, setPeptides] = useState<DBPeptide[]>([]);
  const [stats, setStats] = useState<SiteStats | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const load = async () => {
      try {
        const [pepRes, statsRes] = await Promise.all([
          fetch(`${BASE_URL}/api/peptides`),
          fetch(`${BASE_URL}/api/stats`),
        ]);
        if (pepRes.ok) setPeptides(await pepRes.json());
        if (statsRes.ok) setStats(await statsRes.json());
      } catch {}
      setLoading(false);
    };
    load();
  }, []);

  const walletPeptides = peptides.filter((p) => p.creatorWallet);
  const byWallet = walletPeptides.reduce<Record<string, DBPeptide[]>>((acc, p) => {
    const w = p.creatorWallet!;
    acc[w] = acc[w] ? [...acc[w], p] : [p];
    return acc;
  }, {});

  const contributors: Contributor[] = Object.entries(byWallet)
    .map(([wallet, items]) => {
      const firstMinted = items.find((i) => i.mintAddress);
      return {
        wallet,
        peptideCount: items.length,
        mintCount: items.filter((i) => i.mintAddress).length,
        topScore: Math.max(...items.map((i) => i.evolutionScore)),
        nftId: firstMinted?.id ?? null,
      };
    })
    .sort((a, b) => b.mintCount - a.mintCount || b.topScore - a.topScore)
    .slice(0, 10);

  const recentActivity = [...peptides]
    .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
    .slice(0, 8);

  return (
    <div className="max-w-5xl mx-auto space-y-8 pb-12">
      <div className="space-y-1">
        <h1 className="text-3xl font-bold uppercase tracking-widest text-foreground flex items-center gap-3">
          <Users className="w-8 h-8 text-primary" />
          Researcher Hub
        </h1>
        <p className="text-muted-foreground text-sm">Decentralized research community on Peptimus Protocol.</p>
      </div>

      {loading ? (
        <div className="flex items-center justify-center py-24 gap-3 text-muted-foreground font-mono text-sm">
          <Loader2 className="w-5 h-5 animate-spin" />
          LOADING COMMUNITY DATA…
        </div>
      ) : (
        <>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {[
              { label: "Peptides", value: stats?.peptidesGenerated ?? 0, color: "text-primary", icon: <FlaskConical className="w-5 h-5" /> },
              { label: "IP-NFTs Minted", value: stats?.ipnftsMinted ?? 0, color: "text-cyan-400", icon: <Fingerprint className="w-5 h-5" /> },
              { label: "Contributors", value: stats?.contributors ?? 0, color: "text-secondary", icon: <Users className="w-5 h-5" /> },
              { label: "Top Score", value: stats?.topScore ?? 0, color: "text-accent", icon: <TrendingUp className="w-5 h-5" /> },
            ].map(({ label, value, color, icon }) => (
              <motion.div
                key={label}
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                className="bg-card border border-border rounded-xl p-5 text-center space-y-2"
              >
                <div className={`flex justify-center ${color} opacity-60`}>{icon}</div>
                <div className={`text-3xl font-bold font-mono ${color}`}>{value}</div>
                <div className="text-[10px] font-mono text-muted-foreground uppercase tracking-widest">{label}</div>
              </motion.div>
            ))}
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <div className="bg-card border border-border rounded-xl overflow-hidden">
              <div className="px-5 py-4 border-b border-border bg-muted/20">
                <h2 className="text-sm font-bold uppercase tracking-widest flex items-center gap-2">
                  <TrendingUp className="w-4 h-4 text-secondary" /> Top Contributors
                </h2>
              </div>
              <div className="divide-y divide-border/40">
                {contributors.length === 0 ? (
                  <div className="py-10 text-center text-muted-foreground font-mono text-xs">
                    Connect a wallet and generate peptides to appear here.
                  </div>
                ) : (
                  contributors.map((c, i) => (
                    <motion.div
                      key={c.wallet}
                      initial={{ opacity: 0, x: -10 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: i * 0.04 }}
                      className="flex items-center gap-3 px-5 py-3 hover:bg-muted/20 transition-colors"
                    >
                      <div className="w-7 h-7 rounded-full bg-primary/10 border border-primary/20 flex items-center justify-center text-[10px] font-bold text-primary font-mono shrink-0">
                        {i + 1}
                      </div>
                      <div className="w-9 h-9 rounded-full overflow-hidden border border-border/50 shrink-0">
                        {c.nftId ? (
                          <img
                            src={`${BASE_URL}/api/peptides/${c.nftId}/image`}
                            alt="nft"
                            className="w-full h-full object-cover"
                          />
                        ) : (
                          <div className="w-full h-full bg-muted/40 flex items-center justify-center text-[9px] font-mono text-muted-foreground">
                            {c.wallet.slice(0, 2).toUpperCase()}
                          </div>
                        )}
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="font-mono text-xs font-bold text-foreground truncate">{walletShort(c.wallet)}</div>
                        <div className="text-[10px] font-mono text-muted-foreground mt-0.5">
                          {c.peptideCount} peptide{c.peptideCount !== 1 ? "s" : ""}
                          {c.mintCount > 0 && ` · ${c.mintCount} IP-NFT`}
                        </div>
                      </div>
                      <div className="text-right shrink-0">
                        <div className="text-[10px] font-mono text-muted-foreground uppercase tracking-wider">Top Score</div>
                        <div className="text-sm font-bold text-cyan-400 font-mono">{c.topScore}</div>
                      </div>
                    </motion.div>
                  ))
                )}
              </div>
            </div>

            <div className="bg-card border border-border rounded-xl overflow-hidden">
              <div className="px-5 py-4 border-b border-border bg-muted/20">
                <h2 className="text-sm font-bold uppercase tracking-widest flex items-center gap-2">
                  <FlaskConical className="w-4 h-4 text-primary" /> Recent Activity
                </h2>
              </div>
              <div className="divide-y divide-border/40">
                {recentActivity.length === 0 ? (
                  <div className="py-10 text-center text-muted-foreground font-mono text-xs">
                    No activity yet. Generate peptides in AI Studio.
                  </div>
                ) : (
                  recentActivity.map((p, i) => (
                    <motion.div
                      key={p.id}
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      transition={{ delay: i * 0.04 }}
                      className="flex items-center gap-3 px-5 py-3 hover:bg-muted/20 transition-colors group"
                    >
                      <div className="w-8 h-8 rounded-full overflow-hidden border border-border shrink-0">
                        {p.mintAddress ? (
                          <img
                            src={`${BASE_URL}/api/peptides/${p.id}/image`}
                            alt="nft"
                            className="w-full h-full object-cover"
                          />
                        ) : (
                          <div className="w-full h-full bg-input flex items-center justify-center">
                            <FlaskConical className="w-3.5 h-3.5 text-primary" />
                          </div>
                        )}
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2">
                          <span className="font-mono text-xs text-primary truncate">{p.sequence.slice(0, 10)}…</span>
                          {p.ipnftMeta?.therapeuticArea && (
                            <span className="text-[9px] font-mono px-1 py-0.5 rounded bg-purple-400/10 text-purple-400 border border-purple-400/20 uppercase shrink-0">
                              {p.ipnftMeta.therapeuticArea.split("/")[0].trim()}
                            </span>
                          )}
                        </div>
                        <div className="text-[10px] font-mono text-muted-foreground mt-0.5">
                          {formatDistanceToNow(new Date(p.createdAt), { addSuffix: true })}
                          {p.creatorWallet && ` · ${walletShort(p.creatorWallet)}`}
                        </div>
                      </div>
                      <div className="text-right shrink-0">
                        <div className="text-xs font-bold font-mono text-foreground">{p.evolutionScore}</div>
                        {p.mintAddress && (
                          <a
                            href={`https://explorer.solana.com/address/${p.mintAddress}`}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="opacity-0 group-hover:opacity-100 transition-opacity inline-block mt-0.5"
                          >
                            <ExternalLink className="w-3 h-3 text-muted-foreground hover:text-primary" />
                          </a>
                        )}
                      </div>
                    </motion.div>
                  ))
                )}
              </div>
            </div>
          </div>

          <div className="bg-primary/5 border border-primary/20 rounded-xl p-6 text-center">
            <Users className="w-8 h-8 text-primary mx-auto mb-3 opacity-60" />
            <h3 className="text-lg font-bold uppercase tracking-wider mb-2">Research DAO</h3>
            <p className="text-muted-foreground text-sm max-w-md mx-auto">
              Decentralized governance for the Peptimus Protocol is in development. IP-NFT holders will be able to vote on protocol upgrades, pool resources, and fund synthesis.
            </p>
          </div>
        </>
      )}
    </div>
  );
}
