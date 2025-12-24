import { type PropertyFormData } from "@/types/property";
import { Building2, UserCircle } from "lucide-react";

interface Props {
  formData: PropertyFormData;
  onChange: (data: Partial<PropertyFormData>) => void;
}

export function PropertyFormFields({ formData, onChange }: Props) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
      {/* SECTION APPARTEMENT */}
      <div className="space-y-4">
        <div className="flex items-center gap-2 font-black uppercase text-sm border-b-2 border-black pb-2">
          <Building2 size={18} /> <span>Le Bien Immobilier</span>
        </div>
        <input 
          className="w-full border-2 border-black p-3 font-bold focus:shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] outline-none transition-all"
          placeholder="ADRESSE"
          value={formData.address}
          onChange={(e) => onChange({ address: e.target.value })}
          required
        />
        <div className="grid grid-cols-3 gap-2">
          <input 
            className="col-span-1 border-2 border-black p-3 font-bold outline-none"
            placeholder="CP"
            value={formData.zip_code}
            onChange={(e) => onChange({ zip_code: e.target.value })}
            required
          />
          <input 
            className="col-span-2 border-2 border-black p-3 font-bold outline-none"
            placeholder="VILLE"
            value={formData.city}
            onChange={(e) => onChange({ city: e.target.value })}
            required
          />
        </div>
        <div className="grid grid-cols-2 gap-2">
          <input 
            type="number"
            className="border-2 border-black p-3 font-bold outline-none"
            placeholder="LOYER HC (€)"
            value={formData.rent_hc || 0}
            onChange={(e) => onChange({ rent_hc: Number(e.target.value) })}
            required
          />
          <input 
            type="number"
            className="border-2 border-black p-3 font-bold outline-none"
            placeholder="CHARGES (€)"
            value={formData.charges || 0}
            onChange={(e) => onChange({ charges: Number(e.target.value) })}
            required
          />
        </div>
      </div>

      {/* SECTION LOCATAIRE */}
      <div className="space-y-4">
        <div className="flex items-center gap-2 font-black uppercase text-sm border-b-2 border-black pb-2">
          <UserCircle size={18} /> <span>Le Locataire</span>
        </div>
        <input 
          className="w-full border-2 border-black p-3 font-bold outline-none"
          placeholder="NOM"
          value={formData.lastname}
          onChange={(e) => onChange({ lastname: e.target.value })}
          required
        />
        <input 
          className="w-full border-2 border-black p-3 font-bold outline-none"
          placeholder="PRÉNOM"
          value={formData.firstname}
          onChange={(e) => onChange({ firstname: e.target.value })}
          required
        />
        <input 
          type="email"
          className="w-full border-2 border-black p-3 font-bold outline-none"
          placeholder="EMAIL"
          value={formData.email}
          onChange={(e) => onChange({ email: e.target.value })}
          required
        />
      </div>
    </div>
  );
}