import axios from './axios'

/**
 * Get announcements for doctor
 * @param {Object} params - Query parameters (page, limit, isRead)
 * @returns {Promise<Object>} Announcements and pagination info
 */
export const getDoctorAnnouncements = async (params = {}) => {
  const response = await axios.get('/announcements/doctor', { params })
  return response.data
}

/**
 * Get unread announcement count for doctor
 * @returns {Promise<Object>} Unread count
 */
export const getUnreadAnnouncementCount = async () => {
  const response = await axios.get('/announcements/unread-count')
  return response.data
}

/**
 * Get single announcement by ID
 * @param {string} id - Announcement ID
 * @returns {Promise<Object>} Announcement details
 */
export const getAnnouncementById = async (id) => {
  const response = await axios.get(`/announcements/${id}`)
  return response.data
}

/**
 * Mark announcement as read
 * @param {string} id - Announcement ID
 * @returns {Promise<Object>} Success response
 */
export const markAnnouncementAsRead = async (id) => {
  const response = await axios.post(`/announcements/${id}/read`)
  return response.data
}

