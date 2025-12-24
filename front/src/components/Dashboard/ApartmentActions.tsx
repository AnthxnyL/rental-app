import { Button } from "@/components/ui/button";
import { Mail, Pencil } from "lucide-react";

interface Props {
  onSendEmail: () => void;
  onEdit: () => void;
  isMobile?: boolean;
}

export function ApartmentActions({ onSendEmail, onEdit, isMobile }: Props) {
  return (
    <div className={`flex gap-3 ${isMobile ? "w-full pt-2" : "justify-end"}`}>
      <Button
        variant="outline"
        size={isMobile ? "default" : "icon"}
        className={`rounded-none border-2 border-black bg-yellow-400 text-black font-bold uppercase shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] hover:shadow-none transition-all ${isMobile ? "flex-1" : ""}`}
        onClick={onSendEmail}
      >
        <Mail className={isMobile ? "mr-2 h-4 w-4" : "h-4 w-4"} />
        {isMobile && "Quittance"}
      </Button>
      <Button
        variant="outline"
        size={isMobile ? "default" : "icon"}
        className={`rounded-none border-2 border-black font-bold uppercase shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] hover:shadow-none transition-all ${isMobile ? "" : ""}`}
        onClick={onEdit}
      >
        <Pencil className="h-4 w-4" />
      </Button>
    </div>
  );
}