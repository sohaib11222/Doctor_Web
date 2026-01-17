import { useState } from 'react'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { toast } from 'react-toastify'
import * as balanceApi from '../../api/balance'

const DoctorPayment = () => {
  const queryClient = useQueryClient()
  const [withdrawModal, setWithdrawModal] = useState({ show: false, amount: '', paymentMethod: 'PAYPAL', paymentDetails: '' })
  const [currentPage, setCurrentPage] = useState(1)

  // Fetch user balance
  const { data: balanceData, isLoading: balanceLoading } = useQuery({
    queryKey: ['userBalance'],
    queryFn: () => balanceApi.getBalance()
  })

  // Fetch withdrawal requests
  const { data: withdrawalData, isLoading: withdrawalLoading } = useQuery({
    queryKey: ['withdrawalRequests', currentPage],
    queryFn: () => balanceApi.getWithdrawalRequests({ page: currentPage, limit: 10 })
  })

  const balance = balanceData?.data?.balance || balanceData?.balance || 0
  const withdrawals = withdrawalData?.data?.requests || withdrawalData?.requests || []
  const pagination = withdrawalData?.data?.pagination || withdrawalData?.pagination || { total: 0, pages: 1 }

  // Request withdrawal mutation
  const requestWithdrawalMutation = useMutation({
    mutationFn: ({ amount, paymentMethod, paymentDetails }) => 
      balanceApi.requestWithdrawal(amount, paymentMethod, paymentDetails),
    onSuccess: () => {
      queryClient.invalidateQueries(['withdrawalRequests'])
      queryClient.invalidateQueries(['userBalance'])
      toast.success('Withdrawal request submitted successfully!')
      setWithdrawModal({ show: false, amount: '', paymentMethod: 'PAYPAL', paymentDetails: '' })
    },
    onError: (error) => {
      const errorMessage = error?.response?.data?.message || error?.message || 'Failed to submit withdrawal request'
      toast.error(errorMessage)
    }
  })

  // Format date
  const formatDate = (dateString) => {
    if (!dateString) return 'N/A'
    const date = new Date(dateString)
    return date.toLocaleDateString('en-US', { day: 'numeric', month: 'short', year: 'numeric' })
  }

  // Get status badge class
  const getStatusBadgeClass = (status) => {
    switch (status?.toUpperCase()) {
      case 'APPROVED':
      case 'COMPLETED':
        return 'badge badge-green status-badge'
      case 'PENDING':
        return 'badge badge-yellow status-badge'
      case 'REJECTED':
        return 'badge badge-red status-badge'
      default:
        return 'badge badge-grey status-badge'
    }
  }

  // Get status text
  const getStatusText = (status) => {
    switch (status?.toUpperCase()) {
      case 'APPROVED':
        return 'Approved'
      case 'COMPLETED':
        return 'Completed'
      case 'PENDING':
        return 'Pending'
      case 'REJECTED':
        return 'Rejected'
      default:
        return status || 'N/A'
    }
  }

  // Handle withdrawal request
  const handleWithdrawRequest = () => {
    const amount = parseFloat(withdrawModal.amount)
    if (!amount || amount <= 0) {
      toast.error('Please enter a valid amount')
      return
    }
    if (amount > balance) {
      toast.error('Insufficient balance')
      return
    }
    if (!withdrawModal.paymentDetails) {
      toast.error('Please enter payment details')
      return
    }
    
    requestWithdrawalMutation.mutate({
      amount,
      paymentMethod: withdrawModal.paymentMethod,
      paymentDetails: withdrawModal.paymentDetails
    })
  }

  return (
    <div className="content doctor-content">
      <div className="container">
        <div className="row">
          <div className="col-lg-4 col-xl-3 theiaStickySidebar">
            {/* DoctorSidebar will be rendered by DashboardLayout */}
          </div>

          {/* Payouts */}
          <div className="col-lg-12 col-xl-12">
            <div className="payout-wrap">
              <div className="payout-title">
                <h4>Settings</h4>
                <p>All the earning will be sent to below selected payout method</p>
              </div>
              <div className="stripe-wrapper">
                <div className="stripe-box">
                  <div className="stripe-img">
                    <img src="/assets/img/icons/stripe.svg" alt="img" />
                  </div>
                  <button className="btn" disabled><i className="fa-solid fa-gear"></i>Configure</button>
                </div>
                {/* <div className="stripe-box active">
                  <div className="stripe-img">
                    <img src="/assets/img/icons/paypal.svg" alt="img" />
                  </div>
                  <button 
                    className="btn" 
                    onClick={() => setWithdrawModal({ ...withdrawModal, show: true, paymentMethod: 'PAYPAL' })}
                  >
                    <i className="fa-solid fa-gear"></i>Configure
                  </button>
                </div> */}
              </div>
              <div className="mt-3">
                <div className="d-flex justify-content-between align-items-center p-3 bg-light rounded">
                  <div>
                    <p className="mb-1 text-muted">Available Balance</p>
                    <h4 className="mb-0">${balance.toFixed(2)}</h4>
                  </div>
                  <button 
                    className="btn btn-primary"
                    onClick={() => setWithdrawModal({ ...withdrawModal, show: true })}
                    disabled={balance <= 0}
                  >
                    Request Withdrawal
                  </button>
                </div>
              </div>
            </div>

            <div className="dashboard-header">
              <h3>Payouts</h3>
            </div>

            {/* Loading State */}
            {withdrawalLoading && (
              <div className="text-center py-5">
                <div className="spinner-border" role="status">
                  <span className="visually-hidden">Loading...</span>
                </div>
              </div>
            )}

            {/* Empty State */}
            {!withdrawalLoading && withdrawals.length === 0 && (
              <div className="text-center py-5">
                <p className="text-muted">No withdrawal requests found</p>
              </div>
            )}

            {/* Withdrawal Requests Table */}
            {!withdrawalLoading && withdrawals.length > 0 && (
              <div className="custom-table">
                <div className="table-responsive">
                  <table className="table table-center mb-0">
                    <thead>
                      <tr>
                        <th>Date</th>
                        <th>Payment Method</th>
                        <th>Amount</th>
                        <th>Status</th>
                      </tr>
                    </thead>
                    <tbody>
                      {withdrawals.map((withdrawal) => (
                        <tr key={withdrawal._id}>
                          <td>{formatDate(withdrawal.requestedAt || withdrawal.createdAt)}</td>
                          <td>{withdrawal.paymentMethod || 'N/A'}</td>
                          <td>${(withdrawal.amount || 0).toFixed(2)}</td>
                          <td>
                            <span className={getStatusBadgeClass(withdrawal.status)}>
                              {getStatusText(withdrawal.status)}
                            </span>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            )}

            {/* Pagination */}
            {!withdrawalLoading && pagination.pages > 1 && (
              <div className="pagination dashboard-pagination">
                <ul>
                  <li>
                    <button
                      className="page-link"
                      onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
                      disabled={currentPage === 1}
                    >
                      <i className="fa-solid fa-chevron-left"></i>
                    </button>
                  </li>
                  {[...Array(pagination.pages)].map((_, idx) => {
                    const page = idx + 1
                    if (page === 1 || page === pagination.pages || (page >= currentPage - 2 && page <= currentPage + 2)) {
                      return (
                        <li key={page}>
                          <button
                            className={`page-link ${currentPage === page ? 'active' : ''}`}
                            onClick={() => setCurrentPage(page)}
                          >
                            {page}
                          </button>
                        </li>
                      )
                    } else if (page === currentPage - 3 || page === currentPage + 3) {
                      return (
                        <li key={page}>
                          <span className="page-link">...</span>
                        </li>
                      )
                    }
                    return null
                  })}
                  <li>
                    <button
                      className="page-link"
                      onClick={() => setCurrentPage(p => Math.min(pagination.pages, p + 1))}
                      disabled={currentPage === pagination.pages}
                    >
                      <i className="fa-solid fa-chevron-right"></i>
                    </button>
                  </li>
                </ul>
              </div>
            )}
          </div>
          {/* /Payouts */}
        </div>
      </div>

      {/* Withdrawal Request Modal */}
      {withdrawModal.show && (
        <div className="modal fade show" style={{ display: 'block' }} id="add_configure">
          <div className="modal-dialog modal-dialog-centered">
            <div className="modal-content">
              <div className="modal-header">
                <h5 className="modal-title">Request Withdrawal</h5>
                <button 
                  type="button" 
                  className="btn-close" 
                  onClick={() => setWithdrawModal({ show: false, amount: '', paymentMethod: 'PAYPAL', paymentDetails: '' })}
                ></button>
              </div>
              <div className="modal-body">
                <div className="form-group mb-3">
                  <label>Available Balance</label>
                  <input
                    type="text"
                    className="form-control"
                    value={`$${balance.toFixed(2)}`}
                    disabled
                  />
                </div>
                <div className="form-group mb-3">
                  <label>Amount to Withdraw <span className="text-danger">*</span></label>
                  <input
                    type="number"
                    className="form-control"
                    value={withdrawModal.amount}
                    onChange={(e) => setWithdrawModal({ ...withdrawModal, amount: e.target.value })}
                    placeholder="Enter amount"
                    min="0"
                    max={balance}
                    step="0.01"
                  />
                </div>
                <div className="form-group mb-3">
                  <label>Payment Method <span className="text-danger">*</span></label>
                  <select
                    className="form-control"
                    value={withdrawModal.paymentMethod}
                    onChange={(e) => setWithdrawModal({ ...withdrawModal, paymentMethod: e.target.value })}
                  >
                    <option value="PAYPAL">PayPal</option>
                    <option value="BANK">Bank Transfer</option>
                    <option value="STRIPE">Stripe</option>
                  </select>
                </div>
                <div className="form-group mb-3">
                  <label>
                    Payment Details <span className="text-danger">*</span>
                    <small className="text-muted d-block">
                      {withdrawModal.paymentMethod === 'PAYPAL' && 'Enter your PayPal email'}
                      {withdrawModal.paymentMethod === 'BANK' && 'Enter bank account details'}
                      {withdrawModal.paymentMethod === 'STRIPE' && 'Enter Stripe account details'}
                    </small>
                  </label>
                  <textarea
                    className="form-control"
                    rows="3"
                    value={withdrawModal.paymentDetails}
                    onChange={(e) => setWithdrawModal({ ...withdrawModal, paymentDetails: e.target.value })}
                    placeholder="Enter payment details..."
                  ></textarea>
                </div>
              </div>
              <div className="modal-footer">
                <button
                  type="button"
                  className="btn btn-secondary"
                  onClick={() => setWithdrawModal({ show: false, amount: '', paymentMethod: 'PAYPAL', paymentDetails: '' })}
                >
                  Cancel
                </button>
                <button
                  type="button"
                  className="btn btn-primary"
                  onClick={handleWithdrawRequest}
                  disabled={requestWithdrawalMutation.isPending || !withdrawModal.amount || !withdrawModal.paymentDetails}
                >
                  {requestWithdrawalMutation.isPending ? 'Submitting...' : 'Submit Request'}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
      {withdrawModal.show && <div className="modal-backdrop fade show"></div>}
    </div>
  )
}

export default DoctorPayment

