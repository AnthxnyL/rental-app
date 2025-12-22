import { useState, useEffect } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { supabase } from "@/lib/supabase";

interface ApartmentModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
  initialData?: any; // Les infos de l'appart si on modifie
}

export default function ApartmentModal({ isOpen, onClose, onSuccess, initialData }: ApartmentModalProps) {
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    address: "",
    city: "",
    postal_code: "",
    rent_hc: "",
    charges: ""
  });

  // Remplir le formulaire si on est en mode édition
  useEffect(() => {
    if (initialData) {
      setFormData(initialData);
    } else {
      setFormData({ address: "", city: "", postal_code: "", rent_hc: "", charges: "" });
    }
  }, [initialData, isOpen]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const { data: { session } } = await supabase.auth.getSession();
      const method = initialData ? "PUT" : "POST";
      const url = initialData 
        ? `${import.meta.env.VITE_API_URL}/api/apartments/${initialData.id}`
        : `${import.meta.env.VITE_API_URL}/api/apartments`;

      const response = await fetch(url, {
        method: method,
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${session?.access_token}`
        },
        body: JSON.stringify(formData),
      });

      if (!response.ok) throw new Error("Erreur lors de l'enregistrement");

      onSuccess(); // Rafraîchir la liste
      onClose();   // Fermer la modal
    } catch (error: any) {
      alert(error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[425px] border-2 border-black rounded-none shadow-[8px_8px_0px_0px_rgba(0,0,0,1)]">
        <DialogHeader>
          <DialogTitle className="text-2xl font-black uppercase tracking-tighter">
            {initialData ? "Modifier le bien" : "Ajouter un bien"}
          </DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4 pt-4">
          <div className="space-y-2">
            <Label className="uppercase font-bold text-[10px]">Adresse</Label>
            <Input 
              className="border-black rounded-none focus-visible:ring-0"
              value={formData.address}
              onChange={(e) => setFormData({...formData, address: e.target.value})}
              required
            />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label className="uppercase font-bold text-[10px]">Ville</Label>
              <Input 
                className="border-black rounded-none focus-visible:ring-0"
                value={formData.city}
                onChange={(e) => setFormData({...formData, city: e.target.value})}
                required
              />
            </div>
            <div className="space-y-2">
              <Label className="uppercase font-bold text-[10px]">Code Postal</Label>
              <Input 
                className="border-black rounded-none focus-visible:ring-0"
                value={formData.postal_code}
                onChange={(e) => setFormData({...formData, postal_code: e.target.value})}
                required
              />
            </div>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label className="uppercase font-bold text-[10px]">Loyer HC (€)</Label>
              <Input 
                type="number"
                className="border-black rounded-none focus-visible:ring-0"
                value={formData.rent_hc}
                onChange={(e) => setFormData({...formData, rent_hc: e.target.value})}
                required
              />
            </div>
            <div className="space-y-2">
              <Label className="uppercase font-bold text-[10px]">Charges (€)</Label>
              <Input 
                type="number"
                className="border-black rounded-none focus-visible:ring-0"
                value={formData.charges}
                onChange={(e) => setFormData({...formData, charges: e.target.value})}
                required
              />
            </div>
          </div>
          <DialogFooter className="pt-4">
            <Button 
              type="submit" 
              className="w-full bg-black text-white hover:bg-zinc-800 rounded-none h-12 font-bold uppercase transition-all"
              disabled={loading}
            >
              {loading ? "Enregistrement..." : "Confirmer"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}