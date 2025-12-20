/**
 * Transaction Queries
 * All GET requests related to transactions
 */

import { useQuery } from '@tanstack/react-query'
import { api } from '../utils/api'
import { API_ROUTES } from '../utils/apiConfig'

// Get all transactions
export const useTransactions = (params = {}) => {
  return useQuery({
    queryKey: ['transactions', params],
    queryFn: () => api.get(API_ROUTES.TRANSACTION.LIST, { params }),
  })
}

// Get transaction by ID
export const useTransaction = (transactionId) => {
  return useQuery({
    queryKey: ['transaction', transactionId],
    queryFn: () => api.get(API_ROUTES.TRANSACTION.GET(transactionId)),
    enabled: !!transactionId,
  })
}

// Get transaction by ID (payment route)
export const usePaymentTransaction = (transactionId) => {
  return useQuery({
    queryKey: ['payment', 'transaction', transactionId],
    queryFn: () => api.get(API_ROUTES.TRANSACTION.PAYMENT_TRANSACTION(transactionId)),
    enabled: !!transactionId,
  })
}

// Admin: Get all transactions
export const useAdminTransactions = (params = {}) => {
  return useQuery({
    queryKey: ['admin', 'transactions', params],
    queryFn: () => api.get(API_ROUTES.TRANSACTION.ADMIN_LIST, { params }),
  })
}

// Get patient's transactions
export const usePatientTransactions = (params = {}) => {
  return useQuery({
    queryKey: ['patient', 'transactions', params],
    queryFn: () => api.get(API_ROUTES.PAYMENT.TRANSACTIONS, { params }),
  })
}

