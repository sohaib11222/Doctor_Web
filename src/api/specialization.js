import axios from './axios'

/**
 * Get all specializations
 * @returns {Promise<Array>} List of specializations
 * Note: axios interceptor returns response.data which is { success, message, data: [...] }
 * So we need to return response.data to get the inner data array
 */
export const getAllSpecializations = async () => {
  // axios interceptor returns response.data = { success, message, data: [...] }
  const response = await axios.get('/specialization')
  // Return the inner data array: [...]
  return response.data || response
}

