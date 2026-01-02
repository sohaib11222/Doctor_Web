import api from './axios'

/**
 * Subscription API
 * For managing doctor subscriptions
 */

/**
 * Buy a subscription plan
 * @param {string} planId - Subscription plan ID
 * @returns {Promise<Object>} Subscription purchase result
 */
export const buySubscriptionPlan = async (planId) => {
  return api.post('/doctor/buy-subscription', { planId })
}

/**
 * Get doctor's current subscription plan
 * @returns {Promise<Object>} Current subscription info
 */
export const getMySubscription = async () => {
  return api.get('/doctor/my-subscription')
}

/**
 * List all available subscription plans (public)
 * @param {Object} params - Query parameters
 * @param {boolean} params.isActive - Filter by active status
 * @returns {Promise<Array>} List of subscription plans
 */
export const listSubscriptionPlans = async (params = {}) => {
  return api.get('/subscription', { params })
}

/**
 * Get active subscription plans (public - alternative endpoint)
 * @returns {Promise<Array>} List of active subscription plans
 */
export const getActivePlans = async () => {
  return api.get('/admin/subscription-plan/active')
}

