/**
 * Patient Queries
 * All GET requests related to patients
 */

import { useQuery } from '@tanstack/react-query'
import { api } from '../utils/api'
import { API_ROUTES } from '../utils/apiConfig'

// Get patient dashboard
export const usePatientDashboard = () => {
  return useQuery({
    queryKey: ['patient', 'dashboard'],
    queryFn: () => api.get(API_ROUTES.PATIENT.DASHBOARD),
  })
}

// Get appointment history
export const useAppointmentHistory = (params = {}) => {
  return useQuery({
    queryKey: ['patient', 'appointments', 'history', params],
    queryFn: () => api.get(API_ROUTES.PATIENT.APPOINTMENTS_HISTORY, { params }),
  })
}

// Get payment history
export const usePaymentHistory = (params = {}) => {
  return useQuery({
    queryKey: ['patient', 'payments', 'history', params],
    queryFn: () => api.get(API_ROUTES.PATIENT.PAYMENTS_HISTORY, { params }),
  })
}

// Get medical records
export const useMedicalRecords = (params = {}) => {
  return useQuery({
    queryKey: ['patient', 'medical-records', params],
    queryFn: () => api.get(API_ROUTES.PATIENT.MEDICAL_RECORDS, { params }),
  })
}

