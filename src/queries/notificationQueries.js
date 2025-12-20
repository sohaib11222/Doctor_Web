/**
 * Notification Queries
 * All GET requests related to notifications
 */

import { useQuery } from '@tanstack/react-query'
import { api } from '../utils/api'
import { API_ROUTES } from '../utils/apiConfig'

// Get notifications for a user
export const useNotifications = (userId, params = {}) => {
  return useQuery({
    queryKey: ['notifications', userId, params],
    queryFn: () => api.get(API_ROUTES.NOTIFICATION.GET(userId), { params }),
    enabled: !!userId,
    refetchInterval: 30000, // Refetch every 30 seconds
  })
}

