/**
 * Admin Queries
 * All GET requests related to admin panel
 */

import { useQuery } from '@tanstack/react-query'
import { api } from '../utils/api'
import { API_ROUTES } from '../utils/apiConfig'

// Get admin dashboard stats
export const useAdminDashboard = () => {
  return useQuery({
    queryKey: ['admin', 'dashboard'],
    queryFn: () => api.get(API_ROUTES.ADMIN.DASHBOARD),
  })
}

// Get all patients (admin)
export const useAdminPatients = (params = {}) => {
  return useQuery({
    queryKey: ['admin', 'patients', params],
    queryFn: () => api.get(API_ROUTES.ADMIN.PATIENTS, { params }),
  })
}

// Get system activity logs
export const useAdminActivity = (params = {}) => {
  return useQuery({
    queryKey: ['admin', 'activity', params],
    queryFn: () => api.get(API_ROUTES.ADMIN.ACTIVITY, { params }),
  })
}

