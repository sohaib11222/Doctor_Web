import { useState } from 'react'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { toast } from 'react-toastify'
import * as rescheduleApi from '../../api/rescheduleRequest'
import { useAuth } from '../../contexts/AuthContext'

const DoctorRescheduleRequests = () => {
  const { user } = useAuth()
  const queryClient = useQueryClient()
  const [selectedRequest, setSelectedRequest] = useState(null)
  const [showApproveModal, setShowApproveModal] = useState(false)
  const [showRejectModal, setShowRejectModal] = useState(false)
  const [newDate, setNewDate] = useState('')
  const [newTime, setNewTime] = useState('')
  const [rescheduleFee, setRescheduleFee] = useState('')
  const [rescheduleFeePercentage, setRescheduleFeePercentage] = useState(50)
  const [doctorNotes, setDoctorNotes] = useState('')
  const [rejectionReason, setRejectionReason] = useState('')

  // Fetch pending reschedule requests
  const { data: requestsData, isLoading, error: requestsError } = useQuery({
    queryKey: ['doctorRescheduleRequests'],
    queryFn: () => rescheduleApi.listRescheduleRequests({ status: 'PENDING' }),
    enabled: !!user,
    retry: 1,
    onError: (error) => {
      // Don't show error toast here - let the component handle it
      console.error('Error fetching reschedule requests:', error)
    }
  })

  const requests = requestsData?.data || requestsData || []

  // Approve mutation
  const approveMutation = useMutation({
    mutationFn: (data) => rescheduleApi.approveRescheduleRequest(selectedRequest._id, data),
    onSuccess: () => {
      toast.success('Reschedule request approved successfully')
      queryClient.invalidateQueries(['doctorRescheduleRequests'])
      queryClient.invalidateQueries(['doctorAppointments'])
      setShowApproveModal(false)
      resetForm()
    },
    onError: (error) => {
      const errorMessage = error.response?.data?.message || error.message || 'Failed to approve request'
      toast.error(errorMessage)
    }
  })

  // Reject mutation
  const rejectMutation = useMutation({
    mutationFn: (rejectionReason) => 
      rescheduleApi.rejectRescheduleRequest(selectedRequest._id, rejectionReason),
    onSuccess: () => {
      toast.success('Reschedule request rejected')
      queryClient.invalidateQueries(['doctorRescheduleRequests'])
      setShowRejectModal(false)
      setRejectionReason('')
    },
    onError: (error) => {
      const errorMessage = error.response?.data?.message || error.message || 'Failed to reject request'
      toast.error(errorMessage)
    }
  })

  const handleApprove = () => {
    if (!newDate || !newTime) {
      toast.error('Please select new date and time')
      return
    }

    // Build approval payload - only include optional fields if they have values
    const approvalData = {
      newAppointmentDate: newDate,
      newAppointmentTime: newTime,
      rescheduleFeePercentage: Number(rescheduleFeePercentage) // Ensure it's a number
    }

    // Only add rescheduleFee if it has a value (fixed amount)
    if (rescheduleFee && rescheduleFee.trim()) {
      approvalData.rescheduleFee = parseFloat(rescheduleFee)
    }

    // Only add doctorNotes if it has a value
    if (doctorNotes && doctorNotes.trim()) {
      approvalData.doctorNotes = doctorNotes.trim()
    }

    approveMutation.mutate(approvalData)
  }

  const handleReject = () => {
    if (rejectionReason.trim().length < 10) {
      toast.error('Rejection reason must be at least 10 characters')
      return
    }
    rejectMutation.mutate(rejectionReason.trim())
  }

  const calculateFee = () => {
    if (!selectedRequest) return 0
    const originalFee = selectedRequest.originalAppointmentFee || 0
    if (rescheduleFee) {
      return Math.min(parseFloat(rescheduleFee), originalFee)
    }
    return (originalFee * rescheduleFeePercentage) / 100
  }

  const resetForm = () => {
    setNewDate('')
    setNewTime('')
    setRescheduleFee('')
    setRescheduleFeePercentage(50)
    setDoctorNotes('')
    setSelectedRequest(null)
  }

  const openApproveModal = (request) => {
    setSelectedRequest(request)
    // Set preferred date/time if available
    if (request.preferredDate) {
      const date = new Date(request.preferredDate)
      setNewDate(date.toISOString().split('T')[0])
    }
    if (request.preferredTime) {
      setNewTime(request.preferredTime)
    }
    setShowApproveModal(true)
  }

  return (
    <div className="page-wrapper">
      <div className="content">
        <div className="container">
          <div className="page-header">
            <div className="row">
              <div className="col-sm-12">
                <h3 className="page-title">Reschedule Requests</h3>
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
                <p className="text-muted">No pending reschedule requests</p>
              </div>
            </div>
          ) : (
            <div className="row">
              {requests.map(request => (
                <div key={request._id} className="col-md-6 mb-4">
                  <div className="card">
                    <div className="card-header">
                      <h5 className="card-title mb-0">
                        Request from {request.patientId?.fullName || 'Patient'}
                      </h5>
                    </div>
                    <div className="card-body">
                      <p><strong>Original Appointment:</strong></p>
                      <p className="mb-2">
                        {request.appointmentId ? (
                          <>
                            {new Date(request.appointmentId.appointmentDate).toLocaleDateString()} 
                            at {request.appointmentId.appointmentTime}
                            {request.appointmentId.appointmentNumber && (
                              <span className="text-muted"> (#{request.appointmentId.appointmentNumber})</span>
                            )}
                          </>
                        ) : (
                          '—'
                        )}
                      </p>
                      
                      <p><strong>Reason:</strong></p>
                      <p className="text-muted mb-3">{request.reason}</p>
                      
                      {request.preferredDate && (
                        <p className="mb-1">
                          <strong>Preferred Date:</strong> {new Date(request.preferredDate).toLocaleDateString()}
                        </p>
                      )}
                      {request.preferredTime && (
                        <p className="mb-1">
                          <strong>Preferred Time:</strong> {request.preferredTime}
                        </p>
                      )}
                      
                      <p className="mb-3">
                        <strong>Original Fee:</strong> ${request.originalAppointmentFee?.toFixed(2)}
                      </p>
                      
                      <div className="d-flex gap-2">
                        <button
                          className="btn btn-success"
                          onClick={() => openApproveModal(request)}
                        >
                          Approve
                        </button>
                        <button
                          className="btn btn-danger"
                          onClick={() => {
                            setSelectedRequest(request)
                            setShowRejectModal(true)
                          }}
                        >
                          Reject
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* Approve Modal */}
          {showApproveModal && selectedRequest && (
            <div className="modal show d-block" style={{ backgroundColor: 'rgba(0,0,0,0.5)', zIndex: 1050 }}>
              <div className="modal-dialog modal-lg modal-dialog-centered">
                <div className="modal-content">
                  <div className="modal-header">
                    <h5 className="modal-title">Approve Reschedule Request</h5>
                    <button
                      type="button"
                      className="btn-close"
                      onClick={() => {
                        setShowApproveModal(false)
                        resetForm()
                      }}
                    ></button>
                  </div>
                  <div className="modal-body">
                    <div className="mb-3">
                      <label className="form-label">New Appointment Date <span className="text-danger">*</span></label>
                      <input
                        type="date"
                        className="form-control"
                        value={newDate}
                        onChange={(e) => setNewDate(e.target.value)}
                        min={new Date().toISOString().split('T')[0]}
                        required
                      />
                    </div>
                    
                    <div className="mb-3">
                      <label className="form-label">New Appointment Time <span className="text-danger">*</span></label>
                      <input
                        type="time"
                        className="form-control"
                        value={newTime}
                        onChange={(e) => setNewTime(e.target.value)}
                        required
                      />
                    </div>

                    <div className="mb-3">
                      <label className="form-label">Reschedule Fee Percentage</label>
                      <div className="input-group">
                        <input
                          type="number"
                          className="form-control"
                          value={rescheduleFeePercentage}
                          onChange={(e) => {
                            const val = Math.min(100, Math.max(0, parseInt(e.target.value) || 0))
                            setRescheduleFeePercentage(val)
                            setRescheduleFee('') // Clear fixed amount when percentage changes
                          }}
                          min="0"
                          max="100"
                        />
                        <span className="input-group-text">%</span>
                      </div>
                      <small className="text-muted">
                        Default: 50% of original fee (${selectedRequest.originalAppointmentFee?.toFixed(2)})
                      </small>
                    </div>

                    <div className="mb-3">
                      <label className="form-label">Or Set Fixed Amount (Optional)</label>
                      <div className="input-group">
                        <span className="input-group-text">$</span>
                        <input
                          type="number"
                          className="form-control"
                          value={rescheduleFee}
                          onChange={(e) => {
                            setRescheduleFee(e.target.value)
                            if (e.target.value) {
                              // Calculate percentage when fixed amount is set
                              const percentage = (parseFloat(e.target.value) / selectedRequest.originalAppointmentFee) * 100
                              setRescheduleFeePercentage(Math.min(100, Math.max(0, percentage)))
                            }
                          }}
                          min="0"
                          max={selectedRequest.originalAppointmentFee}
                          step="0.01"
                        />
                      </div>
                    </div>

                    <div className="alert alert-info">
                      <strong>Calculated Fee:</strong> ${calculateFee().toFixed(2)}
                      <br />
                      <small>
                        Original Fee: ${selectedRequest.originalAppointmentFee?.toFixed(2)} | 
                        Reschedule Fee: ${calculateFee().toFixed(2)} | 
                        Savings: ${(selectedRequest.originalAppointmentFee - calculateFee()).toFixed(2)}
                      </small>
                    </div>

                    <div className="mb-3">
                      <label className="form-label">Notes (Optional)</label>
                      <textarea
                        className="form-control"
                        rows="3"
                        value={doctorNotes}
                        onChange={(e) => setDoctorNotes(e.target.value)}
                        placeholder="Optional notes for the patient"
                        maxLength={500}
                      />
                    </div>
                  </div>
                  <div className="modal-footer">
                    <button
                      type="button"
                      className="btn btn-secondary"
                      onClick={() => {
                        setShowApproveModal(false)
                        resetForm()
                      }}
                      disabled={approveMutation.isLoading}
                    >
                      Cancel
                    </button>
                    <button
                      type="button"
                      className="btn btn-success"
                      onClick={handleApprove}
                      disabled={approveMutation.isLoading || !newDate || !newTime}
                    >
                      {approveMutation.isLoading ? (
                        <>
                          <span className="spinner-border spinner-border-sm me-2" role="status"></span>
                          Approving...
                        </>
                      ) : (
                        'Approve & Create Appointment'
                      )}
                    </button>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Reject Modal */}
          {showRejectModal && selectedRequest && (
            <div className="modal show d-block" style={{ backgroundColor: 'rgba(0,0,0,0.5)', zIndex: 1050 }}>
              <div className="modal-dialog modal-dialog-centered">
                <div className="modal-content">
                  <div className="modal-header">
                    <h5 className="modal-title">Reject Reschedule Request</h5>
                    <button
                      type="button"
                      className="btn-close"
                      onClick={() => {
                        setShowRejectModal(false)
                        setRejectionReason('')
                        setSelectedRequest(null)
                      }}
                    ></button>
                  </div>
                  <div className="modal-body">
                    <div className="mb-3">
                      <label className="form-label">Rejection Reason <span className="text-danger">*</span></label>
                      <textarea
                        className="form-control"
                        rows="4"
                        value={rejectionReason}
                        onChange={(e) => setRejectionReason(e.target.value)}
                        placeholder="Please provide a reason for rejecting this request (minimum 10 characters)"
                        required
                        minLength={10}
                        maxLength={500}
                      />
                      <small className="text-muted">
                        {rejectionReason.length}/500 characters (minimum 10 required)
                      </small>
                    </div>
                  </div>
                  <div className="modal-footer">
                    <button
                      type="button"
                      className="btn btn-secondary"
                      onClick={() => {
                        setShowRejectModal(false)
                        setRejectionReason('')
                        setSelectedRequest(null)
                      }}
                      disabled={rejectMutation.isLoading}
                    >
                      Cancel
                    </button>
                    <button
                      type="button"
                      className="btn btn-danger"
                      onClick={handleReject}
                      disabled={rejectMutation.isLoading || rejectionReason.trim().length < 10}
                    >
                      {rejectMutation.isLoading ? (
                        <>
                          <span className="spinner-border spinner-border-sm me-2" role="status"></span>
                          Rejecting...
                        </>
                      ) : (
                        'Reject Request'
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

export default DoctorRescheduleRequests
