import { Request, Response } from 'express';
import { supabase } from '../config/supabase';

// 1. Récupérer tous les locataires du propriétaire
export const getTenants = async (req: any, res: Response) => {
  try {
    const { data, error } = await supabase
      .from('tenants')
      .select(`
        *,
        apartments (address, city)
      `)
      .eq('owner_id', req.user.id);

    if (error) throw error;
    res.json(data);
  } catch (error: any) {
    res.status(400).json({ error: error.message });
  }
};

// 2. Créer un locataire
export const createTenant = async (req: any, res: Response) => {
  const { first_name, last_name, email, phone, apartment_id } = req.body;
  const owner_id = req.user.id;

  try {
    const { data, error } = await supabase
      .from('tenants')
      .insert([{ first_name, last_name, email, phone, apartment_id, owner_id }])
      .select()
      .single();

    if (error) throw error;
    res.status(201).json(data);
  } catch (error: any) {
    res.status(400).json({ error: error.message });
  }
};

// 3. Modifier un locataire
export const updateTenant = async (req: any, res: Response) => {
  const { id } = req.params;
  const updates = req.body;

  try {
    const { data, error } = await supabase
      .from('tenants')
      .update(updates)
      .eq('id', id)
      .eq('owner_id', req.user.id)
      .select()
      .single();

    if (error) throw error;
    res.json(data);
  } catch (error: any) {
    res.status(400).json({ error: error.message });
  }
};

// 4. Supprimer un locataire
export const deleteTenant = async (req: any, res: Response) => {
  const { id } = req.params;
  try {
    const { error } = await supabase
      .from('tenants')
      .delete()
      .eq('id', id)
      .eq('owner_id', req.user.id);

    if (error) throw error;
    res.json({ message: "Locataire supprimé avec succès" });
  } catch (error: any) {
    res.status(400).json({ error: error.message });
  }
};