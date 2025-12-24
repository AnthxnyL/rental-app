import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";
import { X, Trash2 } from "lucide-react";
import { PropertyFormFields } from "./PropertyFormFields";
import { initialPropertyState, type PropertyFormData } from "@/types/property";
import { Button } from "../ui/button";
import { toast } from "sonner";
import { ConfirmModal } from "../ui/ConfirmModal";

interface Props {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
  initialData?: any;
}

export function AddApartmentModal({ isOpen, onClose, onSuccess, initialData }: Props) {
  const [formData, setFormData] = useState<PropertyFormData>(initialPropertyState);
  const [loading, setLoading] = useState(false);
  const [isConfirmOpen, setIsConfirmOpen] = useState(false);

  useEffect(() => {
    if (isOpen && initialData) {
      const tenant = initialData.tenants?.[0] || {};
      setFormData({
        address: initialData.address || "",
        zip_code: initialData.zip_code || "",
        city: initialData.city || "",
        rent_hc: Number(initialData.rent_hc) || 0,
        charges: Number(initialData.charges) || 0,
        firstname: tenant.firstname || "",
        lastname: tenant.lastname || "",
        email: tenant.email || "",
        phone: tenant.phone || "",
      });
    } else if (isOpen && !initialData) {
      setFormData(initialPropertyState);
    }
  }, [initialData, isOpen]);

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
      
      const response = await fetch(url, {
        method,
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${session?.access_token}`,
        },
        body: JSON.stringify(formData), 
      });

      const result = await response.json();

      if (!response.ok) throw new Error(result.error || "Erreur lors de l'enregistrement");

      toast.success(isEditing ? "Bien modifié !" : "Bien créé !");
      setFormData(initialPropertyState);
      onSuccess();
      onClose();
      
    } catch (error: any) {
      toast.error(error.message);
    } finally {
      setLoading(false);
    }
  };

  // Cette fonction est appelée uniquement depuis le ConfirmModal
  const handleConfirmDelete = async () => {
    setLoading(true);
    try {
      const { data: { session } } = await supabase.auth.getSession();
      const response = await fetch(`${import.meta.env.VITE_API_URL}/api/apartments/${initialData.id}`, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${session?.access_token}`,
        },
      });

      if (!response.ok) throw new Error("Erreur lors de la suppression");

      toast.success("Le bien a été définitivement supprimé.");
      onSuccess();
      onClose();
    } catch (error: any) {
      toast.error(error.message || "Impossible de supprimer le bien.");
    } finally {
      setLoading(false);
      setIsConfirmOpen(false);
    }
  };
  
  if (!isOpen) return null;

  return (
    <>
      <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/80 backdrop-blur-sm p-4">
        <div className="bg-white border-4 border-black w-full max-w-4xl shadow-[12px_12px_0px_0px_rgba(0,0,0,1)]">
          {/* Header */}
          <div className="bg-black text-white p-6 flex justify-between items-center">
            <h2 className="text-2xl font-black uppercase italic tracking-tighter">
              {initialData ? "Modifier le bien" : "Ajouter un bien"}
            </h2>
            <button onClick={onClose} className="hover:rotate-90 transition-transform">
              <X size={28} />
            </button>
          </div>

          <form onSubmit={handleSubmit} className="p-8">
            <PropertyFormFields 
              formData={formData} 
              onChange={(newData) => setFormData(prev => ({ ...prev, ...newData }))} 
            />

            <div className="flex flex-col md:flex-row md:justify-between items-center mt-8 pt-6 border-t border-zinc-200 gap-4">
              {/* Bouton Supprimer à gauche */}
              {initialData && (
                <button
                  type="button"
                  onClick={() => setIsConfirmOpen(true)} // Ouvre la confirmation
                  disabled={loading}
                  className="flex items-center text-red-600 font-bold uppercase text-sm hover:bg-red-50 p-2 transition-colors"
                >
                  <Trash2 className="mr-2 h-4 w-4" />
                  Supprimer le bien
                </button>
              )}

              {/* Boutons d'action à droite */}
              <div className="flex gap-4 ml-auto">
                <Button 
                  type="button" 
                  variant="outline" 
                  onClick={onClose}
                  className="rounded-none border-2 border-black font-bold uppercase"
                >
                  Annuler
                </Button>
                <Button 
                  type="submit" 
                  disabled={loading}
                  className="rounded-none bg-black text-white border-2 border-black font-bold uppercase shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] hover:shadow-none hover:translate-x-0.5 hover:translate-y-0.5 transition-all"
                >
                  {loading ? "Enregistrement..." : initialData ? "Modifier" : "Créer"}
                </Button>
              </div>
            </div>
          </form>
        </div>
      </div>

      <ConfirmModal 
        isOpen={isConfirmOpen}
        onClose={() => setIsConfirmOpen(false)}
        onConfirm={handleConfirmDelete}
        textButton="Supprimer"
        title="Attention !"
        message="Voulez-vous vraiment supprimer ce bien ?"
        loading={loading}
      />
    </>
  );
}