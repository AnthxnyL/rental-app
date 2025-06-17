
import { updateApartment } from "../../services/ApartmentService";
import LongButton from "../Buttons/LongButton";
import CircleButton from "../Buttons/CircleButton";
import { useState } from "react";

function ApartmentCardButton({ apartment }) {
    const [isPaid, setIsPaid] = useState(apartment.isPaid);

    const handleIsPaid = async () => {
        try {
            const updatedApartment = await updateApartment(apartment.id, { isPaid: !isPaid });
            setIsPaid(updatedApartment.isPaid);
        } catch (error) {
            console.error("Erreur lors de la mise à jour de l'état de paiement :", error);
        }
    };



    return (
        <div>

            <CircleButton
                onClick={handleIsPaid}
                className="bg-yellow-500 text-white hover:bg-yellow-600 mt-20"
            >
               Autoriser l'envoi de quittance
            </CircleButton>
            <LongButton
                text={isPaid ? "Quittance envoyée" : "Envoyer quittance"}
                onClick={handleIsPaid}
                disabled={isPaid}
                className="mt-4"
            />

        </div>
    );
}

export default ApartmentCardButton;