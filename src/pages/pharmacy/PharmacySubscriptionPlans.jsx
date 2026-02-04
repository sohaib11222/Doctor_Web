import { useMemo, useState } from 'react'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { toast } from 'react-toastify'
import * as pharmacyApi from '../../api/pharmacy'

const PharmacySubscriptionPlans = () => {
  const [selectedPlan, setSelectedPlan] = useState(null)
  const queryClient = useQueryClient()

  const { data: plansResponse, isLoading: plansLoading, error: plansError } = useQuery({
    queryKey: ['pharmacy-subscription-plans'],
    queryFn: () => pharmacyApi.getPharmacyActivePlans(),
  })

  const plans = useMemo(() => {
    const responseData = plansResponse?.data || plansResponse
    const data = responseData?.data || responseData
    return Array.isArray(data) ? data : (data?.plans || [])
  }, [plansResponse])

  const { data: subscriptionResponse, isLoading: subscriptionLoading } = useQuery({
    queryKey: ['my-pharmacy-subscription'],
    queryFn: () => pharmacyApi.getMyPharmacySubscription(),
  })

  const subscriptionData = useMemo(() => {
    const responseData = subscriptionResponse?.data || subscriptionResponse
    return responseData?.data || responseData || {}
  }, [subscriptionResponse])

  const buyMutation = useMutation({
    mutationFn: ({ planId }) => pharmacyApi.buyPharmacySubscriptionPlan(planId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['my-pharmacy-subscription'] })
      toast.success('Subscription plan purchased successfully!')
      setSelectedPlan(null)
    },
    onError: (error) => {
      const errorMessage = error.response?.data?.message || error.message || 'Failed to purchase subscription'
      toast.error(errorMessage)
    }
  })

  const formatPrice = (price) => {
    if (price === undefined || price === null) return '€0.00'
    return `€${Number(price).toFixed(2)}`
  }

  const formatDate = (dateString) => {
    if (!dateString) return '—'
    const date = new Date(dateString)
    return date.toLocaleDateString('en-GB', { year: 'numeric', month: 'short', day: 'numeric' })
  }

  const currentPlanId = subscriptionData?.subscriptionPlan?._id || subscriptionData?.subscriptionPlan
  const isCurrentPlan = (planId) => planId === currentPlanId

  if (plansLoading || subscriptionLoading) {
    return (
      <div className="text-center py-5">
        <div className="spinner-border" role="status">
          <span className="visually-hidden">Loading...</span>
        </div>
      </div>
    )
  }

  if (plansError) {
    return (
      <div className="alert alert-danger">
        <h6 className="mb-1">Error Loading Plans</h6>
        <div>{plansError.response?.data?.message || plansError.message || 'Failed to load subscription plans'}</div>
      </div>
    )
  }

  return (
    <div>
      <div className="dashboard-header">
        <h3>Subscription Plans</h3>
        <p className="text-muted mb-0">Choose a plan to unlock full access to products and orders</p>
      </div>

      <div className="card mb-4">
        <div className="card-body">
          <div className="d-flex align-items-center justify-content-between flex-wrap" style={{ gap: 12 }}>
            <div>
              <h5 className="mb-1">Current Subscription</h5>
              {subscriptionData?.subscriptionPlan ? (
                <>
                  <div className="text-muted">
                    Plan: <strong>{subscriptionData.subscriptionPlan?.name || '—'}</strong>
                  </div>
                  <div className="text-muted">
                    {subscriptionData?.hasActiveSubscription ? (
                      <>Expires on: {formatDate(subscriptionData.subscriptionExpiresAt)}</>
                    ) : (
                      <>Expired on: {formatDate(subscriptionData.subscriptionExpiresAt)}</>
                    )}
                  </div>
                </>
              ) : (
                <div className="text-muted">No active subscription</div>
              )}
            </div>
            <div>
              <span className={`badge ${subscriptionData?.hasActiveSubscription ? 'bg-success' : 'bg-danger'}`}>
                {subscriptionData?.hasActiveSubscription ? 'Active' : 'Inactive'}
              </span>
            </div>
          </div>
        </div>
      </div>

      {plans.length === 0 ? (
        <div className="alert alert-info">No plans available.</div>
      ) : (
        <div className="row">
          {plans.map((plan) => (
            <div key={plan._id} className="col-lg-4 col-md-6 mb-4">
              <div className={`card ${isCurrentPlan(plan._id) ? 'border-success' : ''}`}>
                <div className="card-body text-center">
                  <h4 className="mb-2">{plan.name}</h4>
                  <div className="mb-3">
                    <h2 className="mb-0">{formatPrice(plan.price)}</h2>
                    <div className="text-muted small">Duration: {plan.durationInDays} days</div>
                  </div>

                  <div className="mb-3">
                    {plan.features && plan.features.length > 0 ? (
                      <ul className="list-unstyled mb-0">
                        {plan.features.map((f, idx) => (
                          <li key={idx} className="mb-1">
                            <i className="fe fe-check-circle text-success me-2"></i>
                            {f}
                          </li>
                        ))}
                      </ul>
                    ) : (
                      <div className="text-muted">Full access</div>
                    )}
                  </div>

                  {isCurrentPlan(plan._id) ? (
                    <button className="btn btn-outline-success w-100" disabled>
                      Current Plan
                    </button>
                  ) : (
                    <button
                      className="btn btn-primary w-100"
                      onClick={() => setSelectedPlan(plan)}
                      disabled={buyMutation.isLoading}
                    >
                      Buy Plan
                    </button>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {selectedPlan && (
        <>
          <div
            className="modal-backdrop fade show"
            onClick={() => setSelectedPlan(null)}
            style={{ zIndex: 1040 }}
          ></div>
          <div
            className="modal fade show"
            style={{ display: 'block', zIndex: 1050 }}
            tabIndex="-1"
            role="dialog"
            aria-modal="true"
            onClick={(e) => {
              if (e.target.classList.contains('modal')) setSelectedPlan(null)
            }}
          >
            <div className="modal-dialog modal-dialog-centered" role="document" onClick={(e) => e.stopPropagation()}>
              <div className="modal-content">
                <div className="modal-header">
                  <h5 className="modal-title">Confirm Purchase</h5>
                  <button type="button" className="btn-close" onClick={() => setSelectedPlan(null)}></button>
                </div>
                <div className="modal-body">
                  <div className="mb-2">Plan: <strong>{selectedPlan.name}</strong></div>
                  <div className="mb-2">Price: <strong>{formatPrice(selectedPlan.price)}</strong></div>
                  <div className="text-muted small">This will activate immediately.</div>
                </div>
                <div className="modal-footer">
                  <button className="btn btn-secondary" onClick={() => setSelectedPlan(null)} disabled={buyMutation.isLoading}>
                    Cancel
                  </button>
                  <button
                    className="btn btn-primary"
                    onClick={() => buyMutation.mutate({ planId: selectedPlan._id })}
                    disabled={buyMutation.isLoading}
                  >
                    {buyMutation.isLoading ? 'Processing...' : 'Confirm & Pay'}
                  </button>
                </div>
              </div>
            </div>
          </div>
        </>
      )}
    </div>
  )
}

export default PharmacySubscriptionPlans
