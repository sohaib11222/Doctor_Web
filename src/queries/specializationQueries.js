/**
 * Specialization Queries
 * All GET requests related to specializations
 */

import { useQuery } from '@tanstack/react-query'
import { api } from '../utils/api'
import { API_ROUTES } from '../utils/apiConfig'

// Get all specializations (public)
export const useSpecializations = (params = {}) => {
  return useQuery({
    queryKey: ['specializations', params],
    queryFn: () => api.get(API_ROUTES.SPECIALIZATION.LIST, { params }),
  })
}

// Admin: Get all specializations
export const useAdminSpecializations = (params = {}) => {
  return useQuery({
    queryKey: ['admin', 'specializations', params],
    queryFn: () => api.get(API_ROUTES.SPECIALIZATION.ADMIN_LIST, { params }),
  })
}

