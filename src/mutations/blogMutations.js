/**
 * Blog Mutations
 * All POST/PUT/DELETE requests related to blog posts
 */

import { useMutation, useQueryClient } from '@tanstack/react-query'
import { api } from '../utils/api'
import { API_ROUTES } from '../utils/apiConfig'

// Create blog post (admin or doctor)
export const useCreateBlogPost = () => {
  const queryClient = useQueryClient()
  
  return useMutation({
    mutationFn: (data) => api.post(API_ROUTES.BLOG.CREATE, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['blog', 'posts'] })
    },
  })
}

// Update blog post
export const useUpdateBlogPost = () => {
  const queryClient = useQueryClient()
  
  return useMutation({
    mutationFn: ({ id, data }) => api.put(API_ROUTES.BLOG.UPDATE(id), data),
    onSuccess: (data, variables) => {
      queryClient.invalidateQueries({ queryKey: ['blog', 'posts'] })
      queryClient.invalidateQueries({ queryKey: ['blog', 'post', variables.id] })
    },
  })
}

// Delete blog post
export const useDeleteBlogPost = () => {
  const queryClient = useQueryClient()
  
  return useMutation({
    mutationFn: (id) => api.delete(API_ROUTES.BLOG.DELETE(id)),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['blog', 'posts'] })
    },
  })
}

