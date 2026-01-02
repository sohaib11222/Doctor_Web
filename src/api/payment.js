import axios from './axios'

/**
 * Get user transactions (automatically filtered by userId from token)
 * @param {Object} params - Query parameters (status, page, limit)
 * @returns {Promise<Object>} Transactions and pagination info
 */
export const getTransactions = async (params = {}) => {
  const response = await axios.get('/payment/transactions', { params })
  return response.data
}

/**
 * Get transaction by ID
 * @param {string} id - Transaction ID
 * @returns {Promise<Object>} Transaction details
 */
export const getTransactionById = async (id) => {
  const response = await axios.get(`/payment/transaction/${id}`)
  return response.data
}

/**
 * Process subscription payment
 * @param {string} subscriptionPlanId - Subscription plan ID
 * @param {number} amount - Payment amount
 * @param {string} paymentMethod - Payment method (default: 'DUMMY')
 * @returns {Promise<Object>} Transaction and subscription result
 */
export const processSubscriptionPayment = async (subscriptionPlanId, amount, paymentMethod = 'DUMMY') => {
  const response = await axios.post('/payment/subscription', {
    subscriptionPlanId,
    amount,
    paymentMethod
  })
  return response.data
}

/**
 * Process appointment payment
 * @param {string} appointmentId - Appointment ID
 * @param {number} amount - Payment amount
 * @param {string} paymentMethod - Payment method (default: 'DUMMY')
 * @returns {Promise<Object>} Transaction result
 */
export const processAppointmentPayment = async (appointmentId, amount, paymentMethod = 'DUMMY') => {
  const response = await axios.post('/payment/appointment', {
    appointmentId,
    amount,
    paymentMethod
  })
  return response.data
}

/**
 * Process product payment
 * @param {string} productId - Product ID
 * @param {number} amount - Payment amount
 * @param {string} paymentMethod - Payment method (default: 'DUMMY')
 * @returns {Promise<Object>} Transaction result
 */
export const processProductPayment = async (productId, amount, paymentMethod = 'DUMMY') => {
  const response = await axios.post('/payment/product', {
    productId,
    amount,
    paymentMethod
  })
  return response.data
}

/**
 * Get patient payment history
 * @param {Object} params - Query parameters (status, fromDate, toDate, page, limit)
 * @returns {Promise<Object>} Transactions and pagination info
 */
export const getPatientPaymentHistory = async (params = {}) => {
  const response = await axios.get('/patient/payments/history', { params })
  return response.data
}

