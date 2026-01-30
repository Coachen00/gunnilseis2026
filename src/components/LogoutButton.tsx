import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { LogOut } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { useNavigate } from "react-router-dom";

const LogoutButton = () => {
  const { toast } = useToast();
  const navigate = useNavigate();

  const handleLogout = async () => {
    const { error } = await supabase.auth.signOut();
    
    if (error) {
      toast({
        title: "Fel",
        description: "Kunde inte logga ut",
        variant: "destructive",
      });
    } else {
      toast({
        title: "Utloggad",
        description: "Du har loggats ut",
      });
      navigate("/login");
    }
  };

  return (
    <Button 
      variant="ghost" 
      size="sm" 
      onClick={handleLogout}
      className="text-white/80 hover:text-white hover:bg-white/10"
    >
      <LogOut className="h-4 w-4 mr-2" />
      Logga ut
    </Button>
  );
};

export default LogoutButton;
