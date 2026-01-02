import api from './axios'

/**
 * Availability API
 * For setting/getting doctor availability for specific dates
 */

/**
 * Set doctor availability for a specific date
 * @param {Object} data - Availability data
 * @param {string} data.date - Date in ISO format (YYYY-MM-DD)
 * @param {Array} data.timeSlots - Array of time slots
 * @param {boolean} data.isAvailable - Whether doctor is available on this date
 * @returns {Promise<Object>} Created/updated availability
 */
export const setAvailability = async (data) => {
  return api.post('/availability', data)
}

/**
 * Get doctor availability
 * @param {Object} params - Query parameters
 * @param {string} params.fromDate - Start date (optional)
 * @param {string} params.toDate - End date (optional)
 * @returns {Promise<Array>} Availability records
 */
export const getAvailability = async (params = {}) => {
  return api.get('/availability', { params })
}

/**
 * Get available time slots for a doctor on a specific date (public)
 * @param {string} doctorId - Doctor user ID
 * @param {string} date - Date in YYYY-MM-DD format
 * @returns {Promise<Array>} Available time slots
 */
export const getAvailableSlots = async (doctorId, date) => {
  return api.get('/availability/slots', {
    params: { doctorId, date }
  })
}

/**
 * Check if a time slot is available (public)
 * @param {string} doctorId - Doctor user ID
 * @param {string} date - Date in YYYY-MM-DD format
 * @param {string} timeSlot - Time slot (e.g., "09:00-10:00")
 * @returns {Promise<boolean>} True if available
 */
export const checkTimeSlot = async (doctorId, date, timeSlot) => {
  const response = await api.get('/availability/check', {
    params: { doctorId, date, timeSlot }
  })
  return response.data?.available || false
}

