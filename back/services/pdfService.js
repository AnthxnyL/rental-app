import puppeteer from 'puppeteer';
import { PrismaClient } from "@prisma/client"
import fs from 'fs';
import path from 'path';

const prisma = new PrismaClient();


export const generateQuittance = async (data) => {
    const browser = await puppeteer.launch();
    const page = await browser.newPage();

    await page.goto(`file://${process.cwd()}/template/quittance.html`);
    

   await page.evaluate((data) => {
    document.body.innerHTML = document.body.innerHTML
        .replace('{{nom_proprio}}', 'Dupont Jean')
        .replace('{{adresse_proprio}}', '12 rue de Paris, 75000 Paris')
        .replace('{{telephone_proprio}}', '0600000000')
        .replace('{{nom_locataire}}',  `${data.User.lastname} ${data.User.firstname}`)
        .replace('{{adresse_locataire}}', data.address)
        .replace('{{telephone_locataire}}', `${data.User.phone}`)
        .replace('{{periode_debut}}', `${new Date().toLocaleDateString('fr-FR')}`)
        .replace('{{periode_fin}}', `${new Date().toLocaleDateString('fr-FR')}`)
        .replace('{{montant_loyer}}', `${data.rent} €`)
        .replace('{{date_paiement}}', '05/06/2025')
        .replace('{{moyen_paiement}}', 'Virement bancaire')
        .replace('{{lieu}}', 'Paris')
        .replace('{{date_emission}}', `${new Date().toLocaleDateString('fr-FR')}`)
        .replace('{{annee_actuelle}}', `${new Date().getFullYear()}`);
}, data);

    let locataire = await page.$eval('.locataire', el => el.textContent);
    locataire = locataire.replace(/\s+/g, '_').toLowerCase();
    const date = new Date();
    const mois = date.toLocaleString('fr-FR', { month: 'long' });
    const annee = date.getFullYear();
    const dossier = path.join(process.cwd(), `quittances/${locataire}`);
    const nomFichier = `${locataire}_${mois}_${annee}.pdf`;
    const cheminComplet = path.join(dossier, nomFichier);

    // Crée le dossier s'il n'existe pas
    if (!fs.existsSync(dossier)) {
        fs.mkdirSync(dossier);
    }

    await page.pdf({ path: cheminComplet, format: 'A4' });

    await browser.close();
};

export const generateQuittancesForAllTenants = async () => {
    // Récupère tous les appartements et leurs locataires depuis la base
    const apartments = await prisma.apartment.findMany({ include: { User: true } });
    for (const apartment of apartments) {
        if (apartment.isPaid === false) {
            continue; // Skip this apartment if isPaid is false
        }
        console.log(`Generating quittance for ${apartment.id}`);
        await generateQuittance({
            User: apartment.User,
            address: apartment.address,
            rent: apartment.rent
        });
    }
};