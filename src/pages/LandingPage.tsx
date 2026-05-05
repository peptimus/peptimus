import { Link } from "wouter";
import { motion } from "framer-motion";
import { LandingFooter } from "@/components/landing/LandingFooter";
import { Button } from "@/components/ui/button";
import { useAppStore } from "@/store/useAppStore";
import { useEffect, useState } from "react";
import {
  BrainCircuit,
  Globe2,
  Fingerprint,
  Activity,
  FlaskConical,
  Users,
  ArrowRight,
  Github,
  MessageCircle,
  ChevronDown,
  Dna,
  Microscope,
  Cpu,
  Zap,
} from "lucide-react";
import { HeroDNAScene } from "@/components/molecules/HeroDNAScene";

function SectionBadge({ color, children }: { color: string; children: React.ReactNode }) {
  const colors: Record<string, { border: string; bg: string; dot: string; text: string }> = {
    cyan:    { border: "rgba(0,245,255,0.2)",   bg: "rgba(0,245,255,0.06)",   dot: "#00f5ff", text: "#00f5ff" },
    emerald: { border: "rgba(0,255,159,0.2)",   bg: "rgba(0,255,159,0.06)",   dot: "#00ff9f", text: "#00ff9f" },
    purple:  { border: "rgba(139,92,246,0.2)",  bg: "rgba(139,92,246,0.06)",  dot: "#8b5cf6", text: "#8b5cf6" },
    blue:    { border: "rgba(96,165,250,0.2)",  bg: "rgba(96,165,250,0.06)",  dot: "#60a5fa", text: "#60a5fa" },
  };
  const c = colors[color] ?? colors.cyan;
  return (
    <div
      className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full text-xs font-mono tracking-widest uppercase mb-6"
      style={{ border: `1px solid ${c.border}`, background: c.bg, color: c.text }}
    >
      <div className="w-1.5 h-1.5 rounded-full animate-pulse" style={{ background: c.dot }} />
      {children}
    </div>
  );
}

const BASE_URL = (import.meta.env.BASE_URL || "/").replace(/\/$/, "");

interface SiteStats {
  peptidesGenerated: number;
  ipnftsMinted: number;
  contributors: number;
  topScore: number;
  modelsRunning: boolean;
}

export function LandingPage() {
  const { walletConnected } = useAppStore();
  const [menuOpen, setMenuOpen] = useState(false);
  const [stats, setStats] = useState<SiteStats | null>(null);

  useEffect(() => {
    fetch(`${BASE_URL}/api/stats`)
      .then((r) => r.json())
      .then((data) => setStats(data))
      .catch(() => {});
  }, []);

  return (
    <div className="min-h-screen bg-[#0a0f1c] text-white overflow-x-hidden" style={{ fontFamily: "'Space Grotesk', 'DM Sans', sans-serif" }}>

      {/* NAVBAR */}
      <header className="fixed top-0 left-0 right-0 z-50 px-6 lg:px-16 py-4 flex items-center justify-between border-b border-white/5 backdrop-blur-xl bg-[#0a0f1c]/80">
        <div className="flex items-center gap-3">
          <img
            src={`${import.meta.env.BASE_URL}logo-nobg.png`}
            alt="Peptimus"
            className="w-9 h-9 rounded-xl object-cover shadow-[0_0_14px_rgba(0,245,255,0.3)]"
          />
          <span className="font-black text-lg tracking-wider text-white">Peptimus</span>
        </div>

        <div className="flex items-center gap-6">
          <nav className="hidden md:flex items-center gap-6">
            {[
              { label: "Features", href: "/features" },
              { label: "How It Works", href: "/how-it-works" },
              { label: "Ecosystem", href: "/ecosystem" },
              { label: "Community", href: "/community" },
            ].map((item) => (
              <Link key={item.label} href={item.href}>
                <span className="text-sm text-white/55 hover:text-white transition-colors tracking-wide cursor-pointer">
                  {item.label}
                </span>
              </Link>
            ))}
          </nav>
          <Link href="/app">
            <Button
              className="font-bold px-6 rounded-full text-sm tracking-wider transition-all duration-300 shadow-[0_0_25px_rgba(0,245,255,0.25)] hover:shadow-[0_0_40px_rgba(0,245,255,0.4)]"
              style={{ background: "linear-gradient(135deg, #00f5ff 0%, #00cc88 100%)", color: "#0a0f1c" }}
              data-testid="button-launch-app-nav"
            >
              Launch App
            </Button>
          </Link>
        </div>
      </header>

      {/* HERO SECTION */}
      <section id="home" className="relative min-h-screen flex flex-col overflow-hidden">
        <div className="absolute inset-0 z-0">
          <div className="absolute inset-0" style={{ filter: "blur(2px)", opacity: 0.55 }}>
            <HeroDNAScene />
          </div>
          <div className="absolute inset-0 bg-gradient-to-b from-[#0a0f1c]/60 via-[#0a0f1c]/20 to-[#0a0f1c]" />
          <div className="absolute inset-0 bg-gradient-to-r from-[#0a0f1c]/80 via-transparent to-[#0a0f1c]/60" />
        </div>

        {/* Main content: vertically centred, left-aligned */}
        <div className="relative z-10 flex-1 flex items-end">
          <div className="w-full max-w-[1240px] mx-auto px-4 pb-20 pt-24">
            <motion.div
              initial={{ opacity: 0, y: 32 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.15 }}
              className="flex flex-col items-center text-center gap-10"
            >
              <h1 className="font-black leading-[1.08] tracking-tight w-full text-4xl md:text-5xl" style={{ fontSize: "clamp(2rem, 5.5vw, 4.5rem)" }}>
                <span className="text-white">AI-Powered </span>
                <span style={{
                  background: "linear-gradient(135deg, #00f5ff 0%, #00ff9f 50%, #8b5cf6 100%)",
                  WebkitBackgroundClip: "text",
                  WebkitTextFillColor: "transparent",
                  filter: "drop-shadow(0 0 30px rgba(0,245,255,0.3))",
                }}>Peptide Design</span>
                <span className="text-white"> and</span>
                <br />
                <span className="text-white">Discovery Platform on Solana</span>
              </h1>

              <p className="text-base md:text-lg text-white/55 max-w-4xl leading-relaxed font-light">
                Powerful AI platform that helps researchers and biohackers generate, optimize, and instantly own optimized peptide sequences through intelligent design and on-chain BioNFTs.
              </p>

              <div className="flex flex-wrap gap-3 mt-2">
                <Link href="/app">
                  <Button
                    size="lg"
                    className="h-12 px-8 rounded-full text-sm font-bold tracking-wide transition-all duration-300"
                    style={{ background: "linear-gradient(135deg, #00f5ff 0%, #00cc88 100%)", color: "#0a0f1c", boxShadow: "0 0 30px rgba(0,245,255,0.3)" }}
                    data-testid="button-launch-app"
                  >
                    Launch App <ArrowRight className="ml-1.5 w-4 h-4" />
                  </Button>
                </Link>
                <Link href="/app/library">
                  <Button size="lg" className="h-12 px-8 rounded-full text-sm font-semibold border border-white/20 bg-white/5 hover:bg-white/10 text-white/80 hover:text-white tracking-wide transition-all">
                    Explore Library <ArrowRight className="ml-1.5 w-4 h-4" />
                  </Button>
                </Link>
                <Link href="/app/discover">
                  <Button size="lg" className="h-12 px-8 rounded-full text-sm font-semibold border border-white/20 bg-white/5 hover:bg-white/10 text-white/80 hover:text-white tracking-wide transition-all">
                    Discover <ArrowRight className="ml-1.5 w-4 h-4" />
                  </Button>
                </Link>
              </div>
            </motion.div>
          </div>
        </div>

        {/* Stats bar pinned to bottom */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.7, duration: 0.8 }}
          className="relative z-10 w-full border-t border-white/8 bg-[#0a0f1c]/70 backdrop-blur-sm"
        >
          <div className="max-w-7xl mx-auto px-8 lg:px-16 py-5 flex items-center justify-between divide-x divide-white/10">
            {[
              {
                value: stats ? stats.peptidesGenerated.toLocaleString() : "...",
                label: "Peptides",
                color: "#00f5ff",
              },
              {
                value: stats ? stats.ipnftsMinted.toLocaleString() : "...",
                label: "IP-NFTs Minted",
                color: "#00ff9f",
              },
              {
                value: stats ? stats.contributors.toLocaleString() : "...",
                label: "Contributors",
                color: "#8b5cf6",
              },
              {
                value: stats ? stats.topScore.toString() : "...",
                label: "Top Score",
                color: "#f59e0b",
              },
            ].map((stat) => (
              <div key={stat.label} className="flex items-baseline gap-2 flex-1 justify-center first:justify-start last:justify-end px-4 first:px-0 last:px-0">
                <span className="text-2xl font-black" style={{ color: stat.color }}>{stat.value}</span>
                <span className="text-sm text-white/45 font-mono tracking-wide">{stat.label}</span>
              </div>
            ))}
          </div>
        </motion.div>
      </section>

      {/* BUILT ON SECTION */}
      <section id="built-on" className="py-14 border-y border-white/5 bg-white/[0.015]">
        <div className="max-w-5xl mx-auto px-6">
          <div className="flex flex-col md:flex-row items-center justify-center gap-4 md:gap-16">
            <span className="text-xs font-mono text-white/25 uppercase tracking-widest">Powered by</span>
            {[
              { name: "Solana", icon: <svg width="22" height="16" viewBox="0 0 646 96" fill="none"><path d="M108.53 75.69 88.36 96H0L20.18 75.69h88.35zM108.53 0 88.36 20.31H0L20.18 0h88.35zM179.56 37.85 159.39 58.15H71.04l20.18-20.3h88.34zM646 75.69l-20.17 20.31H537.48l20.17-20.31H646zM646 0l-20.17 20.31H537.48L557.65 0H646zM575.13 37.85 554.96 58.15H466.6l20.17-20.3h88.36z" fill="#9945FF"/><path d="M430.62 75.69 410.44 96H322.1l20.18-20.31h88.34zM430.62 0 410.44 20.31H322.1L342.28 0h88.34zM359.69 37.85 339.52 58.15H251.16l20.18-20.3h88.35z" fill="#14F195"/></svg>, color: "#9945FF" },
              { name: "Neural Networks", icon: <BrainCircuit className="w-5 h-5" />, color: "#00f5ff" },
              { name: "Evolutionary Algorithms", icon: <Dna className="w-5 h-5" />, color: "#00ff9f" },
            ].map((item) => (
              <div key={item.name} className="flex items-center gap-3 text-white/60 hover:text-white transition-colors group">
                <span style={{ color: item.color }} className="group-hover:drop-shadow-[0_0_8px_currentColor] transition-all">
                  {item.icon}
                </span>
                <span className="font-semibold text-base tracking-wide">{item.name}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* FEATURES SECTION */}
      <section id="technology" className="relative py-32 overflow-hidden">
        <div className="absolute inset-0 z-0">
          <img src="/bg-features.png" alt="" className="w-full h-full object-cover opacity-20" />
          <div className="absolute inset-0 bg-gradient-to-b from-[#0a0f1c] via-transparent to-[#0a0f1c]" />
          <div className="absolute inset-0 bg-gradient-to-r from-[#0a0f1c]/80 via-transparent to-[#0a0f1c]/80" />
        </div>

        <div className="relative z-10 max-w-7xl mx-auto px-6">
          <div className="text-center mb-20">
            <SectionBadge color="purple">Core Features</SectionBadge>
            <h2 className="text-4xl md:text-5xl font-black text-white mb-4">Powerful AI Tools for Peptide Design</h2>
            <p className="text-white/45 max-w-xl mx-auto text-lg font-light">
              Everything you need to go from idea to on chain discovery.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
            {[
              {
                icon: <FlaskConical className="w-6 h-6" />,
                color: "#00f5ff",
                title: "AI Design Studio",
                desc: "Paste your seed sequence and let AI instantly generate hundreds of optimized peptide variants.",
              },
              {
                icon: <BrainCircuit className="w-6 h-6" />,
                color: "#00ff9f",
                title: "Intelligent Predictions",
                desc: "Get accurate forecasts for binding affinity, stability, toxicity, and synthesis feasibility.",
              },
              {
                icon: <Globe2 className="w-6 h-6" />,
                color: "#8b5cf6",
                title: "Living AI Model",
                desc: "The more data the community contributes, the smarter and more accurate the system becomes.",
              },
              {
                icon: <Fingerprint className="w-6 h-6" />,
                color: "#8b5cf6",
                title: "BioNFT Ownership",
                desc: "Mint your best peptides as on chain BioNFTs and truly own your discoveries.",
              },
              {
                icon: <Activity className="w-6 h-6" />,
                color: "#00f5ff",
                title: "Real time Research Feed",
                desc: "See what peptides the AI is currently designing across the platform.",
              },
              {
                icon: <Users className="w-6 h-6" />,
                color: "#00ff9f",
                title: "Community Library",
                desc: "Browse, fork, and collaborate on thousands of peptide designs from global researchers.",
              },
            ].map((f, i) => (
              <motion.div
                key={f.title}
                initial={{ opacity: 0, y: 24 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-40px" }}
                transition={{ delay: i * 0.07, duration: 0.55 }}
                className="group relative rounded-2xl p-7 overflow-hidden transition-all duration-300 cursor-default"
                style={{ background: "rgba(255,255,255,0.025)", border: "1px solid rgba(255,255,255,0.06)", backdropFilter: "blur(8px)" }}
                whileHover={{ borderColor: `${f.color}40`, boxShadow: `0 0 40px ${f.color}12` }}
              >
                <div
                  className="inline-flex items-center justify-center w-12 h-12 rounded-xl mb-5 transition-all duration-300 group-hover:scale-110"
                  style={{ background: `${f.color}12`, border: `1px solid ${f.color}25`, color: f.color }}
                >
                  {f.icon}
                </div>
                <h3 className="text-base font-bold text-white mb-2 tracking-wide">{f.title}</h3>
                <p className="text-white/45 text-sm leading-relaxed font-light">{f.desc}</p>
                <div
                  className="absolute bottom-0 left-0 right-0 h-px opacity-0 group-hover:opacity-100 transition-opacity duration-300"
                  style={{ background: `linear-gradient(90deg, transparent, ${f.color}60, transparent)` }}
                />
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* HOW IT WORKS */}
      <section id="how-it-works" className="py-32 bg-gradient-to-b from-[#0a0f1c] via-[#0d1230] to-[#0a0f1c]">
        <div className="max-w-5xl mx-auto px-6">
          <div className="text-center mb-20">
            <SectionBadge color="emerald">Process</SectionBadge>
            <h2 className="text-4xl md:text-5xl font-black text-white mb-4">From Idea to On Chain Peptide in Minutes</h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-4 gap-6 relative">
            <div className="hidden md:block absolute top-10 left-[12.5%] right-[12.5%] h-px" style={{ background: "linear-gradient(90deg, rgba(0,245,255,0.1), rgba(0,255,159,0.3), rgba(139,92,246,0.3), rgba(0,245,255,0.1))" }} />

            {[
              { num: "01", icon: <Cpu className="w-6 h-6" />, color: "#00f5ff", title: "Input Sequence", desc: "Paste your peptide sequence or upload experimental data." },
              { num: "02", icon: <BrainCircuit className="w-6 h-6" />, color: "#00ff9f", title: "AI Optimization", desc: "Our AI analyzes and generates superior variants in seconds." },
              { num: "03", icon: <Dna className="w-6 h-6" />, color: "#8b5cf6", title: "Review Results", desc: "Explore 3D visualizations and detailed performance metrics." },
              { num: "04", icon: <Zap className="w-6 h-6" />, color: "#f59e0b", title: "Mint and Own", desc: "Mint the best designs as BioNFTs and share them on the marketplace." },
            ].map((step, i) => (
              <motion.div
                key={step.num}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.12, duration: 0.5 }}
                className="flex flex-col items-center text-center gap-4 relative"
              >
                <div
                  className="w-20 h-20 rounded-2xl flex items-center justify-center relative z-10"
                  style={{ background: `${step.color}10`, border: `1px solid ${step.color}30`, boxShadow: `0 0 30px ${step.color}15` }}
                >
                  <div style={{ color: step.color }}>{step.icon}</div>
                </div>
                <div className="text-xs font-mono text-white/25 tracking-widest">{step.num}</div>
                <h3 className="font-bold text-white text-base tracking-wide">{step.title}</h3>
                <p className="text-sm text-white/40 leading-relaxed font-light">{step.desc}</p>
              </motion.div>
            ))}
          </div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.5 }}
            className="flex justify-center mt-16"
          >
            <Link href="/app/studio">
              <Button
                size="lg"
                className="h-14 px-12 rounded-full text-base font-bold tracking-wide transition-all duration-300"
                style={{
                  background: "linear-gradient(135deg, #00f5ff 0%, #00cc88 100%)",
                  color: "#0a0f1c",
                  boxShadow: "0 0 40px rgba(0,245,255,0.3)",
                }}
              >
                Start Designing Now
                <ArrowRight className="ml-2 w-5 h-5" />
              </Button>
            </Link>
          </motion.div>
        </div>
      </section>

      {/* TECHNOLOGY SECTION */}
      <section id="research" className="relative py-32 overflow-hidden">
        <div className="absolute inset-0 z-0">
          <img src="/bg-cta.png" alt="" className="w-full h-full object-cover opacity-25" />
          <div className="absolute inset-0 bg-gradient-to-b from-[#0a0f1c] via-transparent to-[#0a0f1c]" />
          <div className="absolute inset-0 bg-gradient-to-r from-[#0a0f1c] via-[#0a0f1c]/50 to-[#0a0f1c]" />
        </div>

        <div className="relative z-10 max-w-4xl mx-auto px-6">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
            className="rounded-3xl p-12 text-center"
            style={{ background: "rgba(255,255,255,0.025)", border: "1px solid rgba(255,255,255,0.07)", backdropFilter: "blur(20px)" }}
          >
            <SectionBadge color="blue">Advanced Technology</SectionBadge>
            <h2 className="text-4xl md:text-5xl font-black text-white mb-6">
              Advanced AI for Peptide Discovery
            </h2>
            <div className="w-16 h-1 mx-auto mb-8 rounded-full" style={{ background: "linear-gradient(90deg, #00f5ff, #8b5cf6)" }} />
            <p className="text-white/65 text-lg leading-relaxed mb-4 font-light max-w-2xl mx-auto">
              Peptimus combines neural networks and intelligent optimization algorithms to help researchers design high potential peptides faster than ever.
            </p>

            <div className="mt-12 grid grid-cols-3 gap-6">
              {[
                { label: "AI Architecture", value: "ANN", color: "#00f5ff" },
                { label: "Research Focus", value: "DeSci", color: "#00ff9f" },
                { label: "Model Accuracy", value: "99.2%", color: "#8b5cf6" },
              ].map((s) => (
                <div key={s.label} className="flex flex-col items-center gap-1">
                  <div className="text-3xl font-black font-mono" style={{ color: s.color, textShadow: `0 0 20px ${s.color}60` }}>
                    {s.value}
                  </div>
                  <div className="text-xs text-white/30 uppercase tracking-widest font-mono">{s.label}</div>
                </div>
              ))}
            </div>
          </motion.div>
        </div>
      </section>

      {/* COMMUNITY SECTION */}
      <section id="community" className="relative py-32 overflow-hidden">
        <div className="absolute inset-0 z-0">
          <img src="/bg-stats.png" alt="" className="w-full h-full object-cover opacity-15" />
          <div className="absolute inset-0 bg-gradient-to-b from-[#0a0f1c] via-transparent to-[#0a0f1c]" />
        </div>

        <div className="relative z-10 max-w-6xl mx-auto px-6">
          <div className="text-center mb-16">
            <SectionBadge color="emerald">Community Impact</SectionBadge>
            <h2 className="text-4xl md:text-5xl font-black text-white mb-4">Built by Researchers, for Researchers</h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-16">
            {[
              { value: "1.2M+", label: "Peptides Designed", color: "#00f5ff", sub: "and growing every minute" },
              { value: "89%", label: "Average Performance Improvement", color: "#00ff9f", sub: "after community contributions" },
              { value: "47+", label: "Countries Represented", color: "#8b5cf6", sub: "researchers worldwide" },
            ].map((stat, i) => (
              <motion.div
                key={stat.label}
                initial={{ opacity: 0, y: 24 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.12, duration: 0.6 }}
                className="rounded-2xl p-8 text-center"
                style={{ background: "rgba(255,255,255,0.025)", border: `1px solid ${stat.color}20`, boxShadow: `0 0 40px ${stat.color}06` }}
              >
                <div
                  className="text-5xl md:text-6xl font-black font-mono mb-3"
                  style={{ color: stat.color, textShadow: `0 0 30px ${stat.color}50` }}
                >
                  {stat.value}
                </div>
                <div className="text-white font-semibold mb-1 tracking-wide text-sm uppercase">{stat.label}</div>
                <div className="text-white/35 text-xs font-mono">{stat.sub}</div>
              </motion.div>
            ))}
          </div>

        </div>
      </section>

      {/* FINAL CTA SECTION */}
      <section className="relative py-20 overflow-hidden">
        <div className="absolute inset-0 z-0">
          <img src="/bg-hero.png" alt="" className="w-full h-full object-cover opacity-30 scale-x-[-1]" />
          <div className="absolute inset-0 bg-gradient-to-b from-[#0a0f1c] via-transparent to-[#0a0f1c]" />
          <div className="absolute inset-0 bg-gradient-to-r from-[#0a0f1c]/70 via-[#0a0f1c]/20 to-[#0a0f1c]/70" />
        </div>

        <div className="absolute inset-0 z-0 pointer-events-none flex items-center justify-center">
          <div className="w-[600px] h-[300px] rounded-full opacity-20" style={{ background: "radial-gradient(ellipse, #00f5ff 0%, #8b5cf6 50%, transparent 100%)", filter: "blur(60px)" }} />
        </div>

        <div className="relative z-10 max-w-4xl mx-auto px-6 text-center">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
            className="space-y-5"
          >
            <SectionBadge color="cyan">Get Started</SectionBadge>
            <h2 className="text-3xl md:text-5xl font-black text-white leading-tight">
              Ready to design the next<br />
              <span
                style={{
                  background: "linear-gradient(135deg, #00f5ff 0%, #00ff9f 60%, #8b5cf6 100%)",
                  WebkitBackgroundClip: "text",
                  WebkitTextFillColor: "transparent",
                }}
              >
                breakthrough peptide?
              </span>
            </h2>

            <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-4">
              <Link href="/app/studio">
                <Button
                  size="lg"
                  className="h-16 px-14 rounded-full text-lg font-black tracking-wide transition-all duration-300"
                  style={{
                    background: "linear-gradient(135deg, #00f5ff 0%, #00cc88 100%)",
                    color: "#0a0f1c",
                    boxShadow: "0 0 60px rgba(0,245,255,0.4), 0 0 120px rgba(0,245,255,0.15)",
                  }}
                  data-testid="button-launch-studio"
                >
                  Start Designing
                  <ArrowRight className="ml-2 w-5 h-5" />
                </Button>
              </Link>
            </div>
          </motion.div>
        </div>
      </section>

      {/* FOOTER */}
      <LandingFooter />
    </div>
  );
}
