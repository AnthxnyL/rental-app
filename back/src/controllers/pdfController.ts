import { Response } from 'express';
import PDFDocument from 'pdfkit';
import { fetchFullTenantData } from './tenantController';
import { drawReceiptContent } from '../services/pdfService';
import { transporter } from '../config/mailer';
import { getMonthName } from '../utils/date';

/**
 * Utilitaire interne pour transformer le flux PDF en Buffer exploitable
 */
const generatePdfBuffer = (tenant: any, month: string, year: string): Promise<Buffer> => {
  return new Promise((resolve, reject) => {
    const doc = new PDFDocument({ size: 'A4', margin: 50 });
    let chunks: Buffer[] = [];

    doc.on('data', (chunk) => chunks.push(chunk));
    doc.on('end', () => resolve(Buffer.concat(chunks)));
    doc.on('error', (err) => reject(err));

    drawReceiptContent(doc, tenant, month, year);
    doc.end();
  });
};

// 1. TÉLÉCHARGEMENT DIRECT (Utilise le stream pour plus de rapidité)
export const generatePdf = async (req: any, res: Response) => {
  const { tenantId, month, year } = req.query;
  try {
    console.log(`[PDF] Génération téléchargement pour Locataire: ${tenantId}`);
    const { data: tenant, error } = await fetchFullTenantData(tenantId as string, req.user.id);
    
    if (error || !tenant) return res.status(404).json({ error: "Locataire introuvable" });

    const doc = new PDFDocument({ size: 'A4', margin: 50 });
    res.setHeader('Content-Type', 'application/pdf');
    res.setHeader('Content-Disposition', `attachment; filename=Quittance_${tenant.lastname}.pdf`);
    
    doc.pipe(res);
    drawReceiptContent(doc, tenant, String(month), String(year));
    doc.end();
    
    console.log(`[PDF] ✅ Download terminé pour ${tenant.lastname}`);
  } catch (err) {
    console.error("[PDF Error] Download failed:", err);
    res.status(500).json({ error: "Erreur génération" });
  }
};

// 2. ENVOI PAR E-MAIL (Utilise le Buffer promisifié)
export const sendReceiptEmail = async (req: any, res: Response) => {
  const { tenantId, month, year } = req.body;
  const ownerId = req.user.id;

  try {
    console.log(`[Email] Début du processus d'envoi pour: ${tenantId}`);
    
    const { data: tenant, error } = await fetchFullTenantData(tenantId, ownerId);
    if (error || !tenant) return res.status(404).json({ error: "Locataire introuvable" });

    const m = String(month);
    const y = String(year);
    const monthName = getMonthName(m);

    // Étape 1: Générer le Buffer
    console.log("[PDF] Création du buffer...");
    const pdfBuffer = await generatePdfBuffer(tenant, m, y);
    console.log(`[PDF] ✅ Buffer généré (${(pdfBuffer.length / 1024).toFixed(1)} KB)`);

    // Étape 2: Envoyer le mail
    console.log(`[SMTP] Tentative d'envoi à ${tenant.email}...`);
    
    await transporter.sendMail({
      from: `"Gestion Locative" <${process.env.SMTP_USER}>`,
      to: tenant.email,
      subject: `Quittance de loyer - ${monthName} ${y}`,
      html: `
        <div style="font-family: sans-serif; color: #333;">
          <p>Bonjour <strong>${tenant.firstname} ${tenant.lastname}</strong>,</p>
          <p>Votre loyer pour <strong>${monthName} ${y}</strong> a été réceptionné.</p>
          <p>Veuillez trouver votre quittance en pièce jointe.</p>
          <p>Cordialement,<br>${tenant.profiles.firstname} ${tenant.profiles.lastname}</p>
        </div>
      `,
      attachments: [
        {
          filename: `Quittance_${tenant.lastname}_${monthName}_${y}.pdf`,
          content: pdfBuffer,
        },
      ],
    });

    console.log(`[Email] 🚀 Succès ! Mail envoyé à ${tenant.email}`);
    return res.json({ message: "Email envoyé avec succès !" });

  } catch (err: any) {
    console.error("[Email Error] Détails:", err);
    // Gestion spécifique du Timeout SMTP
    if (err.code === 'ETIMEDOUT') {
      return res.status(504).json({ error: "Le serveur de mail ne répond pas (Timeout)." });
    }
    return res.status(500).json({ error: "Échec de l'envoi." });
  }
};