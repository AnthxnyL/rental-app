import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";
import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Plus, Pencil, Mail } from "lucide-react";
import { Header } from "@/components/layouts/Header";
import { AddApartmentModal } from "@/components/Dashboard/AddApartmentModal";

export default function Dashboard() {
  const [apartments, setApartments] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedApartment, setSelectedApartment] = useState<any>(null);

  // 1. Récupérer les appartements depuis le Backend Render
  const fetchApartments = async () => {
    try {
      const { data: { session } } = await supabase.auth.getSession();
      
      const response = await fetch(`${import.meta.env.VITE_API_URL}/api/apartments`, {
        headers: {
          Authorization: `Bearer ${session?.access_token}`,
        },
      });

      if (!response.ok) throw new Error("Erreur lors de la récupération");
      const data = await response.json();
      setApartments(data);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };


  useEffect(() => {
    fetchApartments();
  }, []);

  const openEditModal = (apt: any) => {
    setSelectedApartment(apt);
    setIsModalOpen(true);
  };

  const openAddModal = () => {
    setSelectedApartment(null);
    setIsModalOpen(true);
  };

  const handleSendEmail = async (apt: any) => {
    const tenantId = apt.tenants?.[0]?.id;
    
    if (!tenantId) {
      alert("Aucun locataire associé.");
      return;
    }

    if (!confirm(`Envoyer la quittance par mail ?`)) return;

    try {
      const { data: { session } } = await supabase.auth.getSession();
      
      // URL propre sans paramètres
      const url = `${import.meta.env.VITE_API_URL}/api/pdf/send-email`;

      const response = await fetch(url, {
        method: "POST",
        headers: {
          "Authorization": `Bearer ${session?.access_token}`,
          "Content-Type": "application/json"
        },
        // Les données sont ici maintenant
        body: JSON.stringify({
          tenantId: tenantId,
          month: new Date().getMonth() + 1,
          year: new Date().getFullYear()
        }),
      });

      const result = await response.json();

      if (response.ok) {
        alert("Email envoyé avec succès !");
      } else {
        alert("Erreur : " + (result.error || "Échec de l'envoi"));
      }
    } catch (error: any) {
      alert("Erreur réseau : " + error.message);
    }
  };

  return (
    <div className="min-h-screen bg-zinc-50">
      {/* Barre de navigation simple */}
      <Header />

      <main className="max-w-7xl mx-auto p-6 md:p-10">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-10">
          <div>
            <h1 className="text-5xl font-black uppercase tracking-tighter italic">Tableau de bord</h1>
            <p className="text-zinc-500 font-medium">Gérez votre parc immobilier en toute simplicité.</p>
          </div>
          <Button 
            onClick={openAddModal}
            className="bg-black text-white rounded-none h-14 px-8 font-bold uppercase shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] hover:shadow-none hover:translate-x-1 hover:translate-y-1 transition-all"
          >
            <Plus className="mr-2 h-5 w-5" /> Ajouter un bien
          </Button>
        </div>

        {/* Liste des appartements */}
        <div className="bg-white border-2 border-black shadow-[8px_8px_0px_0px_rgba(0,0,0,1)]">
          <Table>
            <TableHeader className="bg-black">
              <TableRow className="hover:bg-black border-none">
                <TableHead className="text-white font-bold uppercase py-4 text-center">Locataire</TableHead>
                <TableHead className="text-white font-bold uppercase py-4 text-center">Bien / Adresse</TableHead>
                <TableHead className="text-white font-bold uppercase py-4 text-center">Ville</TableHead>
                <TableHead className="text-white font-bold uppercase py-4 text-center">Loyer (Charges incl.)</TableHead>
                <TableHead className="text-white font-bold uppercase py-4 text-center">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {loading ? (
                <TableRow>
                  <TableCell colSpan={5} className="text-center py-10 font-bold uppercase italic">
                    Chargement...
                  </TableCell>
                </TableRow>
              ) : apartments.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={5} className="text-center py-10 font-bold uppercase italic text-zinc-400">
                    Aucun appartement trouvé.
                  </TableCell>
                </TableRow>
              ) : (
                // ICI : Pas d'accolades autour du apartments.map
                apartments.map((apt) => {
                  const tenant = apt.tenants?.[0];
                  return (
                    <TableRow key={apt.id} className="border-b border-zinc-200 hover:bg-zinc-50 transition-colors">
                      <TableCell className="text-center italic">
                        {tenant ? (
                          <span className="font-bold text-black not-italic uppercase">
                            {tenant.firstname} {tenant.lastname}
                          </span>
                        ) : (
                          <span className="text-zinc-400">Aucun locataire</span>
                        )}
                      </TableCell>
                      <TableCell className="font-bold py-6 text-center">{apt.address}</TableCell>
                      <TableCell className="font-medium text-center">
                        {apt.city} ({apt.zip_code})
                      </TableCell>
                      <TableCell className="text-center font-bold">
                        {Number(apt.rent_hc) + Number(apt.charges)} €
                      </TableCell>
                      <TableCell className="text-center">
                        <div className="flex justify-center gap-2">
                          <Button
                            variant="outline"
                            size="icon"
                            className="rounded-none border-black bg-yellow-400 hover:bg-yellow-500 shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] hover:shadow-none transition-all"
                            onClick={() => handleSendEmail(apt)}
                            title="Envoyer la quittance"
                          >
                            <Mail className="h-4 w-4" />
                          </Button>

                          <Button
                            variant="outline"
                            size="icon"
                            className="rounded-none border-black hover:bg-zinc-100"
                            onClick={() => openEditModal(apt)}
                          >
                            <Pencil className="h-4 w-4" />
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  );
                })
              )}
            </TableBody>
          </Table>
        </div>
      </main>

      {/* Modal partagé Ajout / Edition */}
     <AddApartmentModal 
      isOpen={isModalOpen} 
      onClose={() => setIsModalOpen(false)} 
      onSuccess={fetchApartments}
      initialData={selectedApartment}
    />
    </div>
  );
}