/**
 * Appointment Queries
 * All GET requests related to appointments
 */

import { useQuery } from '@tanstack/react-query'
import { api } from '../utils/api'
import { API_ROUTES } from '../utils/apiConfig'

// Get appointments with filters
export const useAppointments = (params = {}) => {
  return useQuery({
    queryKey: ['appointments', params],
    queryFn: () => api.get(API_ROUTES.APPOINTMENT.LIST, { params }),
  })
}

// Get appointment by ID
export const useAppointment = (appointmentId) => {
  return useQuery({
    queryKey: ['appointment', appointmentId],
    queryFn: () => api.get(API_ROUTES.APPOINTMENT.GET(appointmentId)),
    enabled: !!appointmentId,
  })
}

// Admin: Get all appointments
export const useAdminAppointments = (params = {}) => {
  return useQuery({
    queryKey: ['admin', 'appointments', params],
    queryFn: () => api.get(API_ROUTES.APPOINTMENT.ADMIN_LIST, { params }),
  })
}

