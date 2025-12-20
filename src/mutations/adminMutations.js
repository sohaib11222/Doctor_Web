/**
 * Admin Mutations
 * All POST/PUT/DELETE requests related to admin panel
 */

import { useMutation, useQueryClient } from '@tanstack/react-query'
import { api } from '../utils/api'
import { API_ROUTES } from '../utils/apiConfig'

// Update admin profile
export const useUpdateAdminProfile = () => {
  const queryClient = useQueryClient()
  
  return useMutation({
    mutationFn: (data) => api.put(API_ROUTES.ADMIN.UPDATE_PROFILE, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin', 'profile'] })
    },
  })
}

