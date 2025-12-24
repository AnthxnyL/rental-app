"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.dbCreateTenant = exports.dbCreateApartment = void 0;
const supabase_1 = require("../config/supabase");
const dbCreateApartment = async (payload, owner_id) => {
    const { address, city, zip_code, rent_hc, charges } = payload;
    const { data, error } = await supabase_1.supabase
        .from('apartments')
        .insert([{ address, city, zip_code, rent_hc, charges, owner_id }])
        .select().maybeSingle();
    if (error)
        throw error;
    return data;
};
exports.dbCreateApartment = dbCreateApartment;
const dbCreateTenant = async (payload, owner_id) => {
    const { firstname, lastname, email, phone, apartment_id } = payload;
    const { data, error } = await supabase_1.supabase
        .from('tenants')
        .insert([{ firstname, lastname, email, phone, apartment_id, owner_id }])
        .select().maybeSingle();
    if (error)
        throw error;
    return data;
};
exports.dbCreateTenant = dbCreateTenant;
