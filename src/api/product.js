import api from './axios'

/**
 * Product API
 * For browsing and managing products
 */

/**
 * List products with filtering (Public)
 * @param {Object} params - Query parameters
 * @param {string} params.sellerId - Filter by seller ID
 * @param {string} params.sellerType - Filter by seller type (DOCTOR, PHARMACY, ADMIN)
 * @param {string} params.category - Filter by category
 * @param {string} params.subCategory - Filter by sub category
 * @param {number} params.minPrice - Minimum price
 * @param {number} params.maxPrice - Maximum price
 * @param {string[]} params.tags - Filter by tags
 * @param {string} params.search - Search term (searches name and description)
 * @param {number} params.page - Page number (default: 1)
 * @param {number} params.limit - Items per page (default: 10)
 * @returns {Promise<Object>} Products list with pagination
 */
export const listProducts = async (params = {}) => {
  return api.get('/products', { params })
}

/**
 * Get product by ID (Public)
 * @param {string} id - Product ID
 * @returns {Promise<Object>} Product details
 */
export const getProductById = async (id) => {
  return api.get(`/products/${id}`)
}

/**
 * Create product (Private - Doctor/Pharmacy/Admin)
 * @param {Object} data - Product data
 * @returns {Promise<Object>} Created product
 */
export const createProduct = async (data) => {
  return api.post('/products', data)
}

/**
 * Update product (Private - Doctor/Pharmacy/Admin)
 * @param {string} id - Product ID
 * @param {Object} data - Product data
 * @returns {Promise<Object>} Updated product
 */
export const updateProduct = async (id, data) => {
  return api.put(`/products/${id}`, data)
}

/**
 * Delete product (Private - Doctor/Pharmacy/Admin)
 * @param {string} id - Product ID
 * @returns {Promise<Object>} Success message
 */
export const deleteProduct = async (id) => {
  return api.delete(`/products/${id}`)
}

