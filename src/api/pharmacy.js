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

export const getMyPharmacy = async () => {
  return api.get('/pharmacy/me')
}

export const getPharmacyActivePlans = async () => {
  return api.get('/admin/subscription-plan/active', { params: { targetRole: 'PHARMACY' } })
}

export const buyPharmacySubscriptionPlan = async (planId) => {
  return api.post('/pharmacy/buy-subscription', { planId })
}

export const getMyPharmacySubscription = async () => {
  return api.get('/pharmacy/my-subscription')
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
 * Update pharmacy (Private - Admin, Doctor - own pharmacy only)
 * @param {string} id - Pharmacy ID
 * @param {Object} data - Pharmacy data
 * @returns {Promise<Object>} Updated pharmacy
 */
export const updatePharmacy = async (id, data) => {
  return api.put(`/pharmacy/${id}`, data)
}

/**
 * Get pharmacy by owner ID (Private - Doctor)
 * @param {string} ownerId - Owner User ID
 * @returns {Promise<Object>} Pharmacy details
 */
export const getPharmacyByOwnerId = async (ownerId) => {
  const response = await api.get('/pharmacy', { params: { ownerId, limit: 1 } })
  const responseData = response.data || response
  const pharmacies = responseData.data?.pharmacies || responseData.pharmacies || []
  return pharmacies.length > 0 ? pharmacies[0] : null
}

