/**
 * Product Queries
 * All GET requests related to products
 */

import { useQuery } from '@tanstack/react-query'
import { api } from '../utils/api'
import { API_ROUTES } from '../utils/apiConfig'

// Get all products (public)
export const useProducts = (params = {}) => {
  return useQuery({
    queryKey: ['products', params],
    queryFn: () => api.get(API_ROUTES.PRODUCT.LIST, { params }),
  })
}

// Get product by ID (public)
export const useProduct = (productId) => {
  return useQuery({
    queryKey: ['product', productId],
    queryFn: () => api.get(API_ROUTES.PRODUCT.GET(productId)),
    enabled: !!productId,
  })
}

// Admin: Get all products
export const useAdminProducts = (params = {}) => {
  return useQuery({
    queryKey: ['admin', 'products', params],
    queryFn: () => api.get(API_ROUTES.PRODUCT.ADMIN_LIST, { params }),
  })
}

