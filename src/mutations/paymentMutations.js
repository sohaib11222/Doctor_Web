/**
 * Payment Mutations
 * All POST/PUT/DELETE requests related to payments
 */

import { useMutation, useQueryClient } from '@tanstack/react-query'
import { api } from '../utils/api'
import { API_ROUTES } from '../utils/apiConfig'

// Process appointment payment
export const useProcessAppointmentPayment = () => {
  const queryClient = useQueryClient()
  
  return useMutation({
    mutationFn: (data) => api.post(API_ROUTES.PAYMENT.APPOINTMENT, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['transactions'] })
      queryClient.invalidateQueries({ queryKey: ['appointments'] })
      queryClient.invalidateQueries({ queryKey: ['patient', 'transactions'] })
      queryClient.invalidateQueries({ queryKey: ['patient', 'payments'] })
    },
  })
}

// Process product payment
export const useProcessProductPayment = () => {
  const queryClient = useQueryClient()
  
  return useMutation({
    mutationFn: (data) => api.post(API_ROUTES.PAYMENT.PRODUCT, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['transactions'] })
      queryClient.invalidateQueries({ queryKey: ['patient', 'transactions'] })
      queryClient.invalidateQueries({ queryKey: ['patient', 'payments'] })
    },
  })
}

