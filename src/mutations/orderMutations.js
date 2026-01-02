import { useMutation, useQueryClient } from '@tanstack/react-query'
import * as orderApi from '../api/order'
import { toast } from 'react-toastify'

/**
 * Create order mutation
 * @returns {Mutation} React Query mutation
 */
export const useCreateOrder = () => {
  const queryClient = useQueryClient()
  
  return useMutation({
    mutationFn: (data) => orderApi.createOrder(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['patientOrders'] })
      toast.success('Order created successfully!')
    },
    onError: (error) => {
      const errorMessage = error.response?.data?.message || error.message || 'Failed to create order'
      toast.error(errorMessage)
    },
  })
}

/**
 * Update order status mutation
 * @returns {Mutation} React Query mutation
 */
export const useUpdateOrderStatus = () => {
  const queryClient = useQueryClient()
  
  return useMutation({
    mutationFn: ({ orderId, status }) => orderApi.updateOrderStatus(orderId, status),
    onSuccess: (data, variables) => {
      queryClient.invalidateQueries({ queryKey: ['order', variables.orderId] })
      queryClient.invalidateQueries({ queryKey: ['pharmacyOrders'] })
      queryClient.invalidateQueries({ queryKey: ['allOrders'] })
      toast.success('Order status updated successfully!')
    },
    onError: (error) => {
      const errorMessage = error.response?.data?.message || error.message || 'Failed to update order status'
      toast.error(errorMessage)
    },
  })
}

/**
 * Update shipping fee mutation
 * @returns {Mutation} React Query mutation
 */
export const useUpdateShippingFee = () => {
  const queryClient = useQueryClient()
  
  return useMutation({
    mutationFn: ({ orderId, shippingFee }) => orderApi.updateShippingFee(orderId, shippingFee),
    onSuccess: (data, variables) => {
      queryClient.invalidateQueries({ queryKey: ['order', variables.orderId] })
      queryClient.invalidateQueries({ queryKey: ['pharmacyOrders'] })
      queryClient.invalidateQueries({ queryKey: ['patientOrders'] })
      toast.success('Shipping fee updated successfully!')
    },
    onError: (error) => {
      const errorMessage = error.response?.data?.message || error.message || 'Failed to update shipping fee'
      toast.error(errorMessage)
    },
  })
}

/**
 * Cancel order mutation
 * @returns {Mutation} React Query mutation
 */
export const useCancelOrder = () => {
  const queryClient = useQueryClient()
  
  return useMutation({
    mutationFn: (orderId) => orderApi.cancelOrder(orderId),
    onSuccess: (data, orderId) => {
      queryClient.invalidateQueries({ queryKey: ['order', orderId] })
      queryClient.invalidateQueries({ queryKey: ['patientOrders'] })
      toast.success('Order cancelled successfully!')
    },
    onError: (error) => {
      const errorMessage = error.response?.data?.message || error.message || 'Failed to cancel order'
      toast.error(errorMessage)
    },
  })
}

/**
 * Pay for order mutation
 * @returns {Mutation} React Query mutation
 */
export const usePayForOrder = () => {
  const queryClient = useQueryClient()
  
  return useMutation({
    mutationFn: ({ orderId, paymentMethod }) => orderApi.payForOrder(orderId, paymentMethod),
    onSuccess: (data, variables) => {
      queryClient.invalidateQueries({ queryKey: ['order', variables.orderId] })
      queryClient.invalidateQueries({ queryKey: ['patientOrders'] })
      toast.success('Payment processed successfully!')
    },
    onError: (error) => {
      const errorMessage = error.response?.data?.message || error.message || 'Payment failed'
      toast.error(errorMessage)
    },
  })
}

