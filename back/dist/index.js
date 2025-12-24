"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const cors_1 = __importDefault(require("cors"));
const dotenv_1 = __importDefault(require("dotenv"));
const authRoutes_1 = __importDefault(require("./routes/authRoutes"));
const apartmentRoutes_1 = __importDefault(require("./routes/apartmentRoutes"));
const tenantRoutes_1 = __importDefault(require("./routes/tenantRoutes"));
const pdfRoutes_1 = __importDefault(require("./routes/pdfRoutes"));
dotenv_1.default.config();
const app = (0, express_1.default)();
const PORT = process.env.PORT || 5001;
app.use((0, cors_1.default)({
    origin: [
        'http://localhost:5173',
        "https://rental-app-1e1u.onrender.com"
    ],
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization'],
    credentials: true
}));
app.options('{path}*', (0, cors_1.default)());
app.use((0, cors_1.default)());
app.use(express_1.default.json());
// Routes
app.use('/api/auth', authRoutes_1.default);
app.use('/api/apartments', apartmentRoutes_1.default);
app.use('/api/tenants', tenantRoutes_1.default);
app.use('/api/pdf', pdfRoutes_1.default);
app.get('/health', (req, res) => {
    res.json({ status: "OK", timestamp: new Date() });
});
app.listen(PORT, () => {
    console.log(`🚀 Serveur prêt sur le port ${PORT}`);
});
