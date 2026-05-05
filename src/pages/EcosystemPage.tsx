import { motion } from "framer-motion";
import { ExternalLink, Layers, Cpu, Globe2, Database, Shield, Code2 } from "lucide-react";
import { LandingHeader } from "@/components/landing/LandingHeader";
import { LandingFooter } from "@/components/landing/LandingFooter";
import { Link } from "wouter";

function fadeUp(delay = 0) {
  return { initial: { opacity: 0, y: 28 }, whileInView: { opacity: 1, y: 0 }, viewport: { once: true }, transition: { duration: 0.6, delay } };
}

const STACK = [
  {
    layer: "AI Layer",
    color: "#8b5cf6",
    icon: Cpu,
    items: [
      { name: "OpenAI GPT-4o-mini", role: "De novo peptide design and interpretation", url: "https://openai.com" },
      { name: "Replit AI Integration", role: "Managed API proxy with no key exposure", url: "https://replit.com" },
    ],
    desc: "The AI layer translates natural language research goals into peptide sequences. Two parallel OpenAI calls handle interpretation and variant generation simultaneously.",
  },
  {
    layer: "Blockchain Layer",
    color: "#f59e0b",
    icon: Globe2,
    items: [
      { name: "Solana Mainnet", role: "L1 blockchain with 400ms slots and ~$0.001 txn cost", url: "https://solana.com" },
      { name: "Metaplex Bubblegum v5", role: "Compressed NFT standard for cNFTs", url: "https://metaplex.com" },
      { name: "Metaplex UMI SDK", role: "Client SDK for NFT operations", url: "https://github.com/metaplex-foundation/umi" },
      { name: "Helius RPC", role: "High-throughput Solana RPC endpoint", url: "https://helius.dev" },
    ],
    desc: "Solana provides sub-cent transaction costs via compressed NFTs. One Bubblegum merkle tree can hold up to 1 billion cNFTs at vastly reduced storage cost.",
  },
  {
    layer: "Wallet Layer",
    color: "#00f5ff",
    icon: Shield,
    items: [
      { name: "Jupiter Unified Wallet", role: "Multi-wallet adapter UI component", url: "https://jup.ag" },
      { name: "Phantom", role: "Largest Solana wallet (included)", url: "https://phantom.app" },
      { name: "Solflare", role: "DeFi-first Solana wallet", url: "https://solflare.com" },
      { name: "Backpack", role: "xNFT-enabled wallet", url: "https://backpack.app" },
    ],
    desc: "Jupiter Unified Wallet provides a single UI component that connects any Solana wallet. Researchers never need to configure wallet adapters.",
  },
  {
    layer: "Data Layer",
    color: "#00ff9f",
    icon: Database,
    items: [
      { name: "PostgreSQL", role: "Primary DB storing all peptides, metadata, users", url: "https://postgresql.org" },
      { name: "Drizzle ORM", role: "Type-safe SQL query builder", url: "https://orm.drizzle.team" },
      { name: "Replit DB", role: "Managed PostgreSQL instance", url: "https://replit.com" },
    ],
    desc: "All generated peptides are persisted in PostgreSQL with full metadata. Drizzle ORM provides type-safe access with complex aggregate queries.",
  },
  {
    layer: "API Layer",
    color: "#ec4899",
    icon: Layers,
    items: [
      { name: "Express 5", role: "HTTP server with async/await", url: "https://expressjs.com" },
      { name: "Pino Logger", role: "Structured JSON logging", url: "https://getpino.io" },
      { name: "express-rate-limit", role: "10 req/min on evolve endpoint", url: "" },
      { name: "@resvg/resvg-js", role: "SVG to PNG rendering for NFT images", url: "" },
    ],
    desc: "The API server runs on port 8080 with rate limiting on AI endpoints. It bridges the frontend, OpenAI, PostgreSQL, and the Solana RPC.",
  },
  {
    layer: "Frontend Layer",
    color: "#06b6d4",
    icon: Code2,
    items: [
      { name: "React 18 + Vite", role: "SPA with fast HMR", url: "https://vitejs.dev" },
      { name: "Tailwind CSS", role: "Utility-first styling", url: "https://tailwindcss.com" },
      { name: "Framer Motion", role: "Animations and page transitions", url: "https://framer.com/motion" },
      { name: "Wouter", role: "Lightweight client-side routing", url: "https://github.com/molefrog/wouter" },
      { name: "Three.js / React Three Fiber", role: "3D DNA helix in hero section", url: "https://threejs.org" },
      { name: "TanStack Query", role: "Server state management", url: "https://tanstack.com/query" },
    ],
    desc: "The frontend is a React SPA with path-based routing for the Replit preview proxy. Three.js renders the animated DNA helix on the landing page.",
  },
];

const NFTMETA = [
  { key: "name", value: "Peptide #id | therapeuticArea", note: "Auto-generated" },
  { key: "description", value: "AI-designed peptide on Peptimus Protocol", note: "" },
  { key: "sequence", value: "KWKLFKKIGAVLKVL", note: "Amino acid sequence" },
  { key: "affinity", value: "91", note: "Predicted binding score" },
  { key: "stability", value: "87", note: "Structural stability" },
  { key: "novelty", value: "76", note: "vs known peptidome" },
  { key: "toxicity", value: "5", note: "Lower is better" },
  { key: "evolutionScore", value: "93", note: "Composite rank" },
  { key: "therapeuticArea", value: "Anti-infective", note: "AI-classified" },
  { key: "mechanism", value: "Membrane disruption", note: "AI-described" },
  { key: "creatorWallet", value: "8ytdKG...Njx5", note: "Solana public key" },
  { key: "image", value: "/api/peptides/:id/image", note: "On-the-fly SVG to PNG" },
];

const MONOREPO = [
  { path: "artifacts/peptimus/", desc: "React + Vite frontend app", color: "#06b6d4" },
  { path: "artifacts/api-server/", desc: "Express 5 API server (port 8080)", color: "#8b5cf6" },
  { path: "packages/db/", desc: "Drizzle schema, migrations, and client", color: "#00ff9f" },
  { path: "packages/integrations-openai-ai-server/", desc: "OpenAI client via Replit proxy", color: "#ec4899" },
  { path: "packages/ui/", desc: "Shared Shadcn/Radix UI components", color: "#f59e0b" },
];

export function EcosystemPage() {
  return (
    <div className="min-h-screen bg-[#0a0f1c] text-white" style={{ fontFamily: "'Space Grotesk','DM Sans',sans-serif" }}>
      <LandingHeader />

      <div className="pt-24 pb-24 max-w-6xl mx-auto px-6 lg:px-12 space-y-32">

        <motion.div {...fadeUp()} className="text-center space-y-6 pt-8">
          <h1 className="text-4xl md:text-6xl font-black leading-tight">
            Built on the best<br />
            <span style={{ background: "linear-gradient(135deg,#f59e0b,#ec4899,#8b5cf6)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent" }}>
              open infrastructure
            </span>
          </h1>
          <p className="text-white/55 text-lg max-w-2xl mx-auto">
            Peptimus combines cutting-edge AI, Solana's low-cost blockchain, and open-source tooling into a unified research platform.
          </p>
        </motion.div>

        <motion.div {...fadeUp()} className="space-y-6">
          <h2 className="text-2xl font-black uppercase tracking-widest border-b border-white/10 pb-4">System Architecture</h2>
          <div className="rounded-2xl border border-white/10 bg-white/2 p-8 overflow-x-auto">
            <svg viewBox="0 0 800 200" className="w-full min-w-[600px]" style={{ maxHeight: 220 }}>
              <rect x="10" y="70" width="90" height="44" rx="8" fill="#00f5ff15" stroke="#00f5ff40" strokeWidth="1.5" />
              <text x="55" y="90" textAnchor="middle" fill="#00f5ff" fontSize="11" fontWeight="700">Researcher</text>
              <text x="55" y="104" textAnchor="middle" fill="#00f5ff70" fontSize="8">+ Wallet</text>

              <line x1="100" y1="92" x2="160" y2="92" stroke="#ffffff20" strokeWidth="1.5" markerEnd="url(#arr)" />
              <text x="130" y="86" textAnchor="middle" fill="#ffffff30" fontSize="8">HTTPS</text>

              <rect x="160" y="60" width="110" height="64" rx="8" fill="#06b6d415" stroke="#06b6d440" strokeWidth="1.5" />
              <text x="215" y="83" textAnchor="middle" fill="#06b6d4" fontSize="11" fontWeight="700">React Frontend</text>
              <text x="215" y="97" textAnchor="middle" fill="#06b6d470" fontSize="8">Vite + Tailwind</text>
              <text x="215" y="110" textAnchor="middle" fill="#06b6d470" fontSize="8">Jupiter Wallet</text>

              <line x1="270" y1="92" x2="330" y2="92" stroke="#ffffff20" strokeWidth="1.5" markerEnd="url(#arr)" />
              <text x="300" y="86" textAnchor="middle" fill="#ffffff30" fontSize="8">REST</text>

              <rect x="330" y="60" width="110" height="64" rx="8" fill="#8b5cf615" stroke="#8b5cf640" strokeWidth="1.5" />
              <text x="385" y="83" textAnchor="middle" fill="#8b5cf6" fontSize="11" fontWeight="700">Express API</text>
              <text x="385" y="97" textAnchor="middle" fill="#8b5cf670" fontSize="8">Rate-limited</text>
              <text x="385" y="110" textAnchor="middle" fill="#8b5cf670" fontSize="8">TypeScript</text>

              <line x1="440" y1="75" x2="530" y2="40" stroke="#ffffff20" strokeWidth="1" markerEnd="url(#arr)" />
              <line x1="440" y1="92" x2="530" y2="92" stroke="#ffffff20" strokeWidth="1" markerEnd="url(#arr)" />
              <line x1="440" y1="109" x2="530" y2="145" stroke="#ffffff20" strokeWidth="1" markerEnd="url(#arr)" />

              <rect x="530" y="18" width="100" height="40" rx="8" fill="#ec489915" stroke="#ec489940" strokeWidth="1.5" />
              <text x="580" y="35" textAnchor="middle" fill="#ec4899" fontSize="10" fontWeight="700">OpenAI</text>
              <text x="580" y="48" textAnchor="middle" fill="#ec489970" fontSize="8">gpt-4o-mini</text>

              <rect x="530" y="72" width="100" height="40" rx="8" fill="#00ff9f15" stroke="#00ff9f40" strokeWidth="1.5" />
              <text x="580" y="89" textAnchor="middle" fill="#00ff9f" fontSize="10" fontWeight="700">PostgreSQL</text>
              <text x="580" y="102" textAnchor="middle" fill="#00ff9f70" fontSize="8">Drizzle ORM</text>

              <rect x="530" y="126" width="100" height="40" rx="8" fill="#f59e0b15" stroke="#f59e0b40" strokeWidth="1.5" />
              <text x="580" y="143" textAnchor="middle" fill="#f59e0b" fontSize="10" fontWeight="700">Solana RPC</text>
              <text x="580" y="156" textAnchor="middle" fill="#f59e0b70" fontSize="8">Helius + Bubblegum</text>

              <line x1="630" y1="146" x2="690" y2="146" stroke="#ffffff20" strokeWidth="1" markerEnd="url(#arr)" />
              <rect x="690" y="126" width="100" height="40" rx="8" fill="#f59e0b08" stroke="#f59e0b20" strokeWidth="1" />
              <text x="740" y="143" textAnchor="middle" fill="#f59e0b80" fontSize="10" fontWeight="700">Solana Mainnet</text>
              <text x="740" y="156" textAnchor="middle" fill="#f59e0b50" fontSize="8">cNFT on-chain</text>

              <defs>
                <marker id="arr" markerWidth="6" markerHeight="6" refX="3" refY="3" orient="auto">
                  <path d="M0,0 L0,6 L6,3 z" fill="#ffffff30" />
                </marker>
              </defs>
            </svg>
          </div>
        </motion.div>

        <div className="space-y-8">
          <motion.h2 {...fadeUp()} className="text-2xl font-black uppercase tracking-widest border-b border-white/10 pb-4">Stack by Layer</motion.h2>
          {STACK.map((layer, i) => {
            const Icon = layer.icon;
            return (
              <motion.div key={layer.layer} {...fadeUp(i * 0.06)} className="rounded-2xl border border-white/8 overflow-hidden">
                <div className="flex items-center gap-3 px-6 py-4 border-b border-white/5" style={{ background: `${layer.color}08` }}>
                  <Icon className="w-5 h-5" style={{ color: layer.color }} />
                  <h3 className="font-black text-base uppercase tracking-widest" style={{ color: layer.color }}>{layer.layer}</h3>
                </div>
                <div className="p-6 grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="md:col-span-1">
                    <p className="text-white/50 text-sm leading-relaxed">{layer.desc}</p>
                  </div>
                  <div className="md:col-span-2 grid grid-cols-1 sm:grid-cols-2 gap-3">
                    {layer.items.map((item) => (
                      <div key={item.name} className="rounded-xl border border-white/5 bg-white/2 p-4">
                        <div className="flex items-start justify-between">
                          <p className="font-bold text-sm text-white">{item.name}</p>
                          {item.url && (
                            <a href={item.url} target="_blank" rel="noopener noreferrer" onClick={(e) => e.stopPropagation()}>
                              <ExternalLink className="w-3 h-3 text-white/20 hover:text-white/60 transition-colors mt-0.5" />
                            </a>
                          )}
                        </div>
                        <p className="text-[11px] text-white/40 mt-1 leading-relaxed">{item.role}</p>
                      </div>
                    ))}
                  </div>
                </div>
              </motion.div>
            );
          })}
        </div>

        <motion.div {...fadeUp()} className="space-y-6">
          <h2 className="text-2xl font-black uppercase tracking-widest border-b border-white/10 pb-4">Monorepo Structure</h2>
          <div className="rounded-2xl border border-white/10 bg-black/30 p-6 font-mono text-sm space-y-3">
            <div className="text-white/30 text-xs mb-4">pnpm workspace, all packages share dependencies</div>
            {MONOREPO.map((m) => (
              <div key={m.path} className="flex items-center gap-4">
                <span style={{ color: m.color }} className="text-xs font-bold min-w-[280px]">{m.path}</span>
                <span className="text-white/40 text-xs">// {m.desc}</span>
              </div>
            ))}
          </div>
        </motion.div>

        <motion.div {...fadeUp()} className="space-y-6">
          <h2 className="text-2xl font-black uppercase tracking-widest border-b border-white/10 pb-4">IP-NFT On-Chain Metadata Schema</h2>
          <p className="text-white/40 text-sm">Every minted peptide NFT includes this metadata, stored on Solana and accessible via the Metaplex DAS API.</p>
          <div className="rounded-2xl border border-white/10 overflow-hidden">
            <div className="grid grid-cols-3 bg-white/5 px-6 py-3 text-[10px] font-mono text-white/40 uppercase tracking-widest">
              <span>Field</span><span>Example Value</span><span>Note</span>
            </div>
            {NFTMETA.map((m, i) => (
              <motion.div key={m.key} {...fadeUp(i * 0.03)}
                className="grid grid-cols-3 px-6 py-3 border-t border-white/5 hover:bg-white/2 transition-colors items-center"
              >
                <span className="font-mono text-xs text-cyan-400 font-bold">{m.key}</span>
                <span className="font-mono text-xs text-white/60 truncate">{m.value}</span>
                <span className="text-[10px] text-white/30">{m.note}</span>
              </motion.div>
            ))}
          </div>
        </motion.div>

        <motion.div {...fadeUp()} className="space-y-6">
          <h2 className="text-2xl font-black uppercase tracking-widest border-b border-white/10 pb-4">Cost Breakdown per Peptide</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {[
              { label: "AI Design", cost: "~$0.001", detail: "GPT-4o-mini: ~800 tokens in plus ~300 out", color: "#8b5cf6" },
              { label: "DB Storage", cost: "~$0.0001", detail: "1 row in PostgreSQL, ~500 bytes", color: "#00ff9f" },
              { label: "NFT Mint", cost: "~$0.001", detail: "Solana cNFT via Bubblegum, ~5000 lamports", color: "#f59e0b" },
            ].map((c) => (
              <div key={c.label} className="rounded-2xl border border-white/10 p-6 text-center space-y-3">
                <div className="text-[10px] font-mono text-white/40 uppercase tracking-widest">{c.label}</div>
                <div className="text-3xl font-black" style={{ color: c.color }}>{c.cost}</div>
                <div className="text-xs text-white/40">{c.detail}</div>
              </div>
            ))}
          </div>
          <div className="rounded-xl border border-emerald-400/20 bg-emerald-400/5 p-4 text-center">
            <span className="text-emerald-400 font-bold text-sm">Total per peptide end-to-end: </span>
            <span className="text-white font-mono font-bold">~$0.002 USD</span>
            <span className="text-white/40 text-xs ml-2">vs $1,000+ for traditional synthesis</span>
          </div>
        </motion.div>

        <motion.div {...fadeUp()} className="text-center space-y-6 rounded-2xl border border-amber-400/20 bg-amber-400/5 p-12">
          <h2 className="text-3xl font-black">Explore the Research Library</h2>
          <p className="text-white/55 max-w-md mx-auto">Browse 380+ AI-generated peptides, filter by therapeutic area, and compare sequences side by side.</p>
          <Link href="/app/discover">
            <button className="px-10 py-3 rounded-full font-bold text-sm tracking-wider" style={{ background: "linear-gradient(135deg,#f59e0b,#ec4899)", color: "#0a0f1c" }}>
              Explore Peptide Library
            </button>
          </Link>
        </motion.div>
      </div>
      <LandingFooter />
    </div>
  );
}
