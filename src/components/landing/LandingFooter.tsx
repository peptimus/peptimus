import { Link } from "wouter";
import { Github, MessageCircle, ArrowRight } from "lucide-react";

export function LandingFooter() {
  return (
    <footer className="border-t border-white/5 bg-[#050714]">
      <div className="max-w-7xl mx-auto px-6 pt-16 pb-8">

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 pb-12 border-b border-white/5">

          <div className="space-y-5 lg:col-span-1">
            <div className="flex items-center gap-3">
              <img
                src={`${import.meta.env.BASE_URL}logo-nobg.png`}
                alt="Peptimus"
                className="w-9 h-9 rounded-xl object-cover shadow-[0_0_12px_rgba(0,245,255,0.3)]"
              />
              <span className="font-black text-base tracking-widest uppercase text-white">Peptimus</span>
            </div>
            <p className="text-white/35 text-sm leading-relaxed">
              Decentralized AI peptide design on Solana. Generate, evolve, and own your therapeutic discoveries as on-chain IP-NFTs.
            </p>
            <div className="flex items-center gap-2 pt-1">
              {[
                {
                  href: "https://x.com/peptimusdotxyz",
                  label: "X / Twitter",
                  icon: (
                    <svg className="w-3.5 h-3.5" viewBox="0 0 24 24" fill="currentColor">
                      <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-4.714-6.231-5.401 6.231H2.748l7.73-8.835L1.254 2.25H8.08l4.259 5.63 5.905-5.63zm-1.161 17.52h1.833L7.084 4.126H5.117z"/>
                    </svg>
                  ),
                },
                { href: "https://github.com/orgs/peptimus/repositories", label: "GitHub", icon: <Github className="w-3.5 h-3.5" /> },
                { href: "mailto:hello@peptimus.xyz", label: "Email", icon: <MessageCircle className="w-3.5 h-3.5" /> },
              ].map((s) => (
                <a
                  key={s.href}
                  href={s.href}
                  aria-label={s.label}
                  target={s.href.startsWith("mailto") ? undefined : "_blank"}
                  rel="noopener noreferrer"
                  className="w-8 h-8 rounded-lg border border-white/8 bg-white/[0.04] hover:bg-cyan-400/10 hover:border-cyan-400/30 flex items-center justify-center text-white/35 hover:text-cyan-400 transition-all"
                >
                  {s.icon}
                </a>
              ))}
            </div>
          </div>

          <div className="space-y-4">
            <div className="text-[10px] font-mono text-cyan-400/60 uppercase tracking-widest pb-1 border-b border-white/5">Protocol</div>
            <ul className="space-y-3">
              {[
                { label: "AI Design Studio", href: "/app/studio" },
                { label: "IP-NFT Library", href: "/app/library" },
                { label: "Discover Peptides", href: "/app/discover" },
                { label: "Bounty Program", href: "/app/bounty" },
                { label: "Compare Sequences", href: "/app/compare" },
              ].map((l) => (
                <li key={l.label}>
                  <Link href={l.href} className="text-white/40 text-sm hover:text-white transition-colors flex items-center gap-1.5 group">
                    <span className="w-1 h-1 rounded-full bg-white/15 group-hover:bg-cyan-400 transition-colors" />
                    {l.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div className="space-y-4">
            <div className="text-[10px] font-mono text-emerald-400/60 uppercase tracking-widest pb-1 border-b border-white/5">Community</div>
            <ul className="space-y-3">
              {[
                { label: "Community Hub", href: "/community" },
                { label: "Research Feed", href: "/app/feed" },
                { label: "DAO Governance", href: "/community" },
                { label: "Features", href: "/features" },
                { label: "How It Works", href: "/how-it-works" },
              ].map((l) => (
                <li key={l.label}>
                  <Link href={l.href} className="text-white/40 text-sm hover:text-white transition-colors flex items-center gap-1.5 group">
                    <span className="w-1 h-1 rounded-full bg-white/15 group-hover:bg-emerald-400 transition-colors" />
                    {l.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div className="space-y-4">
            <div className="text-[10px] font-mono text-purple-400/60 uppercase tracking-widest pb-1 border-b border-white/5">Ecosystem</div>
            <ul className="space-y-3">
              {[
                { label: "Molecule Protocol", href: "https://molecule.xyz" },
                { label: "Metaplex", href: "https://metaplex.com" },
                { label: "Solana Explorer", href: "https://explorer.solana.com" },
                { label: "Jupiter Wallet", href: "https://jup.ag" },
                { label: "GitHub", href: "https://github.com/orgs/peptimus/repositories" },
              ].map((l) => (
                <li key={l.label}>
                  <a
                    href={l.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-white/40 text-sm hover:text-white transition-colors flex items-center gap-1.5 group"
                  >
                    <span className="w-1 h-1 rounded-full bg-white/15 group-hover:bg-purple-400 transition-colors" />
                    {l.label}
                    <ArrowRight className="w-2.5 h-2.5 opacity-0 group-hover:opacity-60 -ml-0.5 transition-all -rotate-45" />
                  </a>
                </li>
              ))}
            </ul>
          </div>
        </div>

        <div className="pt-8 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="text-white/20 text-xs font-mono">
            2026 Peptimus. All rights reserved. Built on Solana.
          </div>
          <div className="flex items-center gap-6">
            {[
              { label: "Privacy Policy", href: "/privacy" },
              { label: "Terms of Service", href: "/terms" },
              { label: "Contact", href: "/contact" },
            ].map((item) => (
              <Link key={item.label} href={item.href} className="text-white/20 text-xs hover:text-white/50 transition-colors">
                {item.label}
              </Link>
            ))}
          </div>
          <div className="flex items-center gap-2">
            <div className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
            <span className="text-[10px] font-mono text-white/20">Solana Mainnet</span>
          </div>
        </div>

      </div>
    </footer>
  );
}
