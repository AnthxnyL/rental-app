import PDFKit from 'pdfkit';

export const drawReceiptContent = (doc: typeof PDFKit, tenant: any, month: string, year: string) => {
    const m = parseInt(month);
    const y = parseInt(year);
    const lastDay = new Date(y, m, 0).getDate();
    const formattedMonth = String(m).padStart(2, '0');
    
    const monthNames = ['Janvier', 'Février', 'Mars', 'Avril', 'Mai', 'Juin', 
                        'Juillet', 'Août', 'Septembre', 'Octobre', 'Novembre', 'Décembre'];

    const rentAmount = Number(tenant.apartments.rent_hc);
    const chargesAmount = Number(tenant.apartments.charges);
    const totalAmount = rentAmount + chargesAmount;

    doc.font('Helvetica-Bold').fontSize(20).text('QUITTANCE DE LOYER', { align: 'center' });
    doc.moveDown(2);

    doc.font('Helvetica-Bold').fontSize(11).text(`Quittance de loyer du mois de : ${monthNames[m - 1]} ${y}`, 50);
    doc.moveDown(2);

    const leftCol = 50;
    const rightCol = 300;
    let currentY = doc.y;

   // Colonne gauche - Bailleur
    doc.font('Helvetica-Bold').fontSize(10).text('Bailleur :', leftCol, currentY);
    doc.font('Helvetica').fontSize(10).text(`${tenant.profiles.firstname} ${tenant.profiles.lastname}`, leftCol, currentY + 15);
    doc.text(`${tenant.profiles.phone}`, leftCol, currentY + 30);
    if (tenant.profiles.lmnp_number) {
        doc.font('Helvetica').text(`N° LMNP : ${tenant.profiles.lmnp_number}`, leftCol, currentY + 45);
    }
    
    doc.font('Helvetica-Bold').text('Adresse du bailleur :', leftCol, currentY + 65);
    doc.font('Helvetica').text(`${tenant.profiles.address}`, leftCol, currentY + 80);
    doc.text(`${tenant.profiles.city}, ${tenant.profiles.zip_code}`, leftCol, currentY + 95);

    // Colonne droite - Locataire
    doc.font('Helvetica-Bold').fontSize(10).text('Locataire :', rightCol, currentY);
    doc.font('Helvetica').fontSize(10).text(`${tenant.last_name} ${tenant.first_name}`, rightCol, currentY + 15);
    doc.font('Helvetica').text(`${tenant.phone}`, rightCol, currentY + 30);
    doc.font('Helvetica-Bold').text('Adresse du locataire :', rightCol, currentY + 65);
    doc.font('Helvetica').text(`${tenant.apartments.address}`, rightCol, currentY + 80);
    doc.text(`${tenant.apartments.city}, ${tenant.apartments.zip_code}`, rightCol, currentY + 95);

    doc.moveDown(6);

    // Texte légal
    const today = new Date();
    doc.font('Helvetica').fontSize(10);
    doc.text(`Fait à : ${tenant.apartments.city}, le ${today.getDate().toString().padStart(2, '0')}/${(today.getMonth() + 1).toString().padStart(2, '0')}/${today.getFullYear()}`, leftCol);
    
    doc.font('Helvetica-Bold').text('Adresse du logement loué :', rightCol, doc.y - 11);
    doc.font('Helvetica').text(`${tenant.apartments.address}`, rightCol, doc.y + 2);
    doc.text(`${tenant.apartments.zip_code} ${tenant.apartments.city}`, rightCol);

    doc.moveDown(2);
  
    const mainText = `Je soussigné(e) ${tenant.profiles.lastname} ${tenant.profiles.firstname}, propriétaire du logement susmentionné, confirme avoir reçu de Monsieur / Madame ${tenant.last_name} ${tenant.first_name} la somme de ${totalAmount.toFixed(2)} euros en paiement du loyer et des charges pour la période du 01/${formattedMonth}/${y} au ${lastDay}/${formattedMonth}/${y}, et en donne quittance sous réserve de tous mes droits.`;
        doc.text(mainText, leftCol, doc.y, { width: 500, align: 'justify' });

    doc.moveDown(2);
    doc.font('Helvetica-Bold').text('Détail du règlement :');
    doc.font('Helvetica').text(`• Loyer : ${rentAmount.toFixed(2)} €`, leftCol + 20);
    doc.text(`• Provision pour charges : ${chargesAmount.toFixed(2)} €`, leftCol + 20);
    doc.font('Helvetica-Bold').text(`• Total réglé : ${totalAmount.toFixed(2)} €`, leftCol + 20);
    doc.font('Helvetica').text(`• Date de paiement : 05/${formattedMonth}/${y}`, leftCol + 20);

    doc.moveDown(3);
    doc.font('Helvetica-Bold').text('Signature du bailleur', leftCol);
    
    doc.moveDown(5);
    doc.font('Helvetica-Oblique').fontSize(8).fillColor('#666666');
    doc.text("Cette quittance remplace tous les précédents reçus en cas de paiement partiel du loyer pour ce terme. Elle doit être conservée pendant trois ans par le locataire, conformément à l'article 7-1 de la loi n° 89-462 du 6 juillet 1989.", { width: 500, align: 'justify' });
};