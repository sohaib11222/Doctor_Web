import axios from './axios'

/**
 * Get patient dashboard statistics
 * @returns {Promise<Object>} Dashboard statistics including appointments, reviews, notifications, etc.
 */
export const getPatientDashboard = async () => {
  const response = await axios.get('/patient/dashboard')
  return response.data
}

