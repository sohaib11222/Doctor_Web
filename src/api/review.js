import axios from './axios'

/**
 * Create review (patient only)
 * @param {Object} data - Review data (doctorId, appointmentId?, rating, reviewText, reviewType?)
 * @returns {Promise<Object>} Created review
 */
export const createReview = async (data) => {
  const response = await axios.post('/reviews', data)
  return response.data || response
}

/**
 * Delete review
 * @param {string} reviewId - Review ID
 * @returns {Promise<Object>} Success message
 */
export const deleteReview = async (reviewId) => {
  const response = await axios.delete(`/reviews/${reviewId}`)
  return response.data || response
}

