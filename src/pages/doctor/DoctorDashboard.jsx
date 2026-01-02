import { useEffect, useMemo } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useQuery } from '@tanstack/react-query'
import { useAuth } from '../../contexts/AuthContext'
import * as doctorApi from '../../api/doctor'

const DoctorDashboard = () => {
  const { user } = useAuth()
  const navigate = useNavigate()

  // Fetch dashboard statistics
  const { data: dashboardData, isLoading, error, isError } = useQuery({
    queryKey: ['doctorDashboard'],
    queryFn: () => doctorApi.getDoctorDashboard(),
    enabled: !!user,
    refetchInterval: 30000, // Refetch every 30 seconds
    retry: 1
  })

  // Extract dashboard data from response
  const dashboard = useMemo(() => {
    if (!dashboardData) {
      console.log('No dashboard data received')
      return null
    }
    console.log('Raw Dashboard Data:', dashboardData)
    // Axios interceptor returns response.data = { success, message, data: {...} }
    // So dashboardData is already { success, message, data: {...} }
    const responseData = dashboardData.data || dashboardData
    console.log('Extracted Dashboard:', responseData)
    
    // The dashboard object should be directly in responseData
    // Check if it has dashboard properties (totalPatients, todayAppointments, etc.)
    if (responseData && (responseData.totalPatients !== undefined || responseData.todayAppointments !== undefined)) {
      return responseData
    }
    
    // If not, check if there's a nested data property
    if (responseData && responseData.data && typeof responseData.data === 'object') {
      return responseData.data
    }
    
    return responseData
  }, [dashboardData])

  // Calculate stats and derived data (must be before early returns)
  const stats = useMemo(() => {
    if (!dashboard) {
      return {
        totalPatients: 0,
        todayAppointments: 0,
        weeklyAppointments: 0,
        revenue: 0,
        upcomingAppointments: 0,
        unreadMessages: 0,
        unreadNotifications: 0,
        rating: 0,
        ratingCount: 0
      }
    }
    return {
      totalPatients: dashboard.totalPatients || 0,
      todayAppointments: dashboard.todayAppointments?.count || 0,
      weeklyAppointments: dashboard.weeklyAppointments?.count || 0,
      revenue: dashboard.earningsFromAppointments || 0,
      upcomingAppointments: dashboard.upcomingAppointments?.count || 0,
      unreadMessages: dashboard.unreadMessagesCount || 0,
      unreadNotifications: dashboard.unreadNotificationsCount || 0,
      rating: dashboard.rating?.average || 0,
      ratingCount: dashboard.rating?.count || 0
    }
  }, [dashboard])

  const todayAppointments = useMemo(() => {
    return dashboard?.todayAppointments?.appointments || []
  }, [dashboard])

  const upcomingAppointments = useMemo(() => {
    return dashboard?.upcomingAppointments?.appointments || []
  }, [dashboard])

  // Get recent patients from today's appointments
  const recentPatients = useMemo(() => {
    const patients = new Map()
    todayAppointments.forEach(apt => {
      if (apt.patientId && !patients.has(apt.patientId._id || apt.patientId)) {
        patients.set(apt.patientId._id || apt.patientId, {
          patient: apt.patientId,
          lastAppointment: apt.appointmentDate
        })
      }
    })
    return Array.from(patients.values()).slice(0, 2)
  }, [todayAppointments])

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
    if (amount === null || amount === undefined) return '$0'
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: currency || 'USD'
    }).format(amount)
  }

  // Get relative time
  const getRelativeTime = (date) => {
    if (!date) return 'N/A'
    const now = new Date()
    const d = new Date(date)
    const diffMs = now - d
    const diffMins = Math.floor(diffMs / 60000)
    const diffHours = Math.floor(diffMs / 3600000)
    const diffDays = Math.floor(diffMs / 86400000)

    if (diffMins < 1) return 'Just Now'
    if (diffMins < 60) return `${diffMins} minute${diffMins > 1 ? 's' : ''} ago`
    if (diffHours < 24) return `${diffHours} hour${diffHours > 1 ? 's' : ''} ago`
    if (diffDays < 7) return `${diffDays} day${diffDays > 1 ? 's' : ''} ago`
    return formatDate(date)
  }

  // Handle chat navigation
  const handleChatClick = (patientId, appointmentId) => {
    navigate(`/chat-doctor?patientId=${patientId}&appointmentId=${appointmentId}`)
  }

  // Handle appointment details
  const handleAppointmentClick = (appointmentId) => {
    navigate(`/appointment-details?id=${appointmentId}`)
  }

  useEffect(() => {
    // Initialize charts if needed
    if (typeof window !== 'undefined' && window.$) {
      // Initialize any carousels or charts here
    }
  }, [])

  if (isLoading) {
    return (
      <div className="content">
        <div className="container">
          <div className="row">
            <div className="col-lg-4 col-xl-3 theiaStickySidebar">
              {/* Sidebar is handled by DashboardLayout */}
            </div>
            <div className="col-lg-12 col-xl-12">
              <div className="text-center py-5">
                <div className="spinner-border" role="status">
                  <span className="visually-hidden">Loading...</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    )
  }

  if (isError || error) {
    console.error('Error loading dashboard:', error)
    const errorMessage = error?.response?.data?.message || error?.message || 'Failed to load dashboard'
    return (
      <div className="content">
        <div className="container">
          <div className="row">
            <div className="col-lg-4 col-xl-3 theiaStickySidebar">
              {/* Sidebar is handled by DashboardLayout */}
            </div>
            <div className="col-lg-12 col-xl-12">
              <div className="card">
                <div className="card-body text-center py-5">
                  <i className="fe fe-alert-circle" style={{ fontSize: '64px', color: '#dee2e6' }}></i>
                  <h5 className="mt-3">Error loading dashboard</h5>
                  <p className="text-muted">{errorMessage}</p>
                  <button 
                    className="btn btn-primary mt-3"
                    onClick={() => window.location.reload()}
                  >
                    Refresh Page
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    )
  }

  if (!dashboard && !isLoading) {
    console.log('Dashboard is null and not loading. DashboardData:', dashboardData)
    return (
      <div className="content">
        <div className="container">
          <div className="row">
            <div className="col-lg-4 col-xl-3 theiaStickySidebar">
              {/* Sidebar is handled by DashboardLayout */}
            </div>
            <div className="col-lg-12 col-xl-12">
              <div className="card">
                <div className="card-body text-center py-5">
                  <i className="fe fe-alert-circle" style={{ fontSize: '64px', color: '#dee2e6' }}></i>
                  <h5 className="mt-3">No dashboard data available</h5>
                  <p className="text-muted">Unable to load dashboard statistics. Please try again later.</p>
                  <button 
                    className="btn btn-primary mt-3"
                    onClick={() => window.location.reload()}
                  >
                    Refresh Page
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    )
  }

  if (!dashboard) {
    return (
      <div className="content">
        <div className="container">
          <div className="row">
            <div className="col-lg-4 col-xl-3 theiaStickySidebar">
              {/* Sidebar is handled by DashboardLayout */}
            </div>
            <div className="col-lg-12 col-xl-12">
              <div className="text-center py-5">
                <div className="spinner-border" role="status">
                  <span className="visually-hidden">Loading...</span>
                </div>
                <p className="mt-3 text-muted">Loading dashboard...</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    )
  }

  // Get recent transactions (for invoices section)
  // Note: This would need to be fetched separately or included in dashboard API
  const recentTransactions = [] // Placeholder - would need separate API call

  return (
    <div className="content">
      <div className="container">
        <div className="row">
          <div className="col-lg-4 col-xl-3 theiaStickySidebar">
            {/* Sidebar is handled by DashboardLayout */}
          </div>
          <div className="col-lg-12 col-xl-12">
            <div className="row">
              {/* Statistics Cards */}
              <div className="col-xl-4 d-flex">
                <div className="dashboard-box-col w-100">
                  <div className="dashboard-widget-box">
                    <div className="dashboard-content-info">
                      <h6>Total Patients</h6>
                      <h4>{stats.totalPatients}</h4>
                      <span className="text-success">
                        <i className="fa-solid fa-arrow-up"></i>
                        {stats.weeklyAppointments} This Week
                      </span>
                    </div>
                    <div className="dashboard-widget-icon">
                      <span className="dash-icon-box"><i className="fa-solid fa-user-injured"></i></span>
                    </div>
                  </div>
                  <div className="dashboard-widget-box">
                    <div className="dashboard-content-info">
                      <h6>Today's Appointments</h6>
                      <h4>{stats.todayAppointments}</h4>
                      <span className={stats.todayAppointments > 0 ? 'text-success' : 'text-muted'}>
                        <i className="fa-solid fa-calendar-days"></i>
                        {stats.todayAppointments > 0 ? 'Active' : 'No appointments'}
                      </span>
                    </div>
                    <div className="dashboard-widget-icon">
                      <span className="dash-icon-box"><i className="fa-solid fa-calendar-days"></i></span>
                    </div>
                  </div>
                  <div className="dashboard-widget-box">
                    <div className="dashboard-content-info">
                      <h6>Revenue</h6>
                      <h4>{formatCurrency(stats.revenue)}</h4>
                      <span className="text-success">
                        <i className="fa-solid fa-dollar-sign"></i>
                        From Appointments
                      </span>
                    </div>
                    <div className="dashboard-widget-icon">
                      <span className="dash-icon-box"><i className="fa-solid fa-money-bill-wave"></i></span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Today's Appointments Table */}
              <div className="col-xl-8 d-flex">
                <div className="dashboard-card w-100">
                  <div className="dashboard-card-head">
                    <div className="header-title">
                      <h5>Today's Appointments</h5>
                    </div>
                    <div className="card-view-link">
                      <Link to="/appointments">View All</Link>
                    </div>
                  </div>
                  <div className="dashboard-card-body">
                    <div className="table-responsive">
                      <table className="table dashboard-table appoint-table">
                        <tbody>
                          {todayAppointments.length === 0 ? (
                            <tr>
                              <td colSpan="3" className="text-center py-4">
                                <p className="text-muted mb-0">No appointments scheduled for today</p>
                              </td>
                            </tr>
                          ) : (
                            todayAppointments.slice(0, 5).map((appointment) => {
                              const patient = appointment.patientId
                              const patientId = patient?._id || patient
                              const patientName = patient?.fullName || 'Unknown Patient'
                              const patientImage = patient?.profileImage || '/assets/img/doctors-dashboard/profile-01.jpg'
                              
                              return (
                                <tr key={appointment._id}>
                                  <td>
                                    <div className="patient-info-profile">
                                      <Link
                                        to={`/patient-profile?patientId=${patientId}`}
                                        className="table-avatar"
                                      >
                                        <img
                                          src={patientImage}
                                          alt={patientName}
                                          onError={(e) => {
                                            e.target.src = '/assets/img/doctors-dashboard/profile-01.jpg'
                                          }}
                                        />
                                      </Link>
                                      <div className="patient-name-info">
                                        <span>#{appointment.appointmentNumber || appointment._id.slice(-6)}</span>
                                        <h5>
                                          <Link to={`/patient-profile?patientId=${patientId}`}>
                                            {patientName}
                                          </Link>
                                        </h5>
                                      </div>
                                    </div>
                                  </td>
                                  <td>
                                    <div className="appointment-date-created">
                                      <h6>{formatDateTime(appointment.appointmentDate, appointment.appointmentTime)}</h6>
                                      <span className="badge table-badge">
                                        {appointment.bookingType === 'ONLINE' ? 'Online' : 'Visit'}
                                      </span>
                                    </div>
                                  </td>
                                  <td>
                                    <div className="apponiment-actions d-flex align-items-center">
                                      <Link
                                        to={`/chat-doctor?patientId=${patientId}&appointmentId=${appointment._id}`}
                                        className="text-primary-icon me-2"
                                        title="Chat"
                                      >
                                        <i className="fa-solid fa-comment"></i>
                                      </Link>
                                      <Link
                                        to={`/appointment-details?id=${appointment._id}`}
                                        className="text-success-icon me-2"
                                        title="View Details"
                                      >
                                        <i className="fa-solid fa-eye"></i>
                                      </Link>
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
                </div>
              </div>

              {/* Weekly Overview & Recent Patients */}
              <div className="col-xl-5 d-flex">
                <div className="dashboard-chart-col w-100">
                  <div className="dashboard-card w-100">
                    <div className="dashboard-card-head border-0">
                      <div className="header-title">
                        <h5>Weekly Overview</h5>
                      </div>
                      <div className="chart-create-date">
                        <h6>{stats.weeklyAppointments} Appointments</h6>
                      </div>
                    </div>
                    <div className="dashboard-card-body">
                      <div className="text-center py-4">
                        <h3 className="mb-2">{stats.weeklyAppointments}</h3>
                        <p className="text-muted mb-0">Appointments This Week</p>
                        <p className="text-muted small mt-2">
                          {stats.todayAppointments} today • {stats.upcomingAppointments} upcoming
                        </p>
                      </div>
                    </div>
                  </div>
                  <div className="dashboard-card w-100">
                    <div className="dashboard-card-head">
                      <div className="header-title">
                        <h5>Recent Patients</h5>
                      </div>
                      <div className="card-view-link">
                        <Link to="/my-patients">View All</Link>
                      </div>
                    </div>
                    <div className="dashboard-card-body">
                      <div className="d-flex recent-patient-grid-boxes">
                        {recentPatients.length === 0 ? (
                          <div className="text-center w-100 py-3">
                            <p className="text-muted mb-0">No recent patients</p>
                          </div>
                        ) : (
                          recentPatients.map((item, idx) => {
                            const patient = item.patient
                            const patientId = patient?._id || patient
                            const patientName = patient?.fullName || 'Unknown Patient'
                            const patientImage = patient?.profileImage || '/assets/img/doctors-dashboard/profile-01.jpg'
                            
                            return (
                              <div key={idx} className="recent-patient-grid">
                                <Link
                                  to={`/patient-profile?patientId=${patientId}`}
                                  className="patient-img"
                                >
                                  <img
                                    src={patientImage}
                                    alt={patientName}
                                    onError={(e) => {
                                      e.target.src = '/assets/img/doctors-dashboard/profile-01.jpg'
                                    }}
                                  />
                                </Link>
                                <h5>
                                  <Link to={`/patient-profile?patientId=${patientId}`}>
                                    {patientName}
                                  </Link>
                                </h5>
                                <span>Patient ID : {patientId?.slice(-6).toUpperCase() || 'N/A'}</span>
                                <div className="date-info">
                                  <p>
                                    Last Appointment<br />
                                    {formatDate(item.lastAppointment)}
                                  </p>
                                </div>
                              </div>
                            )
                          })
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Upcoming Appointment & Recent Invoices */}
              <div className="col-xl-7 d-flex">
                <div className="dashboard-main-col w-100">
                  {/* Upcoming Appointment Card */}
                  {upcomingAppointments.length > 0 && (
                    <div className="upcoming-appointment-card">
                      <div className="title-card">
                        <h5>Upcoming Appointment</h5>
                      </div>
                      <div className="upcoming-patient-info">
                        {(() => {
                          const nextAppointment = upcomingAppointments[0]
                          const patient = nextAppointment.patientId
                          const patientId = patient?._id || patient
                          const patientName = patient?.fullName || 'Unknown Patient'
                          const patientImage = patient?.profileImage || '/assets/img/doctors-dashboard/profile-01.jpg'
                          
                          return (
                            <>
                              <div className="info-details">
                                <span className="img-avatar">
                                  <img
                                    src={patientImage}
                                    alt={patientName}
                                    onError={(e) => {
                                      e.target.src = '/assets/img/doctors-dashboard/profile-01.jpg'
                                    }}
                                  />
                                </span>
                                <div className="name-info">
                                  <span>#{nextAppointment.appointmentNumber || nextAppointment._id.slice(-6)}</span>
                                  <h6>{patientName}</h6>
                                </div>
                              </div>
                              <div className="date-details">
                                <span>{nextAppointment.bookingType === 'ONLINE' ? 'Online' : 'Visit'}</span>
                                <h6>{formatDateTime(nextAppointment.appointmentDate, nextAppointment.appointmentTime)}</h6>
                              </div>
                              <div className="circle-bg">
                                <img src="/assets/img/bg/dashboard-circle-bg.png" alt="Img" />
                              </div>
                            </>
                          )
                        })()}
                      </div>
                      <div className="appointment-card-footer">
                        <h5>
                          <i className="fa-solid fa-video"></i>
                          {upcomingAppointments[0]?.bookingType === 'ONLINE' ? 'Video Appointment' : 'In-Person Appointment'}
                        </h5>
                        <div className="btn-appointments">
                          <Link
                            to={`/chat-doctor?patientId=${upcomingAppointments[0]?.patientId?._id || upcomingAppointments[0]?.patientId}&appointmentId=${upcomingAppointments[0]?._id}`}
                            className="btn"
                          >
                            Chat Now
                          </Link>
                          <Link
                            to={`/appointment-details?id=${upcomingAppointments[0]?._id}`}
                            className="btn"
                          >
                            View Details
                          </Link>
                        </div>
                      </div>
                    </div>
                  )}

                  {/* Recent Invoices */}
                  <div className="dashboard-card w-100">
                    <div className="dashboard-card-head">
                      <div className="header-title">
                        <h5>Recent Invoices</h5>
                      </div>
                      <div className="card-view-link">
                        <Link to="/invoices">View All</Link>
                      </div>
                    </div>
                    <div className="dashboard-card-body">
                      <div className="table-responsive">
                        <table className="table dashboard-table">
                          <tbody>
                            {recentTransactions.length === 0 ? (
                              <tr>
                                <td colSpan="4" className="text-center py-4">
                                  <p className="text-muted mb-0">No recent invoices</p>
                                  <Link to="/invoices" className="btn btn-sm btn-primary mt-2">
                                    View All Invoices
                                  </Link>
                                </td>
                              </tr>
                            ) : (
                              recentTransactions.map((transaction) => (
                                <tr key={transaction._id}>
                                  <td>
                                    <div className="patient-info-profile">
                                      <Link to="/invoices" className="table-avatar">
                                        <img src="/assets/img/doctors-dashboard/profile-01.jpg" alt="Img" />
                                      </Link>
                                      <div className="patient-name-info">
                                        <h5><Link to="/invoices">Patient Name</Link></h5>
                                        <span>#{transaction._id.slice(-6)}</span>
                                      </div>
                                    </div>
                                  </td>
                                  <td>
                                    <div className="appointment-date-created">
                                      <span className="paid-text">Amount</span>
                                      <h6>{formatCurrency(transaction.amount, transaction.currency)}</h6>
                                    </div>
                                  </td>
                                  <td>
                                    <div className="appointment-date-created">
                                      <span className="paid-text">Paid On</span>
                                      <h6>{formatDate(transaction.createdAt)}</h6>
                                    </div>
                                  </td>
                                  <td>
                                    <div className="apponiment-view d-flex align-items-center">
                                      <Link to={`/invoice-view?id=${transaction._id}`}>
                                        <i className="isax isax-eye4"></i>
                                      </Link>
                                    </div>
                                  </td>
                                </tr>
                              ))
                            )}
                          </tbody>
                        </table>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default DoctorDashboard
