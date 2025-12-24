"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.sendReceiptEmail = exports.generatePdf = void 0;
const pdfkit_1 = __importDefault(require("pdfkit"));
const tenantController_1 = require("./tenantController");
const pdfService_1 = require("../services/pdfService");
const mailer_1 = require("../config/mailer");
const date_1 = require("../utils/date");
// 1. TÉLÉCHARGEMENT DIRECT
const generatePdf = async (req, res) => {
    const { tenantId, month, year } = req.query;
    try {
        const { data: tenant, error } = await (0, tenantController_1.fetchFullTenantData)(tenantId, req.user.id);
        if (error || !tenant)
            return res.status(404).json({ error: "Introuvable" });
        const doc = new pdfkit_1.default({ size: 'A4', margin: 50 });
        res.setHeader('Content-Type', 'application/pdf');
        res.setHeader('Content-Disposition', `attachment; filename=Quittance_${tenant.lastname}.pdf`);
        doc.pipe(res);
        (0, pdfService_1.drawReceiptContent)(doc, tenant, month, year);
        doc.end();
    }
    catch (err) {
        res.status(500).json({ error: "Erreur génération" });
    }
};
exports.generatePdf = generatePdf;
// 2. ENVOI PAR E-MAIL
const sendReceiptEmail = async (req, res) => {
    const { tenantId, month, year } = req.body;
    const ownerId = req.user.id;
    if (!tenantId) {
        return res.status(400).json({ error: "L'ID du locataire est obligatoire." });
    }
    try {
        const { data: tenant, error } = await (0, tenantController_1.fetchFullTenantData)(tenantId, ownerId);
        if (error || !tenant)
            return res.status(404).json({ error: "Locataire introuvable" });
        // Conversion en nombre pour être sûr
        const m = Number(month);
        const y = Number(year);
        const monthName = (0, date_1.getMonthName)(m);
        // const lastDay = getLastDayOfMonth(m, y); // Optionnel si non utilisé dans le mail
        const doc = new pdfkit_1.default({ size: 'A4', margin: 50 });
        let chunks = [];
        doc.on('data', (chunk) => chunks.push(chunk));
        doc.on('end', async () => {
            try {
                const pdfBuffer = Buffer.concat(chunks);
                await mailer_1.transporter.sendMail({
                    from: `"Gestion Locative - ${tenant.profiles.firstname}" <${process.env.SMTP_USER}>`,
                    to: tenant.email,
                    subject: `Quittance de loyer - ${monthName} ${y}`,
                    html: `
            <div style="font-family: sans-serif; line-height: 1.5; color: #333; max-width: 600px;">
              <p>Bonjour <strong>${tenant.firstname} ${tenant.lastname}</strong>,</p>
              <p>Nous vous confirmons la bonne réception de votre règlement pour le loyer de <strong>${monthName} ${y}</strong>.</p>
              <p>Vous trouverez en pièce jointe votre quittance correspondante pour le logement situé au :<br>
              <em>${tenant.apartments.address}, ${tenant.apartments.zip_code} ${tenant.apartments.city}</em></p>
              <p>Cordialement,<br><strong>${tenant.profiles.firstname} ${tenant.profiles.lastname}</strong></p>
            </div>
          `,
                    attachments: [
                        {
                            filename: `Quittance_${tenant.lastname}_${monthName}_${y}.pdf`,
                            content: pdfBuffer,
                        },
                    ],
                });
                // On répond SEULEMENT quand le mail est parti
                return res.json({ message: "Email envoyé avec succès !" });
            }
            catch (mailError) {
                console.error("Erreur SMTP:", mailError);
                // Si on ne répond pas ici, le client restera en chargement infini
                if (!res.headersSent) {
                    return res.status(500).json({ error: "Erreur lors de l'envoi de l'email." });
                }
            }
        });
        // On génère le contenu
        (0, pdfService_1.drawReceiptContent)(doc, tenant, String(m), String(y));
        doc.end();
    }
    catch (err) {
        console.error("Erreur générale sendReceiptEmail:", err);
        res.status(500).json({ error: "Échec de la génération de la quittance" });
    }
};
exports.sendReceiptEmail = sendReceiptEmail;
