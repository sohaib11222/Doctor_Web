/**
 * Availability Queries
 * All GET requests related to availability
 */

import { useQuery } from '@tanstack/react-query'
import { api } from '../utils/api'
import { API_ROUTES } from '../utils/apiConfig'

// Get doctor availability
export const useAvailability = (params = {}) => {
  return useQuery({
    queryKey: ['availability', params],
    queryFn: () => api.get(API_ROUTES.AVAILABILITY.GET, { params }),
    enabled: !!params.fromDate && !!params.toDate,
  })
}

// Get available time slots for a doctor (public)
export const useAvailableSlots = (params = {}) => {
  return useQuery({
    queryKey: ['availability', 'slots', params],
    queryFn: () => api.get(API_ROUTES.AVAILABILITY.SLOTS, { params }),
    enabled: !!params.doctorId && !!params.date,
  })
}

// Check if a time slot is available (public)
export const useCheckSlotAvailability = (params = {}) => {
  return useQuery({
    queryKey: ['availability', 'check', params],
    queryFn: () => api.get(API_ROUTES.AVAILABILITY.CHECK, { params }),
    enabled: !!params.doctorId && !!params.date && !!params.timeSlot,
  })
}

