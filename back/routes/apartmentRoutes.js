import express from 'express';
import { getAllApartments, getApartmentById, createApartment, updateApartment } from '../controllers/apartmentController.js';

const router = express.Router();

router.get('/', getAllApartments); 
router.get('/:id', getApartmentById); 
router.post('/', createApartment); 
router.put('/:id', updateApartment); 

export default router;