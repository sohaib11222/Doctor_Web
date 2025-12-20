/**
 * Chat Mutations
 * All POST/PUT/DELETE requests related to chat
 */

import { useMutation, useQueryClient } from '@tanstack/react-query'
import { api } from '../utils/api'
import { API_ROUTES } from '../utils/apiConfig'

// Create conversation
export const useCreateConversation = () => {
  const queryClient = useQueryClient()
  
  return useMutation({
    mutationFn: (data) => api.post(API_ROUTES.CHAT.CREATE_CONVERSATION, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['chat', 'conversations'] })
    },
  })
}

// Send message
export const useSendMessage = () => {
  const queryClient = useQueryClient()
  
  return useMutation({
    mutationFn: (data) => api.post(API_ROUTES.CHAT.SEND_MESSAGE, data),
    onSuccess: (data, variables) => {
      // Invalidate messages for the conversation
      queryClient.invalidateQueries({ queryKey: ['chat', 'messages'] })
      queryClient.invalidateQueries({ queryKey: ['chat', 'conversations'] })
      queryClient.invalidateQueries({ queryKey: ['chat', 'unread-count'] })
    },
  })
}

// Mark messages as read
export const useMarkMessagesAsRead = () => {
  const queryClient = useQueryClient()
  
  return useMutation({
    mutationFn: (conversationId) => api.put(API_ROUTES.CHAT.MARK_READ(conversationId)),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['chat', 'messages'] })
      queryClient.invalidateQueries({ queryKey: ['chat', 'unread-count'] })
      queryClient.invalidateQueries({ queryKey: ['chat', 'conversations'] })
    },
  })
}

