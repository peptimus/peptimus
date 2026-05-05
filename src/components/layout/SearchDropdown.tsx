import { useState, useEffect, useRef } from "react";
import { Search, FlaskConical, Loader2, X } from "lucide-react";
import { useLocation } from "wouter";
import { motion, AnimatePresence } from "framer-motion";

const BASE_URL = (import.meta.env.BASE_URL || "/").replace(/\/$/, "");

interface Result {
  id: string;
  sequence: string;
  evolutionScore: number;
  affinity: number;
  stability: number;
  creatorWallet: string | null;
  mintAddress: string | null;
  ipnftMeta: { therapeuticArea?: string } | null;
}

export function SearchDropdown() {
  const [query, setQuery] = useState("");
  const [results, setResults] = useState<Result[]>([]);
  const [loading, setLoading] = useState(false);
  const [open, setOpen] = useState(false);
  const [, navigate] = useLocation();
  const inputRef = useRef<HTMLInputElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (query.trim().length < 2) {
      setResults([]);
      setOpen(false);
      return;
    }
    const timer = setTimeout(async () => {
      setLoading(true);
      try {
        const res = await fetch(`${BASE_URL}/api/search?q=${encodeURIComponent(query)}&limit=6`);
        const data = await res.json();
        setResults(Array.isArray(data) ? data : []);
        setOpen(true);
      } catch {
        setResults([]);
      } finally {
        setLoading(false);
      }
    }, 280);
    return () => clearTimeout(timer);
  }, [query]);

  useEffect(() => {
    function handleClick(e: MouseEvent) {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
        setOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClick);
    return () => document.removeEventListener("mousedown", handleClick);
  }, []);

  const goTo = (id: string) => {
    setOpen(false);
    setQuery("");
    navigate(`/app/peptide/${id}`);
  };

  const clear = () => { setQuery(""); setOpen(false); inputRef.current?.focus(); };

  return (
    <div ref={containerRef} className="relative w-full">
      <div className="relative">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground pointer-events-none" />
        <input
          ref={inputRef}
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          onFocus={() => results.length > 0 && setOpen(true)}
          placeholder="Search sequences, IDs, areas..."
          className="w-full h-9 bg-input border border-border rounded-full pl-10 pr-9 text-sm font-mono focus:outline-none focus:ring-1 focus:ring-primary focus:border-primary transition-all placeholder:text-muted-foreground/50 text-foreground"
        />
        {query && (
          <button onClick={clear} className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors">
            {loading ? <Loader2 className="h-3.5 w-3.5 animate-spin" /> : <X className="h-3.5 w-3.5" />}
          </button>
        )}
      </div>

      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, y: -4, scale: 0.98 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -4, scale: 0.98 }}
            transition={{ duration: 0.15 }}
            className="absolute top-full mt-2 left-0 right-0 bg-card border border-border rounded-xl shadow-2xl overflow-hidden z-50"
          >
            {results.length === 0 && !loading ? (
              <div className="p-4 text-center text-muted-foreground text-xs font-mono">No results for "{query}"</div>
            ) : (
              <div>
                <div className="px-3 py-2 border-b border-border/50 flex items-center justify-between">
                  <span className="text-[10px] font-mono text-muted-foreground uppercase tracking-widest">{results.length} results</span>
                  <span className="text-[10px] font-mono text-muted-foreground/50">press Enter to search all</span>
                </div>
                {results.map((r) => (
                  <button
                    key={r.id}
                    onClick={() => goTo(r.id)}
                    className="w-full flex items-center gap-3 px-3 py-2.5 hover:bg-muted/40 transition-colors text-left border-b border-border/30 last:border-0"
                  >
                    <div className="w-8 h-8 rounded-lg bg-primary/10 border border-primary/20 flex items-center justify-center shrink-0">
                      <FlaskConical className="w-3.5 h-3.5 text-primary" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2">
                        <span className="font-mono text-xs text-primary truncate">{r.sequence.slice(0, 14)}{r.sequence.length > 14 ? "…" : ""}</span>
                        {r.ipnftMeta?.therapeuticArea && (
                          <span className="text-[9px] font-mono text-cyan-400/70 bg-cyan-950/30 border border-cyan-500/20 px-1.5 py-0.5 rounded shrink-0">{r.ipnftMeta.therapeuticArea}</span>
                        )}
                        {r.mintAddress && (
                          <span className="text-[9px] font-mono text-emerald-400/70 bg-emerald-950/30 border border-emerald-500/20 px-1.5 py-0.5 rounded shrink-0">IP-NFT</span>
                        )}
                      </div>
                      <div className="text-[10px] text-muted-foreground font-mono">{r.id} · score {r.evolutionScore}</div>
                    </div>
                  </button>
                ))}
              </div>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
