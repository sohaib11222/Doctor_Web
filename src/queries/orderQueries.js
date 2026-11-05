import { useQuery } from '@tanstack/react-query'
import * as orderApi from '../api/order'
import { API_ROUTES } from '../utils/apiConfig'
import { useLanguage } from '../contexts/LanguageContext'

/**
 * Get patient orders
 * @param {Object} params - Query parameters
 * @returns {Query} React Query hook
 */
export const usePatientOrders = (params = {}) => {
  const { language } = useLanguage()
  return useQuery({
    queryKey: ['patientOrders', params, language],
    queryFn: () => orderApi.getPatientOrders(params),
  })
}

/**
 * Get pharmacy orders (for doctors)
 * @param {Object} params - Query parameters
 * @returns {Query} React Query hook
 */
export const usePharmacyOrders = (params = {}) => {
  const { language } = useLanguage()
  return useQuery({
    queryKey: ['pharmacyOrders', params, language],
    queryFn: () => orderApi.getPharmacyOrders(params),
  })
}

/**
 * Get all orders (for admin)
 * @param {Object} params - Query parameters
 * @returns {Query} React Query hook
 */
export const useAllOrders = (params = {}) => {
  return useQuery({
    queryKey: ['allOrders', params],
    queryFn: () => orderApi.getAllOrders(params),
  })
}

/**
 * Get order by ID
 * @param {string} orderId - Order ID
 * @returns {Query} React Query hook
 */
export const useOrder = (orderId) => {
  const { language } = useLanguage()
  return useQuery({
    queryKey: ['order', orderId, language],
    queryFn: () => orderApi.getOrderById(orderId),
    enabled: !!orderId,
  })
}

/** A role-scoped, server-derived sidebar count for new order activity. */
export const useUnreadOrderCount = (enabled = true) => {
  return useQuery({
    queryKey: ['orders', 'unread-count'],
    queryFn: async () => {
      const response = await orderApi.getUnreadCount()
      return response?.data?.unreadCount ?? response?.unreadCount ?? 0
    },
    enabled,
    refetchInterval: 10000,
    refetchOnWindowFocus: true,
  })
}

