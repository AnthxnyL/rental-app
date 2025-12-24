import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import { Header } from "@/components/layouts/Header";
import { AddApartmentModal } from "@/components/Dashboard/AddApartmentModal";
import { ApartmentTable } from "@/components/Dashboard/ApartmentTable";
import { ApartmentCard } from "@/components/Dashboard/ApartmentCard";
import { toast } from "sonner";
import { ConfirmModal } from "@/components/ui/ConfirmModal";

export default function Dashboard() {
  const [apartments, setApartments] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedApartment, setSelectedApartment] = useState<any>(null);

  // États pour la confirmation d'envoi d'email
  const [isSendConfirmOpen, setIsSendConfirmOpen] = useState(false);
  const [apartmentToSend, setApartmentToSend] = useState<any>(null);
  const [isSending, setIsSending] = useState(false);

  // 1. Récupération des données
  const fetchApartments = async () => {
    try {
      setLoading(true);
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
      toast.error("Impossible de charger les appartements");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchApartments();
  }, []);

  // 2. Gestion des Modaux d'Ajout/Edition
  const openEditModal = (apt: any) => {
    setSelectedApartment(apt);
    setIsModalOpen(true);
  };

  const openAddModal = () => {
    setSelectedApartment(null);
    setIsModalOpen(true);
  };

  // 3. Logique d'envoi d'email (Ouverture du modal de confirmation)
  const handleOpenSendConfirm = (apt: any) => {
    const tenantId = apt.tenants?.[0]?.id;
    if (!tenantId) {
      toast.error("Aucun locataire associé à ce bien.");
      return;
    }
    setApartmentToSend(apt);
    setIsSendConfirmOpen(true);
  };

  // 4. Exécution réelle de l'envoi (Appelée par le ConfirmModal)
  const handleConfirmSendEmail = async () => {
    if (!apartmentToSend) return;
    
    setIsSending(true);
    const tenant = apartmentToSend.tenants[0];

    try {
      const { data: { session } } = await supabase.auth.getSession();
      
      const response = await fetch(`${import.meta.env.VITE_API_URL}/api/pdf/send-email`, {
        method: "POST",
        headers: {
          "Authorization": `Bearer ${session?.access_token}`,
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          tenantId: tenant.id,
          month: new Date().getMonth() + 1,
          year: new Date().getFullYear()
        }),
      });

      if (response.ok) {
        toast.success(`Quittance envoyée avec succès à ${tenant.firstname} !`);
      } else {
        const result = await response.json();
        throw new Error(result.error || "Échec de l'envoi");
      }
    } catch (error: any) {
      toast.error(error.message);
    } finally {
      setIsSending(false);
      setIsSendConfirmOpen(false);
      setApartmentToSend(null);
    }
  };

  return (
    <div className="min-h-screen bg-zinc-50">
      <Header />

      <main className="max-w-7xl mx-auto p-6 md:p-10">
        {/* Entête du Dashboard */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-10">
          <div>
            <h1 className="text-4xl md:text-5xl font-black uppercase tracking-tighter italic">
              Tableau de bord
            </h1>
            <p className="text-zinc-500 font-medium">
              Gérez votre parc immobilier en toute simplicité.
            </p>
          </div>
          <Button 
            onClick={openAddModal}
            className="w-full md:w-auto bg-black text-white rounded-none h-14 px-8 font-bold uppercase shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] hover:shadow-none hover:translate-x-1 hover:translate-y-1 transition-all"
          >
            <Plus className="mr-2 h-5 w-5" /> Ajouter un bien
          </Button>
        </div>

        {/* --- VUE MOBILE : CARDS --- */}
        <div className="grid grid-cols-1 gap-6 md:hidden">
          {loading ? (
            <p className="text-center py-10 font-bold uppercase italic">Chargement...</p>
          ) : apartments.length === 0 ? (
            <p className="text-center py-10 font-bold uppercase italic text-zinc-400">Aucun bien trouvé.</p>
          ) : (
            apartments.map((apt) => (
              <ApartmentCard 
                key={apt.id} 
                apt={apt} 
                onSendEmail={handleOpenSendConfirm} 
                onEdit={openEditModal} 
              />
            ))
          )}
        </div>

        {/* --- VUE DESKTOP : TABLEAU --- */}
        <div className="hidden md:block bg-white border-2 border-black shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] overflow-hidden">
          <ApartmentTable 
            apartments={apartments} 
            loading={loading} 
            onSendEmail={handleOpenSendConfirm} 
            onEdit={openEditModal} 
          />
        </div>
      </main>

      {/* Modal Ajout / Edition */}
      <AddApartmentModal 
        isOpen={isModalOpen} 
        onClose={() => setIsModalOpen(false)} 
        onSuccess={fetchApartments}
        initialData={selectedApartment}
      />

      {/* Modal Confirmation Envoi Email */}
      <ConfirmModal 
        isOpen={isSendConfirmOpen}
        onClose={() => setIsSendConfirmOpen(false)}
        onConfirm={handleConfirmSendEmail}
        textButton="Envoyer"
        title="Confirmer l'envoi ?"
        message={`Voulez-vous envoyer la quittance de loyer par email à ${apartmentToSend?.tenants?.[0]?.firstname} ${apartmentToSend?.tenants?.[0]?.lastname} ?`}
        loading={isSending}
      />
    </div>
  );
}