export interface Profile {
  id: string; // UUID de Supabase Auth
  email: string;
  firstname: string;
  lastname: string;
  role: 'OWNER' | 'TENANT';
}

export interface SignupRequest extends Omit<Profile, 'role'> {
}