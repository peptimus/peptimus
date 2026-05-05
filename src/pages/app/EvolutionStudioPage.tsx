import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useAppStore } from "@/store/useAppStore";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { PeptideCard } from "@/components/peptide/PeptideCard";
import { DesignResultCard } from "@/components/peptide/DesignResultCard";
import { PeptideVariant, DesignInterpretation } from "@/types/peptide";
import {
  Sparkles, BrainCircuit, ScanSearch, Database, Activity,
  FlaskConical, Target, ChevronRight, Microscope, Dna, BookOpen,
} from "lucide-react";

const BASE_URL = (import.meta.env.BASE_URL || "/").replace(/\/$/, "");

type Mode = "natural" | "expert";

const EXAMPLE_GOALS = [
  "Design an antimicrobial peptide to fight drug-resistant bacterial infections",
  "Create a peptide that promotes wound healing with minimal toxicity",
  "Generate a GLP-1 receptor agonist candidate for metabolic disease research",
  "Design a cell-penetrating peptide for intracellular drug delivery",
  "Optimize a peptide inhibitor targeting cancer cell growth",
];

const NATURAL_STEPS = [
  { message: "Interpreting research goal...", icon: BookOpen },
  { message: "Consulting biomedical literature...", icon: Database },
  { message: "Running de novo design algorithms...", icon: BrainCircuit },
  { message: "Predicting binding properties...", icon: Target },
  { message: "Ranking by therapeutic potential...", icon: Activity },
];

const EXPERT_STEPS = [
  { message: "Scanning peptide databases...", icon: Database },
  { message: "Running neural network model...", icon: BrainCircuit },
  { message: "Executing evolutionary search...", icon: ScanSearch },
  { message: "Ranking candidates...", icon: Activity },
];

const THERAPEUTIC_AREA_COLORS: Record<string, string> = {
  "Anti-infective": "text-emerald-400 bg-emerald-950/40 border-emerald-500/20",
  "Oncology": "text-rose-400 bg-rose-950/40 border-rose-500/20",
  "Metabolic": "text-amber-400 bg-amber-950/40 border-amber-500/20",
  "Neurology": "text-purple-400 bg-purple-950/40 border-purple-500/20",
  "Cardiovascular": "text-red-400 bg-red-950/40 border-red-500/20",
  "Immunology": "text-blue-400 bg-blue-950/40 border-blue-500/20",
  "Dermatology": "text-pink-400 bg-pink-950/40 border-pink-500/20",
  "Regenerative": "text-teal-400 bg-teal-950/40 border-teal-500/20",
  "Endocrinology": "text-orange-400 bg-orange-950/40 border-orange-500/20",
};

function areaClass(area: string) {
  return THERAPEUTIC_AREA_COLORS[area] ?? "text-cyan-400 bg-cyan-950/40 border-cyan-500/20";
}

export function EvolutionStudioPage() {
  const [mode, setMode] = useState<Mode>("natural");

  const [goal, setGoal] = useState("");
  const [seed, setSeed] = useState("DRFGDKDIAF");

  const [isRunning, setIsRunning] = useState(false);
  const [loadingStep, setLoadingStep] = useState(0);

  const [variants, setVariants] = useState<PeptideVariant[]>([]);
  const [interpretation, setInterpretation] = useState<DesignInterpretation | null>(null);
  const [error, setError] = useState<string | null>(null);

  const { setSelectedPeptide, walletAddress } = useAppStore();

  const steps = mode === "natural" ? NATURAL_STEPS : EXPERT_STEPS;

  const reset = () => {
    setVariants([]);
    setInterpretation(null);
    setError(null);
    setSelectedPeptide(null);
  };

  const runNatural = async () => {
    if (!goal.trim()) return;
    setIsRunning(true);
    setLoadingStep(0);
    reset();
    const interval = setInterval(() => setLoadingStep((p) => Math.min(p + 1, NATURAL_STEPS.length - 1)), 1100);
    try {
      const res = await fetch(`${BASE_URL}/api/peptides/design`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ goal, creatorWallet: walletAddress || undefined }),
      });
      if (!res.ok) {
        const body = await res.json().catch(() => ({}));
        throw new Error(body.error ?? `Server error ${res.status}`);
      }
      const data = await res.json();
      setVariants(data.variants ?? []);
      setInterpretation(data.interpretation ?? null);
    } catch (err: any) {
      setError(err?.message ?? "AI design failed. Please try again.");
    } finally {
      clearInterval(interval);
      setIsRunning(false);
    }
  };

  const runExpert = async () => {
    if (!seed.trim()) return;
    setIsRunning(true);
    setLoadingStep(0);
    reset();
    const interval = setInterval(() => setLoadingStep((p) => Math.min(p + 1, EXPERT_STEPS.length - 1)), 900);
    try {
      const res = await fetch(`${BASE_URL}/api/peptides/evolve`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ seed, creatorWallet: walletAddress || undefined }),
      });
      if (!res.ok) throw new Error(`Server error: ${res.status}`);
      const data = await res.json();
      setVariants(data.variants ?? []);
    } catch (err: any) {
      setError(err?.message ?? "AI evolution failed. Please try again.");
    } finally {
      clearInterval(interval);
      setIsRunning(false);
    }
  };

  const handleSubmit = mode === "natural" ? runNatural : runExpert;
  const canSubmit = mode === "natural" ? goal.trim().length >= 5 : seed.trim().length >= 3;

  return (
    <div className="max-w-5xl mx-auto space-y-8 pb-16">
      <div className="space-y-1">
        <h1 className="text-3xl font-bold uppercase tracking-widest text-primary flex items-center gap-3">
          <Sparkles className="w-8 h-8" />
          AI Design Studio
        </h1>
        <p className="text-muted-foreground text-sm">
          Describe what you need or provide a seed sequence. The AI handles the science.
        </p>
      </div>

      <div className="flex gap-1 p-1 bg-muted/30 border border-border rounded-xl w-fit">
        {(["natural", "expert"] as Mode[]).map((m) => (
          <button
            key={m}
            onClick={() => { setMode(m); reset(); }}
            className={`flex items-center gap-2 px-5 py-2.5 rounded-lg text-sm font-bold uppercase tracking-widest transition-all ${
              mode === m
                ? "bg-primary text-primary-foreground shadow-[0_0_12px_hsl(var(--primary)/0.3)]"
                : "text-muted-foreground hover:text-foreground"
            }`}
          >
            {m === "natural" ? <><Microscope className="w-4 h-4" />Research Goal</> : <><Dna className="w-4 h-4" />Sequence Mode</>}
          </button>
        ))}
      </div>

      <AnimatePresence mode="wait">
        {mode === "natural" ? (
          <motion.div key="natural" initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -8 }}>
            <div className="bg-card border border-border rounded-2xl overflow-hidden shadow-lg">
              <div className="p-6 border-b border-border/60 bg-gradient-to-r from-primary/5 to-transparent">
                <div className="flex items-start gap-4">
                  <div className="w-10 h-10 rounded-xl bg-primary/10 border border-primary/20 flex items-center justify-center shrink-0 mt-0.5">
                    <BrainCircuit className="w-5 h-5 text-primary" />
                  </div>
                  <div>
                    <h2 className="font-bold text-foreground mb-0.5">Describe Your Research Goal</h2>
                    <p className="text-muted-foreground text-sm leading-relaxed">
                      Tell the AI what you're trying to achieve. No technical knowledge required. The system will design peptide sequences from scratch.
                    </p>
                  </div>
                </div>
              </div>

              <div className="p-6 space-y-5">
                <div className="space-y-2">
                  <Textarea
                    value={goal}
                    onChange={(e) => setGoal(e.target.value)}
                    className="min-h-[120px] resize-none text-sm leading-relaxed bg-input border-border focus-visible:ring-primary placeholder:text-muted-foreground/50"
                    placeholder="e.g. Design an antimicrobial peptide that kills drug-resistant bacteria while being safe for human cells…"
                  />
                  <div className="flex justify-between items-center text-[10px] font-mono text-muted-foreground/60">
                    <span>{goal.length} chars</span>
                    <span>min 5 characters</span>
                  </div>
                </div>

                <div className="space-y-2">
                  <p className="text-[10px] font-mono text-muted-foreground uppercase tracking-widest">Example Goals</p>
                  <div className="flex flex-wrap gap-2">
                    {EXAMPLE_GOALS.map((eg) => (
                      <button
                        key={eg}
                        onClick={() => setGoal(eg)}
                        className="flex items-center gap-1.5 text-xs text-muted-foreground hover:text-primary border border-border hover:border-primary/40 bg-muted/30 hover:bg-primary/5 rounded-lg px-3 py-1.5 transition-all text-left max-w-xs"
                      >
                        <ChevronRight className="w-3 h-3 shrink-0" />
                        <span className="truncate">{eg}</span>
                      </button>
                    ))}
                  </div>
                </div>

                <div className="flex justify-end pt-2">
                  <Button
                    size="lg"
                    onClick={runNatural}
                    disabled={isRunning || !canSubmit}
                    className="bg-primary text-primary-foreground hover:bg-primary/90 font-bold tracking-widest uppercase transition-all min-w-[220px] shadow-[0_0_20px_hsl(var(--primary)/0.25)]"
                  >
                    {isRunning ? "Designing…" : <><Sparkles className="w-4 h-4 mr-2" />Design Peptides</>}
                  </Button>
                </div>
              </div>
            </div>
          </motion.div>
        ) : (
          <motion.div key="expert" initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -8 }}>
            <div className="bg-card border border-border rounded-2xl p-6 shadow-lg relative overflow-hidden">
              <div className="absolute top-0 right-0 p-4 opacity-5 pointer-events-none">
                <BrainCircuit className="w-32 h-32 text-primary" />
              </div>
              <div className="relative z-10 space-y-4">
                <div className="space-y-1">
                  <label className="text-[10px] font-mono uppercase tracking-widest text-muted-foreground">Seed Amino Acid Sequence</label>
                  <p className="text-xs text-muted-foreground/70">
                    Enter a known peptide sequence. The AI will generate optimized variants with point mutations.
                  </p>
                </div>
                <Textarea
                  value={seed}
                  onChange={(e) => setSeed(e.target.value.toUpperCase().replace(/[^ACDEFGHIKLMNPQRSTVWY]/g, ""))}
                  className="font-mono text-lg tracking-[0.2em] bg-input border-border focus-visible:ring-primary text-primary min-h-[90px] resize-none"
                  placeholder="ACDEFGHIKLMNPQRSTVWY…"
                />
                <div className="text-[10px] font-mono text-muted-foreground/50 flex gap-4">
                  <span>{seed.length} residues</span>
                  <span>Valid: ACDEFGHIKLMNPQRSTVWY</span>
                </div>
                <div className="flex justify-end pt-2">
                  <Button
                    size="lg"
                    onClick={runExpert}
                    disabled={isRunning || !canSubmit}
                    className="bg-primary text-primary-foreground hover:bg-primary/90 font-bold tracking-widest uppercase min-w-[220px]"
                  >
                    {isRunning ? "Evolving…" : <><FlaskConical className="w-4 h-4 mr-2" />Evolve Sequence</>}
                  </Button>
                </div>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {error && (
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="bg-red-950/30 border border-red-500/30 rounded-xl p-4 text-red-400 text-sm font-mono text-center">
          {error}
        </motion.div>
      )}

      <AnimatePresence mode="wait">
        {isRunning && (
          <motion.div
            key="loading"
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            className="flex flex-col items-center justify-center py-16 space-y-8"
          >
            <div className="relative w-28 h-28 flex items-center justify-center">
              <div className="absolute inset-0 rounded-full border-4 border-primary/20 border-t-primary animate-spin" />
              <div className="absolute inset-3 rounded-full border-4 border-secondary/15 border-b-secondary animate-[spin_2.2s_linear_reverse_infinite]" />
              <div className="absolute inset-6 rounded-full border-4 border-accent/15 border-l-accent animate-[spin_3.5s_linear_infinite]" />
              <BrainCircuit className="w-7 h-7 text-primary animate-pulse" />
            </div>

            <div className="w-full max-w-xs space-y-2">
              {steps.map((step, i) => {
                const Icon = step.icon;
                const done = i < loadingStep;
                const active = i === loadingStep;
                return (
                  <motion.div
                    key={i}
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: active || done ? 1 : 0.3, x: 0 }}
                    className={`flex items-center gap-3 px-4 py-2.5 rounded-lg transition-all ${active ? "bg-primary/10 border border-primary/20" : ""}`}
                  >
                    <Icon className={`w-4 h-4 shrink-0 ${done ? "text-emerald-400" : active ? "text-primary animate-pulse" : "text-muted-foreground/30"}`} />
                    <span className={`text-xs font-mono tracking-wide ${done ? "text-emerald-400" : active ? "text-primary" : "text-muted-foreground/30"}`}>
                      {step.message}
                    </span>
                    {done && <span className="ml-auto text-emerald-400 text-xs">✓</span>}
                  </motion.div>
                );
              })}
            </div>
          </motion.div>
        )}

        {!isRunning && variants.length > 0 && (
          <motion.div key="results" initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-6">
            {interpretation && (
              <motion.div
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                className="bg-card border border-border rounded-2xl p-6 space-y-4"
              >
                <div className="flex items-center gap-2 mb-2">
                  <Target className="w-4 h-4 text-primary" />
                  <h3 className="text-sm font-bold uppercase tracking-widest text-foreground">AI Research Interpretation</h3>
                  <span className={`ml-auto text-[10px] font-mono font-bold px-2.5 py-1 rounded-full border uppercase tracking-wider ${areaClass(interpretation.therapeuticArea)}`}>
                    {interpretation.therapeuticArea}
                  </span>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
                  <div className="space-y-1">
                    <div className="text-[10px] font-mono text-muted-foreground uppercase tracking-widest">Scientific Goal</div>
                    <div className="text-foreground text-sm leading-relaxed">{interpretation.goal}</div>
                  </div>
                  <div className="space-y-1">
                    <div className="text-[10px] font-mono text-muted-foreground uppercase tracking-widest">Target Mechanism</div>
                    <div className="text-cyan-400 text-sm font-medium">{interpretation.targetMechanism}</div>
                  </div>
                  <div className="space-y-1">
                    <div className="text-[10px] font-mono text-muted-foreground uppercase tracking-widest">Design Strategy</div>
                    <div className="text-muted-foreground text-sm leading-relaxed">{interpretation.designStrategy}</div>
                  </div>
                </div>
              </motion.div>
            )}

            <div className="flex justify-between items-center border-b border-border pb-3">
              <h2 className="text-lg font-bold uppercase tracking-wider flex items-center gap-2">
                <FlaskConical className="w-5 h-5 text-primary" />
                {mode === "natural" ? "AI-Designed Candidates" : "Evolved Variants"}
              </h2>
              <span className="text-xs font-mono text-muted-foreground">{variants.length} SEQUENCES GENERATED</span>
            </div>

            {mode === "natural" ? (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                {variants.map((variant, i) => (
                  <DesignResultCard key={variant.id} variant={variant} index={i} />
                ))}
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
                {variants.map((variant, i) => (
                  <PeptideCard key={variant.id} variant={variant} index={i} />
                ))}
              </div>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
