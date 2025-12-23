import { useState } from "react";
import { supabase } from "@/lib/supabase";
import { X, Loader2 } from "lucide-react";
import { PropertyFormFields } from "./PropertyFormFields";
import { initialPropertyState, type PropertyFormData } from "@/types/property";

interface Props {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
}

export function AddApartmentModal({ isOpen, onClose, onSuccess }: Props) {
  const [formData, setFormData] = useState<PropertyFormData>(initialPropertyState);
  const [loading, setLoading] = useState(false);

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
  e.preventDefault();
  setLoading(true);

  try {
    const { data: { session } } = await supabase.auth.getSession();
    const headers = {
      "Content-Type": "application/json",
      Authorization: `Bearer ${session?.access_token}`,
    };

    // 1. APPEL APPARTEMENT
    const aptRes = await fetch(`${import.meta.env.VITE_API_URL}/api/apartments`, {
      method: "POST",
      headers,
      body: JSON.stringify({
        address: formData.address,
        zip_code: formData.zip_code,
        city: formData.city,
        rent_hc: formData.rent_hc,
        charges: formData.charges,
      }),
    });
    const apartment = await aptRes.json();
    if (!aptRes.ok) throw new Error(apartment.error);

    // 2. APPEL LOCATAIRE (en utilisant l'ID de l'appartement reçu)
    const tenantRes = await fetch(`${import.meta.env.VITE_API_URL}/api/tenants`, {
      method: "POST",
      headers,
      body: JSON.stringify({
        first_name: formData.first_name,
        last_name: formData.last_name,
        email: formData.email,
        phone: formData.phone,
        apartment_id: apartment.id // On lie les deux ici
      }),
    });

    if (!tenantRes.ok) throw new Error("Erreur locataire");

    onSuccess();
    onClose();
  } catch (error) {
    alert(error.message);
  } finally {
    setLoading(false);
  }
};

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/80 backdrop-blur-sm p-4">
      <div className="bg-white border-4 border-black w-full max-w-4xl shadow-[12px_12px_0px_0px_rgba(0,0,0,1)]">
        {/* Header */}
        <div className="bg-black text-white p-6 flex justify-between items-center">
          <h2 className="text-2xl font-black uppercase italic tracking-tighter">Nouveau Bien Occupé</h2>
          <button onClick={onClose} className="hover:rotate-90 transition-transform">
            <X size={28} />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-8">
          <PropertyFormFields 
            formData={formData} 
            onChange={(newData) => setFormData({ ...formData, ...newData })} 
          />

          <div className="mt-10 flex justify-end gap-4">
            <button 
              type="button" 
              onClick={onClose}
              className="font-bold uppercase text-sm border-2 border-black px-6 py-2 hover:bg-zinc-100"
            >
              Annuler
            </button>
            <button 
              type="submit"
              disabled={loading}
              className="bg-black text-white font-bold uppercase text-sm px-10 py-3 flex items-center gap-2 hover:bg-zinc-800 disabled:bg-zinc-500"
            >
              {loading && <Loader2 className="animate-spin h-4 w-4" />}
              {loading ? "Création en cours..." : "Enregistrer le bien"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}