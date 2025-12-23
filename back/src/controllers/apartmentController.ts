import { Request, Response } from 'express';
import { supabase } from '../config/supabase';

export const getApartments = async (req: any, res: Response) => {
  try {
    const { data, error } = await supabase
      .from('apartments')
      .select('*')
      .eq('owner_id', req.user.id);

    if (error) throw error;
    res.json(data);
  } catch (error: any) {
    res.status(400).json({ error: error.message });
  }
};

export const getApartmentById = async (req: any, res: Response) => {
  const { id } = req.params;

  try {
    const { data, error } = await supabase
      .from('apartments')
      .select('*')
      .eq('id', id)
      .eq('owner_id', req.user.id)
      .single();

    if (error) throw error;
    if (!data) return res.status(404).json({ error: "Appartement non trouvé" });

    res.json(data);
  } catch (error: any) {
    res.status(400).json({ error: error.message });
  }
};

export const createApartment = async (req: any, res: Response) => {
  const { address, city, postal_code, rent_hc, charges } = req.body;
  const owner_id = req.user.id;

  try {
    const { data, error } = await supabase
      .from('apartments')
      .insert([{ address, city, postal_code, rent_hc, charges, owner_id }])
      .select()
      .single();

    if (error) throw error;
    res.status(201).json(data);
  } catch (error: any) {
    res.status(400).json({ error: error.message });
  }
};

export const deleteApartment = async (req: any, res: Response) => {
  const { id } = req.params;
  try {
    const { error } = await supabase
      .from('apartments')
      .delete()
      .eq('id', id)
      .eq('owner_id', req.user.id);

    if (error) throw error;
    res.json({ message: "Appartement supprimé avec succès" });
  } catch (error: any) {
    res.status(400).json({ error: error.message });
  }
};

export const updateApartment = async (req: any, res: Response) => {
  const { id } = req.params;
  const { address, city, postal_code, rent_hc, charges } = req.body;

  try {
    const { data, error } = await supabase
      .from('apartments')
      .update({ address, city, postal_code, rent_hc, charges })
      .eq('id', id)
      .eq('owner_id', req.user.id)
      .select()
      .single();

    if (error) throw error;
    if (!data) return res.status(404).json({ error: "Appartement non trouvé ou non autorisé" });

    res.json(data);
  } catch (error: any) {
    res.status(400).json({ error: error.message });
  }
};