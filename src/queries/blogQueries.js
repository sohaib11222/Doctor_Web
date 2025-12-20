/**
 * Blog Queries
 * All GET requests related to blog posts
 */

import { useQuery } from '@tanstack/react-query'
import { api } from '../utils/api'
import { API_ROUTES } from '../utils/apiConfig'

// Get all published blog posts (public)
export const useBlogPosts = (params = {}) => {
  return useQuery({
    queryKey: ['blog', 'posts', params],
    queryFn: () => api.get(API_ROUTES.BLOG.LIST, { params }),
  })
}

// Get blog post by ID (public)
export const useBlogPost = (postId) => {
  return useQuery({
    queryKey: ['blog', 'post', postId],
    queryFn: () => api.get(API_ROUTES.BLOG.GET(postId)),
    enabled: !!postId,
  })
}

