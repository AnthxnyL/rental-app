import { Button } from "./button";

export function ConfirmModal({ isOpen, onClose, onConfirm, title, message, loading, textButton }: any) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-100 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
      <div className="bg-white border-4 border-black p-6 max-w-sm w-full shadow-[8px_8px_0px_0px_rgba(0,0,0,1)]">
        <h2 className="text-2xl font-black uppercase mb-2">{title}</h2>
        <p className="text-zinc-600 mb-6">{message}</p>
        <div className="flex gap-4">
          <Button onClick={onClose} variant="outline" className="flex-1 rounded-none border-2 border-black font-bold uppercase">
            Annuler
          </Button>
          <Button 
            onClick={onConfirm} 
            className="flex-1 rounded-none bg-red-500 text-white border-2 border-black font-bold uppercase shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] hover:shadow-none transition-all"
            disabled={loading}
          >
            {loading ? "..." : textButton}
          </Button>
        </div>
      </div>
    </div>
  );
}