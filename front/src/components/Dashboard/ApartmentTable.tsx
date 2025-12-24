import { Mail, Pencil } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

interface ApartmentTableProps {
  apartments: any[];
  loading: boolean;
  onSendEmail: (apt: any) => void;
  onEdit: (apt: any) => void;
}

export function ApartmentTable({ apartments, loading, onSendEmail, onEdit }: ApartmentTableProps) {
  return (
    <Table>
      <TableHeader className="bg-black">
        <TableRow className="hover:bg-black border-none">
          <TableHead className="text-white font-bold uppercase py-4 text-center">Locataire</TableHead>
          <TableHead className="text-white font-bold uppercase py-4 text-center">Bien / Adresse</TableHead>
          <TableHead className="text-white font-bold uppercase py-4 text-center">Ville</TableHead>
          <TableHead className="text-white font-bold uppercase py-4 text-center">Loyer (CC)</TableHead>
          <TableHead className="text-white font-bold uppercase py-4 text-right pr-10">Actions</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {loading ? (
          <TableRow>
            <TableCell colSpan={5} className="text-center py-10 font-bold uppercase italic">Chargement...</TableCell>
          </TableRow>
        ) : apartments.length === 0 ? (
          <TableRow>
            <TableCell colSpan={5} className="text-center py-10 font-bold uppercase italic text-zinc-400">Aucun appartement trouvé.</TableCell>
          </TableRow>
        ) : (
          apartments.map((apt) => {
            const tenant = apt.tenants?.[0];
            return (
              <TableRow key={apt.id} className="border-b border-zinc-200 hover:bg-zinc-50 transition-colors">
                <TableCell className="text-center">
                  {tenant ? (
                    <div className="flex flex-col">
                      <span className="font-bold text-black uppercase">{tenant.firstname} {tenant.lastname}</span>
                      <span className="text-[10px] text-zinc-500">{tenant.phone}</span>
                    </div>
                  ) : (
                    <span className="text-zinc-400 italic">Vacant</span>
                  )}
                </TableCell>
                <TableCell className="font-bold py-6 text-center">{apt.address}</TableCell>
                <TableCell className="font-medium text-center">{apt.city} ({apt.zip_code})</TableCell>
                <TableCell className="text-center font-bold">
                  {Number(apt.rent_hc) + Number(apt.charges)} €
                </TableCell>
                <TableCell className="text-right pr-6">
                  <div className="flex justify-end gap-2">
                    <Button
                      variant="outline"
                      size="icon"
                      className="rounded-none border-black bg-yellow-400 hover:bg-yellow-500 shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] hover:shadow-none transition-all"
                      onClick={() => onSendEmail(apt)}
                      title="Envoyer la quittance"
                    >
                      <Mail className="h-4 w-4" />
                    </Button>
                    <Button
                      variant="outline"
                      size="icon"
                      className="rounded-none border-black hover:bg-zinc-100 shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] hover:shadow-none transition-all"
                      onClick={() => onEdit(apt)}
                    >
                      <Pencil className="h-4 w-4" />
                    </Button>
                  </div>
                </TableCell>
              </TableRow>
            );
          })
        )}
      </TableBody>
    </Table>
  );
}