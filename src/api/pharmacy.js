import api from './axios'

/**
 * Pharmacy API
 * For browsing pharmacies
 */

/**
 * List pharmacies with filtering (Public)
 * @param {Object} params - Query parameters
 * @param {string} params.ownerId - Filter by owner ID
 * @param {string} params.city - Filter by city
 * @param {string} params.search - Search term (searches name and city)
 * @param {number} params.page - Page number (default: 1)
 * @param {number} params.limit - Items per page (default: 10)
 * @returns {Promise<Object>} Pharmacies list with pagination
 */
export const listPharmacies = async (params = {}) => {
  return api.get('/pharmacy', { params })
}

/**
 * Get pharmacy by ID (Public)
 * @param {string} id - Pharmacy ID
 * @returns {Promise<Object>} Pharmacy details
 */
export const getPharmacyById = async (id) => {
  return api.get(`/pharmacy/${id}`)
}

/**
 * Create pharmacy (Private - Admin, Doctor)
 * @param {Object} data - Pharmacy data
 * @returns {Promise<Object>} Created pharmacy
 */
export const createPharmacy = async (data) => {
  return api.post('/pharmacy', data)
}

/**
 * Update pharmacy (Private - Admin)
 * @param {string} id - Pharmacy ID
 * @param {Object} data - Pharmacy data
 * @returns {Promise<Object>} Updated pharmacy
 */
export const updatePharmacy = async (id, data) => {
  return api.put(`/pharmacy/${id}`, data)
}

