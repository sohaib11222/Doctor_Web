/**
 * Notification Queries
 * All GET requests related to notifications
 */

import { useQuery } from '@tanstack/react-query'
import * as notificationApi from '../api/notification'
import { useLanguage } from '../contexts/LanguageContext'

// Get notifications for current user (from token)
export const useNotifications = (params = {}, options = {}) => {
  const { language } = useLanguage()
  return useQuery({
    ...options,
    // Notification title/body can be localized by the API from the
    // Accept-Language header, so the selected language must be part of the
    // cache key rather than showing a stale response after a toggle.
    queryKey: ['notifications', language, params],
    queryFn: () => notificationApi.getNotifications(params),
    refetchInterval: options.refetchInterval ?? 10000,
    refetchOnWindowFocus: options.refetchOnWindowFocus ?? true,
  })
}

// Get unread notifications count
export const useUnreadNotificationsCount = () => {
  const { language } = useLanguage()
  return useQuery({
    queryKey: ['notifications', language, 'unread', 'count'],
    queryFn: async () => {
      const response = await notificationApi.getNotifications({ isRead: false, limit: 1 })
      const notifications = response.data?.notifications || response.notifications || []
      const total = response.data?.pagination?.total || response.pagination?.total || notifications.length
      return total
    },
    refetchInterval: 10000,
    refetchOnWindowFocus: true,
  })
}

