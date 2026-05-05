import { Link, useLocation } from "wouter";
import { Activity, FlaskConical, Database, Compass, Users, Newspaper, Trophy, ArrowLeftRight } from "lucide-react";
import { cn } from "@/lib/utils";
import { useAppStore } from "@/store/useAppStore";
import { motion, AnimatePresence } from "framer-motion";

const navItems = [
  { href: "/app/home",     label: "Home",             icon: Activity },
  { href: "/app/discover", label: "Discover",          icon: Compass },
  { href: "/app/studio",   label: "AI Design Studio",  icon: FlaskConical },
  { href: "/app/library",  label: "Library",           icon: Database },
  { href: "/app/compare",  label: "Compare",           icon: ArrowLeftRight },
  { href: "/app/bounty",   label: "Bounty Program",    icon: Trophy },
  { href: "/app/community",label: "Community",          icon: Users },
  { href: "/app/research", label: "Research Feed",      icon: Newspaper },
];

export function LeftSidebar() {
  const [location] = useLocation();
  const { sidebarOpen } = useAppStore();

  return (
    <AnimatePresence initial={false}>
      {sidebarOpen && (
        <motion.aside
          initial={{ width: 0, opacity: 0 }}
          animate={{ width: 240, opacity: 1 }}
          exit={{ width: 0, opacity: 0 }}
          transition={{ duration: 0.3, ease: "easeInOut" }}
          className="h-[calc(100vh-4rem)] border-r border-border bg-sidebar overflow-hidden flex-shrink-0 z-30 relative"
        >
          <div className="w-[240px] h-full flex flex-col overflow-y-auto">
            <div className="px-6 pt-6 pb-4 text-xs font-mono text-muted-foreground uppercase tracking-widest sticky top-0 bg-sidebar z-10">
              Main Menu
            </div>
            <nav className="flex flex-col gap-2 px-3 flex-1">
              {navItems.map((item) => {
                const isActive = location === item.href;
                const Icon = item.icon;
                return (
                  <Link key={item.href} href={item.href}>
                    <div className={cn(
                      "flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-all cursor-pointer relative group",
                      isActive 
                        ? "text-primary bg-primary/10" 
                        : "text-sidebar-foreground hover:text-foreground hover:bg-muted/50"
                    )}>
                      <Icon className={cn("w-5 h-5", isActive ? "text-primary" : "text-sidebar-foreground group-hover:text-foreground")} />
                      <span className="tracking-wide">{item.label}</span>
                      {isActive && (
                        <motion.div
                          layoutId="activeNav"
                          className="absolute left-0 top-0 bottom-0 w-1 bg-primary rounded-r-full shadow-[0_0_10px_hsl(var(--primary))]"
                        />
                      )}
                    </div>
                  </Link>
                );
              })}
            </nav>
            
            <div className="px-6 mt-auto">
              <div className="p-4 rounded-xl bg-card border border-border/50 relative overflow-hidden">
                <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-primary via-secondary to-accent" />
                <h4 className="text-xs font-bold uppercase tracking-wider mb-2 text-foreground">Network Status</h4>
                <div className="flex items-center gap-2 text-xs text-muted-foreground font-mono mb-1">
                  <div className="w-2 h-2 rounded-full bg-secondary animate-pulse shadow-[0_0_5px_hsl(var(--secondary))]" />
                  Solana Mainnet
                </div>
                <div className="flex items-center gap-2 text-xs text-muted-foreground font-mono">
                  <div className="w-2 h-2 rounded-full bg-primary animate-pulse shadow-[0_0_5px_hsl(var(--primary))]" />
                  AI Model Online
                </div>
              </div>
            </div>
          </div>
        </motion.aside>
      )}
    </AnimatePresence>
  );
}
