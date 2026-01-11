import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { toast } from 'react-toastify'
import * as appointmentApi from '../../api/appointments'

const DoctorRequest = () => {
  const navigate = useNavigate()
  const queryClient = useQueryClient()
  const [rejectModal, setRejectModal] = useState({ show: false, appointmentId: null, reason: '' })

  // Fetch pending appointments
  const { data: appointmentsData, isLoading } = useQuery({
    queryKey: ['doctorPendingAppointments'],
    queryFn: async () => {
      const response = await appointmentApi.listAppointments({ status: 'PENDING', limit: 50 })
      return response.data || response
    }
  })

  // Extract appointments
  const appointments = appointmentsData?.appointments || appointmentsData?.data?.appointments || []

  // Accept appointment mutation
  const acceptMutation = useMutation({
    mutationFn: (appointmentId) => appointmentApi.acceptAppointment(appointmentId),
    onSuccess: () => {
      queryClient.invalidateQueries(['doctorPendingAppointments'])
      queryClient.invalidateQueries(['doctorAppointments'])
      toast.success('Appointment accepted successfully!')
    },
    onError: (error) => {
      const errorMessage = error?.response?.data?.message || error?.message || 'Failed to accept appointment'
      toast.error(errorMessage)
    }
  })

  // Reject appointment mutation
  const rejectMutation = useMutation({
    mutationFn: ({ appointmentId, reason }) => appointmentApi.rejectAppointment(appointmentId, reason),
    onSuccess: () => {
      queryClient.invalidateQueries(['doctorPendingAppointments'])
      queryClient.invalidateQueries(['doctorAppointments'])
      toast.success('Appointment rejected successfully!')
      setRejectModal({ show: false, appointmentId: null, reason: '' })
    },
    onError: (error) => {
      const errorMessage = error?.response?.data?.message || error?.message || 'Failed to reject appointment'
      toast.error(errorMessage)
    }
  })

  // Normalize image URL
  const normalizeImageUrl = (imageUri) => {
    if (!imageUri || typeof imageUri !== 'string') return '/assets/img/doctors-dashboard/profile-01.jpg'
    const trimmedUri = imageUri.trim()
    if (!trimmedUri) return '/assets/img/doctors-dashboard/profile-01.jpg'
    const apiBaseURL = import.meta.env.VITE_API_URL || 'https://mydoctoradmin.mydoctorplus.it/api'
    const baseURL = apiBaseURL.replace('/api', '')
    if (trimmedUri.startsWith('http://') || trimmedUri.startsWith('https://')) {
      return trimmedUri
    }
    const imagePath = trimmedUri.startsWith('/') ? trimmedUri : `/${trimmedUri}`
    return `${baseURL}${imagePath}`
  }

  // Format date and time
  const formatDateTime = (dateString, timeString) => {
    if (!dateString) return 'N/A'
    const date = new Date(dateString)
    const formattedDate = date.toLocaleDateString('en-US', { day: 'numeric', month: 'short', year: 'numeric' })
    const formattedTime = timeString || ''
    return `${formattedDate} ${formattedTime}`
  }

  // Get booking type icon and text
  const getBookingTypeDisplay = (bookingType) => {
    switch (bookingType?.toUpperCase()) {
      case 'ONLINE':
        return { icon: 'isax isax-video5 text-blue', text: 'Video Call' }
      case 'VISIT':
        return { icon: 'isax isax-building5 text-green', text: 'Direct Visit' }
      default:
        return { icon: 'isax isax-call5 text-indigo', text: bookingType || 'N/A' }
    }
  }

  // Handle accept
  const handleAccept = (appointmentId) => {
    if (window.confirm('Are you sure you want to accept this appointment?')) {
      acceptMutation.mutate(appointmentId)
    }
  }

  // Handle reject
  const handleReject = (appointmentId) => {
    setRejectModal({ show: true, appointmentId, reason: '' })
  }

  // Confirm reject
  const confirmReject = () => {
    if (rejectModal.appointmentId) {
      rejectMutation.mutate({
        appointmentId: rejectModal.appointmentId,
        reason: rejectModal.reason || null
      })
    }
  }

  // Get patient profile link
  const getPatientProfileLink = (patientId) => {
    if (!patientId) return '/patient-profile'
    const patientIdStr = patientId._id || patientId
    return `/patient-profile?id=${patientIdStr}`
  }

  return (
    <>
      <div className="dashboard-header">
        <h3>Requests</h3>
        <ul>
          <li>
            <div className="dropdown header-dropdown">
              <a className="dropdown-toggle nav-tog" data-bs-toggle="dropdown" href="javascript:void(0);">
                All Requests
              </a>
              <div className="dropdown-menu dropdown-menu-end">
                <a href="javascript:void(0);" className="dropdown-item active">
                  All Requests
                </a>
              </div>
            </div>
          </li>
        </ul>
      </div>

      {/* Loading State */}
      {isLoading && (
        <div className="text-center py-5">
          <div className="spinner-border" role="status">
            <span className="visually-hidden">Loading...</span>
          </div>
        </div>
      )}

      {/* Empty State */}
      {!isLoading && appointments.length === 0 && (
        <div className="text-center py-5">
          <p className="text-muted">No pending appointment requests</p>
        </div>
      )}

      {/* Request List */}
      {!isLoading && appointments.map((appointment) => {
        const patient = appointment.patientId || {}
        const patientName = patient.fullName || patient.name || 'Unknown Patient'
        const patientImage = normalizeImageUrl(patient.profileImage || patient.profileImage)
        const appointmentNumber = appointment.appointmentNumber || appointment._id?.slice(-6) || 'N/A'
        const bookingType = getBookingTypeDisplay(appointment.bookingType)
        
        return (
          <div key={appointment._id} className="appointment-wrap">
            <ul>
              <li>
                <div className="patinet-information">
                  <Link to={getPatientProfileLink(patient)}>
                    <img 
                      src={patientImage} 
                      alt="User Image"
                      onError={(e) => {
                        e.target.src = '/assets/img/doctors-dashboard/profile-01.jpg'
                      }}
                    />
                  </Link>
                  <div className="patient-info">
                    <p>#{appointmentNumber}</p>
                    <h6>
                      <Link to={getPatientProfileLink(patient)}>{patientName}</Link>
                      <span className="badge new-tag">New</span>
                    </h6>
                  </div>
                </div>
              </li>
              <li className="appointment-info">
                <p><i className="isax isax-clock5"></i>{formatDateTime(appointment.appointmentDate, appointment.appointmentTime)}</p>
                <p className="md-text">{appointment.patientNotes || appointment.reason || 'General Visit'}</p>
              </li>
              <li className="appointment-type">
                <p className="md-text">Type of Appointment</p>
                <p>
                  <i className={bookingType.icon}></i>
                  {bookingType.text}
                  {appointment.clinicName && (
                    <i 
                      className="fa-solid fa-circle-info ms-1" 
                      data-bs-toggle="tooltip" 
                      title={`Clinic Location: ${appointment.clinicName}`}
                    ></i>
                  )}
                </p>
              </li>
              <li>
                <ul className="request-action">
                  <li>
                    <button 
                      className="accept-link" 
                      onClick={() => handleAccept(appointment._id)}
                      disabled={acceptMutation.isPending}
                    >
                      <i className="fa-solid fa-check"></i>Accept
                    </button>
                  </li>
                  <li>
                    <button 
                      className="reject-link" 
                      onClick={() => handleReject(appointment._id)}
                      disabled={rejectMutation.isPending}
                    >
                      <i className="fa-solid fa-xmark"></i>Reject
                    </button>
                  </li>
                </ul>
              </li>
            </ul>
          </div>
        )
      })}

      {/* Reject Modal */}
      {rejectModal.show && (
        <div className="modal fade show" style={{ display: 'block' }} id="cancel_appointment">
          <div className="modal-dialog modal-dialog-centered">
            <div className="modal-content">
              <div className="modal-header">
                <h5 className="modal-title">Reject Appointment</h5>
                <button 
                  type="button" 
                  className="btn-close" 
                  onClick={() => setRejectModal({ show: false, appointmentId: null, reason: '' })}
                ></button>
              </div>
              <div className="modal-body">
                <div className="form-group">
                  <label>Reason for Rejection (Optional)</label>
                  <textarea
                    className="form-control"
                    rows="4"
                    value={rejectModal.reason}
                    onChange={(e) => setRejectModal({ ...rejectModal, reason: e.target.value })}
                    placeholder="Enter reason for rejection..."
                  ></textarea>
                </div>
              </div>
              <div className="modal-footer">
                <button
                  type="button"
                  className="btn btn-secondary"
                  onClick={() => setRejectModal({ show: false, appointmentId: null, reason: '' })}
                >
                  Cancel
                </button>
                <button
                  type="button"
                  className="btn btn-primary"
                  onClick={confirmReject}
                  disabled={rejectMutation.isPending}
                >
                  {rejectMutation.isPending ? 'Rejecting...' : 'Reject Appointment'}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
      {rejectModal.show && <div className="modal-backdrop fade show"></div>}
    </>
  )
}

export default DoctorRequest

