"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.updateProfile = exports.createProfile = void 0;
const supabase_1 = require("../config/supabase");
const createProfile = async (req, res) => {
    const { id, email, firstname, lastname } = req.body;
    try {
        const { data, error } = await supabase_1.supabase
            .from('profiles')
            .insert([
            {
                id,
                email,
                firstname,
                lastname,
                role: 'OWNER'
            }
        ])
            .select()
            .single();
        if (error)
            throw error;
        res.status(201).json({
            message: "Profil créé avec succès",
            profile: data
        });
    }
    catch (error) {
        console.error("Erreur Signup:", error.message);
        res.status(400).json({ error: error.message });
    }
};
exports.createProfile = createProfile;
const updateProfile = async (req, res) => {
    const userId = req.user.id;
    const { firstname, lastname, phone, address, zip_code, city, lmnp_number } = req.body;
    try {
        const { error } = await supabase_1.supabase
            .from('profiles')
            .update({ firstname, lastname, phone, address, zip_code, city, lmnp_number })
            .eq('id', userId);
        if (error)
            throw error;
        res.json({ message: "Profil mis à jour" });
    }
    catch (error) {
        res.status(500).json({ error: error.message });
    }
};
exports.updateProfile = updateProfile;
