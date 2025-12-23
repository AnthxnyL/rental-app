import { useNavigate } from "react-router-dom";
import { supabase } from "@/lib/supabase";
import { Button } from "@/components/ui/button";
import { Home, LogOut } from "lucide-react";

export function Header() {
  const navigate = useNavigate();

  const handleSignOut = async () => {
    try {
      const { error } = await supabase.auth.signOut();
      if (error) throw error;
      navigate("/login");
    } catch (error) {
      console.error("Erreur lors de la déconnexion:", error);
    }
  };

  return (
    <nav className="border-b-2 border-black bg-white p-4 sticky top-0 z-50">
      <div className="max-w-7xl mx-auto flex justify-between items-center">
        <div 
          className="flex items-center gap-2 cursor-pointer" 
          onClick={() => navigate("/")}
        >
          <div className=" p-1.5">
            <Home className="h-6 w-6 text-black stroke-[2.5px]" />
          </div>
          <span className="font-black uppercase tracking-tighter text-xl">
            Locat.Gestion
          </span>
        </div>

        <div className="flex items-center gap-4">
          <Button 
            variant="ghost" 
            onClick={handleSignOut}
            className="font-bold uppercase text-xs hover:bg-black hover:text-white rounded-none border-2 border-transparent hover:border-black transition-all duration-200"
          >
            <LogOut className="mr-2 h-4 w-4" /> 
            Déconnexion
          </Button>
        </div>
      </div>
    </nav>
  );
}