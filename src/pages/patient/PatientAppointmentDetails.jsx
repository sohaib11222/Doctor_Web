import { useState, useMemo } from 'react'
import { Link, useNavigate, useSearchParams } from 'react-router-dom'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { toast } from 'react-toastify'
import * as appointmentApi from '../../api/appointments'
import { useAuth } from '../../contexts/AuthContext'

const PatientAppointmentDetails = () => {
  const { user } = useAuth()
  const navigate = useNavigate()
  const queryClient = useQueryClient()
  const [searchParams] = useSearchParams()
  const appointmentId = searchParams.get('id')

  const [showCancelModal, setShowCancelModal] = useState(false)
  const [cancelReason, setCancelReason] = useState('')

  // Fetch appointment details
  const { data: appointmentData, isLoading, error } = useQuery({
    queryKey: ['appointment', appointmentId],
    queryFn: () => appointmentApi.getAppointmentById(appointmentId),
    enabled: !!appointmentId && !!user
  })

  // Fetch recent appointments for the same patient
  const { data: recentAppointmentsData } = useQuery({
    queryKey: ['patientAppointments', { limit: 5 }],
    queryFn: () => appointmentApi.listAppointments({ page: 1, limit: 5 }),
    enabled: !!user
  })

  // Cancel appointment mutation
  const cancelAppointmentMutation = useMutation({
    mutationFn: ({ id, reason }) => appointmentApi.cancelAppointment(id, reason),
    onSuccess: () => {
      queryClient.invalidateQueries(['appointment', appointmentId])
      queryClient.invalidateQueries(['patientAppointments'])
      toast.success('Appointment cancelled successfully')
      setShowCancelModal(false)
      setCancelReason('')
    },
    onError: (error) => {
      const errorMessage = error.response?.data?.message || error.message || 'Failed to cancel appointment'
      toast.error(errorMessage)
    }
  })

  // Extract appointment from response
  const appointment = appointmentData?.data || appointmentData

  // Extract recent appointments
  const recentAppointments = useMemo(() => {
    if (!recentAppointmentsData) return []
    const responseData = recentAppointmentsData.data || recentAppointmentsData
    return responseData.appointments || responseData.data || responseData || []
  }, [recentAppointmentsData])

  // Format date and time
  const formatDateTime = (date, time) => {
    if (!date) return 'N/A'
    const d = new Date(date)
    const dateStr = d.toLocaleDateString('en-US', { day: 'numeric', month: 'short', year: 'numeric' })
    return time ? `${dateStr} - ${time}` : dateStr
  }

  // Get status badge class
  const getStatusBadgeClass = (status) => {
    switch (status) {
      case 'PENDING':
        return 'bg-yellow'
      case 'CONFIRMED':
        return 'bg-blue'
      case 'COMPLETED':
        return 'bg-green'
      case 'CANCELLED':
      case 'REJECTED':
        return 'bg-red'
      default:
        return 'bg-secondary'
    }
  }

  // Get status display text
  const getStatusText = (status) => {
    switch (status) {
      case 'PENDING':
        return 'Pending'
      case 'CONFIRMED':
        return 'Confirmed'
      case 'COMPLETED':
        return 'Completed'
      case 'CANCELLED':
        return 'Cancelled'
      case 'REJECTED':
        return 'Rejected'
      default:
        return status
    }
  }

  // Get booking type display
  const getBookingTypeDisplay = (bookingType) => {
    switch (bookingType) {
      case 'ONLINE':
        return 'Video Call'
      case 'VISIT':
        return 'Direct Visit'
      default:
        return 'General Visit'
    }
  }

  // Get booking type icon
  const getBookingTypeIcon = (bookingType) => {
    switch (bookingType) {
      case 'ONLINE':
        return 'isax-video5 text-indigo'
      case 'VISIT':
        return 'isax-hospital5 text-green'
      default:
        return 'isax-hospital5 text-green'
    }
  }

  // Handle cancel appointment
  const handleCancel = () => {
    if (!cancelReason.trim()) {
      toast.error('Please provide a cancellation reason')
      return
    }
    cancelAppointmentMutation.mutate({ id: appointmentId, reason: cancelReason })
  }

  // Handle chat navigation
  const handleChatClick = (e, appointmentId, doctorId) => {
    e.preventDefault()
    navigate(`/chat?appointmentId=${appointmentId}&doctorId=${doctorId}`)
  }

  if (isLoading) {
    return (
      <div className="content">
        <div className="container">
          <div className="row">
            <div className="col-lg-4 col-xl-3 theiaStickySidebar">
              {/* PatientSidebar will be rendered by DashboardLayout */}
            </div>
            <div className="col-lg-12 col-xl-12">
              <div className="text-center py-5">
                <div className="spinner-border text-primary" role="status">
                  <span className="visually-hidden">Loading...</span>
                </div>
                <p className="mt-3 text-muted">Loading appointment details...</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    )
  }

  if (error || !appointment) {
    return (
      <div className="content">
        <div className="container">
          <div className="row">
            <div className="col-lg-4 col-xl-3 theiaStickySidebar">
              {/* PatientSidebar will be rendered by DashboardLayout */}
            </div>
            <div className="col-lg-12 col-xl-12">
              <div className="alert alert-danger">
                <h5>Error Loading Appointment</h5>
                <p>{error?.response?.data?.message || error?.message || 'Appointment not found'}</p>
                <Link to="/patient-appointments" className="btn btn-primary mt-3">Back to Appointments</Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    )
  }

  const doctor = appointment.doctorId
  const doctorId = doctor?._id || doctor
  const doctorName = doctor?.fullName || 'Unknown Doctor'
  const doctorImage = doctor?.profileImage || '/assets/img/doctors-dashboard/doctor-profile-img.jpg'
  const doctorEmail = doctor?.email || ''
  const doctorPhone = doctor?.phone || ''
  const appointmentNumber = appointment.appointmentNumber || `#${appointment._id.slice(-6)}`
  const bookingType = appointment.bookingType || 'VISIT'
  const status = appointment.status

  return (
    <div className="content">
      <div className="container">
        <div className="row">
          <div className="col-lg-4 col-xl-3 theiaStickySidebar">
            {/* PatientSidebar will be rendered by DashboardLayout */}
          </div>
          <div className="col-lg-12 col-xl-12">
            <div className="dashboard-header">
              <div className="header-back">
                <Link to="/patient-appointments" className="back-arrow">
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
                      <Link to={`/doctor-profile?id=${doctorId}`}>
                        <img
                          src={doctorImage}
                          alt={doctorName}
                          onError={(e) => {
                            e.target.src = '/assets/img/doctors-dashboard/doctor-profile-img.jpg'
                          }}
                        />
                      </Link>
                      <div className="patient-info">
                        <p>{appointmentNumber}</p>
                        <h6>
                          <Link to={`/doctor-profile?id=${doctorId}`}>{doctorName}</Link>
                        </h6>
                        <div className="mail-info-patient">
                          <ul>
                            {doctorEmail && <li><i className="isax isax-sms5"></i>{doctorEmail}</li>}
                            {doctorPhone && <li><i className="isax isax-call5"></i>{doctorPhone}</li>}
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
                          <i className={`isax ${getBookingTypeIcon(bookingType)}`}></i>
                          {getBookingTypeDisplay(bookingType)}
                        </li>
                      </ul>
                    </div>
                  </li>
                  <li className="appointment-action">
                    <div className="detail-badge-info">
                      <span className={`badge ${getStatusBadgeClass(status)}`}>
                        {getStatusText(status)}
                      </span>
                      {status === 'CANCELLED' && appointment.cancellationReason && (
                        <a
                          href="#cancel_reason"
                          className="reject-popup ms-2"
                          data-bs-toggle="modal"
                          onClick={(e) => {
                            e.preventDefault()
                            toast.info(`Cancellation reason: ${appointment.cancellationReason}`)
                          }}
                        >
                          Reason
                        </a>
                      )}
                    </div>
                    {appointment.consultationFees && (
                      <div className="consult-fees">
                        <h6>Consultation Fees : ${appointment.consultationFees}</h6>
                      </div>
                    )}
                    <ul>
                      <li>
                        <a
                          href="#"
                          onClick={(e) => handleChatClick(e, appointment._id, doctorId)}
                        >
                          <i className="isax isax-messages-25"></i>
                        </a>
                      </li>
                      {status !== 'CANCELLED' && status !== 'COMPLETED' && status !== 'REJECTED' && (
                        <li>
                          <a
                            href="#"
                            onClick={(e) => {
                              e.preventDefault()
                              setShowCancelModal(true)
                            }}
                          >
                            <i className="isax isax-close-circle5"></i>
                          </a>
                        </li>
                      )}
                    </ul>
                  </li>
                </ul>
                <ul className="detail-card-bottom-info">
                  <li>
                    <h6>Appointment Date & Time</h6>
                    <span>{formatDateTime(appointment.appointmentDate, appointment.appointmentTime)}</span>
                  </li>
                  {appointment.clinicName && (
                    <li>
                      <h6>Clinic Location</h6>
                      <span>{appointment.clinicName}</span>
                    </li>
                  )}
                  {doctor?.doctorProfile?.clinics?.[0] && (
                    <li>
                      <h6>Location</h6>
                      <span>
                        {[
                          doctor.doctorProfile.clinics[0].city,
                          doctor.doctorProfile.clinics[0].state,
                          doctor.doctorProfile.clinics[0].country
                        ].filter(Boolean).join(', ')}
                      </span>
                    </li>
                  )}
                  <li>
                    <h6>Visit Type</h6>
                    <span>{getBookingTypeDisplay(bookingType)}</span>
                  </li>
                  {appointment.patientNotes && (
                    <li>
                      <h6>Patient Notes</h6>
                      <span>{appointment.patientNotes}</span>
                    </li>
                  )}
                  {status === 'CONFIRMED' && bookingType === 'ONLINE' && (
                    <li>
                      <div className="start-btn">
                        <Link
                          to={`/video-call-room?appointmentId=${appointment._id}`}
                          className="btn btn-secondary"
                        >
                          Start Session
                        </Link>
                      </div>
                    </li>
                  )}
                  {status === 'COMPLETED' && (
                    <li className="detail-badge-info">
                      <Link
                        to={`/prescription?appointmentId=${appointment._id}`}
                        className="btn btn-primary prime-btn me-3"
                      >
                        Download Prescription
                      </Link>
                      <Link
                        to={`/booking?doctorId=${doctorId}`}
                        className="btn reschedule-btn btn-primary-border"
                      >
                        Reschedule Appointment
                      </Link>
                    </li>
                  )}
                  {status === 'CANCELLED' && (
                    <li>
                      <div className="detail-badge-info">
                        <span className="badge bg-soft-red me-2">Status : Cancelled</span>
                        <Link
                          to={`/booking?doctorId=${doctorId}`}
                          className="reschedule-btn btn-primary-border"
                        >
                          Reschedule Appointment
                        </Link>
                      </div>
                    </li>
                  )}
                </ul>
              </div>
              {/* /Appointment Detail Card */}

              {/* Recent Appointments */}
              {recentAppointments.length > 0 && (
                <div className="recent-appointments">
                  <h5 className="head-text">Recent Appointments</h5>
                  {recentAppointments
                    .filter(apt => apt._id !== appointment._id)
                    .slice(0, 3)
                    .map((apt) => {
                      const aptDoctor = apt.doctorId
                      const aptDoctorName = aptDoctor?.fullName || 'Unknown Doctor'
                      const aptDoctorImage = aptDoctor?.profileImage || '/assets/img/doctors/doctor-15.jpg'
                      const aptAppointmentNumber = apt.appointmentNumber || `#${apt._id.slice(-6)}`

                      return (
                        <div key={apt._id} className="appointment-wrap">
                          <ul>
                            <li>
                              <div className="patinet-information">
                                <Link to={`/patient-appointment-details?id=${apt._id}`}>
                                  <img
                                    src={aptDoctorImage}
                                    alt={aptDoctorName}
                                    onError={(e) => {
                                      e.target.src = '/assets/img/doctors/doctor-15.jpg'
                                    }}
                                  />
                                </Link>
                                <div className="patient-info">
                                  <p>{aptAppointmentNumber}</p>
                                  <h6>
                                    <Link to={`/patient-appointment-details?id=${apt._id}`}>
                                      {aptDoctorName}
                                    </Link>
                                  </h6>
                                </div>
                              </div>
                            </li>
                            <li className="appointment-info">
                              <p><i className="fa-solid fa-clock"></i>{formatDateTime(apt.appointmentDate, apt.appointmentTime)}</p>
                              <ul className="d-flex apponitment-types">
                                <li>{getBookingTypeDisplay(apt.bookingType)}</li>
                              </ul>
                            </li>
                            <li className="mail-info-patient">
                              <ul>
                                {aptDoctor?.email && <li><i className="isax isax-sms5"></i>{aptDoctor.email}</li>}
                                {aptDoctor?.phone && <li><i className="isax isax-call5"></i>{aptDoctor.phone}</li>}
                              </ul>
                            </li>
                            <li className="appointment-action">
                              <ul>
                                <li>
                                  <Link to={`/patient-appointment-details?id=${apt._id}`}>
                                    <i className="isax isax-eye4"></i>
                                  </Link>
                                </li>
                              </ul>
                            </li>
                          </ul>
                        </div>
                      )
                    })}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Cancel Appointment Modal */}
      {showCancelModal && (
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
                <h5 className="modal-title">Cancel Appointment</h5>
                <button
                  type="button"
                  className="btn-close"
                  onClick={() => {
                    setShowCancelModal(false)
                    setCancelReason('')
                  }}
                  aria-label="Close"
                ></button>
              </div>
              <div className="modal-body">
                <p>Are you sure you want to cancel this appointment?</p>
                <div className="mb-3">
                  <label className="form-label">Cancellation Reason</label>
                  <textarea
                    className="form-control"
                    rows="3"
                    placeholder="Please provide a reason for cancellation"
                    value={cancelReason}
                    onChange={(e) => setCancelReason(e.target.value)}
                  />
                </div>
              </div>
              <div className="modal-footer">
                <button
                  type="button"
                  className="btn btn-secondary"
                  onClick={() => {
                    setShowCancelModal(false)
                    setCancelReason('')
                  }}
                  disabled={cancelAppointmentMutation.isLoading}
                >
                  Close
                </button>
                <button
                  type="button"
                  className="btn btn-danger"
                  onClick={handleCancel}
                  disabled={cancelAppointmentMutation.isLoading || !cancelReason.trim()}
                >
                  {cancelAppointmentMutation.isLoading ? (
                    <>
                      <span className="spinner-border spinner-border-sm me-2" role="status"></span>
                      Cancelling...
                    </>
                  ) : (
                    'Cancel Appointment'
                  )}
                </button>
              </div>
            </div>
          </div>
          <div
            className="modal-backdrop fade show"
            onClick={() => {
              setShowCancelModal(false)
              setCancelReason('')
            }}
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
    </div>
  )
}

export default PatientAppointmentDetails
