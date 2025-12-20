/**
 * Auth Mutations
 * All POST/PUT/DELETE requests related to authentication
 */

import { useMutation, useQueryClient } from '@tanstack/react-query'
import { api } from '../utils/api'
import { API_ROUTES } from '../utils/apiConfig'

// Register user (doctor or patient)
export const useRegister = () => {
  const queryClient = useQueryClient()
  
  return useMutation({
    mutationFn: (data) => api.post(API_ROUTES.AUTH.REGISTER, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['users'] })
    },
  })
}

// Login user
export const useLogin = () => {
  const queryClient = useQueryClient()
  
  return useMutation({
    mutationFn: (data) => api.post(API_ROUTES.AUTH.LOGIN, data),
    onSuccess: (data) => {
      // Store tokens if provided
      if (data.token) {
        localStorage.setItem('token', data.token)
      }
      if (data.refreshToken) {
        localStorage.setItem('refreshToken', data.refreshToken)
      }
      queryClient.invalidateQueries({ queryKey: ['user'] })
    },
  })
}

// Refresh token
export const useRefreshToken = () => {
  return useMutation({
    mutationFn: (data) => api.post(API_ROUTES.AUTH.REFRESH_TOKEN, data),
    onSuccess: (data) => {
      if (data.token) {
        localStorage.setItem('token', data.token)
      }
    },
  })
}

// Change password
export const useChangePassword = () => {
  return useMutation({
    mutationFn: (data) => api.post(API_ROUTES.AUTH.CHANGE_PASSWORD, data),
  })
}

// Admin: Approve doctor
export const useApproveDoctor = () => {
  const queryClient = useQueryClient()
  
  return useMutation({
    mutationFn: (data) => api.post(API_ROUTES.AUTH.APPROVE_DOCTOR, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['doctors'] })
      queryClient.invalidateQueries({ queryKey: ['admin', 'doctors'] })
    },
  })
}

