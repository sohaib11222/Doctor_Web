/**
 * Chat Queries
 * All GET requests related to chat
 */

import { useQuery } from '@tanstack/react-query'
import { api } from '../utils/api'
import { API_ROUTES } from '../utils/apiConfig'

// Get all conversations
export const useConversations = () => {
  return useQuery({
    queryKey: ['chat', 'conversations'],
    queryFn: () => api.get(API_ROUTES.CHAT.CONVERSATIONS),
  })
}

// Get unread message count
export const useUnreadMessageCount = () => {
  return useQuery({
    queryKey: ['chat', 'unread-count'],
    queryFn: () => api.get(API_ROUTES.CHAT.UNREAD_COUNT),
    refetchInterval: 30000, // Refetch every 30 seconds
  })
}

// Get messages for a conversation
export const useMessages = (conversationId, params = {}) => {
  return useQuery({
    queryKey: ['chat', 'messages', conversationId, params],
    queryFn: () => api.get(API_ROUTES.CHAT.MESSAGES(conversationId), { params }),
    enabled: !!conversationId,
    refetchInterval: 5000, // Refetch every 5 seconds for real-time chat
  })
}

