import axios from 'axios';


const API_URL = `${import.meta.env.VITE_API_URL}/apartments`;

export const getApartments = async () => {
    try {
        const response = await axios.get(API_URL);
        return response.data;
    } catch (error) {
        console.error('Error fetching apartments:', error);
        throw error;
    }
}

export const getApartmentById = async (id) => {
    try {
        const response = await axios.get(`${API_URL}/${id}`);
        return response.data;
    } catch (error) {
        console.error(`Error fetching apartment with ID ${id}:`, error);
        throw error;
    }
}

export const updateApartment = async (id, apartmentData) => {
    try {
        const response = await axios.put(`${API_URL}/${id}`, apartmentData);
        return response.data;
    } catch (error) {
        console.error(`Error updating apartment with ID ${id}:`, error);
        throw error;
    }
}

