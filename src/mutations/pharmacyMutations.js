/**
 * Pharmacy Mutations
 * All POST/PUT/DELETE requests related to pharmacies
 */

import { useMutation, useQueryClient } from '@tanstack/react-query'
import { api } from '../utils/api'
import { API_ROUTES } from '../utils/apiConfig'

// Create pharmacy (admin only)
export const useCreatePharmacy = () => {
  const queryClient = useQueryClient()
  
  return useMutation({
    mutationFn: (data) => api.post(API_ROUTES.PHARMACY.CREATE, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['pharmacies'] })
      queryClient.invalidateQueries({ queryKey: ['admin', 'pharmacies'] })
    },
  })
}

// Update pharmacy (admin only)
export const useUpdatePharmacy = () => {
  const queryClient = useQueryClient()
  
  return useMutation({
    mutationFn: ({ id, data }) => api.put(API_ROUTES.PHARMACY.UPDATE(id), data),
    onSuccess: (data, variables) => {
      queryClient.invalidateQueries({ queryKey: ['pharmacies'] })
      queryClient.invalidateQueries({ queryKey: ['pharmacy', variables.id] })
      queryClient.invalidateQueries({ queryKey: ['admin', 'pharmacies'] })
    },
  })
}

// Delete pharmacy (admin only)
export const useDeletePharmacy = () => {
  const queryClient = useQueryClient()
  
  return useMutation({
    mutationFn: (id) => api.delete(API_ROUTES.PHARMACY.DELETE(id)),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['pharmacies'] })
      queryClient.invalidateQueries({ queryKey: ['admin', 'pharmacies'] })
    },
  })
}

