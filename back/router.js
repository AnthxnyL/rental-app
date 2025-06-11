import express from 'express'
import tenantRoutes from './routes/tenantRoutes.js'
import apartmentRoutes from './routes/apartmentRoutes.js'
import mailerRoutes from './routes/mailerRoutes.js'


const router = express.Router()

router.use('/tenants', tenantRoutes) 
router.use('/apartments', apartmentRoutes)
router.use('/mail', mailerRoutes)

export default router 