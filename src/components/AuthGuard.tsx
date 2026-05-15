import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { Loader2, Clock } from "lucide-react";
import { useSession } from "@/hooks/useSession";
import { useProfile } from "@/hooks/useProfile";

interface AuthGuardProps {
  children: React.ReactNode;
  requireAuth?: boolean;
  requireApproval?: boolean;
}

/**
 * AuthGuard — kontrollerar att vi har en session och (frivilligt) en godkänd
 * profile innan vi visar `children`.
 *
 * Backas av useSession + useProfile (TanStack Query) så att flera AuthGuard
 * på samma sida delar cache och inte slår mot Supabase upprepade gånger.
 */
const AuthGuard = ({ children, requireAuth = true, requireApproval = true }: AuthGuardProps) => {
  const { data: session, isLoading: sessionLoading } = useSession();
  const { data: profile, isLoading: profileLoading } = useProfile();
  const navigate = useNavigate();

  // Hänvisa till login så fort vi vet att sessionen saknas.
  useEffect(() => {
    if (sessionLoading) return;
    if (!session && requireAuth) {
      navigate("/login");
    }
  }, [session, sessionLoading, requireAuth, navigate]);

  const checkingApproval = requireApproval && Boolean(session) && profileLoading;

  if (sessionLoading || checkingApproval) {
    return (
      <div
        className="min-h-screen hero-gradient flex items-center justify-center"
        role="status"
        aria-live="polite"
      >
        <Loader2 className="h-8 w-8 animate-spin text-primary" aria-hidden="true" />
        <span className="sr-only">Verifierar tillgång…</span>
      </div>
    );
  }

  if (!session) return requireAuth ? null : <>{children}</>;

  if (requireApproval && profile?.approved === false) {
    return (
      <div className="min-h-screen hero-gradient flex items-center justify-center p-4">
        <div
          className="bg-card rounded-2xl border border-border p-8 max-w-md text-center shadow-lg"
          role="alert"
        >
          <div className="w-16 h-16 rounded-full bg-amber-500/20 flex items-center justify-center mx-auto mb-4">
            <Clock className="w-8 h-8 text-amber-500" aria-hidden="true" />
          </div>
          <h2 className="text-2xl text-foreground mb-3">Väntar på godkännande</h2>
          <p className="text-sm text-muted-foreground mb-6">
            Din förfrågan har skickats. Du får tillgång så fort en administratör godkänner ditt konto.
          </p>
          <button
            onClick={async () => {
              await supabase.auth.signOut();
              navigate("/login");
            }}
            className="px-4 py-2 rounded-lg bg-muted text-muted-foreground text-sm font-bold hover:bg-muted/80 transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
          >
            Logga ut
          </button>
        </div>
      </div>
    );
  }

  return <>{children}</>;
};

export default AuthGuard;
