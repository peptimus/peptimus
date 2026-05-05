import { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Activity, Beaker, Users, Database, FlaskConical, Fingerprint, ExternalLink } from "lucide-react";
import { formatDistanceToNow } from "date-fns";

const BASE_URL = (import.meta.env.BASE_URL || "/").replace(/\/$/, "");

interface Stats {
  peptidesGenerated: number;
  contributors: number;
  ipnftsMinted: number;
  topScore: number;
  modelsRunning: boolean;
}

interface FeedItem {
  id: string;
  sequence: string;
  seedSequence: string;
  evolutionScore: number;
  affinity: number;
  creatorWallet: string | null;
  mintAddress: string | null;
  createdAt: string;
}

function AnimatedNumber({ value }: { value: number }) {
  const [display, setDisplay] = useState(0);
  const prev = useRef(0);

  useEffect(() => {
    const start = prev.current;
    const end = value;
    if (start === end) return;
    const duration = 800;
    const startTime = performance.now();
    const tick = (now: number) => {
      const t = Math.min((now - startTime) / duration, 1);
      const eased = 1 - Math.pow(1 - t, 3);
      setDisplay(Math.round(start + (end - start) * eased));
      if (t < 1) requestAnimationFrame(tick);
      else prev.current = end;
    };
    requestAnimationFrame(tick);
  }, [value]);

  return <span className="font-mono tabular-nums">{display.toLocaleString()}</span>;
}

function walletLabel(wallet: string | null) {
  if (!wallet) return "Anonymous";
  return `${wallet.slice(0, 4)}…${wallet.slice(-4)}`;
}

function actionLabel(item: FeedItem) {
  if (item.mintAddress) return "minted IP-NFT for";
  return "evolved";
}

export function DashboardPage() {
  const [stats, setStats] = useState<Stats | null>(null);
  const [feed, setFeed] = useState<FeedItem[]>([]);
  const [prevFeedIds, setPrevFeedIds] = useState<Set<string>>(new Set());

  const fetchStats = async () => {
    try {
      const res = await fetch(`${BASE_URL}/api/stats`);
      if (res.ok) setStats(await res.json());
    } catch {}
  };

  const fetchFeed = async () => {
    try {
      const res = await fetch(`${BASE_URL}/api/feed`);
      if (!res.ok) return;
      const data: FeedItem[] = await res.json();
      setFeed((prev) => {
        const existingIds = new Set(prev.map((i) => i.id));
        setPrevFeedIds(existingIds);
        return data;
      });
    } catch {}
  };

  useEffect(() => {
    fetchStats();
    fetchFeed();
    const si = setInterval(fetchStats, 30_000);
    const fi = setInterval(fetchFeed, 10_000);
    return () => { clearInterval(si); clearInterval(fi); };
  }, []);

  return (
    <div className="max-w-6xl mx-auto space-y-8 pb-12">
      <div className="space-y-1">
        <h1 className="text-3xl font-bold uppercase tracking-widest text-foreground flex items-center gap-3">
          <Activity className="w-8 h-8 text-primary" />
          Global Network Status
        </h1>
        <p className="text-muted-foreground text-sm">Live telemetry from the decentralized research protocol.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <StatCard
          icon={<Database className="w-32 h-32" />}
          label="Peptides Generated"
          value={stats?.peptidesGenerated ?? null}
          color="text-primary"
        />
        <StatCard
          icon={<Beaker className="w-32 h-32" />}
          label="Active Researchers"
          value={stats?.contributors ?? null}
          color="text-secondary"
        />
        <StatCard
          icon={<Activity className="w-32 h-32" />}
          label="AI Model Status"
          value={null}
          color="text-accent"
          badge={stats?.modelsRunning ? "Online" : "Offline"}
          badgeColor={stats?.modelsRunning ? "text-emerald-400 bg-emerald-950/40 border-emerald-500/30" : "text-red-400 bg-red-950/40 border-red-500/30"}
        />
      </div>

      <div className="bg-card border border-border rounded-xl overflow-hidden flex flex-col" style={{ height: 500 }}>
        <div className="px-5 py-4 border-b border-border bg-muted/30 flex items-center gap-3">
          <div className="w-2 h-2 rounded-full bg-primary animate-pulse shadow-[0_0_6px_hsl(var(--primary))]" />
          <h2 className="font-bold uppercase tracking-widest text-sm">Live Research Feed</h2>
          <div className="ml-auto flex items-center gap-2">
            <Users className="w-3.5 h-3.5 text-muted-foreground" />
            <span className="text-xs font-mono text-muted-foreground">{feed.length} EVENTS</span>
          </div>
        </div>

        <div className="flex-1 overflow-y-auto divide-y divide-border/40">
          <AnimatePresence initial={false}>
            {feed.length === 0 ? (
              <div className="flex items-center justify-center h-full text-muted-foreground font-mono text-sm">
                Waiting for research events…
              </div>
            ) : (
              feed.map((item) => {
                const isNew = !prevFeedIds.has(item.id);
                return (
                  <motion.div
                    key={item.id}
                    initial={isNew ? { opacity: 0, y: -8 } : false}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.35 }}
                    className="flex items-center gap-4 px-5 py-3 hover:bg-muted/30 transition-colors group"
                  >
                    <div className="w-9 h-9 rounded-full bg-input border border-border flex items-center justify-center shrink-0">
                      {item.mintAddress
                        ? <Fingerprint className="w-4 h-4 text-cyan-400" />
                        : <FlaskConical className="w-4 h-4 text-primary" />}
                    </div>

                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 flex-wrap">
                        <span className="font-mono text-xs font-bold text-foreground">
                          {walletLabel(item.creatorWallet)}
                        </span>
                        <span className="text-xs text-muted-foreground">{actionLabel(item)}</span>
                        <span className="font-mono text-xs text-primary tracking-wider truncate max-w-[120px]">
                          {item.sequence.slice(0, 8)}…
                        </span>
                        <span className="text-[10px] font-mono text-muted-foreground/60 bg-muted px-1.5 py-0.5 rounded">
                          score {item.evolutionScore}
                        </span>
                      </div>
                      <div className="text-[10px] text-muted-foreground mt-0.5 font-mono">
                        {formatDistanceToNow(new Date(item.createdAt), { addSuffix: true })}
                      </div>
                    </div>

                    {item.mintAddress && (
                      <a
                        href={`https://explorer.solana.com/address/${item.mintAddress}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="opacity-0 group-hover:opacity-100 transition-opacity shrink-0"
                        title="View on Solana Explorer"
                      >
                        <ExternalLink className="w-3.5 h-3.5 text-muted-foreground hover:text-primary" />
                      </a>
                    )}
                  </motion.div>
                );
              })
            )}
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
}

function StatCard({
  icon, label, value, color, badge, badgeColor,
}: {
  icon: React.ReactNode;
  label: string;
  value: number | null;
  color: string;
  badge?: string;
  badgeColor?: string;
}) {
  return (
    <div className="bg-card border border-border p-6 rounded-xl relative overflow-hidden">
      <div className="absolute -right-4 -top-4 opacity-[0.04] pointer-events-none">{icon}</div>
      <h3 className="text-xs font-mono text-muted-foreground uppercase tracking-widest mb-3">{label}</h3>
      {badge ? (
        <div className={`inline-flex items-center gap-2 px-3 py-1.5 rounded-full border text-sm font-bold font-mono ${badgeColor}`}>
          <span className="w-1.5 h-1.5 rounded-full bg-current animate-pulse" />
          {badge}
        </div>
      ) : (
        <div className={`text-4xl font-bold ${color}`}>
          {value === null
            ? <span className="text-2xl text-muted-foreground/40 animate-pulse">...</span>
            : <AnimatedNumber value={value} />}
        </div>
      )}
    </div>
  );
}
