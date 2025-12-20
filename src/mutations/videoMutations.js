/**
 * Video Mutations
 * All POST/PUT/DELETE requests related to video sessions
 */

import { useMutation, useQueryClient } from '@tanstack/react-query'
import { api } from '../utils/api'
import { API_ROUTES } from '../utils/apiConfig'

// Start video session
export const useStartVideoSession = () => {
  const queryClient = useQueryClient()
  
  return useMutation({
    mutationFn: (data) => api.post(API_ROUTES.VIDEO.START, data),
    onSuccess: (data, variables) => {
      if (variables.appointmentId) {
        queryClient.invalidateQueries({ queryKey: ['video', 'session', variables.appointmentId] })
      }
      queryClient.invalidateQueries({ queryKey: ['appointments'] })
    },
  })
}

// End video session
export const useEndVideoSession = () => {
  const queryClient = useQueryClient()
  
  return useMutation({
    mutationFn: (data) => api.post(API_ROUTES.VIDEO.END, data),
    onSuccess: (data, variables) => {
      if (variables.appointmentId) {
        queryClient.invalidateQueries({ queryKey: ['video', 'session', variables.appointmentId] })
      }
      queryClient.invalidateQueries({ queryKey: ['appointments'] })
    },
  })
}

