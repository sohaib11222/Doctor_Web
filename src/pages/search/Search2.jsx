import { useState, useMemo, useEffect } from 'react'
import { Link, useSearchParams } from 'react-router-dom'
import { useQuery } from '@tanstack/react-query'
import * as doctorApi from '../../api/doctor'
import * as specializationApi from '../../api/specialization'

const Search2 = () => {
  const [searchParams, setSearchParams] = useSearchParams()
  
  // Get initial values from URL params
  const [searchTerm, setSearchTerm] = useState(searchParams.get('search') || '')
  const [location, setLocation] = useState(searchParams.get('location') || '')
  const [selectedSpecialization, setSelectedSpecialization] = useState(searchParams.get('specialization') || '')
  const [page, setPage] = useState(1)
  const [showAvailability, setShowAvailability] = useState(false)
  const limit = 12

  // Build query params
  const queryParams = useMemo(() => {
    const params = {
      page,
      limit
    }

    if (searchTerm) {
      params.search = searchTerm
    }

    if (location) {
      params.city = location
    }

    if (selectedSpecialization) {
      params.specializationId = selectedSpecialization
    }

    if (showAvailability) {
      params.isAvailableOnline = true
    }

    return params
  }, [searchTerm, location, selectedSpecialization, showAvailability, page, limit])

  // Fetch doctors
  const { data: doctorsData, isLoading, error } = useQuery({
    queryKey: ['doctors', queryParams],
    queryFn: () => doctorApi.listDoctors(queryParams)
  })

  // Fetch specializations
  const { data: specializationsData } = useQuery({
    queryKey: ['specializations'],
    queryFn: () => specializationApi.getAllSpecializations()
  })

  // Extract data
  const doctors = useMemo(() => {
    if (!doctorsData) return []
    const responseData = doctorsData.data || doctorsData
    return responseData.doctors || responseData.data || responseData || []
  }, [doctorsData])

  const specializations = useMemo(() => {
    if (!specializationsData) return []
    return Array.isArray(specializationsData) ? specializationsData : (specializationsData.data || [])
  }, [specializationsData])

  const pagination = useMemo(() => {
    if (!doctorsData) return { page: 1, limit: 12, total: 0, pages: 0 }
    const responseData = doctorsData.data || doctorsData
    return responseData.pagination || { page: 1, limit: 12, total: doctors.length, pages: 1 }
  }, [doctorsData, doctors.length])

  // Normalize image URL
  const normalizeImageUrl = (imageUri) => {
    if (!imageUri || typeof imageUri !== 'string') return null
    const trimmedUri = imageUri.trim()
    if (!trimmedUri) return null
    const apiBaseURL = import.meta.env.VITE_API_URL || '/api'
    const baseURL = apiBaseURL.replace('/api', '')
    if (trimmedUri.startsWith('http://') || trimmedUri.startsWith('https://')) {
      return trimmedUri
    }
    const imagePath = trimmedUri.startsWith('/') ? trimmedUri : `/${trimmedUri}`
    return `${baseURL}${imagePath}`
  }

  // Handle search form submit
  const handleSearch = (e) => {
    e.preventDefault()
    setPage(1) // Reset to first page
    // Update URL params
    const params = new URLSearchParams()
    if (searchTerm.trim()) params.set('search', searchTerm.trim())
    if (location.trim()) params.set('location', location.trim())
    if (selectedSpecialization) params.set('specialization', selectedSpecialization)
    if (showAvailability) params.set('availability', 'true')
    setSearchParams(params)
  }

  // Format doctor data
  const formatDoctor = (doctor) => {
    const userId = doctor.userId || {}
    const specialization = doctor.specialization || {}
    const clinic = doctor.clinics?.[0] || {}
    
    return {
      id: doctor._id || doctor.userId?._id,
      name: userId.fullName || doctor.fullName || 'Dr. Unknown',
      specialty: specialization.name || 'General',
      location: clinic.city ? `${clinic.city}${clinic.state ? `, ${clinic.state}` : ''}` : 'Location not available',
      rating: doctor.ratingAvg || 0,
      fee: clinic.consultationFee || 0,
      image: normalizeImageUrl(userId.profileImage || doctor.profileImage) || '/assets/img/doctors/doctor-01.jpg',
      doctorId: doctor._id || doctor.userId?._id
    }
  }

  return (
    <>
      {/* Breadcrumb */}
      <div className="breadcrumb-bar overflow-visible">
        <div className="container">
          <div className="row align-items-center inner-banner">
            <div className="col-md-12 col-12 text-center">
              <nav aria-label="breadcrumb" className="page-breadcrumb">
                <ol className="breadcrumb">
                  <li className="breadcrumb-item"><Link to="/"><i className="isax isax-home-15"></i></Link></li>
                  <li className="breadcrumb-item">Doctor</li>
                  <li className="breadcrumb-item active">Doctor List</li>
                </ol>
                <h2 className="breadcrumb-title">Doctor List</h2>
              </nav>
            </div>
          </div>
          <div className="bg-primary-gradient rounded-pill doctors-search-box">
            <div className="search-box-one rounded-pill">
              <form onSubmit={handleSearch}>
                <div className="search-input search-line">
                  <i className="isax isax-hospital5 bficon"></i>
                  <div className="mb-0">
                    <input 
                      type="text" 
                      className="form-control" 
                      placeholder="Search for Doctors, Hospitals, Clinics"
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                    />
                  </div>
                </div>
                <div className="search-input search-map-line">
                  <i className="isax isax-location5"></i>
                  <div className="mb-0">
                    <input 
                      type="text" 
                      className="form-control" 
                      placeholder="Location"
                      value={location}
                      onChange={(e) => setLocation(e.target.value)}
                    />
                  </div>
                </div>
                <div className="search-input search-calendar-line">
                  <i className="isax isax-calendar-tick5"></i>
                  <div className="mb-0">
                    <select
                      className="form-control"
                      value={selectedSpecialization}
                      onChange={(e) => setSelectedSpecialization(e.target.value)}
                    >
                      <option value="">All Specialities</option>
                      {specializations.map((spec) => (
                        <option key={spec._id || spec} value={spec._id || spec}>
                          {spec.name || spec}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>
                <div className="form-search-btn">
                  <button className="btn btn-primary d-inline-flex align-items-center rounded-pill" type="submit">
                    <i className="isax isax-search-normal-15 me-2"></i>Search
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
        <div className="breadcrumb-bg">
          <img src="/assets/img/bg/breadcrumb-bg-01.png" alt="img" className="breadcrumb-bg-01" />
          <img src="/assets/img/bg/breadcrumb-bg-02.png" alt="img" className="breadcrumb-bg-02" />
          <img src="/assets/img/bg/breadcrumb-icon.png" alt="img" className="breadcrumb-bg-03" />
          <img src="/assets/img/bg/breadcrumb-icon.png" alt="img" className="breadcrumb-bg-04" />
        </div>
      </div>
      {/* /Breadcrumb */}

      {/* Page Content */}
      <div className="content mt-5">
        <div className="container">
          <div className="row">
            <div className="col-xl-3">
              <div className="card filter-lists">
                <div className="card-header">
                  <div className="d-flex align-items-center filter-head justify-content-between">
                    <h4>Filter</h4>
                    <a href="#" className="text-secondary text-decoration-underline">Clear All</a>
                  </div>
                  <div className="filter-input">
                    <div className="position-relative input-icon">
                      <input type="text" className="form-control" />
                      <span><i className="isax isax-search-normal-1"></i></span>
                    </div>
                  </div>
                </div>
                <div className="card-body p-0">
                  {/* Filter accordions - simplified */}
                  <div className="accordion-item border-bottom">
                    <div className="accordion-header" id="heading1">
                      <div className="accordion-button" data-bs-toggle="collapse" data-bs-target="#collapse1" aria-controls="collapse1" role="button">
                        <div className="d-flex align-items-center w-100">
                          <h5>Specialities</h5>
                          <div className="ms-auto">
                            <span><i className="fas fa-chevron-down"></i></span>
                          </div>
                        </div>
                      </div>
                    </div>
                    <div id="collapse1" className="accordion-collapse show" aria-labelledby="heading1">
                      <div className="accordion-body pt-3">
                        {['Urology', 'Psychiatry', 'Cardiology', 'Pediatrics', 'Neurology'].map((spec, idx) => (
                          <div key={idx} className="d-flex align-items-center justify-content-between mb-2">
                            <div className="form-check">
                              <input className="form-check-input" type="checkbox" value="" id={`checkbox-sm${idx + 2}`} defaultChecked={idx === 0} />
                              <label className="form-check-label" htmlFor={`checkbox-sm${idx + 2}`}>{spec}</label>
                            </div>
                            <span className="filter-badge">21</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <div className="col-xl-9">
              <div className="row align-items-center">
                <div className="col-md-6">
                  <div className="mb-4">
                    <h3>Showing <span className="text-secondary">{pagination.total || 0}</span> Doctors For You</h3>
                  </div>
                </div>
                <div className="col-md-6">
                  <div className="d-flex align-items-center justify-content-end mb-4">
                    <div className="doctor-filter-availability me-2">
                      <p>Availability</p>
                      <div className="status-toggle status-tog">
                        <input 
                          type="checkbox" 
                          id="status_6" 
                          className="check"
                          checked={showAvailability}
                          onChange={(e) => {
                            setShowAvailability(e.target.checked)
                            setPage(1)
                          }}
                        />
                        <label htmlFor="status_6" className="checktoggle">checkbox</label>
                      </div>
                    </div>
                    <div className="dropdown header-dropdown me-2">
                      <a className="dropdown-toggle sort-dropdown" data-bs-toggle="dropdown" href="javascript:void(0);" aria-expanded="false">
                        <span>Sort By</span>Price (Low to High)
                      </a>
                      <div className="dropdown-menu dropdown-menu-end">
                        <a href="javascript:void(0);" className="dropdown-item">Price (Low to High)</a>
                        <a href="javascript:void(0);" className="dropdown-item">Price (High to Low)</a>
                      </div>
                    </div>
                    <Link to="/doctor-grid" className="btn btn-sm head-icon me-2">
                      <i className="isax isax-grid-7"></i>
                    </Link>
                    <Link to="/search-2" className="btn btn-sm head-icon active me-2">
                      <i className="isax isax-row-vertical"></i>
                    </Link>
                    <Link to="/map-list" className="btn btn-sm head-icon">
                      <i className="isax isax-location"></i>
                    </Link>
                  </div>
                </div>
              </div>
              {isLoading ? (
                <div className="text-center py-5">
                  <div className="spinner-border text-primary" role="status">
                    <span className="visually-hidden">Loading...</span>
                  </div>
                  <p className="mt-3 text-muted">Loading doctors...</p>
                </div>
              ) : error ? (
                <div className="alert alert-danger">
                  <h5>Error Loading Doctors</h5>
                  <p>{error.response?.data?.message || error.message || 'Failed to load doctors'}</p>
                </div>
              ) : doctors.length === 0 ? (
                <div className="text-center py-5">
                  <p className="text-muted">No doctors found. Try adjusting your search criteria.</p>
                </div>
              ) : (
                <>
                  <div className="row">
                    {doctors.map((doctor) => {
                      const formatted = formatDoctor(doctor)
                      return (
                        <div key={formatted.id} className="col-md-12">
                          <div className="card">
                            <div className="card-body">
                              <div className="doctor-widget">
                                <div className="doc-info-left">
                                  <div className="doctor-img">
                                    <Link to={`/doctor-profile?id=${formatted.doctorId}`}>
                                      <img 
                                        src={formatted.image} 
                                        className="img-fluid" 
                                        alt={formatted.name}
                                        onError={(e) => {
                                          e.target.src = '/assets/img/doctors/doctor-01.jpg'
                                        }}
                                      />
                                    </Link>
                                  </div>
                                  <div className="doc-info-cont">
                                    <h4 className="doc-name">
                                      <Link to={`/doctor-profile?id=${formatted.doctorId}`}>{formatted.name}</Link>
                                    </h4>
                                    <p className="doc-speciality">{formatted.specialty}</p>
                                    <div className="rating">
                                      {[...Array(5)].map((_, i) => (
                                        <i 
                                          key={i} 
                                          className={`fas fa-star ${i < Math.floor(formatted.rating) ? 'filled' : ''}`}
                                        ></i>
                                      ))}
                                      <span className="d-inline-block average-rating">{formatted.rating.toFixed(1)}</span>
                                    </div>
                                    <div className="clinic-details">
                                      <p className="doc-location">
                                        <i className="fas fa-map-marker-alt"></i> {formatted.location}
                                      </p>
                                    </div>
                                  </div>
                                </div>
                                <div className="doc-info-right">
                                  <div className="clini-infos">
                                    <ul>
                                      <li><i className="far fa-thumbs-up"></i> {formatted.rating > 0 ? `${Math.round(formatted.rating * 20)}%` : 'N/A'}</li>
                                      <li><i className="fas fa-map-marker-alt"></i> {formatted.location}</li>
                                    </ul>
                                  </div>
                                  <div className="clinic-booking">
                                    <Link className="view-pro-btn" to={`/doctor-profile?id=${formatted.doctorId}`}>View Profile</Link>
                                    <Link className="btn btn-primary" to={`/booking?doctorId=${formatted.doctorId}`}>Book Appointment</Link>
                                  </div>
                                </div>
                              </div>
                            </div>
                          </div>
                        </div>
                      )
                    })}
                  </div>
                  {pagination.pages > 1 && (
                    <div className="col-md-12">
                      <div className="text-center mb-4">
                        <div className="d-flex justify-content-center gap-2">
                          <button
                            className="btn btn-md btn-primary-gradient"
                            disabled={page === 1}
                            onClick={() => setPage(prev => Math.max(1, prev - 1))}
                          >
                            Previous
                          </button>
                          <span className="d-flex align-items-center px-3">
                            Page {pagination.page} of {pagination.pages}
                          </span>
                          <button
                            className="btn btn-md btn-primary-gradient"
                            disabled={page >= pagination.pages}
                            onClick={() => setPage(prev => Math.min(pagination.pages, prev + 1))}
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
      </div>
      {/* /Page Content */}
    </>
  )
}

export default Search2

