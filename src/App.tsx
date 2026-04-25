import { lazy, Suspense } from "react";
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { Loader2 } from "lucide-react";
import AuthGuard from "./components/AuthGuard";
import Layout from "./components/Layout";

// Login är inte lazy — det är första sidan oinloggade ser, ingen vinst i splitting.
import Login from "./pages/Login";

// Innehållsidor — lazy så vi inte skickar 800 KB JS för en första sidladdning på mobil.
const Hem = lazy(() => import("./pages/Hem"));
const Spelide = lazy(() => import("./pages/Spelide"));
const Forsvar = lazy(() => import("./pages/Forsvar"));
const Anfall = lazy(() => import("./pages/Anfall"));
const Fasta = lazy(() => import("./pages/Fasta"));
const Roller = lazy(() => import("./pages/Roller"));
const Identitet = lazy(() => import("./pages/Identitet"));
const Verktyg = lazy(() => import("./pages/Verktyg"));
const OmstallningForsvar = lazy(() => import("./pages/OmstallningForsvar"));
const OmstallningAnfall = lazy(() => import("./pages/OmstallningAnfall"));
const FastaForsvar = lazy(() => import("./pages/FastaForsvar"));
const FastaAnfall = lazy(() => import("./pages/FastaAnfall"));
const MatchForra = lazy(() => import("./pages/MatchForra"));
const MatchKommande = lazy(() => import("./pages/MatchKommande"));
const MatchReflektioner = lazy(() => import("./pages/MatchReflektioner"));

// Print-optimerade verktygsidor — egna chunks; sällan besökta men tunga.
const TrainingPlan = lazy(() => import("./pages/TrainingPlan"));
const Matchblad = lazy(() => import("./pages/Matchblad"));
const Motstandaranalys = lazy(() => import("./pages/Motstandaranalys"));
const Taktiktavla = lazy(() => import("./pages/Taktiktavla"));
const Admin = lazy(() => import("./pages/Admin"));
const NotFound = lazy(() => import("./pages/NotFound"));

const queryClient = new QueryClient();

const PageFallback = () => (
  <div className="min-h-screen hero-gradient flex items-center justify-center">
    <Loader2 className="h-8 w-8 animate-spin text-primary" />
  </div>
);

// Wrap a protected page with AuthGuard + shared Layout (nav + animated background + footer).
const Protected = ({ children, requireApproval = true }: { children: React.ReactNode; requireApproval?: boolean }) => (
  <AuthGuard requireApproval={requireApproval}>
    <Layout>
      <Suspense fallback={<PageFallback />}>{children}</Suspense>
    </Layout>
  </AuthGuard>
);

// Print-vy: ingen Layout (för ren A4), men fortfarande Suspense.
const PrintRoute = ({ children }: { children: React.ReactNode }) => (
  <AuthGuard>
    <Suspense fallback={<PageFallback />}>{children}</Suspense>
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

          {/* Content pages — wrapped with Layout (sticky nav + animated bg) */}
          <Route path="/" element={<Protected><Hem /></Protected>} />
          <Route path="/spelide" element={<Protected><Spelide /></Protected>} />
          <Route path="/forsvar" element={<Protected><Forsvar /></Protected>} />
          <Route path="/anfall" element={<Protected><Anfall /></Protected>} />
          <Route path="/omstallning-forsvar" element={<Protected><OmstallningForsvar /></Protected>} />
          <Route path="/omstallning-anfall" element={<Protected><OmstallningAnfall /></Protected>} />
          <Route path="/fasta" element={<Protected><Fasta /></Protected>} />
          <Route path="/fasta/forsvar" element={<Protected><FastaForsvar /></Protected>} />
          <Route path="/fasta/anfall" element={<Protected><FastaAnfall /></Protected>} />
          <Route path="/match/forra" element={<Protected><MatchForra /></Protected>} />
          <Route path="/match/kommande" element={<Protected><MatchKommande /></Protected>} />
          <Route path="/match/reflektioner" element={<Protected><MatchReflektioner /></Protected>} />
          <Route path="/roller" element={<Protected><Roller /></Protected>} />
          <Route path="/identitet/:slug" element={<Protected><Identitet /></Protected>} />
          <Route path="/verktyg" element={<Protected><Verktyg /></Protected>} />

          {/* Print-optimized tools — kept WITHOUT Layout to preserve clean A4 output */}
          <Route path="/traningsplan" element={<PrintRoute><TrainingPlan /></PrintRoute>} />
          <Route path="/matchblad" element={<PrintRoute><Matchblad /></PrintRoute>} />
          <Route path="/motstandaranalys" element={<PrintRoute><Motstandaranalys /></PrintRoute>} />
          <Route path="/taktiktavla" element={<PrintRoute><Taktiktavla /></PrintRoute>} />

          <Route
            path="/admin"
            element={
              <AuthGuard requireApproval={false}>
                <Suspense fallback={<PageFallback />}>
                  <Admin />
                </Suspense>
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
