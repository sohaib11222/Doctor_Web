/**
 * Doctor Queries
 * All GET requests related to doctors
 */

import { useQuery } from '@tanstack/react-query'
import { api } from '../utils/api'
import { API_ROUTES } from '../utils/apiConfig'

// Get all approved doctors (public)
export const useDoctors = (params = {}) => {
  return useQuery({
    queryKey: ['doctors', params],
    queryFn: () => api.get(API_ROUTES.DOCTOR.LIST, { params }),
  })
}

// Get doctor profile by ID (public)
export const useDoctorProfile = (doctorId) => {
  return useQuery({
    queryKey: ['doctor', 'profile', doctorId],
    queryFn: () => api.get(API_ROUTES.DOCTOR.PROFILE(doctorId)),
    enabled: !!doctorId,
  })
}

// Get doctor dashboard
export const useDoctorDashboard = () => {
  return useQuery({
    queryKey: ['doctor', 'dashboard'],
    queryFn: () => api.get(API_ROUTES.DOCTOR.DASHBOARD),
  })
}

// Get doctor reviews
export const useDoctorReviews = (params = {}) => {
  return useQuery({
    queryKey: ['doctor', 'reviews', params],
    queryFn: () => api.get(API_ROUTES.DOCTOR.REVIEWS, { params }),
  })
}

// Get doctor's current subscription
export const useDoctorSubscription = () => {
  return useQuery({
    queryKey: ['doctor', 'subscription'],
    queryFn: () => api.get(API_ROUTES.DOCTOR.MY_SUBSCRIPTION),
  })
}

// Admin: Get all doctors
export const useAdminDoctors = (params = {}) => {
  return useQuery({
    queryKey: ['admin', 'doctors', params],
    queryFn: () => api.get(API_ROUTES.DOCTOR.ADMIN_LIST, { params }),
  })
}

// Admin: Get doctors for chat
export const useAdminDoctorsForChat = (params = {}) => {
  return useQuery({
    queryKey: ['admin', 'doctors', 'chat', params],
    queryFn: () => api.get(API_ROUTES.DOCTOR.ADMIN_CHAT_LIST, { params }),
  })
}

