import nodemailer from "nodemailer";
import { generateQuittance } from "./pdfService.js";
import { fetchAllApartments } from "../controllers/apartmentController.js";
import fs from "fs";

const transporter = nodemailer.createTransport({
  service: process.env.MAIL_SERVICE,
  auth: {
    user: process.env.MAIL_USER,
    pass: process.env.MAIL_PASS,
  },
});

// Envoie un e-mail avec une quittance de loyer en pièce jointe
export async function sendMail(mailData, pdfPath) {
  console.log(pdfPath)

  if (pdfPath.pdfPath && !fs.existsSync(pdfPath.pdfPath)) {
    throw new Error(`Le fichier PDF n'existe pas : ${pdfPath.pdfPath}`);
  }
  
  return transporter.sendMail({
    from: process.env.MAIL_USER,
    to : mailData.to,
    subject : mailData.subject,
    text : mailData.text,
    attachments: pdfPath.pdfPath
      ? [
          {
            filename: pdfPath.pdfName,
            path: pdfPath.pdfPath,
            contentType: 'application/pdf',
          },
        ]
      : [],
  });
}


// Obtient le premier et le dernier jour du mois en cours au format français
function getFirstAndLastDayOfCurrentMonth() {
  const now = new Date();
  const firstDay = new Date(now.getFullYear(), now.getMonth(), 1);
  const lastDay = new Date(now.getFullYear(), now.getMonth() + 1, 0);

  const format = (date) =>
    date.toLocaleDateString('fr-FR').split('/').map(d => d.padStart(2, '0')).join('/');

  return {
    first: format(firstDay),
    last: format(lastDay),
  };
}


// Génère le contenu du message texte pour l'e-mail de quittance
function generateTextContent(apartment) {
  const { first, last } = getFirstAndLastDayOfCurrentMonth();


  const message = `Bonjour ${apartment.User.firstname} ${apartment.User.lastname},\n
  Veuillez trouver en pièce jointe la quittance de loyer relative à la période du ${first} au ${last} pour le logement situé au ${apartment.address}, ${apartment.city}, ${apartment.postalCode}.\n
  Ce document atteste que vous êtes à jour de votre paiement, pour un montant total de ${apartment.rent + apartment.charges}, comprenant :\n
  - Loyer : ${apartment.rent}\n
  - Charges : ${apartment.charges}\n
  N’hésitez pas à me contacter si vous avez des questions ou si vous constatez une erreur.\n
  Bien cordialement,\n
  Carlos Lopes
  Propriétaire
  06 10 21 57 75
  `

  return message;
}


// Génère les données de l'e-mail pour la quittance de loyer
export async function generateMail(apartment) {
  try {

    await generateQuittance({
      User: apartment.User,
      address: apartment.address,
      rent: apartment.rent,
    });

    const mailData = {
      to: apartment.User.email,
      subject: `Quittance de loyer - ${apartment.User.firstname} ${apartment.User.lastname}`,
      text: generateTextContent(apartment)
    };

    console.log(`Mail data generated for ${apartment.User.email}:`, mailData);
    return mailData;
  } catch (error) {
    console.error('Error generating mail:', error);
    throw error;
  }
}

// Envoie la quittance de loyer à tous les locataires
export async function sendQuittanceMailToAll() {
  const apartments = await fetchAllApartments();
  for (const apartment of apartments) {

    if(apartment.isPaid === false || apartment.User === null) {
      console.log(`Aucun locataire pour l'appartement ${apartment._id}`);
      continue;
    }

    try {
      const pdfPath = await generateQuittance({
        User: apartment.User,
        address: apartment.address,
        rent: apartment.rent,
      });

      const mailData = await generateMail(apartment);

      await sendMail(mailData, pdfPath);
      console.log(`Mail envoyé à ${apartment.User.email}`);
    } catch (error) {
      console.error(`Erreur pour ${apartment.User?.email} :`, error.message);
    }
  }
}