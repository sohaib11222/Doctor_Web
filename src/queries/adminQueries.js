import { useQuery } from '@tanstack/react-query'
import * as adminApi from '../api/admin'

/**
 * Get admin dashboard statistics
 */
export const useAdminDashboard = () => {
  return useQuery({
    queryKey: ['adminDashboard'],
    queryFn: () => adminApi.getDashboardStats()
  })
}

/**
 * List all doctors (admin only - shows all statuses)
 */
export const useAdminDoctors = (params = {}) => {
  return useQuery({
    queryKey: ['adminDoctors', params],
    queryFn: () => adminApi.listAllDoctors(params)
  })
}

/**
 * List all users (admin only)
 */
export const useAdminUsers = (params = {}) => {
  return useQuery({
    queryKey: ['adminUsers', params],
    queryFn: () => adminApi.listAllUsers(params)
  })
}
