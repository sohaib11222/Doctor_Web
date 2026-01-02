import api from './axios'

/**
 * Weekly Schedule API
 * For managing doctor's recurring weekly schedule
 */

/**
 * Create or update weekly schedule for a day
 * @param {Object} data - Schedule data
 * @param {string} data.dayOfWeek - Day of week (Monday, Tuesday, etc.)
 * @param {Array} data.timeSlots - Array of time slots for the day
 * @returns {Promise<Object>} Updated schedule
 */
export const upsertWeeklySchedule = async (data) => {
  return api.post('/weekly-schedule', data)
}

/**
 * Get weekly schedule
 * @returns {Promise<Object>} Weekly schedule with all days
 */
export const getWeeklySchedule = async () => {
  return api.get('/weekly-schedule')
}

/**
 * Update appointment duration
 * @param {number} duration - Duration in minutes (15, 30, 45, or 60)
 * @returns {Promise<Object>} Updated schedule
 */
export const updateAppointmentDuration = async (duration) => {
  return api.put('/weekly-schedule/duration', { duration })
}

/**
 * Add time slot to a specific day
 * @param {string} dayOfWeek - Day of week (Monday, Tuesday, etc.)
 * @param {Object} timeSlot - Time slot data
 * @param {string} timeSlot.startTime - Start time in HH:MM format
 * @param {string} timeSlot.endTime - End time in HH:MM format
 * @param {boolean} timeSlot.isAvailable - Whether slot is available (optional, default: true)
 * @returns {Promise<Object>} Updated schedule
 */
export const addTimeSlot = async (dayOfWeek, timeSlot) => {
  return api.post(`/weekly-schedule/day/${dayOfWeek}/slot`, timeSlot)
}

/**
 * Update time slot
 * @param {string} dayOfWeek - Day of week (Monday, Tuesday, etc.)
 * @param {string} slotId - Time slot ID
 * @param {Object} updates - Partial time slot updates
 * @param {string} updates.startTime - Start time in HH:MM format (optional)
 * @param {string} updates.endTime - End time in HH:MM format (optional)
 * @param {boolean} updates.isAvailable - Whether slot is available (optional)
 * @returns {Promise<Object>} Updated schedule
 */
export const updateTimeSlot = async (dayOfWeek, slotId, updates) => {
  return api.put(`/weekly-schedule/day/${dayOfWeek}/slot/${slotId}`, updates)
}

/**
 * Delete time slot
 * @param {string} dayOfWeek - Day of week (Monday, Tuesday, etc.)
 * @param {string} slotId - Time slot ID
 * @returns {Promise<Object>} Updated schedule
 */
export const deleteTimeSlot = async (dayOfWeek, slotId) => {
  return api.delete(`/weekly-schedule/day/${dayOfWeek}/slot/${slotId}`)
}

/**
 * Get available slots for a specific date (public)
 * @param {string} doctorId - Doctor user ID
 * @param {string} date - Date in YYYY-MM-DD format
 * @returns {Promise<Array>} Available time slots
 */
export const getAvailableSlotsForDate = async (doctorId, date) => {
  return api.get('/weekly-schedule/slots', {
    params: { doctorId, date }
  })
}

