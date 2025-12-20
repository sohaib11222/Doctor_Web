/**
 * Announcement Queries
 * All GET requests related to announcements
 */

import { useQuery } from '@tanstack/react-query'
import { api } from '../utils/api'
import { API_ROUTES } from '../utils/apiConfig'

// Admin: Get all announcements
export const useAnnouncements = (params = {}) => {
  return useQuery({
    queryKey: ['announcements', params],
    queryFn: () => api.get(API_ROUTES.ANNOUNCEMENT.LIST, { params }),
  })
}

// Get announcement by ID
export const useAnnouncement = (announcementId) => {
  return useQuery({
    queryKey: ['announcement', announcementId],
    queryFn: () => api.get(API_ROUTES.ANNOUNCEMENT.GET(announcementId)),
    enabled: !!announcementId,
  })
}

// Get announcement read status (admin)
export const useAnnouncementReadStatus = (announcementId) => {
  return useQuery({
    queryKey: ['announcement', 'read-status', announcementId],
    queryFn: () => api.get(API_ROUTES.ANNOUNCEMENT.READ_STATUS(announcementId)),
    enabled: !!announcementId,
  })
}

// Doctor: Get announcements for doctor
export const useDoctorAnnouncements = () => {
  return useQuery({
    queryKey: ['doctor', 'announcements'],
    queryFn: () => api.get(API_ROUTES.ANNOUNCEMENT.DOCTOR_LIST),
  })
}

// Get unread announcement count
export const useUnreadAnnouncementCount = () => {
  return useQuery({
    queryKey: ['announcements', 'unread-count'],
    queryFn: () => api.get(API_ROUTES.ANNOUNCEMENT.UNREAD_COUNT),
    refetchInterval: 30000, // Refetch every 30 seconds
  })
}

