import { useQuery } from '@tanstack/react-query'
import * as orderApi from '../api/order'
import { API_ROUTES } from '../utils/apiConfig'

/**
 * Get patient orders
 * @param {Object} params - Query parameters
 * @returns {Query} React Query hook
 */
export const usePatientOrders = (params = {}) => {
  return useQuery({
    queryKey: ['patientOrders', params],
    queryFn: () => orderApi.getPatientOrders(params),
  })
}

/**
 * Get pharmacy orders (for doctors)
 * @param {Object} params - Query parameters
 * @returns {Query} React Query hook
 */
export const usePharmacyOrders = (params = {}) => {
  return useQuery({
    queryKey: ['pharmacyOrders', params],
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
  return useQuery({
    queryKey: ['order', orderId],
    queryFn: () => orderApi.getOrderById(orderId),
    enabled: !!orderId,
  })
}

