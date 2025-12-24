import { Mail, Pencil } from "lucide-react";
import { Button } from "@/components/ui/button";

interface ApartmentCardProps {
  apt: any;
  onSendEmail: (apt: any) => void;
  onEdit: (apt: any) => void;
}

export function ApartmentCard({ apt, onSendEmail, onEdit }: ApartmentCardProps) {
  const tenant = apt.tenants?.[0];

  return (
    <div className="bg-white border-2 border-black shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] p-5 space-y-4">
      <div className="flex justify-between items-start">
        <div className="max-w-[70%]">
          <h3 className="font-black uppercase text-lg leading-tight break-words">
            {apt.address}
          </h3>
          <p className="text-zinc-500 text-xs font-medium">
            {apt.city} ({apt.zip_code})
          </p>
        </div>
        <div className="bg-yellow-400 border-2 border-black px-2 py-1 text-xs font-black whitespace-nowrap">
          {Number(apt.rent_hc) + Number(apt.charges)}€
        </div>
      </div>

      <div className="border-t-2 border-zinc-100 pt-3">
        <p className="text-[10px] font-black uppercase text-zinc-400">Locataire actuel</p>
        <p className="font-bold uppercase text-sm">
          {tenant ? `${tenant.firstname} ${tenant.lastname}` : "Aucun locataire"}
        </p>
        {tenant?.phone && <p className="text-xs text-zinc-500">{tenant.phone}</p>}
      </div>

      <div className="flex gap-3 pt-2">
        <Button 
          className="flex-1 rounded-none border-2 border-black bg-yellow-400 text-black font-bold uppercase shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] active:shadow-none transition-all"
          onClick={() => onSendEmail(apt)}
        >
          <Mail className="mr-2 h-4 w-4" /> Quittance
        </Button>
        <Button 
          variant="outline"
          className="rounded-none border-2 border-black font-bold uppercase shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] active:shadow-none transition-all"
          onClick={() => onEdit(apt)}
        >
          <Pencil className="h-4 w-4" />
        </Button>
      </div>
    </div>
  );
}