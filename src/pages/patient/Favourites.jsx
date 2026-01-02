import { useState, useMemo } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { toast } from 'react-toastify'
import { useAuth } from '../../contexts/AuthContext'
import * as favoriteApi from '../../api/favorite'
import * as doctorApi from '../../api/doctor'

const Favourites = () => {
  const { user } = useAuth()
  const navigate = useNavigate()
  const queryClient = useQueryClient()
  const [searchQuery, setSearchQuery] = useState('')
  const [page, setPage] = useState(1)
  const limit = 12

  // Fetch favorites
  const { data: favoritesData, isLoading, error, refetch } = useQuery({
    queryKey: ['favorites', user?._id, page],
    queryFn: () => favoriteApi.listFavorites(user?._id, { page, limit }),
    enabled: !!user,
    retry: 1
  })

  // Extract favorites
  const favorites = useMemo(() => {
    if (!favoritesData) return []
    const responseData = favoritesData.data || favoritesData
    return Array.isArray(responseData) ? responseData : (responseData.favorites || [])
  }, [favoritesData])

  const pagination = useMemo(() => {
    if (!favoritesData) return null
    const responseData = favoritesData.data || favoritesData
    return responseData.pagination || null
  }, [favoritesData])

  // Remove favorite mutation
  const removeFavoriteMutation = useMutation({
    mutationFn: (favoriteId) => favoriteApi.removeFavorite(favoriteId),
    onSuccess: () => {
      toast.success('Doctor removed from favorites')
      queryClient.invalidateQueries(['favorites', user?._id])
      refetch()
    },
    onError: (error) => {
      const errorMessage = error.response?.data?.message || error.message || 'Failed to remove favorite'
      toast.error(errorMessage)
    }
  })

  // Fetch doctor profiles for favorites (to get full details)
  const doctorIds = useMemo(() => {
    return favorites.map(fav => {
      const doctorId = typeof fav.doctorId === 'object' ? fav.doctorId._id || fav.doctorId : fav.doctorId
      return doctorId
    }).filter(Boolean)
  }, [favorites])

  // Fetch doctor profiles
  const { data: doctorsData } = useQuery({
    queryKey: ['favoriteDoctors', doctorIds],
    queryFn: async () => {
      const doctorPromises = doctorIds.map(id => doctorApi.getDoctorProfileById(id))
      const results = await Promise.all(doctorPromises)
      return results.map(result => {
        const data = result.data || result
        return Array.isArray(data) ? data[0] : data
      })
    },
    enabled: doctorIds.length > 0
  })

  // Create a map of doctorId to doctor profile
  const doctorProfilesMap = useMemo(() => {
    if (!doctorsData || !Array.isArray(doctorsData)) return {}
    const map = {}
    doctorsData.forEach(doctor => {
      const doctorId = doctor.userId?._id || doctor._id
      if (doctorId) {
        map[doctorId] = doctor
      }
    })
    return map
  }, [doctorsData])

  // Combine favorites with doctor profiles
  const favoritesWithDetails = useMemo(() => {
    return favorites.map(favorite => {
      const doctorId = typeof favorite.doctorId === 'object' 
        ? favorite.doctorId._id || favorite.doctorId 
        : favorite.doctorId
      
      const doctorProfile = doctorProfilesMap[doctorId]
      const doctor = favorite.doctorId || {}
      
      return {
        ...favorite,
        doctorId: doctorId,
        doctor: doctorProfile || {
          userId: {
            fullName: doctor.fullName || 'Unknown Doctor',
            profileImage: doctor.profileImage || '/assets/img/doctors/doctor-thumb-01.jpg'
          },
          specialization: doctorProfile?.specialization || { name: 'General' },
          ratingAvg: doctorProfile?.ratingAvg || 0,
          clinics: doctorProfile?.clinics || []
        }
      }
    })
  }, [favorites, doctorProfilesMap])

  // Filter favorites by search query
  const filteredFavorites = useMemo(() => {
    if (!searchQuery.trim()) return favoritesWithDetails
    
    const query = searchQuery.toLowerCase()
    return favoritesWithDetails.filter(fav => {
      const doctorName = fav.doctor?.userId?.fullName || fav.doctor?.fullName || ''
      const specialization = fav.doctor?.specialization?.name || ''
      return doctorName.toLowerCase().includes(query) || specialization.toLowerCase().includes(query)
    })
  }, [favoritesWithDetails, searchQuery])

  // Handle remove favorite
  const handleRemoveFavorite = (e, favoriteId) => {
    e.preventDefault()
    if (window.confirm('Are you sure you want to remove this doctor from favorites?')) {
      removeFavoriteMutation.mutate(favoriteId)
    }
  }

  // Handle load more
  const handleLoadMore = () => {
    if (pagination && page < pagination.pages) {
      setPage(prev => prev + 1)
    }
  }

  // Format date
  const formatDate = (date) => {
    if (!date) return 'N/A'
    return new Date(date).toLocaleDateString('en-US', { 
      year: 'numeric', 
      month: 'short', 
      day: 'numeric' 
    })
  }

  // Render stars
  const renderStars = (rating) => {
    const stars = []
    const ratingValue = rating || 0
    for (let i = 1; i <= 5; i++) {
      stars.push(
        <i key={i} className={i <= ratingValue ? 'fas fa-star filled' : 'fas fa-star'}></i>
      )
    }
    return stars
  }

  if (isLoading && page === 1) {
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
                <p className="mt-3 text-muted">Loading favorites...</p>
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
                <h5>Error loading favorites</h5>
                <p>{error.response?.data?.message || error.message || 'Please try refreshing the page'}</p>
                <button className="btn btn-primary" onClick={() => refetch()}>Retry</button>
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
              <h3>Favourites</h3>
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

            {/* Favourites */}
            {filteredFavorites.length === 0 ? (
              <div className="text-center py-5">
                <i className="fa-solid fa-heart" style={{ fontSize: '64px', color: '#dee2e6', marginBottom: '16px' }}></i>
                <h5>No favorites yet</h5>
                <p className="text-muted">Start adding doctors to your favorites to see them here.</p>
                <Link to="/search" className="btn btn-primary mt-3">Browse Doctors</Link>
              </div>
            ) : (
              <>
                <div className="row">
                  {filteredFavorites.map((fav) => {
                    const doctorId = fav.doctorId
                    const doctor = fav.doctor
                    const doctorName = doctor?.userId?.fullName || doctor?.fullName || 'Unknown Doctor'
                    const doctorImage = doctor?.userId?.profileImage || doctor?.profileImage || '/assets/img/doctors/doctor-thumb-01.jpg'
                    const specialization = doctor?.specialization?.name || 'General'
                    const rating = doctor?.ratingAvg || 0
                    const location = doctor?.clinics?.[0] 
                      ? `${doctor.clinics[0].city || ''}, ${doctor.clinics[0].state || ''}`.trim() || 'Location not available'
                      : 'Location not available'
                    const lastBook = formatDate(fav.createdAt)

                    return (
                      <div key={fav._id} className="col-md-6 col-lg-4 d-flex">
                        <div className="profile-widget patient-favour flex-fill">
                          <div className="fav-head">
                            <a 
                              href="javascript:void(0)" 
                              className="fav-btn favourite-btn"
                              onClick={(e) => handleRemoveFavorite(e, fav._id)}
                              title="Remove from favorites"
                            >
                              <span className="favourite-icon favourite">
                                <i className="isax isax-heart5"></i>
                              </span>
                            </a>
                            <div className="doc-img">
                              <Link to={`/doctor-profile?id=${doctorId}`}>
                                <img className="img-fluid" alt={doctorName} src={doctorImage} />
                              </Link>
                            </div>
                            <div className="pro-content">
                              <h3 className="title">
                                <Link to={`/doctor-profile?id=${doctorId}`}>{doctorName}</Link>
                                <i className="isax isax-tick-circle5 verified"></i>
                              </h3>
                              <p className="speciality">{specialization}</p>
                              <div className="rating">
                                {renderStars(rating)}
                                <span className="d-inline-block average-rating">{rating.toFixed(1)}</span>
                              </div>
                              <ul className="available-info">
                                <li>
                                  <i className="isax isax-location5 me-1"></i>
                                  <span>Location :</span> {location}
                                </li>
                              </ul>
                              <div className="last-book">
                                <p>Added on {lastBook}</p>
                              </div>
                            </div>
                          </div>
                          <div className="fav-footer">
                            <div className="row row-sm">
                              <div className="col-6">
                                <Link 
                                  to={`/doctor-profile?id=${doctorId}`} 
                                  className="btn btn-md btn-light w-100"
                                >
                                  View Profile
                                </Link>
                              </div>
                              <div className="col-6">
                                <Link 
                                  to={`/booking?doctorId=${doctorId}`} 
                                  className="btn btn-md btn-outline-primary w-100"
                                >
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
                {/* /Favourites */}

                {/* Load More */}
                {pagination && page < pagination.pages && (
                  <div className="col-md-12">
                    <div className="loader-item text-center mt-0">
                      <button 
                        className="btn btn-outline-primary rounded-pill"
                        onClick={handleLoadMore}
                        disabled={isLoading}
                      >
                        {isLoading ? 'Loading...' : 'Load More'}
                      </button>
                    </div>
                  </div>
                )}
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}

export default Favourites
