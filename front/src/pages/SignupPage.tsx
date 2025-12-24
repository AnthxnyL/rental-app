import { useState } from "react";
import { supabase } from "@/lib/supabase";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Link } from "react-router-dom";

export default function SignupPage() {
  const [formData, setFormData] = useState({ email: "", password: "", firstname: "", lastname: "", phone: "" });
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      // 1. Inscription Supabase Auth
      const { data: authData, error: authError } = await supabase.auth.signUp({
        email: formData.email,
        password: formData.password,
      });

      if (authError) throw authError;

      if (authData.user) {
        // 2. Appel de ton API Express (Port 5001)
        const response = await fetch("http://localhost:5001/api/auth/signup", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            id: authData.user.id,
            email: formData.email,
            firstname: formData.firstname,
            lastname: formData.lastname,
            phone: formData.phone,
          }),
        });

        if (!response.ok) throw new Error("Erreur lors de la création du profil");
        alert("Succès ! Vérifiez vos emails pour confirmer.");
      }
    } catch (err: any) {
      alert(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-zinc-50 p-4">
      <Card className="w-full max-w-md border-2 border-black rounded-none shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] bg-white">
        <CardHeader className="space-y-1">
          <CardTitle className="text-3xl font-black uppercase tracking-tighter">Créer un compte</CardTitle>
          <CardDescription className="text-zinc-500 italic">Espace Propriétaire</CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Input 
                  className="border-2 border-black p-3 font-bold outline-none rounded-none h-11 focus-visible:ring-0" 
                  placeholder="PRÉNOM"
                  required
                  onChange={(e) => setFormData({...formData, firstname: e.target.value})} />
              </div>
              <div className="space-y-2">
                <Input 
                  className="border-2 border-black p-3 font-bold outline-none rounded-none h-11 focus-visible:ring-0" 
                  placeholder="NOM"
                  required
                  onChange={(e) => setFormData({...formData, lastname: e.target.value})} />
              </div>
            </div>
            <div className="space-y-2">
              <Input 
                placeholder="ADRESSE"
                className="border-2 border-black p-3 font-bold outline-none rounded-none h-11 focus-visible:ring-0" 
                required
                onChange={(e) => setFormData({...formData, phone: e.target.value})} />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Input 
                  placeholder="VILLE"
                  className="border-2 border-black p-3 font-bold outline-none rounded-none h-11 focus-visible:ring-0" 
                  required
                  onChange={(e) => setFormData({...formData, phone: e.target.value})} />
              </div>
              <div className="space-y-2">
                <Input 
                  placeholder="CODE POSTAL"
                  className="border-2 border-black p-3 font-bold outline-none rounded-none h-11 focus-visible:ring-0" 
                  required
                  onChange={(e) => setFormData({...formData, phone: e.target.value})} />
              </div>
            </div>
            <div className="space-y-2">
              <Input 
                type="email" 
                className="border-2 border-black p-3 font-bold outline-none rounded-none h-11 focus-visible:ring-0" 
                placeholder="EMAIL"
                required
                onChange={(e) => setFormData({...formData, email: e.target.value})} />
            </div>
            <div className="space-y-2">
              <Input 
                placeholder="N° LMNP"
                className="border-2 border-black p-3 font-bold outline-none rounded-none h-11 focus-visible:ring-0" 
                onChange={(e) => setFormData({...formData, phone: e.target.value})} />
            </div>
            <div className="space-y-2">
              <Input 
                type="phone" 
                placeholder="TÉLÉPHONE"
                className="border-2 border-black p-3 font-bold outline-none rounded-none h-11 focus-visible:ring-0" 
                required
                onChange={(e) => setFormData({...formData, phone: e.target.value})} />
            </div>
            <div className="space-y-2">
              <Input 
                type="password" 
                placeholder="MOT DE PASSE"
                title="6 caractères min." 
                className="border-2 border-black p-3 font-bold outline-none rounded-none h-11 focus-visible:ring-0" 
                required
                onChange={(e) => setFormData({...formData, password: e.target.value})} />
            </div>

            <Button className="w-full bg-black text-white hover:bg-zinc-800 rounded-none h-12 font-bold uppercase transition-all" disabled={loading}>
              {loading ? "Création..." : "S'inscrire"}
            </Button>
            <p className="text-center text-xs mt-4">
              Déjà un compte ? <Link to="/signin" className="underline font-bold">Se connecter</Link>
            </p>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}