import { Switch, Route, Router as WouterRouter, useLocation } from "wouter";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import NotFound from "@/pages/not-found";
import { AnimatePresence, motion } from "framer-motion";
import { useEffect, type ReactNode } from "react";
import { useUnifiedWallet } from "@jup-ag/wallet-adapter";

import { LandingPage } from "@/pages/LandingPage";
import { FeaturesPage } from "@/pages/FeaturesPage";
import { HowItWorksPage } from "@/pages/HowItWorksPage";
import { EcosystemPage } from "@/pages/EcosystemPage";
import { LandingCommunityPage } from "@/pages/LandingCommunityPage";
import { PrivacyPage } from "@/pages/PrivacyPage";
import { TermsPage } from "@/pages/TermsPage";
import { ContactPage } from "@/pages/ContactPage";
import { AppShell } from "@/components/layout/AppShell";
import { DashboardPage } from "@/pages/app/DashboardPage";
import { EvolutionStudioPage } from "@/pages/app/EvolutionStudioPage";
import { LibraryPage } from "@/pages/app/LibraryPage";
import { DiscoverPage } from "@/pages/app/DiscoverPage";
import { CommunityPage } from "@/pages/app/CommunityPage";
import { ResearchFeedPage } from "@/pages/app/ResearchFeedPage";
import { BountyPage } from "@/pages/app/BountyPage";
import { PeptideDetailPage } from "@/pages/app/PeptideDetailPage";
import { ResearcherProfilePage } from "@/pages/app/ResearcherProfilePage";
import { PeptideComparisonPage } from "@/pages/app/PeptideComparisonPage";
import { WalletProvider } from "@/components/wallet/WalletProvider";
import { useAppStore } from "@/store/useAppStore";

const queryClient = new QueryClient({
  defaultOptions: {
    queries: { retry: 1, staleTime: 30_000 },
  },
});

const BASE_URL = (import.meta.env.BASE_URL || "/").replace(/\/$/, "");

function PageTransition({ children }: { children: ReactNode }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0, transition: { duration: 0.35 } }}
      exit={{ opacity: 0, y: -8, transition: { duration: 0.2 } }}
      style={{ height: "100%" }}
    >
      {children}
    </motion.div>
  );
}

function WalletSync() {
  const { publicKey, connected } = useUnifiedWallet();
  const { setWalletConnected, setWalletAddress } = useAppStore();

  useEffect(() => {
    if (connected && publicKey) {
      const address = publicKey.toBase58();
      setWalletConnected(true);
      setWalletAddress(address);
      fetch(`${BASE_URL}/api/users/register`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ walletAddress: address }),
      }).catch(console.error);
    } else {
      setWalletConnected(false);
      setWalletAddress("");
    }
  }, [connected, publicKey]);

  return null;
}

function AppRoutes() {
  const [location] = useLocation();
  return (
    <AppShell>
      <AnimatePresence mode="wait">
        <Switch key={location} location={location}>
          <Route path="/app/home">
            <PageTransition><DashboardPage /></PageTransition>
          </Route>
          <Route path="/app/studio">
            <PageTransition><EvolutionStudioPage /></PageTransition>
          </Route>
          <Route path="/app/library">
            <PageTransition><LibraryPage /></PageTransition>
          </Route>
          <Route path="/app/discover">
            <PageTransition><DiscoverPage /></PageTransition>
          </Route>
          <Route path="/app/community">
            <PageTransition><CommunityPage /></PageTransition>
          </Route>
          <Route path="/app/research">
            <PageTransition><ResearchFeedPage /></PageTransition>
          </Route>
          <Route path="/app/bounty">
            <PageTransition><BountyPage /></PageTransition>
          </Route>
          <Route path="/app/peptide/:id">
            <PageTransition><PeptideDetailPage /></PageTransition>
          </Route>
          <Route path="/app/profile/:wallet">
            <PageTransition><ResearcherProfilePage /></PageTransition>
          </Route>
          <Route path="/app/compare">
            <PageTransition><PeptideComparisonPage /></PageTransition>
          </Route>
          <Route path="/app">
            <PageTransition><DashboardPage /></PageTransition>
          </Route>
          <Route>
            <PageTransition><NotFound /></PageTransition>
          </Route>
        </Switch>
      </AnimatePresence>
    </AppShell>
  );
}

function Router() {
  const [location] = useLocation();
  const key = location.startsWith("/app") ? "app" : location;
  return (
    <AnimatePresence mode="wait">
      <Switch key={key} location={location}>
        <Route path="/">
          <PageTransition><LandingPage /></PageTransition>
        </Route>
        <Route path="/features">
          <PageTransition><FeaturesPage /></PageTransition>
        </Route>
        <Route path="/how-it-works">
          <PageTransition><HowItWorksPage /></PageTransition>
        </Route>
        <Route path="/ecosystem">
          <PageTransition><EcosystemPage /></PageTransition>
        </Route>
        <Route path="/community">
          <PageTransition><LandingCommunityPage /></PageTransition>
        </Route>
        <Route path="/privacy">
          <PageTransition><PrivacyPage /></PageTransition>
        </Route>
        <Route path="/terms">
          <PageTransition><TermsPage /></PageTransition>
        </Route>
        <Route path="/contact">
          <PageTransition><ContactPage /></PageTransition>
        </Route>
        <Route path="/app/*">
          <AppRoutes />
        </Route>
        <Route path="/app">
          <AppRoutes />
        </Route>
        <Route>
          <PageTransition><NotFound /></PageTransition>
        </Route>
      </Switch>
    </AnimatePresence>
  );
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <WalletProvider>
          <WalletSync />
          <WouterRouter base={import.meta.env.BASE_URL.replace(/\/$/, "")}>
            <Router />
          </WouterRouter>
          <Toaster />
        </WalletProvider>
      </TooltipProvider>
    </QueryClientProvider>
  );
}

export default App;
