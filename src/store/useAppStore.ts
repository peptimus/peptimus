import { create } from "zustand";
import { PeptideVariant } from "../types/peptide";

interface AppState {
  walletConnected: boolean;
  walletAddress: string;
  setWalletConnected: (connected: boolean) => void;
  setWalletAddress: (address: string) => void;
  connectWallet: () => void;
  disconnectWallet: () => void;
  selectedPeptide: PeptideVariant | null;
  setSelectedPeptide: (p: PeptideVariant | null) => void;
  sidebarOpen: boolean;
  toggleSidebar: () => void;
  mintedNFTs: string[];
  addMintedNFT: (seq: string) => void;
}

export const useAppStore = create<AppState>((set) => ({
  walletConnected: false,
  walletAddress: "",
  setWalletConnected: (connected) => set({ walletConnected: connected }),
  setWalletAddress: (address) => set({ walletAddress: address }),
  connectWallet: () => set({ walletConnected: true }),
  disconnectWallet: () => set({ walletConnected: false, walletAddress: "" }),
  selectedPeptide: null,
  setSelectedPeptide: (p) => set({ selectedPeptide: p }),
  sidebarOpen: typeof window !== "undefined" ? window.innerWidth >= 768 : true,
  toggleSidebar: () => set((state) => ({ sidebarOpen: !state.sidebarOpen })),
  mintedNFTs: [],
  addMintedNFT: (seq) => set((state) => ({ mintedNFTs: [...state.mintedNFTs, seq] })),
}));
