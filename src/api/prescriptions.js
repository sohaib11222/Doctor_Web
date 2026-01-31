import api from './axios'
import axios from 'axios'

const apiBaseURL =
  import.meta.env.VITE_API_URL ||
  import.meta.env.VITE_API_BASE_URL ||
  'https://mydoctoradmin.mydoctorplus.it/api'

const downloadClient = axios.create({
  baseURL: apiBaseURL,
})

downloadClient.interceptors.request.use((config) => {
  const token = localStorage.getItem('token')
  if (token) {
    config.headers.Authorization = `Bearer ${token}`
  }
  return config
})

export const upsertPrescriptionForAppointment = async (appointmentId, data) => {
  return api.post(`/prescriptions/appointment/${appointmentId}`, data)
}

export const getPrescriptionByAppointment = async (appointmentId) => {
  return api.get(`/prescriptions/appointment/${appointmentId}`)
}

export const listMyPrescriptions = async (params = {}) => {
  return api.get('/prescriptions', { params })
}

export const downloadPrescriptionPdf = async (prescriptionId) => {
  const response = await downloadClient.get(`/prescriptions/${prescriptionId}/pdf`, {
    responseType: 'blob'
  })

  const contentDisposition = response.headers?.['content-disposition'] || ''
  const fallbackName = `prescription-${prescriptionId}.pdf`
  const match = contentDisposition.match(/filename="?([^";]+)"?/i)
  const filename = match?.[1] || fallbackName

  const blobUrl = window.URL.createObjectURL(response.data)
  const link = document.createElement('a')
  link.href = blobUrl
  link.download = filename
  document.body.appendChild(link)
  link.click()
  document.body.removeChild(link)
  window.URL.revokeObjectURL(blobUrl)
}
