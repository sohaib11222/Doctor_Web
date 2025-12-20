/**
 * Appointment Mutations
 * All POST/PUT/DELETE requests related to appointments
 */

import { useMutation, useQueryClient } from '@tanstack/react-query'
import { api } from '../utils/api'
import { API_ROUTES } from '../utils/apiConfig'

// Create appointment (patient)
export const useCreateAppointment = () => {
  const queryClient = useQueryClient()
  
  return useMutation({
    mutationFn: (data) => api.post(API_ROUTES.APPOINTMENT.CREATE, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['appointments'] })
      queryClient.invalidateQueries({ queryKey: ['admin', 'appointments'] })
      queryClient.invalidateQueries({ queryKey: ['patient', 'appointments'] })
    },
  })
}

// Accept appointment (doctor)
export const useAcceptAppointment = () => {
  const queryClient = useQueryClient()
  
  return useMutation({
    mutationFn: (appointmentId) => api.post(API_ROUTES.APPOINTMENT.ACCEPT(appointmentId)),
    onSuccess: (data, appointmentId) => {
      queryClient.invalidateQueries({ queryKey: ['appointments'] })
      queryClient.invalidateQueries({ queryKey: ['appointment', appointmentId] })
      queryClient.invalidateQueries({ queryKey: ['admin', 'appointments'] })
    },
  })
}

// Reject appointment (doctor)
export const useRejectAppointment = () => {
  const queryClient = useQueryClient()
  
  return useMutation({
    mutationFn: ({ appointmentId, data }) => api.post(API_ROUTES.APPOINTMENT.REJECT(appointmentId), data),
    onSuccess: (data, variables) => {
      queryClient.invalidateQueries({ queryKey: ['appointments'] })
      queryClient.invalidateQueries({ queryKey: ['appointment', variables.appointmentId] })
      queryClient.invalidateQueries({ queryKey: ['admin', 'appointments'] })
    },
  })
}

// Cancel appointment (patient)
export const useCancelAppointment = () => {
  const queryClient = useQueryClient()
  
  return useMutation({
    mutationFn: ({ appointmentId, data }) => api.post(API_ROUTES.APPOINTMENT.CANCEL(appointmentId), data),
    onSuccess: (data, variables) => {
      queryClient.invalidateQueries({ queryKey: ['appointments'] })
      queryClient.invalidateQueries({ queryKey: ['appointment', variables.appointmentId] })
      queryClient.invalidateQueries({ queryKey: ['admin', 'appointments'] })
      queryClient.invalidateQueries({ queryKey: ['patient', 'appointments'] })
    },
  })
}

// Update appointment status (doctor)
export const useUpdateAppointmentStatus = () => {
  const queryClient = useQueryClient()
  
  return useMutation({
    mutationFn: ({ appointmentId, data }) => api.put(API_ROUTES.APPOINTMENT.UPDATE_STATUS(appointmentId), data),
    onSuccess: (data, variables) => {
      queryClient.invalidateQueries({ queryKey: ['appointments'] })
      queryClient.invalidateQueries({ queryKey: ['appointment', variables.appointmentId] })
      queryClient.invalidateQueries({ queryKey: ['admin', 'appointments'] })
    },
  })
}

