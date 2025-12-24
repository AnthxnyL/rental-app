"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const authMiddleware_1 = require("../middlewares/authMiddleware");
const pdfController_1 = require("../controllers/pdfController");
const router = (0, express_1.Router)();
router.get('/generate', authMiddleware_1.authenticate, pdfController_1.generatePdf);
router.post('/send-email', authMiddleware_1.authenticate, pdfController_1.sendReceiptEmail);
exports.default = router;
