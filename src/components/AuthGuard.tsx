import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { Session } from "@supabase/supabase-js";
import { Loader2, Clock } from "lucide-react";

interface AuthGuardProps {
  children: React.ReactNode;
  requireAuth?: boolean;
  requireApproval?: boolean;
}

const AuthGuard = ({ children, requireAuth = true, requireApproval = true }: AuthGuardProps) => {
  const [session, setSession] = useState<Session | null>(null);
  const [loading, setLoading] = useState(true);
  const [approved, setApproved] = useState<boolean | null>(null);
  const navigate = useNavigate();

  useEffect(() => {
    const { data: { subscription } } = supabase.auth.onAuthStateChange((event, session) => {
      setSession(session);
      if (!session) {
        setLoading(false);
        if (requireAuth) navigate("/login");
      }
    });

    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
      if (!session) {
        setLoading(false);
        if (requireAuth) navigate("/login");
      }
    });

    return () => subscription.unsubscribe();
  }, [navigate, requireAuth]);

  useEffect(() => {
    if (!session || !requireApproval) {
      if (session && !requireApproval) {
        setApproved(true);
        setLoading(false);
      }
      return;
    }

    const checkApproval = async () => {
      const { data, error } = await supabase
        .from("profiles")
        .select("approved")
        .eq("id", session.user.id)
        .single();

      if (error || !data) {
        setApproved(false);
      } else {
        setApproved(data.approved);
      }
      setLoading(false);
    };

    checkApproval();
  }, [session, requireApproval]);

  if (loading) {
    return (
      <div className="min-h-screen hero-gradient flex items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  if (!session) return requireAuth ? null : <>{children}</>;

  if (requireApproval && approved === false) {
    return (
      <div className="min-h-screen hero-gradient flex items-center justify-center p-4">
        <div className="bg-card rounded-2xl border border-border p-8 max-w-md text-center shadow-lg">
          <div className="w-16 h-16 rounded-full bg-amber-500/20 flex items-center justify-center mx-auto mb-4">
            <Clock className="w-8 h-8 text-amber-500" />
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
            className="px-4 py-2 rounded-lg bg-muted text-muted-foreground text-sm font-bold hover:bg-muted/80 transition-colors"
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
