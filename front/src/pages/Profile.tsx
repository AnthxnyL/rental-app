import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";
import { Header } from "@/components/layouts/Header";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { toast } from "sonner";
import { Loader2, Save } from "lucide-react";

export default function Profile() {
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [profile, setProfile] = useState({
    firstname: "",
    lastname: "",
    email: "",
    phone: "",
    address: "",
    zip_code: "",
    city: "",
    lmnp_number: "",
  });

  const fetchProfile = async () => {
    try {
      const { data: { session } } = await supabase.auth.getSession();
      const response = await fetch(`${import.meta.env.VITE_API_URL}/api/auth/me`, {
        headers: { Authorization: `Bearer ${session?.access_token}` },
      });
      const data = await response.json();
      if (response.ok) setProfile(data);
    } catch (error) {
      toast.error("Erreur lors du chargement");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchProfile(); }, []);

  const handleUpdate = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    try {
      const { data: { session } } = await supabase.auth.getSession();
      const response = await fetch(`${import.meta.env.VITE_API_URL}/api/auth/profile`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${session?.access_token}`,
        },
        body: JSON.stringify(profile),
      });

      if (response.ok) toast.success("Profil mis à jour !");
      else throw new Error();
    } catch (error) {
      toast.error("Erreur lors de la mise à jour");
    } finally {
      setSaving(false);
    }
  };

  if (loading) return (
    <div className="flex h-screen items-center justify-center bg-zinc-50 font-black uppercase italic">
      Chargement...
    </div>
  );

  return (
    <div className="min-h-screen bg-zinc-50 pb-20">
      <Header />
      <main className="max-w-2xl mx-auto p-6 mt-10">
        
        {/* Titre style Dashboard */}
        <div className="mb-10">
          <h1 className="text-5xl font-black uppercase tracking-tighter italic">Mon Profil</h1>
          <p className="text-zinc-500 font-medium">Vos informations d'émetteur pour les quittances.</p>
        </div>

        {/* Formulaire Neubrutaliste */}
        <div className="bg-white border-4 border-black shadow-[12px_12px_0px_0px_rgba(0,0,0,1)] p-8">
          <form onSubmit={handleUpdate} className="space-y-6">
            
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Input 
                  placeholder="PRÉNOM"
                  value={profile.firstname || ""}
                  onChange={(e) => setProfile({...profile, firstname: e.target.value})}
                  className="border-black rounded-none h-12 focus-visible:ring-0 font-bold uppercase placeholder:text-zinc-400" 
                />
              </div>
              <div className="space-y-2">
                <Input 
                  placeholder="NOM"
                  value={profile.lastname || ""}
                  onChange={(e) => setProfile({...profile, lastname: e.target.value})}
                  className="border-black rounded-none h-12 focus-visible:ring-0 font-bold uppercase placeholder:text-zinc-400" 
                />
              </div>
            </div>

            <div className="space-y-2">
              <Input 
                type="email"
                placeholder="EMAIL"
                value={profile.email || ""}
                disabled
                className="border-black rounded-none h-12 bg-zinc-100 italic opacity-70 cursor-not-allowed font-bold" 
              />
            </div>

            <div className="space-y-2">
              <Input 
                placeholder="TÉLÉPHONE"
                value={profile.phone || ""}
                onChange={(e) => setProfile({...profile, phone: e.target.value})}
                className="border-black rounded-none h-12 focus-visible:ring-0 font-bold uppercase placeholder:text-zinc-400" 
              />
            </div>

            <hr className="border-2 border-black my-8" />

            <div className="space-y-2">
              <Input 
                placeholder="ADRESSE DU SIÈGE / DOMICILE"
                value={profile.address || ""}
                onChange={(e) => setProfile({...profile, address: e.target.value})}
                className="border-black rounded-none h-12 focus-visible:ring-0 font-bold uppercase placeholder:text-zinc-400" 
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Input 
                  placeholder="CODE POSTAL"
                  value={profile.zip_code || ""}
                  onChange={(e) => setProfile({...profile, zip_code: e.target.value})}
                  className="border-black rounded-none h-12 focus-visible:ring-0 font-bold uppercase placeholder:text-zinc-400" 
                />
              </div>
              <div className="space-y-2">
                <Input 
                  placeholder="VILLE"
                  value={profile.city || ""}
                  onChange={(e) => setProfile({...profile, city: e.target.value})}
                  className="border-black rounded-none h-12 focus-visible:ring-0 font-bold uppercase placeholder:text-zinc-400" 
                />
              </div>
            </div>

            <div className="space-y-2">
              <Input 
                placeholder="N° SIRET OU LMNP (FACULTATIF)"
                value={profile.lmnp_number || ""}
                onChange={(e) => setProfile({...profile, lmnp_number: e.target.value})}
                className="border-black rounded-none h-12 border-dashed focus-visible:ring-0 font-bold uppercase placeholder:text-zinc-400" 
              />
            </div>

            <Button 
              type="submit" 
              disabled={saving}
              className="w-full bg-black text-white hover:bg-zinc-800 rounded-none h-14 font-black uppercase shadow-[6px_6px_0px_0px_rgba(254,240,138,1)] hover:shadow-none hover:translate-x-1 hover:translate-y-1 transition-all flex items-center justify-center gap-2 mt-8"
            >
              {saving ? <Loader2 className="animate-spin" /> : <Save size={20} />}
              {saving ? "Sauvegarde..." : "Enregistrer mon profil"}
            </Button>
          </form>
        </div>
      </main>
    </div>
  );
}