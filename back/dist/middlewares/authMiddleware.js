"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.authenticate = void 0;
const supabase_1 = require("../config/supabase");
const authenticate = async (req, res, next) => {
    const token = req.headers.authorization?.split(' ')[1];
    if (!token)
        return res.status(401).json({ error: 'Token manquant' });
    const { data: { user }, error } = await supabase_1.supabase.auth.getUser(token);
    if (error || !user)
        return res.status(401).json({ error: 'Token invalide' });
    req.user = user; // On stocke l'utilisateur dans la requête
    next();
};
exports.authenticate = authenticate;
