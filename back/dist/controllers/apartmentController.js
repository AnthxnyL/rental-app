"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getMe = exports.updateApartment = exports.deleteApartment = exports.createFullProperty = exports.createApartment = exports.getApartmentById = exports.getApartments = void 0;
const supabase_1 = require("../config/supabase");
const dbService_1 = require("../services/dbService");
const getApartments = async (req, res) => {
    try {
        const { data, error } = await supabase_1.supabase
            .from('apartments')
            .select(`
        *,
        tenants!tenants_apartment_id_fkey (*)
      `)
            .eq('owner_id', req.user.id);
        if (error)
            throw error;
        res.json(data);
    }
    catch (error) {
        res.status(400).json({ error: error.message });
    }
};
exports.getApartments = getApartments;
const getApartmentById = async (req, res) => {
    const { id } = req.params;
    try {
        const { data, error } = await supabase_1.supabase
            .from('apartments')
            .select(`
        *,
        tenants!tenants_apartment_id_fkey (*)
      `)
            .eq('id', id)
            .eq('owner_id', req.user.id)
            .single();
        console.log("getApartmentById data:", data);
        if (error)
            throw error;
        if (!data)
            return res.status(404).json({ error: "Appartement non trouvé" });
        res.json(data);
    }
    catch (error) {
        res.status(400).json({ error: error.message });
    }
};
exports.getApartmentById = getApartmentById;
const createApartment = async (req, res) => {
    try {
        const data = await (0, dbService_1.dbCreateApartment)(req.body, req.user.id);
        res.status(201).json(data);
    }
    catch (error) {
        res.status(400).json({ error: error.message });
    }
};
exports.createApartment = createApartment;
const createFullProperty = async (req, res) => {
    const owner_id = req.user.id;
    // 1. On récupère l'email en amont
    const { email } = req.body;
    console.log("createFullProperty appelé avec email:", req.body);
    // 2. Sécurité : Si l'email est absent, on arrête tout de suite proprement
    if (!email) {
        return res.status(400).json({ error: "L'adresse email du locataire est manquante dans la requête." });
    }
    try {
        // 3. On utilise l'email nettoyé
        const cleanEmail = email.toLowerCase().trim();
        let { data: tenant, error: searchError } = await supabase_1.supabase
            .from('tenants')
            .select('id')
            .eq('email', cleanEmail)
            .eq('owner_id', owner_id) // Sécurité : on vérifie que c'est un locataire à VOUS
            .maybeSingle();
        if (searchError)
            throw searchError;
        // 4. Si le locataire n'existe pas, on le crée
        if (!tenant) {
            // On passe le body avec l'email nettoyé au cas où
            tenant = await (0, dbService_1.dbCreateTenant)({ ...req.body, email: cleanEmail }, owner_id);
        }
        // 5. On crée l'appartement
        const apartment = await (0, dbService_1.dbCreateApartment)(req.body, owner_id);
        // 6. On lie l'appartement au locataire
        const { error: updateError } = await supabase_1.supabase
            .from('tenants')
            .update({ apartment_id: apartment.id })
            .eq('id', tenant?.id);
        if (updateError)
            throw updateError;
        res.status(201).json({
            message: "Bien et locataire créés avec succès !",
            apartment,
            tenant
        });
    }
    catch (error) {
        console.error("Erreur createFullProperty:", error.message);
        res.status(400).json({ error: error.message });
    }
};
exports.createFullProperty = createFullProperty;
const deleteApartment = async (req, res) => {
    const { id } = req.params;
    try {
        const { error } = await supabase_1.supabase
            .from('apartments')
            .delete()
            .eq('id', id)
            .eq('owner_id', req.user.id);
        if (error)
            throw error;
        res.json({ message: "Appartement supprimé avec succès" });
    }
    catch (error) {
        res.status(400).json({ error: error.message });
    }
};
exports.deleteApartment = deleteApartment;
const updateApartment = async (req, res) => {
    const { id } = req.params; // ID de l'appartement
    const { address, zip_code, city, rent_hc, charges, firstname, lastname, email, phone } = req.body;
    const ownerId = req.user.id;
    try {
        const { error: aptError } = await supabase_1.supabase
            .from('apartments')
            .update({ address, zip_code, city, rent_hc, charges })
            .eq('id', id)
            .eq('owner_id', ownerId);
        if (aptError)
            throw aptError;
        const { error: tenantError } = await supabase_1.supabase
            .from('tenants')
            .update({ firstname, lastname, email, phone })
            .eq('apartment_id', id);
        if (tenantError)
            throw tenantError;
        res.json({ message: "Appartement et locataire mis à jour avec succès !" });
    }
    catch (error) {
        console.error(error);
        res.status(500).json({ error: error.message });
    }
};
exports.updateApartment = updateApartment;
const getMe = async (req, res) => {
    try {
        const userId = req.user.id;
        const { data, error } = await supabase_1.supabase
            .from('profiles')
            .select('*')
            .eq('id', userId)
            .single();
        if (error) {
            return res.status(404).json({ error: "Profil non trouvé" });
        }
        res.json(data);
    }
    catch (error) {
        res.status(500).json({ error: error.message });
    }
};
exports.getMe = getMe;
