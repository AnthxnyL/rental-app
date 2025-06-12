import axios from 'axios';
import { getApartments } from './ApartmentService';

const API_URL = `${import.meta.env.VITE_API_URL}/mail`;

export const sendRentMail = async (mailData) => {
    try {
        const response = await axios.post(`${API_URL}/send`, mailData);
        return response.data;
    } catch (error) {
        console.error('Error sending mail:', error);
        throw error;
    }
}


export const sendRentMailsToAllTenants = async () => {
    try {
        const apartments = await getApartments();
        const response = await axios.post(`${API_URL}/send-all`, { apartments });
        return response.data;
    } catch (error) {
        console.error('Error sending mails to all tenants:', error);
        throw error;
    }
}
