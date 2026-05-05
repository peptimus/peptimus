import { motion } from "framer-motion";
import { Sparkles, Trophy, Target, FlaskConical, Zap, Clock, CheckCircle2, Info, AlertCircle } from "lucide-react";
import { Link } from "wouter";

const TOTAL_BOUNTY_POOL = 20_000_000;

const TIERS = [
  { name: "Grand Bounty", color: "text-yellow-400 bg-yellow-950/40 border-yellow-500/30", perBounty: 2_000_000, pool: 12_000_000, count: 6, Icon: Trophy },
  { name: "Regular Bounty", color: "text-primary bg-primary/10 border-primary/30", perBounty: 100_000, pool: 5_000_000, count: 50, Icon: Target },
  { name: "Micro Challenge", color: "text-purple-400 bg-purple-950/40 border-purple-500/30", perBounty: 10_000, pool: 3_000_000, count: 300, Icon: Zap },
];

function daysFromNow(days: number): string {
  const d = new Date();
  d.setDate(d.getDate() + days);
  return d.toISOString().slice(0, 10);
}

const BOUNTIES = [
  {
    id: "b001",
    tier: "Grand Bounty",
    title: "Ultra-stable Antimicrobial Peptide",
    description: "Design a peptide with ≥95% stability score, ≤5% toxicity, targeting MRSA membrane disruption.",
    reward: 2_000_000,
    difficulty: "Hard",
    difficultyColor: "text-red-400 bg-red-950/40 border-red-500/20",
    area: "Anti-infective",
    areaColor: "text-emerald-400 bg-emerald-950/40 border-emerald-500/20",
    criteria: [
      "Stability score ≥ 95",
      "Toxicity ≤ 5%",
      "Sequence 10–18 residues",
      "Min. 3 cationic residues (K or R)",
      "Binding affinity ≥ 85",
    ],
    deadline: daysFromNow(7),
    submissions: 14,
    featured: true,
  },
  {
    id: "b002",
    tier: "Grand Bounty",
    title: "Blood-Brain Barrier Shuttle",
    description: "Create a cell-penetrating peptide that crosses the BBB with ≥90% novelty index.",
    reward: 2_000_000,
    difficulty: "Expert",
    difficultyColor: "text-purple-400 bg-purple-950/40 border-purple-500/20",
    area: "Neurology",
    areaColor: "text-purple-400 bg-purple-950/40 border-purple-500/20",
    criteria: [
      "Novelty index ≥ 90",
      "Stability ≥ 80",
      "Toxicity ≤ 8%",
      "Cationic + hydrophobic domains",
      "Evolution score ≥ 88",
    ],
    deadline: daysFromNow(14),
    submissions: 7,
    featured: false,
  },
  {
    id: "b003",
    tier: "Regular Bounty",
    title: "GLP-1 Receptor Agonist Lead",
    description: "Generate a peptide agonist for GLP-1R with high affinity and low toxicity for metabolic disease.",
    reward: 100_000,
    difficulty: "Hard",
    difficultyColor: "text-red-400 bg-red-950/40 border-red-500/20",
    area: "Metabolic",
    areaColor: "text-amber-400 bg-amber-950/40 border-amber-500/20",
    criteria: [
      "Binding affinity ≥ 92",
      "Stability ≥ 85",
      "Toxicity ≤ 6%",
      "Alpha-helical structure predicted",
      "Sequence 15–30 residues",
    ],
    deadline: daysFromNow(21),
    submissions: 22,
    featured: false,
  },
  {
    id: "b004",
    tier: "Regular Bounty",
    title: "Rapid Wound Healing Peptide",
    description: "Design a regenerative peptide promoting keratinocyte proliferation with zero cytotoxicity.",
    reward: 100_000,
    difficulty: "Medium",
    difficultyColor: "text-yellow-400 bg-yellow-950/40 border-yellow-500/20",
    area: "Regenerative",
    areaColor: "text-teal-400 bg-teal-950/40 border-teal-500/20",
    criteria: [
      "Toxicity = 0",
      "Stability ≥ 78",
      "Binding affinity ≥ 80",
      "Hydrophilic character",
      "Evolution score ≥ 82",
    ],
    deadline: daysFromNow(28),
    submissions: 31,
    featured: false,
  },
  {
    id: "b005",
    tier: "Grand Bounty",
    title: "Novel Anti-Cancer Scaffold",
    description: "Discover a de novo peptide inducing apoptosis in cancer cells with selectivity over healthy tissue.",
    reward: 2_000_000,
    difficulty: "Expert",
    difficultyColor: "text-purple-400 bg-purple-950/40 border-purple-500/20",
    area: "Oncology",
    areaColor: "text-rose-400 bg-rose-950/40 border-rose-500/20",
    criteria: [
      "Evolution score ≥ 95",
      "Novelty ≥ 92",
      "Toxicity ≤ 15% (cancer-selective)",
      "Mechanism: apoptosis induction",
      "Must be verifiable against known databases",
    ],
    deadline: daysFromNow(14),
    submissions: 5,
    featured: false,
  },
  {
    id: "b006",
    tier: "Grand Bounty",
    title: "Best Peptide of Q2 2026",
    description: "Overall highest evolution score minted as IP-NFT during Q2 2026 wins the grand prize.",
    reward: 2_000_000,
    difficulty: "Open",
    difficultyColor: "text-cyan-400 bg-cyan-950/40 border-cyan-500/20",
    area: "All Areas",
    areaColor: "text-cyan-400 bg-cyan-950/40 border-cyan-500/20",
    criteria: [
      "Must be minted as IP-NFT on Peptimus",
      "Highest evolution score wins",
      "Minimum score 90 to qualify",
      "One entry per wallet",
    ],
    deadline: daysFromNow(28),
    submissions: 89,
    featured: false,
  },
];

function daysLeft(deadline: string) {
  return Math.max(0, Math.ceil((new Date(deadline).getTime() - Date.now()) / 86400000));
}

function fmt(n: number) {
  if (n >= 1_000_000) return `${(n / 1_000_000).toFixed(n % 1_000_000 === 0 ? 0 : 1)}M`;
  if (n >= 1_000) return `${(n / 1_000).toFixed(0)}K`;
  return n.toString();
}

const tierStyle: Record<string, string> = {
  "Grand Bounty": "text-yellow-400 bg-yellow-950/40 border-yellow-500/30",
  "Regular Bounty": "text-primary bg-primary/10 border-primary/30",
  "Micro Challenge": "text-purple-400 bg-purple-950/40 border-purple-500/30",
};

export function BountyPage() {
  const featured = BOUNTIES.find((b) => b.featured)!;
  const rest = BOUNTIES.filter((b) => !b.featured);

  return (
    <div className="max-w-5xl mx-auto space-y-8 pb-16">
      <div className="space-y-1">
        <h1 className="text-3xl font-bold uppercase tracking-widest text-primary flex items-center gap-3">
          <Trophy className="w-8 h-8" />
          Bounty Program
        </h1>
        <p className="text-muted-foreground text-sm">
          Design peptides meeting scientific criteria and earn $PTMS governance tokens for validated discoveries.
        </p>
      </div>

      {/* Tokenomics Banner */}
      <div className="bg-muted/20 border border-border rounded-2xl p-5">
        <div className="flex items-center gap-2 mb-4">
          <Info className="w-4 h-4 text-primary" />
          <span className="text-xs font-bold uppercase tracking-widest text-muted-foreground">Bounty Pool Allocation: {fmt(TOTAL_BOUNTY_POOL)} $PTMS</span>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          {TIERS.map((t) => (
            <div key={t.name} className={`rounded-xl p-4 border ${t.color}`}>
              <div className="mb-2"><t.Icon className="w-5 h-5" /></div>
              <div className="text-sm font-bold text-foreground mb-0.5">{t.name}</div>
              <div className={`text-xl font-bold font-mono ${t.color.split(" ")[0]}`}>{fmt(t.perBounty)} <span className="text-sm">PTMS</span></div>
              <div className="text-[10px] font-mono text-muted-foreground mt-1">
                {t.count} bounties/yr · {fmt(t.pool)} pool
              </div>
              <div className="mt-2 h-1 w-full bg-muted/50 rounded-full overflow-hidden">
                <div className="h-full rounded-full bg-current opacity-40" style={{ width: `${(t.pool / TOTAL_BOUNTY_POOL) * 100}%` }} />
              </div>
              <div className="text-[9px] font-mono text-muted-foreground mt-1">{Math.round((t.pool / TOTAL_BOUNTY_POOL) * 100)}% of pool</div>
            </div>
          ))}
        </div>
      </div>

      {/* Featured Bounty */}
      <motion.div
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        className="relative bg-gradient-to-br from-primary/10 via-card to-card border border-primary/30 rounded-2xl overflow-hidden p-6 shadow-[0_0_30px_hsl(var(--primary)/0.1)]"
      >
        <div className="absolute top-0 right-0 w-64 h-64 bg-primary/5 rounded-full -translate-y-1/2 translate-x-1/2 pointer-events-none" />
        <div className="hidden sm:flex items-center gap-2 absolute top-4 right-4">
          <span className="text-[10px] font-mono font-bold px-3 py-1 rounded-full bg-yellow-500/20 border border-yellow-500/40 text-yellow-400 uppercase tracking-widest">🏆 Grand</span>
          <span className="text-[10px] font-mono font-bold px-3 py-1 rounded-full bg-primary/20 border border-primary/40 text-primary uppercase tracking-widest">Featured</span>
        </div>

        <div className="flex items-start gap-4">
          <div className="w-12 h-12 rounded-xl bg-primary/15 border border-primary/30 flex items-center justify-center shrink-0">
            <Sparkles className="w-6 h-6 text-primary" />
          </div>
          <div className="flex-1 min-w-0">
            <div className="flex flex-wrap items-center gap-2 mb-2 sm:hidden">
              <span className="text-[10px] font-mono font-bold px-2.5 py-0.5 rounded-full bg-yellow-500/20 border border-yellow-500/40 text-yellow-400 uppercase tracking-widest">🏆 Grand</span>
              <span className="text-[10px] font-mono font-bold px-2.5 py-0.5 rounded-full bg-primary/20 border border-primary/40 text-primary uppercase tracking-widest">Featured</span>
            </div>
            <h2 className="text-xl font-bold text-foreground mb-1">{featured.title}</h2>
            <p className="text-muted-foreground text-sm mb-4">{featured.description}</p>

            <div className="flex flex-wrap gap-2 mb-5">
              <span className={`text-[10px] font-mono font-bold px-2.5 py-1 rounded-full border uppercase tracking-wider ${featured.difficultyColor}`}>{featured.difficulty}</span>
              <span className={`text-[10px] font-mono font-bold px-2.5 py-1 rounded-full border uppercase tracking-wider ${featured.areaColor}`}>{featured.area}</span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 mb-5">
              {featured.criteria.map((c) => (
                <div key={c} className="flex items-center gap-2 text-xs text-muted-foreground">
                  <CheckCircle2 className="w-3.5 h-3.5 text-primary shrink-0" />
                  {c}
                </div>
              ))}
            </div>

            <div className="flex flex-wrap items-center justify-between gap-4">
              <div className="flex items-center gap-6">
                <div>
                  <div className="text-[10px] font-mono text-muted-foreground uppercase tracking-wider mb-0.5">Reward</div>
                  <div className="text-2xl font-bold text-yellow-400">{fmt(featured.reward)} <span className="text-sm text-yellow-400/70">PTMS</span></div>
                </div>
                <div>
                  <div className="text-[10px] font-mono text-muted-foreground uppercase tracking-wider mb-0.5">Submissions</div>
                  <div className="text-2xl font-bold text-foreground">{featured.submissions}</div>
                </div>
                <div>
                  <div className="text-[10px] font-mono text-muted-foreground uppercase tracking-wider mb-0.5">Deadline</div>
                  <div className="text-sm font-bold text-orange-400 flex items-center gap-1.5">
                    <Clock className="w-3.5 h-3.5" />
                    {daysLeft(featured.deadline)}d left
                  </div>
                </div>
              </div>
              <Link href="/app/studio">
                <div className="flex items-center gap-2 bg-primary text-primary-foreground hover:bg-primary/90 font-bold uppercase tracking-wider text-xs px-5 py-2.5 rounded-xl cursor-pointer transition-all shadow-[0_0_15px_hsl(var(--primary)/0.3)]">
                  <FlaskConical className="w-4 h-4" />
                  Design Now
                </div>
              </Link>
            </div>
          </div>
        </div>
      </motion.div>

      {/* Active Bounties Grid */}
      <div>
        <h2 className="text-sm font-bold uppercase tracking-widest text-muted-foreground mb-4 border-b border-border pb-3">Active Bounties</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {rest.map((bounty, i) => (
            <motion.div
              key={bounty.id}
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.07 }}
              className="bg-card border border-border rounded-2xl p-5 hover:border-primary/30 transition-all flex flex-col gap-4"
            >
              <div className="flex items-start justify-between gap-2">
                <div>
                  <div className="flex items-center gap-2 mb-1">
                    <span className={`text-[9px] font-mono font-bold px-2 py-0.5 rounded-full border uppercase tracking-wider ${tierStyle[bounty.tier] ?? "text-muted-foreground border-border"}`}>{bounty.tier}</span>
                  </div>
                  <h3 className="font-bold text-foreground text-sm">{bounty.title}</h3>
                  <p className="text-muted-foreground text-xs leading-relaxed mt-0.5">{bounty.description}</p>
                </div>
              </div>

              <div className="flex flex-wrap gap-1.5">
                <span className={`text-[9px] font-mono font-bold px-2 py-0.5 rounded-full border uppercase tracking-wider ${bounty.difficultyColor}`}>{bounty.difficulty}</span>
                <span className={`text-[9px] font-mono font-bold px-2 py-0.5 rounded-full border uppercase tracking-wider ${bounty.areaColor}`}>{bounty.area}</span>
              </div>

              <div className="space-y-1.5">
                {bounty.criteria.slice(0, 3).map((c) => (
                  <div key={c} className="flex items-center gap-1.5 text-[11px] text-muted-foreground">
                    <Target className="w-3 h-3 text-primary/60 shrink-0" />
                    {c}
                  </div>
                ))}
                {bounty.criteria.length > 3 && (
                  <div className="text-[11px] text-muted-foreground/50 font-mono pl-4">+{bounty.criteria.length - 3} more</div>
                )}
              </div>

              <div className="flex items-center justify-between pt-3 border-t border-border/50 mt-auto">
                <div className="flex items-center gap-4">
                  <div>
                    <div className="text-[9px] font-mono text-muted-foreground uppercase tracking-wider">Reward</div>
                    <div className={`text-base font-bold font-mono ${bounty.tier === "Grand Bounty" ? "text-yellow-400" : "text-primary"}`}>
                      {fmt(bounty.reward)} <span className="text-xs opacity-70">PTMS</span>
                    </div>
                  </div>
                  <div>
                    <div className="text-[9px] font-mono text-muted-foreground uppercase tracking-wider">Deadline</div>
                    <div className="text-xs font-bold text-orange-400 flex items-center gap-1">
                      <Clock className="w-2.5 h-2.5" />{daysLeft(bounty.deadline)}d
                    </div>
                  </div>
                  <div>
                    <div className="text-[9px] font-mono text-muted-foreground uppercase tracking-wider">Entries</div>
                    <div className="text-xs font-bold text-foreground">{bounty.submissions}</div>
                  </div>
                </div>
                <Link href="/app/studio">
                  <div className="flex items-center gap-1.5 text-[10px] font-bold uppercase tracking-wider text-primary hover:text-primary/80 border border-primary/30 hover:border-primary/60 px-3 py-1.5 rounded-lg cursor-pointer transition-all">
                    <Zap className="w-3 h-3" /> Enter
                  </div>
                </Link>
              </div>
            </motion.div>
          ))}
        </div>
      </div>

      {/* How It Works */}
      <div className="bg-card border border-border rounded-2xl p-6 space-y-4">
        <div className="text-xs font-mono text-muted-foreground uppercase tracking-widest">How Bounties Work</div>
        <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
          {[
            { step: "01", title: "Browse", desc: "Find a challenge that matches your research interests and check the criteria" },
            { step: "02", title: "Design", desc: "Use AI Studio to generate peptides meeting the specific score thresholds" },
            { step: "03", title: "Mint IP-NFT", desc: "Register your top sequence on-chain. This is your official bounty submission." },
            { step: "04", title: "Win PTMS", desc: "At deadline, highest qualifying evolution score wins. $PTMS auto-sent to your wallet" },
          ].map((s) => (
            <div key={s.step} className="space-y-1.5 p-4 bg-muted/20 rounded-xl border border-border/50">
              <div className="text-2xl font-mono font-bold text-primary/30">{s.step}</div>
              <div className="text-sm font-bold text-foreground">{s.title}</div>
              <div className="text-xs text-muted-foreground leading-relaxed">{s.desc}</div>
            </div>
          ))}
        </div>
        <div className="text-[10px] font-mono text-muted-foreground/60 border-t border-border pt-3">
          Winner = highest evolution score among all qualifying IP-NFT mints before deadline. Tie-breaker: earliest mint timestamp. $PTMS distribution pending mainnet token deployment.
        </div>
      </div>
    </div>
  );
}
