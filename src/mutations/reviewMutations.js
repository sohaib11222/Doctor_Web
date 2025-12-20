/**
 * Review Mutations
 * All POST/PUT/DELETE requests related to reviews
 */

import { useMutation, useQueryClient } from '@tanstack/react-query'
import { api } from '../utils/api'
import { API_ROUTES } from '../utils/apiConfig'

// Create review (patient only)
export const useCreateReview = () => {
  const queryClient = useQueryClient()
  
  return useMutation({
    mutationFn: (data) => api.post(API_ROUTES.REVIEW.CREATE, data),
    onSuccess: (data, variables) => {
      queryClient.invalidateQueries({ queryKey: ['reviews'] })
      if (variables.doctorId) {
        queryClient.invalidateQueries({ queryKey: ['reviews', 'doctor', variables.doctorId] })
      }
      queryClient.invalidateQueries({ queryKey: ['doctor', 'reviews'] })
      queryClient.invalidateQueries({ queryKey: ['admin', 'reviews'] })
    },
  })
}

// Delete review
export const useDeleteReview = () => {
  const queryClient = useQueryClient()
  
  return useMutation({
    mutationFn: (id) => api.delete(API_ROUTES.REVIEW.DELETE(id)),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['reviews'] })
      queryClient.invalidateQueries({ queryKey: ['admin', 'reviews'] })
    },
  })
}

