"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.deleteTenant = exports.updateTenant = exports.createTenant = exports.fetchFullTenantData = exports.getTenantById = exports.getTenants = void 0;
const supabase_1 = require("../config/supabase");
const dbService_1 = require("../services/dbService");
const getTenants = async (req, res) => {
    try {
        const { data, error } = await supabase_1.supabase
            .from('tenants')
            .select(`
        *,
        apartments (address, city)
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
exports.getTenants = getTenants;
const getTenantById = async (req, res) => {
    const { id } = req.params;
    try {
        const { data, error } = await supabase_1.supabase
            .from('tenants')
            .select(`
        *,
        apartments (*) 
      `)
            .eq('id', id)
            .eq('owner_id', req.user.id)
            .single();
        if (error)
            throw error;
        if (!data)
            return res.status(404).json({ error: "Locataire non trouvé" });
        res.json(data);
    }
    catch (error) {
        res.status(400).json({ error: error.message });
    }
};
exports.getTenantById = getTenantById;
const fetchFullTenantData = async (tenantId, ownerId) => {
    try {
        const { data, error } = await supabase_1.supabase
            .from('tenants')
            .select(`
        *,
        apartments!fk_tenants_apartment (*),
        profiles:owner_id (
          firstname, 
          lastname, 
          email, 
          address, 
          zip_code, 
          city, 
          lmnp_number, 
          phone
        )
      `)
            .eq('id', tenantId)
            .eq('owner_id', ownerId)
            .single();
        if (error) {
            console.error(`[Supabase Error] Fetch Tenant ${tenantId}:`, error.message);
            throw error;
        }
        return { data, error: null };
    }
    catch (err) {
        console.error(`[System Error] fetchFullTenantData:`, err.message);
        return { data: null, error: err };
    }
};
exports.fetchFullTenantData = fetchFullTenantData;
const createTenant = async (req, res) => {
    try {
        const data = await (0, dbService_1.dbCreateTenant)(req.body, req.user.id);
        res.status(201).json(data);
    }
    catch (error) {
        res.status(400).json({ error: error.message });
    }
};
exports.createTenant = createTenant;
const updateTenant = async (req, res) => {
    const { id } = req.params;
    const updates = req.body;
    try {
        const { data, error } = await supabase_1.supabase
            .from('tenants')
            .update(updates)
            .eq('id', id)
            .eq('owner_id', req.user.id)
            .select()
            .single();
        if (error)
            throw error;
        res.json(data);
    }
    catch (error) {
        res.status(400).json({ error: error.message });
    }
};
exports.updateTenant = updateTenant;
const deleteTenant = async (req, res) => {
    const { id } = req.params;
    try {
        const { error } = await supabase_1.supabase
            .from('tenants')
            .delete()
            .eq('id', id)
            .eq('owner_id', req.user.id);
        if (error)
            throw error;
        res.json({ message: "Locataire supprimé avec succès" });
    }
    catch (error) {
        res.status(400).json({ error: error.message });
    }
};
exports.deleteTenant = deleteTenant;
