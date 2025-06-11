import express from "express";
import { sendMail } from "../services/mailerService.js";
const router = express.Router();

router.post("/send", async (req, res) => {
  try {
    await sendMail(req.body);
    res.status(200).json({ message: "Mail envoyé !" });
  } catch (error) {
    res.status(500).json({ error: "Erreur d'envoi de mail" });
  }
});


export default router;