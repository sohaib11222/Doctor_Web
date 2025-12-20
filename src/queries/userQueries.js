/**
 * User Queries
 * All GET requests related to users
 */

import { useQuery } from '@tanstack/react-query'
import { api } from '../utils/api'
import { API_ROUTES } from '../utils/apiConfig'

// Get all users with filtering
export const useUsers = (params = {}) => {
  return useQuery({
    queryKey: ['users', params],
    queryFn: () => api.get(API_ROUTES.USER.LIST, { params }),
  })
}

// Get user by ID
export const useUser = (userId) => {
  return useQuery({
    queryKey: ['user', userId],
    queryFn: () => api.get(API_ROUTES.USER.GET(userId)),
    enabled: !!userId,
  })
}

