import { useState, useMemo } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { toast } from 'react-toastify'
import * as appointmentApi from '../../api/appointments'
import { useAuth } from '../../contexts/AuthContext'

const PatientAppointmentsGrid = () => {
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
      params.status = statusFilter[0]
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
    
    // Filter by status
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

  // Format date
  const formatDate = (date) => {
    if (!date) return 'N/A'
    const d = new Date(date)
    return d.toLocaleDateString('en-US', { day: 'numeric', month: 'short', year: 'numeric' })
  }

  // Format time
  const formatTime = (time) => {
    if (!time) return ''
    return time
  }

  // Get booking type icon
  const getBookingTypeIcon = (bookingType) => {
    switch (bookingType) {
      case 'ONLINE':
        return 'video'
      case 'VISIT':
        return 'hospital'
      default:
        return 'video'
    }
  }

  // Get icon component
  const getIcon = (iconType) => {
    switch(iconType) {
      case 'video':
        return <i className="isax isax-video5"></i>
      case 'hospital':
        return <i className="isax isax-hospital5"></i>
      case 'call':
        return <i className="isax isax-call5"></i>
      default:
        return <i className="isax isax-video5"></i>
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
            <div className="col-lg-8 col-xl-9">
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
            <div className="col-lg-8 col-xl-9">
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
          <div className="col-lg-8 col-xl-9">
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
                    <Link to="/patient-appointments"><i className="isax isax-grid-7"></i></Link>
                  </div>
                </li>
                <li>
                  <div className="view-icons">
                    <Link to="/patient-appointments-grid" className="active"><i className="fa-solid fa-th"></i></Link>
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

            <div className="tab-content appointment-tab-content appoint-patient">
              <div className="tab-pane fade show active" id="pills-upcoming" role="tabpanel">
                {appointments.length === 0 ? (
                  <div className="text-center py-5">
                    <p className="text-muted">No {activeTab} appointments found</p>
                  </div>
                ) : (
                  <div className="row">
                    {appointments.map((apt) => {
                      const doctor = apt.doctorId
                      const doctorId = doctor?._id || doctor
                      const doctorName = doctor?.fullName || 'Unknown Doctor'
                      const doctorImage = doctor?.profileImage || '/assets/img/doctors/doctor-thumb-21.jpg'
                      const appointmentNumber = apt.appointmentNumber || `#${apt._id.slice(-6)}`
                      const bookingType = apt.bookingType || 'VISIT'
                      const iconType = getBookingTypeIcon(bookingType)
                      const visitType = getBookingTypeDisplay(bookingType)

                      return (
                        <div key={apt._id} className="col-xl-4 col-lg-6 col-md-12 d-flex">
                          <div className="appointment-wrap appointment-grid-wrap">
                            <ul>
                              <li>
                                <div className="appointment-grid-head">
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
                                      </h6>
                                      <p className="visit">{visitType}</p>
                                    </div>
                                  </div>
                                  <div className="grid-user-msg">
                                    <span className={`${iconType === 'video' ? 'video' : iconType === 'hospital' ? 'hospital' : 'telephone'}-icon`}>
                                      <a
                                        href="#"
                                        onClick={(e) => {
                                          e.preventDefault()
                                          if (iconType === 'video' && apt.status === 'CONFIRMED') {
                                            navigate(`/video-call-room?appointmentId=${apt._id}`)
                                          }
                                        }}
                                      >
                                        {getIcon(iconType)}
                                      </a>
                                    </span>
                                  </div>
                                </div>
                              </li>
                              <li className="appointment-info">
                                <p><i className="isax isax-calendar5"></i>{formatDate(apt.appointmentDate)}</p>
                                <p><i className="isax isax-clock5"></i>{formatTime(apt.appointmentTime)}</p>
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
                                {activeTab === 'upcoming' && apt.status === 'CONFIRMED' && (
                                  <div className="appointment-detail-btn">
                                    <Link
                                      to={`/video-call-room?appointmentId=${apt._id}`}
                                      className="start-link"
                                    >
                                      <i className="isax isax-calendar-tick5 me-1"></i>Attend
                                    </Link>
                                  </div>
                                )}
                              </li>
                            </ul>
                          </div>
                        </div>
                      )
                    })}
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default PatientAppointmentsGrid
