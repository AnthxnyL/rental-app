import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import authRoutes from './routes/authRoutes';
import apartmentRoutes from './routes/apartmentRoutes';
import tenantRoutes from './routes/tenantRoutes';
import pdfRoutes from './routes/pdfRoutes';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5001;

app.use(cors({
  origin: [
    'http://localhost:5173',
    "https://rental-app-1e1u.onrender.com"
  ],
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization'],
  credentials: true
}));

app.options('(.*)', cors()); 
app.use(cors());
app.use(express.json());

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/apartments', apartmentRoutes);
app.use('/api/tenants', tenantRoutes);
app.use('/api/pdf', pdfRoutes);

app.get('/health', (req, res) => {
  res.json({ status: "OK", timestamp: new Date() });
});

app.listen(PORT, () => {
  console.log(`🚀 Serveur prêt sur le port ${PORT}`);
});