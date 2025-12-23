export interface PropertyFormData {
  // Appartement
  address: string;
  zip_code: string;
  city: string;
  rent_hc: number;
  charges: number;
  // Locataire
  first_name: string;
  last_name: string;
  email: string;
  phone: string;
}

export const initialPropertyState: PropertyFormData = {
  address: '',
  zip_code: '',
  city: '',
  rent_hc: 0,
  charges: 0,
  first_name: '',
  last_name: '',
  email: '',
  phone: ''
};