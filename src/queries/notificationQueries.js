/**
 * Notification Queries
 * All GET requests related to notifications
 */

import { useQuery } from '@tanstack/react-query'
import * as notificationApi from '../api/notification'

// Get notifications for current user (from token)
export const useNotifications = (params = {}) => {
  return useQuery({
    queryKey: ['notifications', params],
    queryFn: () => notificationApi.getNotifications(params),
    refetchInterval: 30000, // Refetch every 30 seconds
  })
}

// Get unread notifications count
export const useUnreadNotificationsCount = () => {
  return useQuery({
    queryKey: ['notifications', 'unread', 'count'],
    queryFn: async () => {
      const response = await notificationApi.getNotifications({ isRead: false, limit: 1 })
      const notifications = response.data?.notifications || response.notifications || []
      const total = response.data?.pagination?.total || response.pagination?.total || notifications.length
      return total
    },
    refetchInterval: 30000, // Refetch every 30 seconds
  })
}

