import { Router } from 'express';
import { createProfile, updateProfile } from '../controllers/authController';
import { authenticate } from '../middlewares/authMiddleware';
import { getMe } from '../controllers/apartmentController';

const router = Router();

router.get('/me', authenticate, getMe);
router.post('/signup', createProfile);
router.put('/profile', authenticate, updateProfile);

export default router;