import { Link } from "wouter";
import { Button } from "@/components/ui/button";

const NAV_LINKS = [
  { label: "Features", href: "/features" },
  { label: "How It Works", href: "/how-it-works" },
  { label: "Ecosystem", href: "/ecosystem" },
  { label: "Community", href: "/community" },
];

export function LandingHeader() {
  return (
    <header className="fixed top-0 left-0 right-0 z-50 px-6 lg:px-16 py-4 flex items-center justify-between border-b border-white/5 backdrop-blur-xl bg-[#0a0f1c]/80">
      <Link href="/">
        <div className="flex items-center gap-3 cursor-pointer">
          <img
            src={`${import.meta.env.BASE_URL}logo-nobg.png`}
            alt="Peptimus"
            className="w-9 h-9 rounded-xl object-cover shadow-[0_0_14px_rgba(0,245,255,0.3)]"
          />
          <span className="font-black text-lg tracking-wider text-white">Peptimus</span>
        </div>
      </Link>
      <div className="flex items-center gap-6">
        <nav className="hidden md:flex items-center gap-6">
          {NAV_LINKS.map((item) => (
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
          >
            Launch App
          </Button>
        </Link>
      </div>
    </header>
  );
}
