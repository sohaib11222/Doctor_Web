import axios from './axios'

/**
 * Get all conversations for the current user (doctor)
 * @param {Object} params - Query parameters (page, limit)
 * @returns {Promise<Object>} Conversations list with pagination
 */
export const getConversations = async (params = {}) => {
  const response = await axios.get('/chat/conversations', { params })
  return response.data
}

/**
 * Get unread message count for the current user
 * @returns {Promise<Object>} Unread count
 */
export const getUnreadCount = async () => {
  const response = await axios.get('/chat/unread-count')
  return response.data
}

/**
 * Start or get conversation with admin
 * @param {string} doctorId - Doctor ID
 * @param {string} adminId - Admin ID (optional, will be from token if user is ADMIN)
 * @returns {Promise<Object>} Conversation object
 */
export const startConversationWithAdmin = async (doctorId, adminId = null) => {
  const response = await axios.post('/chat/conversation', {
    doctorId,
    adminId // Optional - backend will use token if user is ADMIN
  })
  return response.data
}

/**
 * Start or get conversation with patient
 * @param {string} doctorId - Doctor ID
 * @param {string} patientId - Patient ID
 * @param {string} appointmentId - Appointment ID (required)
 * @returns {Promise<Object>} Conversation object
 */
export const startConversationWithPatient = async (doctorId, patientId, appointmentId) => {
  const response = await axios.post('/chat/conversation', {
    doctorId,
    patientId,
    appointmentId
  })
  return response.data
}

/**
 * Send message to admin
 * @param {string} doctorId - Doctor ID
 * @param {string} adminId - Admin ID
 * @param {string} message - Message text
 * @param {Array} attachments - Optional attachments array
 * @returns {Promise<Object>} Created message
 */
export const sendMessageToAdmin = async (doctorId, adminId, message, attachments = null) => {
  const response = await axios.post('/chat/send', {
    doctorId,
    adminId,
    message,
    ...(attachments && { attachments })
  })
  return response.data
}

/**
 * Send message to patient
 * @param {string} doctorId - Doctor ID
 * @param {string} patientId - Patient ID
 * @param {string} appointmentId - Appointment ID (required)
 * @param {string} message - Message text
 * @param {Array} attachments - Optional attachments array
 * @returns {Promise<Object>} Created message
 */
export const sendMessageToPatient = async (doctorId, patientId, appointmentId, message, attachments = null) => {
  const response = await axios.post('/chat/send', {
    doctorId,
    patientId,
    appointmentId,
    message,
    ...(attachments && { attachments })
  })
  return response.data
}

/**
 * Get messages for a conversation
 * @param {string} conversationId - Conversation ID
 * @param {Object} params - Query parameters (page, limit)
 * @returns {Promise<Object>} Messages with pagination
 */
export const getMessages = async (conversationId, params = {}) => {
  const response = await axios.get(`/chat/messages/${conversationId}`, { params })
  return response.data
}

/**
 * Mark messages as read in a conversation
 * @param {string} conversationId - Conversation ID
 * @returns {Promise<Object>} Updated count
 */
export const markMessagesAsRead = async (conversationId) => {
  const response = await axios.put(`/chat/conversations/${conversationId}/read`)
  return response.data
}

/**
 * Start or get conversation with doctor (for patients)
 * @param {string} doctorId - Doctor ID
 * @param {string} appointmentId - Appointment ID (required)
 * @param {string} patientId - Patient ID (optional, will be from token if not provided)
 * @returns {Promise<Object>} Conversation object
 */
export const startConversationWithDoctor = async (doctorId, appointmentId, patientId = null) => {
  const response = await axios.post('/chat/conversation', {
    doctorId,
    patientId, // Include patientId in body (backend will verify it matches token)
    appointmentId
  })
  return response.data
}

/**
 * Send message to doctor (for patients)
 * @param {string} doctorId - Doctor ID
 * @param {string} appointmentId - Appointment ID (required)
 * @param {string} message - Message text
 * @param {Array} attachments - Optional attachments array
 * @param {string} patientId - Patient ID (required for doctor-patient chat)
 * @returns {Promise<Object>} Created message
 */
export const sendMessageToDoctor = async (doctorId, appointmentId, message, attachments = null, patientId = null) => {
  // Ensure all IDs are strings
  const doctorIdStr = String(doctorId)
  const appointmentIdStr = String(appointmentId)
  const patientIdStr = patientId ? String(patientId) : null
  
  const requestBody = {
    doctorId: doctorIdStr,
    appointmentId: appointmentIdStr,
    message: String(message)
  }
  
  // Only include patientId if provided (required for doctor-patient chat)
  if (patientIdStr) {
    requestBody.patientId = patientIdStr
  }
  
  // Include attachments if provided
  if (attachments && Array.isArray(attachments) && attachments.length > 0) {
    requestBody.attachments = attachments
  }
  
  console.log('Sending message request:', {
    ...requestBody,
    message: requestBody.message.substring(0, 50) + '...'
  })
  
  const response = await axios.post('/chat/send', requestBody)
  return response.data
}

