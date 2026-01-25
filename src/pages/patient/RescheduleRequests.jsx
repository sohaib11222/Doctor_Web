import { useState } from 'react'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { Link, useNavigate } from 'react-router-dom'
import { toast } from 'react-toastify'
import * as rescheduleApi from '../../api/rescheduleRequest'
import { useAuth } from '../../contexts/AuthContext'

const RescheduleRequests = () => {
  const { user } = useAuth()
  const navigate = useNavigate()
  const queryClient = useQueryClient()
  const [selectedRequest, setSelectedRequest] = useState(null)
  const [showPaymentModal, setShowPaymentModal] = useState(false)

  // Fetch reschedule requests
  const { data: requestsData, isLoading, error: requestsError } = useQuery({
    queryKey: ['rescheduleRequests'],
    queryFn: () => rescheduleApi.listRescheduleRequests(),
    enabled: !!user,
    retry: 1,
    onError: (error) => {
      // Don't show error toast here - let the component handle it
      console.error('Error fetching reschedule requests:', error)
    }
  })

  const requests = requestsData?.data || requestsData || []

  // Pay reschedule fee mutation
  const payFeeMutation = useMutation({
    mutationFn: ({ requestId, paymentMethod }) => 
      rescheduleApi.payRescheduleFee(requestId, paymentMethod),
    onSuccess: () => {
      toast.success('Reschedule fee paid successfully! Your appointment is now confirmed.')
      queryClient.invalidateQueries(['rescheduleRequests'])
      queryClient.invalidateQueries(['patientAppointments'])
      setShowPaymentModal(false)
      setSelectedRequest(null)
    },
    onError: (error) => {
      const errorMessage = error.response?.data?.message || error.message || 'Payment failed'
      toast.error(errorMessage)
    }
  })

  const handlePayFee = (request) => {
    setSelectedRequest(request)
    setShowPaymentModal(true)
  }

  const getStatusBadge = (status) => {
    const badges = {
      PENDING: { class: 'warning', text: 'Pending' },
      APPROVED: { class: 'success', text: 'Approved' },
      REJECTED: { class: 'danger', text: 'Rejected' },
      CANCELLED: { class: 'secondary', text: 'Cancelled' }
    }
    return badges[status] || { class: 'secondary', text: status }
  }

  const handlePayment = () => {
    if (!selectedRequest) return
    payFeeMutation.mutate({
      requestId: selectedRequest._id,
      paymentMethod: 'DUMMY' // You can integrate with actual payment gateway later
    })
  }

  return (
    <div className="page-wrapper">
      <div className="content">
        <div className="container">
          <div className="page-header">
            <div className="row">
              <div className="col-sm-12">
                <h3 className="page-title">My Reschedule Requests</h3>
              </div>
            </div>
          </div>

          {isLoading ? (
            <div className="card">
              <div className="card-body text-center py-5">
                <div className="spinner-border text-primary" role="status">
                  <span className="visually-hidden">Loading...</span>
                </div>
              </div>
            </div>
          ) : requestsError ? (
            <div className="card">
              <div className="card-body text-center py-5">
                <div className="alert alert-warning">
                  <h5>Unable to Load Reschedule Requests</h5>
                  <p className="text-muted">
                    {requestsError.response?.status === 404 
                      ? 'The reschedule request feature is not available. Please ensure the backend server has been restarted.'
                      : requestsError.response?.data?.message || requestsError.message || 'An error occurred while loading requests'}
                  </p>
                  <p className="text-muted small mt-2">
                    If you see a 404 error, please restart the backend server to load the new routes.
                  </p>
                </div>
              </div>
            </div>
          ) : requests.length === 0 ? (
            <div className="card">
              <div className="card-body text-center py-5">
                <p className="text-muted mb-3">No reschedule requests found</p>
                <Link to="/patient/request-reschedule" className="btn btn-primary">
                  Request Reschedule
                </Link>
              </div>
            </div>
          ) : (
            <div className="card">
              <div className="card-body">
                <div className="table-responsive">
                  <table className="table table-hover">
                    <thead>
                      <tr>
                        <th>Original Appointment</th>
                        <th>Reason</th>
                        <th>Status</th>
                        <th>Reschedule Fee</th>
                        <th>New Appointment</th>
                        <th>Actions</th>
                      </tr>
                    </thead>
                    <tbody>
                      {requests.map(request => {
                        const statusBadge = getStatusBadge(request.status)
                        return (
                          <tr key={request._id}>
                            <td>
                              {request.appointmentId ? (
                                <>
                                  {new Date(request.appointmentId.appointmentDate).toLocaleDateString()}
                                  <br />
                                  <small className="text-muted">{request.appointmentId.appointmentTime}</small>
                                  {request.appointmentId.appointmentNumber && (
                                    <>
                                      <br />
                                      <small className="text-muted">#{request.appointmentId.appointmentNumber}</small>
                                    </>
                                  )}
                                </>
                              ) : (
                                <span className="text-muted">N/A</span>
                              )}
                            </td>
                            <td>
                              <div style={{ maxWidth: '200px' }}>
                                {request.reason.substring(0, 50)}
                                {request.reason.length > 50 ? '...' : ''}
                              </div>
                            </td>
                            <td>
                              <span className={`badge bg-${statusBadge.class}`}>
                                {statusBadge.text}
                              </span>
                            </td>
                            <td>
                              {request.status === 'APPROVED' ? (
                                <strong>€{request.rescheduleFee?.toFixed(2) || '—'}</strong>
                              ) : (
                                <span className="text-muted">-</span>
                              )}
                            </td>
                            <td>
                              {request.newAppointmentId ? (
                                <Link 
                                  to={`/patient-appointment-details?id=${request.newAppointmentId._id || request.newAppointmentId}`}
                                  className="btn btn-sm btn-outline-primary"
                                >
                                  View Appointment
                                </Link>
                              ) : (
                                <span className="text-muted">-</span>
                              )}
                            </td>
                            <td>
                              {request.status === 'APPROVED' && 
                               request.newAppointmentId && 
                               request.newAppointmentId.paymentStatus !== 'PAID' && (
                                <button
                                  className="btn btn-sm btn-primary"
                                  onClick={() => handlePayFee(request)}
                                >
                                  Pay Fee
                                </button>
                              )}
                              {request.status === 'REJECTED' && request.rejectionReason && (
                                <button
                                  className="btn btn-sm btn-outline-secondary"
                                  title={request.rejectionReason}
                                  onClick={() => {
                                    toast.info(request.rejectionReason, { autoClose: 5000 })
                                  }}
                                >
                                  View Reason
                                </button>
                              )}
                            </td>
                          </tr>
                        )
                      })}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          )}

          {/* Payment Modal */}
          {showPaymentModal && selectedRequest && (
            <div className="modal show d-block" style={{ backgroundColor: 'rgba(0,0,0,0.5)', zIndex: 1050 }}>
              <div className="modal-dialog modal-dialog-centered">
                <div className="modal-content">
                  <div className="modal-header">
                    <h5 className="modal-title">Pay Reschedule Fee</h5>
                    <button
                      type="button"
                      className="btn-close"
                      onClick={() => {
                        setShowPaymentModal(false)
                        setSelectedRequest(null)
                      }}
                    ></button>
                  </div>
                  <div className="modal-body">
                    <p><strong>Reschedule Fee:</strong> €{selectedRequest.rescheduleFee?.toFixed(2)}</p>
                    <p className="text-muted small">
                      Original appointment fee: €{selectedRequest.originalAppointmentFee?.toFixed(2)}
                    </p>
                    <p className="text-muted small">
                      New appointment date: {selectedRequest.newAppointmentId ? 
                        new Date(selectedRequest.newAppointmentId.appointmentDate).toLocaleDateString() : '—'}
                    </p>
                    <div className="alert alert-info mt-3">
                      <small>Click "Confirm Payment" to proceed with the payment.</small>
                    </div>
                  </div>
                  <div className="modal-footer">
                    <button
                      type="button"
                      className="btn btn-secondary"
                      onClick={() => {
                        setShowPaymentModal(false)
                        setSelectedRequest(null)
                      }}
                      disabled={payFeeMutation.isLoading}
                    >
                      Cancel
                    </button>
                    <button
                      type="button"
                      className="btn btn-primary"
                      onClick={handlePayment}
                      disabled={payFeeMutation.isLoading}
                    >
                      {payFeeMutation.isLoading ? (
                        <>
                          <span className="spinner-border spinner-border-sm me-2" role="status"></span>
                          Processing...
                        </>
                      ) : (
                        'Confirm Payment'
                      )}
                    </button>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

export default RescheduleRequests
