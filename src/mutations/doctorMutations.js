/**
 * Doctor Mutations
 * All POST/PUT/DELETE requests related to doctors
 */

import { useMutation, useQueryClient } from '@tanstack/react-query'
import { api } from '../utils/api'
import { API_ROUTES } from '../utils/apiConfig'

// Update doctor profile
export const useUpdateDoctorProfile = () => {
  const queryClient = useQueryClient()
  
  return useMutation({
    mutationFn: (data) => api.put(API_ROUTES.DOCTOR.UPDATE_PROFILE, data),
    onSuccess: (data, variables) => {
      queryClient.invalidateQueries({ queryKey: ['doctor', 'profile'] })
      if (variables.id) {
        queryClient.invalidateQueries({ queryKey: ['doctor', 'profile', variables.id] })
      }
    },
  })
}

// Buy subscription plan
export const useBuySubscription = () => {
  const queryClient = useQueryClient()
  
  return useMutation({
    mutationFn: (data) => api.post(API_ROUTES.DOCTOR.BUY_SUBSCRIPTION, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['doctor', 'subscription'] })
    },
  })
}

