/**
 * Subscription Mutations
 * All POST/PUT/DELETE requests related to subscriptions
 */

import { useMutation, useQueryClient } from '@tanstack/react-query'
import { api } from '../utils/api'
import { API_ROUTES } from '../utils/apiConfig'

// Admin: Create subscription plan
export const useCreateSubscriptionPlan = () => {
  const queryClient = useQueryClient()
  
  return useMutation({
    mutationFn: (data) => api.post(API_ROUTES.SUBSCRIPTION.PLAN.CREATE, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['subscription-plans'] })
      queryClient.invalidateQueries({ queryKey: ['admin', 'subscription-plans'] })
    },
  })
}

// Admin: Update subscription plan
export const useUpdateSubscriptionPlan = () => {
  const queryClient = useQueryClient()
  
  return useMutation({
    mutationFn: ({ id, data }) => api.put(API_ROUTES.SUBSCRIPTION.PLAN.UPDATE(id), data),
    onSuccess: (data, variables) => {
      queryClient.invalidateQueries({ queryKey: ['subscription-plans'] })
      queryClient.invalidateQueries({ queryKey: ['subscription-plan', variables.id] })
      queryClient.invalidateQueries({ queryKey: ['admin', 'subscription-plans'] })
    },
  })
}

// Admin: Delete subscription plan
export const useDeleteSubscriptionPlan = () => {
  const queryClient = useQueryClient()
  
  return useMutation({
    mutationFn: (id) => api.delete(API_ROUTES.SUBSCRIPTION.PLAN.DELETE(id)),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['subscription-plans'] })
      queryClient.invalidateQueries({ queryKey: ['admin', 'subscription-plans'] })
    },
  })
}

// Admin: Assign subscription to doctor
export const useAssignSubscription = () => {
  const queryClient = useQueryClient()
  
  return useMutation({
    mutationFn: (data) => api.post(API_ROUTES.SUBSCRIPTION.PLAN.ASSIGN, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['doctor', 'subscription'] })
      queryClient.invalidateQueries({ queryKey: ['subscription-plans'] })
    },
  })
}

// Alternative: Create subscription plan (admin)
export const useCreateSubscriptionPlanAlt = () => {
  const queryClient = useQueryClient()
  
  return useMutation({
    mutationFn: (data) => api.post(API_ROUTES.SUBSCRIPTION.PLAN.ALTERNATIVE_CREATE, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['subscription-plans'] })
      queryClient.invalidateQueries({ queryKey: ['admin', 'subscription-plans'] })
    },
  })
}

// Alternative: Update subscription plan (admin)
export const useUpdateSubscriptionPlanAlt = () => {
  const queryClient = useQueryClient()
  
  return useMutation({
    mutationFn: ({ id, data }) => api.put(API_ROUTES.SUBSCRIPTION.PLAN.ALTERNATIVE_UPDATE(id), data),
    onSuccess: (data, variables) => {
      queryClient.invalidateQueries({ queryKey: ['subscription-plans'] })
      queryClient.invalidateQueries({ queryKey: ['subscription-plan', variables.id] })
      queryClient.invalidateQueries({ queryKey: ['admin', 'subscription-plans'] })
    },
  })
}

