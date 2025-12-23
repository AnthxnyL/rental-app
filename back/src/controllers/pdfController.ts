import { Response } from 'express';
import PDFDocument from 'pdfkit';
import { fetchFullTenantData } from './tenantController';

export const generatePdf = async (req: any, res: Response) => {
  const { tenantId, month, year } = req.query;

  try {
    const { data: tenant, error } = await fetchFullTenantData(tenantId as string, req.user.id);

    if (error || !tenant) return res.status(404).json({ error: "Données introuvables" });

    const doc = new PDFDocument({ size: 'A4', margin: 50 });

    const m = parseInt(month as string);
    const y = parseInt(year as string);
    
    // Le jour 0 du mois suivant est le dernier jour du mois actuel
    const lastDay = new Date(y, m, 0).getDate(); 
    const formattedMonth = String(m).padStart(2, '0');

    res.setHeader('Content-Type', 'application/pdf');
    res.setHeader('Content-Disposition', `attachment; filename=Quittance_${tenant.last_name}_${month}_${year}.pdf`);
    doc.pipe(res);

    // --- 1. EN-TÊTE ---
    doc.font('Helvetica-Bold').fontSize(22).text('QUITTANCE DE LOYER', { align: 'center' });
    doc.moveDown(0.5);
    doc.font('Helvetica').fontSize(11).text(`Quittance de loyer pour la période du 01/${formattedMonth}/${y} au ${lastDay}/${formattedMonth}/${y}`, { align: 'center' });
    
    doc.moveDown(3);

    const startY = doc.y;

    // --- 2. BLOCS COORDONNÉES ---
    // Bloc Propriétaire (Gauche)
    doc.font('Helvetica-Bold').fontSize(12).text('Propriétaire :', 50, startY);
    doc.font('Helvetica').fontSize(10).moveDown(0.5);
    doc.text(`Nom: ${tenant.profiles.lastname} ${tenant.profiles.firstname}`);
    doc.text(`Adresse: ${tenant.apartments.address}, ${tenant.apartments.postal_code} ${tenant.apartments.city}`);
    doc.text(`Email: ${tenant.profiles.email}`);

    // Bloc Locataire (Droite)
    doc.font('Helvetica-Bold').fontSize(12).text('Locataire :', 350, startY);
    doc.font('Helvetica').fontSize(10).moveDown(0.5);
    doc.text(`Nom: ${tenant.last_name} ${tenant.first_name}`, 350);
    doc.text(`Adresse: ${tenant.apartments.address}`, 350);
    doc.text(`${tenant.apartments.postal_code} ${tenant.apartments.city}`, 350);

    doc.moveDown(4);

    // --- 3. DÉTAILS DU LOYER ---
    doc.font('Helvetica-Bold').fontSize(14).text('Détails du Loyer', 50);
    doc.rect(50, doc.y + 5, 500, 1).fill('#000000'); // Ligne de séparation
    doc.moveDown(1.5);

    const totalAmount = (Number(tenant.apartments.rent_hc) + Number(tenant.apartments.charges)).toFixed(2);

    doc.font('Helvetica').fontSize(11);
    doc.text(`Montant du loyer :`, 50);
    doc.font('Helvetica-Bold').text(`${totalAmount} €`, 200, doc.y - 11);
    
    doc.moveDown(0.5);
    doc.font('Helvetica').text(`Date de paiement :`, 50);
    doc.text(`Le 05/${month}/${year}`, 200, doc.y - 11);

    doc.moveDown(0.5);
    doc.font('Helvetica').text(`Moyen de paiement :`, 50);
    doc.text(`Virement bancaire`, 200, doc.y - 11);

    doc.moveDown(4);

    // --- 4. BAS DE PAGE ---
    doc.font('Helvetica-Oblique').fontSize(9).fillColor('#444444');
    doc.text("Cette quittance est délivrée en double exemplaire, un pour le locataire et un pour le propriétaire.", { align: 'left' });
    
    doc.moveDown(2);
    doc.fillColor('#000000').font('Helvetica').fontSize(10);
    doc.text(`Fait à ${tenant.apartments.city}, le ${new Date().toLocaleDateString('fr-FR')}`, { align: 'right' });
    
    doc.moveDown(1.5);
    doc.font('Helvetica-Bold').text('Signature du Propriétaire :', { align: 'right' });
    
    doc.moveDown(4);
    doc.font('Helvetica').fontSize(8).fillColor('#888888').text(
      "Ce document est généré automatiquement et ne nécessite pas de signature manuscrite.", 
      { align: 'center' }
    );
    doc.text(`${year} - Locat.Gestion - Tous droits réservés`, { align: 'center' });

    doc.end();
  } catch (err: any) {
    res.status(500).json({ error: "Erreur lors de la génération du PDF" });
  }
};