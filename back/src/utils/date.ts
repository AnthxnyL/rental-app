export const MONTH_NAMES = [
  'Janvier', 'Février', 'Mars', 'Avril', 'Mai', 'Juin', 
  'Juillet', 'Août', 'Septembre', 'Octobre', 'Novembre', 'Décembre'
];

/**
 * Retourne le nom du mois à partir de son numéro (1-12)
 */
export const getMonthName = (month: string | number): string => {
  const index = typeof month === 'string' ? parseInt(month) : month;
  return MONTH_NAMES[index - 1];
};

/**
 * Retourne le dernier jour d'un mois donné
 */
export const getLastDayOfMonth = (month: string | number, year: string | number): number => {
  const m = typeof month === 'string' ? parseInt(month) : month;
  const y = typeof year === 'string' ? parseInt(year) : year;
  return new Date(y, m, 0).getDate();
};

/**
 * Formate un nombre sur deux chiffres (ex: 6 -> "06")
 */
export const formatTwoDigits = (num: string | number): string => {
  return String(num).padStart(2, '0');
};