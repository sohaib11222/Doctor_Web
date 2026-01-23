import api from './axios'

/**
 * Appointment API
 * For managing doctor and patient appointments
 */

/**
 * List appointments (automatically filtered by user role)
 * @param {Object} params - Query parameters
 * @param {string} params.status - Filter by status (PENDING, CONFIRMED, CANCELLED, COMPLETED, NO_SHOW, REJECTED)
 * @param {string} params.fromDate - Filter from date (ISO string)
 * @param {string} params.toDate - Filter to date (ISO string)
 * @param {number} params.page - Page number (default: 1)
 * @param {number} params.limit - Items per page (default: 10)
 * @returns {Promise<Object>} Appointments list with pagination
 */
export const listAppointments = async (params = {}) => {
  return api.get('/appointment', { params })
}

/**
 * Get appointment by ID
 * @param {string} id - Appointment ID
 * @returns {Promise<Object>} Appointment details
 */
export const getAppointmentById = async (id) => {
  return api.get(`/appointment/${id}`)
}

/**
 * Accept appointment (doctor only)
 * @param {string} id - Appointment ID
 * @returns {Promise<Object>} Updated appointment
 */
export const acceptAppointment = async (id) => {
  return api.post(`/appointment/${id}/accept`)
}

/**
 * Reject appointment (doctor only)
 * @param {string} id - Appointment ID
 * @param {string} reason - Optional rejection reason
 * @returns {Promise<Object>} Updated appointment
 */
export const rejectAppointment = async (id, reason = null) => {
  return api.post(`/appointment/${id}/reject`, reason ? { reason } : {})
}

/**
 * Update appointment status
 * @param {string} id - Appointment ID
 * @param {Object} data - Status update data
 * @param {string} data.status - New status (PENDING, CONFIRMED, CANCELLED, COMPLETED, NO_SHOW, REJECTED)
 * @param {string} data.paymentStatus - Payment status (UNPAID, PAID, REFUNDED)
 * @param {string} data.paymentMethod - Payment method
 * @param {string} data.notes - Notes
 * @returns {Promise<Object>} Updated appointment
 */
export const updateAppointmentStatus = async (id, data) => {
  return api.put(`/appointment/${id}/status`, data)
}

/**
 * Create appointment (patient only)
 * @param {Object} data - Appointment data
 * @param {string} data.doctorId - Doctor ID
 * @param {string} data.patientId - Patient ID
 * @param {string} data.appointmentDate - Appointment date (ISO string)
 * @param {string} data.appointmentTime - Appointment time (e.g., "10:30")
 * @param {string} data.bookingType - Booking type (VISIT, ONLINE)
 * @param {string} data.patientNotes - Optional patient notes
 * @param {string} data.clinicName - Optional clinic name
 * @returns {Promise<Object>} Created appointment
 */
export const createAppointment = async (data) => {
  // Automatically add timezone information if not provided
  // CRITICAL: timezoneOffset should be positive for timezones ahead of UTC
  // Pakistan is UTC+5, so offset should be +300 minutes
  if (!data.timezone || data.timezoneOffset === undefined || data.timezoneOffset === null) {
    const timezone = Intl.DateTimeFormat().resolvedOptions().timeZone
    // getTimezoneOffset() returns negative for timezones ahead of UTC
    // For Pakistan (UTC+5), it returns -300, so we negate it to get +300
    const timezoneOffset = -new Date().getTimezoneOffset() // Offset in minutes (positive = ahead of UTC)
    
    // Format timezone as UTC offset string (e.g., "UTC+5" for Pakistan)
    const offsetHours = Math.floor(Math.abs(timezoneOffset) / 60)
    const offsetSign = timezoneOffset >= 0 ? '+' : '-'
    const timezoneString = `UTC${offsetSign}${offsetHours}`
    
    console.log('🌍 [Frontend] Detected timezone:', {
      timezone,
      timezoneOffset,
      timezoneString,
      rawOffset: new Date().getTimezoneOffset(),
      explanation: `User is ${offsetHours} hours ${offsetSign === '+' ? 'ahead' : 'behind'} UTC`
    })
    
    return api.post('/appointment', {
      ...data,
      timezone: data.timezone || timezoneString,
      timezoneOffset: data.timezoneOffset !== undefined ? data.timezoneOffset : timezoneOffset
    })
  }
  
  return api.post('/appointment', data)
}

/**
 * Cancel appointment (patient only)
 * @param {string} id - Appointment ID
 * @param {string} reason - Optional cancellation reason
 * @returns {Promise<Object>} Updated appointment
 */
export const cancelAppointment = async (id, reason = null) => {
  return api.post(`/appointment/${id}/cancel`, reason ? { reason } : {})
}

