/**
 * Notification Mutations
 * All POST/PUT/DELETE requests related to notifications
 */

import { useMutation, useQueryClient } from '@tanstack/react-query'
import { api } from '../utils/api'
import { API_ROUTES } from '../utils/apiConfig'

// Admin: Send notification
export const useSendNotification = () => {
  const queryClient = useQueryClient()
  
  return useMutation({
    mutationFn: (data) => api.post(API_ROUTES.NOTIFICATION.SEND, data),
    onSuccess: (data, variables) => {
      if (variables.userId) {
        queryClient.invalidateQueries({ queryKey: ['notifications', variables.userId] })
      }
    },
  })
}

// Mark notification as read
export const useMarkNotificationAsRead = () => {
  const queryClient = useQueryClient()
  
  return useMutation({
    mutationFn: (notificationId) => api.put(API_ROUTES.NOTIFICATION.MARK_READ(notificationId)),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['notifications'] })
    },
  })
}

