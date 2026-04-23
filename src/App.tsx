import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Login from "./pages/Login";
import Hem from "./pages/Hem";
import Spelide from "./pages/Spelide";
import Forsvar from "./pages/Forsvar";
import Anfall from "./pages/Anfall";
import Fasta from "./pages/Fasta";
import Roller from "./pages/Roller";
import Verktyg from "./pages/Verktyg";
import OmstallningForsvar from "./pages/OmstallningForsvar";
import OmstallningAnfall from "./pages/OmstallningAnfall";
import FastaForsvar from "./pages/FastaForsvar";
import FastaAnfall from "./pages/FastaAnfall";
import MatchForra from "./pages/MatchForra";
import MatchKommande from "./pages/MatchKommande";
import MatchReflektioner from "./pages/MatchReflektioner";
import TrainingPlan from "./pages/TrainingPlan";
import Matchblad from "./pages/Matchblad";
import Motstandaranalys from "./pages/Motstandaranalys";
import Taktiktavla from "./pages/Taktiktavla";
import Admin from "./pages/Admin";
import NotFound from "./pages/NotFound";
import AuthGuard from "./components/AuthGuard";
import Layout from "./components/Layout";

const queryClient = new QueryClient();

// Wrap a protected page with AuthGuard + shared Layout (nav + animated background + footer).
const Protected = ({ children, requireApproval = true }: { children: React.ReactNode; requireApproval?: boolean }) => (
  <AuthGuard requireApproval={requireApproval}>
    <Layout>{children}</Layout>
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
          <Route path="/verktyg" element={<Protected><Verktyg /></Protected>} />

          {/* Print-optimized tools — kept WITHOUT Layout to preserve clean A4 output */}
          <Route path="/traningsplan" element={<AuthGuard><TrainingPlan /></AuthGuard>} />
          <Route path="/matchblad" element={<AuthGuard><Matchblad /></AuthGuard>} />
          <Route path="/motstandaranalys" element={<AuthGuard><Motstandaranalys /></AuthGuard>} />
          <Route path="/taktiktavla" element={<AuthGuard><Taktiktavla /></AuthGuard>} />

          <Route path="/admin" element={<AuthGuard requireApproval={false}><Admin /></AuthGuard>} />

          {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
