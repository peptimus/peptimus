import { useState } from "react";
import { useAppStore } from "@/store/useAppStore";
import { NeonProgressBar } from "../ui/NeonProgressBar";
import { motion, AnimatePresence } from "framer-motion";
import { BrainCircuit, Activity, ChevronRight, MousePointerClick, Zap, Tag } from "lucide-react";

export function RightInsightsPanel() {
  const { selectedPeptide } = useAppStore();
  const [collapsed, setCollapsed] = useState(false);

  return (
    <>
      <button
        onClick={() => setCollapsed((v) => !v)}
        className="fixed right-0 top-1/2 -translate-y-1/2 z-40 xl:hidden flex items-center justify-center w-6 h-12 bg-sidebar border border-border rounded-l-lg text-muted-foreground hover:text-foreground transition-colors"
        aria-label="Toggle AI Insights"
      >
        <motion.div animate={{ rotate: collapsed ? 180 : 0 }} transition={{ duration: 0.25 }}>
          <ChevronRight className="w-3 h-3" />
        </motion.div>
      </button>

      <AnimatePresence initial={false}>
        {!collapsed && (
          <motion.aside
            key="insights-panel"
            initial={{ width: 0, opacity: 0 }}
            animate={{ width: 320, opacity: 1 }}
            exit={{ width: 0, opacity: 0 }}
            transition={{ duration: 0.28, ease: "easeInOut" }}
            className="h-[calc(100vh-4rem)] border-l border-border bg-sidebar/50 backdrop-blur-xl flex-shrink-0 flex flex-col overflow-hidden"
            style={{ minWidth: 0 }}
          >
            <div className="w-80 flex flex-col h-full">
              <div className="p-4 border-b border-border flex items-center gap-2">
                <BrainCircuit className="w-5 h-5 text-primary" />
                <h3 className="font-bold uppercase tracking-widest text-sm">AI Insights</h3>
                <div className="ml-auto flex items-center gap-2">
                  <div className={`w-2 h-2 rounded-full shadow-[0_0_8px_hsl(var(--primary))] ${selectedPeptide ? "bg-primary animate-pulse" : "bg-muted-foreground/40"}`} />
                  <button
                    onClick={() => setCollapsed(true)}
                    className="hidden xl:flex items-center justify-center w-5 h-5 text-muted-foreground hover:text-foreground transition-colors"
                    aria-label="Collapse panel"
                  >
                    <ChevronRight className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>

              <div className="flex-1 overflow-y-auto p-6 space-y-8">
                <AnimatePresence mode="wait">
                  {!selectedPeptide ? (
                    <motion.div
                      key="idle"
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -10 }}
                      transition={{ duration: 0.3 }}
                      className="flex flex-col items-center justify-center py-16 gap-4 text-center"
                    >
                      <div className="w-14 h-14 rounded-2xl border border-border bg-muted/20 flex items-center justify-center">
                        <MousePointerClick className="w-6 h-6 text-muted-foreground/50" />
                      </div>
                      <div>
                        <p className="text-sm font-mono text-muted-foreground/70 uppercase tracking-widest">
                          No sequence selected
                        </p>
                        <p className="text-xs text-muted-foreground/40 mt-1 leading-relaxed">
                          Click any peptide card in Library, Studio, Discover, or Research Feed
                        </p>
                      </div>
                      <div className="w-full border-t border-border/40 pt-6 text-left space-y-3">
                        {[
                          { label: "Binding Affinity", hint: "..." },
                          { label: "Stability Score", hint: "..." },
                          { label: "Toxicity", hint: "..." },
                        ].map(({ label, hint }) => (
                          <div key={label} className="flex justify-between items-center">
                            <span className="text-[10px] font-mono text-muted-foreground/30 uppercase tracking-wider">{label}</span>
                            <span className="text-xs font-mono text-muted-foreground/20">{hint}</span>
                          </div>
                        ))}
                        <div className="h-1.5 w-full bg-muted/20 rounded-full" />
                      </div>
                    </motion.div>
                  ) : (
                    <motion.div
                      key={selectedPeptide.id}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -10 }}
                      transition={{ duration: 0.3 }}
                      className="space-y-6"
                    >
                      <div>
                        <div className="flex items-center justify-between mb-1">
                          <h4 className="text-xs font-mono text-muted-foreground">TARGET SEQUENCE</h4>
                          <span className="text-[9px] font-mono text-primary/60 bg-primary/10 border border-primary/20 px-1.5 py-0.5 rounded uppercase tracking-wider">
                            {selectedPeptide.id}
                          </span>
                        </div>
                        <div className="p-3 bg-input rounded-md border border-primary/20 font-mono text-sm break-all text-primary/90 leading-relaxed tracking-widest">
                          {selectedPeptide.sequence}
                        </div>
                      </div>

                      <div className="space-y-5">
                        <h4 className="text-xs font-mono text-muted-foreground uppercase flex items-center gap-2">
                          <Activity className="w-3 h-3" />
                          Predicted Metrics
                        </h4>

                        <NeonProgressBar value={selectedPeptide.affinity} color="cyan" label="Binding Affinity" />
                        <NeonProgressBar value={selectedPeptide.stability} color="emerald" label="Stability Score" />
                        <NeonProgressBar value={selectedPeptide.toxicity} color="purple" label="Toxicity" />

                        <div className="pt-4 border-t border-border/50">
                          <div className="flex justify-between items-end mb-2">
                            <span className="text-xs font-mono text-muted-foreground uppercase tracking-wider">Evolution Score</span>
                            <span className="text-2xl font-bold text-foreground">{selectedPeptide.evolutionScore}</span>
                          </div>
                          <div className="h-2 w-full bg-muted rounded-full overflow-hidden">
                            <motion.div
                              className="h-full bg-gradient-to-r from-primary to-accent"
                              initial={{ width: 0 }}
                              animate={{ width: `${selectedPeptide.evolutionScore}%` }}
                              transition={{ duration: 0.6, ease: "easeOut" }}
                            />
                          </div>
                        </div>
                      </div>

                      {selectedPeptide.keyFeatures && selectedPeptide.keyFeatures.length > 0 && (
                        <div className="space-y-2">
                          <h4 className="text-xs font-mono text-muted-foreground uppercase flex items-center gap-2">
                            <Tag className="w-3 h-3" />
                            Key Features
                          </h4>
                          <div className="flex flex-wrap gap-1.5">
                            {selectedPeptide.keyFeatures.map((f) => (
                              <span
                                key={f}
                                className="text-[9px] font-mono px-2 py-0.5 rounded border border-primary/20 bg-primary/5 text-primary/70 uppercase tracking-wider"
                              >
                                {f}
                              </span>
                            ))}
                          </div>
                        </div>
                      )}

                      {selectedPeptide.mechanism && (
                        <div className="space-y-1.5">
                          <h4 className="text-xs font-mono text-muted-foreground uppercase flex items-center gap-2">
                            <Zap className="w-3 h-3" />
                            Mechanism
                          </h4>
                          <p className="text-xs text-muted-foreground/70 leading-relaxed font-mono">
                            {selectedPeptide.mechanism}
                          </p>
                        </div>
                      )}

                      {selectedPeptide.rationale && (
                        <div className="p-3 rounded-lg bg-primary/5 border border-primary/15 text-xs text-muted-foreground/80 leading-relaxed">
                          <strong className="text-primary/90 block mb-1 font-semibold">AI Rationale</strong>
                          {selectedPeptide.rationale}
                        </div>
                      )}

                      {!selectedPeptide.rationale && (
                        <div className="p-4 rounded-lg bg-primary/5 border border-primary/20 text-xs text-muted-foreground leading-relaxed">
                          <strong className="text-primary block mb-1">Neural Network Status</strong>
                          The predictive model continuously learns from community mints. High evolution scores indicate novel structures with stable predicted folding.
                        </div>
                      )}
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            </div>
          </motion.aside>
        )}
      </AnimatePresence>

      {collapsed && (
        <button
          onClick={() => setCollapsed(false)}
          className="hidden xl:flex items-center justify-center w-6 h-[calc(100vh-4rem)] border-l border-border bg-sidebar/50 text-muted-foreground hover:text-foreground hover:bg-sidebar transition-colors flex-shrink-0"
          aria-label="Expand AI Insights"
        >
          <ChevronRight className="w-3.5 h-3.5 rotate-180" />
        </button>
      )}
    </>
  );
}
