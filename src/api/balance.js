import axios from './axios'

/**
 * Get user balance
 * @returns {Promise<Object>} User balance info
 */
export const getBalance = async () => {
  const response = await axios.get('/balance')
  return response.data
}

/**
 * Request withdrawal
 * @param {number} amount - Amount to withdraw
 * @param {string} paymentMethod - Payment method (e.g., 'BANK', 'PAYPAL')
 * @param {string} paymentDetails - Payment details (account number, etc.)
 * @returns {Promise<Object>} Withdrawal request
 */
export const requestWithdrawal = async (amount, paymentMethod, paymentDetails) => {
  const response = await axios.post('/balance/withdraw/request', {
    amount,
    paymentMethod,
    paymentDetails
  })
  return response.data
}

/**
 * Get withdrawal requests
 * @param {Object} params - Query parameters (status, page, limit)
 * @returns {Promise<Object>} Withdrawal requests and pagination
 */
export const getWithdrawalRequests = async (params = {}) => {
  const response = await axios.get('/balance/withdraw/requests', { params })
  return response.data
}

