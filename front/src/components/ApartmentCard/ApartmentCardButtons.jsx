import  { sendRentMail, sendRentMailsToAllTenants }  from "../../services/mailerService";
import LongButton from "../Buttons/LongButton";
import CircleButton from "../Buttons/CircleButton";

function ApartmentCardButton({ apartment }) {

    const handleClick = async () => {
        try {
            // Envoi individuel (déjà présent)
            // await sendRentMail({
            //     to: apartment.User.email,
            //     subject: 'Quittance de loyer',
            //     text: `Bonjour ${apartment.User.lastname} ${apartment.User.firstname}, voici votre quittance.`,
            // });
            // alert("Email envoyé !");
        } catch (error) {
            // alert("L'envoi de l'email a échoué ❌");
        }
    };

    // Nouveau : envoi groupé
    const handleSendAll = async () => {
        try {
            await sendRentMailsToAllTenants();
            alert("Emails envoyés à tous les locataires !");
        } catch (error) {
            alert("L'envoi groupé a échoué ❌");
        }
    };

    return (
        <div>
            <LongButton
                onClick={handleClick}
                className="bg-blue-500 text-white hover:bg-blue-600"
            >
                Envoyer un email
            </LongButton>
            <LongButton
                onClick={handleSendAll}
                className="bg-green-500 text-white hover:bg-green-600 mt-2"
            >
                Envoyer à tous les locataires
            </LongButton>
        </div>
    );
}

export default ApartmentCardButton;