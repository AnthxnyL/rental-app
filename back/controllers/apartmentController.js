import { PrismaClient } from "@prisma/client"

const prisma = new PrismaClient();

export const getAllApartments = async (req, res) => {
    try {
        const apartments = await prisma.apartment.findMany();
        res.status(200).json(apartments);
    } catch (error) {
        console.error('Error fetching apartments:', error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
}


export const getApartmentById = async (req, res) => {
    const { id } = req.params;
    try {
        const apartment = await prisma.apartment.findUnique({
            where: { id: parseInt(id) },
            include: { User: true }
        });
        if (!apartment) {
            return res.status(404).json({ error: 'Apartment not found' });
        }
        res.status(200).json(apartment);
    } catch (error) {
        console.error('Error fetching apartment:', error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
}



export const createApartment = async (req, res) => {
    const { address, city, postalCode, rent, charges, UserId } = req.body;
    try {
        const newApartment = await prisma.apartment.create({
            data: {
                address,
                city,
                postalCode,
                rent,
                charges,
                UserId
            }
        });
        res.status(201).json(newApartment);
    } catch (error) {
        console.error('Error creating apartment:', error);
        let message = 'Internal Server Error';
        if (error.code === 'P2002') {
            message = `Unique constraint failed on the field: ${error.meta.target}`;
            res.status(409).json({ error: message });
        } else {
            res.status(500).json({ error: message, details: error.message });
        }
    }
}

export const updateApartment = async (req, res) => {
    const { id } = req.params;
    const { address, city, postalCode, rent, charges, UserId } = req.body;
    try {
        const updatedApartment = await prisma.apartment.update({
            where: { id: parseInt(id) },
            data: {
                address,
                city,
                postalCode,
                rent,
                charges,
                UserId
            }
        });
        res.status(200).json(updatedApartment);
    } catch (error) {
        console.error('Error updating apartment:', error);
        res.status(500).json({ error: 'Internal Server Error', details: error.message });
    }
}
