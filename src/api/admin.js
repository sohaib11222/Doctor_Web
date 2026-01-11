import axios from './axios'

/**
 * Get admin dashboard statistics
 * @returns {Promise<Object>} Dashboard statistics
 */
export const getDashboardStats = async () => {
  const response = await axios.get('/admin/dashboard')
  return response.data
}

/**
 * List all doctors (admin only - shows all statuses)
 * @param {Object} params - Query parameters
 * @param {string} params.status - Filter by status (PENDING, APPROVED, REJECTED, BLOCKED)
 * @param {string} params.subscriptionStatus - Filter by subscription status
 * @param {string} params.search - Search term
 * @param {number} params.page - Page number
 * @param {number} params.limit - Items per page
 * @returns {Promise<Object>} Doctors list with pagination
 */
export const listAllDoctors = async (params = {}) => {
  const response = await axios.get('/admin/doctors', { params })
  return response.data
}

/**
 * Update user status (admin only)
 * @param {string} userId - User ID
 * @param {string} status - New status (PENDING, APPROVED, REJECTED, BLOCKED)
 * @returns {Promise<Object>} Updated user
 */
export const updateUserStatus = async (userId, status) => {
  const response = await axios.put(`/admin/users/${userId}/status`, { status })
  return response.data
}

/**
 * List all users (admin only)
 * @param {Object} params - Query parameters
 * @param {string} params.role - Filter by role (DOCTOR, PATIENT, etc.)
 * @param {string} params.status - Filter by status
 * @param {string} params.search - Search term
 * @param {number} params.page - Page number
 * @param {number} params.limit - Items per page
 * @returns {Promise<Object>} Users list with pagination
 */
export const listAllUsers = async (params = {}) => {
  const response = await axios.get('/admin/users', { params })
  return response.data
}

