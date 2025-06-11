import express from 'express';
import { getAllTenants, getTenant, createTenant, updateTenant, deleteTenant } from '../controllers/tenantController.js';

const router = express.Router();

router.get('/', getAllTenants); // Get all tenants
router.post('/', createTenant); // Create a new tenant
router.put('/:id', updateTenant); // Update a tenant by ID
router.delete('/:id', deleteTenant); // Delete a tenant by ID
router.get('/:id', getTenant); // Get a tenant by ID



export default router;

