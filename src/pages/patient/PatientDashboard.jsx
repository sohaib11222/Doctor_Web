import { useEffect, useMemo } from 'react'
import { Link } from 'react-router-dom'
import { useQuery } from '@tanstack/react-query'
import { useAuth } from '../../contexts/AuthContext'
import * as patientApi from '../../api/patient'
import * as favoriteApi from '../../api/favorite'
import * as medicalRecordsApi from '../../api/medicalRecords'
import * as paymentApi from '../../api/payment'

const PatientDashboard = () => {
  const { user } = useAuth()

  // Fetch dashboard data
  const { data: dashboardResponse, isLoading: dashboardLoading, refetch: refetchDashboard } = useQuery({
    queryKey: ['patientDashboard'],
    queryFn: () => patientApi.getPatientDashboard(),
    enabled: !!user,
    refetchInterval: 30000 // Refresh every 30 seconds
  })

  // Fetch favorites for favorites section
  const { data: favoritesData } = useQuery({
    queryKey: ['favorites', user?._id, 'dashboard'],
    queryFn: () => favoriteApi.listFavorites(user?._id, { page: 1, limit: 4 }),
    enabled: !!user
  })

  // Fetch medical records for reports section
  const { data: medicalRecordsData } = useQuery({
    queryKey: ['medicalRecords', 'dashboard'],
    queryFn: () => medicalRecordsApi.getMedicalRecords({ page: 1, limit: 5 }),
    enabled: !!user
  })

  // Fetch prescriptions (medical records with type PRESCRIPTION)
  const { data: prescriptionsData } = useQuery({
    queryKey: ['medicalRecords', 'PRESCRIPTION', 'dashboard'],
    queryFn: () => medicalRecordsApi.getMedicalRecords({ recordType: 'PRESCRIPTION', page: 1, limit: 5 }),
    enabled: !!user
  })

  // Fetch payment history for invoices section
  const { data: paymentHistoryData } = useQuery({
    queryKey: ['patientPaymentHistory', 'dashboard'],
    queryFn: () => paymentApi.getPatientPaymentHistory({ page: 1, limit: 5 }),
    enabled: !!user
  })

  // Extract dashboard data
  const dashboard = useMemo(() => {
    if (!dashboardResponse) return null
    const responseData = dashboardResponse.data || dashboardResponse
    return responseData
  }, [dashboardResponse])

  // Extract favorites
  const favorites = useMemo(() => {
    if (!favoritesData) return []
    const responseData = favoritesData.data || favoritesData
    return Array.isArray(responseData) ? responseData : (responseData.favorites || [])
  }, [favoritesData])

  // Extract medical records
  const medicalRecords = useMemo(() => {
    if (!medicalRecordsData) return []
    const responseData = medicalRecordsData.data || medicalRecordsData
    return responseData.records || []
  }, [medicalRecordsData])

  // Extract prescriptions
  const prescriptions = useMemo(() => {
    if (!prescriptionsData) return []
    const responseData = prescriptionsData.data || prescriptionsData
    return responseData.records || []
  }, [prescriptionsData])

  // Extract transactions
  const transactions = useMemo(() => {
    if (!paymentHistoryData) return []
    const responseData = paymentHistoryData.data || paymentHistoryData
    return responseData.transactions || []
  }, [paymentHistoryData])

  // Format date
  const formatDate = (dateString) => {
    if (!dateString) return 'N/A'
    const date = new Date(dateString)
    return date.toLocaleDateString('en-GB', { 
      day: '2-digit', 
      month: 'short', 
      year: 'numeric'
    })
  }

  // Format date and time
  const formatDateTime = (dateString, timeString) => {
    if (!dateString) return 'N/A'
    const date = new Date(dateString)
    const dateStr = date.toLocaleDateString('en-GB', { 
      day: '2-digit', 
      month: 'short', 
      year: 'numeric'
    })
    return timeString ? `${dateStr}, ${timeString}` : dateStr
  }

  // Format currency
  const formatCurrency = (amount, currency = 'USD') => {
    if (!amount) return '$0.00'
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: currency || 'USD'
    }).format(amount)
  }

  // Get status badge
  const getStatusBadge = (status) => {
    const statusUpper = (status || '').toUpperCase()
    if (statusUpper === 'COMPLETED' || statusUpper === 'CONFIRMED') {
      return <span className="badge badge-xs p-2 badge-soft-success inline-flex align-items-center"><i className="fa-solid fa-circle me-1 fs-5"></i>{status}</span>
    }
    if (statusUpper === 'PENDING') {
      return <span className="badge badge-xs p-2 badge-soft-purple inline-flex align-items-center"><i className="fa-solid fa-circle me-1 fs-5"></i>{status}</span>
    }
    if (statusUpper === 'CANCELLED' || statusUpper === 'REJECTED') {
      return <span className="badge badge-xs p-2 badge-soft-danger inline-flex align-items-center"><i className="fa-solid fa-circle me-1 fs-5"></i>{status}</span>
    }
    return <span className="badge badge-xs p-2 badge-soft-secondary inline-flex align-items-center"><i className="fa-solid fa-circle me-1 fs-5"></i>{status || 'N/A'}</span>
  }

  // Get appointment type display
  const getAppointmentType = (bookingType) => {
    if (!bookingType) return 'N/A'
    const type = bookingType.toUpperCase()
    if (type === 'ONLINE') return 'Video call'
    if (type === 'VISIT') return 'Clinic Visit'
    return bookingType
  }

  useEffect(() => {
    // Initialize carousels if needed
    if (typeof window !== 'undefined' && window.$) {
      // Initialize appointment calendar slider
      if ($('.appointment-calender-slider').length) {
        $('.appointment-calender-slider').owlCarousel({
          loop: false,
          margin: 10,
          nav: true,
          dots: false,
          navContainer: '.slide-nav',
          responsive: {
            0: { items: 3 },
            600: { items: 5 },
            1000: { items: 7 }
          }
        })
      }

      // Initialize past appointments slider
      if ($('.past-appointments-slider').length) {
        $('.past-appointments-slider').owlCarousel({
          loop: false,
          margin: 20,
          nav: true,
          dots: false,
          navContainer: '.slide-nav2',
          responsive: {
            0: { items: 1 },
            600: { items: 2 },
            1000: { items: 2 }
          }
        })
      }
    }
  }, [dashboard])

  if (dashboardLoading && !dashboard) {
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
                  <span className="visually-hidden">Loading dashboard...</span>
                </div>
                <p className="text-muted mt-2">Loading dashboard data...</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="content">
      <div className="container">
        <div className="row">
          <div className="col-lg-4 col-xl-3 theiaStickySidebar">
            {/* Sidebar is handled by DashboardLayout */}
          </div>
          <div className="col-lg-12 col-xl-12">
            <div className="dashboard-header">
              <h3>Dashboard</h3>
              {dashboardLoading ? (
                <div className="spinner-border spinner-border-sm" role="status">
                  <span className="visually-hidden">Loading...</span>
                </div>
              ) : dashboard && (
                <ul className="header-list-btns">
                  <li>
                    <div className="dropdown header-dropdown">
                      <a className="dropdown-toggle" data-bs-toggle="dropdown" href="javascript:void(0);">
                        <img 
                          src={dashboard.patient?.profileImage || '/assets/img/doctors-dashboard/profile-06.jpg'} 
                          className="avatar dropdown-avatar" 
                          alt="Patient" 
                          onError={(e) => {
                            e.target.src = '/assets/img/doctors-dashboard/profile-06.jpg'
                          }}
                        />
                        {dashboard.patient?.fullName || 'Patient'}
                      </a>
                    </div>
                  </li>
                </ul>
              )}
            </div>
            <div className="row">
              <div className="col-xl-8 d-flex">
                <div className="dashboard-card w-100">
                  <div className="dashboard-card-head">
                    <div className="header-title">
                      <h5>Health Records</h5>
                    </div>
                  </div>
                  <div className="dashboard-card-body">
                    <div className="row">
                      <div className="col-sm-7">
                        <div className="row">
                          <div className="col-lg-6">
                            <div className="health-records icon-orange">
                              <span><i className="fa-solid fa-heart"></i>Heart Rate</span>
                              <h3>140 Bpm <sup> 2%</sup></h3>
                            </div>
                          </div>
                          <div className="col-lg-6">
                            <div className="health-records icon-amber">
                              <span><i className="fa-solid fa-temperature-high"></i>Body Temprature</span>
                              <h3>37.5 C</h3>
                            </div>
                          </div>
                          <div className="col-lg-6">
                            <div className="health-records icon-dark-blue">
                              <span><i className="fa-solid fa-notes-medical"></i>Glucose Level</span>
                              <h3>70 - 90<sup> 6%</sup></h3>
                            </div>
                          </div>
                          <div className="col-lg-6">
                            <div className="health-records icon-blue">
                              <span><i className="fa-solid fa-highlighter"></i>SPo2</span>
                              <h3>96%</h3>
                            </div>
                          </div>
                          <div className="col-lg-6">
                            <div className="health-records icon-red">
                              <span><i className="fa-solid fa-syringe"></i>Blood Pressure</span>
                              <h3>100 mg/dl<sup> 2%</sup></h3>
                            </div>
                          </div>
                          <div className="col-lg-6">
                            <div className="health-records icon-purple">
                              <span><i className="fa-solid fa-user-pen"></i>BMI </span>
                              <h3>20.1 kg/m2</h3>
                            </div>
                          </div>
                          <div className="col-md-12">
                            <div className="report-gen-date">
                              <p>Report generated on last visit : 25 Mar 2024 <span><i className="fa-solid fa-copy"></i></span></p>
                            </div>
                          </div>
                        </div>
                      </div>
                      <div className="col-sm-5">
                        <div className="chart-over-all-report">
                          <h6>Overall Report</h6>
                          <div className="circle-bar circle-bar3 report-chart">
                            <div className="circle-graph3" data-percent="66">
                              <p>Last visit<br />25 Mar 2024</p>
                            </div>
                          </div>
                          <span className="health-percentage">Your health is 95% Normal</span>
                          <Link to="/medical-details" className="btn btn-dark w-100 rounded-pill">View Details<i className="fa-solid fa-chevron-right ms-2"></i></Link>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              <div className="col-xl-4 d-flex">
                <div className="favourites-dashboard w-100">
                  <div className="book-appointment-head">
                    <h3><span>Book a new</span>Appointment</h3>
                    <span className="add-icon"><Link to="/search"><i className="fa-solid fa-circle-plus"></i></Link></span>
                  </div>
                  <div className="dashboard-card w-100">
                    <div className="dashboard-card-head">
                      <div className="header-title">
                        <h5>Favourites</h5>
                      </div>
                      <div className="card-view-link">
                        <Link to="/favourites">View All</Link>
                      </div>
                    </div>
                    <div className="dashboard-card-body">
                      {favorites.length === 0 ? (
                        <div className="text-center py-3">
                          <p className="text-muted">No favorite doctors yet</p>
                          <Link to="/search" className="btn btn-sm btn-primary mt-2">Find Doctors</Link>
                        </div>
                      ) : (
                        favorites.slice(0, 4).map((favorite) => {
                          const doctor = favorite.doctorId
                          const doctorName = (doctor && typeof doctor === 'object' && doctor !== null) ? doctor.fullName : 'Unknown Doctor'
                          const doctorImage = (doctor && typeof doctor === 'object' && doctor !== null) ? (doctor.profileImage || '/assets/img/doctors-dashboard/doctor-profile-img.jpg') : '/assets/img/doctors-dashboard/doctor-profile-img.jpg'
                          const specialization = (doctor && typeof doctor === 'object' && doctor !== null) && doctor.doctorProfile?.specialization 
                            ? (typeof doctor.doctorProfile.specialization === 'object' 
                                ? doctor.doctorProfile.specialization.name 
                                : 'Specialist')
                            : 'Specialist'
                          const doctorId = (doctor && typeof doctor === 'object' && doctor !== null) ? doctor._id : favorite.doctorId
                          
                          return (
                            <div key={favorite._id} className="doctor-fav-list">
                              <div className="doctor-info-profile">
                                <Link to={`/booking?doctorId=${doctorId}`} className="table-avatar">
                                  <img 
                                    src={doctorImage} 
                                    alt="Doctor" 
                                    onError={(e) => {
                                      e.target.src = '/assets/img/doctors-dashboard/doctor-profile-img.jpg'
                                    }}
                                  />
                                </Link>
                                <div className="doctor-name-info">
                                  <h5><Link to={`/booking?doctorId=${doctorId}`}>Dr. {doctorName}</Link></h5>
                                  <span>{specialization}</span>
                                </div>
                              </div>
                              <Link to={`/booking?doctorId=${doctorId}`} className="cal-plus-icon"><i className="isax isax-calendar5"></i></Link>
                            </div>
                          )
                        })
                      )}
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <div className="row">
              <div className="col-xl-5 d-flex flex-column">
                <div className="dashboard-card flex-fill">
                  <div className="dashboard-card-head">
                    <div className="header-title">
                      <h5>Appointment</h5>
                    </div>
                    <div className="card-view-link">
                      <div className="owl-nav slide-nav text-end nav-control"></div>
                    </div>
                  </div>
                  <div className="dashboard-card-body">
                    <div className="apponiment-dates">
                      <ul className="appointment-calender-slider owl-carousel">
                        <li>
                          <a href="#">
                            <h5>19 <span>Mon</span></h5>
                          </a>
                        </li>
                        <li>
                          <a href="#">
                            <h5>20 <span>Mon</span></h5>
                          </a>
                        </li>
                        <li>
                          <a href="#" className="available-date">
                            <h5>21 <span>Tue</span></h5>
                          </a>
                        </li>
                        <li>
                          <a href="#" className="available-date">
                            <h5>22 <span>Wed</span></h5>
                          </a>
                        </li>
                        <li>
                          <a href="#">
                            <h5>23 <span>Thu</span></h5>
                          </a>
                        </li>
                        <li>
                          <a href="#">
                            <h5>24 <span>Fri</span></h5>
                          </a>
                        </li>
                        <li>
                          <a href="#">
                            <h5>25 <span>Sat</span></h5>
                          </a>
                        </li>
                      </ul>
                      {dashboardLoading ? (
                        <div className="text-center py-3">
                          <div className="spinner-border spinner-border-sm" role="status">
                            <span className="visually-hidden">Loading...</span>
                          </div>
                        </div>
                      ) : dashboard?.upcomingAppointments?.appointments?.length === 0 ? (
                        <div className="text-center py-3">
                          <p className="text-muted">No upcoming appointments</p>
                          <Link to="/search" className="btn btn-sm btn-primary mt-2">Book Appointment</Link>
                        </div>
                      ) : (
                        dashboard?.upcomingAppointments?.appointments?.slice(0, 2).map((appointment) => {
                          const doctor = appointment.doctorId
                          const doctorName = (doctor && typeof doctor === 'object' && doctor !== null) ? doctor.fullName : 'Unknown Doctor'
                          const doctorImage = (doctor && typeof doctor === 'object' && doctor !== null) ? (doctor.profileImage || '/assets/img/doctors-dashboard/doctor-profile-img.jpg') : '/assets/img/doctors-dashboard/doctor-profile-img.jpg'
                          const specialization = (doctor && typeof doctor === 'object' && doctor !== null) && doctor.doctorProfile?.specialization 
                            ? (typeof doctor.doctorProfile.specialization === 'object' 
                                ? doctor.doctorProfile.specialization.name 
                                : 'Specialist')
                            : 'Specialist'
                          const doctorId = (doctor && typeof doctor === 'object' && doctor !== null) ? doctor._id : appointment.doctorId
                          
                          return (
                            <div key={appointment._id} className="appointment-dash-card">
                              <div className="doctor-fav-list">
                                <div className="doctor-info-profile">
                                  <Link to={`/doctor-profile?id=${doctorId}`} className="table-avatar">
                                    <img 
                                      src={doctorImage} 
                                      alt="Doctor" 
                                      onError={(e) => {
                                        e.target.src = '/assets/img/doctors-dashboard/doctor-profile-img.jpg'
                                      }}
                                    />
                                  </Link>
                                  <div className="doctor-name-info">
                                    <h5><Link to={`/doctor-profile?id=${doctorId}`}>Dr. {doctorName}</Link></h5>
                                    <span className="fs-12 fw-medium">{specialization}</span>
                                  </div>
                                </div>
                                <Link to={`/chat?doctorId=${doctorId}&appointmentId=${appointment._id}`} className="cal-plus-icon">
                                  <i className={appointment.bookingType === 'ONLINE' ? 'isax isax-video5' : 'isax isax-hospital5'}></i>
                                </Link>
                              </div>
                              <div className="date-time">
                                <p><i className="isax isax-clock5"></i>{formatDateTime(appointment.appointmentDate, appointment.appointmentTime)}</p>
                              </div>
                              <div className="card-btns gap-3">
                                <Link 
                                  to={`/chat?doctorId=${doctorId}&appointmentId=${appointment._id}`} 
                                  className="btn btn-md btn-light rounded-pill"
                                >
                                  <i className="isax isax-messages-25"></i>Chat Now
                                </Link>
                                <Link 
                                  to={`/patient-appointment-details?id=${appointment._id}`} 
                                  className="btn btn-md btn-primary-gradient rounded-pill"
                                >
                                  <i className="isax isax-calendar-tick5"></i>View Details
                                </Link>
                              </div>
                            </div>
                          )
                        })
                      )}
                    </div>
                  </div>
                </div>
                <div className="dashboard-card flex-fill">
                  <div className="dashboard-card-head">
                    <div className="header-title">
                      <h5>Notifications</h5>
                    </div>
                    <div className="card-view-link">
                      <a href="#">View All</a>
                    </div>
                  </div>
                  <div className="dashboard-card-body">
                    <div className="table-responsive">
                      <table className="table dashboard-table">
                        <tbody>
                          <tr>
                            <td>
                              <div className="table-noti-info">
                                <div className="table-noti-icon color-violet">
                                  <i className="fa-solid fa-bell"></i>
                                </div>
                                <div className="table-noti-message">
                                  <h6><a href="#">Booking Confirmed on <span> 21 Mar 2024 </span> 10:30 AM</a></h6>
                                  <span className="message-time">Just Now</span>
                                </div>
                              </div>
                            </td>
                          </tr>
                          <tr>
                            <td>
                              <div className="table-noti-info">
                                <div className="table-noti-icon color-blue">
                                  <i className="fa-solid fa-star"></i>
                                </div>
                                <div className="table-noti-message">
                                  <h6><a href="#">You have a  <span> New </span> Review for your Appointment </a></h6>
                                  <span className="message-time">5 Days ago</span>
                                </div>
                              </div>
                            </td>
                          </tr>
                          <tr>
                            <td>
                              <div className="table-noti-info">
                                <div className="table-noti-icon color-red">
                                  <i className="isax isax-calendar-tick5"></i>
                                </div>
                                <div className="table-noti-message">
                                  <h6><a href="#">You have Appointment with <span> Ahmed </span> by 01:20 PM </a></h6>
                                  <span className="message-time">12:55 PM</span>
                                </div>
                              </div>
                            </td>
                          </tr>
                          <tr>
                            <td>
                              <div className="table-noti-info">
                                <div className="table-noti-icon color-yellow">
                                  <i className="fa-solid fa-money-bill-1-wave"></i>
                                </div>
                                <div className="table-noti-message">
                                  <h6><a href="#">Sent an amount of <span> $200 </span> for an Appointment  by 01:20 PM </a></h6>
                                  <span className="message-time">2 Days ago</span>
                                </div>
                              </div>
                            </td>
                          </tr>
                          <tr>
                            <td>
                              <div className="table-noti-info">
                                <div className="table-noti-icon color-blue">
                                  <i className="fa-solid fa-star"></i>
                                </div>
                                <div className="table-noti-message">
                                  <h6><a href="#">You have a  <span> New </span> Review for your Appointment </a></h6>
                                  <span className="message-time">5 Days ago</span>
                                </div>
                              </div>
                            </td>
                          </tr>
                        </tbody>
                      </table>
                    </div>
                  </div>
                </div>
              </div>
              <div className="col-xl-7 d-flex flex-column">
                <div className="dashboard-card flex-fill">
                  <div className="dashboard-card-head">
                    <div className="header-title">
                      <h5>Analytics</h5>
                    </div>
                    <div className="dropdown-links d-flex align-items-center flex-wrap">
                      <div className="dropdown header-dropdown header-dropdown-two">
                        <a className="dropdown-toggle" data-bs-toggle="dropdown" href="javascript:void(0);">
                          Mar 14 - Mar 21
                        </a>
                        <div className="dropdown-menu dropdown-menu-end">
                          <a href="javascript:void(0);" className="dropdown-item">This Week</a>
                          <a href="javascript:void(0);" className="dropdown-item">This Month</a>
                          <a href="javascript:void(0);" className="dropdown-item">This Year</a>
                        </div>
                      </div>
                    </div>
                  </div>
                  <div className="dashboard-card-body pb-1">
                    <div className="chart-tabs">
                      <ul className="nav" role="tablist">
                        <li className="nav-item" role="presentation">
                          <a className="nav-link active" href="#" data-bs-toggle="tab" data-bs-target="#heart-rate" aria-selected="false" role="tab" tabIndex="-1">Heart Rate</a>
                        </li>
                        <li className="nav-item" role="presentation">
                          <a className="nav-link " href="#" data-bs-toggle="tab" data-bs-target="#blood-pressure" aria-selected="true" role="tab">Blood Pressure</a>
                        </li>
                      </ul>
                    </div>
                    <div className="tab-content pt-0">
                      <div className="tab-pane fade active show" id="heart-rate" role="tabpanel">
                        <div id="heart-rate-chart"></div>
                      </div>
                      <div className="tab-pane fade" id="blood-pressure" role="tabpanel">
                        <div id="blood-pressure-chart"></div>
                      </div>
                    </div>
                  </div>
                </div>
                <div className="dashboard-card flex-fill">
                  <div className="dashboard-card-head">
                    <div className="header-title">
                      <h5>Past Appointments</h5>
                    </div>
                    <div className="card-view-link">
                      <div className="owl-nav slide-nav2 text-end nav-control"></div>
                    </div>
                  </div>
                  <div className="dashboard-card-body">
                    <div className="past-appointments-slider owl-carousel">
                      {dashboardLoading ? (
                        <div className="text-center py-3">
                          <div className="spinner-border spinner-border-sm" role="status">
                            <span className="visually-hidden">Loading...</span>
                          </div>
                        </div>
                      ) : dashboard?.completedAppointments?.appointments?.length === 0 ? (
                        <div className="text-center py-3">
                          <p className="text-muted">No past appointments</p>
                        </div>
                      ) : (
                        dashboard?.completedAppointments?.appointments?.slice(0, 2).map((appointment) => {
                          const doctor = appointment.doctorId
                          const doctorName = (doctor && typeof doctor === 'object' && doctor !== null) ? doctor.fullName : 'Unknown Doctor'
                          const doctorImage = (doctor && typeof doctor === 'object' && doctor !== null) ? (doctor.profileImage || '/assets/img/doctors-dashboard/doctor-profile-img.jpg') : '/assets/img/doctors-dashboard/doctor-profile-img.jpg'
                          const specialization = (doctor && typeof doctor === 'object' && doctor !== null) && doctor.doctorProfile?.specialization 
                            ? (typeof doctor.doctorProfile.specialization === 'object' 
                                ? doctor.doctorProfile.specialization.name 
                                : 'Specialist')
                            : 'Specialist'
                          const doctorId = (doctor && typeof doctor === 'object' && doctor !== null) ? doctor._id : appointment.doctorId
                          const appointmentDate = new Date(appointment.appointmentDate)
                          const dayName = appointmentDate.toLocaleDateString('en-GB', { weekday: 'long' })
                          const dateStr = appointmentDate.toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' })
                          
                          return (
                            <div key={appointment._id} className="appointment-dash-card past-appointment mt-0">
                              <div className="doctor-fav-list">
                                <div className="doctor-info-profile">
                                  <Link to={`/doctor-profile?id=${doctorId}`} className="table-avatar">
                                    <img 
                                      src={doctorImage} 
                                      alt="Doctor" 
                                      onError={(e) => {
                                        e.target.src = '/assets/img/doctors-dashboard/doctor-profile-img.jpg'
                                      }}
                                    />
                                  </Link>
                                  <div className="doctor-name-info">
                                    <h5><Link to={`/doctor-profile?id=${doctorId}`}>Dr. {doctorName}</Link></h5>
                                    <span>{specialization}</span>
                                  </div>
                                </div>
                                <span className="bg-orange badge">
                                  <i className={appointment.bookingType === 'ONLINE' ? 'isax isax-video5' : 'isax isax-hospital5'} me-1></i>
                                  {appointment.appointmentTime || 'N/A'}
                                </span>
                              </div>
                              <div className="appointment-date-info">
                                <h6>{dayName}, {dateStr}</h6>
                                <ul>
                                  <li>
                                    <span><i className="isax isax-clock5"></i></span>
                                    Time : {appointment.appointmentTime || 'N/A'}
                                  </li>
                                  {appointment.clinicName && (
                                    <li>
                                      <span><i className="isax isax-location5"></i></span>
                                      {appointment.clinicName}
                                    </li>
                                  )}
                                </ul>
                              </div>
                              <div className="card-btns">
                                <Link 
                                  to={`/patient-appointment-details?id=${appointment._id}`} 
                                  className="btn btn-md btn-primary-gradient rounded-pill"
                                >
                                  View Details
                                </Link>
                              </div>
                            </div>
                          )
                        })
                      )}
                    </div>
                  </div>
                </div>
                <div className="dashboard-card flex-fill">
                  <div className="dashboard-card-head">
                    <div className="header-title">
                      <h5>Dependant</h5>
                    </div>
                    <div className="card-view-link">
                      <a href="#" className="add-new" data-bs-toggle="modal" data-bs-target="#add_dependent"><i className="fa-solid fa-circle-plus me-1"></i>Add New</a>
                      <Link to="/dependent">View All</Link>
                    </div>
                  </div>
                  <div className="dashboard-card-body">
                    <div className="doctor-fav-list">
                      <div className="doctor-info-profile">
                        <a href="#" className="table-avatar">
                          <img src="/assets/img/patients/patient-20.jpg" alt="Img" />
                        </a>
                        <div className="doctor-name-info">
                          <h5><a href="#">Laura</a></h5>
                          <span>Mother - 58 years 20 days</span>
                        </div>
                      </div>
                      <div className="d-flex align-items-center">
                        <a href="#" className="cal-plus-icon me-2"><i className="isax isax-calendar5"></i></a>
                        <Link to="/dependent" className="cal-plus-icon"><i className="isax isax-eye4"></i></Link>
                      </div>
                    </div>
                    <div className="doctor-fav-list">
                      <div className="doctor-info-profile">
                        <a href="#" className="table-avatar">
                          <img src="/assets/img/patients/patient-21.jpg" alt="Img" />
                        </a>
                        <div className="doctor-name-info">
                          <h5><a href="#">Mathew</a></h5>
                          <span>Father - 59 years 15 days</span>
                        </div>
                      </div>
                      <div className="d-flex align-items-center">
                        <a href="#" className="cal-plus-icon me-2"><i className="isax isax-calendar5"></i></a>
                        <Link to="/dependent" className="cal-plus-icon"><i className="isax isax-eye4"></i></Link>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <div className="row">
              <div className="col-xl-12 d-flex">
                <div className="dashboard-card w-100">
                  <div className="dashboard-card-head">
                    <div className="header-title">
                      <h5>Reports</h5>
                    </div>
                  </div>
                  <div className="dashboard-card-body">
                    <div className="account-detail-table">
                      <nav className="patient-dash-tab border-0 pb-0">
                        <ul className="nav nav-tabs-bottom">
                          <li className="nav-item">
                            <a className="nav-link active" href="#appoint-tab" data-bs-toggle="tab">Appointments</a>
                          </li>
                          <li className="nav-item">
                            <a className="nav-link" href="#medical-tab" data-bs-toggle="tab">Medical Records</a>
                          </li>
                          <li className="nav-item">
                            <a className="nav-link" href="#prsc-tab" data-bs-toggle="tab">Prescriptions</a>
                          </li>
                          <li className="nav-item">
                            <a className="nav-link" href="#invoice-tab" data-bs-toggle="tab">Invoices</a>
                          </li>
                        </ul>
                      </nav>
                      <div className="tab-content pt-0">
                        <div id="appoint-tab" className="tab-pane fade show active">
                          <div className="custom-new-table">
                            <div className="table-responsive">
                              <table className="table table-hover table-center mb-0">
                                <thead>
                                  <tr>
                                    <th>ID</th>
                                    <th>Doctor</th>
                                    <th>Date</th>
                                    <th>Type</th>
                                    <th>Status</th>
                                  </tr>
                                </thead>
                                <tbody>
                                  {dashboardLoading ? (
                                    <tr>
                                      <td colSpan="5" className="text-center py-3">
                                        <div className="spinner-border spinner-border-sm" role="status">
                                          <span className="visually-hidden">Loading...</span>
                                        </div>
                                      </td>
                                    </tr>
                                  ) : !dashboard?.upcomingAppointments?.appointments?.length && 
                                      !dashboard?.completedAppointments?.appointments?.length && 
                                      !dashboard?.cancelledAppointments?.appointments?.length ? (
                                    <tr>
                                      <td colSpan="5" className="text-center py-3">
                                        <p className="text-muted">No appointments found</p>
                                        <Link to="/search" className="btn btn-sm btn-primary mt-2">Book Appointment</Link>
                                      </td>
                                    </tr>
                                  ) : (
                                    [
                                      ...(dashboard?.upcomingAppointments?.appointments || []).slice(0, 2),
                                      ...(dashboard?.completedAppointments?.appointments || []).slice(0, 2),
                                      ...(dashboard?.cancelledAppointments?.appointments || []).slice(0, 1)
                                    ].slice(0, 5).map((appointment) => {
                                      const doctor = appointment.doctorId
                                      const doctorName = (doctor && typeof doctor === 'object' && doctor !== null) ? doctor.fullName : 'Unknown Doctor'
                                      const doctorImage = (doctor && typeof doctor === 'object' && doctor !== null) ? (doctor.profileImage || '/assets/img/doctors-dashboard/doctor-profile-img.jpg') : '/assets/img/doctors-dashboard/doctor-profile-img.jpg'
                                      const doctorId = (doctor && typeof doctor === 'object' && doctor !== null) ? doctor._id : appointment.doctorId
                                      
                                      return (
                                        <tr key={appointment._id}>
                                          <td>
                                            <Link to={`/patient-appointment-details?id=${appointment._id}`}>
                                              <span className="link-primary">#{appointment.appointmentNumber || appointment._id.slice(-6).toUpperCase()}</span>
                                            </Link>
                                          </td>
                                          <td>
                                            <h2 className="table-avatar">
                                              <Link to={`/doctor-profile?id=${doctorId}`} className="avatar avatar-sm me-2">
                                                <img 
                                                  className="avatar-img rounded-3" 
                                                  src={doctorImage} 
                                                  alt="Doctor" 
                                                  onError={(e) => {
                                                    e.target.src = '/assets/img/doctors-dashboard/doctor-profile-img.jpg'
                                                  }}
                                                />
                                              </Link>
                                              <Link to={`/doctor-profile?id=${doctorId}`}>Dr. {doctorName}</Link>
                                            </h2>
                                          </td>
                                          <td>{formatDateTime(appointment.appointmentDate, appointment.appointmentTime)}</td>
                                          <td>{getAppointmentType(appointment.bookingType)}</td>
                                          <td>
                                            {getStatusBadge(appointment.status)}
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
                        <div className="tab-pane fade" id="medical-tab">
                          <div className="custom-table">
                            <div className="table-responsive">
                              <table className="table table-center mb-0">
                                <thead>
                                  <tr>
                                    <th>ID</th>
                                    <th>Name</th>
                                    <th>Date</th>
                                    <th>Record For</th>
                                    <th>Comments</th>
                                    <th>Action</th>
                                  </tr>
                                </thead>
                                <tbody>
                                  {medicalRecords.length === 0 ? (
                                    <tr>
                                      <td colSpan="6" className="text-center py-3">
                                        <p className="text-muted">No medical records found</p>
                                        <Link to="/medical-records" className="btn btn-sm btn-primary mt-2">Add Medical Record</Link>
                                      </td>
                                    </tr>
                                  ) : (
                                    medicalRecords.slice(0, 5).map((record) => {
                                      const doctor = record.relatedDoctorId
                                      const doctorName = (doctor && typeof doctor === 'object' && doctor !== null) ? doctor.fullName : 'Self'
                                      
                                      return (
                                        <tr key={record._id}>
                                          <td>
                                            <Link to="/medical-records">
                                              <span className="link-primary">#{record._id.slice(-6).toUpperCase()}</span>
                                            </Link>
                                          </td>
                                          <td>
                                            <a href="javascript:void(0);" className="lab-icon">{record.title}</a>
                                          </td>
                                          <td>{formatDate(record.uploadedDate || record.createdAt)}</td>
                                          <td>
                                            <h2 className="table-avatar">
                                              <span className="avatar avatar-sm me-2">
                                                {(doctor && typeof doctor === 'object' && doctor !== null) && doctor.profileImage ? (
                                                  <img className="avatar-img rounded-3" src={doctor.profileImage} alt="Doctor" />
                                                ) : (
                                                  <span className="avatar-title rounded-3 bg-primary text-white">
                                                    {doctorName.charAt(0).toUpperCase()}
                                                  </span>
                                                )}
                                              </span>
                                              <span>{doctorName}</span>
                                            </h2>
                                          </td>
                                          <td>{record.description || 'N/A'}</td>
                                          <td>
                                            <div className="action-item">
                                              <a href={record.fileUrl} target="_blank" rel="noopener noreferrer" title="View">
                                                <i className="isax isax-link-2"></i>
                                              </a>
                                              <a href={record.fileUrl} target="_blank" rel="noopener noreferrer" title="Download">
                                                <i className="isax isax-import"></i>
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
                        </div>
                        <div className="tab-pane fade" id="prsc-tab">
                          <div className="custom-table">
                            <div className="table-responsive">
                              <table className="table table-center mb-0">
                                <thead>
                                  <tr>
                                    <th>ID</th>
                                    <th>Name</th>
                                    <th>Date</th>
                                    <th>Prescriped By</th>
                                    <th>Action</th>
                                  </tr>
                                </thead>
                                <tbody>
                                  {prescriptions.length === 0 ? (
                                    <tr>
                                      <td colSpan="5" className="text-center py-3">
                                        <p className="text-muted">No prescriptions found</p>
                                      </td>
                                    </tr>
                                  ) : (
                                    prescriptions.slice(0, 5).map((prescription) => {
                                      const doctor = prescription.relatedDoctorId
                                      const doctorName = (doctor && typeof doctor === 'object' && doctor !== null) ? doctor.fullName : 'Unknown Doctor'
                                      const doctorImage = (doctor && typeof doctor === 'object' && doctor !== null) ? (doctor.profileImage || '/assets/img/doctors-dashboard/doctor-profile-img.jpg') : '/assets/img/doctors-dashboard/doctor-profile-img.jpg'
                                      const doctorId = (doctor && typeof doctor === 'object' && doctor !== null) ? doctor._id : prescription.relatedDoctorId
                                      
                                      return (
                                        <tr key={prescription._id}>
                                          <td>
                                            <Link to="/medical-records">
                                              <span className="link-primary">#{prescription._id.slice(-6).toUpperCase()}</span>
                                            </Link>
                                          </td>
                                          <td>
                                            <a href="javascript:void(0);" className="lab-icon prescription">Prescription</a>
                                          </td>
                                          <td>{formatDateTime(prescription.uploadedDate || prescription.createdAt, null)}</td>
                                          <td>
                                            <h2 className="table-avatar">
                                              <Link to={`/doctor-profile?id=${doctorId}`} className="avatar avatar-sm me-2">
                                                <img 
                                                  className="avatar-img rounded-3" 
                                                  src={doctorImage} 
                                                  alt="Doctor" 
                                                  onError={(e) => {
                                                    e.target.src = '/assets/img/doctors-dashboard/doctor-profile-img.jpg'
                                                  }}
                                                />
                                              </Link>
                                              <Link to={`/doctor-profile?id=${doctorId}`}>{doctorName}</Link>
                                            </h2>
                                          </td>
                                          <td>
                                            <div className="action-item">
                                              <a href={prescription.fileUrl} target="_blank" rel="noopener noreferrer" title="View">
                                                <i className="isax isax-link-2"></i>
                                              </a>
                                              <a href={prescription.fileUrl} target="_blank" rel="noopener noreferrer" title="Download">
                                                <i className="isax isax-import"></i>
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
                        </div>
                        <div className="tab-pane fade" id="invoice-tab">
                          <div className="custom-table">
                            <div className="table-responsive">
                              <table className="table table-center mb-0">
                                <thead>
                                  <tr>
                                    <th>ID</th>
                                    <th>Doctor</th>
                                    <th>Appointment Date</th>
                                    <th>Booked on</th>
                                    <th>Amount</th>
                                    <th>Action</th>
                                  </tr>
                                </thead>
                                <tbody>
                                  {transactions.length === 0 ? (
                                    <tr>
                                      <td colSpan="6" className="text-center py-3">
                                        <p className="text-muted">No invoices found</p>
                                      </td>
                                    </tr>
                                  ) : (
                                    transactions.slice(0, 5).map((transaction) => {
                                      const doctor = transaction.relatedAppointmentId?.doctorId
                                      const doctorName = (doctor && typeof doctor === 'object' && doctor !== null) ? doctor.fullName : 
                                                       transaction.doctorName || 'N/A'
                                      const doctorImage = (doctor && typeof doctor === 'object' && doctor !== null) ? (doctor.profileImage || '/assets/img/doctors-dashboard/doctor-profile-img.jpg') : '/assets/img/doctors-dashboard/doctor-profile-img.jpg'
                                      const doctorId = (doctor && typeof doctor === 'object' && doctor !== null) ? doctor._id : transaction.relatedAppointmentId?.doctorId
                                      const appointmentDate = transaction.relatedAppointmentId?.appointmentDate
                                      
                                      return (
                                        <tr key={transaction._id}>
                                          <td>
                                            <Link to="/patient-invoices">
                                              <span className="link-primary">#{transaction._id.slice(-8).toUpperCase()}</span>
                                            </Link>
                                          </td>
                                          <td>
                                            {doctor ? (
                                              <h2 className="table-avatar">
                                                <Link to={`/doctor-profile?id=${doctorId}`} className="avatar avatar-sm me-2">
                                                  <img 
                                                    className="avatar-img rounded-3" 
                                                    src={doctorImage} 
                                                    alt="Doctor" 
                                                    onError={(e) => {
                                                      e.target.src = '/assets/img/doctors-dashboard/doctor-profile-img.jpg'
                                                    }}
                                                  />
                                                </Link>
                                                <Link to={`/doctor-profile?id=${doctorId}`}>{doctorName}</Link>
                                              </h2>
                                            ) : (
                                              <span className="text-muted">N/A</span>
                                            )}
                                          </td>
                                          <td>{appointmentDate ? formatDate(appointmentDate) : 'N/A'}</td>
                                          <td>{formatDate(transaction.createdAt)}</td>
                                          <td>{formatCurrency(transaction.amount, transaction.currency)}</td>
                                          <td>
                                            <div className="action-item">
                                              <Link to="/patient-invoices" title="View">
                                                <i className="isax isax-link-2"></i>
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

export default PatientDashboard
