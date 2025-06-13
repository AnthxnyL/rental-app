import axios from 'axios';
import { getApartments } from './ApartmentService';

const API_URL = `${import.meta.env.VITE_API_URL}/pdf`;


export const generateQuittance = async (data) => {
    try {
        const response = await axios.post(`${API_URL}/generate`, data, {
            responseType: 'blob', // Indique que la réponse est un blob (fichier)
        });
        return response.data; // Retourne le blob du PDF
    } catch (error) {
        console.error('Error generating quittance PDF:', error);
        throw error;
    }
}

export const generateQuittancesForAllTenants = async () => {
    try {
        const apartments = await getApartments();
        console.log('Generating quittances for all tenants:', apartments);
        const response = await axios.post(`${API_URL}/generate-all`, { apartments }, {
            responseType: 'blob', // Indique que la réponse est un blob (fichier)
        });
        return response.data; // Retourne le blob du PDF
    } catch (error) {
        console.error('Error generating quittances for all tenants:', error);
        throw error;
    }
}
