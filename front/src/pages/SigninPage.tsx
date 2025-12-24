import { useState } from "react";
import { supabase } from "@/lib/supabase";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Link, useNavigate } from "react-router-dom";
import { Input } from "@/components/ui/input";

export default function SigninPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    const { error } = await supabase.auth.signInWithPassword({ email, password });

    if (error) {
      alert(error.message);
    } else {
      navigate("/dashboard");
    }
    setLoading(false);
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-zinc-50 p-4">
      <Card className="w-full max-w-sm border-2 border-black rounded-none shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] bg-white">
        <CardHeader>
          <CardTitle className="text-3xl font-black uppercase tracking-tighter">Connexion</CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleLogin} className="space-y-4">
            <div className="space-y-2">
              <Input 
                type="email" 
                className="border-2 border-black p-3 font-bold outline-none rounded-none h-11 focus-visible:ring-0" 
                placeholder="EMAIL"
                required                
                onChange={(e) => setEmail(e.target.value)} />
            </div>
            <div className="space-y-2">
              <Input 
                type="password" 
                placeholder="MOT DE PASSE"
                className="border-2 border-black p-3 font-bold outline-none rounded-none h-11 focus-visible:ring-0" 
                required
                onChange={(e) => setPassword(e.target.value)} />
            </div>
            <Button className="w-full bg-black text-white hover:bg-zinc-800 rounded-none h-12 font-bold uppercase" disabled={loading}>
              {loading ? "Connexion..." : "Se connecter"}
            </Button>
            <p className="text-center text-xs mt-4">
              Pas encore de compte ? <Link to="/signup" className="underline font-bold">S'inscrire</Link>
            </p>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}