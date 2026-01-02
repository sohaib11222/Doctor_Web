import axios from './axios'

/**
 * Get doctor dashboard statistics
 * @returns {Promise<Object>} Dashboard statistics
 */
export const getDoctorDashboard = async () => {
  const response = await axios.get('/doctor/dashboard')
  return response.data
}

/**
 * Get doctor profile by ID (public)
 * @param {string} doctorId - Doctor user ID
 * @returns {Promise<Object>} Doctor profile
 */
export const getDoctorProfileById = async (doctorId) => {
  const response = await axios.get(`/doctor/profile/${doctorId}`)
  return response.data
}

/**
 * List doctors with filtering (public)
 * @param {Object} params - Query parameters
 * @param {string} params.specializationId - Filter by specialization
 * @param {string} params.city - Filter by city
 * @param {boolean} params.isFeatured - Filter featured doctors
 * @param {boolean} params.isAvailableOnline - Filter online available doctors
 * @param {string} params.search - Search term
 * @param {number} params.page - Page number
 * @param {number} params.limit - Items per page
 * @returns {Promise<Object>} Doctors list with pagination
 */
export const listDoctors = async (params = {}) => {
  const response = await axios.get('/doctor', { params })
  return response.data
}

