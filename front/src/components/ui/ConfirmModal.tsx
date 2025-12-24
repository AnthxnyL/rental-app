import type { ReactNode } from "react";
import { Button } from "./button";

interface ConfirmModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  title: string;
  message: ReactNode;
  loading?: boolean;
}

export function ConfirmModal({ isOpen, onClose, onConfirm, title, message, loading }: ConfirmModalProps) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-100 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
      <div className="bg-white border-4 border-black p-6 max-w-sm w-full shadow-[8px_8px_0px_0px_rgba(0,0,0,1)]">
        <h2 className="text-2xl font-black uppercase mb-2 italic tracking-tighter">{title}</h2>
        
        <div className="mb-6">{message}</div>
        
        <div className="flex gap-4">
          <Button 
            onClick={onClose} 
            variant="outline" 
            className="flex-1 rounded-none border-2 border-black font-bold uppercase"
          >
            Annuler
          </Button>
          <Button 
            onClick={onConfirm} 
            disabled={loading}
            className="flex-1 rounded-none bg-yellow-400 text-black border-2 border-black font-bold uppercase shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] hover:shadow-none transition-all"
          >
            {loading ? "Chargement..." : "Confirmer"}
          </Button>
        </div>
      </div>
    </div>
  );
}