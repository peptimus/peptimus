import { useState, useEffect, useRef, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Activity, Fingerprint, Cpu, ExternalLink, RefreshCw } from "lucide-react";
import { useAppStore } from "@/store/useAppStore";

const BASE_URL = (import.meta.env.BASE_URL || "/").replace(/\/$/, "");

function timeAgo(dateStr: string): string {
  const secs = Math.floor((Date.now() - new Date(dateStr).getTime()) / 1000);
  if (secs < 60) return `${secs}s ago`;
  if (secs < 3600) return `${Math.floor(secs / 60)}m ago`;
  if (secs < 86400) return `${Math.floor(secs / 3600)}h ago`;
  return `${Math.floor(secs / 86400)}d ago`;
}

function walletShort(w: string | null): string {
  if (!w) return "@anonymous";
  return `@${w.slice(0, 4)}...${w.slice(-4)}`;
}

function scoreColor(score: number): string {
  if (score >= 90) return "#00ff9f";
  if (score >= 80) return "#00f5ff";
  if (score >= 70) return "#8b5cf6";
  return "#60a5fa";
}

interface DBPeptide {
  id: string;
  sequence: string;
  seedSequence: string;
  evolutionScore: number;
  affinity: number;
  stability: number;
  creatorWallet: string | null;
  mintAddress: string | null;
  therapeuticArea: string | null;
  mechanism: string | null;
  createdAt: string;
}

export function ResearchFeedPage() {
  const { setSelectedPeptide } = useAppStore();
  const [items, setItems] = useState<DBPeptide[]>([]);
  const [loading, setLoading] = useState(true);
  const [lastUpdated, setLastUpdated] = useState<Date | null>(null);
  const [liveCount, setLiveCount] = useState(0);
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);

  const fetchFeed = async (silent = false) => {
    if (!silent) setLoading(true);
    try {
      const res = await fetch(`${BASE_URL}/api/feed`);
      const data: DBPeptide[] = await res.json();
      setItems((prev) => {
        const newItems = Array.isArray(data) ? data : [];
        const added = newItems.length - prev.length;
        if (added > 0 && prev.length > 0) setLiveCount((c) => c + added);
        return newItems;
      });
      setLastUpdated(new Date());
    } catch {
      // silent fail
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchFeed();
    intervalRef.current = setInterval(() => fetchFeed(true), 10_000);
    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current);
    };
  }, []);

  const nftMap = useMemo(() => {
    const map = new Map<string, string>();
    for (const item of items) {
      if (item.creatorWallet && item.mintAddress && !map.has(item.creatorWallet)) {
        map.set(item.creatorWallet, item.id);
      }
    }
    return map;
  }, [items]);

  return (
    <div className="max-w-3xl mx-auto space-y-6 pb-12">
      <div className="space-y-1">
        <h1 className="text-3xl font-bold uppercase tracking-widest text-foreground flex items-center gap-3">
          <Activity className="w-7 h-7 text-primary" />
          Real-time Research Feed
        </h1>
        <p className="text-muted-foreground text-sm">
          Live AI evolution events from all researchers on the protocol. DB-backed, polling every 10s.
        </p>
      </div>

      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2 text-xs font-mono text-secondary uppercase tracking-widest">
          <div className="w-2 h-2 rounded-full bg-secondary animate-pulse shadow-[0_0_6px_hsl(var(--secondary))]" />
          {loading ? "Syncing..." : `Live · ${items.length} events`}
          {liveCount > 0 && (
            <span className="ml-1 bg-primary/20 text-primary px-2 py-0.5 rounded-full text-[9px] font-bold">
              +{liveCount} NEW
            </span>
          )}
        </div>
        <button
          onClick={() => fetchFeed()}
          className="flex items-center gap-1.5 text-xs text-muted-foreground hover:text-foreground transition-colors font-mono"
        >
          <RefreshCw className="w-3 h-3" />
          {lastUpdated ? timeAgo(lastUpdated.toISOString()) : "syncing"}
        </button>
      </div>

      {loading && items.length === 0 ? (
        <div className="space-y-2">
          {Array.from({ length: 6 }).map((_, i) => (
            <div key={i} className="bg-card/40 border border-border/30 rounded-xl px-5 py-4 h-16 animate-pulse" />
          ))}
        </div>
      ) : items.length === 0 ? (
        <div className="text-center py-20 text-muted-foreground font-mono text-sm">
          NO EVENTS YET. GENERATE PEPTIDES IN AI STUDIO TO SEE THEM HERE.
        </div>
      ) : (
        <div className="space-y-2">
          <AnimatePresence initial={false}>
            {items.map((item, idx) => {
              const isMinted = !!item.mintAddress;
              const color = scoreColor(item.evolutionScore);
              const researcher = walletShort(item.creatorWallet);
              const Icon = isMinted ? Fingerprint : Cpu;
              const avatarNftId = item.creatorWallet ? nftMap.get(item.creatorWallet) : undefined;

              return (
                <motion.div
                  key={item.id}
                  initial={{ opacity: 0, y: -10, height: 0 }}
                  animate={{ opacity: 1, y: 0, height: "auto" }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 0.25, ease: "easeOut", delay: idx < 3 ? idx * 0.04 : 0 }}
                  className="bg-card/60 border border-border/50 rounded-xl px-5 py-4 flex items-center gap-4 hover:border-primary/20 transition-colors group cursor-pointer"
                  onClick={() => setSelectedPeptide({
                    id: item.id,
                    sequence: item.sequence,
                    affinity: item.affinity,
                    stability: item.stability,
                    novelty: 0,
                    toxicity: 0,
                    evolutionScore: item.evolutionScore,
                  })}
                >
                  <div
                    className="w-10 h-10 rounded-full flex-shrink-0 border overflow-hidden"
                    style={{ borderColor: `${color}40` }}
                  >
                    {avatarNftId ? (
                      <img
                        src={`${BASE_URL}/api/peptides/${avatarNftId}/image`}
                        alt="avatar"
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <div
                        className="w-full h-full flex items-center justify-center text-xs font-bold font-mono"
                        style={{ background: `${color}12`, color }}
                      >
                        {researcher.slice(1, 3).toUpperCase()}
                      </div>
                    )}
                  </div>

                  <div className="flex-1 min-w-0">
                    <p className="text-sm leading-snug">
                      <span className="font-semibold text-foreground">{researcher}</span>{" "}
                      <span className="text-muted-foreground">
                        {isMinted ? "minted IP-NFT for" : "designed"}
                      </span>{" "}
                      {item.therapeuticArea ? (
                        <span className="font-semibold text-primary/90">{item.therapeuticArea} candidate</span>
                      ) : (
                        <span className="font-mono font-bold text-xs" style={{ color }}>
                          {item.sequence.slice(0, 10)}…
                        </span>
                      )}
                    </p>
                    {item.mechanism && (
                      <p className="text-[10px] text-muted-foreground/60 leading-snug mt-0.5 line-clamp-1">
                        {item.mechanism}
                      </p>
                    )}
                    <div className="flex items-center gap-3 mt-1">
                      <span className="text-[10px] text-muted-foreground/60 font-mono">{timeAgo(item.createdAt)}</span>
                      <span className="text-[10px] font-mono" style={{ color }}>
                        SCORE {item.evolutionScore}
                      </span>
                      {isMinted && (
                        <span className="text-[10px] text-emerald-400 font-mono flex items-center gap-0.5">
                          <Fingerprint className="w-2.5 h-2.5" /> ON-CHAIN
                        </span>
                      )}
                    </div>
                  </div>

                  <div className="flex items-center gap-2 flex-shrink-0">
                    {isMinted && item.mintAddress && (
                      <a
                        href={`https://explorer.solana.com/address/${item.mintAddress}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="p-1.5 rounded-lg text-muted-foreground hover:text-primary transition-colors"
                        title="View on Solana Explorer"
                        onClick={(e) => e.stopPropagation()}
                      >
                        <ExternalLink className="w-3.5 h-3.5" />
                      </a>
                    )}
                    <div
                      className="p-2 rounded-lg opacity-40 group-hover:opacity-100 transition-opacity"
                      style={{ background: `${color}10` }}
                    >
                      <Icon className="w-4 h-4" style={{ color }} />
                    </div>
                  </div>
                </motion.div>
              );
            })}
          </AnimatePresence>
        </div>
      )}
    </div>
  );
}
