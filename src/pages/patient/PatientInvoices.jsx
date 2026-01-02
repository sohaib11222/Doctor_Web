import { useState, useMemo } from 'react'
import { Link } from 'react-router-dom'
import { useQuery } from '@tanstack/react-query'
import * as paymentApi from '../../api/payment'

const PatientInvoices = () => {
  const [searchQuery, setSearchQuery] = useState('')
  const [currentPage, setCurrentPage] = useState(1)
  const [statusFilter, setStatusFilter] = useState('')
  const [viewTransaction, setViewTransaction] = useState(null)

  // Fetch payment history
  const { data: paymentHistoryResponse, isLoading } = useQuery({
    queryKey: ['patientPaymentHistory', statusFilter, currentPage],
    queryFn: () => paymentApi.getPatientPaymentHistory({
      status: statusFilter || undefined,
      page: currentPage,
      limit: 20
    }),
    keepPreviousData: true
  })

  // Extract transactions and pagination
  const paymentHistoryData = paymentHistoryResponse?.data || paymentHistoryResponse
  const transactions = paymentHistoryData?.transactions || []
  const pagination = paymentHistoryData?.pagination || { page: 1, limit: 20, total: 0, pages: 1 }

  // Filter transactions by search query
  const filteredTransactions = useMemo(() => {
    if (!searchQuery.trim()) return transactions
    const query = searchQuery.toLowerCase()
    return transactions.filter(transaction => {
      const doctorName = transaction.doctorName || 
                        (transaction.relatedAppointmentId?.doctorId?.fullName) || 
                        ''
      const appointmentNumber = transaction.relatedAppointmentId?.appointmentNumber || ''
      const transactionId = transaction._id || ''
      return (
        doctorName.toLowerCase().includes(query) ||
        appointmentNumber.toLowerCase().includes(query) ||
        transactionId.toLowerCase().includes(query)
      )
    })
  }, [transactions, searchQuery])

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

  // Get status badge class
  const getStatusBadge = (status) => {
    const badges = {
      SUCCESS: 'badge-success',
      PENDING: 'badge-warning',
      FAILED: 'badge-danger',
      REFUNDED: 'badge-info'
    }
    return badges[status] || 'badge-secondary'
  }

  // Get transaction type
  const getTransactionType = (transaction) => {
    if (transaction.relatedAppointmentId) return 'Appointment'
    if (transaction.relatedSubscriptionId) return 'Subscription'
    if (transaction.relatedProductId) return 'Product'
    return 'Other'
  }

  return (
    <div className="content doctor-content">
      <div className="container">
        <div className="row">
          <div className="col-lg-4 col-xl-3 theiaStickySidebar">
            {/* PatientSidebar will be rendered by DashboardLayout */}
          </div>
          <div className="col-lg-12 col-xl-12">
            <div className="dashboard-header">
              <h3>Invoices</h3>
              <ul className="header-list-btns">
                <li>
                  <div className="input-block dash-search-input">
                    <input 
                      type="text" 
                      className="form-control" 
                      placeholder="Search by doctor, appointment number..." 
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                    />
                    <span className="search-icon"><i className="isax isax-search-normal"></i></span>
                  </div>
                </li>
                <li>
                  <select 
                    className="form-select" 
                    value={statusFilter}
                    onChange={(e) => {
                      setStatusFilter(e.target.value)
                      setCurrentPage(1)
                    }}
                    style={{ minWidth: '150px' }}
                  >
                    <option value="">All Status</option>
                    <option value="SUCCESS">Success</option>
                    <option value="PENDING">Pending</option>
                    <option value="FAILED">Failed</option>
                    <option value="REFUNDED">Refunded</option>
                  </select>
                </li>
              </ul>
            </div>

            {isLoading ? (
              <div className="text-center py-5">
                <div className="spinner-border" role="status">
                  <span className="visually-hidden">Loading...</span>
                </div>
              </div>
            ) : filteredTransactions.length === 0 ? (
              <div className="text-center py-5">
                <p className="text-muted">No invoices found</p>
              </div>
            ) : (
              <>
                <div className="custom-table">
                  <div className="table-responsive">
                    <table className="table table-center mb-0">
                      <thead>
                        <tr>
                          <th>Transaction ID</th>
                          <th>Type</th>
                          <th>Doctor</th>
                          <th>Appointment Date</th>
                          <th>Payment Date</th>
                          <th>Amount</th>
                          <th>Status</th>
                          <th>Action</th>
                        </tr>
                      </thead>
                      <tbody>
                        {filteredTransactions.map((transaction) => {
                          const doctor = transaction.relatedAppointmentId?.doctorId
                          const doctorName = transaction.doctorName || doctor?.fullName || 'N/A'
                          const doctorImage = doctor?.profileImage || '/assets/img/doctors/doctor-thumb-01.jpg'
                          const appointmentDate = transaction.relatedAppointmentId?.appointmentDate
                          const appointmentNumber = transaction.relatedAppointmentId?.appointmentNumber
                          
                          return (
                            <tr key={transaction._id}>
                              <td>
                                <a 
                                  href="javascript:void(0);" 
                                  className="link-primary" 
                                  onClick={() => setViewTransaction(transaction)}
                                >
                                  #{transaction._id.slice(-8).toUpperCase()}
                                </a>
                              </td>
                              <td>
                                <span className="badge badge-info">{getTransactionType(transaction)}</span>
                              </td>
                              <td>
                                {doctor ? (
                                  <h2 className="table-avatar">
                                    <Link to={`/doctor-profile?id=${doctor._id || doctor}`} className="avatar avatar-sm me-2">
                                      <img 
                                        className="avatar-img rounded-3" 
                                        src={doctorImage} 
                                        alt="Doctor" 
                                        onError={(e) => {
                                          e.target.src = '/assets/img/doctors/doctor-thumb-01.jpg'
                                        }}
                                      />
                                    </Link>
                                    <Link to={`/doctor-profile?id=${doctor._id || doctor}`}>{doctorName}</Link>
                                  </h2>
                                ) : (
                                  <span className="text-muted">N/A</span>
                                )}
                              </td>
                              <td>
                                {appointmentDate ? formatDate(appointmentDate) : 'N/A'}
                                {appointmentNumber && (
                                  <div className="text-muted small">#{appointmentNumber}</div>
                                )}
                              </td>
                              <td>{formatDate(transaction.createdAt)}</td>
                              <td>
                                <strong>{formatCurrency(transaction.amount, transaction.currency)}</strong>
                              </td>
                              <td>
                                <span className={`badge ${getStatusBadge(transaction.status)}`}>
                                  {transaction.status || 'N/A'}
                                </span>
                              </td>
                              <td>
                                <div className="action-item">
                                  <a 
                                    href="javascript:void(0);" 
                                    onClick={() => setViewTransaction(transaction)}
                                    title="View Details"
                                  >
                                    <i className="isax isax-link-2"></i>
                                  </a>
                                  <a 
                                    href="javascript:void(0);" 
                                    onClick={() => {
                                      // Generate invoice PDF or download
                                      window.print()
                                    }}
                                    title="Download"
                                  >
                                    <i className="isax isax-import"></i>
                                  </a>
                                </div>
                              </td>
                            </tr>
                          )
                        })}
                      </tbody>
                    </table>
                  </div>
                </div>

                {/* Pagination */}
                {pagination.pages > 1 && (
                  <div className="pagination dashboard-pagination">
                    <ul>
                      <li>
                        <a 
                          href="#" 
                          className={`page-link prev ${currentPage === 1 ? 'disabled' : ''}`}
                          onClick={(e) => {
                            e.preventDefault()
                            if (currentPage > 1) setCurrentPage(currentPage - 1)
                          }}
                        >
                          Prev
                        </a>
                      </li>
                      {[...Array(pagination.pages)].map((_, i) => {
                        const page = i + 1
                        if (page === 1 || page === pagination.pages || (page >= currentPage - 1 && page <= currentPage + 1)) {
                          return (
                            <li key={page}>
                              <a 
                                href="#" 
                                className={`page-link ${currentPage === page ? 'active' : ''}`}
                                onClick={(e) => {
                                  e.preventDefault()
                                  setCurrentPage(page)
                                }}
                              >
                                {page}
                              </a>
                            </li>
                          )
                        } else if (page === currentPage - 2 || page === currentPage + 2) {
                          return <li key={page}><span className="page-link">...</span></li>
                        }
                        return null
                      })}
                      <li>
                        <a 
                          href="#" 
                          className={`page-link next ${currentPage === pagination.pages ? 'disabled' : ''}`}
                          onClick={(e) => {
                            e.preventDefault()
                            if (currentPage < pagination.pages) setCurrentPage(currentPage + 1)
                          }}
                        >
                          Next
                        </a>
                      </li>
                    </ul>
                  </div>
                )}
              </>
            )}
          </div>
        </div>
      </div>

      {/* View Transaction Modal */}
      {viewTransaction && (
        <>
          <div 
            className="modal-backdrop fade show" 
            onClick={() => setViewTransaction(null)}
            style={{ zIndex: 1040 }}
          ></div>
          <div 
            className="modal fade show" 
            style={{ display: 'block', zIndex: 1050 }} 
            id="invoice_view"
            onClick={(e) => {
              if (e.target.id === 'invoice_view') {
                setViewTransaction(null)
              }
            }}
          >
            <div className="modal-dialog modal-dialog-centered modal-lg" onClick={(e) => e.stopPropagation()}>
              <div className="modal-content">
                <div className="modal-header">
                  <h5 className="modal-title">Transaction Details</h5>
                  <button type="button" className="btn-close" onClick={() => setViewTransaction(null)}></button>
                </div>
                <div className="modal-body">
                  <div className="invoice-details">
                    <div className="row mb-3">
                      <div className="col-md-6">
                        <strong>Transaction ID:</strong>
                        <p>#{viewTransaction._id.slice(-8).toUpperCase()}</p>
                      </div>
                      <div className="col-md-6">
                        <strong>Status:</strong>
                        <p>
                          <span className={`badge ${getStatusBadge(viewTransaction.status)}`}>
                            {viewTransaction.status || 'N/A'}
                          </span>
                        </p>
                      </div>
                    </div>
                    <div className="row mb-3">
                      <div className="col-md-6">
                        <strong>Transaction Type:</strong>
                        <p>{getTransactionType(viewTransaction)}</p>
                      </div>
                      <div className="col-md-6">
                        <strong>Amount:</strong>
                        <p className="h5">{formatCurrency(viewTransaction.amount, viewTransaction.currency)}</p>
                      </div>
                    </div>
                    {viewTransaction.relatedAppointmentId && (
                      <>
                        <div className="row mb-3">
                          <div className="col-md-6">
                            <strong>Appointment Number:</strong>
                            <p>{viewTransaction.relatedAppointmentId.appointmentNumber || 'N/A'}</p>
                          </div>
                          <div className="col-md-6">
                            <strong>Appointment Date:</strong>
                            <p>{formatDate(viewTransaction.relatedAppointmentId.appointmentDate)}</p>
                          </div>
                        </div>
                        {viewTransaction.relatedAppointmentId.doctorId && (
                          <div className="row mb-3">
                            <div className="col-md-12">
                              <strong>Doctor:</strong>
                              <p>
                                {typeof viewTransaction.relatedAppointmentId.doctorId === 'object' 
                                  ? viewTransaction.relatedAppointmentId.doctorId.fullName 
                                  : 'N/A'}
                              </p>
                            </div>
                          </div>
                        )}
                      </>
                    )}
                    <div className="row mb-3">
                      <div className="col-md-6">
                        <strong>Payment Date:</strong>
                        <p>{formatDate(viewTransaction.createdAt)}</p>
                      </div>
                      <div className="col-md-6">
                        <strong>Payment Method:</strong>
                        <p>{viewTransaction.provider || 'N/A'}</p>
                      </div>
                    </div>
                    {viewTransaction.providerReference && (
                      <div className="row mb-3">
                        <div className="col-md-12">
                          <strong>Provider Reference:</strong>
                          <p>{viewTransaction.providerReference}</p>
                        </div>
                      </div>
                    )}
                  </div>
                </div>
                <div className="modal-footer">
                  <button type="button" className="btn btn-secondary" onClick={() => setViewTransaction(null)}>
                    Close
                  </button>
                  <button 
                    type="button" 
                    className="btn btn-primary"
                    onClick={() => window.print()}
                  >
                    Print Invoice
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

export default PatientInvoices

