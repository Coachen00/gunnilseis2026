import { lazy, Suspense } from "react";
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { Loader2 } from "lucide-react";
import AuthGuard from "./components/AuthGuard";
import Layout from "./components/Layout";
import ErrorBoundary from "./components/ErrorBoundary";
import { createAppQueryClient } from "./lib/queryClient";

// Login är inte lazy — det är första sidan oinloggade ser, ingen vinst i splitting.
import Login from "./pages/Login";

// Innehållsidor — lazy så vi inte skickar 800 KB JS för en första sidladdning på mobil.
const Hem = lazy(() => import("./pages/Hem"));
const Period1 = lazy(() => import("./pages/Period1"));
const Spelide = lazy(() => import("./pages/Spelide"));
const MajSpelmodell = lazy(() => import("./pages/MajSpelmodell"));
const Forsvar = lazy(() => import("./pages/Forsvar"));
const Anfall = lazy(() => import("./pages/Anfall"));
const Fasta = lazy(() => import("./pages/Fasta"));
const Roller = lazy(() => import("./pages/Roller"));
const Identitet = lazy(() => import("./pages/Identitet"));
const Verktyg = lazy(() => import("./pages/Verktyg"));
const UnderProcess = lazy(() => import("./pages/UnderProcess"));
const UnderProcessDeck = lazy(() => import("./pages/UnderProcessDeck"));
const SpelmodellLab = lazy(() => import("./pages/SpelmodellLab"));
const OmstallningForsvar = lazy(() => import("./pages/OmstallningForsvar"));
const OmstallningAnfall = lazy(() => import("./pages/OmstallningAnfall"));
const FastaForsvar = lazy(() => import("./pages/FastaForsvar"));
const FastaAnfall = lazy(() => import("./pages/FastaAnfall"));
const MatchForra = lazy(() => import("./pages/MatchForra"));
const MatchKommande = lazy(() => import("./pages/MatchKommande"));
const MatchReflektioner = lazy(() => import("./pages/MatchReflektioner"));
const Spelarvard = lazy(() => import("./pages/Spelarvard"));
const Truppen = lazy(() => import("./pages/Truppen"));
const Matcher = lazy(() => import("./pages/Matcher"));
const Tavlingar = lazy(() => import("./pages/Tavlingar"));

// Print-optimerade verktygsidor — egna chunks; sällan besökta men tunga.
const TrainingPlan = lazy(() => import("./pages/TrainingPlan"));
const Matchblad = lazy(() => import("./pages/Matchblad"));
const Motstandaranalys = lazy(() => import("./pages/Motstandaranalys"));
const Taktiktavla = lazy(() => import("./pages/Taktiktavla"));
const Admin = lazy(() => import("./pages/Admin"));
const NotFound = lazy(() => import("./pages/NotFound"));

const queryClient = createAppQueryClient();

const PageFallback = () => (
  <div className="min-h-screen hero-gradient flex items-center justify-center" role="status" aria-label="Laddar sida">
    <Loader2 className="h-8 w-8 animate-spin text-primary" />
    <span className="sr-only">Laddar…</span>
  </div>
);

// Public-vy: ingen auth, Layout + ErrorBoundary. Används BARA för förstasidan
// (`/`) och `/login` — allt övrigt innehåll är inloggnings-skyddat så att
// taktik, matchplan, trupp etc. aldrig läcker till oinloggade besökare.
const Public = ({ children, routeName }: { children: React.ReactNode; routeName?: string }) => (
  <Layout>
    <ErrorBoundary routeName={routeName}>
      <Suspense fallback={<PageFallback />}>{children}</Suspense>
    </ErrorBoundary>
  </Layout>
);

// Protected-vy: Layout + AuthGuard. Renderas bara om användaren har en
// supabase-session eller delad-inlogg — annars redirect till /login.
const Protected = ({ children, routeName }: { children: React.ReactNode; routeName?: string }) => (
  <AuthGuard>
    <Layout>
      <ErrorBoundary routeName={routeName}>
        <Suspense fallback={<PageFallback />}>{children}</Suspense>
      </ErrorBoundary>
    </Layout>
  </AuthGuard>
);

// Print-vy: ingen Layout (för ren A4-utskrift) — också inloggnings-skyddad.
const PrintRoute = ({ children, routeName }: { children: React.ReactNode; routeName?: string }) => (
  <AuthGuard>
    <ErrorBoundary routeName={routeName}>
      <Suspense fallback={<PageFallback />}>{children}</Suspense>
    </ErrorBoundary>
  </AuthGuard>
);

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <Routes>
          <Route path="/login" element={<Login />} />

          {/* Förstasidan är publik — alla andra innehållsidor kräver inloggning */}
          <Route path="/" element={<Public routeName="Hem"><Hem /></Public>} />
          <Route path="/period/1" element={<Protected routeName="Period 1"><Period1 /></Protected>} />
          <Route path="/maj-2026" element={<Protected routeName="Sommaren 2026"><MajSpelmodell /></Protected>} />
          <Route path="/spelide" element={<Protected routeName="Spelidé"><Spelide /></Protected>} />
          <Route path="/forsvar" element={<Protected routeName="Försvar"><Forsvar /></Protected>} />
          <Route path="/anfall" element={<Protected routeName="Anfall"><Anfall /></Protected>} />
          <Route path="/omstallning-forsvar" element={<Protected routeName="Omställning försvar"><OmstallningForsvar /></Protected>} />
          <Route path="/omstallning-anfall" element={<Protected routeName="Omställning anfall"><OmstallningAnfall /></Protected>} />
          <Route path="/fasta" element={<Protected routeName="Fasta"><Fasta /></Protected>} />
          <Route path="/fasta/forsvar" element={<Protected routeName="Fasta försvar"><FastaForsvar /></Protected>} />
          <Route path="/fasta/anfall" element={<Protected routeName="Fasta anfall"><FastaAnfall /></Protected>} />
          <Route path="/match/forra" element={<Protected routeName="Förra matchen"><MatchForra /></Protected>} />
          <Route path="/match/kommande" element={<Protected routeName="Kommande match"><MatchKommande /></Protected>} />
          <Route path="/match/reflektioner" element={<Protected routeName="Reflektioner"><MatchReflektioner /></Protected>} />
          <Route path="/match/matcher" element={<Protected routeName="Matcher"><Matcher /></Protected>} />
          <Route path="/spelarvard" element={<Protected routeName="Ta hand om dig själv"><Spelarvard /></Protected>} />
          <Route path="/truppen" element={<Protected routeName="Truppen"><Truppen /></Protected>} />
          <Route path="/tavlingar" element={<Protected routeName="Tävlingar"><Tavlingar /></Protected>} />
          <Route path="/roller" element={<Protected routeName="Roller"><Roller /></Protected>} />
          <Route path="/identitet" element={<Protected routeName="Identitet"><Identitet /></Protected>} />
          <Route path="/identitet/:slug" element={<Protected routeName="Identitet"><Identitet /></Protected>} />
          <Route path="/spelmodell-labb" element={<Protected routeName="Spelmodell-labb"><SpelmodellLab /></Protected>} />
          <Route path="/verktyg" element={<Protected routeName="Verktyg"><Verktyg /></Protected>} />
          <Route path="/under-process" element={<Protected routeName="Under process"><UnderProcess /></Protected>} />
          {/* Helskärms-deck (owner-only, gate i sidan) — utan Layout-chrome */}
          <Route path="/under-process/spelmodell-neon" element={<PrintRoute routeName="Spelmodell Neon"><UnderProcessDeck /></PrintRoute>} />

          {/* Print-optimerade tools — också inloggnings-skyddade, men utan Layout-chrome (A4) */}
          <Route path="/traningsplan" element={<PrintRoute routeName="Träningsplan"><TrainingPlan /></PrintRoute>} />
          <Route path="/matchblad" element={<PrintRoute routeName="Matchblad"><Matchblad /></PrintRoute>} />
          <Route path="/motstandaranalys" element={<PrintRoute routeName="Motståndaranalys"><Motstandaranalys /></PrintRoute>} />
          <Route path="/taktiktavla" element={<PrintRoute routeName="Taktiktavla"><Taktiktavla /></PrintRoute>} />

          {/* Endast /admin är fortfarande inloggnings-skyddad — ledar-panel */}
          <Route
            path="/admin"
            element={
              <AuthGuard requireApproval={false}>
                <ErrorBoundary routeName="Admin">
                  <Suspense fallback={<PageFallback />}>
                    <Admin />
                  </Suspense>
                </ErrorBoundary>
              </AuthGuard>
            }
          />

          {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
          <Route
            path="*"
            element={
              <Suspense fallback={<PageFallback />}>
                <NotFound />
              </Suspense>
            }
          />
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
