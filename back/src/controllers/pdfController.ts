import { Response } from 'express';
import PDFDocument from 'pdfkit';
import { fetchFullTenantData } from './tenantController';
import { drawReceiptContent } from '../services/pdfService';
import { transporter } from '../config/mailer';
import { getMonthName, getLastDayOfMonth, formatTwoDigits } from '../utils/date';

// 1. TÉLÉCHARGEMENT DIRECT
export const generatePdf = async (req: any, res: Response) => {
  const { tenantId, month, year } = req.query;
  try {
    const { data: tenant, error } = await fetchFullTenantData(tenantId as string, req.user.id);
    if (error || !tenant) return res.status(404).json({ error: "Introuvable" });

    const doc = new PDFDocument({ size: 'A4', margin: 50 });
    res.setHeader('Content-Type', 'application/pdf');
    res.setHeader('Content-Disposition', `attachment; filename=Quittance_${tenant.lastname}.pdf`);
    
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
    const monthName = getMonthName(month);
    const lastDay = getLastDayOfMonth(month, year);
    const formattedMonth = formatTwoDigits(month);
    

    const doc = new PDFDocument({ size: 'A4', margin: 50 });
    let chunks: any[] = [];
    doc.on('data', (chunk) => chunks.push(chunk));
    
    doc.on('end', async () => {
      const pdfBuffer = Buffer.concat(chunks);
      await transporter.sendMail({
        from: `"Gestion Locative - ${tenant.profiles.firstname} ${tenant.profiles.lastname}" <${process.env.SMTP_USER}>`,
        to: tenant.email,
        subject: `Quittance de loyer - ${monthName} ${year}`,
        html: `
            <div style="font-family: sans-serif; line-height: 1.5; color: #333;">
            <p>Bonjour <strong>${tenant.firstname} ${tenant.lastname}</strong>,</p>
            
            <p>Nous vous confirmons la bonne réception de votre règlement pour le loyer du mois de <strong>${monthName} ${year}</strong>.</p>
            
            <p>Vous trouverez en pièce jointe de ce mail votre quittance de loyer correspondante.</p>
            
            <p>Ce document atteste du paiement intégral de votre terme pour le logement situé au :<br>
            <em>${tenant.apartments.address}, ${tenant.apartments.zip_code} ${tenant.apartments.city}</em></p>
            
            <p>Nous vous recommandons de conserver ce document pendant une durée de 3 ans.</p>
            
            <p>Restant à votre disposition pour toute information complémentaire.</p>
            
            <hr style="border: none; border-top: 1px solid #eee; margin: 20px 0;">
            
            <p style="font-size: 12px; color: #666;">
                Cordialement,<br>
                <strong>${tenant.profiles.firstname} ${tenant.profiles.lastname}</strong><br>
                ${tenant.profiles.phone || ''}
            </p>
            </div>
        `,
        attachments: [
            {
            filename: `Quittance_${tenant.lastname}_${monthName}_${year}.pdf`,
            content: pdfBuffer,
            },
        ],
      });
      res.json({ message: "Email envoyé !" });
    });

    drawReceiptContent(doc, tenant, month, year);
    doc.end();
  } catch (err) {
    res.status(500).json({ error: "Échec de l'envoi" });
  }
};