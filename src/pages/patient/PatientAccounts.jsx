import { useState } from 'react'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { toast } from 'react-toastify'
import * as balanceApi from '../../api/balance'
import * as paymentApi from '../../api/payment'

const PatientAccounts = () => {
  const queryClient = useQueryClient()
  const [showWithdrawModal, setShowWithdrawModal] = useState(false)
  const [withdrawFormData, setWithdrawFormData] = useState({
    amount: '',
    paymentMethod: 'BANK',
    paymentDetails: ''
  })

  // Fetch balance
  const { data: balanceResponse, isLoading: balanceLoading } = useQuery({
    queryKey: ['balance'],
    queryFn: () => balanceApi.getBalance()
  })

  // Fetch withdrawal requests
  const { data: withdrawalRequestsResponse, isLoading: withdrawalLoading } = useQuery({
    queryKey: ['withdrawalRequests'],
    queryFn: () => balanceApi.getWithdrawalRequests({ page: 1, limit: 10 })
  })

  // Fetch payment history for transactions
  const { data: paymentHistoryResponse } = useQuery({
    queryKey: ['patientPaymentHistory', 'wallet'],
    queryFn: () => paymentApi.getPatientPaymentHistory({ page: 1, limit: 10 })
  })

  // Extract data
  const balanceData = balanceResponse?.data || balanceResponse || {}
  const balance = balanceData.balance || 0
  
  const withdrawalRequestsData = withdrawalRequestsResponse?.data || withdrawalRequestsResponse || {}
  const withdrawalRequests = withdrawalRequestsData.requests || []
  
  const paymentHistoryData = paymentHistoryResponse?.data || paymentHistoryResponse || {}
  const transactions = paymentHistoryData.transactions || []

  // Calculate total transactions
  const totalTransactions = transactions.reduce((sum, txn) => sum + (txn.amount || 0), 0)

  // Get last withdrawal request date
  const lastWithdrawalRequest = withdrawalRequests.length > 0 ? withdrawalRequests[0] : null
  const lastRequestDate = lastWithdrawalRequest?.requestedAt || lastWithdrawalRequest?.createdAt

  // Request withdrawal mutation
  const requestWithdrawalMutation = useMutation({
    mutationFn: (data) => balanceApi.requestWithdrawal(data.amount, data.paymentMethod, data.paymentDetails),
    onSuccess: () => {
      queryClient.invalidateQueries(['balance'])
      queryClient.invalidateQueries(['withdrawalRequests'])
      setShowWithdrawModal(false)
      setWithdrawFormData({ amount: '', paymentMethod: 'BANK', paymentDetails: '' })
      toast.success('Withdrawal request submitted successfully!')
    },
    onError: (error) => {
      const errorMessage = error.response?.data?.message || error.message || 'Failed to submit withdrawal request'
      toast.error(errorMessage)
    }
  })

  // Handle withdrawal form submit
  const handleWithdrawSubmit = (e) => {
    e.preventDefault()
    const amount = parseFloat(withdrawFormData.amount)
    
    if (!amount || amount <= 0) {
      toast.error('Please enter a valid amount')
      return
    }
    
    if (amount > balance) {
      toast.error('Insufficient balance')
      return
    }

    if (!withdrawFormData.paymentDetails.trim()) {
      toast.error('Please provide payment details')
      return
    }

    requestWithdrawalMutation.mutate({
      amount,
      paymentMethod: withdrawFormData.paymentMethod,
      paymentDetails: withdrawFormData.paymentDetails
    })
  }

  // Format date
  const formatDate = (dateString) => {
    if (!dateString) return 'N/A'
    const date = new Date(dateString)
    return date.toLocaleDateString('en-GB', { 
      day: '2-digit', 
      month: 'short', 
      year: 'numeric'
    })
  }

  // Format currency
  const formatCurrency = (amount, currency = 'USD') => {
    if (!amount) return '$0.00'
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: currency || 'USD'
    }).format(amount)
  }

  // Get status badge
  const getStatusBadge = (status) => {
    const statusUpper = (status || '').toUpperCase()
    if (statusUpper === 'COMPLETED' || statusUpper === 'APPROVED') {
      return <span className="badge badge-success-transparent inline-flex align-items-center"><i className="fa-solid fa-circle me-1 fs-5"></i>{status}</span>
    }
    if (statusUpper === 'PENDING') {
      return <span className="badge badge-warning-transparent inline-flex align-items-center"><i className="fa-solid fa-circle me-1 fs-5"></i>{status}</span>
    }
    if (statusUpper === 'REJECTED' || statusUpper === 'FAILED') {
      return <span className="badge badge-danger-transparent inline-flex align-items-center"><i className="fa-solid fa-circle me-1 fs-5"></i>{status}</span>
    }
    return <span className="badge badge-secondary-transparent inline-flex align-items-center"><i className="fa-solid fa-circle me-1 fs-5"></i>{status || 'N/A'}</span>
  }

  return (
    <div className="content">
      <div className="container">
        <div className="row">
          <div className="col-lg-4 col-xl-3 theiaStickySidebar">
            {/* PatientSidebar will be rendered by DashboardLayout */}
          </div>
          <div className="col-lg-12 col-xl-12">
            <div className="accunts-sec">
              <div className="dashboard-header">
                <div className="header-back">
                  <h3>Wallet</h3>
                </div>
              </div>
              <div className="account-details-box">
                <div className="row">
                  <div className="col-xxl-7 col-lg-7">
                    <div className="account-payment-info">
                      <div className="row">
                        <div className="col-lg-6 col-md-6">
                          <div className="payment-amount">
                            <h6><i className="isa isax-wallet-25 text-warning"></i>Total Balance</h6>
                            {balanceLoading ? (
                              <span>Loading...</span>
                            ) : (
                              <span>{formatCurrency(balance)}</span>
                            )}
                          </div>
                        </div>
                        <div className="col-lg-6 col-md-6">
                          <div className="payment-amount">
                            <h6><i className="isax isax-document5 text-success"></i>Total Transaction</h6>
                            <span>{formatCurrency(totalTransactions)}</span>
                          </div>
                        </div>
                      </div>
                      <div className="payment-request">
                        <span>
                          {lastRequestDate 
                            ? `Last Payment request : ${formatDate(lastRequestDate)}`
                            : 'No withdrawal requests yet'
                          }
                        </span>
                        <button 
                          className="btn btn-md btn-primary-gradient rounded-pill" 
                          onClick={() => setShowWithdrawModal(true)}
                        >
                          Request Withdrawal
                        </button>
                      </div>
                    </div>
                  </div>
                  <div className="col-xxl-5 col-lg-5">
                    <div className="bank-details-info">
                      <h3>Withdrawal Requests</h3>
                      {withdrawalLoading ? (
                        <div className="text-center py-3">
                          <div className="spinner-border spinner-border-sm" role="status">
                            <span className="visually-hidden">Loading...</span>
                          </div>
                        </div>
                      ) : withdrawalRequests.length === 0 ? (
                        <p className="text-muted">No withdrawal requests</p>
                      ) : (
                        <ul>
                          {withdrawalRequests.slice(0, 3).map((request) => (
                            <li key={request._id}>
                              <h6>Amount</h6>
                              <h5>{formatCurrency(request.amount)}</h5>
                              <div className="mt-2">
                                {getStatusBadge(request.status)}
                              </div>
                              <small className="text-muted">{formatDate(request.requestedAt || request.createdAt)}</small>
                            </li>
                          ))}
                        </ul>
                      )}
                      <div className="edit-detail-link d-flex align-items-center justify-content-between w-100 mt-3">
                        <button 
                          className="btn btn-sm btn-primary"
                          onClick={() => setShowWithdrawModal(true)}
                        >
                          Request Withdrawal
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <div className="row">
              <div className="col-sm-12">
                <div className="account-detail-table">
                  <div className="custom-new-table">
                    <div className="table-responsive">
                      <table className="table table-center mb-0">
                        <thead>
                          <tr>
                            <th>Transaction ID</th>
                            <th>Type</th>
                            <th>Reason</th>
                            <th>Date</th>
                            <th>Amount</th>
                            <th>Status</th>
                          </tr>
                        </thead>
                        <tbody>
                          {transactions.length === 0 ? (
                            <tr>
                              <td colSpan="6" className="text-center py-4">
                                <p className="text-muted">No transactions found</p>
                              </td>
                            </tr>
                          ) : (
                            transactions.map((transaction) => {
                              const transactionType = transaction.relatedAppointmentId ? 'Appointment' : 
                                                     transaction.relatedSubscriptionId ? 'Subscription' : 
                                                     transaction.relatedProductId ? 'Product' : 'Other'
                              return (
                                <tr key={transaction._id}>
                                  <td>
                                    <a href="javascript:void(0);" className="link-primary">
                                      #{transaction._id.slice(-8).toUpperCase()}
                                    </a>
                                  </td>
                                  <td className="text-gray-9">{transactionType}</td>
                                  <td>{transactionType}</td>
                                  <td>{formatDate(transaction.createdAt)}</td>
                                  <td>{formatCurrency(transaction.amount, transaction.currency)}</td>
                                  <td>
                                    {getStatusBadge(transaction.status)}
                                  </td>
                                </tr>
                              )
                            })
                          )}
                        </tbody>
                      </table>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Request Withdrawal Modal */}
      {showWithdrawModal && (
        <>
          <div 
            className="modal-backdrop fade show" 
            onClick={() => setShowWithdrawModal(false)}
            style={{ zIndex: 1040 }}
          ></div>
          <div 
            className="modal fade show" 
            style={{ display: 'block', zIndex: 1050 }} 
            id="payment_request"
            onClick={(e) => {
              if (e.target.id === 'payment_request') {
                setShowWithdrawModal(false)
              }
            }}
          >
            <div className="modal-dialog modal-dialog-centered" onClick={(e) => e.stopPropagation()}>
              <div className="modal-content">
                <div className="modal-header">
                  <h5 className="modal-title">Request Withdrawal</h5>
                  <button type="button" className="btn-close" onClick={() => setShowWithdrawModal(false)}></button>
                </div>
                <form onSubmit={handleWithdrawSubmit}>
                  <div className="modal-body">
                    <div className="mb-3">
                      <label className="form-label">Available Balance</label>
                      <div className="h4 text-primary">{formatCurrency(balance)}</div>
                    </div>
                    <div className="mb-3">
                      <label className="form-label">Withdrawal Amount <span className="text-danger">*</span></label>
                      <input 
                        type="number" 
                        className="form-control" 
                        step="0.01"
                        min="0.01"
                        max={balance}
                        value={withdrawFormData.amount}
                        onChange={(e) => setWithdrawFormData(prev => ({ ...prev, amount: e.target.value }))}
                        required
                      />
                      <small className="text-muted">Maximum: {formatCurrency(balance)}</small>
                    </div>
                    <div className="mb-3">
                      <label className="form-label">Payment Method <span className="text-danger">*</span></label>
                      <select 
                        className="form-select" 
                        value={withdrawFormData.paymentMethod}
                        onChange={(e) => setWithdrawFormData(prev => ({ ...prev, paymentMethod: e.target.value }))}
                        required
                      >
                        <option value="BANK">Bank Transfer</option>
                        <option value="PAYPAL">PayPal</option>
                        <option value="STRIPE">Stripe</option>
                        <option value="OTHER">Other</option>
                      </select>
                    </div>
                    <div className="mb-3">
                      <label className="form-label">Payment Details <span className="text-danger">*</span></label>
                      <textarea 
                        className="form-control" 
                        rows="3"
                        placeholder="Enter account number, PayPal email, or other payment details..."
                        value={withdrawFormData.paymentDetails}
                        onChange={(e) => setWithdrawFormData(prev => ({ ...prev, paymentDetails: e.target.value }))}
                        required
                      />
                      <small className="text-muted">Please provide your payment account details</small>
                    </div>
                  </div>
                  <div className="modal-footer">
                    <button type="button" className="btn btn-secondary" onClick={() => setShowWithdrawModal(false)}>
                      Cancel
                    </button>
                    <button 
                      type="submit" 
                      className="btn btn-primary"
                      disabled={requestWithdrawalMutation.isLoading}
                    >
                      {requestWithdrawalMutation.isLoading ? 'Submitting...' : 'Submit Request'}
                    </button>
                  </div>
                </form>
              </div>
            </div>
          </div>
        </>
      )}
    </div>
  )
}

export default PatientAccounts

