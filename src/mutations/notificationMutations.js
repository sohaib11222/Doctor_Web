/**
 * Notification Mutations
 * All POST/PUT/DELETE requests related to notifications
 */

import { useMutation, useQueryClient } from '@tanstack/react-query'
import { api } from '../utils/api'
import { API_ROUTES } from '../utils/apiConfig'
import * as notificationApi from '../api/notification'

// Admin: Send notification
export const useSendNotification = () => {
  const queryClient = useQueryClient()
  
  return useMutation({
    mutationFn: (data) => api.post(API_ROUTES.NOTIFICATION.SEND, data),
    onSuccess: (data, variables) => {
      if (variables.userId) {
        queryClient.invalidateQueries({ queryKey: ['notifications'] })
      }
    },
  })
}

// Mark notification as read
export const useMarkNotificationAsRead = () => {
  const queryClient = useQueryClient()
  
  return useMutation({
    mutationFn: (notificationId) => notificationApi.markNotificationAsRead(notificationId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['notifications'] })
      queryClient.invalidateQueries({ queryKey: ['notifications', 'unread', 'count'] })
    },
  })
}

// Mark all notifications as read
export const useMarkAllNotificationsAsRead = () => {
  const queryClient = useQueryClient()
  
  return useMutation({
    mutationFn: () => notificationApi.markAllNotificationsAsRead(),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['notifications'] })
      queryClient.invalidateQueries({ queryKey: ['notifications', 'unread', 'count'] })
    },
  })
}

