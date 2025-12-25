import sgMail from '@sendgrid/mail';

// Initialisation avec ta clé API
sgMail.setApiKey(process.env.SENDGRID_API_KEY as string);

export const sendEmailViaAPI = async (to: string, tenantName: string, pdfBuffer: Buffer, monthName: string, year: string, ownerName: string) => {
  const msg = {
    to: to,
    from: process.env.SMTP_USER as string,
    replyTo: process.env.SMTP_USER as string,
    subject: `Quittance de loyer - ${monthName} ${year}`,
    html: `
      <div style="font-family: sans-serif;">
        <p>Bonjour <strong>${tenantName}</strong>,</p>
        <p>Veuillez trouver ci-joint votre quittance de loyer pour <strong>${monthName} ${year}</strong>.</p>
        <p>Cordialement,<br><strong>${ownerName}</strong></p>
      </div>
    `,
    attachments: [
      {
        content: pdfBuffer.toString('base64'),
        filename: `Quittance_${monthName}_${year}.pdf`,
        type: 'application/pdf',
        disposition: 'attachment',
      },
    ],
  };

  try {
    console.log(`[SendGrid API] Tentative d'envoi via HTTP...`);
    await sgMail.send(msg);
    console.log(`[SendGrid API] ✅ Email envoyé avec succès !`);
    return true;
  } catch (error: any) {
    console.error('[SendGrid API Error]', error);
    if (error.response) {
      console.error(error.response.body);
    }
    throw error;
  }
};