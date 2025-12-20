/**
 * User Mutations
 * All POST/PUT/DELETE requests related to users
 */

import { useMutation, useQueryClient } from '@tanstack/react-query'
import { api } from '../utils/api'
import { API_ROUTES } from '../utils/apiConfig'

// Update user profile
export const useUpdateUserProfile = () => {
  const queryClient = useQueryClient()
  
  return useMutation({
    mutationFn: (data) => api.put(API_ROUTES.USER.UPDATE_PROFILE, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['user'] })
      queryClient.invalidateQueries({ queryKey: ['users'] })
    },
  })
}

// Admin: Update user status
export const useUpdateUserStatus = () => {
  const queryClient = useQueryClient()
  
  return useMutation({
    mutationFn: ({ id, data }) => api.put(API_ROUTES.USER.UPDATE_STATUS(id), data),
    onSuccess: (data, variables) => {
      queryClient.invalidateQueries({ queryKey: ['users'] })
      queryClient.invalidateQueries({ queryKey: ['user', variables.id] })
      queryClient.invalidateQueries({ queryKey: ['admin', 'doctors'] })
      queryClient.invalidateQueries({ queryKey: ['admin', 'patients'] })
    },
  })
}

// Admin: Delete user
export const useDeleteUser = () => {
  const queryClient = useQueryClient()
  
  return useMutation({
    mutationFn: (id) => api.delete(API_ROUTES.USER.ADMIN_DELETE(id)),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['users'] })
      queryClient.invalidateQueries({ queryKey: ['admin', 'doctors'] })
      queryClient.invalidateQueries({ queryKey: ['admin', 'patients'] })
    },
  })
}

