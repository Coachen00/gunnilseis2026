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
const SpelmodellLab = lazy(() => import("./pages/SpelmodellLab"));
const OmstallningForsvar = lazy(() => import("./pages/OmstallningForsvar"));
const OmstallningAnfall = lazy(() => import("./pages/OmstallningAnfall"));
const FastaForsvar = lazy(() => import("./pages/FastaForsvar"));
const FastaAnfall = lazy(() => import("./pages/FastaAnfall"));
const MatchForra = lazy(() => import("./pages/MatchForra"));
const MatchKommande = lazy(() => import("./pages/MatchKommande"));
const MatchReflektioner = lazy(() => import("./pages/MatchReflektioner"));
const Truppen = lazy(() => import("./pages/Truppen"));
const Matcher = lazy(() => import("./pages/Matcher"));

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

// Public-vy: ingen auth, Layout + ErrorBoundary. All innehållsidor använder
// denna sedan vi gjort hela sajten publik. Inloggning krävs nu endast för
// admin-panelen.
const Public = ({ children, routeName }: { children: React.ReactNode; routeName?: string }) => (
  <Layout>
    <ErrorBoundary routeName={routeName}>
      <Suspense fallback={<PageFallback />}>{children}</Suspense>
    </ErrorBoundary>
  </Layout>
);

// Print-vy: ingen Layout (för ren A4-utskrift) — också publik.
const PrintRoute = ({ children, routeName }: { children: React.ReactNode; routeName?: string }) => (
  <ErrorBoundary routeName={routeName}>
    <Suspense fallback={<PageFallback />}>{children}</Suspense>
  </ErrorBoundary>
);

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <Routes>
          <Route path="/login" element={<Login />} />

          {/* Alla innehållsidor är nu publika — ingen inloggning krävs */}
          <Route path="/" element={<Public routeName="Hem"><Hem /></Public>} />
          <Route path="/period/1" element={<Public routeName="Period 1"><Period1 /></Public>} />
          <Route path="/maj-2026" element={<Public routeName="Maj 2026"><MajSpelmodell /></Public>} />
          <Route path="/spelide" element={<Public routeName="Spelidé"><Spelide /></Public>} />
          <Route path="/forsvar" element={<Public routeName="Försvar"><Forsvar /></Public>} />
          <Route path="/anfall" element={<Public routeName="Anfall"><Anfall /></Public>} />
          <Route path="/omstallning-forsvar" element={<Public routeName="Omställning försvar"><OmstallningForsvar /></Public>} />
          <Route path="/omstallning-anfall" element={<Public routeName="Omställning anfall"><OmstallningAnfall /></Public>} />
          <Route path="/fasta" element={<Public routeName="Fasta"><Fasta /></Public>} />
          <Route path="/fasta/forsvar" element={<Public routeName="Fasta försvar"><FastaForsvar /></Public>} />
          <Route path="/fasta/anfall" element={<Public routeName="Fasta anfall"><FastaAnfall /></Public>} />
          <Route path="/match/forra" element={<Public routeName="Förra matchen"><MatchForra /></Public>} />
          <Route path="/match/kommande" element={<Public routeName="Kommande match"><MatchKommande /></Public>} />
          <Route path="/match/reflektioner" element={<Public routeName="Reflektioner"><MatchReflektioner /></Public>} />
          <Route path="/match/matcher" element={<Public routeName="Matcher"><Matcher /></Public>} />
          <Route path="/truppen" element={<Public routeName="Truppen"><Truppen /></Public>} />
          <Route path="/roller" element={<Public routeName="Roller"><Roller /></Public>} />
          <Route path="/identitet" element={<Public routeName="Identitet"><Identitet /></Public>} />
          <Route path="/identitet/:slug" element={<Public routeName="Identitet"><Identitet /></Public>} />
          <Route path="/spelmodell-labb" element={<Public routeName="Spelmodell-labb"><SpelmodellLab /></Public>} />
          <Route path="/verktyg" element={<Public routeName="Verktyg"><Verktyg /></Public>} />
          <Route path="/under-process" element={<Public routeName="Under process"><UnderProcess /></Public>} />

          {/* Print-optimerade tools — också publika nu, men utan Layout-chrome (A4) */}
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
