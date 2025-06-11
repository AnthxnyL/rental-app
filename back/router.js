import express from 'express'
import tenantRoutes from './routes/tenantRoutes.js'
import apartmentRoutes from './routes/apartmentRoutes.js'


const router = express.Router()

router.use('/tenants', tenantRoutes) 
router.use('/apartments', apartmentRoutes)

export default router 