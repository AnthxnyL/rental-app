import  { sendRentMail }  from "../../services/mailerService";
import LongButton from "../Buttons/LongButton";
import CircleButton from "../Buttons/CircleButton";


function ApartmentCardButton({ apartment }) {

    const handleClick = async () => {
        try {
        const response = await sendRentMail({
            to: apartment.User.email,
            subject: 'Quittance de loyer',
            text: `Bonjour ${apartment.User.lastname} ${apartment.User.firstname}, voici votre quittance.`,
        });
        console.log('Email envoyé ✅', response);
        } catch (error) {
            console.error('Erreur lors de l\'envoi de l\'email:', error);
            alert("L'envoi de l'email a échoué ❌");
        }
    };

   


    return (
        <LongButton
            onClick={handleClick}
            className="bg-blue-500 text-white hover:bg-blue-600"
        >
            Envoyer un email
        </LongButton>
    );
}

export default ApartmentCardButton;