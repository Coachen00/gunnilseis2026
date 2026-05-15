import { useEffect, useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { ArrowLeft, Check, X, Loader2, Shield, FileText, Video } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import ContentEditor from "@/components/admin/ContentEditor";
import MediaLibraryManager from "@/components/media/MediaLibraryManager";
import { IDENTITY } from "@/data/identity";

interface Profile {
  id: string;
  email: string;
  approved: boolean;
  created_at: string;
}

const Admin = () => {
  const [profiles, setProfiles] = useState<Profile[]>([]);
  const [loading, setLoading] = useState(true);
  const [isAdmin, setIsAdmin] = useState(false);
  const navigate = useNavigate();
  const { toast } = useToast();

  useEffect(() => {
    const check = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        navigate("/login");
        return;
      }
      const { data: roleRow } = await supabase
        .from("user_roles")
        .select("role")
        .eq("user_id", user.id)
        .eq("role", "admin")
        .maybeSingle();
      if (!roleRow) {
        navigate("/");
        return;
      }
      setIsAdmin(true);
      fetchProfiles();
    };
    check();
  }, [navigate]);

  const fetchProfiles = async () => {
    const { data, error } = await supabase
      .from("profiles")
      .select("*")
      .order("created_at", { ascending: false });

    if (!error && data) {
      setProfiles(data);
    }
    setLoading(false);
  };

  const toggleApproval = async (id: string, currentApproval: boolean) => {
    const { error } = await supabase
      .from("profiles")
      .update({ approved: !currentApproval })
      .eq("id", id);

    if (error) {
      toast({ title: "Fel", description: error.message, variant: "destructive" });
    } else {
      toast({ title: !currentApproval ? "Godkänd!" : "Åtkomst borttagen" });
      fetchProfiles();
    }
  };

  if (!isAdmin || loading) {
    return (
      <div className="min-h-screen hero-gradient flex items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  const pending = profiles.filter((p) => !p.approved);
  const approved = profiles.filter((p) => p.approved);

  return (
    <div className="min-h-screen bg-background p-4 md:p-8">
      <div className="max-w-3xl mx-auto">
        <Link to="/" className="flex items-center gap-2 text-sm font-bold text-primary hover:underline mb-6">
          <ArrowLeft className="w-4 h-4" />
          Tillbaka till spelkarta
        </Link>

        <div className="flex items-center gap-3 mb-8">
          <div className="w-10 h-10 rounded-lg bg-primary/20 flex items-center justify-center">
            <Shield className="w-5 h-5 text-primary" />
          </div>
          <h1 className="text-2xl font-black text-foreground">Admin</h1>
        </div>

        <div className="flex items-center gap-2 mb-3">
          <Shield className="w-4 h-4 text-muted-foreground" />
          <h2 className="text-sm font-bold uppercase tracking-wider text-muted-foreground">
            Användare
          </h2>
        </div>

        {pending.length > 0 && (
          <div className="mb-8">
            <h2 className="text-sm font-bold uppercase tracking-wider text-amber-500 mb-3">
              Väntar på godkännande ({pending.length})
            </h2>
            <div className="space-y-2">
              {pending.map((p) => (
                <div key={p.id} className="flex items-center justify-between p-4 rounded-xl bg-amber-500/10 border border-amber-500/30">
                  <div>
                    <p className="text-sm font-bold text-foreground">{p.email}</p>
                    <p className="text-xs text-muted-foreground">
                      {new Date(p.created_at).toLocaleDateString("sv-SE")}
                    </p>
                  </div>
                  <div className="flex gap-2">
                    <button
                      onClick={() => toggleApproval(p.id, p.approved)}
                      className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-green-600 text-white text-xs font-bold hover:bg-green-700 transition-colors"
                    >
                      <Check className="w-3.5 h-3.5" />
                      Godkänn
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        <div>
          <h2 className="text-sm font-bold uppercase tracking-wider text-muted-foreground mb-3">
            Godkända ({approved.length})
          </h2>
          <div className="space-y-2">
            {approved.map((p) => (
              <div key={p.id} className="flex items-center justify-between p-4 rounded-xl bg-card border border-border">
                <div>
                  <p className="text-sm font-bold text-foreground">{p.email}</p>
                  <p className="text-xs text-muted-foreground">
                    {new Date(p.created_at).toLocaleDateString("sv-SE")}
                  </p>
                </div>
                <button
                  onClick={() => toggleApproval(p.id, p.approved)}
                  className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-muted text-muted-foreground text-xs font-bold hover:bg-destructive hover:text-destructive-foreground transition-colors"
                >
                  <X className="w-3.5 h-3.5" />
                  Ta bort
                </button>
              </div>
            ))}
          </div>
        </div>

        <div className="mt-12">
          <div className="flex items-center gap-2 mb-3">
            <FileText className="w-4 h-4 text-muted-foreground" />
            <h2 className="text-sm font-bold uppercase tracking-wider text-muted-foreground">
              Innehåll
            </h2>
          </div>
          <div className="space-y-4">
            <ContentEditor
              contentKey="identity"
              label="Identitetsord"
              description="Fem beteenden i varje match. Visas på Hem och /identitet/<slug>."
              fallback={IDENTITY}
            />
          </div>
        </div>

        <div className="mt-12">
          <div className="mb-4 flex items-center justify-between gap-3">
            <div className="flex items-center gap-2">
              <Video className="w-4 h-4 text-muted-foreground" />
              <h2 className="text-sm font-bold uppercase tracking-wider text-muted-foreground">
                Mediabibliotek
              </h2>
            </div>
            <Link
              to="/media-bibliotek"
              className="inline-flex h-8 items-center rounded-sm border border-border bg-card px-3 text-xs font-bold uppercase tracking-wider text-foreground transition hover:border-accent"
            >
              Öppna full vy
            </Link>
          </div>
          <p className="mb-4 text-sm text-muted-foreground">
            Snabbtillgång till mediabiblioteket — lägg in klipp, redigera eller växla synlighet.
            Den fulla vyn på <code className="rounded bg-muted px-1.5 py-0.5 text-xs">/media-bibliotek</code> har samma data.
          </p>
          <MediaLibraryManager />
        </div>
      </div>
    </div>
  );
};

export default Admin;
