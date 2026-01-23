/**
 * Currency Utility Functions
 * Centralized currency formatting for the application
 */

/**
 * Format currency amount
 * @param {number} amount - Amount to format
 * @param {string} currency - Currency code (default: 'EUR')
 * @param {string} locale - Locale for formatting (default: 'en-US')
 * @returns {string} Formatted currency string
 */
export const formatCurrency = (amount, currency = 'EUR', locale = 'en-US') => {
  if (amount === null || amount === undefined || isNaN(amount)) {
    return '€0.00'
  }
  return new Intl.NumberFormat(locale, {
    style: 'currency',
    currency: currency || 'EUR'
  }).format(amount)
}

/**
 * Get currency symbol
 * @param {string} currency - Currency code (default: 'EUR')
 * @returns {string} Currency symbol
 */
export const getCurrencySymbol = (currency = 'EUR') => {
  const symbols = {
    'EUR': '€',
    'USD': '$',
    'GBP': '£'
  }
  return symbols[currency] || '€'
}

export default formatCurrency
