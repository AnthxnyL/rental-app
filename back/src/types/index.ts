export interface Profile {
  id: string; // UUID de Supabase Auth
  email: string;
  firstname: string;
  lastname: string;
  role: 'OWNER' | 'TENANT';
}

export interface SignupRequest extends Omit<Profile, 'role'> {
}

export interface Apartment {
  id?: number;
  owner_id: string;
  address: string;
  city: string;
  zip_code: string;
  rent_hc: number;
  charges: number;
}