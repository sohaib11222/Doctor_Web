import api from './axios'
import { API_ROUTES } from '../utils/apiConfig'

/**
 * Order API Service
 * For managing product orders
 */

/**
 * Create order
 * @param {Object} data - Order data (items, shippingAddress, paymentMethod)
 * @returns {Promise} Order response
 */
export const createOrder = async (data) => {
  return api.post(API_ROUTES.ORDER.CREATE, data)
}

/**
 * Get order by ID
 * @param {string} orderId - Order ID
 * @returns {Promise} Order response
 */
export const getOrderById = async (orderId) => {
  return api.get(API_ROUTES.ORDER.GET(orderId))
}

/**
 * Get patient orders
 * @param {Object} params - Query parameters (status, page, limit)
 * @returns {Promise} Orders response
 */
export const getPatientOrders = async (params = {}) => {
  return api.get(API_ROUTES.ORDER.LIST, { params })
}

/**
 * Get pharmacy orders (for pharmacy owner/doctor)
 * @param {Object} params - Query parameters (status, page, limit)
 * @returns {Promise} Orders response
 */
export const getPharmacyOrders = async (params = {}) => {
  // Use /orders endpoint which routes to getPharmacyOrders for doctors
  return api.get(API_ROUTES.ORDER.LIST, { params })
}

/**
 * Get all orders (for admin)
 * @param {Object} params - Query parameters (status, page, limit)
 * @returns {Promise} Orders response
 */
export const getAllOrders = async (params = {}) => {
  return api.get(API_ROUTES.ORDER.ADMIN_LIST, { params })
}

/**
 * Update order status (for pharmacy owner/admin)
 * @param {string} orderId - Order ID
 * @param {string} status - New status
 * @returns {Promise} Order response
 */
export const updateOrderStatus = async (orderId, status) => {
  return api.put(API_ROUTES.ORDER.UPDATE_STATUS(orderId), { status })
}

/**
 * Update shipping fee (for pharmacy owner/admin)
 * @param {string} orderId - Order ID
 * @param {number} shippingFee - New shipping fee
 * @returns {Promise} Order response
 */
export const updateShippingFee = async (orderId, shippingFee) => {
  return api.put(API_ROUTES.ORDER.UPDATE_SHIPPING(orderId), { shippingFee })
}

/**
 * Cancel order
 * @param {string} orderId - Order ID
 * @returns {Promise} Order response
 */
export const cancelOrder = async (orderId) => {
  return api.post(API_ROUTES.ORDER.CANCEL(orderId))
}

/**
 * Pay for order (for patient - including shipping difference if any)
 * @param {string} orderId - Order ID
 * @param {string} paymentMethod - Payment method
 * @returns {Promise} Payment response
 */
export const payForOrder = async (orderId, paymentMethod = 'DUMMY') => {
  return api.post(API_ROUTES.ORDER.PAY(orderId), { paymentMethod })
}

