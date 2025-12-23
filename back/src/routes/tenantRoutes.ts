import { Router } from 'express';
import { authenticate } from '../middlewares/authMiddleware';
import { 
  getTenants, 
  createTenant, 
  updateTenant, 
  deleteTenant, 
  getTenantById,
} from '../controllers/tenantController';

const router = Router();

router.use(authenticate);

router.get('/', getTenants);
router.get('/:id', getTenantById);
router.post('/', createTenant);
router.put('/:id', updateTenant);
router.delete('/:id', deleteTenant);

export default router;