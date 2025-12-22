import { Request, Response } from 'express';
import { supabase } from '../config/supabase';
import { SignupRequest } from '../types';

export const createProfile = async (req: Request<{}, {}, SignupRequest>, res: Response) => {
  const { id, email, firstname, lastname } = req.body;

  try {
    const { data, error } = await supabase
      .from('profiles')
      .insert([
        { 
          id, 
          email, 
          firstname, 
          lastname, 
          role: 'OWNER' 
        }
      ])
      .select()
      .single();

    if (error) throw error;

    res.status(201).json({
      message: "Profil créé avec succès",
      profile: data
    });
  } catch (error: any) {
    console.error("Erreur Signup:", error.message);
    res.status(400).json({ error: error.message });
  }
};