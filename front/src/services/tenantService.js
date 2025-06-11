import axios from 'axios';


const API_URL = `${import.meta.env.VITE_API_URL}/tenants`;

export const getTenants = async () => {
    try {
        const response = await axios.get(API_URL);
        return response.data;
    } catch (error) {
        console.error('Error fetching tenants:', error);
        throw error;
    }
}

export const getTenantById = async (id) => {
    try {
        const response = await axios.get(`${API_URL}/${id}`);
        return response.data;
    } catch (error) {
        console.error(`Error fetching tenant with ID ${id}:`, error);
        throw error;
    }
}

export const updateTenant = async (id, tenantData) => {
    try {
        const response = await axios.put(`${API_URL}/${id}`, tenantData);
        return response.data;
    } catch (error) {
        console.error(`Error updating tenant with ID ${id}:`, error);
        throw error;
    }
}

