import { useState, useEffect } from "react";
import { Link, useNavigate, useSearchParams } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";
import { Loader2, ShieldCheck, PlayCircle, Film, CalendarClock } from "lucide-react";
import { getLoginEmailCandidates, toSupabaseEmail } from "@/lib/sharedLogin";
import { getSharedAccessUser, isSharedAccessCredential, setSharedAccessActive } from "@/lib/sharedAccess";

const Login = () => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [isSignUp, setIsSignUp] = useState(false);
  const [signUpDone, setSignUpDone] = useState(false);
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const { toast } = useToast();

  useEffect(() => {
    setIsSignUp(searchParams.get("mode") === "signup");
  }, [searchParams]);

  useEffect(() => {
    if (getSharedAccessUser()) {
      navigate("/");
      return;
    }

    const { data: { subscription } } = supabase.auth.onAuthStateChange((event, session) => {
      if (session) {
        navigate("/");
      }
    });

    supabase.auth.getSession().then(({ data: { session } }) => {
      if (session) {
        navigate("/");
      }
    });

    return () => subscription.unsubscribe();
  }, [navigate]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    // Map username -> email behind the scenes (Supabase requires email).
    const email = toSupabaseEmail(username);

    try {
      if (isSignUp) {
        const { error } = await supabase.auth.signUp({
          email,
          password,
          options: {
            emailRedirectTo: window.location.origin,
          },
        });

        if (error) throw error;

        // Notify admin via edge function
        try {
          await supabase.functions.invoke("notify-new-signup", {
            body: { email },
          });
        } catch {
          // Non-critical - don't block signup
        }

        setSignUpDone(true);
        toast({
          title: "Förfrågan skickad!",
          description: "En administratör behöver godkänna ditt konto innan du får tillgång.",
        });
      } else {
        let signInError: Error | null = null;

        for (const candidateEmail of getLoginEmailCandidates(username)) {
          const { error } = await supabase.auth.signInWithPassword({
            email: candidateEmail,
            password,
          });

          if (!error) {
            signInError = null;
            break;
          }

          signInError = error;
        }

        if (signInError) {
          const canUseSharedAccess = await isSharedAccessCredential(username, password);

          if (!canUseSharedAccess) {
            throw signInError;
          }

          setSharedAccessActive();
        }

        toast({
          title: "Inloggad!",
          description: "Välkommen tillbaka.",
        });
        navigate("/");
      }
    } catch (error: unknown) {
      const raw = error instanceof Error ? error.message : "";
      const description = /invalid login credentials/i.test(raw)
        ? "Fel användarnamn eller lösenord. Kontrollera och försök igen."
        : /email not confirmed|not.*approved/i.test(raw)
          ? "Kontot väntar fortfarande på godkännande av en ledare."
          : /network|fetch|failed to/i.test(raw)
            ? "Ingen kontakt med servern. Kontrollera nätet och försök igen."
            : "Inloggningen gick inte just nu. Försök igen om en stund.";
      toast({
        title: "Inloggning misslyckades",
        description,
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  if (signUpDone) {
    return (
      <div className="min-h-screen hero-gradient flex items-center justify-center p-4">
        <Card className="w-full max-w-md card-gradient border-border">
          <CardHeader className="text-center">
            <CardTitle className="text-3xl text-foreground">Förfrågan skickad</CardTitle>
            <CardDescription className="text-muted-foreground">
              Din förfrågan för <strong>{username}</strong> är registrerad.
              En administratör behöver godkänna kontot innan du kan logga in.
            </CardDescription>
          </CardHeader>
          <CardContent className="text-center">
            <button
              onClick={() => { setSignUpDone(false); setIsSignUp(false); }}
              className="text-sm text-primary hover:underline"
            >
              Tillbaka till inloggning
            </button>
            <div className="mt-3">
              <Link to="/" className="text-xs text-muted-foreground hover:text-primary transition-colors">
                Till startsidan
              </Link>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen hero-gradient flex items-center justify-center p-4">
      <Card className="w-full max-w-md card-gradient border-border">
        <CardHeader className="text-center">
          <div className="mx-auto mb-3 inline-flex items-center gap-2 rounded-full border border-accent/30 bg-accent/5 px-3 py-1.5 font-mono text-[10px] font-black uppercase tracking-[0.24em] text-accent">
            <ShieldCheck className="h-3 w-3" strokeWidth={2.4} />
            Gunnilse IS · 2026
          </div>
          <CardTitle className="text-3xl text-foreground">
            {isSignUp ? "Begär tillgång" : "Välkommen tillbaka"}
          </CardTitle>
          <CardDescription className="text-muted-foreground">
            {isSignUp
              ? "Skicka en förfrågan så godkänner en ledare den. Du får mejl när du kan logga in."
              : "Logga in för att se matchplan, träningar och filmbibliotek."}
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="username" className="text-foreground">Användarnamn</Label>
              <Input
                id="username"
                type="text"
                autoComplete="username"
                placeholder="t.ex. förnamn@gunnilse.se"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                required
                className="bg-background border-border"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="password" className="text-foreground">Lösenord</Label>
              <Input
                id="password"
                type="password"
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                minLength={6}
                className="bg-background border-border"
              />
            </div>
            <Button type="submit" className="w-full" disabled={isLoading}>
              {isLoading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  {isSignUp ? "Skickar förfrågan…" : "Loggar in…"}
                </>
              ) : isSignUp ? (
                "Skicka förfrågan"
              ) : (
                "Logga in"
              )}
            </Button>
          </form>

          {/* Inne efter login — visa vad användaren kommer åt */}
          {isSignUp && (
            <div className="mt-6 rounded-lg border border-border bg-muted/30 p-4">
              <p className="mb-3 font-mono text-[10px] font-black uppercase tracking-[0.22em] text-accent">
                Du får tillgång till
              </p>
              <ul className="space-y-2 text-sm text-foreground/90">
                <li className="flex items-center gap-2">
                  <PlayCircle className="h-4 w-4 shrink-0 text-accent" strokeWidth={2.2} />
                  Hela spelmodellen — sex spelfaser, identitet och fasta situationer
                </li>
                <li className="flex items-center gap-2">
                  <CalendarClock className="h-4 w-4 shrink-0 text-accent" strokeWidth={2.2} />
                  Veckans match — trupp, matchplan och fokuspunkter
                </li>
                <li className="flex items-center gap-2">
                  <Film className="h-4 w-4 shrink-0 text-accent" strokeWidth={2.2} />
                  Filmbibliotek — klipp sorterade efter spelfas
                </li>
              </ul>
            </div>
          )}

          <div className="mt-4 text-center">
            <button
              type="button"
              onClick={() => setIsSignUp(!isSignUp)}
              className="text-sm text-primary hover:underline"
            >
              {isSignUp
                ? "Har du redan ett konto? Logga in"
                : "Ingen tillgång? Begär åtkomst"}
            </button>
          </div>
          <div className="mt-3 text-center">
            <Link to="/" className="text-xs text-muted-foreground hover:text-primary transition-colors">
              Tillbaka till startsidan
            </Link>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default Login;
