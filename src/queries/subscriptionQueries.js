/**
 * Subscription Queries
 * All GET requests related to subscriptions
 */

import { useQuery } from '@tanstack/react-query'
import { api } from '../utils/api'
import { API_ROUTES } from '../utils/apiConfig'

// Get all active subscription plans (public)
export const useActiveSubscriptionPlans = () => {
  return useQuery({
    queryKey: ['subscription-plans', 'active'],
    queryFn: () => api.get(API_ROUTES.SUBSCRIPTION.PLAN.ACTIVE),
  })
}

// Admin: Get all subscription plans
export const useSubscriptionPlans = (params = {}) => {
  return useQuery({
    queryKey: ['admin', 'subscription-plans', params],
    queryFn: () => api.get(API_ROUTES.SUBSCRIPTION.PLAN.LIST, { params }),
  })
}

// Get subscription plan by ID
export const useSubscriptionPlan = (planId) => {
  return useQuery({
    queryKey: ['subscription-plan', planId],
    queryFn: () => api.get(API_ROUTES.SUBSCRIPTION.PLAN.GET(planId)),
    enabled: !!planId,
  })
}

// Public: Get all subscription plans
export const usePublicSubscriptionPlans = () => {
  return useQuery({
    queryKey: ['subscription-plans', 'public'],
    queryFn: () => api.get(API_ROUTES.SUBSCRIPTION.PLAN.PUBLIC_LIST),
  })
}

