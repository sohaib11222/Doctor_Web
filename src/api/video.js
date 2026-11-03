import axios from './axios'

const VIDEO_REQUEST_CONFIG = { timeout: 20_000 }

/**
 * Start (ring) a video call for a confirmed online appointment.
 * Either participant may call this. The other participant receives the ring
 * through GET /video/incoming.
 * @param {string} appointmentId - Appointment ID
 * @returns {Promise<Object>} Session data with Stream token and call ID
 */
export const startVideoSession = async (appointmentId) => {
  const response = await axios.post(
    '/video/start',
    { appointmentId },
    VIDEO_REQUEST_CONFIG
  )
  return response.data
}

/**
 * Accept an incoming ringing video call.
 * @param {string} sessionId - Video session ID
 * @returns {Promise<Object>} Session data with Stream token and call ID
 */
export const acceptVideoSession = async (sessionId) => {
  const response = await axios.post(
    '/video/accept',
    { sessionId },
    VIDEO_REQUEST_CONFIG
  )
  return response.data
}

/**
 * End or decline a video call. Idempotent.
 * @param {string} sessionId - Video session ID
 * @returns {Promise<Object>} Updated session
 */
export const endVideoSession = async (sessionId) => {
  const response = await axios.post(
    '/video/end',
    { sessionId },
    VIDEO_REQUEST_CONFIG
  )
  return response.data
}

/**
 * List video calls currently ringing for the authenticated user.
 * @returns {Promise<Object>} { sessions: [] }
 */
export const getIncomingVideoSessions = async () => {
  const response = await axios.get('/video/incoming', VIDEO_REQUEST_CONFIG)
  return response.data
}

/**
 * Get the latest video session for an appointment with a fresh token.
 * @param {string} appointmentId - Appointment ID
 * @returns {Promise<Object>} Session data with Stream token and call ID
 */
export const getVideoSessionByAppointment = async (appointmentId) => {
  const response = await axios.get(
    `/video/by-appointment/${appointmentId}`,
    VIDEO_REQUEST_CONFIG
  )
  return response.data
}
