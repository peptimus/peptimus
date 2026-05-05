export interface PeptideVariant {
  id: string;
  sequence: string;
  affinity: number;
  stability: number;
  novelty: number;
  toxicity: number;
  evolutionScore: number;
  rationale?: string;
  mechanism?: string;
  keyFeatures?: string[];
}

export interface DesignInterpretation {
  goal: string;
  therapeuticArea: string;
  targetMechanism: string;
  designStrategy: string;
}

export interface ResearchFeedItem {
  id: string;
  action: string;
  peptideId: string;
  timestamp: string;
  researcher: string;
}

export interface BioNFT {
  id: string;
  sequence: string;
  affinity: number;
  stability: number;
  mintedAt: string;
  owned: boolean;
}
