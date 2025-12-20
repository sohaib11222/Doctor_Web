/**
 * Review Queries
 * All GET requests related to reviews
 */

import { useQuery } from '@tanstack/react-query'
import { api } from '../utils/api'
import { API_ROUTES } from '../utils/apiConfig'

// Get reviews for a doctor (public)
export const useDoctorReviews = (doctorId, params = {}) => {
  return useQuery({
    queryKey: ['reviews', 'doctor', doctorId, params],
    queryFn: () => api.get(API_ROUTES.REVIEW.BY_DOCTOR(doctorId), { params }),
    enabled: !!doctorId,
  })
}

// Get reviews with query params (public)
export const useReviews = (params = {}) => {
  return useQuery({
    queryKey: ['reviews', params],
    queryFn: () => api.get(API_ROUTES.REVIEW.LIST, { params }),
  })
}

// Admin: Get all reviews
export const useAdminReviews = (params = {}) => {
  return useQuery({
    queryKey: ['admin', 'reviews', params],
    queryFn: () => api.get(API_ROUTES.REVIEW.ADMIN_LIST, { params }),
  })
}

