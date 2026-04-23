import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";
import { Loader2 } from "lucide-react";

const Login = () => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [isSignUp, setIsSignUp] = useState(false);
  const [signUpDone, setSignUpDone] = useState(false);
  const navigate = useNavigate();
  const { toast } = useToast();

  useEffect(() => {
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
    const email = username.includes("@")
      ? username.trim()
      : `${username.trim().toLowerCase()}@gunnilse.local`;

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
        const { error } = await supabase.auth.signInWithPassword({
          email,
          password,
        });

        if (error) throw error;

        toast({
          title: "Inloggad!",
          description: "Välkommen tillbaka.",
        });
        navigate("/");
      }
    } catch (error: any) {
      toast({
        title: "Fel",
        description: error.message || "Något gick fel",
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
            <CardTitle className="text-2xl font-black text-foreground">📩 Förfrågan skickad</CardTitle>
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
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen hero-gradient flex items-center justify-center p-4">
      <Card className="w-full max-w-md card-gradient border-border">
        <CardHeader className="text-center">
          <CardTitle className="text-2xl font-black text-foreground">
            {isSignUp ? "Begär tillgång" : "Logga in"}
          </CardTitle>
          <CardDescription className="text-muted-foreground">
            {isSignUp 
              ? "Ange e-post och lösenord. En admin godkänner din förfrågan." 
              : "Logga in för att komma åt spelidén"}
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="email" className="text-foreground">E-post</Label>
              <Input
                id="email"
                type="email"
                placeholder="din@email.se"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
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
                  Vänta...
                </>
              ) : isSignUp ? (
                "Skicka förfrågan"
              ) : (
                "Logga in"
              )}
            </Button>
          </form>
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
        </CardContent>
      </Card>
    </div>
  );
};

export default Login;
