import api from './axios'
import { getDeviceAppointmentTimeZone } from '../utils/deviceTimeZone'

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
 * Get the server-calculated price breakdown for a booking.
 * Amounts are always derived on the server from the doctor profile, never from
 * client input.
 * @param {Object} data - Quote data
 * @param {string} data.doctorId - Doctor ID
 * @param {string} data.bookingType - Booking type (VISIT, ONLINE)
 * @param {string[]} data.selectedServices - Selected service names
 * @returns {Promise<Object>} Quote with consultation fee, services and total
 */
export const getBookingQuote = async (data) => {
  return api.post('/appointment/quote', data)
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
  // Preserve the device-configured IANA zone with the booking. This is used
  // by the API for DST-aware communication windows and reminders; no country
  // or server timezone is assumed.
  if (!data.timezone || data.timezoneOffset === undefined || data.timezoneOffset === null) {
    const deviceTimeZone = getDeviceAppointmentTimeZone(data.appointmentDate, data.appointmentTime)
    return api.post('/appointment', {
      ...data,
      timezone: data.timezone || deviceTimeZone.timezone,
      timezoneOffset: data.timezoneOffset ?? deviceTimeZone.timezoneOffset
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

