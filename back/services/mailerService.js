import nodemailer from "nodemailer";

const transporter = nodemailer.createTransport({
  service: process.env.MAIL_SERVICE,
  auth: {
    user: process.env.MAIL_USER,
    pass: process.env.MAIL_PASS,
  },
});

export async function sendMail({ to, subject, text, html }) {
  return transporter.sendMail({
    from: process.env.MAIL_USER,
    to,
    subject,
    text,
    html,
  });
}


export async function sendRentMailsToAllTenants(apartments) {
  try {
    for (const apartment of apartments) {
      const mailData = {
        to: apartment.User.email,
        subject: 'Quittance de loyer',
        text: `Bonjour ${apartment.User.lastname} ${apartment.User.firstname}, voici votre quittance.`,
      };
      await sendMail(mailData);
      console.log(`Email sent to ${apartment.User.email}`);
    }
  } catch (error) {
    console.error('Error sending mails to all tenants:', error);
    throw error;
  }
}