import { PeptideVariant, ResearchFeedItem, BioNFT } from "../types/peptide";

export const AMINO_ACIDS = "ACDEFGHIKLMNPQRSTVWY";

export function generateVariants(seed: string): PeptideVariant[] {
  const variants: PeptideVariant[] = [];
  const numVariants = Math.floor(Math.random() * 3) + 6; // 6 to 8 variants

  for (let i = 0; i < numVariants; i++) {
    let newSeq = seed.split("");
    const numMutations = Math.floor(Math.random() * 3) + 1;
    for (let j = 0; j < numMutations; j++) {
      const idx = Math.floor(Math.random() * newSeq.length);
      const aa = AMINO_ACIDS[Math.floor(Math.random() * AMINO_ACIDS.length)];
      newSeq[idx] = aa;
    }
    
    variants.push({
      id: `var-${Math.random().toString(36).substring(2, 9)}`,
      sequence: newSeq.join(""),
      affinity: Math.floor(Math.random() * 40) + 60,
      stability: Math.floor(Math.random() * 40) + 60,
      novelty: Math.floor(Math.random() * 50) + 50,
      toxicity: Math.floor(Math.random() * 30),
      evolutionScore: Math.floor(Math.random() * 30) + 70,
    });
  }

  return variants;
}

const actions = ["Evolving", "Completed evolution of", "Minted BioNFT for", "Synthesizing"];
const researchers = ["@0xNeonBio", "@dr_chain", "@synth_god", "@bio_hacker", "@ptm_whale"];

export function generateResearchFeedItems(): ResearchFeedItem[] {
  const items: ResearchFeedItem[] = [];
  for (let i = 0; i < 15; i++) {
    items.push({
      id: `feed-${Math.random().toString(36).substring(2, 9)}`,
      action: actions[Math.floor(Math.random() * actions.length)],
      peptideId: `PEP-${Math.floor(Math.random() * 900) + 100}`,
      timestamp: new Date(Date.now() - Math.floor(Math.random() * 10000000)).toISOString(),
      researcher: researchers[Math.floor(Math.random() * researchers.length)],
    });
  }
  return items;
}

export function generateLibraryNFTs(): BioNFT[] {
  const nfts: BioNFT[] = [];
  const num = Math.floor(Math.random() * 5) + 8; // 8 to 12

  for (let i = 0; i < num; i++) {
    let seq = "";
    for (let j = 0; j < 10; j++) {
      seq += AMINO_ACIDS[Math.floor(Math.random() * AMINO_ACIDS.length)];
    }
    nfts.push({
      id: `nft-${Math.random().toString(36).substring(2, 9)}`,
      sequence: seq,
      affinity: Math.floor(Math.random() * 30) + 70,
      stability: Math.floor(Math.random() * 30) + 70,
      mintedAt: new Date(Date.now() - Math.floor(Math.random() * 100000000)).toISOString(),
      owned: Math.random() > 0.7,
    });
  }
  return nfts;
}
