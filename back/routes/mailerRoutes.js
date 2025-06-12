import express from "express";
import { sendMail, sendRentMailsToAllTenants } from "../services/mailerService.js";
const router = express.Router();

router.post("/send", async (req, res) => {
  try {
    await sendMail(req.body);
    res.status(200).json({ message: "Mail envoyé !" });
  } catch (error) {
    res.status(500).json({ error: "Erreur d'envoi de mail" });
  }
});

router.post("/send-all", async (req, res) => {
  try {
    const apartments = req.body.apartments; 
    await sendRentMailsToAllTenants(apartments);
    res.status(200).json({ message: "Mails envoyés à tous les locataires !" });
  } catch (error) {
    res.status(500).json({ error: "Erreur d'envoi de mails" });
  }
});



export default router;