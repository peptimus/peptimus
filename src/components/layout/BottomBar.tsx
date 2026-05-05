import { Link, useLocation } from "wouter";
import { Activity, Compass, FlaskConical, Database, Trophy } from "lucide-react";
import { cn } from "@/lib/utils";
import { motion } from "framer-motion";

const navItems = [
  { href: "/app/home",     label: "Home",    icon: Activity },
  { href: "/app/discover", label: "Discover",icon: Compass },
  { href: "/app/studio",   label: "Studio",  icon: FlaskConical, featured: true },
  { href: "/app/library",  label: "Library", icon: Database },
  { href: "/app/bounty",   label: "Bounty",  icon: Trophy },
];

export function BottomBar() {
  const [location] = useLocation();

  return (
    <nav className="lg:hidden fixed bottom-0 left-0 right-0 z-50 bg-background/95 backdrop-blur-xl border-t border-border/60">
      <div className="flex items-end justify-around px-2 pt-2 pb-3">
        {navItems.map((item) => {
          const isActive =
            location === item.href ||
            (item.href === "/app/home" && location === "/app") ||
            (item.href === "/app/studio" && location.startsWith("/app/peptide"));
          const Icon = item.icon;

          if (item.featured) {
            return (
              <Link key={item.href} href={item.href}>
                <div className="flex flex-col items-center gap-1 -mt-5 cursor-pointer">
                  <div
                    className={cn(
                      "w-14 h-14 rounded-2xl flex items-center justify-center shadow-lg transition-all duration-200",
                      isActive
                        ? "bg-primary shadow-[0_0_20px_hsl(var(--primary)/0.6)]"
                        : "bg-primary/80 shadow-[0_0_12px_hsl(var(--primary)/0.3)] hover:bg-primary"
                    )}
                  >
                    <Icon className="w-6 h-6 text-primary-foreground" />
                  </div>
                  <span
                    className={cn(
                      "text-[10px] font-bold tracking-wider uppercase transition-colors",
                      isActive ? "text-primary" : "text-muted-foreground"
                    )}
                  >
                    {item.label}
                  </span>
                </div>
              </Link>
            );
          }

          return (
            <Link key={item.href} href={item.href}>
              <div className="flex flex-col items-center gap-1 px-1 cursor-pointer relative">
                {isActive && (
                  <motion.div
                    layoutId="bottomBarActive"
                    className="absolute -top-2 left-1/2 -translate-x-1/2 w-8 h-0.5 rounded-full bg-primary shadow-[0_0_8px_hsl(var(--primary))]"
                    transition={{ type: "spring", stiffness: 380, damping: 30 }}
                  />
                )}
                <div
                  className={cn(
                    "w-10 h-10 rounded-xl flex items-center justify-center transition-all duration-200",
                    isActive ? "bg-primary/15" : "hover:bg-muted/50"
                  )}
                >
                  <Icon
                    className={cn(
                      "w-5 h-5 transition-colors",
                      isActive ? "text-primary" : "text-muted-foreground"
                    )}
                  />
                </div>
                <span
                  className={cn(
                    "text-[10px] font-bold tracking-wider uppercase transition-colors",
                    isActive ? "text-primary" : "text-muted-foreground"
                  )}
                >
                  {item.label}
                </span>
              </div>
            </Link>
          );
        })}
      </div>
    </nav>
  );
}
