import { useState, useEffect } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { toast } from 'react-toastify'
import * as appointmentApi from '../../api/appointments'

const DoctorAppointments = () => {
  const navigate = useNavigate()
  const queryClient = useQueryClient()

  // State for active tab
  const [activeTab, setActiveTab] = useState('upcoming') // 'upcoming', 'cancel', 'complete'
  
  // State for filters
  const [searchQuery, setSearchQuery] = useState('')
  const [dateRange, setDateRange] = useState({ fromDate: '', toDate: '' })
  const [currentPage, setCurrentPage] = useState(1)
  const [rejectModal, setRejectModal] = useState({ show: false, appointmentId: null, reason: '' })

  // Determine status filter based on active tab
  const getStatusFilter = () => {
    switch (activeTab) {
      case 'upcoming':
        return ['PENDING', 'CONFIRMED'] // Show both pending and confirmed as upcoming
      case 'cancel':
        return ['CANCELLED', 'REJECTED']
      case 'complete':
        return ['COMPLETED', 'NO_SHOW']
      default:
        return []
    }
  }

  // Fetch appointments
  const { data: appointmentsData, isLoading, error, refetch } = useQuery({
    queryKey: ['doctorAppointments', activeTab, currentPage, dateRange],
    queryFn: async () => {
      const statuses = getStatusFilter()
      const params = {
        page: currentPage,
        limit: 10,
        ...(dateRange.fromDate && { fromDate: dateRange.fromDate }),
        ...(dateRange.toDate && { toDate: dateRange.toDate })
      }
      
      // Fetch all statuses for the active tab
      const allPromises = statuses.map(status => 
        appointmentApi.listAppointments({ ...params, status })
      )
      
      const results = await Promise.all(allPromises)
      
      // Combine all appointments
      let allAppointments = []
      let totalCount = 0
      
      results.forEach(result => {
        const data = result.data || result
        if (data.appointments) {
          allAppointments = [...allAppointments, ...data.appointments]
          totalCount += data.pagination?.total || 0
        }
      })
      
      // Sort by date (newest first)
      allAppointments.sort((a, b) => {
        const dateA = new Date(a.appointmentDate)
        const dateB = new Date(b.appointmentDate)
        if (dateA.getTime() !== dateB.getTime()) {
          return dateB - dateA
        }
        // If same date, sort by time
        return b.appointmentTime.localeCompare(a.appointmentTime)
      })
      
      return {
        appointments: allAppointments,
        pagination: {
          total: totalCount,
          page: currentPage,
          limit: 10,
          pages: Math.ceil(totalCount / 10)
        }
      }
    }
  })

  // Accept appointment mutation
  const acceptMutation = useMutation({
    mutationFn: (appointmentId) => appointmentApi.acceptAppointment(appointmentId),
    onSuccess: () => {
      queryClient.invalidateQueries(['doctorAppointments'])
      toast.success('Appointment accepted successfully!')
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
      queryClient.invalidateQueries(['doctorAppointments'])
      toast.success('Appointment rejected successfully!')
      setRejectModal({ show: false, appointmentId: null, reason: '' })
    },
    onError: (error) => {
      const errorMessage = error.response?.data?.message || error.message || 'Failed to reject appointment'
      toast.error(errorMessage)
    }
  })

  // Update status mutation (for marking as completed/no-show)
  const updateStatusMutation = useMutation({
    mutationFn: ({ appointmentId, status }) => appointmentApi.updateAppointmentStatus(appointmentId, { status }),
    onSuccess: () => {
      queryClient.invalidateQueries(['doctorAppointments'])
      toast.success('Appointment status updated successfully!')
    },
    onError: (error) => {
      const errorMessage = error.response?.data?.message || error.message || 'Failed to update appointment status'
      toast.error(errorMessage)
    }
  })

  // Get counts for tabs
  const getTabCounts = async () => {
    try {
      const [upcoming, cancelled, completed] = await Promise.all([
        appointmentApi.listAppointments({ status: 'PENDING', limit: 1 }),
        appointmentApi.listAppointments({ status: 'CANCELLED', limit: 1 }),
        appointmentApi.listAppointments({ status: 'COMPLETED', limit: 1 })
      ])
      
      // Also get CONFIRMED and REJECTED, NO_SHOW counts
      const [confirmed, rejected, noShow] = await Promise.all([
        appointmentApi.listAppointments({ status: 'CONFIRMED', limit: 1 }),
        appointmentApi.listAppointments({ status: 'REJECTED', limit: 1 }),
        appointmentApi.listAppointments({ status: 'NO_SHOW', limit: 1 })
      ])
      
      return {
        upcoming: (upcoming.data?.pagination?.total || 0) + (confirmed.data?.pagination?.total || 0),
        cancelled: (cancelled.data?.pagination?.total || 0) + (rejected.data?.pagination?.total || 0),
        complete: (completed.data?.pagination?.total || 0) + (noShow.data?.pagination?.total || 0)
      }
    } catch (error) {
      return { upcoming: 0, cancelled: 0, complete: 0 }
    }
  }

  const [tabCounts, setTabCounts] = useState({ upcoming: 0, cancelled: 0, complete: 0 })

  useEffect(() => {
    getTabCounts().then(setTabCounts)
  }, [])

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

  // Handle status update (complete/no-show)
  const handleStatusUpdate = (appointmentId, newStatus) => {
    const statusText = newStatus === 'COMPLETED' ? 'completed' : 'marked as no-show'
    if (window.confirm(`Are you sure you want to mark this appointment as ${statusText}?`)) {
      updateStatusMutation.mutate({ appointmentId, status: newStatus })
    }
  }

  // Filter appointments by search query
  const filteredAppointments = appointmentsData?.appointments?.filter(apt => {
    if (!searchQuery) return true
    const query = searchQuery.toLowerCase()
    const patientName = apt.patientId?.fullName?.toLowerCase() || ''
    const appointmentNumber = apt.appointmentNumber?.toLowerCase() || ''
    return patientName.includes(query) || appointmentNumber.includes(query)
  }) || []

  const appointments = filteredAppointments

  return (
    <>
      <div className="dashboard-header">
        <h3>Appointments</h3>
        <ul className="header-list-btns">
          <li>
            <div className="input-block dash-search-input">
              <input
                type="text"
                className="form-control"
                placeholder="Search"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
              <span className="search-icon"><i className="fa-solid fa-magnifying-glass"></i></span>
            </div>
          </li>
          <li>
            <div className="view-icons">
              <Link to="/appointments" className="active"><i className="fa-solid fa-list"></i></Link>
            </div>
          </li>
          <li>
            <div className="view-icons">
              <Link to="/doctor-appointments-grid"><i className="fa-solid fa-th"></i></Link>
            </div>
          </li>
          <li>
            <div className="view-icons">
              <a href="#"><i className="fa-solid fa-calendar-check"></i></a>
            </div>
          </li>
        </ul>
      </div>

      <div className="appointment-tab-head">
        <div className="appointment-tabs">
          <ul className="nav nav-pills inner-tab" id="pills-tab" role="tablist">
            <li className="nav-item" role="presentation">
              <button
                className={`nav-link ${activeTab === 'upcoming' ? 'active' : ''}`}
                onClick={() => {
                  setActiveTab('upcoming')
                  setCurrentPage(1)
                }}
                type="button"
              >
                Upcoming<span>{tabCounts.upcoming}</span>
              </button>
            </li>
            <li className="nav-item" role="presentation">
              <button
                className={`nav-link ${activeTab === 'cancel' ? 'active' : ''}`}
                onClick={() => {
                  setActiveTab('cancel')
                  setCurrentPage(1)
                }}
                type="button"
              >
                Cancelled<span>{tabCounts.cancelled}</span>
              </button>
            </li>
            <li className="nav-item" role="presentation">
              <button
                className={`nav-link ${activeTab === 'complete' ? 'active' : ''}`}
                onClick={() => {
                  setActiveTab('complete')
                  setCurrentPage(1)
                }}
                type="button"
              >
                Completed<span>{tabCounts.complete}</span>
              </button>
            </li>
          </ul>
        </div>
        <div className="filter-head">
          <div className="position-relative daterange-wraper me-2">
            <div className="input-groupicon calender-input">
              <input
                type="date"
                className="form-control"
                placeholder="From Date"
                value={dateRange.fromDate}
                onChange={(e) => setDateRange({ ...dateRange, fromDate: e.target.value })}
              />
            </div>
            <i className="fa-solid fa-calendar-days"></i>
          </div>
          <div className="position-relative daterange-wraper me-2">
            <div className="input-groupicon calender-input">
              <input
                type="date"
                className="form-control"
                placeholder="To Date"
                value={dateRange.toDate}
                onChange={(e) => setDateRange({ ...dateRange, toDate: e.target.value })}
              />
            </div>
            <i className="fa-solid fa-calendar-days"></i>
          </div>
        </div>
      </div>

      <div className="tab-content appointment-tab-content">
        {/* Upcoming Tab */}
        <div className={`tab-pane fade ${activeTab === 'upcoming' ? 'show active' : ''}`} id="pills-upcoming" role="tabpanel">
          {isLoading ? (
            <div className="text-center py-5">
              <div className="spinner-border text-primary" role="status">
                <span className="visually-hidden">Loading...</span>
              </div>
            </div>
          ) : error ? (
            <div className="alert alert-danger">
              <p>{error.response?.data?.message || error.message || 'Failed to load appointments'}</p>
            </div>
          ) : appointments.length === 0 ? (
            <div className="alert alert-info">
              <p>No upcoming appointments found.</p>
            </div>
          ) : (
            <>
              {appointments.map((appointment) => (
                <div key={appointment._id} className="appointment-wrap">
                  <ul>
                    <li>
                      <div className="patinet-information">
                        <Link to={`/doctor-appointment-details?id=${appointment._id}`}>
                          <img
                            src={appointment.patientId?.profileImage || '/assets/img/doctors-dashboard/profile-01.jpg'}
                            alt="User Image"
                            onError={(e) => {
                              e.target.src = '/assets/img/doctors-dashboard/profile-01.jpg'
                            }}
                          />
                        </Link>
                        <div className="patient-info">
                          <p>{appointment.appointmentNumber || `#Apt${appointment._id.slice(-6)}`}</p>
                          <h6>
                            <Link to={`/doctor-appointment-details?id=${appointment._id}`}>
                              {appointment.patientId?.fullName || 'Unknown Patient'}
                            </Link>
                            {appointment.status === 'PENDING' && <span className="badge new-tag">New</span>}
                          </h6>
                        </div>
                      </div>
                    </li>
                    <li className="appointment-info">
                      <p>
                        <i className="fa-solid fa-clock"></i>
                        {formatDate(appointment.appointmentDate)} {formatTime(appointment.appointmentTime)}
                      </p>
                      <ul className="d-flex apponitment-types">
                        <li>{getBookingTypeDisplay(appointment.bookingType)}</li>
                        {appointment.bookingType === 'ONLINE' && <li>Video Call</li>}
                      </ul>
                    </li>
                    <li className="mail-info-patient">
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
                    </li>
                    <li className="appointment-action">
                      <ul>
                        <li>
                          <Link to={`/doctor-appointment-details?id=${appointment._id}`}>
                            <i className="fa-solid fa-eye"></i>
                          </Link>
                        </li>
                        <li>
                          <a href="#" onClick={(e) => {
                            e.preventDefault()
                            // Navigate to chat with patient (requires both patientId and appointmentId)
                            const patientId = appointment.patientId?._id || appointment.patientId
                            const appointmentId = appointment._id
                            if (patientId && appointmentId) {
                              navigate(`/chat-doctor?patientId=${patientId}&appointmentId=${appointmentId}`)
                            } else {
                              toast.error('Unable to start chat: Missing patient or appointment information')
                            }
                          }}>
                            <i className="fa-solid fa-comments"></i>
                          </a>
                        </li>
                        {appointment.status === 'PENDING' && (
                          <li>
                            <a
                              href="#"
                              onClick={(e) => {
                                e.preventDefault()
                                handleReject(appointment._id)
                              }}
                              title="Reject"
                            >
                              <i className="fa-solid fa-xmark"></i>
                            </a>
                          </li>
                        )}
                      </ul>
                    </li>
                    {appointment.status === 'PENDING' ? (
                      <li className="appointment-start">
                        <button
                          className="start-link"
                          onClick={() => handleAccept(appointment._id)}
                          disabled={acceptMutation.isLoading}
                        >
                          {acceptMutation.isLoading ? 'Processing...' : 'Accept'}
                        </button>
                      </li>
                    ) : appointment.status === 'CONFIRMED' ? (
                      <li className="appointment-start">
                        <Link to={`/doctor-appointment-start?id=${appointment._id}`} className="start-link">
                          Start Now
                        </Link>
                      </li>
                    ) : null}
                  </ul>
                </div>
              ))}

              {/* Pagination */}
              {appointmentsData?.pagination && appointmentsData.pagination.pages > 1 && (
                <div className="pagination dashboard-pagination">
                  <ul>
                    <li>
                      <a
                        href="#"
                        className="page-link"
                        onClick={(e) => {
                          e.preventDefault()
                          if (currentPage > 1) setCurrentPage(currentPage - 1)
                        }}
                      >
                        <i className="fa-solid fa-chevron-left"></i>
                      </a>
                    </li>
                    {Array.from({ length: appointmentsData.pagination.pages }, (_, i) => i + 1).map((page) => (
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
                    ))}
                    <li>
                      <a
                        href="#"
                        className="page-link"
                        onClick={(e) => {
                          e.preventDefault()
                          if (currentPage < appointmentsData.pagination.pages) {
                            setCurrentPage(currentPage + 1)
                          }
                        }}
                      >
                        <i className="fa-solid fa-chevron-right"></i>
                      </a>
                    </li>
                  </ul>
                </div>
              )}
            </>
          )}
        </div>

        {/* Cancelled Tab */}
        <div className={`tab-pane fade ${activeTab === 'cancel' ? 'show active' : ''}`} id="pills-cancel" role="tabpanel">
          {isLoading ? (
            <div className="text-center py-5">
              <div className="spinner-border text-primary" role="status">
                <span className="visually-hidden">Loading...</span>
              </div>
            </div>
          ) : appointments.length === 0 ? (
            <div className="alert alert-info">
              <p>No cancelled appointments found.</p>
            </div>
          ) : (
            <>
              {appointments.map((appointment) => (
                <div key={appointment._id} className="appointment-wrap">
                  <ul>
                    <li>
                      <div className="patinet-information">
                        <Link to={`/doctor-appointment-details?id=${appointment._id}`}>
                          <img
                            src={appointment.patientId?.profileImage || '/assets/img/doctors-dashboard/profile-01.jpg'}
                            alt="User Image"
                            onError={(e) => {
                              e.target.src = '/assets/img/doctors-dashboard/profile-01.jpg'
                            }}
                          />
                        </Link>
                        <div className="patient-info">
                          <p>{appointment.appointmentNumber || `#Apt${appointment._id.slice(-6)}`}</p>
                          <h6>
                            <Link to={`/doctor-appointment-details?id=${appointment._id}`}>
                              {appointment.patientId?.fullName || 'Unknown Patient'}
                            </Link>
                          </h6>
                        </div>
                      </div>
                    </li>
                    <li className="appointment-info">
                      <p>
                        <i className="fa-solid fa-clock"></i>
                        {formatDate(appointment.appointmentDate)} {formatTime(appointment.appointmentTime)}
                      </p>
                      <ul className="d-flex apponitment-types">
                        <li>{getBookingTypeDisplay(appointment.bookingType)}</li>
                      </ul>
                    </li>
                    <li className="appointment-detail-btn">
                      <Link to={`/doctor-appointment-details?id=${appointment._id}`} className="start-link">
                        View Details
                      </Link>
                    </li>
                  </ul>
                </div>
              ))}

              {/* Pagination */}
              {appointmentsData?.pagination && appointmentsData.pagination.pages > 1 && (
                <div className="pagination dashboard-pagination">
                  <ul>
                    <li>
                      <a
                        href="#"
                        className="page-link"
                        onClick={(e) => {
                          e.preventDefault()
                          if (currentPage > 1) setCurrentPage(currentPage - 1)
                        }}
                      >
                        <i className="fa-solid fa-chevron-left"></i>
                      </a>
                    </li>
                    {Array.from({ length: appointmentsData.pagination.pages }, (_, i) => i + 1).map((page) => (
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
                    ))}
                    <li>
                      <a
                        href="#"
                        className="page-link"
                        onClick={(e) => {
                          e.preventDefault()
                          if (currentPage < appointmentsData.pagination.pages) {
                            setCurrentPage(currentPage + 1)
                          }
                        }}
                      >
                        <i className="fa-solid fa-chevron-right"></i>
                      </a>
                    </li>
                  </ul>
                </div>
              )}
            </>
          )}
        </div>

        {/* Completed Tab */}
        <div className={`tab-pane fade ${activeTab === 'complete' ? 'show active' : ''}`} id="pills-complete" role="tabpanel">
          {isLoading ? (
            <div className="text-center py-5">
              <div className="spinner-border text-primary" role="status">
                <span className="visually-hidden">Loading...</span>
              </div>
            </div>
          ) : appointments.length === 0 ? (
            <div className="alert alert-info">
              <p>No completed appointments found.</p>
            </div>
          ) : (
            <>
              {appointments.map((appointment) => (
                <div key={appointment._id} className="appointment-wrap">
                  <ul>
                    <li>
                      <div className="patinet-information">
                        <Link to={`/doctor-appointment-details?id=${appointment._id}`}>
                          <img
                            src={appointment.patientId?.profileImage || '/assets/img/doctors-dashboard/profile-01.jpg'}
                            alt="User Image"
                            onError={(e) => {
                              e.target.src = '/assets/img/doctors-dashboard/profile-01.jpg'
                            }}
                          />
                        </Link>
                        <div className="patient-info">
                          <p>{appointment.appointmentNumber || `#Apt${appointment._id.slice(-6)}`}</p>
                          <h6>
                            <Link to={`/doctor-appointment-details?id=${appointment._id}`}>
                              {appointment.patientId?.fullName || 'Unknown Patient'}
                            </Link>
                          </h6>
                        </div>
                      </div>
                    </li>
                    <li className="appointment-info">
                      <p>
                        <i className="fa-solid fa-clock"></i>
                        {formatDate(appointment.appointmentDate)} {formatTime(appointment.appointmentTime)}
                      </p>
                      <ul className="d-flex apponitment-types">
                        <li>{getBookingTypeDisplay(appointment.bookingType)}</li>
                      </ul>
                    </li>
                    <li className="appointment-detail-btn">
                      <Link to={`/doctor-appointment-details?id=${appointment._id}`} className="start-link">
                        View Details
                      </Link>
                    </li>
                  </ul>
                </div>
              ))}

              {/* Pagination */}
              {appointmentsData?.pagination && appointmentsData.pagination.pages > 1 && (
                <div className="pagination dashboard-pagination">
                  <ul>
                    <li>
                      <a
                        href="#"
                        className="page-link"
                        onClick={(e) => {
                          e.preventDefault()
                          if (currentPage > 1) setCurrentPage(currentPage - 1)
                        }}
                      >
                        <i className="fa-solid fa-chevron-left"></i>
                      </a>
                    </li>
                    {Array.from({ length: appointmentsData.pagination.pages }, (_, i) => i + 1).map((page) => (
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
                    ))}
                    <li>
                      <a
                        href="#"
                        className="page-link"
                        onClick={(e) => {
                          e.preventDefault()
                          if (currentPage < appointmentsData.pagination.pages) {
                            setCurrentPage(currentPage + 1)
                          }
                        }}
                      >
                        <i className="fa-solid fa-chevron-right"></i>
                      </a>
                    </li>
                  </ul>
                </div>
              )}
            </>
          )}
        </div>
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
                  onClick={() => setRejectModal({ show: false, appointmentId: null, reason: '' })}
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
                  onClick={() => setRejectModal({ show: false, appointmentId: null, reason: '' })}
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
            onClick={() => setRejectModal({ show: false, appointmentId: null, reason: '' })}
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

export default DoctorAppointments
