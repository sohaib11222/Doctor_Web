/**
 * Specialization Mutations
 * All POST/PUT/DELETE requests related to specializations
 */

import { useMutation, useQueryClient } from '@tanstack/react-query'
import { api } from '../utils/api'
import { API_ROUTES } from '../utils/apiConfig'

// Create specialization (admin only)
export const useCreateSpecialization = () => {
  const queryClient = useQueryClient()
  
  return useMutation({
    mutationFn: (data) => api.post(API_ROUTES.SPECIALIZATION.CREATE, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['specializations'] })
      queryClient.invalidateQueries({ queryKey: ['admin', 'specializations'] })
    },
  })
}

// Update specialization (admin only)
export const useUpdateSpecialization = () => {
  const queryClient = useQueryClient()
  
  return useMutation({
    mutationFn: ({ id, data }) => api.put(API_ROUTES.SPECIALIZATION.UPDATE(id), data),
    onSuccess: (data, variables) => {
      queryClient.invalidateQueries({ queryKey: ['specializations'] })
      queryClient.invalidateQueries({ queryKey: ['admin', 'specializations'] })
      queryClient.invalidateQueries({ queryKey: ['specialization', variables.id] })
    },
  })
}

// Delete specialization (admin only)
export const useDeleteSpecialization = () => {
  const queryClient = useQueryClient()
  
  return useMutation({
    mutationFn: (id) => api.delete(API_ROUTES.SPECIALIZATION.DELETE(id)),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['specializations'] })
      queryClient.invalidateQueries({ queryKey: ['admin', 'specializations'] })
    },
  })
}

