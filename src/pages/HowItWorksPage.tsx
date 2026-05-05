import { motion } from "framer-motion";
import { Wallet, Microscope, Cpu, Database, Fingerprint, Trophy, ChevronRight, Code2 } from "lucide-react";
import { LandingHeader } from "@/components/landing/LandingHeader";
import { LandingFooter } from "@/components/landing/LandingFooter";
import { Link } from "wouter";

function fadeUp(delay = 0) {
  return { initial: { opacity: 0, y: 28 }, whileInView: { opacity: 1, y: 0 }, viewport: { once: true }, transition: { duration: 0.6, delay } };
}

const STEPS = [
  {
    n: "01",
    icon: Wallet,
    color: "#00f5ff",
    title: "Connect Your Wallet",
    desc: "Connect any Solana wallet using Jupiter Unified Wallet. Supports Phantom, Solflare, Backpack, Trust, Coinbase Wallet and 20+ more. Your wallet address becomes your permanent researcher identity on-chain.",
    detail: [
      "Click Connect Wallet in the top-right of the app",
      "Choose from 20+ supported Solana wallets",
      "Approve the connection with no transaction signed yet",
      "Your wallet address auto-registers in the researcher DB",
      "All peptides you create are attributed to your address",
    ],
    code: `// Auto-registration on wallet connect
POST /api/users/register
{ "walletAddress": "8ytd...Njx5" }
→ { "id": "...", "createdAt": "..." }`,
  },
  {
    n: "02",
    icon: Microscope,
    color: "#00ff9f",
    title: "Describe Your Research Goal",
    desc: "In natural language mode, simply type what you want to achieve. The AI interprets your goal, identifies the therapeutic area, target mechanism, and design strategy, then generates peptide sequences from scratch.",
    detail: [
      "Type a goal like Design an antimicrobial peptide for MRSA",
      "AI maps goal to therapeutic area to mechanism to strategy",
      "Or switch to Sequence Mode for expert users",
      "Paste any known peptide seed such as DRFGDKDIAF",
      "AI generates 6 variants with 1 to 3 point mutations",
    ],
    code: `// Natural language to peptide design
POST /api/peptides/design
{ "goal": "Design AMP for MRSA",
  "creatorWallet": "8ytd..." }
→ { "interpretation": {...},
    "variants": [...6 peptides] }`,
  },
  {
    n: "03",
    icon: Cpu,
    color: "#8b5cf6",
    title: "AI Generates Candidates",
    desc: "GPT-4o-mini runs two parallel requests: one to interpret your goal, one to generate 6 de novo peptide sequences. Each sequence comes with predicted scores for binding affinity, stability, novelty, and toxicity.",
    detail: [
      "Two parallel OpenAI calls for speed",
      "Interpretation: goal, therapeuticArea, mechanism, strategy",
      "Variants: sequence, affinity, stability, novelty, toxicity",
      "JSON parsed and validated server-side",
      "All 6 candidates saved to PostgreSQL immediately",
    ],
    code: `// AI response structure
{
  "sequence": "KWKLFKKIGAVLKVL",
  "affinity": 91,
  "stability": 87,
  "novelty": 76,
  "toxicity": 5,
  "evolutionScore": 93,
  "rationale": "Cationic alpha-helical AMP",
  "mechanism": "Membrane disruption"
}`,
  },
  {
    n: "04",
    icon: Database,
    color: "#f59e0b",
    title: "Review and Select Candidates",
    desc: "Browse all 6 generated candidates side-by-side. Click any card to open the AI Insights panel with full scoring breakdown, binding affinity gauge, stability score, and toxicity prediction. Compare up to 4 peptides simultaneously.",
    detail: [
      "Side-by-side candidate grid with score bars",
      "Click any card to open the AI Insights panel on the right",
      "Binding Affinity, Stability, Toxicity visualized",
      "Navigate to Peptide Detail for full sequence analysis",
      "Compare mode: select up to 4 peptides simultaneously",
    ],
    code: `// Fetch peptide details
GET /api/peptides/:id
→ { id, sequence, affinity, stability,
    novelty, toxicity, evolutionScore,
    therapeuticArea, mechanism, rationale,
    mintAddress, creatorWallet, createdAt }`,
  },
  {
    n: "05",
    icon: Fingerprint,
    color: "#ec4899",
    title: "Mint as IP-NFT",
    desc: "Any promising candidate can be minted as a compressed NFT (cNFT) on Solana mainnet using Metaplex Bubblegum v5. The mint costs approximately $0.001 USD. The NFT contains the full sequence, scores, and AI-generated SVG artwork as on-chain metadata.",
    detail: [
      "Click Mint IP-NFT on any peptide card",
      "Server signs with platform wallet (Bubblegum authority)",
      "cNFT created on Solana mainnet tree",
      "NFT metadata: sequence, scores, therapeutic area, SVG image",
      "Mint address saved to DB and displayed in your profile",
    ],
    code: `// Mint endpoint
POST /api/peptides/:id/mint
{ "ownerWallet": "8ytd...Njx5" }
→ { "mintAddress": "3xZp...K9fA",
    "explorerUrl":
      "https://explorer.solana.com/..." }`,
  },
  {
    n: "06",
    icon: Trophy,
    color: "#14b8a6",
    title: "Publish to Research Feed",
    desc: "All minted peptides appear in the public Research Feed and Community Hub. Your researcher profile shows your full portfolio. Top contributors appear on the leaderboard. Bounty hunters can claim SOL rewards for qualifying discoveries.",
    detail: [
      "Research Feed shows all peptides, live-updated every 10s",
      "Your profile at /app/profile/{wallet} shows full portfolio",
      "Contributor leaderboard sorted by mint count and top score",
      "Bounty program: post targets, claim SOL rewards",
      "DAO governance for protocol upgrades coming soon",
    ],
    code: `// Live research feed
GET /api/feed
→ [...368 peptides, sorted by createdAt]

// Real-time stats
GET /api/stats
→ { peptidesGenerated: 380,
    ipnftsMinted: 287,
    contributors: 78,
    topScore: 97 }`,
  },
];

const SWIMLANE_ACTORS = ["Researcher", "Frontend", "API Server", "Solana"];
const SWIMLANE_PHASES = ["Connect", "Design", "Review", "Mint"];
const SWIMLANE_ACTIONS = [
  ["Describe goal", "Review candidates", "Select peptide", "Click Mint"],
  ["POST /design", "Render cards", "Show detail panel", "POST /mint"],
  ["Call OpenAI", "Save to DB", "Return variants", "Call Bubblegum"],
  ["", "", "", "Create cNFT on-chain"],
];
const SWIMLANE_COLORS = ["#00f5ff", "#8b5cf6", "#00ff9f", "#f59e0b"];
const SWIMLANE_RESULTS = ["Wallet address stored", "6 peptides in DB", "Score insights visible", "cNFT on Solana mainnet"];

const TECH_SPECS = [
  { key: "AI Model", value: "OpenAI gpt-4o-mini", note: "via Replit AI Integration proxy" },
  { key: "Blockchain", value: "Solana Mainnet Beta", note: "slot time ~400ms" },
  { key: "NFT Standard", value: "cNFT via Bubblegum v5", note: "Metaplex UMI SDK" },
  { key: "Wallet", value: "Jupiter Unified Wallet", note: "20+ wallets supported" },
  { key: "Database", value: "PostgreSQL + Drizzle ORM", note: "via Replit DB" },
  { key: "API Layer", value: "Express 5 + TypeScript", note: "rate-limited, CORS" },
  { key: "Frontend", value: "React 18 + Vite + Tailwind", note: "Framer Motion animations" },
  { key: "RPC", value: "Helius Mainnet RPC", note: "high-throughput Solana endpoint" },
];

export function HowItWorksPage() {
  return (
    <div className="min-h-screen bg-[#0a0f1c] text-white" style={{ fontFamily: "'Space Grotesk','DM Sans',sans-serif" }}>
      <LandingHeader />

      <div className="pt-24 pb-24 max-w-5xl mx-auto px-6 lg:px-12 space-y-32">

        <motion.div {...fadeUp()} className="text-center space-y-6 pt-8">
          <h1 className="text-4xl md:text-6xl font-black leading-tight">
            From idea to<br />
            <span style={{ background: "linear-gradient(135deg,#00ff9f,#00f5ff)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent" }}>
              on-chain IP in 6 steps
            </span>
          </h1>
          <p className="text-white/55 text-lg max-w-2xl mx-auto">
            The complete flow from connecting your wallet to minting a verifiable IP-NFT for your AI-designed peptide.
          </p>
        </motion.div>

        <div className="space-y-12">
          {STEPS.map((step, i) => {
            const Icon = step.icon;
            return (
              <motion.div key={step.n} {...fadeUp(i * 0.05)} className="grid grid-cols-1 md:grid-cols-2 gap-8 items-start">
                <div className="space-y-5">
                  <div className="flex items-center gap-4">
                    <div className="w-14 h-14 rounded-xl flex items-center justify-center shrink-0" style={{ background: `${step.color}15`, border: `1.5px solid ${step.color}40` }}>
                      <Icon className="w-7 h-7" style={{ color: step.color }} />
                    </div>
                    <div>
                      <div className="text-[10px] font-mono tracking-widest" style={{ color: step.color }}>STEP {step.n}</div>
                      <h3 className="text-xl font-black text-white">{step.title}</h3>
                    </div>
                  </div>
                  <p className="text-white/55 text-sm leading-relaxed">{step.desc}</p>
                  <ul className="space-y-2">
                    {step.detail.map((d) => (
                      <li key={d} className="flex items-start gap-2 text-xs text-white/50">
                        <ChevronRight className="w-3 h-3 mt-0.5 shrink-0" style={{ color: step.color }} />
                        {d}
                      </li>
                    ))}
                  </ul>
                </div>
                <div className="rounded-xl border border-white/10 bg-black/30 p-5">
                  <div className="flex items-center gap-2 mb-3">
                    <Code2 className="w-3.5 h-3.5 text-white/30" />
                    <span className="text-[10px] font-mono text-white/30 uppercase tracking-widest">API / Data</span>
                  </div>
                  <pre className="text-[11px] font-mono overflow-x-auto whitespace-pre-wrap leading-relaxed" style={{ color: step.color }}>
                    {step.code}
                  </pre>
                </div>
                {i < STEPS.length - 1 && (
                  <div className="md:col-span-2 flex justify-center">
                    <div className="h-8 w-px bg-gradient-to-b from-white/20 to-transparent" />
                  </div>
                )}
              </motion.div>
            );
          })}
        </div>

        <motion.div {...fadeUp()} className="space-y-6">
          <h2 className="text-2xl font-black uppercase tracking-widest border-b border-white/10 pb-4">System Interaction Diagram</h2>
          <p className="text-white/40 text-sm">Swimlane diagram showing how the researcher, frontend, API server, and Solana blockchain interact during the mint flow.</p>
          <div className="rounded-2xl border border-white/10 overflow-hidden">
            <div className="grid grid-cols-5 bg-white/5">
              <div className="p-3 text-[10px] font-mono text-white/30 uppercase tracking-widest border-r border-white/5">Actor</div>
              {SWIMLANE_PHASES.map((h) => (
                <div key={h} className="p-3 text-center text-[10px] font-mono text-cyan-400/60 uppercase tracking-widest border-r border-white/5">{h}</div>
              ))}
            </div>
            {SWIMLANE_ACTORS.map((actor, ri) => (
              <div key={actor} className="grid grid-cols-5 border-t border-white/5">
                <div className="p-3 text-xs font-bold border-r border-white/5" style={{ color: SWIMLANE_COLORS[ri] }}>{actor}</div>
                {SWIMLANE_ACTIONS[ri].map((action, ai) => (
                  <div key={ai} className="p-3 border-r border-white/5 flex items-center justify-center">
                    {action === "" ? (
                      <div className="w-2 h-2 rounded-full bg-white/10" />
                    ) : (
                      <div className="text-[10px] font-mono text-white/50 px-2 py-1 rounded bg-white/5 border border-white/8 text-center">{action}</div>
                    )}
                  </div>
                ))}
              </div>
            ))}
            <div className="grid grid-cols-5 border-t border-white/5">
              <div className="p-3 text-xs font-bold border-r border-white/5 text-white/20">Result</div>
              {SWIMLANE_RESULTS.map((r) => (
                <div key={r} className="p-3 border-r border-white/5">
                  <div className="text-[10px] font-mono text-emerald-400/70 text-center">{r}</div>
                </div>
              ))}
            </div>
          </div>
        </motion.div>

        <motion.div {...fadeUp()} className="space-y-6">
          <h2 className="text-2xl font-black uppercase tracking-widest border-b border-white/10 pb-4">Technical Specifications</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            {TECH_SPECS.map((spec, i) => (
              <motion.div key={spec.key} {...fadeUp(i * 0.04)}
                className="flex items-start gap-4 p-4 rounded-xl border border-white/8 bg-white/2 hover:border-white/15 transition-colors"
              >
                <div className="w-2 h-2 rounded-full mt-2 shrink-0 bg-cyan-400" />
                <div>
                  <div className="text-[10px] font-mono text-white/30 uppercase tracking-widest">{spec.key}</div>
                  <div className="text-sm font-bold text-white mt-0.5">{spec.value}</div>
                  <div className="text-[10px] text-white/30 mt-0.5">{spec.note}</div>
                </div>
              </motion.div>
            ))}
          </div>
        </motion.div>

        <motion.div {...fadeUp()} className="space-y-6">
          <h2 className="text-2xl font-black uppercase tracking-widest border-b border-white/10 pb-4">Peptide Evolution Visual Example</h2>
          <p className="text-white/40 text-sm">Starting from seed sequence DRFGDKDIAF, the AI generates 6 variants with point mutations highlighted in cyan:</p>
          <div className="rounded-2xl border border-white/10 bg-black/30 p-6 font-mono space-y-4">
            <div>
              <div className="text-[10px] text-white/30 uppercase tracking-widest mb-1">Seed Sequence</div>
              <div className="text-lg tracking-[0.3em] text-white/80">DRFGDKDIAF</div>
            </div>
            <div className="border-t border-white/5 pt-4 space-y-2">
              <div className="text-[10px] text-white/30 uppercase tracking-widest mb-2">AI-Generated Variants (mutations highlighted)</div>
              {[
                { pre: "DRFGDKDIA", mut: "W", post: "", score: 90 },
                { pre: "DRFGDKD", mut: "V", post: "AF", score: 88 },
                { pre: "D", mut: "K", post: "FGDKDIAF", score: 85 },
                { pre: "DRFGD", mut: "R", post: "DIAF", score: 87 },
                { pre: "DRFGDKDI", mut: "L", post: "F", score: 84 },
                { pre: "DRF", mut: "A", post: "DKDIAF", score: 83 },
              ].map((v, i) => (
                <div key={i} className="flex items-center gap-3">
                  <span className="text-white/20 text-xs w-4">{i + 1}</span>
                  <span className="tracking-[0.25em] text-sm">
                    <span className="text-white/50">{v.pre}</span>
                    <span className="text-cyan-400 font-bold">{v.mut}</span>
                    {v.post && <span className="text-white/50">{v.post}</span>}
                  </span>
                  <span className="ml-auto text-xs text-emerald-400">Score {v.score}</span>
                </div>
              ))}
            </div>
          </div>
        </motion.div>

        <motion.div {...fadeUp()} className="text-center space-y-6 rounded-2xl border border-emerald-400/20 bg-emerald-400/5 p-12">
          <h2 className="text-3xl font-black">See it in action</h2>
          <p className="text-white/55 max-w-md mx-auto">The full workflow takes under 30 seconds from goal input to 6 AI-generated peptide candidates.</p>
          <Link href="/app/studio">
            <button className="px-10 py-3 rounded-full font-bold text-sm tracking-wider" style={{ background: "linear-gradient(135deg,#00ff9f,#00f5ff)", color: "#0a0f1c" }}>
              Try AI Design Studio
            </button>
          </Link>
        </motion.div>
      </div>
      <LandingFooter />
    </div>
  );
}
