import { useState } from "react";
import {
  Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select, SelectContent, SelectItem, SelectTrigger, SelectValue,
} from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Loader2, Fingerprint, FlaskConical, ExternalLink, Shield } from "lucide-react";

const BASE_URL = (import.meta.env.BASE_URL || "/").replace(/\/$/, "");

export interface IpnftMeta {
  therapeuticArea: string;
  developmentStage: string;
  institution: { name: string; department?: string; country?: string };
  ipType: string;
  researcherName?: string;
  researcherOrcid?: string;
  fundingTargetUsd?: number;
}

interface IPNFTFormProps {
  open: boolean;
  onOpenChange: (v: boolean) => void;
  peptide: { id: string; sequence: string; evolutionScore: number; affinity: number; stability: number; novelty: number };
  onConfirm: (meta: IpnftMeta) => Promise<void>;
  isMinting: boolean;
}

const THERAPEUTIC_AREAS = [
  "Longevity / Aging",
  "Oncology",
  "Neurology",
  "Immunology",
  "Infectious Disease",
  "Metabolic Disease",
  "Cardiovascular",
  "Rare Disease",
  "Other",
];

const STAGES = [
  { value: "preclinical", label: "Preclinical" },
  { value: "phase_1", label: "Phase I" },
  { value: "phase_2", label: "Phase II" },
  { value: "phase_3", label: "Phase III" },
  { value: "approved", label: "Approved" },
];

const IP_TYPES = [
  { value: "pre_patent", label: "Pre-Patent" },
  { value: "patent_pending", label: "Patent Pending" },
  { value: "granted_patent", label: "Granted Patent" },
  { value: "trade_secret", label: "Trade Secret" },
  { value: "data_package", label: "Data Package" },
];

export function IPNFTForm({ open, onOpenChange, peptide, onConfirm, isMinting }: IPNFTFormProps) {
  const [therapeuticArea, setTherapeuticArea] = useState("Longevity / Aging");
  const [developmentStage, setDevelopmentStage] = useState("preclinical");
  const [institutionName, setInstitutionName] = useState("");
  const [department, setDepartment] = useState("");
  const [country, setCountry] = useState("");
  const [ipType, setIpType] = useState("pre_patent");
  const [researcherName, setResearcherName] = useState("");
  const [researcherOrcid, setResearcherOrcid] = useState("");
  const [fundingTarget, setFundingTarget] = useState("");

  const contentHash = `sha256:${btoa(peptide.sequence + peptide.id).replace(/[^a-z0-9]/gi, "").slice(0, 64)}`;
  const metadataUri = `${window.location.origin}${BASE_URL}/api/peptides/${peptide.id}/metadata`;

  const handleSubmit = async () => {
    const meta: IpnftMeta = {
      therapeuticArea,
      developmentStage,
      institution: {
        name: institutionName || "Independent Research",
        department: department || undefined,
        country: country || undefined,
      },
      ipType,
      researcherName: researcherName || undefined,
      researcherOrcid: researcherOrcid || undefined,
      fundingTargetUsd: fundingTarget ? Number(fundingTarget) : undefined,
    };
    await onConfirm(meta);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl bg-card border-border text-foreground overflow-y-auto max-h-[90vh]">
        <DialogHeader>
          <div className="flex items-center gap-3 mb-1">
            <div className="w-8 h-8 rounded-lg bg-cyan-400/10 border border-cyan-400/30 flex items-center justify-center">
              <FlaskConical className="w-4 h-4 text-cyan-400" />
            </div>
            <div>
              <DialogTitle className="text-base font-bold uppercase tracking-widest text-foreground">
                Register as IP-NFT
              </DialogTitle>
              <DialogDescription className="text-xs text-muted-foreground font-mono">
                Molecule Protocol Standard · Biopharma IP Tokenization
              </DialogDescription>
            </div>
            <a
              href="https://molecule.xyz"
              target="_blank"
              rel="noopener noreferrer"
              className="ml-auto flex items-center gap-1 text-[10px] text-cyan-400/70 hover:text-cyan-400 transition-colors font-mono"
            >
              molecule.xyz <ExternalLink className="w-2.5 h-2.5" />
            </a>
          </div>
        </DialogHeader>

        <div className="space-y-5 pt-2">
          {/* Sequence preview */}
          <div className="bg-muted/30 border border-border/60 rounded-lg p-3 space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-[10px] font-mono text-muted-foreground uppercase tracking-widest">Asset</span>
              <Badge variant="outline" className="text-[9px] border-primary/30 text-primary bg-primary/5">
                PEPTIDE IP
              </Badge>
            </div>
            <div className="font-mono text-primary text-sm tracking-[0.15em] break-all">{peptide.sequence}</div>
            <div className="flex gap-4 text-[10px] font-mono text-muted-foreground">
              <span>AFFINITY <span className="text-foreground font-bold">{peptide.affinity}</span></span>
              <span>STABILITY <span className="text-foreground font-bold">{peptide.stability}</span></span>
              <span>NOVELTY <span className="text-foreground font-bold">{peptide.novelty}</span></span>
              <span>SCORE <span className="text-cyan-400 font-bold">{peptide.evolutionScore}</span></span>
            </div>
          </div>

          {/* Molecule metadata fields */}
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <Label className="text-xs font-mono uppercase tracking-wider text-muted-foreground">Therapeutic Area *</Label>
              <Select value={therapeuticArea} onValueChange={setTherapeuticArea}>
                <SelectTrigger className="bg-input border-border text-sm h-9">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent className="bg-card border-border">
                  {THERAPEUTIC_AREAS.map((a) => (
                    <SelectItem key={a} value={a} className="text-sm">{a}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-1.5">
              <Label className="text-xs font-mono uppercase tracking-wider text-muted-foreground">Development Stage *</Label>
              <Select value={developmentStage} onValueChange={setDevelopmentStage}>
                <SelectTrigger className="bg-input border-border text-sm h-9">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent className="bg-card border-border">
                  {STAGES.map((s) => (
                    <SelectItem key={s.value} value={s.value} className="text-sm">{s.label}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-1.5">
              <Label className="text-xs font-mono uppercase tracking-wider text-muted-foreground">IP Type *</Label>
              <Select value={ipType} onValueChange={setIpType}>
                <SelectTrigger className="bg-input border-border text-sm h-9">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent className="bg-card border-border">
                  {IP_TYPES.map((t) => (
                    <SelectItem key={t.value} value={t.value} className="text-sm">{t.label}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-1.5">
              <Label className="text-xs font-mono uppercase tracking-wider text-muted-foreground">Funding Target (USD)</Label>
              <Input
                value={fundingTarget}
                onChange={(e) => setFundingTarget(e.target.value)}
                placeholder="e.g. 500000"
                type="number"
                className="bg-input border-border text-sm h-9"
              />
            </div>

            <div className="space-y-1.5">
              <Label className="text-xs font-mono uppercase tracking-wider text-muted-foreground">Institution</Label>
              <Input
                value={institutionName}
                onChange={(e) => setInstitutionName(e.target.value)}
                placeholder="e.g. MIT, Stanford, Independent"
                className="bg-input border-border text-sm h-9"
              />
            </div>

            <div className="space-y-1.5">
              <Label className="text-xs font-mono uppercase tracking-wider text-muted-foreground">Department</Label>
              <Input
                value={department}
                onChange={(e) => setDepartment(e.target.value)}
                placeholder="e.g. Biochemistry Lab"
                className="bg-input border-border text-sm h-9"
              />
            </div>

            <div className="space-y-1.5">
              <Label className="text-xs font-mono uppercase tracking-wider text-muted-foreground">Country</Label>
              <Input
                value={country}
                onChange={(e) => setCountry(e.target.value)}
                placeholder="e.g. United States"
                className="bg-input border-border text-sm h-9"
              />
            </div>

            <div className="space-y-1.5">
              <Label className="text-xs font-mono uppercase tracking-wider text-muted-foreground">Researcher Name</Label>
              <Input
                value={researcherName}
                onChange={(e) => setResearcherName(e.target.value)}
                placeholder="Dr. Jane Smith"
                className="bg-input border-border text-sm h-9"
              />
            </div>

            <div className="col-span-2 space-y-1.5">
              <Label className="text-xs font-mono uppercase tracking-wider text-muted-foreground">ORCID iD</Label>
              <Input
                value={researcherOrcid}
                onChange={(e) => setResearcherOrcid(e.target.value)}
                placeholder="0000-0000-0000-0000"
                className="bg-input border-border text-sm h-9 font-mono"
              />
            </div>
          </div>

          {/* Auto-generated agreements section */}
          <div className="bg-muted/20 border border-border/40 rounded-lg p-3 space-y-2">
            <div className="flex items-center gap-2 text-[10px] font-mono text-muted-foreground uppercase tracking-widest">
              <Shield className="w-3 h-3" />
              Auto-generated IP License Agreement
            </div>
            <div className="grid grid-cols-2 gap-x-4 gap-y-1 text-[10px] font-mono">
              <div className="text-muted-foreground">Type</div>
              <div className="text-foreground">peptide_research_license</div>
              <div className="text-muted-foreground">Metadata URI</div>
              <div className="text-cyan-400 truncate">{metadataUri.slice(0, 40)}…</div>
              <div className="text-muted-foreground">Content Hash</div>
              <div className="text-emerald-400 truncate">{contentHash.slice(0, 32)}…</div>
              <div className="text-muted-foreground">Encrypted</div>
              <div className="text-foreground">false (public)</div>
            </div>
          </div>

          <div className="flex gap-3 pt-2">
            <Button
              variant="outline"
              onClick={() => onOpenChange(false)}
              className="flex-1 border-border text-muted-foreground"
              disabled={isMinting}
            >
              Cancel
            </Button>
            <Button
              onClick={handleSubmit}
              disabled={isMinting}
              className="flex-1 bg-cyan-500 hover:bg-cyan-400 text-black font-bold uppercase tracking-wider"
            >
              {isMinting ? (
                <><Loader2 className="mr-2 h-4 w-4 animate-spin" /> Minting IP-NFT...</>
              ) : (
                <><Fingerprint className="mr-2 h-4 w-4" /> Mint IP-NFT</>
              )}
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
