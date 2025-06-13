import express from 'express';
import { generateQuittance, generateQuittancesForAllTenants } from '../services/pdfService.js';

const router = express.Router();

router.post('/generate', async (req, res) => {
  try {
    await generateQuittance(req.body);
    res.status(200).json({ message: 'PDF généré avec succès' });
  } catch (error) {
    console.error('Erreur lors de la génération du PDF :', error); // Ajoute ce log
    res.status(500).json({ error: 'Erreur lors de la génération du PDF', details: error.message });
  }
});


router.post('/generate-all', async (req, res) => {
  try {
    const result = await generateQuittancesForAllTenants(req.body);
    res.status(200).json({ message: result });
  } catch (error) {
    console.error('Erreur lors de la génération des quittances pour tous les locataires :', error);
    res.status(500).json({ error: 'Erreur lors de la génération des quittances pour tous les locataires', details: error.message });
  }
});



export default router;