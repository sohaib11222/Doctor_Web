/**
 * Transaction Mutations
 * All POST/PUT/DELETE requests related to transactions
 */

import { useMutation, useQueryClient } from '@tanstack/react-query'
import { api } from '../utils/api'
import { API_ROUTES } from '../utils/apiConfig'

// Create transaction
export const useCreateTransaction = () => {
  const queryClient = useQueryClient()
  
  return useMutation({
    mutationFn: (data) => api.post(API_ROUTES.TRANSACTION.CREATE, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['transactions'] })
      queryClient.invalidateQueries({ queryKey: ['admin', 'transactions'] })
      queryClient.invalidateQueries({ queryKey: ['patient', 'transactions'] })
    },
  })
}

// Admin: Update transaction status
export const useUpdateTransactionStatus = () => {
  const queryClient = useQueryClient()
  
  return useMutation({
    mutationFn: ({ id, data }) => api.put(API_ROUTES.TRANSACTION.UPDATE(id), data),
    onSuccess: (data, variables) => {
      queryClient.invalidateQueries({ queryKey: ['transactions'] })
      queryClient.invalidateQueries({ queryKey: ['transaction', variables.id] })
      queryClient.invalidateQueries({ queryKey: ['admin', 'transactions'] })
      queryClient.invalidateQueries({ queryKey: ['patient', 'transactions'] })
    },
  })
}

// Admin: Refund transaction
export const useRefundTransaction = () => {
  const queryClient = useQueryClient()
  
  return useMutation({
    mutationFn: (transactionId) => api.post(API_ROUTES.PAYMENT.REFUND(transactionId)),
    onSuccess: (data, transactionId) => {
      queryClient.invalidateQueries({ queryKey: ['transactions'] })
      queryClient.invalidateQueries({ queryKey: ['transaction', transactionId] })
      queryClient.invalidateQueries({ queryKey: ['admin', 'transactions'] })
      queryClient.invalidateQueries({ queryKey: ['patient', 'transactions'] })
    },
  })
}

