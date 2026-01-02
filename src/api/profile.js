import axios from './axios'

/**
 * Get current user profile by ID
 * @param {string} userId - User ID
 * @returns {Promise<Object>} User profile
 */
export const getUserProfile = async (userId) => {
  const response = await axios.get(`/users/${userId}`)
  return response.data
}

/**
 * Update user profile (general user fields)
 * @param {Object} data - Profile data (fullName, phone, gender, dob, profileImage, bloodGroup, address, emergencyContact)
 * @returns {Promise<Object>} Updated user
 */
export const updateUserProfile = async (data) => {
  const response = await axios.put('/users/profile', data)
  return response.data
}

/**
 * Get doctor profile (uses token)
 * @returns {Promise<Object>} Doctor profile
 */
export const getDoctorProfile = async () => {
  const response = await axios.get('/doctor/profile')
  return response.data
}

/**
 * Update doctor profile (doctor-specific fields)
 * @param {Object} data - Doctor profile data (title, biography, specializationId, experienceYears, services, consultationFees, clinics, education, experience, awards, memberships, socialLinks, etc.)
 * @returns {Promise<Object>} Updated doctor profile
 */
export const updateDoctorProfile = async (data) => {
  const response = await axios.put('/doctor/profile', data)
  return response.data
}

