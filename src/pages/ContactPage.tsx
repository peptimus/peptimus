import { motion } from "framer-motion";
import { MessageCircle, Github, Globe2, Mail } from "lucide-react";
import { LandingHeader } from "@/components/landing/LandingHeader";
import { LandingFooter } from "@/components/landing/LandingFooter";

function fadeUp(delay = 0) {
  return { initial: { opacity: 0, y: 28 }, whileInView: { opacity: 1, y: 0 }, viewport: { once: true }, transition: { duration: 0.6, delay } };
}

const CHANNELS = [
  {
    icon: (
      <svg className="w-5 h-5" viewBox="0 0 24 24" fill="currentColor">
        <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-4.714-6.231-5.401 6.231H2.748l7.73-8.835L1.254 2.25H8.08l4.259 5.63 5.905-5.63zm-1.161 17.52h1.833L7.084 4.126H5.117z"/>
      </svg>
    ),
    color: "#00f5ff",
    label: "X / Twitter",
    handle: "@peptimusdotxyz",
    desc: "Announcements, protocol updates, and community discussion.",
    href: "https://x.com/peptimusdotxyz",
  },
  {
    icon: <Github className="w-5 h-5" />,
    color: "#8b5cf6",
    label: "GitHub",
    handle: "peptimusdev",
    desc: "Open issues, contribute code, or review the protocol source.",
    href: "https://github.com/orgs/peptimus/repositories",
  },
  {
    icon: <Mail className="w-5 h-5" />,
    color: "#00ff9f",
    label: "Email",
    handle: "hello@peptimus.xyz",
    desc: "Business inquiries, partnership proposals, and press.",
    href: "mailto:hello@peptimus.xyz",
  },
  {
    icon: <Globe2 className="w-5 h-5" />,
    color: "#f59e0b",
    label: "Protocol",
    handle: "peptimus.xyz",
    desc: "Launch the app, explore the library, and mint your first IP-NFT.",
    href: "https://peptimus.xyz/app",
  },
];

export function ContactPage() {
  return (
    <div className="min-h-screen" style={{ background: "linear-gradient(160deg,#0a0f1c 0%,#050714 100%)" }}>
      <LandingHeader />
      <div className="pt-24 pb-24 max-w-3xl mx-auto px-6 lg:px-12 space-y-16">

        <motion.div {...fadeUp()} className="space-y-4 pt-8">
          <div className="flex items-center gap-3 text-purple-400/60">
            <MessageCircle className="w-5 h-5" />
            <span className="text-xs font-mono uppercase tracking-widest">Contact</span>
          </div>
          <h1 className="text-4xl md:text-5xl font-black leading-tight text-white">Get in Touch</h1>
          <p className="text-white/50 text-base leading-relaxed">
            Peptimus is an open protocol. Whether you're a researcher, developer, or pharma partner — we want to hear from you.
          </p>
        </motion.div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
          {CHANNELS.map((c, i) => (
            <motion.a
              key={c.label}
              {...fadeUp(i * 0.08)}
              href={c.href}
              target={c.href.startsWith("mailto") ? undefined : "_blank"}
              rel="noopener noreferrer"
              className="rounded-2xl border border-white/8 bg-white/[0.02] p-6 space-y-4 hover:border-white/15 hover:bg-white/[0.04] transition-all group block"
            >
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl flex items-center justify-center border border-white/10" style={{ color: c.color, background: `${c.color}10` }}>
                  {c.icon}
                </div>
                <div>
                  <div className="text-xs font-mono text-white/30 uppercase tracking-widest">{c.label}</div>
                  <div className="text-sm font-bold text-white group-hover:text-white transition-colors" style={{ color: c.color }}>{c.handle}</div>
                </div>
              </div>
              <p className="text-white/40 text-sm leading-relaxed">{c.desc}</p>
            </motion.a>
          ))}
        </div>

        <motion.div {...fadeUp(0.3)} className="rounded-2xl border border-white/8 bg-white/[0.02] p-8 space-y-3 text-center">
          <div className="text-xs font-mono text-white/30 uppercase tracking-widest">For researchers</div>
          <p className="text-white/50 text-sm leading-relaxed max-w-lg mx-auto">
            If you're working on peptide therapeutics and want to collaborate, access the raw API, or integrate Peptimus into your research pipeline — reach out directly at <span className="text-cyan-400">hello@peptimus.xyz</span>.
          </p>
        </motion.div>
      </div>
      <LandingFooter />
    </div>
  );
}
