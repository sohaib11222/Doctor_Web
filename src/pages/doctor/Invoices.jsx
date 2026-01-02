import { useState, useMemo } from 'react'
import { useQuery } from '@tanstack/react-query'
import { useAuth } from '../../contexts/AuthContext'
import * as paymentApi from '../../api/payment'
import * as appointmentApi from '../../api/appointments'

const Invoices = () => {
  const { user } = useAuth()
  const [searchQuery, setSearchQuery] = useState('')
  const [selectedTransaction, setSelectedTransaction] = useState(null)
  const [page, setPage] = useState(1)
  const limit = 10

  // Fetch transactions (subscription payments where userId = doctorId)
  const { data: transactionsData, isLoading: transactionsLoading, error: transactionsError } = useQuery({
    queryKey: ['doctorTransactions', page],
    queryFn: () => {
      const params = {
        page,
        limit
      }
      return paymentApi.getTransactions(params)
    },
    enabled: !!user
  })

  // Fetch appointments to get appointment-related transactions
  // Note: This is a workaround since appointment payments have patient as userId
  // Ideally, backend should provide an endpoint to get all transactions for doctor's appointments
  const { data: appointmentsData } = useQuery({
    queryKey: ['doctorAppointmentsForInvoices'],
    queryFn: () => {
      return appointmentApi.listAppointments({ page: 1, limit: 1000 })
    },
    enabled: !!user
  })

  // Extract transactions from response
  const transactions = useMemo(() => {
    if (!transactionsData) return []
    // Axios interceptor returns response.data = { success, message, data: {...} }
    const responseData = transactionsData.data || transactionsData
    return responseData.transactions || []
  }, [transactionsData])

  // Extract appointments from response
  const appointments = useMemo(() => {
    if (!appointmentsData) return []
    const data = appointmentsData.data || appointmentsData
    return data.appointments || []
  }, [appointmentsData])

  // Get pagination info
  const pagination = useMemo(() => {
    if (!transactionsData) return null
    const responseData = transactionsData.data || transactionsData
    return responseData.pagination || null
  }, [transactionsData])

  // Filter transactions by search query
  const filteredTransactions = useMemo(() => {
    let filtered = [...transactions]

    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase()
      filtered = filtered.filter(transaction => {
        const transactionId = (transaction._id || '').toLowerCase()
        const patientName = transaction.relatedAppointmentId?.patientId?.fullName?.toLowerCase() || ''
        const appointmentNumber = (transaction.relatedAppointmentId?.appointmentNumber || '').toLowerCase()
        const provider = (transaction.provider || '').toLowerCase()
        const providerRef = (transaction.providerReference || '').toLowerCase()
        
        return transactionId.includes(query) || 
               patientName.includes(query) || 
               appointmentNumber.includes(query) ||
               provider.includes(query) ||
               providerRef.includes(query)
      })
    }

    return filtered
  }, [transactions, searchQuery])

  // Format date
  const formatDate = (date) => {
    if (!date) return 'N/A'
    const d = new Date(date)
    return d.toLocaleDateString('en-US', { day: 'numeric', month: 'short', year: 'numeric' })
  }

  // Format date and time
  const formatDateTime = (date, time) => {
    if (!date) return 'N/A'
    const d = new Date(date)
    const dateStr = d.toLocaleDateString('en-US', { day: 'numeric', month: 'short', year: 'numeric' })
    return time ? `${dateStr} ${time}` : dateStr
  }

  // Format currency
  const formatCurrency = (amount, currency = 'USD') => {
    if (amount === null || amount === undefined) return 'N/A'
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: currency || 'USD'
    }).format(amount)
  }

  // Get transaction type
  const getTransactionType = (transaction) => {
    if (transaction.relatedAppointmentId) return 'Appointment'
    if (transaction.relatedSubscriptionId) return 'Subscription'
    if (transaction.relatedProductId) return 'Product'
    return 'Other'
  }

  // Get status badge class
  const getStatusBadge = (status) => {
    const badges = {
      'SUCCESS': 'badge-success',
      'PENDING': 'badge-warning',
      'FAILED': 'badge-danger',
      'REFUNDED': 'badge-secondary'
    }
    return badges[status] || 'badge-secondary'
  }

  // Handle view transaction
  const handleViewTransaction = async (transactionId) => {
    try {
      const transaction = await paymentApi.getTransactionById(transactionId)
      const data = transaction.data || transaction
      setSelectedTransaction(data)
      // Open modal (you can use Bootstrap modal or create a custom modal)
      const modal = new window.bootstrap.Modal(document.getElementById('invoice_view'))
      modal.show()
    } catch (error) {
      console.error('Error fetching transaction:', error)
    }
  }

  // Handle print
  const handlePrint = (transaction) => {
    window.print()
  }

  // Handle page change
  const handlePageChange = (newPage) => {
    setPage(newPage)
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  if (transactionsLoading) {
    return (
      <>
        <div className="dashboard-header">
          <h3>Invoices</h3>
        </div>
        <div className="text-center py-5">
          <div className="spinner-border" role="status">
            <span className="visually-hidden">Loading...</span>
          </div>
        </div>
      </>
    )
  }

  if (transactionsError) {
    console.error('Error loading transactions:', transactionsError)
  }

  return (
    <>
      <div className="dashboard-header">
        <h3>Invoices</h3>
      </div>

      <div className="search-header">
        <div className="search-field">
          <input
            type="text"
            className="form-control"
            placeholder="Search by ID, Patient, Appointment Number..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
          <span className="search-icon"><i className="fa-solid fa-magnifying-glass"></i></span>
        </div>
      </div>

      <div className="custom-table">
        <div className="table-responsive">
          <table className="table table-center mb-0">
            <thead>
              <tr>
                <th>ID</th>
                <th>Type</th>
                <th>Patient/Details</th>
                <th>Appointment Date</th>
                <th>Transaction Date</th>
                <th>Amount</th>
                <th>Status</th>
                <th>Action</th>
              </tr>
            </thead>
            <tbody>
              {filteredTransactions.length === 0 ? (
                <tr>
                  <td colSpan="8" className="text-center py-5">
                    <i className="fe fe-file-text" style={{ fontSize: '48px', color: '#dee2e6' }}></i>
                    <p className="mt-3 mb-0">No invoices found</p>
                    <p className="text-muted small">You don't have any transactions yet.</p>
                  </td>
                </tr>
              ) : (
                filteredTransactions.map((transaction) => {
                  const appointment = transaction.relatedAppointmentId
                  const patient = appointment?.patientId || (typeof appointment?.patientId === 'object' ? appointment?.patientId : null)
                  const transactionType = getTransactionType(transaction)
                  
                  return (
                    <tr key={transaction._id}>
                      <td>
                        <a
                          href="javascript:void(0);"
                          className="text-blue-600"
                          onClick={() => handleViewTransaction(transaction._id)}
                        >
                          #{transaction._id.slice(-8).toUpperCase()}
                        </a>
                      </td>
                      <td>
                        <span className="badge badge-info">{transactionType}</span>
                      </td>
                      <td>
                        {patient ? (
                          <h2 className="table-avatar">
                            <a
                              href={`/patient-profile?patientId=${patient._id || patient}`}
                              className="avatar avatar-sm me-2"
                            >
                              <img
                                className="avatar-img rounded-3"
                                src={patient.profileImage || '/assets/img/doctors/doctor-thumb-02.jpg'}
                                alt={patient.fullName || 'Patient'}
                                onError={(e) => {
                                  e.target.src = '/assets/img/doctors/doctor-thumb-02.jpg'
                                }}
                              />
                            </a>
                            <a href={`/patient-profile?patientId=${patient._id || patient}`}>
                              {patient.fullName || 'Unknown Patient'}
                            </a>
                          </h2>
                        ) : transactionType === 'Subscription' ? (
                          <span className="text-muted">Subscription Payment</span>
                        ) : (
                          <span className="text-muted">N/A</span>
                        )}
                      </td>
                      <td>
                        {appointment
                          ? formatDateTime(appointment.appointmentDate, appointment.appointmentTime)
                          : 'N/A'}
                      </td>
                      <td>{formatDate(transaction.createdAt)}</td>
                      <td>
                        <strong>{formatCurrency(transaction.amount, transaction.currency)}</strong>
                      </td>
                      <td>
                        <span className={`badge ${getStatusBadge(transaction.status)}`}>
                          {transaction.status}
                        </span>
                      </td>
                      <td>
                        <div className="action-item">
                          <a
                            href="javascript:void(0);"
                            onClick={() => handleViewTransaction(transaction._id)}
                            title="View Invoice"
                          >
                            <i className="isax isax-link-2"></i>
                          </a>
                          <a
                            href="javascript:void(0);"
                            onClick={() => handlePrint(transaction)}
                            title="Print Invoice"
                          >
                            <i className="isax isax-printer5"></i>
                          </a>
                        </div>
                      </td>
                    </tr>
                  )
                })
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Pagination */}
      {pagination && pagination.pages > 1 && (
        <div className="pagination dashboard-pagination">
          <ul>
            <li>
              <a
                href="javascript:void(0);"
                className={`page-link ${page === 1 ? 'disabled' : ''}`}
                onClick={() => page > 1 && handlePageChange(page - 1)}
              >
                <i className="fa-solid fa-chevron-left"></i>
              </a>
            </li>
            {Array.from({ length: Math.min(pagination.pages, 5) }, (_, i) => {
              let pageNum
              if (pagination.pages <= 5) {
                pageNum = i + 1
              } else if (page <= 3) {
                pageNum = i + 1
              } else if (page >= pagination.pages - 2) {
                pageNum = pagination.pages - 4 + i
              } else {
                pageNum = page - 2 + i
              }
              
              return (
                <li key={pageNum}>
                  <a
                    href="javascript:void(0);"
                    className={`page-link ${page === pageNum ? 'active' : ''}`}
                    onClick={() => handlePageChange(pageNum)}
                  >
                    {pageNum}
                  </a>
                </li>
              )
            })}
            {pagination.pages > 5 && page < pagination.pages - 2 && (
              <li>
                <a href="javascript:void(0);" className="page-link">...</a>
              </li>
            )}
            <li>
              <a
                href="javascript:void(0);"
                className={`page-link ${page === pagination.pages ? 'disabled' : ''}`}
                onClick={() => page < pagination.pages && handlePageChange(page + 1)}
              >
                <i className="fa-solid fa-chevron-right"></i>
              </a>
            </li>
          </ul>
        </div>
      )}

      {/* Invoice View Modal */}
      <div className="modal fade" id="invoice_view" tabIndex="-1" aria-hidden="true">
        <div className="modal-dialog modal-lg modal-dialog-centered">
          <div className="modal-content">
            <div className="modal-header">
              <h5 className="modal-title">Invoice Details</h5>
              <button
                type="button"
                className="btn-close"
                data-bs-dismiss="modal"
                aria-label="Close"
              ></button>
            </div>
            <div className="modal-body">
              {selectedTransaction ? (
                <div className="invoice-details">
                  <div className="row mb-3">
                    <div className="col-md-6">
                      <h6>Transaction ID</h6>
                      <p>#{selectedTransaction._id.slice(-8).toUpperCase()}</p>
                    </div>
                    <div className="col-md-6 text-end">
                      <h6>Status</h6>
                      <span className={`badge ${getStatusBadge(selectedTransaction.status)}`}>
                        {selectedTransaction.status}
                      </span>
                    </div>
                  </div>
                  
                  <div className="row mb-3">
                    <div className="col-md-6">
                      <h6>Transaction Type</h6>
                      <p>{getTransactionType(selectedTransaction)}</p>
                    </div>
                    <div className="col-md-6">
                      <h6>Amount</h6>
                      <p className="h5">{formatCurrency(selectedTransaction.amount, selectedTransaction.currency)}</p>
                    </div>
                  </div>

                  {selectedTransaction.relatedAppointmentId && (
                    <div className="row mb-3">
                      <div className="col-md-6">
                        <h6>Appointment Date</h6>
                        <p>
                          {formatDateTime(
                            selectedTransaction.relatedAppointmentId.appointmentDate,
                            selectedTransaction.relatedAppointmentId.appointmentTime
                          )}
                        </p>
                      </div>
                      <div className="col-md-6">
                        <h6>Appointment Number</h6>
                        <p>{selectedTransaction.relatedAppointmentId.appointmentNumber || 'N/A'}</p>
                      </div>
                    </div>
                  )}

                  <div className="row mb-3">
                    <div className="col-md-6">
                      <h6>Payment Method</h6>
                      <p>{selectedTransaction.provider || 'N/A'}</p>
                    </div>
                    <div className="col-md-6">
                      <h6>Transaction Date</h6>
                      <p>{formatDate(selectedTransaction.createdAt)}</p>
                    </div>
                  </div>

                  {selectedTransaction.providerReference && (
                    <div className="row mb-3">
                      <div className="col-md-12">
                        <h6>Provider Reference</h6>
                        <p>{selectedTransaction.providerReference}</p>
                      </div>
                    </div>
                  )}
                </div>
              ) : (
                <p>Loading...</p>
              )}
            </div>
            <div className="modal-footer">
              <button
                type="button"
                className="btn btn-secondary"
                data-bs-dismiss="modal"
              >
                Close
              </button>
              <button
                type="button"
                className="btn btn-primary"
                onClick={() => handlePrint(selectedTransaction)}
              >
                <i className="isax isax-printer5 me-2"></i>
                Print
              </button>
            </div>
          </div>
        </div>
      </div>
    </>
  )
}

export default Invoices
