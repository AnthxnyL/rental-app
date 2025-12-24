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
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from "@/components/ui/select";

export default function Dashboard() {
  const [apartments, setApartments] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedApartment, setSelectedApartment] = useState<any>(null);

  // États pour l'envoi de quittance
  const [isSendConfirmOpen, setIsSendConfirmOpen] = useState(false);
  const [apartmentToSend, setApartmentToSend] = useState<any>(null);
  const [isSending, setIsSending] = useState(false);
  
  // États de la période (Par défaut mois/année actuels)
  const [selectedMonth, setSelectedMonth] = useState((new Date().getMonth() + 1).toString());
  const [selectedYear, setSelectedYear] = useState(new Date().getFullYear().toString());

  const months = [
    { v: "1", l: "Janvier" }, { v: "2", l: "Février" }, { v: "3", l: "Mars" },
    { v: "4", l: "Avril" }, { v: "5", l: "Mai" }, { v: "6", l: "Juin" },
    { v: "7", l: "Juillet" }, { v: "8", l: "Août" }, { v: "9", l: "Septembre" },
    { v: "10", l: "Octobre" }, { v: "11", l: "Novembre" }, { v: "12", l: "Décembre" }
  ];

  const fetchApartments = async () => {
    try {
      const { data: { session } } = await supabase.auth.getSession();
      const res = await fetch(`${import.meta.env.VITE_API_URL}/api/apartments`, {
        headers: { Authorization: `Bearer ${session?.access_token}` },
      });
      const data = await res.json();
      setApartments(data);
    } catch (error) {
      toast.error("Erreur de chargement");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchApartments(); }, []);

  const handleOpenSendConfirm = (apt: any) => {
    if (!apt.tenants?.[0]?.id) return toast.error("Pas de locataire !");
    setApartmentToSend(apt);
    setIsSendConfirmOpen(true);
  };

  const handleConfirmSendEmail = async () => {
    setIsSending(true);
    try {
      const { data: { session } } = await supabase.auth.getSession();
      const res = await fetch(`${import.meta.env.VITE_API_URL}/api/pdf/send-email`, {
        method: "POST",
        headers: {
          "Authorization": `Bearer ${session?.access_token}`,
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          tenantId: apartmentToSend.tenants[0].id,
          month: parseInt(selectedMonth),
          year: parseInt(selectedYear)
        }),
      });

      if (res.ok) toast.success("Quittance envoyée !");
      else throw new Error("Échec de l'envoi");
    } catch (error: any) {
      toast.error(error.message);
    } finally {
      setIsSending(false);
      setIsSendConfirmOpen(false);
    }
  };

  return (
    <div className="min-h-screen bg-zinc-50">
      <Header />
      <main className="max-w-7xl mx-auto p-6 md:p-10">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-10">
          <div>
            <h1 className="text-4xl md:text-5xl font-black uppercase italic tracking-tighter">Tableau de bord</h1>
            <p className="text-zinc-500 font-medium">Gérez vos biens et vos quittances.</p>
          </div>
          <Button onClick={() => { setSelectedApartment(null); setIsModalOpen(true); }} className="bg-black text-white rounded-none h-14 px-8 font-bold uppercase shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]">
            <Plus className="mr-2" /> Ajouter un bien
          </Button>
        </div>

        {/* VUES RESPONSIVES */}
        <div className="md:hidden space-y-4">
          {apartments.map(apt => <ApartmentCard key={apt.id} apt={apt} onSendEmail={handleOpenSendConfirm} onEdit={(a) => { setSelectedApartment(a); setIsModalOpen(true); }} />)}
        </div>
        <div className="hidden md:block bg-white border-2 border-black shadow-[8px_8px_0px_0px_rgba(0,0,0,1)]">
          <ApartmentTable apartments={apartments} loading={loading} onSendEmail={handleOpenSendConfirm} onEdit={(a) => { setSelectedApartment(a); setIsModalOpen(true); }} />
        </div>
      </main>

      <AddApartmentModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} onSuccess={fetchApartments} initialData={selectedApartment} />

      {/* CONFIRMATION D'ENVOI AVEC SÉLECTEURS */}
      <ConfirmModal 
        isOpen={isSendConfirmOpen}
        onClose={() => setIsSendConfirmOpen(false)}
        onConfirm={handleConfirmSendEmail}
        title="Générer Quittance"
        loading={isSending}
        message={
          <div className="space-y-4 mt-2 text-left">
            <p className="text-sm font-medium text-zinc-600">Période pour {apartmentToSend?.tenants?.[0]?.firstname} :</p>
            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-1">
                <label className="text-[10px] font-black uppercase">Mois</label>
                <Select value={selectedMonth} onValueChange={setSelectedMonth}>
                  <SelectTrigger className="border-2 border-black rounded-none font-bold h-10 px-2 text-xs"><SelectValue /></SelectTrigger>
                  <SelectContent className="border-2 border-black rounded-none z-110">
                    {months.map(m => <SelectItem key={m.v} value={m.v}>{m.l}</SelectItem>)}
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-1">
                <label className="text-[10px] font-black uppercase">Année</label>
                <Select value={selectedYear} onValueChange={setSelectedYear}>
                  <SelectTrigger className="border-2 border-black rounded-none font-bold h-10 px-2 text-xs"><SelectValue /></SelectTrigger>
                  <SelectContent className="border-2 border-black rounded-none z-110">
                    <SelectItem value="2024">2024</SelectItem>
                    <SelectItem value="2025">2025</SelectItem>
                    <SelectItem value="2026">2026</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </div>
        }
      />
    </div>
  );
}