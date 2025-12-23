import { Router } from 'express';
import { authenticate } from '../middlewares/authMiddleware';
import { 
  getApartments, 
  createApartment, 
  deleteApartment,
  updateApartment,
  getApartmentById
} from '../controllers/apartmentController';

const router = Router();

router.use(authenticate);

router.get('/', getApartments);
router.get('/:id', getApartmentById);
router.post('/', createApartment);
router.delete('/:id', deleteApartment);
router.put('/:id', updateApartment);

export default router;