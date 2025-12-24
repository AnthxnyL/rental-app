import { Router } from 'express';
import { authenticate } from '../middlewares/authMiddleware';
import { 
  getApartments, 
  createApartment, 
  deleteApartment,
  updateApartment,
  getApartmentById,
  createFullProperty
} from '../controllers/apartmentController';

const router = Router();

router.use(authenticate);

router.get('/', authenticate, getApartments);
router.get('/:id', authenticate, getApartmentById);
router.post('/', authenticate, createFullProperty);
router.delete('/:id', authenticate, deleteApartment);
router.put('/:id', authenticate, updateApartment);

export default router;