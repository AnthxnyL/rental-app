import nodemailer from 'nodemailer';
import dotenv from 'dotenv';
dotenv.config();

export const transporter = nodemailer.createTransport({
  host: 'smtp.gmail.com', // Force l'écriture directe pour tester
  port: 587,
  secure: false,
  auth: {
    user: process.env.SMTP_USER,
    pass: process.env.SMTP_PASS,
  },
  // --- AJOUTE CECI ---
  dnsTimeout: 10000,
  connectionTimeout: 20000,
  // -------------------
  tls: {
    rejectUnauthorized: false,
    minVersion: 'TLSv1.2' // Force une version de TLS moderne
  }
});

// Vérification silencieuse au démarrage du serveur
transporter.verify((error) => {
  if (error) console.error("[SMTP] ❌ Erreur de configuration:", error.message);
  else console.log("[SMTP] ✅ Serveur de mail prêt");
});