"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.formatTwoDigits = exports.getLastDayOfMonth = exports.getMonthName = exports.MONTH_NAMES = void 0;
exports.MONTH_NAMES = [
    'Janvier', 'Février', 'Mars', 'Avril', 'Mai', 'Juin',
    'Juillet', 'Août', 'Septembre', 'Octobre', 'Novembre', 'Décembre'
];
/**
 * Retourne le nom du mois à partir de son numéro (1-12)
 */
const getMonthName = (month) => {
    const index = typeof month === 'string' ? parseInt(month) : month;
    return exports.MONTH_NAMES[index - 1];
};
exports.getMonthName = getMonthName;
/**
 * Retourne le dernier jour d'un mois donné
 */
const getLastDayOfMonth = (month, year) => {
    const m = typeof month === 'string' ? parseInt(month) : month;
    const y = typeof year === 'string' ? parseInt(year) : year;
    return new Date(y, m, 0).getDate();
};
exports.getLastDayOfMonth = getLastDayOfMonth;
/**
 * Formate un nombre sur deux chiffres (ex: 6 -> "06")
 */
const formatTwoDigits = (num) => {
    return String(num).padStart(2, '0');
};
exports.formatTwoDigits = formatTwoDigits;
