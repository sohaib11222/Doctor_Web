import axios from './axios'

/**
 * Create medical record
 * @param {Object} data - Medical record data
 * @param {string} data.title - Record title (required)
 * @param {string} data.description - Record description
 * @param {string} data.recordType - Record type (PRESCRIPTION, LAB_REPORT, TEST_RESULT, IMAGE, PDF, OTHER)
 * @param {string} data.fileUrl - File URL (required)
 * @param {string} data.fileName - File name
 * @param {number} data.fileSize - File size in bytes
 * @param {string} data.relatedAppointmentId - Related appointment ID
 * @param {string} data.relatedDoctorId - Related doctor ID
 * @returns {Promise<Object>} Created medical record
 */
export const createMedicalRecord = async (data) => {
  const response = await axios.post('/patient/medical-records', data)
  return response.data
}

/**
 * Get patient medical records
 * @param {Object} params - Query parameters
 * @param {string} params.recordType - Filter by record type
 * @param {number} params.page - Page number (default: 1)
 * @param {number} params.limit - Records per page (default: 20)
 * @returns {Promise<Object>} Medical records with pagination
 */
export const getMedicalRecords = async (params = {}) => {
  const response = await axios.get('/patient/medical-records', { params })
  return response.data
}

/**
 * Delete medical record
 * @param {string} recordId - Medical record ID
 * @returns {Promise<Object>} Success message
 */
export const deleteMedicalRecord = async (recordId) => {
  const response = await axios.delete(`/patient/medical-records/${recordId}`)
  return response.data
}

