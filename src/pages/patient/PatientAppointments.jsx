import { useState, useMemo } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { toast } from 'react-toastify'
import * as appointmentApi from '../../api/appointments'
import { useAuth } from '../../contexts/AuthContext'

const PatientAppointments = () => {
  const { user } = useAuth()
  const navigate = useNavigate()
  const queryClient = useQueryClient()

  const [activeTab, setActiveTab] = useState('upcoming') // upcoming, cancelled, completed
  const [searchTerm, setSearchTerm] = useState('')
  const [dateRange, setDateRange] = useState({ fromDate: '', toDate: '' })

  // Determine status filter based on active tab
  const statusFilter = useMemo(() => {
    switch (activeTab) {
      case 'upcoming':
        return ['PENDING', 'CONFIRMED']
      case 'cancelled':
        return ['CANCELLED', 'REJECTED']
      case 'completed':
        return ['COMPLETED']
      default:
        return []
    }
  }, [activeTab])

  // Build query params
  const queryParams = useMemo(() => {
    const params = {
      page: 1,
      limit: 50
    }

    if (statusFilter.length > 0) {
      params.status = statusFilter[0] // API accepts single status, we'll filter client-side if needed
    }

    if (dateRange.fromDate) {
      params.fromDate = dateRange.fromDate
    }
    if (dateRange.toDate) {
      params.toDate = dateRange.toDate
    }

    return params
  }, [statusFilter, dateRange])

  // Fetch appointments
  const { data: appointmentsData, isLoading, error } = useQuery({
    queryKey: ['patientAppointments', queryParams],
    queryFn: () => appointmentApi.listAppointments(queryParams),
    enabled: !!user
  })

  // Cancel appointment mutation
  const cancelAppointmentMutation = useMutation({
    mutationFn: ({ id, reason }) => appointmentApi.cancelAppointment(id, reason),
    onSuccess: () => {
      queryClient.invalidateQueries(['patientAppointments'])
      toast.success('Appointment cancelled successfully')
    },
    onError: (error) => {
      const errorMessage = error.response?.data?.message || error.message || 'Failed to cancel appointment'
      toast.error(errorMessage)
    }
  })

  // Extract appointments from response
  const appointments = useMemo(() => {
    if (!appointmentsData) return []
    
    const responseData = appointmentsData.data || appointmentsData
    const appointmentsList = responseData.appointments || responseData.data || responseData || []
    
    // Filter by status (since API might return all statuses)
    let filtered = appointmentsList
    if (statusFilter.length > 0) {
      filtered = appointmentsList.filter(apt => statusFilter.includes(apt.status))
    }

    // Filter by search term
    if (searchTerm) {
      const searchLower = searchTerm.toLowerCase()
      filtered = filtered.filter(apt => {
        const doctor = apt.doctorId
        const doctorName = doctor?.fullName || doctor?.name || ''
        const appointmentNumber = apt.appointmentNumber || apt._id || ''
        return (
          doctorName.toLowerCase().includes(searchLower) ||
          appointmentNumber.toLowerCase().includes(searchLower)
        )
      })
    }

    return filtered
  }, [appointmentsData, statusFilter, searchTerm])

  // Count appointments by status
  const appointmentCounts = useMemo(() => {
    if (!appointmentsData) return { upcoming: 0, cancelled: 0, completed: 0 }
    
    const responseData = appointmentsData.data || appointmentsData
    const allAppointments = responseData.appointments || responseData.data || responseData || []
    
    return {
      upcoming: allAppointments.filter(apt => ['PENDING', 'CONFIRMED'].includes(apt.status)).length,
      cancelled: allAppointments.filter(apt => ['CANCELLED', 'REJECTED'].includes(apt.status)).length,
      completed: allAppointments.filter(apt => apt.status === 'COMPLETED').length
    }
  }, [appointmentsData])

  // Format date and time
  const formatDateTime = (date, time) => {
    if (!date) return 'N/A'
    const d = new Date(date)
    const dateStr = d.toLocaleDateString('en-US', { day: 'numeric', month: 'short', year: 'numeric' })
    return time ? `${dateStr} ${time}` : dateStr
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

  // Handle cancel appointment
  const handleCancel = (appointmentId) => {
    if (window.confirm('Are you sure you want to cancel this appointment?')) {
      cancelAppointmentMutation.mutate({ id: appointmentId, reason: 'Cancelled by patient' })
    }
  }

  // Handle chat navigation
  const handleChatClick = (e, appointmentId, doctorId) => {
    e.preventDefault()
    navigate(`/chat?appointmentId=${appointmentId}&doctorId=${doctorId}`)
  }

  // Handle view details
  const handleViewDetails = (appointmentId) => {
    navigate(`/patient-appointment-details?id=${appointmentId}`)
  }

  if (isLoading) {
    return (
      <div className="content doctor-content">
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
                <p className="mt-3 text-muted">Loading appointments...</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="content doctor-content">
        <div className="container">
          <div className="row">
            <div className="col-lg-4 col-xl-3 theiaStickySidebar">
              {/* PatientSidebar will be rendered by DashboardLayout */}
            </div>
            <div className="col-lg-12 col-xl-12">
              <div className="alert alert-danger">
                <h5>Error Loading Appointments</h5>
                <p>{error.response?.data?.message || error.message || 'Failed to load appointments'}</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    )
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
              <h3>Appointments</h3>
              <ul className="header-list-btns">
                <li>
                  <div className="input-block dash-search-input">
                    <input
                      type="text"
                      className="form-control"
                      placeholder="Search"
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                    />
                    <span className="search-icon"><i className="isax isax-search-normal"></i></span>
                  </div>
                </li>
                <li>
                  <div className="view-icons">
                    <Link to="/patient-appointments" className="active"><i className="isax isax-grid-7"></i></Link>
                  </div>
                </li>
                <li>
                  <div className="view-icons">
                    <Link to="/patient-appointments-grid"><i className="fa-solid fa-th"></i></Link>
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
                      onClick={() => setActiveTab('upcoming')}
                      type="button"
                    >
                      Upcoming<span>{appointmentCounts.upcoming}</span>
                    </button>
                  </li>
                  <li className="nav-item" role="presentation">
                    <button
                      className={`nav-link ${activeTab === 'cancelled' ? 'active' : ''}`}
                      onClick={() => setActiveTab('cancelled')}
                      type="button"
                    >
                      Cancelled<span>{appointmentCounts.cancelled}</span>
                    </button>
                  </li>
                  <li className="nav-item" role="presentation">
                    <button
                      className={`nav-link ${activeTab === 'completed' ? 'active' : ''}`}
                      onClick={() => setActiveTab('completed')}
                      type="button"
                    >
                      Completed<span>{appointmentCounts.completed}</span>
                    </button>
                  </li>
                </ul>
              </div>
              <div className="filter-head">
                <div className="position-relative daterange-wraper me-2">
                  <div className="input-groupicon calender-input">
                    <input
                      type="text"
                      className="form-control date-range bookingrange"
                      placeholder="From Date - To Date"
                      onChange={(e) => {
                        // Date range picker would be implemented here
                        // For now, just a placeholder
                      }}
                    />
                  </div>
                  <i className="isax isax-calendar-1"></i>
                </div>
                <div className="form-sorts dropdown">
                  <a href="javascript:void(0);" className="dropdown-toggle" id="table-filter">
                    <i className="isax isax-filter me-2"></i>Filter By
                  </a>
                </div>
              </div>
            </div>

            <div className="tab-content appointment-tab-content">
              <div className="tab-pane fade show active" id="pills-upcoming" role="tabpanel">
                {appointments.length === 0 ? (
                  <div className="text-center py-5">
                    <p className="text-muted">No {activeTab} appointments found</p>
                  </div>
                ) : (
                  appointments.map((apt) => {
                    const doctor = apt.doctorId
                    const doctorId = doctor?._id || doctor
                    const doctorName = doctor?.fullName || 'Unknown Doctor'
                    const doctorImage = doctor?.profileImage || '/assets/img/doctors/doctor-thumb-21.jpg'
                    const doctorEmail = doctor?.email || ''
                    const doctorPhone = doctor?.phone || ''
                    const appointmentNumber = apt.appointmentNumber || `#${apt._id.slice(-6)}`
                    const isNew = apt.status === 'PENDING'
                    const bookingType = apt.bookingType || 'VISIT'
                    const types = [getBookingTypeDisplay(bookingType)]

                    return (
                      <div key={apt._id} className="appointment-wrap">
                        <ul>
                          <li>
                            <div className="patinet-information">
                              <Link to={`/patient-appointment-details?id=${apt._id}`}>
                                <img
                                  src={doctorImage}
                                  alt={doctorName}
                                  onError={(e) => {
                                    e.target.src = '/assets/img/doctors/doctor-thumb-21.jpg'
                                  }}
                                />
                              </Link>
                              <div className="patient-info">
                                <p>{appointmentNumber}</p>
                                <h6>
                                  <Link to={`/patient-appointment-details?id=${apt._id}`}>{doctorName}</Link>
                                  {isNew && <span className="badge new-tag">New</span>}
                                </h6>
                              </div>
                            </div>
                          </li>
                          <li className="appointment-info">
                            <p><i className="isax isax-clock5"></i>{formatDateTime(apt.appointmentDate, apt.appointmentTime)}</p>
                            <ul className="d-flex apponitment-types">
                              {types.map((type, i) => (
                                <li key={i}>{type}</li>
                              ))}
                            </ul>
                          </li>
                          <li className="mail-info-patient">
                            <ul>
                              {doctorEmail && <li><i className="isax isax-sms5"></i>{doctorEmail}</li>}
                              {doctorPhone && <li><i className="isax isax-call5"></i>{doctorPhone}</li>}
                            </ul>
                          </li>
                          <li className="appointment-action">
                            <ul>
                              <li>
                                <Link
                                  to={`/patient-appointment-details?id=${apt._id}`}
                                  onClick={(e) => {
                                    e.preventDefault()
                                    handleViewDetails(apt._id)
                                  }}
                                >
                                  <i className="isax isax-eye4"></i>
                                </Link>
                              </li>
                              <li>
                                <a
                                  href="#"
                                  onClick={(e) => handleChatClick(e, apt._id, doctorId)}
                                >
                                  <i className="isax isax-messages-25"></i>
                                </a>
                              </li>
                              {activeTab === 'upcoming' && apt.status !== 'CANCELLED' && (
                                <li>
                                  <a
                                    href="#"
                                    onClick={(e) => {
                                      e.preventDefault()
                                      handleCancel(apt._id)
                                    }}
                                  >
                                    <i className="isax isax-close-circle5"></i>
                                  </a>
                                </li>
                              )}
                            </ul>
                          </li>
                          {activeTab === 'upcoming' && apt.status === 'CONFIRMED' && (
                            <li className="appointment-detail-btn">
                              <Link
                                to={`/video-call-room?appointmentId=${apt._id}`}
                                className="btn btn-md btn-primary-gradient"
                              >
                                <i className="isax isax-calendar-tick5 me-1"></i>Attend
                              </Link>
                            </li>
                          )}
                        </ul>
                      </div>
                    )
                  })
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default PatientAppointments
