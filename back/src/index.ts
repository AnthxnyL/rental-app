import express, { Request, Response, NextFunction } from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import authRoutes from './routes/authRoutes';
import apartmentRoutes from './routes/apartmentRoutes';
import tenantRoutes from './routes/tenantRoutes';
import pdfRoutes from './routes/pdfRoutes';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5001;

// 1. Liste des origines autorisées
const allowedOrigins = [
  'http://localhost:5173',
  'https://rental-app-mauve.vercel.app'
];

// 2. Middleware de sécurité pour forcer les headers CORS
app.use((req: Request, res: Response, next: NextFunction) => {
  const origin = req.headers.origin;

  // On vérifie si l'origine est dans notre liste
  if (origin && allowedOrigins.includes(origin)) {
    res.setHeader('Access-Control-Allow-Origin', origin);
  }

  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');
  res.setHeader('Access-Control-Allow-Credentials', 'true');

  // TRÈS IMPORTANT : Réponse immédiate pour le Preflight
  if (req.method === 'OPTIONS') {
    return res.status(204).end();
  }

  next();
});

// 3. On garde le middleware CORS standard en complément
app.use(cors({
  origin: allowedOrigins,
  credentials: true
}));

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