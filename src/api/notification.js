import axios from './axios'

/**
 * Get notifications for current user (from token)
 * @param {Object} params - Query parameters (type, isRead, page, limit)
 * @returns {Promise<Object>} Notifications with pagination
 */
export const getNotifications = async (params = {}) => {
  const response = await axios.get('/notification', { params })
  return response.data || response
}

/**
 * Mark notification as read
 * @param {string} notificationId - Notification ID
 * @returns {Promise<Object>} Updated notification
 */
export const markNotificationAsRead = async (notificationId) => {
  const response = await axios.put(`/notification/read/${notificationId}`)
  return response.data || response
}

/**
 * Mark all notifications as read
 * @returns {Promise<Object>} Success message
 */
export const markAllNotificationsAsRead = async () => {
  // Get all unread notifications first
  const notifications = await getNotifications({ isRead: false })
  const unreadNotifications = notifications.data?.notifications || notifications.notifications || []
  
  // Mark each as read
  const promises = unreadNotifications.map(notif => markNotificationAsRead(notif._id))
  await Promise.all(promises)
  
  return { success: true, message: 'All notifications marked as read' }
}

