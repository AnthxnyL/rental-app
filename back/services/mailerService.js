import nodemailer from "nodemailer";

const transporter = nodemailer.createTransport({
  service: process.env.MAIL_SERVICE,
  auth: {
    user: process.env.MAIL_USER,
    pass: process.env.MAIL_PASS,
  },
});

export async function sendMail({ to, subject, text, html, pdfPath }) {
  return transporter.sendMail({
    from: process.env.MAIL_USER,
    to,
    subject,
    text,
    html,
    attachments: pdfPath
      ? [
          {
            filename: 'quittance.pdf',
            path: pdfPath, // Chemin absolu ou relatif vers le PDF à joindre
            contentType: 'application/pdf',
          },
        ]
      : [],
  });
}


export async function sendRentMailsToAllTenants(apartments) {
  try {
    for (const apartment of apartments) {
      const mailData = {
        to: apartment.User.email,
        subject: 'Quittance de loyer',
        text: `Bonjour ${apartment.User.lastname} ${apartment.User.firstname}, voici votre quittance.`,
        pdfPath: `quittances/${apartment.User.lastname}_${apartment.User.firstname}/${apartment.User.lastname.toLowerCase()}_${apartment.User.firstname.toLowerCase()}_${new Date().toLocaleString('fr-FR', { month: 'long' })}_${new Date().getFullYear()}.pdf`,
      };
      await sendMail(mailData);
      console.log(`Email sent to ${apartment.User.email}`);
    }
  } catch (error) {
    console.error('Error sending mails to all tenants:', error);
    throw error;
  }
}