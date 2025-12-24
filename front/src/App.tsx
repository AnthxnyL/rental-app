import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";
import SigninPage from "./pages/SigninPage";
import SignupPage from "./pages/SignupPage";
import Dashboard from "./pages/Dashboard";
import type { Session } from "@supabase/supabase-js";
import { Toaster } from "sonner";

function App() {
  const [session, setSession] = useState<Session | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // 1. Récupérer la session actuelle au chargement
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
      setLoading(false);
    });

    // 2. Ecouter les changements (connexion / déconnexion)
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session);
    });

    return () => subscription.unsubscribe();
  }, []);

  if (loading) return <div className="flex h-screen items-center justify-center font-bold uppercase italic">Chargement...</div>;

  return (
    <Router>
      <Toaster position="top-right" richColors />
      <Routes>
        {/* Routes Publiques */}
        <Route path="/signin" element={!session ? <SigninPage /> : <Navigate to="/dashboard" />} />
        <Route path="/signup" element={!session ? <SignupPage /> : <Navigate to="/dashboard" />} />

        {/* Route Privée (Dashboard) */}
        <Route 
          path="/dashboard" 
          element={session ? <Dashboard /> : <Navigate to="/signin" />} 
        />

        {/* Redirection par défaut */}
        <Route path="/" element={<Navigate to={session ? "/dashboard" : "/signin"} />} />
      </Routes>
    </Router>
  );
}

export default App;