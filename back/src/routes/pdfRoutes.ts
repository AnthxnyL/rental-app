import { Router } from 'express';
import { authenticate } from '../middlewares/authMiddleware';
import { generatePdf } from '../controllers/pdfController';

const router = Router();

router.get('/generate', authenticate, generatePdf);

export default router;