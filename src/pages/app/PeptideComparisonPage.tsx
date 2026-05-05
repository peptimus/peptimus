import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Search, X, FlaskConical, ArrowLeftRight, Download, Trophy, CheckCircle2 } from "lucide-react";
import { MoleculeViewer } from "@/components/molecules/MoleculeViewer";
import { NeonProgressBar } from "@/components/ui/NeonProgressBar";
import { Link } from "wouter";

const BASE_URL = (import.meta.env.BASE_URL || "/").replace(/\/$/, "");

interface Peptide {
  id: string;
  sequence: string;
  seedSequence: string;
  affinity: number;
  stability: number;
  novelty: number;
  toxicity: number;
  evolutionScore: number;
  creatorWallet: string | null;
  mintAddress: string | null;
  therapeuticArea: string | null;
  mechanism: string | null;
  ipnftMeta: { therapeuticArea?: string } | null;
  createdAt: string;
}

const AREA_COLORS: Record<string, string> = {
  "Anticancer": "text-rose-400 bg-rose-950/40 border-rose-500/20",
  "Antimicrobial": "text-emerald-400 bg-emerald-950/40 border-emerald-500/20",
  "Anti-infective": "text-emerald-400 bg-emerald-950/40 border-emerald-500/20",
  "Antiviral": "text-cyan-400 bg-cyan-950/40 border-cyan-500/20",
  "Metabolic Disease": "text-amber-400 bg-amber-950/40 border-amber-500/20",
  "Drug Delivery": "text-purple-400 bg-purple-950/40 border-purple-500/20",
  "Neurology": "text-violet-400 bg-violet-950/40 border-violet-500/20",
};

function areaStyle(area: string | null | undefined) {
  if (!area) return "text-muted-foreground bg-muted/40 border-border";
  return AREA_COLORS[area] ?? "text-primary bg-primary/10 border-primary/20";
}

function PeptideSelector({
  label, selected, onSelect, onClear, allPeptides, disabledId,
}: {
  label: string;
  selected: Peptide | null;
  onSelect: (p: Peptide) => void;
  onClear: () => void;
  allPeptides: Peptide[];
  disabledId: string | null;
}) {
  const [query, setQuery] = useState("");

  const filtered = allPeptides.filter((p) => {
    if (p.id === disabledId) return false;
    if (!query.trim()) return true;
    const q = query.toLowerCase();
    return (
      p.sequence.toLowerCase().includes(q) ||
      p.id.toLowerCase().includes(q) ||
      (p.therapeuticArea ?? "").toLowerCase().includes(q)
    );
  });

  if (selected) {
    const area = selected.therapeuticArea ?? selected.ipnftMeta?.therapeuticArea ?? null;
    return (
      <div className="bg-card border border-primary/30 rounded-2xl overflow-hidden">
        <div className="p-3 border-b border-border/50 flex items-center justify-between bg-primary/5">
          <div className="flex items-center gap-2">
            <CheckCircle2 className="w-3.5 h-3.5 text-primary" />
            <span className="text-[10px] font-mono text-primary uppercase tracking-widest font-bold">{label}: Selected</span>
          </div>
          <button onClick={onClear} className="text-muted-foreground hover:text-red-400 transition-colors p-1 rounded">
            <X className="w-3.5 h-3.5" />
          </button>
        </div>
        <MoleculeViewer sequence={selected.sequence} size="small" />
        <div className="p-4 space-y-2">
          <div className="font-mono text-xs text-primary tracking-widest break-all leading-relaxed">{selected.sequence}</div>
          <div className="text-[10px] text-muted-foreground font-mono">{selected.id}</div>
          {area && (
            <span className={`text-[9px] font-mono px-2 py-0.5 rounded-full border uppercase tracking-wider ${areaStyle(area)}`}>{area}</span>
          )}
          {selected.mechanism && (
            <p className="text-[10px] text-muted-foreground/70 leading-snug line-clamp-2">{selected.mechanism}</p>
          )}
          <div className="grid grid-cols-4 gap-2 pt-2 border-t border-border/50">
            {[
              { label: "Score", val: selected.evolutionScore, color: "#00f5ff" },
              { label: "Affinity", val: selected.affinity, color: "#00ff9f" },
              { label: "Stability", val: selected.stability, color: "#8b5cf6" },
              { label: "Toxicity", val: selected.toxicity, color: "#f87171" },
            ].map(({ label, val, color }) => (
              <div key={label} className="text-center">
                <div className="text-[8px] text-muted-foreground font-mono uppercase">{label}</div>
                <div className="font-bold text-xs" style={{ color }}>{val}</div>
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-card border border-border rounded-2xl overflow-hidden flex flex-col">
      <div className="p-4 border-b border-border/50 space-y-3">
        <div className="text-[10px] font-mono text-muted-foreground uppercase tracking-widest font-bold">{label}</div>
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-muted-foreground" />
          <input
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Filter by sequence, ID, or area…"
            className="w-full h-9 bg-input border border-border rounded-lg pl-9 pr-3 text-sm font-mono focus:outline-none focus:ring-1 focus:ring-primary text-foreground placeholder:text-muted-foreground/50"
          />
          {query && (
            <button onClick={() => setQuery("")} className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground">
              <X className="w-3 h-3" />
            </button>
          )}
        </div>
      </div>

      <div className="divide-y divide-border/30 max-h-72 overflow-y-auto">
        {filtered.length === 0 ? (
          <div className="py-8 text-center text-muted-foreground/40 font-mono text-xs">
            {allPeptides.length === 0 ? "Loading library…" : "No peptides match"}
          </div>
        ) : (
          filtered.map((p) => {
            const area = p.therapeuticArea ?? p.ipnftMeta?.therapeuticArea ?? null;
            return (
              <button
                key={p.id}
                onClick={() => { onSelect(p); setQuery(""); }}
                className="w-full flex items-center gap-3 px-4 py-3 hover:bg-muted/30 transition-colors text-left group"
              >
                <div className="w-8 h-8 rounded-lg bg-primary/10 border border-primary/20 flex items-center justify-center shrink-0 group-hover:border-primary/50 transition-colors">
                  <FlaskConical className="w-3.5 h-3.5 text-primary" />
                </div>
                <div className="min-w-0 flex-1">
                  <div className="flex items-center gap-2 flex-wrap">
                    <span className="font-mono text-xs text-primary font-bold truncate">{p.sequence.slice(0, 14)}{p.sequence.length > 14 ? "…" : ""}</span>
                    {area && (
                      <span className={`text-[8px] font-mono px-1.5 py-0 rounded-full border uppercase tracking-wider shrink-0 ${areaStyle(area)}`}>{area}</span>
                    )}
                  </div>
                  <div className="flex items-center gap-2 mt-0.5">
                    <span className="text-[10px] text-muted-foreground font-mono">{p.id}</span>
                    <span className="text-[10px] font-mono text-primary/70">· {p.evolutionScore}</span>
                  </div>
                </div>
              </button>
            );
          })
        )}
      </div>
    </div>
  );
}

function MetricRow({ label, a, b, higherBetter = true }: { label: string; a: number; b: number; higherBetter?: boolean }) {
  const aWins = higherBetter ? a >= b : a <= b;
  const bWins = higherBetter ? b > a : b < a;
  const color = (wins: boolean) => wins ? "text-emerald-400" : "text-muted-foreground";
  return (
    <div className="grid grid-cols-[1fr_auto_1fr] items-center gap-3 py-2.5 border-b border-border/30 last:border-0">
      <div className={`text-right text-sm font-bold font-mono ${color(aWins)}`}>
        {a}
        {aWins && a !== b && <Trophy className="w-3 h-3 inline ml-1 text-yellow-400" />}
      </div>
      <div className="text-center text-[10px] font-mono text-muted-foreground uppercase tracking-wider w-20 shrink-0">{label}</div>
      <div className={`text-left text-sm font-bold font-mono ${color(bWins)}`}>
        {bWins && a !== b && <Trophy className="w-3 h-3 inline mr-1 text-yellow-400" />}
        {b}
      </div>
    </div>
  );
}

function downloadFastaComparison(a: Peptide, b: Peptide) {
  const text = `>${a.id} | score=${a.evolutionScore}\n${a.sequence}\n\n>${b.id} | score=${b.evolutionScore}\n${b.sequence}`;
  const blob = new Blob([text], { type: "text/plain" });
  const url = URL.createObjectURL(blob);
  const el = document.createElement("a");
  el.href = url; el.download = "comparison.fasta"; el.click();
  URL.revokeObjectURL(url);
}

export function PeptideComparisonPage() {
  const [peptideA, setPeptideA] = useState<Peptide | null>(null);
  const [peptideB, setPeptideB] = useState<Peptide | null>(null);
  const [allPeptides, setAllPeptides] = useState<Peptide[]>([]);

  useEffect(() => {
    fetch(`${BASE_URL}/api/peptides`)
      .then((r) => r.json())
      .then((d) => setAllPeptides(Array.isArray(d) ? d : []))
      .catch(() => {});
  }, []);

  const winner = peptideA && peptideB
    ? peptideA.evolutionScore >= peptideB.evolutionScore ? "A" : "B"
    : null;

  return (
    <div className="max-w-5xl mx-auto space-y-8 pb-16">
      <div className="space-y-1">
        <h1 className="text-3xl font-bold uppercase tracking-widest text-primary flex items-center gap-3">
          <ArrowLeftRight className="w-8 h-8" />
          Compare Peptides
        </h1>
        <p className="text-muted-foreground text-sm">
          Pick two peptides from your library to compare side-by-side across all predicted properties.
          {allPeptides.length > 0 && (
            <span className="ml-1 text-primary/60">{allPeptides.length} peptides available.</span>
          )}
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        <PeptideSelector
          label="Peptide A"
          selected={peptideA}
          onSelect={setPeptideA}
          onClear={() => setPeptideA(null)}
          allPeptides={allPeptides}
          disabledId={peptideB?.id ?? null}
        />
        <PeptideSelector
          label="Peptide B"
          selected={peptideB}
          onSelect={setPeptideB}
          onClear={() => setPeptideB(null)}
          allPeptides={allPeptides}
          disabledId={peptideA?.id ?? null}
        />
      </div>

      <AnimatePresence>
        {peptideA && peptideB && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0 }}
            className="space-y-5"
          >
            {winner && (
              <div className={`flex items-center justify-center gap-3 p-4 rounded-2xl border ${winner === "A" ? "border-primary/30 bg-primary/5" : "border-accent/30 bg-accent/5"}`}>
                <Trophy className="w-5 h-5 text-yellow-400" />
                <span className="font-bold text-foreground">
                  Peptide {winner} leads with evolution score {winner === "A" ? peptideA.evolutionScore : peptideB.evolutionScore}
                </span>
                <button
                  onClick={() => downloadFastaComparison(peptideA, peptideB)}
                  className="ml-auto flex items-center gap-1.5 text-[10px] font-mono font-bold border border-border text-muted-foreground hover:text-foreground px-3 py-1.5 rounded-lg transition-all"
                >
                  <Download className="w-3 h-3" /> FASTA
                </button>
              </div>
            )}

            <div className="bg-card border border-border rounded-2xl overflow-hidden">
              <div className="grid grid-cols-[1fr_auto_1fr] bg-muted/20 border-b border-border">
                <div className="text-center p-3">
                  <span className="text-[10px] font-mono font-bold text-primary uppercase tracking-widest">Peptide A</span>
                  <div className="font-mono text-xs text-muted-foreground mt-0.5 truncate px-2">{peptideA.id}</div>
                  {(peptideA.therapeuticArea ?? peptideA.ipnftMeta?.therapeuticArea) && (
                    <span className={`mt-1 inline-block text-[8px] font-mono px-2 py-0 rounded-full border uppercase tracking-wider ${areaStyle(peptideA.therapeuticArea)}`}>
                      {peptideA.therapeuticArea ?? peptideA.ipnftMeta?.therapeuticArea}
                    </span>
                  )}
                </div>
                <div className="flex items-center justify-center px-2 border-x border-border">
                  <ArrowLeftRight className="w-4 h-4 text-muted-foreground" />
                </div>
                <div className="text-center p-3">
                  <span className="text-[10px] font-mono font-bold text-accent uppercase tracking-widest">Peptide B</span>
                  <div className="font-mono text-xs text-muted-foreground mt-0.5 truncate px-2">{peptideB.id}</div>
                  {(peptideB.therapeuticArea ?? peptideB.ipnftMeta?.therapeuticArea) && (
                    <span className={`mt-1 inline-block text-[8px] font-mono px-2 py-0 rounded-full border uppercase tracking-wider ${areaStyle(peptideB.therapeuticArea)}`}>
                      {peptideB.therapeuticArea ?? peptideB.ipnftMeta?.therapeuticArea}
                    </span>
                  )}
                </div>
              </div>

              <div className="p-5 space-y-0">
                <MetricRow label="Evolution" a={peptideA.evolutionScore} b={peptideB.evolutionScore} />
                <MetricRow label="Affinity" a={peptideA.affinity} b={peptideB.affinity} />
                <MetricRow label="Stability" a={peptideA.stability} b={peptideB.stability} />
                <MetricRow label="Novelty" a={peptideA.novelty} b={peptideB.novelty} />
                <MetricRow label="Toxicity" a={peptideA.toxicity} b={peptideB.toxicity} higherBetter={false} />
                <MetricRow label="Length" a={peptideA.sequence.length} b={peptideB.sequence.length} />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              {([
                { p: peptideA, label: "A", color: "cyan" as const },
                { p: peptideB, label: "B", color: "purple" as const },
              ]).map(({ p, label, color }) => (
                <div key={label} className="bg-card border border-border rounded-2xl p-5 space-y-3">
                  <div className="text-[10px] font-mono font-bold uppercase tracking-widest text-muted-foreground mb-3">Peptide {label} Metrics</div>
                  <NeonProgressBar value={p.evolutionScore} label="Evolution Score" color={color} />
                  <NeonProgressBar value={p.affinity} label="Binding Affinity" color="cyan" />
                  <NeonProgressBar value={p.stability} label="Stability" color="emerald" />
                  <NeonProgressBar value={p.novelty} label="Novelty" color="purple" />
                  <div className="pt-2 border-t border-border/50 flex items-center justify-between">
                    <span className="text-[10px] text-muted-foreground font-mono">{p.sequence.length} residues</span>
                    <Link href={`/app/peptide/${p.id}`}>
                      <span className="text-[10px] font-mono text-primary hover:text-primary/80 cursor-pointer">View full detail →</span>
                    </Link>
                  </div>
                </div>
              ))}
            </div>

            <div className="bg-card border border-border rounded-2xl p-5 space-y-3">
              <div className="text-[10px] font-mono font-bold uppercase tracking-widest text-muted-foreground">Sequence Alignment</div>
              <div className="overflow-x-auto">
                <div className="font-mono text-xs space-y-2 min-w-0">
                  <div className="flex items-start gap-3">
                    <span className="text-primary font-bold w-4 shrink-0">A</span>
                    <div className="break-all leading-relaxed tracking-widest text-primary">{peptideA.sequence}</div>
                  </div>
                  <div className="flex items-start gap-3">
                    <span className="text-accent font-bold w-4 shrink-0">B</span>
                    <div className="break-all leading-relaxed tracking-widest text-accent">{peptideB.sequence}</div>
                  </div>
                  <div className="flex items-start gap-3">
                    <span className="text-muted-foreground w-4 shrink-0"> </span>
                    <div className="break-all leading-relaxed tracking-widest text-emerald-400">
                      {Array.from({ length: Math.max(peptideA.sequence.length, peptideB.sequence.length) }).map((_, i) =>
                        peptideA.sequence[i] && peptideB.sequence[i] && peptideA.sequence[i] === peptideB.sequence[i] ? "|" : " "
                      ).join("")}
                    </div>
                  </div>
                </div>
              </div>
              <div className="flex items-center gap-4 text-[10px] font-mono text-muted-foreground">
                <span>
                  Identity:{" "}
                  <span className="text-emerald-400 font-bold">
                    {Math.round(
                      Array.from({ length: Math.min(peptideA.sequence.length, peptideB.sequence.length) })
                        .filter((_, i) => peptideA.sequence[i] === peptideB.sequence[i]).length /
                        Math.max(peptideA.sequence.length, peptideB.sequence.length) * 100
                    )}%
                  </span>
                </span>
                <span>|</span>
                <span>Length diff: <span className="text-foreground font-bold">{Math.abs(peptideA.sequence.length - peptideB.sequence.length)} aa</span></span>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {(!peptideA || !peptideB) && allPeptides.length > 0 && (
        <div className="text-center py-8 text-muted-foreground/30 font-mono text-sm">
          {!peptideA && !peptideB
            ? "Select two peptides from the panels above to begin comparison"
            : `Select one more peptide to compare against ${peptideA ? "Peptide A" : "Peptide B"}`}
        </div>
      )}
    </div>
  );
}
