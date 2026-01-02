import axios from './axios'

/**
 * Add favorite doctor
 * @param {string} doctorId - Doctor ID
 * @param {string} patientId - Patient ID (required by validator, but backend will use token if different)
 * @returns {Promise<Object>} Created favorite
 * Note: Backend validator requires patientId in body, but controller uses req.userId from token
 */
export const addFavorite = async (doctorId, patientId = null) => {
  // Ensure doctorId is a string
  const doctorIdStr = String(doctorId)
  
  const requestBody = {
    doctorId: doctorIdStr
  }
  
  // Include patientId if provided (validator requires it, but controller will use token)
  if (patientId) {
    requestBody.patientId = String(patientId)
  }
  
  console.log('Adding favorite with:', requestBody)
  
  const response = await axios.post('/favorite', requestBody)
  return response.data
}

/**
 * List favorites for patient
 * @param {string} patientId - Patient ID (required in URL, but backend will use token if not matching)
 * @param {Object} params - Query parameters (page, limit)
 * @returns {Promise<Object>} Favorites list with pagination
 */
export const listFavorites = async (patientId, params = {}) => {
  // Backend route requires patientId in URL: /api/favorite/:patientId
  // But controller uses req.params.patientId || req.userId, so we can pass the patientId
  const url = `/favorite/${patientId}`
  const response = await axios.get(url, { params })
  return response.data
}

/**
 * Remove favorite
 * @param {string} favoriteId - Favorite ID
 * @returns {Promise<Object>} Success message
 */
export const removeFavorite = async (favoriteId) => {
  const response = await axios.delete(`/favorite/${favoriteId}`)
  return response.data
}

