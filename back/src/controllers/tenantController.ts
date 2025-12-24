import { Request, Response } from 'express';
import { supabase } from '../config/supabase';
import { dbCreateTenant } from '../services/dbService';

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

export const getTenantById = async (req: any, res: Response) => {
  const { id } = req.params;

  try {
    const { data, error } = await supabase
      .from('tenants')
      .select(`
        *,
        apartments (*) 
      `)
      .eq('id', id)
      .eq('owner_id', req.user.id)
      .single();

    if (error) throw error;
    if (!data) return res.status(404).json({ error: "Locataire non trouvé" });

    res.json(data);
  } catch (error: any) {
    res.status(400).json({ error: error.message });
  }
};

export const fetchFullTenantData = async (tenantId: string, ownerId: string) => {
  try {
    const { data, error, status } = await supabase
      .from('tenants')
      .select(`
        *,
        apartments!fk_tenants_apartment (*),
        profiles:owner_id (
          firstname, 
          lastname, 
          email, 
          address, 
          zip_code, 
          city, 
          lmnp_number, 
          phone
        )
      `)
      .eq('id', tenantId)
      .eq('owner_id', ownerId)
      .single();

    if (error) {
      console.error(`[Supabase Error] Fetch Tenant ${tenantId}:`, error.message);
      throw error;
    }

    return { data, error: null };
  } catch (err: any) {
    console.error(`[System Error] fetchFullTenantData:`, err.message);
    return { data: null, error: err };
  }
};

// 2. Créer un locataire
export const createTenant = async (req: any, res: Response) => {
  try {
    const data = await dbCreateTenant(req.body, req.user.id);
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