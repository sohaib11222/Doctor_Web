import axios from './axios'

/**
 * Get appointments eligible for reschedule
 */
export const getEligibleAppointments = async () => {
  const response = await axios.get('/reschedule-request/eligible-appointments')
  return response.data
}

/**
 * Create reschedule request
 */
export const createRescheduleRequest = async (data) => {
  const response = await axios.post('/reschedule-request', data)
  return response.data
}

/**
 * List reschedule requests (filtered by role)
 */
export const listRescheduleRequests = async (params = {}) => {
  const response = await axios.get('/reschedule-request', { params })
  return response.data
}

/**
 * Get reschedule request by ID
 */
export const getRescheduleRequest = async (requestId) => {
  const response = await axios.get(`/reschedule-request/${requestId}`)
  return response.data
}

/**
 * Approve reschedule request (doctor)
 */
export const approveRescheduleRequest = async (requestId, approvalData) => {
  const response = await axios.post(`/reschedule-request/${requestId}/approve`, approvalData)
  return response.data
}

/**
 * Reject reschedule request (doctor)
 */
export const rejectRescheduleRequest = async (requestId, rejectionReason) => {
  const response = await axios.post(`/reschedule-request/${requestId}/reject`, {
    rejectionReason
  })
  return response.data
}

/**
 * Pay reschedule fee (patient)
 */
export const payRescheduleFee = async (requestId, paymentMethod = 'DUMMY') => {
  const response = await axios.post(`/reschedule-request/${requestId}/pay`, {
    paymentMethod
  })
  return response.data
}
