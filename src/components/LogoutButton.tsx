import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { LogOut } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { useNavigate } from "react-router-dom";
import { cn } from "@/lib/utils";
import { clearSharedAccess, getSharedAccessUser } from "@/lib/sharedAccess";

interface LogoutButtonProps {
  className?: string;
}

const LogoutButton = ({ className }: LogoutButtonProps) => {
  const { toast } = useToast();
  const navigate = useNavigate();

  const handleLogout = async () => {
    const hadSharedAccess = Boolean(getSharedAccessUser());
    const { error } = await supabase.auth.signOut();
    clearSharedAccess();
    
    if (error && !hadSharedAccess) {
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
      navigate("/");
    }
  };

  return (
    <Button 
      variant="ghost" 
      size="sm" 
      onClick={handleLogout}
      className={cn("text-muted-foreground hover:text-foreground hover:bg-muted", className)}
    >
      <LogOut className="h-4 w-4 mr-2" />
      Logga ut
    </Button>
  );
};

export default LogoutButton;
