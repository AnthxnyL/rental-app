export interface PropertyFormData {
  // Appartement
  address: string;
  zip_code: string;
  city: string;
  rent_hc: number;
  charges: number;
  // Locataire
  firstname: string;
  lastname: string;
  email: string;
  phone: string;
}

export const initialPropertyState: PropertyFormData = {
  address: '',
  zip_code: '',
  city: '',
  rent_hc: 0,
  charges: 0,
  firstname: '',
  lastname: '',
  email: '',
  phone: ''
};