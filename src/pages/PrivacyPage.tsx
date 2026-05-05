import { motion } from "framer-motion";
import { Shield } from "lucide-react";
import { LandingHeader } from "@/components/landing/LandingHeader";
import { LandingFooter } from "@/components/landing/LandingFooter";

function fadeUp(delay = 0) {
  return { initial: { opacity: 0, y: 28 }, whileInView: { opacity: 1, y: 0 }, viewport: { once: true }, transition: { duration: 0.6, delay } };
}

const SECTIONS = [
  {
    title: "Information We Collect",
    body: "Peptimus collects only the data necessary to operate the protocol. This includes your Solana wallet address (public key) when you connect your wallet, peptide sequences and associated metadata you generate or submit, and on-chain transaction data that is publicly available on the Solana blockchain. We do not collect names, email addresses, or any personally identifiable information.",
  },
  {
    title: "How We Use Your Data",
    body: "Wallet addresses are used solely to associate peptide discoveries with their creators and to enable IP-NFT minting on Solana. Peptide sequences and scores are stored in our database to power the community library, research feed, and bounty evaluation. We do not sell, rent, or share your data with third parties for marketing purposes.",
  },
  {
    title: "On-Chain Data",
    body: "All IP-NFTs minted through Peptimus are recorded immutably on the Solana blockchain. This data — including wallet addresses, mint addresses, and metadata — is publicly visible to anyone. Peptimus has no ability to delete or alter on-chain records once minted.",
  },
  {
    title: "AI-Generated Content",
    body: "Peptide sequences are generated using OpenAI's API. Input prompts and generated sequences may be processed by OpenAI in accordance with their data usage policies. We do not intentionally submit personally identifiable information to AI providers.",
  },
  {
    title: "Cookies and Analytics",
    body: "Peptimus does not use tracking cookies or third-party analytics tools. We may collect anonymized usage metrics (page visits, feature usage) for product improvement purposes only.",
  },
  {
    title: "Data Retention",
    body: "Peptide data and associated wallet addresses are retained indefinitely to maintain the integrity of the community research library. You may request deletion of off-chain data associated with your wallet by contacting us at hello@peptimus.xyz. On-chain data cannot be deleted.",
  },
  {
    title: "Security",
    body: "We implement industry-standard security practices including encrypted database connections, API key management, and access controls. However, no system is completely secure. Use of the protocol is at your own risk.",
  },
  {
    title: "Changes to This Policy",
    body: "We may update this Privacy Policy as the protocol evolves. Significant changes will be announced via our official X account (@peptimusdotxyz). Continued use of Peptimus after changes constitutes acceptance of the updated policy.",
  },
  {
    title: "Contact",
    body: "For privacy-related inquiries, contact us at hello@peptimus.xyz.",
  },
];

export function PrivacyPage() {
  return (
    <div className="min-h-screen" style={{ background: "linear-gradient(160deg,#0a0f1c 0%,#050714 100%)" }}>
      <LandingHeader />
      <div className="pt-24 pb-24 max-w-3xl mx-auto px-6 lg:px-12 space-y-16">

        <motion.div {...fadeUp()} className="space-y-4 pt-8">
          <div className="flex items-center gap-3 text-cyan-400/60">
            <Shield className="w-5 h-5" />
            <span className="text-xs font-mono uppercase tracking-widest">Legal</span>
          </div>
          <h1 className="text-4xl md:text-5xl font-black leading-tight text-white">Privacy Policy</h1>
          <p className="text-white/40 text-sm font-mono">Last updated: May 2026</p>
          <p className="text-white/50 text-base leading-relaxed">
            Peptimus is a decentralized protocol. We believe in minimal data collection, on-chain transparency, and researcher sovereignty. This policy explains what we collect and why.
          </p>
        </motion.div>

        <div className="space-y-10">
          {SECTIONS.map((s, i) => (
            <motion.div key={s.title} {...fadeUp(i * 0.05)} className="space-y-3 border-l-2 border-cyan-400/20 pl-6">
              <h2 className="text-base font-black uppercase tracking-widest text-white">{s.title}</h2>
              <p className="text-white/45 text-sm leading-relaxed">{s.body}</p>
            </motion.div>
          ))}
        </div>
      </div>
      <LandingFooter />
    </div>
  );
}
