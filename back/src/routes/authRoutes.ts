import { Router } from 'express';
import { createProfile } from '../controllers/authController';

const router = Router();

router.post('/signup', createProfile);

export default router;