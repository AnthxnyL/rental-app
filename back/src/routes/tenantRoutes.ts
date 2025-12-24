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

router.get('/', authenticate, getTenants);
router.get('/:id', authenticate, getTenantById);
router.post('/', authenticate, createTenant);
router.put('/:id', authenticate, updateTenant);
router.delete('/:id', authenticate, deleteTenant);

export default router;