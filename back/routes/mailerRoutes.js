import express from "express";
import { sendQuittanceMailToAll } from "../services/mailerService.js";
const router = express.Router();

router.post("/send-all", async (req, res) => {
    try {
        const apartments = req.body.apartments;
        if (!apartments || !Array.isArray(apartments)) {
            return res.status(400).json({ error: "Invalid apartments data" });
        }
        await sendQuittanceMailToAll(apartments);
        res.status(200).json({ message: "All quittances sent successfully" });    
    } catch (error) {
        console.error("Error sending quittances:", error);
        res.status(500).json({ error: "Error sending quittances", details: error.message });
    }
});


export default router;