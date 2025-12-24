import { supabase } from '../config/supabase';

export const authenticate = async (req: any, res: any, next: any) => {
  const token = req.headers.authorization?.split(' ')[1];

  if (!token) return res.status(401).json({ error: 'Token manquant' });

  const { data: { user }, error } = await supabase.auth.getUser(token);

  if (error || !user) return res.status(401).json({ error: 'Token invalide' });

  req.user = user; // On stocke l'utilisateur dans la requête
  next();
};