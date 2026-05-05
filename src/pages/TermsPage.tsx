import { motion } from "framer-motion";
import { FileText } from "lucide-react";
import { LandingHeader } from "@/components/landing/LandingHeader";
import { LandingFooter } from "@/components/landing/LandingFooter";

function fadeUp(delay = 0) {
  return { initial: { opacity: 0, y: 28 }, whileInView: { opacity: 1, y: 0 }, viewport: { once: true }, transition: { duration: 0.6, delay } };
}

const SECTIONS = [
  {
    title: "Acceptance of Terms",
    body: "By accessing or using Peptimus (peptimus.xyz), you agree to be bound by these Terms of Service. If you do not agree, do not use the platform. These terms apply to all users, including researchers, developers, and visitors.",
  },
  {
    title: "Protocol Description",
    body: "Peptimus is a decentralized AI-powered peptide design and IP-NFT minting platform built on the Solana blockchain. It enables users to generate peptide sequences using AI, evaluate them for therapeutic potential, and register them as on-chain intellectual property NFTs following the IP-NFT framework.",
  },
  {
    title: "Eligibility",
    body: "You must be at least 18 years of age to use Peptimus. By using the platform, you represent that you have the legal capacity to enter into binding agreements in your jurisdiction. The platform is not available in jurisdictions where use would be prohibited by applicable law.",
  },
  {
    title: "Wallet and Account",
    body: "Access to the Peptimus app requires connecting a Solana-compatible wallet. You are solely responsible for the security of your wallet and private keys. Peptimus never has access to your private keys. Loss of wallet access means loss of access to associated IP-NFTs — we cannot recover them.",
  },
  {
    title: "IP-NFT Ownership",
    body: "When you mint an IP-NFT on Peptimus, the on-chain asset is owned by the wallet that signed the transaction. Peptimus does not claim ownership of your peptide discoveries. However, you acknowledge that AI-generated sequences may not be eligible for traditional patent protection in all jurisdictions. Consult a qualified IP attorney before asserting legal rights.",
  },
  {
    title: "Bounty Program",
    body: "Bounty rewards are denominated in $PTMS governance tokens. Token distribution is subject to mainnet token deployment. Peptimus reserves the right to modify bounty criteria, reward amounts, and evaluation methodology. Participation in bounties does not guarantee reward receipt.",
  },
  {
    title: "Prohibited Conduct",
    body: "You may not use Peptimus to: submit sequences intended to harm humans or animals; attempt to exploit, hack, or disrupt the protocol; impersonate other researchers or fabricate data; violate applicable export control, sanctions, or biosecurity regulations.",
  },
  {
    title: "Disclaimer of Warranties",
    body: "Peptimus is provided as-is without warranties of any kind, express or implied. AI-generated peptide sequences are experimental and have not been clinically validated. Nothing on this platform constitutes medical, pharmaceutical, or investment advice.",
  },
  {
    title: "Limitation of Liability",
    body: "To the maximum extent permitted by law, Peptimus and its contributors shall not be liable for any indirect, incidental, or consequential damages arising from your use of the platform, including loss of digital assets, IP disputes, or AI output errors.",
  },
  {
    title: "Governing Law",
    body: "These Terms are governed by applicable decentralized protocol norms and, where legally required, the laws of the jurisdiction in which the protocol operators are established. Disputes shall be resolved through good-faith negotiation before any formal legal process.",
  },
  {
    title: "Changes to Terms",
    body: "We may update these Terms as the protocol evolves. Updates will be announced via @peptimusdotxyz on X. Continued use of the platform after changes constitutes acceptance.",
  },
];

export function TermsPage() {
  return (
    <div className="min-h-screen" style={{ background: "linear-gradient(160deg,#0a0f1c 0%,#050714 100%)" }}>
      <LandingHeader />
      <div className="pt-24 pb-24 max-w-3xl mx-auto px-6 lg:px-12 space-y-16">

        <motion.div {...fadeUp()} className="space-y-4 pt-8">
          <div className="flex items-center gap-3 text-emerald-400/60">
            <FileText className="w-5 h-5" />
            <span className="text-xs font-mono uppercase tracking-widest">Legal</span>
          </div>
          <h1 className="text-4xl md:text-5xl font-black leading-tight text-white">Terms of Service</h1>
          <p className="text-white/40 text-sm font-mono">Last updated: May 2026</p>
          <p className="text-white/50 text-base leading-relaxed">
            These terms govern your use of the Peptimus protocol. Please read them carefully before connecting your wallet or minting IP-NFTs.
          </p>
        </motion.div>

        <div className="space-y-10">
          {SECTIONS.map((s, i) => (
            <motion.div key={s.title} {...fadeUp(i * 0.05)} className="space-y-3 border-l-2 border-emerald-400/20 pl-6">
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
