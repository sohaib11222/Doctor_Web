/**
 * Favorite Mutations
 * All POST/PUT/DELETE requests related to favorites
 */

import { useMutation, useQueryClient } from '@tanstack/react-query'
import { api } from '../utils/api'
import { API_ROUTES } from '../utils/apiConfig'

// Add favorite doctor
export const useAddFavorite = () => {
  const queryClient = useQueryClient()
  
  return useMutation({
    mutationFn: (data) => api.post(API_ROUTES.FAVORITE.ADD, data),
    onSuccess: (data, variables) => {
      if (variables.patientId) {
        queryClient.invalidateQueries({ queryKey: ['favorites', variables.patientId] })
      }
    },
  })
}

// Remove favorite doctor
export const useRemoveFavorite = () => {
  const queryClient = useQueryClient()
  
  return useMutation({
    mutationFn: (favoriteId) => api.delete(API_ROUTES.FAVORITE.DELETE(favoriteId)),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['favorites'] })
    },
  })
}

