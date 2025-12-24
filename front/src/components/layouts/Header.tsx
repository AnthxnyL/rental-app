import { Link, useNavigate } from "react-router-dom";
import { User, LogOut } from "lucide-react";
import { supabase } from "@/lib/supabase";

export function Header() {
  const navigate = useNavigate();

  const handleLogout = async () => {
    await supabase.auth.signOut();
    navigate("/signin");
  };

  return (
    <header className="border-b-4 border-black bg-white p-4 sticky top-0 z-50">
      <div className="max-w-7xl mx-auto flex justify-between items-center">
        <Link to="/dashboard" className="text-2xl font-black uppercase italic tracking-tighter">
          Gestion<span className="bg-yellow-400 px-1">Loc</span>
        </Link>
        
        <div className="flex items-center gap-4">
          <Link 
            to="/profile" 
            className="flex items-center gap-2 font-bold uppercase text-sm hover:underline"
          >
            <User size={18} /> <span className="hidden md:inline">Mon Profil</span>
          </Link>
          
          <button 
            onClick={handleLogout}
            className="p-2 border-2 border-black hover:bg-black hover:text-white transition-colors"
            title="Déconnexion"
          >
            <LogOut size={18} />
          </button>
        </div>
      </div>
    </header>
  );
}