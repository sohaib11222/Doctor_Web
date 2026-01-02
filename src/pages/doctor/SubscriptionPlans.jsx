import { useState } from 'react'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { toast } from 'react-toastify'
import * as subscriptionApi from '../../api/subscription'
import * as paymentApi from '../../api/payment'

const SubscriptionPlans = () => {
  const [selectedPlan, setSelectedPlan] = useState(null)
  const [showPaymentModal, setShowPaymentModal] = useState(false)
  const [paymentMethod, setPaymentMethod] = useState('DUMMY') // DUMMY, CARD, PAYPAL, BANK

  const queryClient = useQueryClient()

  // Fetch all subscription plans
  const { data: plansData, isLoading: plansLoading, error: plansError } = useQuery({
    queryKey: ['subscriptionPlans'],
    queryFn: async () => {
      const response = await subscriptionApi.listSubscriptionPlans()
      return response.data || response
    }
  })

  // Fetch current subscription
  const { data: currentSubscriptionData, isLoading: subscriptionLoading } = useQuery({
    queryKey: ['mySubscription'],
    queryFn: async () => {
      const response = await subscriptionApi.getMySubscription()
      return response.data || response
    }
  })

  // Buy subscription mutation (using payment API)
  const buySubscriptionMutation = useMutation({
    mutationFn: async ({ planId, amount, paymentMethod }) => {
      return paymentApi.processSubscriptionPayment(planId, amount, paymentMethod)
    },
    onSuccess: (response) => {
      queryClient.invalidateQueries(['mySubscription'])
      queryClient.invalidateQueries(['subscriptionPlans'])
      queryClient.invalidateQueries(['doctorTransactions'])
      queryClient.invalidateQueries(['doctorDashboard'])
      toast.success('Subscription plan purchased successfully!')
      setShowPaymentModal(false)
      setSelectedPlan(null)
      setPaymentMethod('DUMMY')
    },
    onError: (error) => {
      const errorMessage = error.response?.data?.message || error.message || 'Failed to purchase subscription'
      toast.error(errorMessage)
    }
  })

  // Format price for display
  const formatPrice = (price) => {
    return `$${price}`
  }

  // Format duration for display
  const formatDuration = (days) => {
    if (days === 30) return 'per month'
    if (days === 90) return 'per 3 months'
    if (days === 365) return 'per year'
    return `per ${days} days`
  }

  // Format expiration date
  const formatDate = (dateString) => {
    if (!dateString) return 'N/A'
    const date = new Date(dateString)
    return date.toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' })
  }

  // Get current plan ID
  const currentPlanId = currentSubscriptionData?.subscriptionPlan?._id || currentSubscriptionData?.subscriptionPlan

  // Check if plan is current
  const isCurrentPlan = (planId) => {
    return planId === currentPlanId
  }

  // Determine if plan is popular (middle plan or based on price)
  const isPopularPlan = (plan, allPlans) => {
    if (!allPlans || allPlans.length < 2) return false
    // Sort plans by price
    const sortedPlans = [...allPlans].sort((a, b) => a.price - b.price)
    // Mark middle plan as popular
    const middleIndex = Math.floor(sortedPlans.length / 2)
    return sortedPlans[middleIndex]?._id === plan._id
  }

  // Handle plan selection
  const handleUpgrade = (plan) => {
    if (isCurrentPlan(plan._id)) {
      toast.info('This is your current plan')
      return
    }
    if (plan.status !== 'ACTIVE') {
      toast.error('This plan is not available for purchase')
      return
    }
    setSelectedPlan(plan)
    setShowPaymentModal(true)
  }

  // Handle payment
  const handlePayment = () => {
    if (selectedPlan) {
      buySubscriptionMutation.mutate({
        planId: selectedPlan._id,
        amount: selectedPlan.price,
        paymentMethod: paymentMethod
      })
    }
  }

  // Loading state
  if (plansLoading || subscriptionLoading) {
    return (
      <div className="content doctor-content">
        <div className="container">
          <div className="text-center py-5">
            <div className="spinner-border text-primary" role="status">
              <span className="visually-hidden">Loading...</span>
            </div>
            <p className="mt-3 text-muted">Loading subscription plans...</p>
          </div>
        </div>
      </div>
    )
  }

  // Error state
  if (plansError) {
    return (
      <div className="content doctor-content">
        <div className="container">
          <div className="alert alert-danger">
            <h5>Error Loading Plans</h5>
            <p>{plansError.response?.data?.message || plansError.message || 'Failed to load subscription plans'}</p>
          </div>
        </div>
      </div>
    )
  }

  const plans = plansData || []
  const currentSubscription = currentSubscriptionData || {}

  return (
    <div className="content doctor-content">
      <div className="container">
        <div className="row">
          <div className="col-lg-4 col-xl-3 theiaStickySidebar">
            {/* DoctorSidebar will be rendered by DashboardLayout */}
          </div>
          <div className="col-lg-12 col-xl-12">
            <div className="dashboard-header">
              <h3>Subscription Plans</h3>
              <p className="text-muted">Choose a plan that best fits your practice needs</p>
            </div>

            {/* Current Plan Info */}
            {currentSubscription?.subscriptionPlan && (
              <div className="card mb-4">
                <div className="card-body">
                  <div className="d-flex align-items-center justify-content-between">
                    <div>
                      <h5 className="mb-1">
                        Current Plan: {currentSubscription.subscriptionPlan.name || 'N/A'}
                      </h5>
                      <p className="text-muted mb-0">
                        {currentSubscription.hasActiveSubscription ? (
                          <>Renews on: {formatDate(currentSubscription.subscriptionExpiresAt)}</>
                        ) : (
                          <>Expired on: {formatDate(currentSubscription.subscriptionExpiresAt)}</>
                        )}
                      </p>
                    </div>
                    <div>
                      <span className={`badge ${currentSubscription.hasActiveSubscription ? 'bg-success' : 'bg-danger'}`}>
                        {currentSubscription.hasActiveSubscription ? 'Active' : 'Expired'}
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* No Current Subscription */}
            {!currentSubscription?.subscriptionPlan && (
              <div className="alert alert-warning mb-4">
                <h6>No Active Subscription</h6>
                <p className="mb-0">You don't have an active subscription. Please select a plan below.</p>
              </div>
            )}

            {/* Subscription Plans */}
            {plans.length === 0 ? (
              <div className="alert alert-info">
                <p>No subscription plans available at the moment.</p>
              </div>
            ) : (
              <div className="row">
                {plans.map((plan) => {
                  const isCurrent = isCurrentPlan(plan._id)
                  const isPopular = isPopularPlan(plan, plans)
                  const isActive = plan.status === 'ACTIVE'
                  const currentPlanPrice = plans.find(p => p._id === currentPlanId)?.price || 0

                  return (
                    <div key={plan._id} className="col-lg-4 col-md-6 mb-4">
                      <div className={`card subscription-card ${isPopular && isActive ? 'popular-plan' : ''} ${isCurrent ? 'current-plan' : ''}`}>
                        {isPopular && isActive && (
                          <div className="popular-badge">
                            <span className="badge bg-primary">Most Popular</span>
                          </div>
                        )}
                        {isCurrent && (
                          <div className="current-badge">
                            <span className="badge bg-success">Current Plan</span>
                          </div>
                        )}
                        <div className="card-body text-center">
                          <h4 className="mb-3">{plan.name}</h4>
                          <div className="pricing mb-4">
                            <h2 className="mb-0">{formatPrice(plan.price)}</h2>
                            <p className="text-muted">{formatDuration(plan.durationInDays)}</p>
                          </div>
                          <ul className="list-unstyled plan-features mb-4">
                            {plan.features && plan.features.length > 0 ? (
                              plan.features.map((feature, index) => (
                                <li key={index} className="mb-2">
                                  <i className="fe fe-check-circle text-success me-2"></i>
                                  {feature}
                                </li>
                              ))
                            ) : (
                              <li className="text-muted">No features listed</li>
                            )}
                          </ul>
                          {isCurrent ? (
                            <button className="btn btn-outline-primary w-100" disabled>
                              Current Plan
                            </button>
                          ) : !isActive ? (
                            <button className="btn btn-outline-secondary w-100" disabled>
                              Not Available
                            </button>
                          ) : (
                            <button
                              className={`btn w-100 ${isPopular ? 'btn-primary' : 'btn-outline-primary'}`}
                              onClick={() => handleUpgrade(plan)}
                              disabled={buySubscriptionMutation.isLoading}
                            >
                              {plan.price < currentPlanPrice ? 'Downgrade' : 'Upgrade Now'}
                            </button>
                          )}
                        </div>
                      </div>
                    </div>
                  )
                })}
              </div>
            )}

            {/* Payment Modal */}
            {showPaymentModal && selectedPlan && (
              <div 
                className="modal fade show" 
                style={{ 
                  display: 'block',
                  zIndex: 1055,
                  position: 'fixed',
                  top: 0,
                  left: 0,
                  width: '100%',
                  height: '100%'
                }} 
                tabIndex="-1"
                role="dialog"
                aria-modal="true"
              >
                <div className="modal-dialog modal-dialog-centered" style={{ zIndex: 1056 }}>
                  <div className="modal-content" style={{ position: 'relative', zIndex: 1057 }}>
                    <div className="modal-header">
                      <h5 className="modal-title">Upgrade Subscription</h5>
                      <button
                        type="button"
                        className="btn-close"
                        onClick={() => {
                          setShowPaymentModal(false)
                          setSelectedPlan(null)
                          setPaymentMethod('DUMMY')
                        }}
                        aria-label="Close"
                      ></button>
                    </div>
                    <div className="modal-body">
                      <div className="mb-3">
                        <h6>Selected Plan: {selectedPlan.name}</h6>
                        <p className="text-muted">
                          Price: {formatPrice(selectedPlan.price)} {formatDuration(selectedPlan.durationInDays)}
                        </p>
                      </div>
                      <div className="payment-methods mb-3">
                        <h6 className="mb-3">Payment Method</h6>
                        <div className="form-check mb-2">
                          <input
                            className="form-check-input"
                            type="radio"
                            name="paymentMethod"
                            id="card"
                            value="CARD"
                            checked={paymentMethod === 'CARD'}
                            onChange={(e) => setPaymentMethod(e.target.value)}
                          />
                          <label className="form-check-label" htmlFor="card">
                            <i className="fe fe-credit-card me-2"></i>
                            Credit/Debit Card
                          </label>
                        </div>
                        <div className="form-check mb-2">
                          <input
                            className="form-check-input"
                            type="radio"
                            name="paymentMethod"
                            id="paypal"
                            value="PAYPAL"
                            checked={paymentMethod === 'PAYPAL'}
                            onChange={(e) => setPaymentMethod(e.target.value)}
                          />
                          <label className="form-check-label" htmlFor="paypal">
                            <i className="fe fe-dollar-sign me-2"></i>
                            PayPal
                          </label>
                        </div>
                        <div className="form-check mb-2">
                          <input
                            className="form-check-input"
                            type="radio"
                            name="paymentMethod"
                            id="bank"
                            value="BANK"
                            checked={paymentMethod === 'BANK'}
                            onChange={(e) => setPaymentMethod(e.target.value)}
                          />
                          <label className="form-check-label" htmlFor="bank">
                            <i className="fe fe-bank me-2"></i>
                            Bank Transfer
                          </label>
                        </div>
                        <div className="form-check">
                          <input
                            className="form-check-input"
                            type="radio"
                            name="paymentMethod"
                            id="dummy"
                            value="DUMMY"
                            checked={paymentMethod === 'DUMMY'}
                            onChange={(e) => setPaymentMethod(e.target.value)}
                            defaultChecked
                          />
                          <label className="form-check-label" htmlFor="dummy">
                            <i className="fe fe-check-circle me-2"></i>
                            Test Payment (Dummy)
                          </label>
                        </div>
                      </div>
                      <div className="card-details">
                        <div className="mb-3">
                          <label className="form-label">Card Number</label>
                          <input type="text" className="form-control" placeholder="1234 5678 9012 3456" />
                        </div>
                        <div className="row">
                          <div className="col-md-6 mb-3">
                            <label className="form-label">Expiry Date</label>
                            <input type="text" className="form-control" placeholder="MM/YY" />
                          </div>
                          <div className="col-md-6 mb-3">
                            <label className="form-label">CVV</label>
                            <input type="text" className="form-control" placeholder="123" />
                          </div>
                        </div>
                        <div className="mb-3">
                          <label className="form-label">Cardholder Name</label>
                          <input type="text" className="form-control" placeholder="John Doe" />
                        </div>
                      </div>
                    </div>
                    <div className="modal-footer">
                      <button
                        type="button"
                        className="btn btn-secondary"
                        onClick={() => {
                          setShowPaymentModal(false)
                          setSelectedPlan(null)
                          setPaymentMethod('DUMMY')
                        }}
                        disabled={buySubscriptionMutation.isLoading}
                      >
                        Cancel
                      </button>
                      <button
                        type="button"
                        className="btn btn-primary"
                        onClick={handlePayment}
                        disabled={buySubscriptionMutation.isLoading}
                      >
                        {buySubscriptionMutation.isLoading ? (
                          <>
                            <span className="spinner-border spinner-border-sm me-2" role="status"></span>
                            Processing...
                          </>
                        ) : (
                          <>
                            <i className="fe fe-lock me-2"></i>
                            Pay Now
                          </>
                        )}
                      </button>
                    </div>
                  </div>
                </div>
                <div 
                  className="modal-backdrop fade show" 
                  onClick={() => {
                    setShowPaymentModal(false)
                    setSelectedPlan(null)
                  }}
                  style={{ 
                    zIndex: 1054,
                    position: 'fixed',
                    top: 0,
                    left: 0,
                    width: '100%',
                    height: '100%',
                    backgroundColor: 'rgba(0, 0, 0, 0.5)'
                  }}
                ></div>
              </div>
            )}

            {/* Info Alert */}
            <div className="alert alert-info mt-4">
              <div className="d-flex">
                <div className="flex-shrink-0">
                  <i className="fe fe-info"></i>
                </div>
                <div className="flex-grow-1 ms-3">
                  <h6 className="alert-heading">Subscription Information</h6>
                  <p className="mb-0 small">
                    You can upgrade or downgrade your plan at any time. Changes will be reflected immediately, 
                    and billing will be prorated. Cancel anytime with no long-term commitment.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default SubscriptionPlans
