import { useState, useEffect, useMemo } from 'react'
import { Link } from 'react-router-dom'
import { useQuery } from '@tanstack/react-query'
import { useAuth } from '../../contexts/AuthContext'
import * as appointmentApi from '../../api/appointments'

const MyPatients = () => {
  const { user } = useAuth()
  const [searchQuery, setSearchQuery] = useState('')
  const [activeTab, setActiveTab] = useState('active') // 'active' or 'inactive'
  const [dateRange, setDateRange] = useState({ fromDate: '', toDate: '' })
  const [appointmentTypeFilter, setAppointmentTypeFilter] = useState([])
  const [visitTypeFilter, setVisitTypeFilter] = useState([])
  const [page, setPage] = useState(1)
  const limit = 20

  // Fetch all appointments for the doctor
  const { data: appointmentsData, isLoading: appointmentsLoading, error: appointmentsError } = useQuery({
    queryKey: ['doctorAppointments', dateRange.fromDate, dateRange.toDate, page],
    queryFn: () => {
      const params = {
        page: 1, // Get all appointments to group by patient
        limit: 1000, // Large limit to get all patients
        ...(dateRange.fromDate ? { fromDate: dateRange.fromDate } : {}),
        ...(dateRange.toDate ? { toDate: dateRange.toDate } : {})
      }
      return appointmentApi.listAppointments(params)
    },
    enabled: !!user,
    refetchInterval: 30000 // Refetch every 30 seconds
  })

  // Extract appointments from response
  const appointments = useMemo(() => {
    if (!appointmentsData) return []
    // Axios interceptor returns response.data = { success, message, data: {...} }
    const responseData = appointmentsData.data || appointmentsData
    return responseData.appointments || []
  }, [appointmentsData])

  // Group appointments by patient and create patient list
  const patients = useMemo(() => {
    if (!appointments || appointments.length === 0) return []

    // Group by patientId
    const patientMap = new Map()

    appointments.forEach(appointment => {
      if (!appointment.patientId) return

      const patientId = appointment.patientId._id || appointment.patientId
      const patient = appointment.patientId

      if (!patientMap.has(patientId)) {
        // Initialize patient data
        patientMap.set(patientId, {
          _id: patientId,
          fullName: patient.fullName || 'Unknown',
          email: patient.email || '',
          phone: patient.phone || '',
          profileImage: patient.profileImage || '',
          gender: patient.gender || '',
          bloodGroup: patient.bloodGroup || '',
          dob: patient.dob || null,
          address: patient.address || {},
          appointments: [],
          lastBookingDate: null,
          lastAppointment: null,
          hasActiveAppointment: false
        })
      }

      const patientData = patientMap.get(patientId)
      patientData.appointments.push(appointment)

      // Update last booking date
      const appointmentDate = new Date(appointment.appointmentDate)
      if (!patientData.lastBookingDate || appointmentDate > patientData.lastBookingDate) {
        patientData.lastBookingDate = appointmentDate
        patientData.lastAppointment = appointment
      }

      // Check if has active appointment (CONFIRMED or PENDING)
      if (appointment.status === 'CONFIRMED' || appointment.status === 'PENDING') {
        patientData.hasActiveAppointment = true
      }
    })

    return Array.from(patientMap.values())
  }, [appointments])

  // Calculate age from date of birth
  const calculateAge = (dob) => {
    if (!dob) return null
    const birthDate = new Date(dob)
    const today = new Date()
    let age = today.getFullYear() - birthDate.getFullYear()
    const monthDiff = today.getMonth() - birthDate.getMonth()
    if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birthDate.getDate())) {
      age--
    }
    return age
  }

  // Format date
  const formatDate = (date) => {
    if (!date) return ''
    const d = new Date(date)
    return d.toLocaleDateString('en-US', { day: 'numeric', month: 'short', year: 'numeric' })
  }

  // Format date and time
  const formatDateTime = (date, time) => {
    if (!date) return ''
    const d = new Date(date)
    const dateStr = d.toLocaleDateString('en-US', { day: 'numeric', month: 'short', year: 'numeric' })
    return time ? `${dateStr} ${time}` : dateStr
  }

  // Get location string
  const getLocation = (address) => {
    if (!address) return 'N/A'
    const parts = []
    if (address.city) parts.push(address.city)
    if (address.state) parts.push(address.state)
    if (address.country) parts.push(address.country)
    return parts.length > 0 ? parts.join(', ') : 'N/A'
  }

  // Filter patients based on active/inactive tab
  const filteredPatientsByStatus = useMemo(() => {
    if (activeTab === 'active') {
      return patients.filter(p => p.hasActiveAppointment)
    } else {
      return patients.filter(p => !p.hasActiveAppointment)
    }
  }, [patients, activeTab])

  // Apply search and other filters
  const filteredPatients = useMemo(() => {
    let filtered = [...filteredPatientsByStatus]

    // Search filter
    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase()
      filtered = filtered.filter(patient => {
        const name = (patient.fullName || '').toLowerCase()
        const email = (patient.email || '').toLowerCase()
        const phone = (patient.phone || '').toLowerCase()
        return name.includes(query) || email.includes(query) || phone.includes(query)
      })
    }

    // Appointment type filter
    if (appointmentTypeFilter.length > 0 && !appointmentTypeFilter.includes('all')) {
      filtered = filtered.filter(patient => {
        return patient.appointments.some(apt => {
          if (appointmentTypeFilter.includes('video') && apt.bookingType === 'ONLINE') return true
          if (appointmentTypeFilter.includes('audio') && apt.bookingType === 'ONLINE') return true // Treating as same for now
          if (appointmentTypeFilter.includes('chat') && apt.bookingType === 'ONLINE') return true // Treating as same for now
          if (appointmentTypeFilter.includes('direct') && apt.bookingType === 'VISIT') return true
          return false
        })
      })
    }

    // Visit type filter (this would need to be added to appointment model, for now we'll skip it)

    return filtered
  }, [filteredPatientsByStatus, searchQuery, appointmentTypeFilter, visitTypeFilter])

  // Get counts
  const activeCount = useMemo(() => {
    return patients.filter(p => p.hasActiveAppointment).length
  }, [patients])

  const inactiveCount = useMemo(() => {
    return patients.filter(p => !p.hasActiveAppointment).length
  }, [patients])

  // Handle filter changes
  const handleAppointmentTypeChange = (type) => {
    if (type === 'all') {
      setAppointmentTypeFilter(['all'])
    } else {
      setAppointmentTypeFilter(prev => {
        const newFilter = prev.filter(t => t !== 'all')
        if (newFilter.includes(type)) {
          return newFilter.filter(t => t !== type)
        } else {
          return [...newFilter, type]
        }
      })
    }
  }

  const handleResetFilters = () => {
    setSearchQuery('')
    setDateRange({ fromDate: '', toDate: '' })
    setAppointmentTypeFilter(['all'])
    setVisitTypeFilter([])
  }

  // Pagination
  const paginatedPatients = useMemo(() => {
    const start = (page - 1) * limit
    return filteredPatients.slice(start, start + limit)
  }, [filteredPatients, page, limit])

  const totalPages = Math.ceil(filteredPatients.length / limit)

  if (appointmentsLoading) {
    return (
      <>
        <div className="dashboard-header">
          <h3>My Patients</h3>
        </div>
        <div className="text-center py-5">
          <div className="spinner-border" role="status">
            <span className="visually-hidden">Loading...</span>
          </div>
        </div>
      </>
    )
  }

  if (appointmentsError) {
    console.error('Error loading appointments:', appointmentsError)
  }

  return (
    <>
      <div className="dashboard-header">
        <h3>My Patients</h3>
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
              <span className="search-icon"><i className="isax isax-search-normal"></i></span>
            </div>
          </li>
        </ul>
      </div>
      <div className="appointment-tab-head">
        <div className="appointment-tabs">
          <ul className="nav nav-pills inner-tab" id="pills-tab" role="tablist">
            <li className="nav-item" role="presentation">
              <button
                className={`nav-link ${activeTab === 'active' ? 'active' : ''}`}
                onClick={() => {
                  setActiveTab('active')
                  setPage(1)
                }}
                type="button"
              >
                Active<span>{activeCount}</span>
              </button>
            </li>
            <li className="nav-item" role="presentation">
              <button
                className={`nav-link ${activeTab === 'inactive' ? 'active' : ''}`}
                onClick={() => {
                  setActiveTab('inactive')
                  setPage(1)
                }}
                type="button"
              >
                InActive<span>{inactiveCount}</span>
              </button>
            </li>
          </ul>
        </div>
        <div className="filter-head">
          <div className="position-relative daterange-wraper me-2">
            <div className="input-groupicon calender-input">
              <input
                type="date"
                className="form-control date-range"
                placeholder="From Date"
                value={dateRange.fromDate}
                onChange={(e) => setDateRange(prev => ({ ...prev, fromDate: e.target.value }))}
              />
            </div>
            <i className="isax isax-calendar-1"></i>
          </div>
          <div className="position-relative daterange-wraper me-2">
            <div className="input-groupicon calender-input">
              <input
                type="date"
                className="form-control date-range"
                placeholder="To Date"
                value={dateRange.toDate}
                onChange={(e) => setDateRange(prev => ({ ...prev, toDate: e.target.value }))}
              />
            </div>
            <i className="isax isax-calendar-1"></i>
          </div>
          <div className="form-sorts dropdown">
            <a href="javascript:void(0);" className="dropdown-toggle" id="table-filter">
              <i className="isax isax-filter me-2"></i>Filter By
            </a>
            <div className="filter-dropdown-menu">
              <div className="filter-set-view">
                <div className="accordion" id="accordionExample">
                  <div className="filter-set-content">
                    <div className="filter-set-content-head">
                      <a href="#" data-bs-toggle="collapse" data-bs-target="#collapseTwo" aria-expanded="false" aria-controls="collapseTwo">
                        Name<i className="fa-solid fa-chevron-right"></i>
                      </a>
                    </div>
                    <div className="filter-set-contents accordion-collapse collapse show" id="collapseTwo" data-bs-parent="#accordionExample">
                      <ul>
                        <li>
                          <div className="input-block dash-search-input w-100">
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
                      </ul>
                    </div>
                  </div>
                  <div className="filter-set-content">
                    <div className="filter-set-content-head">
                      <a href="#" data-bs-toggle="collapse" data-bs-target="#collapseOne" aria-expanded="true" aria-controls="collapseOne">
                        Appointment Type<i className="fa-solid fa-chevron-right"></i>
                      </a>
                    </div>
                    <div className="filter-set-contents accordion-collapse collapse show" id="collapseOne" data-bs-parent="#accordionExample">
                      <ul>
                        <li>
                          <div className="filter-checks">
                            <label className="checkboxs">
                              <input
                                type="checkbox"
                                checked={appointmentTypeFilter.includes('all') || appointmentTypeFilter.length === 0}
                                onChange={() => handleAppointmentTypeChange('all')}
                              />
                              <span className="checkmarks"></span>
                              <span className="check-title">All Type</span>
                            </label>
                          </div>
                        </li>
                        <li>
                          <div className="filter-checks">
                            <label className="checkboxs">
                              <input
                                type="checkbox"
                                checked={appointmentTypeFilter.includes('video')}
                                onChange={() => handleAppointmentTypeChange('video')}
                              />
                              <span className="checkmarks"></span>
                              <span className="check-title">Video Call</span>
                            </label>
                          </div>
                        </li>
                        <li>
                          <div className="filter-checks">
                            <label className="checkboxs">
                              <input
                                type="checkbox"
                                checked={appointmentTypeFilter.includes('audio')}
                                onChange={() => handleAppointmentTypeChange('audio')}
                              />
                              <span className="checkmarks"></span>
                              <span className="check-title">Audio Call</span>
                            </label>
                          </div>
                        </li>
                        <li>
                          <div className="filter-checks">
                            <label className="checkboxs">
                              <input
                                type="checkbox"
                                checked={appointmentTypeFilter.includes('chat')}
                                onChange={() => handleAppointmentTypeChange('chat')}
                              />
                              <span className="checkmarks"></span>
                              <span className="check-title">Chat</span>
                            </label>
                          </div>
                        </li>
                        <li>
                          <div className="filter-checks">
                            <label className="checkboxs">
                              <input
                                type="checkbox"
                                checked={appointmentTypeFilter.includes('direct')}
                                onChange={() => handleAppointmentTypeChange('direct')}
                              />
                              <span className="checkmarks"></span>
                              <span className="check-title">Direct Visit</span>
                            </label>
                          </div>
                        </li>
                      </ul>
                    </div>
                  </div>
                </div>
                <div className="filter-reset-btns">
                  <a href="javascript:void(0);" className="btn btn-light" onClick={handleResetFilters}>Reset</a>
                  <a href="javascript:void(0);" className="btn btn-primary" onClick={() => setPage(1)}>Filter Now</a>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="tab-content appointment-tab-content grid-patient">
        <div className={`tab-pane fade ${activeTab === 'active' ? 'show active' : ''}`} id="pills-upcoming" role="tabpanel" aria-labelledby="pills-upcoming-tab">
          <div className="row">
            {paginatedPatients.length === 0 ? (
              <div className="col-12">
                <div className="card">
                  <div className="card-body text-center py-5">
                    <i className="fe fe-users" style={{ fontSize: '64px', color: '#dee2e6' }}></i>
                    <h5 className="mt-3">No patients found</h5>
                    <p className="text-muted">
                      {activeTab === 'active' 
                        ? 'You don\'t have any active patients yet.' 
                        : 'You don\'t have any inactive patients.'}
                    </p>
                  </div>
                </div>
              </div>
            ) : (
              <>
                {paginatedPatients.map((patient) => {
                  const age = calculateAge(patient.dob)
                  const lastAppointment = patient.lastAppointment
                  
                  return (
                    <div key={patient._id} className="col-xl-4 col-lg-6 col-md-6 d-flex">
                      <div className="appointment-wrap appointment-grid-wrap">
                        <ul>
                          <li>
                            <div className="appointment-grid-head">
                              <div className="patinet-information">
                                <Link to={`/patient-profile?patientId=${patient._id}`}>
                                  <img
                                    src={patient.profileImage || '/assets/img/doctors-dashboard/profile-01.jpg'}
                                    alt={patient.fullName}
                                    onError={(e) => {
                                      e.target.src = '/assets/img/doctors-dashboard/profile-01.jpg'
                                    }}
                                  />
                                </Link>
                                <div className="patient-info">
                                  <p>#{patient._id.slice(-6).toUpperCase()}</p>
                                  <h6>
                                    <Link to={`/patient-profile?patientId=${patient._id}`}>
                                      {patient.fullName}
                                    </Link>
                                  </h6>
                                  <ul>
                                    {age && <li>Age : {age}</li>}
                                    {patient.gender && <li>{patient.gender}</li>}
                                    {patient.bloodGroup && <li>{patient.bloodGroup}</li>}
                                  </ul>
                                </div>
                              </div>
                            </div>
                          </li>
                          <li className="appointment-info">
                            {lastAppointment && (
                              <>
                                <p>
                                  <i className="isax isax-clock5"></i>
                                  {formatDateTime(lastAppointment.appointmentDate, lastAppointment.appointmentTime)}
                                </p>
                                <p className="mb-0">
                                  <i className="isax isax-location5"></i>
                                  {getLocation(patient.address)}
                                </p>
                              </>
                            )}
                            {!lastAppointment && (
                              <p className="mb-0">
                                <i className="isax isax-location5"></i>
                                {getLocation(patient.address)}
                              </p>
                            )}
                          </li>
                          <li className="appointment-action">
                            <div className="patient-book">
                              <p>
                                <i className="isax isax-calendar-1"></i>
                                Last Booking{' '}
                                <span>
                                  {patient.lastBookingDate ? formatDate(patient.lastBookingDate) : 'N/A'}
                                </span>
                              </p>
                            </div>
                          </li>
                        </ul>
                      </div>
                    </div>
                  )
                })}
                {totalPages > 1 && (
                  <div className="col-md-12">
                    <div className="loader-item text-center">
                      <div className="d-flex justify-content-center gap-2">
                        <button
                          className="btn btn-load"
                          onClick={() => setPage(prev => Math.max(1, prev - 1))}
                          disabled={page === 1}
                        >
                          Previous
                        </button>
                        <span className="align-self-center">
                          Page {page} of {totalPages}
                        </span>
                        <button
                          className="btn btn-load"
                          onClick={() => setPage(prev => Math.min(totalPages, prev + 1))}
                          disabled={page === totalPages}
                        >
                          Next
                        </button>
                      </div>
                    </div>
                  </div>
                )}
              </>
            )}
          </div>
        </div>
        <div className={`tab-pane fade ${activeTab === 'inactive' ? 'show active' : ''}`} id="pills-cancel" role="tabpanel" aria-labelledby="pills-cancel-tab">
          <div className="row">
            {paginatedPatients.length === 0 ? (
              <div className="col-12">
                <div className="card">
                  <div className="card-body text-center py-5">
                    <i className="fe fe-users" style={{ fontSize: '64px', color: '#dee2e6' }}></i>
                    <h5 className="mt-3">No patients found</h5>
                    <p className="text-muted">You don't have any inactive patients.</p>
                  </div>
                </div>
              </div>
            ) : (
              <>
                {paginatedPatients.map((patient) => {
                  const age = calculateAge(patient.dob)
                  const lastAppointment = patient.lastAppointment
                  
                  return (
                    <div key={patient._id} className="col-xl-4 col-lg-6 col-md-6 d-flex">
                      <div className="appointment-wrap appointment-grid-wrap">
                        <ul>
                          <li>
                            <div className="appointment-grid-head">
                              <div className="patinet-information">
                                <Link to={`/patient-profile?patientId=${patient._id}`}>
                                  <img
                                    src={patient.profileImage || '/assets/img/doctors-dashboard/profile-01.jpg'}
                                    alt={patient.fullName}
                                    onError={(e) => {
                                      e.target.src = '/assets/img/doctors-dashboard/profile-01.jpg'
                                    }}
                                  />
                                </Link>
                                <div className="patient-info">
                                  <p>#{patient._id.slice(-6).toUpperCase()}</p>
                                  <h6>
                                    <Link to={`/patient-profile?patientId=${patient._id}`}>
                                      {patient.fullName}
                                    </Link>
                                  </h6>
                                  <ul>
                                    {age && <li>Age : {age}</li>}
                                    {patient.gender && <li>{patient.gender}</li>}
                                    {patient.bloodGroup && <li>{patient.bloodGroup}</li>}
                                  </ul>
                                </div>
                              </div>
                            </div>
                          </li>
                          <li className="appointment-info">
                            {lastAppointment && (
                              <>
                                <p>
                                  <i className="isax isax-clock5"></i>
                                  {formatDateTime(lastAppointment.appointmentDate, lastAppointment.appointmentTime)}
                                </p>
                                <p className="mb-0">
                                  <i className="isax isax-location5"></i>
                                  {getLocation(patient.address)}
                                </p>
                              </>
                            )}
                            {!lastAppointment && (
                              <p className="mb-0">
                                <i className="isax isax-location5"></i>
                                {getLocation(patient.address)}
                              </p>
                            )}
                          </li>
                          <li className="appointment-action">
                            <div className="patient-book">
                              <p>
                                <i className="isax isax-calendar-1"></i>
                                Last Booking{' '}
                                <span>
                                  {patient.lastBookingDate ? formatDate(patient.lastBookingDate) : 'N/A'}
                                </span>
                              </p>
                            </div>
                          </li>
                        </ul>
                      </div>
                    </div>
                  )
                })}
                {totalPages > 1 && (
                  <div className="col-md-12">
                    <div className="loader-item text-center">
                      <div className="d-flex justify-content-center gap-2">
                        <button
                          className="btn btn-load"
                          onClick={() => setPage(prev => Math.max(1, prev - 1))}
                          disabled={page === 1}
                        >
                          Previous
                        </button>
                        <span className="align-self-center">
                          Page {page} of {totalPages}
                        </span>
                        <button
                          className="btn btn-load"
                          onClick={() => setPage(prev => Math.min(totalPages, prev + 1))}
                          disabled={page === totalPages}
                        >
                          Next
                        </button>
                      </div>
                    </div>
                  </div>
                )}
              </>
            )}
          </div>
        </div>
      </div>
    </>
  )
}

export default MyPatients
