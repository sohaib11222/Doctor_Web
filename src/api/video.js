import axios from './axios'

/**
 * Start video session
 * @param {string} appointmentId - Appointment ID
 * @returns {Promise<Object>} Session data with Stream token and call ID
 */
export const startVideoSession = async (appointmentId) => {
  console.log('📡 [API] Starting video session for appointment:', appointmentId)
  try {
    const response = await axios.post('/video/start', { appointmentId })
    console.log('✅ [API] Video session started:', response.data)
    return response.data
  } catch (error) {
    console.error('❌ [API] Error starting video session:', error)
    console.error('❌ [API] Error response:', error.response?.data)
    throw error
  }
}

/**
 * End video session
 * @param {string} sessionId - Session ID
 * @returns {Promise<Object>} Updated session
 */
export const endVideoSession = async (sessionId) => {
  const response = await axios.post('/video/end', { sessionId })
  return response.data
}

/**
 * Get video session by appointment ID
 * @param {string} appointmentId - Appointment ID
 * @returns {Promise<Object>} Session data with Stream token and call ID
 */
export const getVideoSessionByAppointment = async (appointmentId) => {
  const response = await axios.get(`/video/by-appointment/${appointmentId}`)
  return response.data
}

