import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";
import { X, Loader2 } from "lucide-react";
import { PropertyFormFields } from "./PropertyFormFields";
import { initialPropertyState, type PropertyFormData } from "@/types/property";

interface Props {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
  initialData?: any;
}

export function AddApartmentModal({ isOpen, onClose, onSuccess, initialData }: Props) {
  const [formData, setFormData] = useState<PropertyFormData>(initialPropertyState);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (isOpen && initialData) {
      // On extrait le locataire (s'il existe)
      const tenant = initialData.tenants?.[0] || {};

      setFormData({
        // Infos Appartement (Directement dans initialData)
        address: initialData.address || "",
        zip_code: initialData.zip_code || "",
        city: initialData.city || "",
        rent_hc: Number(initialData.rent_hc) || 0,
        charges: Number(initialData.charges) || 0,

        // Infos Locataire (Dans l'objet imbriqué)
        firstname: tenant.firstname || "",
        lastname: tenant.lastname || "",
        email: tenant.email || "",
        phone: tenant.phone || "",
      });
    } else if (isOpen && !initialData) {
      setFormData(initialPropertyState);
    }
  }, [initialData, isOpen]);

  console.log("AddApartmentModal rendu avec initialData:", initialData);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const { data: { session } } = await supabase.auth.getSession();

      const isEditing = !!initialData;
      const url = isEditing 
        ? `${import.meta.env.VITE_API_URL}/api/apartments/${initialData.id}`
        : `${import.meta.env.VITE_API_URL}/api/apartments`;

      const method = isEditing ? "PUT" : "POST";
      
      // UN SEUL APPEL vers /api/apartments
      const response = await fetch(url, {
        method,
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${session?.access_token}`,
        },
        // On envoie TOUT le formData (qui contient adresse + email + nom, etc.)
        body: JSON.stringify(formData), 
      });

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.error || "Erreur lors de la création");
      }

      // Si on arrive ici, le back a créé l'appart ET le locataire (ou utilisé un existant)
      console.log("Succès:", result.message);
      
      setFormData(initialPropertyState); // Reset le formulaire
      onSuccess(); // Rafraîchit le dashboard
      onClose();   // Ferme la pop-up
      
    } catch (error: any) {
      alert(error.message);
    } finally {
      setLoading(false);
    }
  };
  
  if (!isOpen) return null;


  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/80 backdrop-blur-sm p-4">
      <div className="bg-white border-4 border-black w-full max-w-4xl shadow-[12px_12px_0px_0px_rgba(0,0,0,1)]">
        {/* Header */}
        <div className="bg-black text-white p-6 flex justify-between items-center">
          <h2 className="text-2xl font-black uppercase italic tracking-tighter">{initialData ? "Modifier le bien" : "Ajouter un bien"}</h2>
          <button onClick={onClose} className="hover:rotate-90 transition-transform">
            <X size={28} />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-8">
          <PropertyFormFields 
            formData={formData} 
            onChange={(newData) => setFormData(prev => ({ ...prev, ...newData }))} />

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