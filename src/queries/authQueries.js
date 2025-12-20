/**
 * Auth Queries
 * All GET requests related to authentication
 */

import { useQuery } from '@tanstack/react-query'
import { api } from '../utils/api'
import { API_ROUTES } from '../utils/apiConfig'

// Get health check status
export const useHealthCheck = () => {
  return useQuery({
    queryKey: ['health'],
    queryFn: () => api.get(API_ROUTES.HEALTH),
    refetchOnWindowFocus: false,
  })
}

