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
import { Plus, Pencil, Trash2 } from "lucide-react";
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

  // 2. Supprimer un appartement
  const handleDelete = async (id: number) => {
    if (!confirm("Voulez-vous vraiment supprimer ce bien ?")) return;

    try {
      const { data: { session } } = await supabase.auth.getSession();
      const response = await fetch(`${import.meta.env.VITE_API_URL}/api/apartments/${id}`, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${session?.access_token}`,
        },
      });

      if (response.ok) {
        setApartments(apartments.filter((apt) => apt.id !== id));
      }
    } catch (error) {
      alert("Erreur lors de la suppression");
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
                <TableHead className="text-white font-bold uppercase py-4">Bien / Adresse</TableHead>
                <TableHead className="text-white font-bold uppercase py-4">Ville</TableHead>
                <TableHead className="text-white font-bold uppercase py-4 text-center">Loyer (Charges incl.)</TableHead>
                <TableHead className="text-white font-bold uppercase py-4 text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {loading ? (
                <TableRow><TableCell colSpan={4} className="text-center py-10 font-bold uppercase italic">Chargement...</TableCell></TableRow>
              ) : apartments.length === 0 ? (
                <TableRow><TableCell colSpan={4} className="text-center py-10 font-bold uppercase italic text-zinc-400">Aucun appartement trouvé.</TableCell></TableRow>
              ) : (
                apartments.map((apt) => (
                  <TableRow key={apt.id} className="border-b border-zinc-200 hover:bg-zinc-50 transition-colors">
                    <TableCell className="font-bold py-6">{apt.address}</TableCell>
                    <TableCell className="font-medium">{apt.city} ({apt.zip_code})</TableCell>
                    <TableCell className="text-center font-bold">
                      {Number(apt.rent_hc) + Number(apt.charges)} €
                    </TableCell>
                    <TableCell className="text-right">
                      <div className="flex justify-end gap-2">
                        <Button 
                          variant="outline" 
                          size="icon" 
                          className="rounded-none border-black hover:bg-zinc-100"
                          onClick={() => openEditModal(apt)}
                        >
                          <Pencil className="h-4 w-4" />
                        </Button>
                        <Button 
                          variant="outline" 
                          size="icon" 
                          className="rounded-none border-black hover:bg-red-50 hover:text-red-600 hover:border-red-600 transition-colors"
                          onClick={() => handleDelete(apt.id)}
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))
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
      />
    </div>
  );
}