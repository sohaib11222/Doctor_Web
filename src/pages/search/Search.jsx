import { useState, useMemo, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { toast } from 'react-toastify'
import { useAuth } from '../../contexts/AuthContext'
import * as doctorApi from '../../api/doctor'
import * as specializationApi from '../../api/specialization'
import * as favoriteApi from '../../api/favorite'
import Breadcrumb from '../../components/common/Breadcrumb'

const Search = () => {
  const { user } = useAuth()
  const queryClient = useQueryClient()
  const [searchTerm, setSearchTerm] = useState('')
  const [location, setLocation] = useState('')
  const [selectedSpecialization, setSelectedSpecialization] = useState('')
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

  // Get color class for specialty
  const getColorClass = (specialtyName) => {
    const colors = {
      'Psychologist': 'text-indigo',
      'Pediatrician': 'text-pink',
      'Neurologist': 'text-teal',
      'Cardiologist': 'text-info',
      'Gastroenterology': 'text-danger'
    }
    return colors[specialtyName] || 'text-primary'
  }

  // Get active bar class
  const getActiveBarClass = (colorClass) => {
    if (colorClass.includes('indigo')) return ''
    if (colorClass.includes('pink')) return 'active-bar-pink'
    if (colorClass.includes('teal')) return 'active-bar-teal'
    if (colorClass.includes('info')) return 'active-bar-info'
    if (colorClass.includes('danger')) return 'active-bar-danger'
    return ''
  }

  // Format location
  const formatLocation = (doctor) => {
    if (doctor.doctorProfile?.clinics?.[0]) {
      const clinic = doctor.doctorProfile.clinics[0]
      return `${clinic.city || ''}${clinic.state ? `, ${clinic.state}` : ''}`
    }
    return 'Location not available'
  }

  // Check if doctor is available (has active subscription)
  const isDoctorAvailable = (doctor) => {
    if (!doctor.subscriptionExpiresAt) return false
    return new Date(doctor.subscriptionExpiresAt) > new Date()
  }

  // Get consultation fee
  const getConsultationFee = (doctor) => {
    // You can add consultation fee to doctor profile or use a default
    return doctor.doctorProfile?.consultationFee || 0
  }

  // Get appointment duration
  const getAppointmentDuration = (doctor) => {
    // You can add this to doctor profile or use a default
    return '30 Min'
  }

  // Fetch user's favorites to check which doctors are favorited
  const { data: favoritesData } = useQuery({
    queryKey: ['favorites', user?._id],
    queryFn: () => favoriteApi.listFavorites(user?._id, { limit: 1000 }),
    enabled: !!user && user.role === 'PATIENT'
  })

  // Extract favorite doctor IDs
  const favoriteDoctorIds = useMemo(() => {
    if (!favoritesData) return new Set()
    const responseData = favoritesData.data || favoritesData
    const favorites = responseData.favorites || []
    return new Set(favorites.map(fav => {
      const doctorId = typeof fav.doctorId === 'object' ? fav.doctorId._id || fav.doctorId : fav.doctorId
      return String(doctorId)
    }))
  }, [favoritesData])

  // Create a map of favoriteId by doctorId for easy removal
  const favoriteIdMap = useMemo(() => {
    if (!favoritesData) return {}
    const responseData = favoritesData.data || favoritesData
    const favorites = responseData.favorites || []
    const map = {}
    favorites.forEach(fav => {
      const doctorId = typeof fav.doctorId === 'object' ? fav.doctorId._id || fav.doctorId : fav.doctorId
      map[String(doctorId)] = fav._id
    })
    return map
  }, [favoritesData])

  // Add favorite mutation
  const addFavoriteMutation = useMutation({
    mutationFn: ({ doctorId, patientId }) => favoriteApi.addFavorite(doctorId, patientId),
    onSuccess: () => {
      toast.success('Doctor added to favorites')
      queryClient.invalidateQueries(['favorites', user?._id])
    },
    onError: (error) => {
      console.error('Add favorite error:', error)
      const errorMessage = error.response?.data?.message || 
                          error.response?.data?.error || 
                          error.message || 
                          'Failed to add favorite'
      
      // Show detailed validation errors
      if (error.response?.status === 400) {
        const validationErrors = error.response?.data?.errors || error.response?.data?.error
        if (validationErrors) {
          console.error('Validation errors:', validationErrors)
          toast.error(`Validation error: ${typeof validationErrors === 'string' ? validationErrors : JSON.stringify(validationErrors)}`)
        } else {
          toast.error(errorMessage)
        }
      } else {
        toast.error(errorMessage)
      }
    }
  })

  // Remove favorite mutation
  const removeFavoriteMutation = useMutation({
    mutationFn: (favoriteId) => favoriteApi.removeFavorite(favoriteId),
    onSuccess: () => {
      toast.success('Doctor removed from favorites')
      queryClient.invalidateQueries(['favorites', user?._id])
    },
    onError: (error) => {
      const errorMessage = error.response?.data?.message || error.message || 'Failed to remove favorite'
      toast.error(errorMessage)
    }
  })

  // Handle favorite toggle
  const handleFavoriteToggle = (e, doctorId) => {
    e.preventDefault()
    
    if (!user || user.role !== 'PATIENT') {
      toast.error('Please login as a patient to add favorites')
      return
    }

    const doctorIdStr = String(doctorId)
    const patientIdStr = String(user._id)
    const isFavorited = favoriteDoctorIds.has(doctorIdStr)

    if (isFavorited) {
      // Remove from favorites
      const favoriteId = favoriteIdMap[doctorIdStr]
      if (favoriteId) {
        removeFavoriteMutation.mutate(favoriteId)
      } else {
        toast.error('Favorite ID not found')
      }
    } else {
      // Add to favorites - include patientId for validator
      console.log('Adding favorite:', { doctorId: doctorIdStr, patientId: patientIdStr })
      addFavoriteMutation.mutate({ doctorId: doctorIdStr, patientId: patientIdStr })
    }
  }

  // Get specialty name
  const getSpecialtyName = (doctor) => {
    if (doctor.doctorProfile?.specializations?.[0]) {
      return doctor.doctorProfile.specializations[0].name || 'General'
    }
    return 'General'
  }

  // Get rating
  const getRating = (doctor) => {
    return doctor.doctorProfile?.ratingAvg || doctor.rating?.average || 0
  }

  // Get doctor image
  const getDoctorImage = (doctor) => {
    return doctor.profileImage || doctor.doctorProfile?.profileImage || '/assets/img/doctor-grid/doctor-grid-01.jpg'
  }

  // Handle search
  const handleSearch = (e) => {
    e.preventDefault()
    setPage(1) // Reset to first page on new search
  }

  return (
    <>
      <style>{`
        .fav-icon.favorited .fa-heart,
        .fav-icon .fa-heart.filled {
          color: #f44336 !important;
        }
        .fav-icon:hover .fa-heart {
          color: #f44336 !important;
          transition: color 0.2s;
        }
        .sub-links .favorited .feather-heart.filled {
          color: #f44336 !important;
          fill: #f44336 !important;
        }
      `}</style>
      {/* Breadcrumb */}
      <div className="breadcrumb-bar overflow-visible">
        <div className="container">
          <div className="row align-items-center inner-banner">
            <div className="col-md-12 col-12 text-center">
              <nav aria-label="breadcrumb" className="page-breadcrumb">
                <ol className="breadcrumb">
                  <li className="breadcrumb-item"><Link to="/"><i className="isax isax-home-15"></i></Link></li>
                  <li className="breadcrumb-item">Doctor</li>
                  <li className="breadcrumb-item active">Doctor Grid Full Width</li>
                </ol>
                <h2 className="breadcrumb-title">Find Your Doctor</h2>
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
            <div className="col-md-6">
              <div className="mb-4">
                <h3>
                  Showing <span className="text-secondary">{pagination.total}</span> Doctors For You
                </h3>
              </div>
            </div>
            <div className="col-md-6">
              <div className="d-flex align-items-center justify-content-end mb-4">
                <div className="doctor-filter-availability me-3">
                  <p>Availability</p>
                  <div className="status-toggle status-tog">
                    <input
                      type="checkbox"
                      id="status_6"
                      className="check"
                      checked={showAvailability}
                      onChange={(e) => setShowAvailability(e.target.checked)}
                    />
                    <label htmlFor="status_6" className="checktoggle">checkbox</label>
                  </div>
                </div>
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
                  const doctorId = doctor.userId?._id || doctor._id
                  const doctorName = doctor.userId?.fullName || doctor.fullName || 'Unknown Doctor'
                  const specialtyName = getSpecialtyName(doctor)
                  const colorClass = getColorClass(specialtyName)
                  const rating = getRating(doctor)
                  const locationStr = formatLocation(doctor)
                  const duration = getAppointmentDuration(doctor)
                  const fee = getConsultationFee(doctor)
                  const available = isDoctorAvailable(doctor)
                  const doctorImage = getDoctorImage(doctor)

                  return (
                    <div key={doctorId} className="col-xxl-3 col-lg-4 col-md-6">
                      <div className="card">
                        <div className="card-img card-img-hover">
                          <Link to={`/doctor-profile?id=${doctorId}`}>
                            <img
                              src={doctorImage}
                              alt={doctorName}
                              onError={(e) => {
                                e.target.src = '/assets/img/doctor-grid/doctor-grid-01.jpg'
                              }}
                            />
                          </Link>
                          <div className="grid-overlay-item d-flex align-items-center justify-content-between">
                            <span className="badge bg-orange">
                              <i className="fa-solid fa-star me-1"></i>{rating.toFixed(1)}
                            </span>
                            <a 
                              href="javascript:void(0)" 
                              className={`fav-icon ${favoriteDoctorIds.has(String(doctorId)) ? 'favorited' : ''}`}
                              onClick={(e) => handleFavoriteToggle(e, doctorId)}
                              title={favoriteDoctorIds.has(String(doctorId)) ? 'Remove from favorites' : 'Add to favorites'}
                            >
                              <i className={`fa fa-heart ${favoriteDoctorIds.has(String(doctorId)) ? 'filled' : ''}`}></i>
                            </a>
                          </div>
                        </div>
                        <div className="card-body p-0">
                          <div className={`d-flex active-bar ${getActiveBarClass(colorClass)} align-items-center justify-content-between p-3`}>
                            <a href="#" className={`${colorClass} fw-medium fs-14`}>{specialtyName}</a>
                            <span className={`badge ${available ? 'bg-success-light' : 'bg-danger-light'} d-inline-flex align-items-center`}>
                              <i className="fa-solid fa-circle fs-5 me-1"></i>
                              {available ? 'Available' : 'Unavailable'}
                            </span>
                          </div>
                          <div className="p-3 pt-0">
                            <div className="doctor-info-detail mb-3 pb-3">
                              <h3 className="mb-1">
                                <Link to={`/doctor-profile?id=${doctorId}`}>{doctorName}</Link>
                              </h3>
                              <div className="d-flex align-items-center">
                                <p className="d-flex align-items-center mb-0 fs-14">
                                  <i className="isax isax-location me-2"></i>{locationStr}
                                </p>
                                <i className="fa-solid fa-circle fs-5 text-primary mx-2 me-1"></i>
                                <span className="fs-14 fw-medium">{duration}</span>
                              </div>
                            </div>
                            <div className="d-flex align-items-center justify-content-between">
                              <div>
                                <p className="mb-1">Consultation Fees</p>
                                <h3 className="text-orange">${fee || 'N/A'}</h3>
                              </div>
                              <Link
                                to={`/booking?doctorId=${doctorId}`}
                                className="btn btn-md btn-dark inline-flex align-items-center rounded-pill"
                              >
                                <i className="isax isax-calendar-1 me-2"></i>
                                Book Now
                              </Link>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  )
                })}
              </div>

              {/* Pagination */}
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
      {/* /Page Content */}
    </>
  )
}

export default Search
