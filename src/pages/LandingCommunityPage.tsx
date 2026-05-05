import { motion } from "framer-motion";
import { Users, Trophy, Coins, Vote, Target, Zap, BookOpen, FlaskConical, Star, Microscope, Dna, Award, BarChart2 } from "lucide-react";
import { useState, useEffect } from "react";
import { LandingHeader } from "@/components/landing/LandingHeader";
import { LandingFooter } from "@/components/landing/LandingFooter";
import { Link } from "wouter";

const BASE_URL = (import.meta.env.BASE_URL || "/").replace(/\/$/, "");

function fadeUp(delay = 0) {
  return { initial: { opacity: 0, y: 28 }, whileInView: { opacity: 1, y: 0 }, viewport: { once: true }, transition: { duration: 0.6, delay } };
}

interface SiteStats { peptidesGenerated: number; ipnftsMinted: number; contributors: number; topScore: number; }

const TIERS = [
  {
    name: "Initiate",
    color: "#60a5fa",
    req: "0 to 4 peptides generated",
    perks: ["Access to AI Design Studio", "Research Feed read access", "Public profile page", "Peptide library browsing"],
    Icon: Microscope,
  },
  {
    name: "Researcher",
    color: "#00f5ff",
    req: "5 to 19 peptides generated",
    perks: ["All Initiate perks", "Appear on leaderboard", "Peptide comparison tool", "Sequence export (CSV)"],
    Icon: Dna,
  },
  {
    name: "Scientist",
    color: "#00ff9f",
    req: "20 to 49 peptides or 5 IP-NFTs",
    perks: ["All Researcher perks", "Bounty submission access", "Research pool creation (planned)", "Community voting weight x2"],
    Icon: FlaskConical,
  },
  {
    name: "Principal Investigator",
    color: "#8b5cf6",
    req: "50+ peptides and 20+ IP-NFTs",
    perks: ["All Scientist perks", "Protocol governance voting", "Bounty posting rights", "DAO treasury access (planned)", "Priority RPC access"],
    Icon: Award,
  },
];

const BOUNTIES = [
  { title: "Ultra-stable Antimicrobial Peptide", area: "Anti-infective", reward: "2,000,000 PTMS", score: ">95", color: "#00ff9f" },
  { title: "Blood-Brain Barrier Shuttle", area: "Neurology", reward: "2,000,000 PTMS", score: ">90", color: "#8b5cf6" },
  { title: "GLP-1 Receptor Agonist Lead", area: "Metabolic", reward: "100,000 PTMS", score: ">92", color: "#f59e0b" },
  { title: "Tumor-Penetrating Peptide", area: "Oncology", reward: "100,000 PTMS", score: ">90", color: "#f43f5e" },
];

const DAO_PROPS = [
  { id: "PIP-001", title: "Increase bounty escrow cap to 100 SOL", status: "Passed", votes: "94%", color: "#00ff9f" },
  { id: "PIP-002", title: "Add Avalanche chain support for IP-NFTs", status: "Voting", votes: "61%", color: "#00f5ff" },
  { id: "PIP-003", title: "Fund open-source peptide database integration", status: "Voting", votes: "78%", color: "#00f5ff" },
  { id: "PIP-004", title: "Reduce evolve endpoint rate limit to 5/min", status: "Failed", votes: "23%", color: "#f43f5e" },
];

const HOW_CONTRIBUTE = [
  { step: "01", icon: FlaskConical, color: "#00f5ff", title: "Generate Peptides", desc: "Use the AI Design Studio to generate and evolve peptide sequences. Every generation contributes to the community knowledge base." },
  { step: "02", icon: Trophy, color: "#00ff9f", title: "Mint IP-NFTs", desc: "Mint promising peptides as cNFTs on Solana. Establish your priority claim to the discovery with an immutable on-chain timestamp." },
  { step: "03", icon: Target, color: "#8b5cf6", title: "Hunt Bounties", desc: "Check the Bounty Program for active targets. Submit qualifying peptides to claim SOL rewards posted by protocol operators and pharma partners." },
  { step: "04", icon: Vote, color: "#f59e0b", title: "Participate in Governance", desc: "IP-NFT holders vote on Peptimus Improvement Proposals (PIPs). Shape the protocol direction including bounty caps, new features, and chain support." },
];

const STAT_ICONS = [
  { icon: Dna, label: "Peptides Generated", key: "peptidesGenerated" as const, color: "#00f5ff" },
  { icon: FlaskConical, label: "IP-NFTs Minted", key: "ipnftsMinted" as const, color: "#00ff9f" },
  { icon: Users, label: "Contributors", key: "contributors" as const, color: "#8b5cf6" },
  { icon: BarChart2, label: "Top Score", key: "topScore" as const, color: "#f59e0b" },
];

export function LandingCommunityPage() {
  const [stats, setStats] = useState<SiteStats | null>(null);

  useEffect(() => {
    fetch(`${BASE_URL}/api/stats`).then(r => r.json()).then(setStats).catch(() => {});
  }, []);

  return (
    <div className="min-h-screen bg-[#0a0f1c] text-white" style={{ fontFamily: "'Space Grotesk','DM Sans',sans-serif" }}>
      <LandingHeader />

      <div className="pt-24 pb-24 max-w-6xl mx-auto px-6 lg:px-12 space-y-32">

        <motion.div {...fadeUp()} className="text-center space-y-6 pt-8">
          <h1 className="text-4xl md:text-6xl font-black leading-tight">
            Research owned by<br />
            <span style={{ background: "linear-gradient(135deg,#8b5cf6,#00f5ff,#00ff9f)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent" }}>
              the researchers
            </span>
          </h1>
          <p className="text-white/55 text-lg max-w-2xl mx-auto">
            Peptimus is built by and for the global peptide research community. Contribute, earn, vote, and shape the future of decentralized biotech.
          </p>
        </motion.div>

        <motion.div {...fadeUp()} className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {STAT_ICONS.map((s) => {
            const Icon = s.icon;
            return (
              <div key={s.label} className="rounded-2xl border border-white/8 bg-white/2 p-6 text-center space-y-3">
                <div className="w-10 h-10 rounded-xl mx-auto flex items-center justify-center" style={{ background: `${s.color}15`, border: `1px solid ${s.color}30` }}>
                  <Icon className="w-5 h-5" style={{ color: s.color }} />
                </div>
                <div className="text-3xl font-black font-mono" style={{ color: s.color }}>
                  {stats ? stats[s.key] : "..."}
                </div>
                <div className="text-[10px] font-mono text-white/40 uppercase tracking-widest">{s.label}</div>
                <div className="text-[9px] text-emerald-400/60 font-mono">LIVE · REAL DB</div>
              </div>
            );
          })}
        </motion.div>

        <div className="space-y-8">
          <motion.h2 {...fadeUp()} className="text-2xl font-black uppercase tracking-widest border-b border-white/10 pb-4">How to Contribute</motion.h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {HOW_CONTRIBUTE.map((h, i) => {
              const Icon = h.icon;
              return (
                <motion.div key={h.step} {...fadeUp(i * 0.07)}
                  className="rounded-2xl border border-white/8 p-6 space-y-4 hover:border-white/15 transition-colors"
                >
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 rounded-xl flex items-center justify-center shrink-0" style={{ background: `${h.color}15`, border: `1.5px solid ${h.color}40` }}>
                      <Icon className="w-6 h-6" style={{ color: h.color }} />
                    </div>
                    <div>
                      <div className="text-[10px] font-mono tracking-widest" style={{ color: h.color }}>STEP {h.step}</div>
                      <h3 className="text-lg font-black text-white">{h.title}</h3>
                    </div>
                  </div>
                  <p className="text-white/55 text-sm leading-relaxed">{h.desc}</p>
                </motion.div>
              );
            })}
          </div>
        </div>

        <div className="space-y-8">
          <motion.h2 {...fadeUp()} className="text-2xl font-black uppercase tracking-widest border-b border-white/10 pb-4">Researcher Tiers</motion.h2>
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-4">
            {TIERS.map((tier, i) => {
              const Icon = tier.Icon;
              return (
                <motion.div key={tier.name} {...fadeUp(i * 0.07)}
                  className="rounded-2xl border p-6 space-y-4"
                  style={{ borderColor: `${tier.color}30`, background: `${tier.color}06` }}
                >
                  <div className="w-10 h-10 rounded-xl flex items-center justify-center" style={{ background: `${tier.color}15`, border: `1px solid ${tier.color}30` }}>
                    <Icon className="w-5 h-5" style={{ color: tier.color }} />
                  </div>
                  <div>
                    <h3 className="text-lg font-black" style={{ color: tier.color }}>{tier.name}</h3>
                    <p className="text-[10px] font-mono text-white/40 mt-0.5">{tier.req}</p>
                  </div>
                  <ul className="space-y-1.5">
                    {tier.perks.map((p) => (
                      <li key={p} className="flex items-start gap-2 text-xs text-white/55">
                        <Star className="w-3 h-3 mt-0.5 shrink-0" style={{ color: tier.color }} />
                        {p}
                      </li>
                    ))}
                  </ul>
                </motion.div>
              );
            })}
          </div>
        </div>

        <div className="space-y-6">
          <motion.h2 {...fadeUp()} className="text-2xl font-black uppercase tracking-widest border-b border-white/10 pb-4">Active Bounties</motion.h2>
          <p className="text-white/40 text-sm">Post a qualifying peptide to claim SOL rewards. Bounties are funded by protocol operators and pharma research partners.</p>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {BOUNTIES.map((b, i) => (
              <motion.div key={b.title} {...fadeUp(i * 0.06)}
                className="rounded-2xl border border-white/8 p-6 space-y-4 hover:border-white/15 transition-colors"
              >
                <div className="flex items-start justify-between">
                  <div>
                    <h3 className="font-black text-base text-white">{b.title}</h3>
                    <div className="text-xs font-mono mt-1" style={{ color: b.color }}>{b.area}</div>
                  </div>
                  <div className="text-right">
                    <div className="text-xl font-black text-white">{b.reward}</div>
                    <div className="text-[10px] font-mono text-emerald-400">Active</div>
                  </div>
                </div>
                <div className="flex items-center gap-4 text-xs text-white/40">
                  <span className="font-mono">Min score: <span className="font-bold text-white/70">{b.score}</span></span>
                  <span className="font-mono">Area: <span style={{ color: b.color }}>{b.area}</span></span>
                </div>
                <Link href="/app/bounty">
                  <button className="w-full py-2 rounded-xl text-xs font-bold uppercase tracking-widest border transition-colors hover:border-white/20 border-white/8 text-white/60 hover:text-white">
                    View Bounty Details
                  </button>
                </Link>
              </motion.div>
            ))}
          </div>
        </div>

        <div className="space-y-6">
          <motion.h2 {...fadeUp()} className="text-2xl font-black uppercase tracking-widest border-b border-white/10 pb-4">DAO Governance (Peptimus Improvement Proposals)</motion.h2>
          <p className="text-white/40 text-sm">IP-NFT holders vote on protocol changes. Each IP-NFT equals 1 vote. Principal Investigators have 2x voting weight.</p>
          <div className="rounded-2xl border border-white/10 overflow-hidden">
            <div className="grid grid-cols-4 bg-white/5 px-6 py-3 text-[10px] font-mono text-white/40 uppercase tracking-widest">
              <span>PIP ID</span><span className="col-span-2">Proposal</span><span>Status</span>
            </div>
            {DAO_PROPS.map((p, i) => (
              <motion.div key={p.id} {...fadeUp(i * 0.04)}
                className="grid grid-cols-4 px-6 py-4 border-t border-white/5 items-center hover:bg-white/2 transition-colors"
              >
                <span className="font-mono text-xs text-cyan-400 font-bold">{p.id}</span>
                <span className="col-span-2 text-sm text-white/70">{p.title}</span>
                <div className="flex flex-col items-start gap-1">
                  <span className="text-[10px] font-mono font-bold" style={{ color: p.color }}>{p.status}</span>
                  <div className="w-24 h-1.5 rounded-full bg-white/10 overflow-hidden">
                    <div className="h-full rounded-full" style={{ width: p.votes, background: p.color }} />
                  </div>
                  <span className="text-[9px] text-white/30 font-mono">{p.votes} in favor</span>
                </div>
              </motion.div>
            ))}
          </div>
        </div>

        <motion.div {...fadeUp()} className="space-y-6">
          <h2 className="text-2xl font-black uppercase tracking-widest border-b border-white/10 pb-4">Research Pools (Planned)</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {[
              { icon: Coins, color: "#f59e0b", title: "Pool Funding", desc: "Researchers stake SOL into a therapeutic target pool. Pool grows from protocol fees (2% of bounty payouts). Payout split among top 3 contributors when target is hit." },
              { icon: BookOpen, color: "#00f5ff", title: "Shared Knowledge", desc: "All pool participants get access to the collective peptide library for that target. Collaborative design with no siloed research. All IP attributions preserved on-chain." },
              { icon: Zap, color: "#00ff9f", title: "Auto-Validation", desc: "Qualifying peptides are validated automatically via score threshold and BLAST similarity check. No committee required. Smart contract releases funds when criteria are met." },
            ].map((rp) => {
              const Icon = rp.icon;
              return (
                <div key={rp.title} className="rounded-2xl border border-white/8 p-6 space-y-4">
                  <div className="w-10 h-10 rounded-xl flex items-center justify-center" style={{ background: `${rp.color}15`, border: `1px solid ${rp.color}30` }}>
                    <Icon className="w-5 h-5" style={{ color: rp.color }} />
                  </div>
                  <h3 className="font-black text-base text-white">{rp.title}</h3>
                  <p className="text-white/50 text-sm leading-relaxed">{rp.desc}</p>
                </div>
              );
            })}
          </div>
        </motion.div>

        <motion.div {...fadeUp()} className="text-center space-y-6 rounded-2xl border border-purple-400/20 bg-purple-400/5 p-12">
          <div className="w-16 h-16 rounded-2xl mx-auto flex items-center justify-center" style={{ background: "#8b5cf615", border: "1px solid #8b5cf640" }}>
            <Users className="w-8 h-8 text-purple-400" />
          </div>
          <h2 className="text-3xl font-black">Join the research community</h2>
          <p className="text-white/55 max-w-md mx-auto">
            {stats?.contributors
              ? `${stats.contributors} contributors have already generated ${stats.peptidesGenerated} peptides. Be the next.`
              : "Connect your wallet and start contributing to decentralized peptide discovery."}
          </p>
          <div className="flex justify-center gap-4 flex-wrap">
            <Link href="/app/studio">
              <button className="px-8 py-3 rounded-full font-bold text-sm tracking-wider" style={{ background: "linear-gradient(135deg,#8b5cf6,#00f5ff)", color: "#0a0f1c" }}>
                Start Designing
              </button>
            </Link>
            <Link href="/app/community">
              <button className="px-8 py-3 rounded-full font-bold text-sm tracking-wider border border-white/20 text-white/70 hover:text-white hover:border-white/40 transition-colors">
                Researcher Hub
              </button>
            </Link>
          </div>
        </motion.div>
      </div>
      <LandingFooter />
    </div>
  );
}
