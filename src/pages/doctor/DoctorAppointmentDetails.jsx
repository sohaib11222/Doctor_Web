import { useState, useEffect } from 'react'
import { Link, useNavigate, useSearchParams } from 'react-router-dom'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { toast } from 'react-toastify'
import * as appointmentApi from '../../api/appointments'

const DoctorAppointmentDetails = () => {
  const navigate = useNavigate()
  const queryClient = useQueryClient()
  const [searchParams] = useSearchParams()
  const appointmentId = searchParams.get('id')

  const [rejectModal, setRejectModal] = useState({ show: false, reason: '' })

  // Fetch appointment details
  const { data: appointmentData, isLoading, error, refetch } = useQuery({
    queryKey: ['appointmentDetails', appointmentId],
    queryFn: async () => {
      if (!appointmentId) throw new Error('Appointment ID is required')
      const response = await appointmentApi.getAppointmentById(appointmentId)
      return response.data || response
    },
    enabled: !!appointmentId
  })

  // Accept appointment mutation
  const acceptMutation = useMutation({
    mutationFn: (id) => appointmentApi.acceptAppointment(id),
    onSuccess: () => {
      queryClient.invalidateQueries(['appointmentDetails', appointmentId])
      queryClient.invalidateQueries(['doctorAppointments'])
      toast.success('Appointment accepted successfully!')
      refetch()
    },
    onError: (error) => {
      const errorMessage = error.response?.data?.message || error.message || 'Failed to accept appointment'
      toast.error(errorMessage)
    }
  })

  // Reject appointment mutation
  const rejectMutation = useMutation({
    mutationFn: ({ appointmentId, reason }) => appointmentApi.rejectAppointment(appointmentId, reason),
    onSuccess: () => {
      queryClient.invalidateQueries(['appointmentDetails', appointmentId])
      queryClient.invalidateQueries(['doctorAppointments'])
      toast.success('Appointment rejected successfully!')
      setRejectModal({ show: false, reason: '' })
      refetch()
    },
    onError: (error) => {
      const errorMessage = error.response?.data?.message || error.message || 'Failed to reject appointment'
      toast.error(errorMessage)
    }
  })

  // Update status mutation
  const updateStatusMutation = useMutation({
    mutationFn: ({ appointmentId, status }) => appointmentApi.updateAppointmentStatus(appointmentId, { status }),
    onSuccess: () => {
      queryClient.invalidateQueries(['appointmentDetails', appointmentId])
      queryClient.invalidateQueries(['doctorAppointments'])
      toast.success('Appointment status updated successfully!')
      refetch()
    },
    onError: (error) => {
      const errorMessage = error.response?.data?.message || error.message || 'Failed to update appointment status'
      toast.error(errorMessage)
    }
  })

  // Format date for display
  const formatDate = (dateString) => {
    if (!dateString) return 'N/A'
    const date = new Date(dateString)
    return date.toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' })
  }

  // Format time for display
  const formatTime = (timeString) => {
    if (!timeString) return 'N/A'
    const [hours, minutes] = timeString.split(':')
    const hour = parseInt(hours)
    const ampm = hour >= 12 ? 'PM' : 'AM'
    const hour12 = hour % 12 || 12
    return `${hour12}:${minutes} ${ampm}`
  }

  // Format date and time together
  const formatDateTime = (dateString, timeString) => {
    return `${formatDate(dateString)} - ${formatTime(timeString)}`
  }

  // Get booking type display
  const getBookingTypeDisplay = (bookingType) => {
    switch (bookingType) {
      case 'ONLINE':
        return 'Video Call'
      case 'VISIT':
        return 'Direct Visit'
      default:
        return bookingType || 'N/A'
    }
  }

  // Get status badge class
  const getStatusBadgeClass = (status) => {
    switch (status) {
      case 'PENDING':
        return 'bg-yellow'
      case 'CONFIRMED':
        return 'bg-green'
      case 'CANCELLED':
        return 'bg-red'
      case 'REJECTED':
        return 'bg-red'
      case 'COMPLETED':
        return 'bg-green'
      case 'NO_SHOW':
        return 'bg-soft-red'
      default:
        return 'bg-grey'
    }
  }

  // Get status display text
  const getStatusText = (status) => {
    switch (status) {
      case 'PENDING':
        return 'Pending'
      case 'CONFIRMED':
        return 'Confirmed'
      case 'CANCELLED':
        return 'Cancelled'
      case 'REJECTED':
        return 'Rejected'
      case 'COMPLETED':
        return 'Completed'
      case 'NO_SHOW':
        return 'No Show'
      default:
        return status
    }
  }

  // Handle accept
  const handleAccept = () => {
    if (window.confirm('Are you sure you want to accept this appointment?')) {
      acceptMutation.mutate(appointmentId)
    }
  }

  // Handle reject
  const handleReject = () => {
    setRejectModal({ show: true, reason: '' })
  }

  // Confirm reject
  const confirmReject = () => {
    if (appointmentId) {
      rejectMutation.mutate({
        appointmentId,
        reason: rejectModal.reason || null
      })
    }
  }

  // Handle status update
  const handleStatusUpdate = (newStatus) => {
    const statusText = newStatus === 'COMPLETED' ? 'completed' : 'marked as no-show'
    if (window.confirm(`Are you sure you want to mark this appointment as ${statusText}?`)) {
      updateStatusMutation.mutate({ appointmentId, status: newStatus })
    }
  }

  if (!appointmentId) {
    return (
      <div className="alert alert-danger">
        <p>Appointment ID is missing. Please go back and select an appointment.</p>
        <Link to="/appointments" className="btn btn-primary">Back to Appointments</Link>
      </div>
    )
  }

  if (isLoading) {
    return (
      <div className="text-center py-5">
        <div className="spinner-border text-primary" role="status">
          <span className="visually-hidden">Loading...</span>
        </div>
        <p className="mt-3 text-muted">Loading appointment details...</p>
      </div>
    )
  }

  if (error) {
    return (
      <div className="alert alert-danger">
        <h5>Error Loading Appointment</h5>
        <p>{error.response?.data?.message || error.message || 'Failed to load appointment details'}</p>
        <Link to="/appointments" className="btn btn-primary">Back to Appointments</Link>
      </div>
    )
  }

  const appointment = appointmentData || {}

  return (
    <>
      <div className="dashboard-header">
        <div className="header-back">
          <Link to="/appointments" className="back-arrow">
            <i className="fa-solid fa-arrow-left"></i>
          </Link>
          <h3>Appointment Details</h3>
        </div>
      </div>

      <div className="appointment-details-wrap">
        {/* Appointment Detail Card */}
        <div className="appointment-wrap appointment-detail-card">
          <ul>
            <li>
              <div className="patinet-information">
                <a href="#">
                  <img
                    src={appointment.patientId?.profileImage || '/assets/img/doctors-dashboard/profile-02.jpg'}
                    alt="User Image"
                    onError={(e) => {
                      e.target.src = '/assets/img/doctors-dashboard/profile-02.jpg'
                    }}
                  />
                </a>
                <div className="patient-info">
                  <p>{appointment.appointmentNumber || `#Apt${appointment._id?.slice(-6)}`}</p>
                  <h6>
                    <a href="#">{appointment.patientId?.fullName || 'Unknown Patient'}</a>
                    {appointment.status === 'PENDING' && <span className="badge new-tag">New</span>}
                  </h6>
                  <div className="mail-info-patient">
                    <ul>
                      <li>
                        <i className="fa-solid fa-envelope"></i>
                        {appointment.patientId?.email || 'N/A'}
                      </li>
                      <li>
                        <i className="fa-solid fa-phone"></i>
                        {appointment.patientId?.phone || 'N/A'}
                      </li>
                    </ul>
                  </div>
                </div>
              </div>
            </li>
            <li className="appointment-info">
              <div className="person-info">
                <p>Type of Appointment</p>
                <ul className="d-flex apponitment-types">
                  <li>
                    {appointment.bookingType === 'ONLINE' ? (
                      <i className="fa-solid fa-video text-indigo"></i>
                    ) : (
                      <i className="fa-solid fa-hospital text-green"></i>
                    )}
                    {getBookingTypeDisplay(appointment.bookingType)}
                  </li>
                </ul>
              </div>
            </li>
            <li className="appointment-action">
              <div className="detail-badge-info">
                <span className={`badge ${getStatusBadgeClass(appointment.status)} me-2`}>
                  {getStatusText(appointment.status)}
                </span>
                {appointment.status === 'REJECTED' && appointment.notes && (
                  <a
                    href="#reject_reason"
                    className="reject-popup"
                    onClick={(e) => {
                      e.preventDefault()
                      alert(`Rejection Reason: ${appointment.notes}`)
                    }}
                  >
                    Reason
                  </a>
                )}
              </div>
              <div className="consult-fees">
                <h6>Consultation Fees : ${appointment.paymentStatus === 'PAID' ? '200' : 'Pending'}</h6>
              </div>
              <ul>
                <li>
                  <a
                    href="#"
                    onClick={(e) => {
                      e.preventDefault()
                      // Navigate to chat with patient (requires both patientId and appointmentId)
                      const patientId = appointment.patientId?._id || appointment.patientId
                      const appointmentId = appointment._id
                      if (patientId && appointmentId) {
                        navigate(`/chat-doctor?patientId=${patientId}&appointmentId=${appointmentId}`)
                      } else {
                        toast.error('Unable to start chat: Missing patient or appointment information')
                      }
                    }}
                  >
                    <i className="fa-solid fa-comments"></i>
                  </a>
                </li>
                {appointment.status === 'PENDING' && (
                  <li>
                    <a
                      href="#"
                      onClick={(e) => {
                        e.preventDefault()
                        handleReject()
                      }}
                    >
                      <i className="fa-solid fa-xmark"></i>
                    </a>
                  </li>
                )}
              </ul>
            </li>
          </ul>
          <ul className="detail-card-bottom-info">
            <li>
              <h6>Appointment Date & Time</h6>
              <span>
                {formatDateTime(appointment.appointmentDate, appointment.appointmentTime)}
              </span>
            </li>
            {appointment.clinicName && (
              <li>
                <h6>Clinic Location</h6>
                <span>{appointment.clinicName}</span>
              </li>
            )}
            {appointment.patientNotes && (
              <li>
                <h6>Patient Notes</h6>
                <span>{appointment.patientNotes}</span>
              </li>
            )}
            <li>
              <h6>Visit Type</h6>
              <span>{getBookingTypeDisplay(appointment.bookingType)}</span>
            </li>
            {appointment.status === 'PENDING' && (
              <li>
                <div className="start-btn d-flex gap-2">
                  <button
                    className="btn btn-primary"
                    onClick={handleAccept}
                    disabled={acceptMutation.isLoading}
                  >
                    {acceptMutation.isLoading ? 'Accepting...' : 'Accept Appointment'}
                  </button>
                  <button
                    className="btn btn-danger"
                    onClick={handleReject}
                    disabled={rejectMutation.isLoading}
                  >
                    {rejectMutation.isLoading ? 'Rejecting...' : 'Reject Appointment'}
                  </button>
                </div>
              </li>
            )}
            {appointment.status === 'CONFIRMED' && (
              <li>
                <div className="start-btn d-flex gap-2">
                  <Link to={`/doctor-appointment-start?id=${appointment._id}`} className="btn btn-secondary">
                    Start Session
                  </Link>
                  {appointment.bookingType === 'ONLINE' && (
                    <Link 
                      to={`/doctor-video-call-room?appointmentId=${appointment._id}`} 
                      className="btn btn-primary"
                    >
                      <i className="fa-solid fa-video me-2"></i>
                      Start Video Call
                    </Link>
                  )}
                </div>
              </li>
            )}
            {appointment.status === 'CONFIRMED' && (
              <li>
                <div className="detail-badge-info">
                  <button
                    className="btn btn-success me-2"
                    onClick={() => handleStatusUpdate('COMPLETED')}
                    disabled={updateStatusMutation.isLoading}
                  >
                    Mark as Completed
                  </button>
                  <button
                    className="btn btn-warning"
                    onClick={() => handleStatusUpdate('NO_SHOW')}
                    disabled={updateStatusMutation.isLoading}
                  >
                    Mark as No Show
                  </button>
                </div>
              </li>
            )}
            {appointment.status === 'COMPLETED' && (
              <li className="appointment-detail-btn">
                <a href="#view_prescription" data-bs-toggle="modal">
                  View Details
                </a>
              </li>
            )}
          </ul>
        </div>
        {/* /Appointment Detail Card */}
      </div>

      {/* Reject Modal */}
      {rejectModal.show && (
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
                <h5 className="modal-title">Reject Appointment</h5>
                <button
                  type="button"
                  className="btn-close"
                  onClick={() => setRejectModal({ show: false, reason: '' })}
                  aria-label="Close"
                ></button>
              </div>
              <div className="modal-body">
                <p>Are you sure you want to reject this appointment?</p>
                <div className="mb-3">
                  <label className="form-label">Reason (Optional)</label>
                  <textarea
                    className="form-control"
                    rows="3"
                    placeholder="Enter rejection reason..."
                    value={rejectModal.reason}
                    onChange={(e) => setRejectModal({ ...rejectModal, reason: e.target.value })}
                  />
                </div>
              </div>
              <div className="modal-footer">
                <button
                  type="button"
                  className="btn btn-secondary"
                  onClick={() => setRejectModal({ show: false, reason: '' })}
                  disabled={rejectMutation.isLoading}
                >
                  Cancel
                </button>
                <button
                  type="button"
                  className="btn btn-danger"
                  onClick={confirmReject}
                  disabled={rejectMutation.isLoading}
                >
                  {rejectMutation.isLoading ? (
                    <>
                      <span className="spinner-border spinner-border-sm me-2" role="status"></span>
                      Rejecting...
                    </>
                  ) : (
                    'Reject Appointment'
                  )}
                </button>
              </div>
            </div>
          </div>
          <div
            className="modal-backdrop fade show"
            onClick={() => setRejectModal({ show: false, reason: '' })}
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
    </>
  )
}

export default DoctorAppointmentDetails
