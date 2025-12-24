import { type PropertyFormData } from "@/types/property";
import { Building2, UserCircle } from "lucide-react";
import { Input } from "../ui/input";

interface Props {
  formData: PropertyFormData;
  onChange: (data: Partial<PropertyFormData>) => void;
}

export function PropertyFormFields({ formData, onChange }: Props) {
  const handleInputChange = (field: keyof PropertyFormData) => (e: any) => {
    onChange({ [field]: e.target.value });
  };

  const handleNumberChange = (field: keyof PropertyFormData) => (e: any) => {
    onChange({ [field]: Number(e.target.value) });
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
      {/* SECTION APPARTEMENT */}
      <div className="space-y-4">
        <div className="flex items-center gap-2 font-black uppercase text-sm border-b-2 border-black pb-2">
          <Building2 size={18} /> <span>Le Bien Immobilier</span>
        </div>
        <Input 
          className="border-2 border-black p-3 font-bold outline-none rounded-none h-11 focus-visible:ring-0"
          placeholder="ADRESSE"
          value={formData.address}
          onChange={handleInputChange('address')}
          required
        />
        <div className="grid grid-cols-3 gap-2">
          <Input 
            className="col-span-1 border-2 border-black p-3 font-bold outline-none rounded-none h-11 focus-visible:ring-0"
            placeholder="CP"
            value={formData.zip_code}
            onChange={handleInputChange('zip_code')}
            required
          />
          <Input 
            className="col-span-2 border-2 border-black p-3 font-bold outline-none rounded-none h-11 focus-visible:ring-0"
            placeholder="VILLE"
            value={formData.city}
            onChange={handleInputChange('city')}
            required
          />
        </div>
        <div className="grid grid-cols-2 gap-2">
          <Input 
            type="number"
            className="border-2 border-black p-3 font-bold outline-none rounded-none h-11 focus-visible:ring-0"
            placeholder="LOYER HC (€)"
            value={formData.rent_hc || 0}
            onChange={handleNumberChange('rent_hc')}
            required
          />
          <Input 
            type="number"
            className="border-2 border-black p-3 font-bold outline-none rounded-none h-11 focus-visible:ring-0"
            placeholder="CHARGES (€)"
            value={formData.charges || 0}
            onChange={handleNumberChange('charges')}
            required
          />
        </div>
      </div>

      {/* SECTION LOCATAIRE */}
      <div className="space-y-4">
        <div className="flex items-center gap-2 font-black uppercase text-sm border-b-2 border-black pb-2">
          <UserCircle size={18} /> <span>Le Locataire</span>
        </div>
        <Input 
          className="border-2 border-black p-3 font-bold outline-none rounded-none h-11 focus-visible:ring-0"
          placeholder="NOM"
          value={formData.lastname}
          onChange={handleInputChange('lastname')}
          required
        />
        <Input 
          className="border-2 border-black p-3 font-bold outline-none rounded-none h-11 focus-visible:ring-0"
          placeholder="PRÉNOM"
          value={formData.firstname}
          onChange={handleInputChange('firstname')}
          required
        />
        <Input 
          type="email"
          className="border-2 border-black p-3 font-bold outline-none rounded-none h-11 focus-visible:ring-0"
          placeholder="EMAIL"
          value={formData.email}
          onChange={handleInputChange('email')}
          required
        />
      </div>
    </div>
  );
}