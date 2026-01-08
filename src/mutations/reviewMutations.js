/**
 * Review Mutations
 * All POST/PUT/DELETE requests related to reviews
 */

import { useMutation, useQueryClient } from '@tanstack/react-query'
import * as reviewApi from '../api/review'

// Create review (patient only)
export const useCreateReview = () => {
  const queryClient = useQueryClient()
  
  return useMutation({
    mutationFn: (data) => reviewApi.createReview(data),
    onSuccess: (data, variables) => {
      queryClient.invalidateQueries({ queryKey: ['reviews'] })
      if (variables.doctorId) {
        queryClient.invalidateQueries({ queryKey: ['reviews', 'doctor', variables.doctorId] })
      }
      queryClient.invalidateQueries({ queryKey: ['doctor', 'reviews'] })
      queryClient.invalidateQueries({ queryKey: ['admin', 'reviews'] })
      // Invalidate appointment queries if review is for an appointment
      if (variables.appointmentId) {
        queryClient.invalidateQueries({ queryKey: ['appointment', variables.appointmentId] })
        queryClient.invalidateQueries({ queryKey: ['patientAppointments'] })
      }
    },
  })
}

// Delete review
export const useDeleteReview = () => {
  const queryClient = useQueryClient()
  
  return useMutation({
    mutationFn: (id) => reviewApi.deleteReview(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['reviews'] })
      queryClient.invalidateQueries({ queryKey: ['admin', 'reviews'] })
    },
  })
}

