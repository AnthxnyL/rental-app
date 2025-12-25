import nodemailer from 'nodemailer';
import dotenv from 'dotenv';
dotenv.config();

export const transporter = nodemailer.createTransport({
  host: process.env.SMTP_HOST,
  port: Number(process.env.SMTP_PORT) || 587,
  secure: false, // false pour 587
  auth: {
    user: process.env.SMTP_USER,
    pass: process.env.SMTP_PASS,
  },
  tls: {
    rejectUnauthorized: false
  },
  connectionTimeout: 20000, // Augmenté pour la prod
  greetingTimeout: 20000,
});

// Vérification silencieuse au démarrage du serveur
transporter.verify((error) => {
  if (error) console.error("[SMTP] ❌ Erreur de configuration:", error.message);
  else console.log("[SMTP] ✅ Serveur de mail prêt");
});