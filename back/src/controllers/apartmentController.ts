import { Request, Response } from 'express';
import { supabase } from '../config/supabase';
import { dbCreateApartment, dbCreateTenant } from '../services/dbService';

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
  try {
    const data = await dbCreateApartment(req.body, req.user.id);
    res.status(201).json(data);
  } catch (error: any) {
    res.status(400).json({ error: error.message });
  }
};

export const createFullProperty = async (req: any, res: Response) => {
  const owner_id = req.user.id;

  // 1. On récupère l'email en amont
  const { email } = req.body;
  console.log("createFullProperty appelé avec email:", req.body);

  // 2. Sécurité : Si l'email est absent, on arrête tout de suite proprement
  if (!email) {
    return res.status(400).json({ error: "L'adresse email du locataire est manquante dans la requête." });
  }

  try {
    // 3. On utilise l'email nettoyé
    const cleanEmail = email.toLowerCase().trim();

    let { data: tenant, error: searchError } = await supabase
      .from('tenants')
      .select('id')
      .eq('email', cleanEmail)
      .eq('owner_id', owner_id) // Sécurité : on vérifie que c'est un locataire à VOUS
      .maybeSingle();

    if (searchError) throw searchError;

    // 4. Si le locataire n'existe pas, on le crée
    if (!tenant) {
      // On passe le body avec l'email nettoyé au cas où
      tenant = await dbCreateTenant({ ...req.body, email: cleanEmail }, owner_id);
    }

    // 5. On crée l'appartement
    const apartment = await dbCreateApartment(req.body, owner_id);

    // 6. On lie l'appartement au locataire
    const { error: updateError } = await supabase
      .from('tenants')
      .update({ apartment_id: apartment.id })
      .eq('id', tenant?.id);

    if (updateError) throw updateError;

    res.status(201).json({ 
      message: "Bien et locataire créés avec succès !", 
      apartment, 
      tenant 
    });

  } catch (error: any) {
    console.error("Erreur createFullProperty:", error.message);
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
  const { address, city, zip_code, rent_hc, charges } = req.body;

  try {
    const { data, error } = await supabase
      .from('apartments')
      .update({ address, city, zip_code, rent_hc, charges })
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