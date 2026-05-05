import { motion } from "framer-motion";
import { BrainCircuit, Fingerprint, Dna, Shield, FlaskConical, Target, Globe2, Check, ChevronRight } from "lucide-react";
import { LandingHeader } from "@/components/landing/LandingHeader";
import { LandingFooter } from "@/components/landing/LandingFooter";
import { Link } from "wouter";

function fadeUp(delay = 0) {
  return { initial: { opacity: 0, y: 28 }, whileInView: { opacity: 1, y: 0 }, viewport: { once: true }, transition: { duration: 0.6, delay } };
}

const FEATURES = [
  {
    icon: BrainCircuit,
    color: "#00f5ff",
    title: "AI-Powered De Novo Design",
    subtitle: "From research goal to sequence in seconds",
    desc: "GPT-4o-mini interprets natural language research goals and generates 6 optimized peptide candidates with predicted binding affinity, stability, novelty, and toxicity scores. No bioinformatics expertise required.",
    bullets: [
      "Natural language to amino acid sequence",
      "Dual-mode: Research Goal plus Sequence Evolution",
      "6 candidates per run with full property prediction",
      "Saves every candidate to on-chain-ready DB",
    ],
  },
  {
    icon: Fingerprint,
    color: "#00ff9f",
    title: "IP-NFT Minting on Solana",
    subtitle: "Compressed NFTs via Metaplex Bubblegum v5",
    desc: "Every peptide can be minted as a compressed NFT (cNFT) on Solana mainnet using Metaplex Bubblegum. Gas cost is ~0.000005 SOL, which is 1000x cheaper than standard NFTs. Ownership is cryptographically verifiable.",
    bullets: [
      "Compressed NFTs at sub-cent minting cost",
      "On-chain metadata: sequence, scores, therapeutic area",
      "SVG art auto-generated per peptide",
      "Explorer-verifiable on Solana Explorer",
    ],
  },
  {
    icon: Dna,
    color: "#8b5cf6",
    title: "Evolutionary Sequence Optimization",
    subtitle: "Point-mutation AI search over peptide space",
    desc: "Start with any known peptide seed. The AI model generates 6 variants with 1 to 3 point mutations each, optimizing for the target property profile. Results are ranked by evolution score and saved to the global library.",
    bullets: [
      "1 to 3 point mutations per variant",
      "Amino acid alphabet ACDEFGHIKLMNPQRSTVWY",
      "Score-ranked output (affinity, stability, novelty)",
      "Cross-researcher comparison via Peptide Compare",
    ],
  },
  {
    icon: Globe2,
    color: "#f59e0b",
    title: "Decentralized Research Library",
    subtitle: "All sequences stored in PostgreSQL, indexed forever",
    desc: "Every generated peptide is stored in a persistent PostgreSQL database, publicly queryable through the REST API. Researchers can search by sequence, therapeutic area, creator wallet, or score range.",
    bullets: [
      "380+ peptides generated, 287 IP-NFTs minted",
      "Full-text search across sequences and metadata",
      "Filter by therapeutic area, score, wallet",
      "CSV export and API access for downstream analysis",
    ],
  },
  {
    icon: Shield,
    color: "#ec4899",
    title: "Researcher Identity and Attribution",
    subtitle: "Wallet-based pseudonymous authorship",
    desc: "Every peptide is linked to the creator's Solana wallet address. Jupiter Unified Wallet supports Phantom, Solflare, Backpack and 20+ wallets. On-chain timestamps provide immutable proof of discovery date.",
    bullets: [
      "Jupiter Unified Wallet with 20+ wallet support",
      "Wallet to peptide to NFT full provenance chain",
      "Immutable on-chain timestamps",
      "Researcher leaderboard and profile pages",
    ],
  },
  {
    icon: Target,
    color: "#06b6d4",
    title: "Bounty and Research Pools",
    subtitle: "SOL-denominated research incentives",
    desc: "Protocol operators and pharma partners can post bounties for specific therapeutic targets. Researchers who discover qualifying sequences claim SOL rewards. Deadlines and criteria enforced on-chain.",
    bullets: [
      "SOL-denominated bounty payouts",
      "Therapeutic area targeting (oncology, anti-infective)",
      "Score threshold-based validation",
      "Decentralized escrow via Squads multisig (planned)",
    ],
  },
];

const COMPARISON = [
  { feature: "Peptide generation speed", peptimus: "Under 10 seconds", traditional: "Weeks of wet lab work", academic: "Hours (computationally)" },
  { feature: "IP ownership", peptimus: "On-chain NFT, instant", traditional: "Patent filing, months", academic: "Institutional IP, complex" },
  { feature: "Cost per sequence", peptimus: "Under $0.01 AI plus $0.001 mint", traditional: "$1,000 to $50,000", academic: "$500 to $5,000" },
  { feature: "Collaboration", peptimus: "Open, global, real-time", traditional: "Closed, slow", academic: "Semi-open, siloed" },
  { feature: "Reproducibility", peptimus: "100% on-chain hash", traditional: "Variable", academic: "Variable" },
  { feature: "Score transparency", peptimus: "Public API, auditable", traditional: "Proprietary", academic: "Peer review only" },
];

const SCORE_MATRIX = [
  { name: "Binding Affinity", range: "60 to 99", best: ">90", unit: "predicted IC50 proxy", color: "#00f5ff" },
  { name: "Structural Stability", range: "60 to 99", best: ">85", unit: "deltaG folding proxy", color: "#00ff9f" },
  { name: "Novelty", range: "50 to 99", best: ">75", unit: "vs known peptidome", color: "#8b5cf6" },
  { name: "Toxicity", range: "0 to 25", best: "<8", unit: "hemolytic / cytotoxic", color: "#f59e0b" },
  { name: "Evolution Score", range: "70 to 99", best: ">90", unit: "composite rank", color: "#ec4899" },
];

export function FeaturesPage() {
  return (
    <div className="min-h-screen bg-[#0a0f1c] text-white" style={{ fontFamily: "'Space Grotesk','DM Sans',sans-serif" }}>
      <LandingHeader />

      <div className="pt-24 pb-24 max-w-6xl mx-auto px-6 lg:px-12 space-y-32">

        <motion.div {...fadeUp()} className="text-center space-y-6 pt-8">
          <h1 className="text-4xl md:text-6xl font-black leading-tight">
            Everything you need to do<br />
            <span style={{ background: "linear-gradient(135deg,#00f5ff,#00ff9f,#8b5cf6)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent" }}>
              peptide research on-chain
            </span>
          </h1>
          <p className="text-white/55 text-lg max-w-2xl mx-auto">
            From AI-generated sequences to NFT-backed IP ownership. Peptimus is the first end-to-end decentralized peptide discovery platform.
          </p>
        </motion.div>

        <div className="space-y-6">
          <motion.h2 {...fadeUp()} className="text-2xl font-black uppercase tracking-widest border-b border-white/10 pb-4">Core Features</motion.h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {FEATURES.map((f, i) => {
              const Icon = f.icon;
              return (
                <motion.div key={f.title} {...fadeUp(i * 0.07)}
                  className="rounded-2xl border border-white/8 bg-white/3 p-6 space-y-4 hover:border-white/15 transition-colors"
                >
                  <div className="w-12 h-12 rounded-xl flex items-center justify-center" style={{ background: `${f.color}15`, border: `1px solid ${f.color}30` }}>
                    <Icon className="w-6 h-6" style={{ color: f.color }} />
                  </div>
                  <div>
                    <h3 className="font-bold text-lg text-white">{f.title}</h3>
                    <p className="text-xs font-mono text-white/40 uppercase tracking-widest mt-0.5">{f.subtitle}</p>
                  </div>
                  <p className="text-white/55 text-sm leading-relaxed">{f.desc}</p>
                  <ul className="space-y-1.5">
                    {f.bullets.map((b) => (
                      <li key={b} className="flex items-start gap-2 text-xs text-white/60">
                        <Check className="w-3.5 h-3.5 mt-0.5 shrink-0" style={{ color: f.color }} />
                        {b}
                      </li>
                    ))}
                  </ul>
                </motion.div>
              );
            })}
          </div>
        </div>

        <motion.div {...fadeUp()} className="space-y-6">
          <h2 className="text-2xl font-black uppercase tracking-widest border-b border-white/10 pb-4">Scoring System</h2>
          <p className="text-white/55 text-sm">Every peptide is scored across five dimensions. Scores are generated by OpenAI gpt-4o-mini with biochemistry-grounded prompting and calibrated to known peptide databases.</p>
          <div className="rounded-2xl border border-white/10 overflow-hidden">
            <div className="grid grid-cols-5 bg-white/5 px-6 py-3 text-[10px] font-mono text-white/40 uppercase tracking-widest">
              <span>Metric</span><span>Range</span><span>Target</span><span>Unit</span><span>Visualizer</span>
            </div>
            {SCORE_MATRIX.map((s, i) => (
              <motion.div key={s.name} {...fadeUp(i * 0.06)}
                className="grid grid-cols-5 px-6 py-4 border-t border-white/5 items-center hover:bg-white/3 transition-colors"
              >
                <span className="font-bold text-sm" style={{ color: s.color }}>{s.name}</span>
                <span className="font-mono text-xs text-white/60">{s.range}</span>
                <span className="font-mono text-xs text-white/80 font-bold">{s.best}</span>
                <span className="font-mono text-[10px] text-white/40">{s.unit}</span>
                <div className="h-2 rounded-full bg-white/10 w-full overflow-hidden">
                  <div className="h-full rounded-full" style={{ width: "82%", background: `linear-gradient(90deg,${s.color}60,${s.color})` }} />
                </div>
              </motion.div>
            ))}
          </div>
        </motion.div>

        <motion.div {...fadeUp()} className="space-y-6">
          <h2 className="text-2xl font-black uppercase tracking-widest border-b border-white/10 pb-4">AI Design Pipeline</h2>
          <div className="rounded-2xl border border-white/10 bg-white/2 p-8">
            <div className="flex flex-col md:flex-row items-center">
              {[
                { label: "User Input", sub: "Research goal or seed sequence", color: "#00f5ff", icon: <FlaskConical className="w-5 h-5" /> },
                { label: "GPT-4o-mini", sub: "Interprets goal, generates 6 sequences", color: "#8b5cf6", icon: <BrainCircuit className="w-5 h-5" /> },
                { label: "Score Prediction", sub: "Affinity, Stability, Novelty, Toxicity", color: "#00ff9f", icon: <Target className="w-5 h-5" /> },
                { label: "DB Insert", sub: "Saved with wallet and metadata", color: "#f59e0b", icon: <Globe2 className="w-5 h-5" /> },
                { label: "NFT Mint", sub: "Bubblegum cNFT on Solana", color: "#ec4899", icon: <Fingerprint className="w-5 h-5" /> },
              ].map((step, i, arr) => (
                <div key={step.label} className="flex items-center flex-1 w-full md:w-auto">
                  <div className="flex-1 flex flex-col items-center text-center px-3 py-4">
                    <div className="w-14 h-14 rounded-xl flex items-center justify-center mb-3 mx-auto"
                      style={{ background: `${step.color}15`, border: `1.5px solid ${step.color}40` }}>
                      <div style={{ color: step.color }}>{step.icon}</div>
                    </div>
                    <p className="font-bold text-sm text-white">{step.label}</p>
                    <p className="text-[10px] text-white/40 mt-1 max-w-[120px]">{step.sub}</p>
                  </div>
                  {i < arr.length - 1 && (
                    <div className="hidden md:flex items-center text-white/20 shrink-0">
                      <div className="h-px w-6 bg-white/15" />
                      <ChevronRight className="w-4 h-4 -ml-1" />
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        </motion.div>

        <motion.div {...fadeUp()} className="space-y-6">
          <h2 className="text-2xl font-black uppercase tracking-widest border-b border-white/10 pb-4">Peptimus vs. Alternatives</h2>
          <div className="rounded-2xl border border-white/10 overflow-hidden">
            <div className="grid grid-cols-4 bg-white/5 px-6 py-3 text-[10px] font-mono text-white/40 uppercase tracking-widest">
              <span>Feature</span>
              <span className="text-cyan-400">Peptimus</span>
              <span>Traditional Lab</span>
              <span>Academic Tool</span>
            </div>
            {COMPARISON.map((row, i) => (
              <motion.div key={row.feature} {...fadeUp(i * 0.05)}
                className="grid grid-cols-4 px-6 py-4 border-t border-white/5 text-sm hover:bg-white/2 transition-colors items-center"
              >
                <span className="text-white/60 text-xs">{row.feature}</span>
                <span className="text-cyan-400 font-semibold text-xs">{row.peptimus}</span>
                <span className="text-white/40 text-xs">{row.traditional}</span>
                <span className="text-white/40 text-xs">{row.academic}</span>
              </motion.div>
            ))}
          </div>
        </motion.div>

        <motion.div {...fadeUp()} className="space-y-6">
          <h2 className="text-2xl font-black uppercase tracking-widest border-b border-white/10 pb-4">Supported Therapeutic Areas</h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {[
              { area: "Anti-infective", color: "#00ff9f", examples: "AMPs, antivirals, antifungals" },
              { area: "Oncology", color: "#f43f5e", examples: "Tumor-penetrating, apoptotic" },
              { area: "Metabolic", color: "#f59e0b", examples: "GLP-1 agonists, insulin mimetics" },
              { area: "Neurology", color: "#8b5cf6", examples: "BBB-crossing, neuroprotective" },
              { area: "Cardiovascular", color: "#ef4444", examples: "Vasodilatory, anti-thrombotic" },
              { area: "Immunology", color: "#3b82f6", examples: "Checkpoint modulators, cytokines" },
              { area: "Dermatology", color: "#ec4899", examples: "Wound healing, anti-inflammatory" },
              { area: "Regenerative", color: "#14b8a6", examples: "Stem cell homing, scaffolds" },
            ].map((t) => (
              <motion.div key={t.area} {...fadeUp(0.05)}
                className="rounded-xl border border-white/8 p-4 space-y-1"
                style={{ borderLeft: `3px solid ${t.color}` }}
              >
                <p className="font-bold text-sm" style={{ color: t.color }}>{t.area}</p>
                <p className="text-[10px] text-white/40 leading-relaxed">{t.examples}</p>
              </motion.div>
            ))}
          </div>
        </motion.div>

        <motion.div {...fadeUp()} className="text-center space-y-6 rounded-2xl border border-cyan-400/20 bg-cyan-400/5 p-12">
          <h2 className="text-3xl font-black">Ready to design your first peptide?</h2>
          <p className="text-white/55 max-w-md mx-auto">Connect your Solana wallet and start generating AI-optimized peptide candidates in seconds.</p>
          <Link href="/app/studio">
            <button className="px-10 py-3 rounded-full font-bold text-sm tracking-wider" style={{ background: "linear-gradient(135deg,#00f5ff,#00cc88)", color: "#0a0f1c" }}>
              Open AI Design Studio
            </button>
          </Link>
        </motion.div>
      </div>
      <LandingFooter />
    </div>
  );
}
