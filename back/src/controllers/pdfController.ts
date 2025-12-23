import { Response } from 'express';
import PDFDocument from 'pdfkit';
import { fetchFullTenantData } from './tenantController';
import { drawReceiptContent } from '../services/pdfService';
import { transporter } from '../config/mailer';

// 1. TÉLÉCHARGEMENT DIRECT
export const generatePdf = async (req: any, res: Response) => {
  const { tenantId, month, year } = req.query;
  try {
    const { data: tenant, error } = await fetchFullTenantData(tenantId as string, req.user.id);
    if (error || !tenant) return res.status(404).json({ error: "Introuvable" });

    const doc = new PDFDocument({ size: 'A4', margin: 50 });
    res.setHeader('Content-Type', 'application/pdf');
    res.setHeader('Content-Disposition', `attachment; filename=Quittance_${tenant.last_name}.pdf`);
    
    doc.pipe(res);
    drawReceiptContent(doc, tenant, month as string, year as string);
    doc.end();
  } catch (err) {
    res.status(500).json({ error: "Erreur génération" });
  }
};

// 2. ENVOI PAR E-MAIL
export const sendReceiptEmail = async (req: any, res: Response) => {
  const { tenantId, month, year } = req.body;
  try {
    const { data: tenant, error } = await fetchFullTenantData(tenantId, req.user.id);
    if (error || !tenant) return res.status(404).json({ error: "Locataire introuvable" });

    const doc = new PDFDocument({ size: 'A4', margin: 50 });
    let chunks: any[] = [];
    doc.on('data', (chunk) => chunks.push(chunk));
    
    doc.on('end', async () => {
      const pdfBuffer = Buffer.concat(chunks);
      await transporter.sendMail({
        from: `"LocatGestion" <${process.env.SMTP_USER}>`,
        to: tenant.email,
        subject: `Quittance de loyer - ${month}/${year}`,
        text: `Bonjour ${tenant.first_name}, veuillez trouver votre quittance ci-jointe.`,
        attachments: [{ filename: `Quittance_${month}_${year}.pdf`, content: pdfBuffer }]
      });
      res.json({ message: "Email envoyé !" });
    });

    drawReceiptContent(doc, tenant, month, year);
    doc.end();
  } catch (err) {
    res.status(500).json({ error: "Échec de l'envoi" });
  }
};