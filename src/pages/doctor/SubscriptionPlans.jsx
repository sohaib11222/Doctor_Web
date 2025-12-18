import { useState } from 'react'
import { Link } from 'react-router-dom'

const SubscriptionPlans = () => {
  const [selectedPlan, setSelectedPlan] = useState(null)
  const [showPaymentModal, setShowPaymentModal] = useState(false)

  const plans = [
    {
      id: 'basic',
      name: 'Basic Plan',
      price: '$29',
      period: 'per month',
      features: [
        'Up to 50 appointments/month',
        'Basic profile listing',
        'Email support',
        'Basic analytics',
        'Mobile app access'
      ],
      popular: false,
      current: true
    },
    {
      id: 'professional',
      name: 'Professional Plan',
      price: '$79',
      period: 'per month',
      features: [
        'Unlimited appointments',
        'Featured profile listing',
        'Priority support',
        'Advanced analytics',
        'Video consultations',
        'Custom branding',
        'API access'
      ],
      popular: true,
      current: false
    },
    {
      id: 'enterprise',
      name: 'Enterprise Plan',
      price: '$199',
      period: 'per month',
      features: [
        'Unlimited everything',
        'Premium placement',
        '24/7 dedicated support',
        'Custom integrations',
        'White-label solution',
        'Multi-location support',
        'Advanced reporting',
        'Team management'
      ],
      popular: false,
      current: false
    }
  ]

  const handleUpgrade = (planId) => {
    setSelectedPlan(planId)
    setShowPaymentModal(true)
  }

  const handlePayment = () => {
    // TODO: Integrate with payment gateway
    console.log('Processing payment for plan:', selectedPlan)
    // Simulate payment processing
    setTimeout(() => {
      alert('Payment processed successfully! Your subscription has been upgraded.')
      setShowPaymentModal(false)
      setSelectedPlan(null)
    }, 2000)
  }

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
            <div className="card mb-4">
              <div className="card-body">
                <div className="d-flex align-items-center justify-content-between">
                  <div>
                    <h5 className="mb-1">Current Plan: Basic Plan</h5>
                    <p className="text-muted mb-0">Renews on: 15 Dec 2024</p>
                  </div>
                  <div>
                    <span className="badge bg-success">Active</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Subscription Plans */}
            <div className="row">
              {plans.map((plan) => (
                <div key={plan.id} className="col-lg-4 col-md-6 mb-4">
                  <div className={`card subscription-card ${plan.popular ? 'popular-plan' : ''} ${plan.current ? 'current-plan' : ''}`}>
                    {plan.popular && (
                      <div className="popular-badge">
                        <span className="badge bg-primary">Most Popular</span>
                      </div>
                    )}
                    {plan.current && (
                      <div className="current-badge">
                        <span className="badge bg-success">Current Plan</span>
                      </div>
                    )}
                    <div className="card-body text-center">
                      <h4 className="mb-3">{plan.name}</h4>
                      <div className="pricing mb-4">
                        <h2 className="mb-0">{plan.price}</h2>
                        <p className="text-muted">{plan.period}</p>
                      </div>
                      <ul className="list-unstyled plan-features mb-4">
                        {plan.features.map((feature, index) => (
                          <li key={index} className="mb-2">
                            <i className="fe fe-check-circle text-success me-2"></i>
                            {feature}
                          </li>
                        ))}
                      </ul>
                      {plan.current ? (
                        <button className="btn btn-outline-primary w-100" disabled>
                          Current Plan
                        </button>
                      ) : (
                        <button
                          className={`btn w-100 ${plan.popular ? 'btn-primary' : 'btn-outline-primary'}`}
                          onClick={() => handleUpgrade(plan.id)}
                        >
                          {plan.id === 'basic' ? 'Downgrade' : 'Upgrade Now'}
                        </button>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Payment Modal */}
            {showPaymentModal && (
              <div className="modal fade show" style={{ display: 'block' }} tabIndex="-1">
                <div className="modal-dialog modal-dialog-centered">
                  <div className="modal-content">
                    <div className="modal-header">
                      <h5 className="modal-title">Upgrade Subscription</h5>
                      <button
                        type="button"
                        className="btn-close"
                        onClick={() => setShowPaymentModal(false)}
                      ></button>
                    </div>
                    <div className="modal-body">
                      <div className="mb-3">
                        <h6>Selected Plan: {plans.find(p => p.id === selectedPlan)?.name}</h6>
                        <p className="text-muted">
                          Price: {plans.find(p => p.id === selectedPlan)?.price} {plans.find(p => p.id === selectedPlan)?.period}
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
                            defaultChecked
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
                          />
                          <label className="form-check-label" htmlFor="paypal">
                            <i className="fe fe-dollar-sign me-2"></i>
                            PayPal
                          </label>
                        </div>
                        <div className="form-check">
                          <input
                            className="form-check-input"
                            type="radio"
                            name="paymentMethod"
                            id="bank"
                          />
                          <label className="form-check-label" htmlFor="bank">
                            <i className="fe fe-bank me-2"></i>
                            Bank Transfer
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
                        onClick={() => setShowPaymentModal(false)}
                      >
                        Cancel
                      </button>
                      <button
                        type="button"
                        className="btn btn-primary"
                        onClick={handlePayment}
                      >
                        <i className="fe fe-lock me-2"></i>
                        Pay Now
                      </button>
                    </div>
                  </div>
                </div>
                <div className="modal-backdrop fade show" onClick={() => setShowPaymentModal(false)}></div>
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

