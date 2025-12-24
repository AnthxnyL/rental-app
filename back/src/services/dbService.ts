import { supabase } from '../config/supabase';

export const dbCreateApartment = async (payload: any, owner_id: string) => {
  const { address, city, zip_code, rent_hc, charges } = payload;
  const { data, error } = await supabase
    .from('apartments')
    .insert([{ address, city, zip_code, rent_hc, charges, owner_id }])
    .select().maybeSingle();
  if (error) throw error;
  return data;
};

export const dbCreateTenant = async (payload: any, owner_id: string) => {
  const { first_name, last_name, email, phone, apartment_id } = payload;
  const { data, error } = await supabase
    .from('tenants')
    .insert([{ first_name, last_name, email, phone, apartment_id, owner_id }])
    .select().maybeSingle();
  if (error) throw error;
  return data;
};