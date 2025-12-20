/**
 * Announcement Mutations
 * All POST/PUT/DELETE requests related to announcements
 */

import { useMutation, useQueryClient } from '@tanstack/react-query'
import { api } from '../utils/api'
import { API_ROUTES } from '../utils/apiConfig'

// Admin: Create announcement
export const useCreateAnnouncement = () => {
  const queryClient = useQueryClient()
  
  return useMutation({
    mutationFn: (data) => api.post(API_ROUTES.ANNOUNCEMENT.CREATE, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['announcements'] })
      queryClient.invalidateQueries({ queryKey: ['doctor', 'announcements'] })
      queryClient.invalidateQueries({ queryKey: ['announcements', 'unread-count'] })
    },
  })
}

// Admin: Update announcement
export const useUpdateAnnouncement = () => {
  const queryClient = useQueryClient()
  
  return useMutation({
    mutationFn: ({ id, data }) => api.put(API_ROUTES.ANNOUNCEMENT.UPDATE(id), data),
    onSuccess: (data, variables) => {
      queryClient.invalidateQueries({ queryKey: ['announcements'] })
      queryClient.invalidateQueries({ queryKey: ['announcement', variables.id] })
      queryClient.invalidateQueries({ queryKey: ['doctor', 'announcements'] })
    },
  })
}

// Admin: Delete announcement
export const useDeleteAnnouncement = () => {
  const queryClient = useQueryClient()
  
  return useMutation({
    mutationFn: (id) => api.delete(API_ROUTES.ANNOUNCEMENT.DELETE(id)),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['announcements'] })
      queryClient.invalidateQueries({ queryKey: ['doctor', 'announcements'] })
    },
  })
}

// Mark announcement as read
export const useMarkAnnouncementAsRead = () => {
  const queryClient = useQueryClient()
  
  return useMutation({
    mutationFn: (announcementId) => api.post(API_ROUTES.ANNOUNCEMENT.MARK_READ(announcementId)),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['announcements'] })
      queryClient.invalidateQueries({ queryKey: ['doctor', 'announcements'] })
      queryClient.invalidateQueries({ queryKey: ['announcements', 'unread-count'] })
    },
  })
}

