import axios from './axios'

/**
 * Get doctor's reviews (for authenticated doctor)
 * @param {Object} params - Query parameters (page, limit)
 * @returns {Promise<Object>} Reviews with pagination
 */
export const getDoctorReviews = async (params = {}) => {
  const response = await axios.get('/doctor/reviews', { params })
  return response.data || response
}

/**
 * Get reviews by doctor ID (public)
 * @param {string} doctorId - Doctor user ID
 * @param {Object} params - Query parameters (page, limit)
 * @returns {Promise<Object>} Reviews with pagination
 */
export const getReviewsByDoctorId = async (doctorId, params = {}) => {
  const response = await axios.get(`/reviews/doctor/${doctorId}`, { params })
  return response.data || response
}

