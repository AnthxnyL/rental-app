import { PrismaClient } from "@prisma/client";


const prisma = new PrismaClient();

export const getAllTenants = async (req, res) => {
    try {
        const tenants = await prisma.user.findMany();
        res.status(200).json(tenants);
    } catch (error) {
        console.error('Error fetching tenants:', error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
}


export const getTenant = async (req, res) => {
    const { id } = req.params;
    try {
        const tenant = await prisma.user.findUnique({
            where: { id: parseInt(id) }
        });
        if (!tenant) {
            return res.status(404).json({ error: 'Tenant not found' });
        }
        res.status(200).json(tenant);
    } catch (error) {
        console.error('Error fetching tenant:', error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
}

export const createTenant = async (req, res) => {
    const { firstname, lastname, email, phone,  } = req.body;
    try {
        const newTenant = await prisma.user.create({
            data: {
                firstname,
                lastname,
                email,
                phone
            }
        });
        res.status(201).json(newTenant);
    } catch (error) {
        console.error('Error creating tenant:', error);
        let message = 'Internal Server Error';
        if (error.code === 'P2002') {
            message = `Unique constraint failed on the field: ${error.meta.target}`;
            res.status(409).json({ error: message });
        } else {
            res.status(500).json({ error: message, details: error.message });
        }
    }
}

export const updateTenant = async (req, res) => {
    const { id } = req.params;
    const { firstname, lastname, email, phone } = req.body;
    try {
        const updatedTenant = await prisma.user.update({
            where: { id: parseInt(id) },
            data: {
                firstname,
                lastname,
                email,
                phone
            }
        });
        res.status(200).json(updatedTenant);
    } catch (error) {
        console.error('Error updating tenant:', error);
        if (error.code === 'P2025') {
            return res.status(404).json({ error: 'Tenant not found' });
        }
        let message = 'Internal Server Error';
        if (error.code === 'P2002') {
            message = `Unique constraint failed on the field: ${error.meta.target}`;
            return res.status(409).json({ error: message });
        }
        res.status(500).json({ error: message, details: error.message });
    }
}

export const deleteTenant = async (req, res) => {
    const { id } = req.params;
    try {
        await prisma.user.delete({
            where: { id: parseInt(id) }
        });
        res.status(204).send('Tenant deleted successfully');
    } catch (error) {
        console.error('Error deleting tenant:', error);
        if (error.code === 'P2025') {
            return res.status(404).json({ error: 'Tenant not found' });
        }
        res.status(500).json({ error: 'Internal Server Error' });
    }
}

