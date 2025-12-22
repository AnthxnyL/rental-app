import { Router } from 'express';
import { authenticate } from '../middlewares/authMiddleware';
import { 
  getTenants, 
  createTenant, 
  updateTenant, 
  deleteTenant 
} from '../controllers/tenantController';

const router = Router();

router.use(authenticate);

router.get('/', getTenants);
router.post('/', createTenant);
router.put('/:id', updateTenant);
router.delete('/:id', deleteTenant);

export default router;