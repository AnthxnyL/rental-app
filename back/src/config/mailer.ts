import nodemailer from 'nodemailer';
import dotenv from 'dotenv';
dotenv.config();

export const transporter = nodemailer.createTransport({
  host: "smtp.sendgrid.net",
  port: 587,
  secure: false,
  auth: {
    user: "apikey",
    pass: process.env.SENDGRID_API_KEY, 
  },
  tls: {
    rejectUnauthorized: false
  }
});

// Vérification silencieuse au démarrage du serveur
transporter.verify((error) => {
  if (error) console.error("[SMTP] ❌ Erreur de configuration:", error.message);
  else console.log("[SMTP] ✅ Serveur de mail prêt");
});