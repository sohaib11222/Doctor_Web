/**
 * Product Mutations
 * All POST/PUT/DELETE requests related to products
 */

import { useMutation, useQueryClient } from '@tanstack/react-query'
import { api } from '../utils/api'
import { API_ROUTES } from '../utils/apiConfig'

// Create product (doctor or admin)
export const useCreateProduct = () => {
  const queryClient = useQueryClient()
  
  return useMutation({
    mutationFn: (data) => api.post(API_ROUTES.PRODUCT.CREATE, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['products'] })
      queryClient.invalidateQueries({ queryKey: ['admin', 'products'] })
    },
  })
}

// Update product
export const useUpdateProduct = () => {
  const queryClient = useQueryClient()
  
  return useMutation({
    mutationFn: ({ id, data }) => api.put(API_ROUTES.PRODUCT.UPDATE(id), data),
    onSuccess: (data, variables) => {
      queryClient.invalidateQueries({ queryKey: ['products'] })
      queryClient.invalidateQueries({ queryKey: ['product', variables.id] })
      queryClient.invalidateQueries({ queryKey: ['admin', 'products'] })
    },
  })
}

// Delete product
export const useDeleteProduct = () => {
  const queryClient = useQueryClient()
  
  return useMutation({
    mutationFn: (id) => api.delete(API_ROUTES.PRODUCT.DELETE(id)),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['products'] })
      queryClient.invalidateQueries({ queryKey: ['admin', 'products'] })
    },
  })
}

