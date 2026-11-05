import { useState } from 'react'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { toast } from 'react-toastify'
import * as balanceApi from '../../api/balance'
import { useLanguage } from '../../contexts/LanguageContext'

const PharmacyPayment = () => {
  const queryClient = useQueryClient()
  const { translateText: tr, formatDate, language } = useLanguage()
  const formatCurrency = (amount) => new Intl.NumberFormat(language === 'it' ? 'it-IT' : 'en-US', { style: 'currency', currency: 'EUR' }).format(Number(amount || 0))
  const [withdrawModal, setWithdrawModal] = useState({
    show: false,
    amount: '',
    paymentMethod: 'STRIPE',
    paymentDetails: ''
  })
  const [currentPage, setCurrentPage] = useState(1)

  const { data: balanceData, isLoading: balanceLoading } = useQuery({
    queryKey: ['userBalance'],
    queryFn: () => balanceApi.getBalance()
  })

  const { data: withdrawalData, isLoading: withdrawalLoading } = useQuery({
    queryKey: ['withdrawalRequests', currentPage],
    queryFn: () => balanceApi.getWithdrawalRequests({ page: currentPage, limit: 10 })
  })

  const balance = balanceData?.data?.balance || balanceData?.balance || 0
  const withdrawals = withdrawalData?.data?.requests || withdrawalData?.requests || []
  const pagination = withdrawalData?.data?.pagination || withdrawalData?.pagination || { total: 0, pages: 1 }

  const requestWithdrawalMutation = useMutation({
    mutationFn: ({ amount, paymentMethod, paymentDetails }) => balanceApi.requestWithdrawal(amount, paymentMethod, paymentDetails),
    onSuccess: () => {
      queryClient.invalidateQueries(['withdrawalRequests'])
      queryClient.invalidateQueries(['userBalance'])
      toast.success(tr('Withdrawal request submitted successfully!'))
      setWithdrawModal({ show: false, amount: '', paymentMethod: 'STRIPE', paymentDetails: '' })
    },
    onError: (error) => {
      const errorMessage = error?.response?.data?.message || error?.message || 'Failed to submit withdrawal request'
      toast.error(tr(errorMessage))
    }
  })

  const getStatusBadge = (status) => {
    const statusUpper = (status || '').toUpperCase()

    if (statusUpper === 'APPROVED' || statusUpper === 'COMPLETED') {
      return (
        <span
          className="badge badge-success"
          style={{
            backgroundColor: '#28a745',
            color: '#fff',
            padding: '6px 12px',
            borderRadius: '4px',
            fontSize: '13px',
            fontWeight: '500'
          }}
        >
          {tr(statusUpper === 'APPROVED' ? 'Approved' : 'Completed')}
        </span>
      )
    }

    if (statusUpper === 'PENDING') {
      return (
        <span
          className="badge badge-warning"
          style={{
            backgroundColor: '#ffc107',
            color: '#000',
            padding: '6px 12px',
            borderRadius: '4px',
            fontSize: '13px',
            fontWeight: '500'
          }}
        >
          {tr('Pending')}
        </span>
      )
    }

    if (statusUpper === 'REJECTED') {
      return (
        <span
          className="badge badge-danger"
          style={{
            backgroundColor: '#dc3545',
            color: '#fff',
            padding: '6px 12px',
            borderRadius: '4px',
            fontSize: '13px',
            fontWeight: '500'
          }}
        >
          {tr('Rejected')}
        </span>
      )
    }

    return (
      <span
        className="badge badge-secondary"
        style={{
          backgroundColor: '#6c757d',
          color: '#fff',
          padding: '6px 12px',
          borderRadius: '4px',
          fontSize: '13px',
          fontWeight: '500'
        }}
      >
        {tr(status || '—')}
      </span>
    )
  }

  const handleWithdrawRequest = () => {
    const amount = parseFloat(withdrawModal.amount)
    if (!amount || amount <= 0) {
      toast.error(tr('Please enter a valid amount'))
      return
    }
    if (amount > balance) {
      toast.error(tr('Insufficient balance'))
      return
    }
    if (!withdrawModal.paymentDetails) {
      toast.error(tr('Please enter payment details'))
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
          <div className="col-lg-4 col-xl-3 theiaStickySidebar">{}</div>

          <div className="col-lg-12 col-xl-12">
            <div className="payout-wrap">
              <div className="payout-title">
                <h4>{tr('Settings')}</h4>
                <p>{tr('All earnings will be sent to the selected payout method below.')}</p>
              </div>
              <div className="stripe-wrapper">
                <div className="stripe-box active">
                  <div className="stripe-img">
                    <img src="/assets/img/icons/stripe.svg" alt="img" />
                  </div>
                  <button
                    className="btn"
                    onClick={() => setWithdrawModal({ ...withdrawModal, show: true, paymentMethod: 'STRIPE' })}
                  >
                    <i className="fa-solid fa-gear"></i>{tr('Configure')}
                  </button>
                </div>
              </div>
              <div className="mt-3">
                <div className="d-flex justify-content-between align-items-center p-3 bg-light rounded">
                  <div>
                    <p className="mb-1 text-muted">{tr('Available Balance')}</p>
                    {balanceLoading ? <h4 className="mb-0">—</h4> : <h4 className="mb-0">{formatCurrency(balance)}</h4>}
                  </div>
                  <button
                    className="btn btn-primary"
                    onClick={() => setWithdrawModal({ ...withdrawModal, show: true })}
                    disabled={balanceLoading || balance <= 0}
                  >
                    {tr('Request Withdrawal')}
                  </button>
                </div>
              </div>
            </div>

            <div className="dashboard-header">
              <h3>{tr('Payouts')}</h3>
            </div>

            {withdrawalLoading && (
              <div className="text-center py-5">
                <div className="spinner-border" role="status">
                  <span className="visually-hidden">{tr('Loading...')}</span>
                </div>
              </div>
            )}

            {!withdrawalLoading && withdrawals.length === 0 && (
              <div className="text-center py-5">
                <p className="text-muted">{tr('No withdrawal requests found')}</p>
              </div>
            )}

            {!withdrawalLoading && withdrawals.length > 0 && (
              <div className="custom-table">
                <div className="table-responsive">
                  <table className="table table-center mb-0">
                    <thead>
                      <tr>
                        <th>{tr('Date')}</th>
                        <th>{tr('Payment Method')}</th>
                        <th>{tr('Amount')}</th>
                        <th>{tr('Fee')}</th>
                        <th>{tr('Total Deducted')}</th>
                        <th>{tr('Status')}</th>
                      </tr>
                    </thead>
                    <tbody>
                      {withdrawals.map((withdrawal) => (
                        <tr key={withdrawal._id}>
                          <td>{formatDate(withdrawal.requestedAt || withdrawal.createdAt)}</td>
                          <td>{withdrawal.paymentMethod || '—'}</td>
                          <td>
                            <strong>{formatCurrency(withdrawal.amount)}</strong>
                            {withdrawal.netAmount !== null &&
                              withdrawal.netAmount !== undefined &&
                              withdrawal.netAmount !== withdrawal.amount && (
                                <small className="d-block text-muted">
                                  {tr('You receive:')} {formatCurrency(withdrawal.netAmount)}
                                </small>
                              )}
                          </td>
                          <td>
                            {withdrawal.withdrawalFeePercent !== null && withdrawal.withdrawalFeePercent !== undefined ? (
                              <>
                                <span className="text-muted">{withdrawal.withdrawalFeePercent}%</span>
                                {withdrawal.withdrawalFeeAmount !== null && withdrawal.withdrawalFeeAmount !== undefined && (
                                  <small className="d-block text-muted">{formatCurrency(withdrawal.withdrawalFeeAmount)}</small>
                                )}
                              </>
                            ) : (
                              <span className="text-muted">{tr('No fee')}</span>
                            )}
                          </td>
                          <td>
                            {withdrawal.totalDeducted !== null && withdrawal.totalDeducted !== undefined ? (
                              <strong className="text-danger">{formatCurrency(withdrawal.totalDeducted)}</strong>
                            ) : (
                              <span>{formatCurrency(withdrawal.amount)}</span>
                            )}
                          </td>
                          <td>{getStatusBadge(withdrawal.status)}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            )}

            {!withdrawalLoading && pagination.pages > 1 && (
              <div className="pagination dashboard-pagination">
                <ul>
                  <li>
                    <button
                      className="page-link"
                      onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
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
                      onClick={() => setCurrentPage((p) => Math.min(pagination.pages, p + 1))}
                      disabled={currentPage === pagination.pages}
                    >
                      <i className="fa-solid fa-chevron-right"></i>
                    </button>
                  </li>
                </ul>
              </div>
            )}
          </div>
        </div>
      </div>

      {withdrawModal.show && (
        <div className="modal fade show" style={{ display: 'block' }} id="add_configure">
          <div className="modal-dialog modal-dialog-centered">
            <div className="modal-content">
              <div className="modal-header">
                <h5 className="modal-title">{tr('Request Withdrawal')}</h5>
                <button
                  type="button"
                  className="btn-close"
                  aria-label={tr('Close')}
                  onClick={() => setWithdrawModal({ show: false, amount: '', paymentMethod: 'STRIPE', paymentDetails: '' })}
                ></button>
              </div>
              <div className="modal-body">
                <div className="form-group mb-3">
                  <label>{tr('Available Balance')}</label>
                  <input type="text" className="form-control" value={formatCurrency(balance)} disabled />
                </div>
                <div className="form-group mb-3">
                  <label>
                    {tr('Amount to Withdraw')} <span className="text-danger">*</span>
                  </label>
                  <input
                    type="number"
                    className="form-control"
                    value={withdrawModal.amount}
                    onChange={(e) => setWithdrawModal({ ...withdrawModal, amount: e.target.value })}
                    placeholder={tr('Enter amount')}
                    min="0"
                    max={balance}
                    step="0.01"
                  />
                </div>
                <div className="form-group mb-3">
                  <label>
                    {tr('Payment Method')} <span className="text-danger">*</span>
                  </label>
                  <select
                    className="form-control"
                    value={withdrawModal.paymentMethod}
                    onChange={(e) => setWithdrawModal({ ...withdrawModal, paymentMethod: e.target.value })}
                  >
                    <option value="STRIPE">Stripe</option>
                    <option value="BANK">{tr('Bank Transfer')}</option>
                  </select>
                </div>
                <div className="form-group mb-3">
                  <label>
                    {tr('Payment Details')} <span className="text-danger">*</span>
                    <small className="text-muted d-block">
                      {withdrawModal.paymentMethod === 'STRIPE' && tr('Enter Stripe account details (Account ID or email)')}
                      {withdrawModal.paymentMethod === 'BANK' && tr('Enter bank account details')}
                    </small>
                  </label>
                  <textarea
                    className="form-control"
                    rows="3"
                    value={withdrawModal.paymentDetails}
                    onChange={(e) => setWithdrawModal({ ...withdrawModal, paymentDetails: e.target.value })}
                    placeholder={tr('Enter payment details...')}
                  ></textarea>
                </div>
              </div>
              <div className="modal-footer">
                <button
                  type="button"
                  className="btn btn-secondary"
                  onClick={() => setWithdrawModal({ show: false, amount: '', paymentMethod: 'STRIPE', paymentDetails: '' })}
                >
                  {tr('Cancel')}
                </button>
                <button
                  type="button"
                  className="btn btn-primary"
                  onClick={handleWithdrawRequest}
                  disabled={requestWithdrawalMutation.isPending || !withdrawModal.amount || !withdrawModal.paymentDetails}
                >
                  {tr(requestWithdrawalMutation.isPending ? 'Submitting...' : 'Submit Request')}
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

export default PharmacyPayment
