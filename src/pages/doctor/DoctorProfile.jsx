import { useState, useMemo } from 'react'
import { Link, useSearchParams } from 'react-router-dom'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { toast } from 'react-toastify'
import { useAuth } from '../../contexts/AuthContext'
import * as doctorApi from '../../api/doctor'
import * as favoriteApi from '../../api/favorite'
import * as reviewsApi from '../../api/reviews'

const DoctorProfile = () => {
  const { user } = useAuth()
  const queryClient = useQueryClient()
  const [searchParams] = useSearchParams()
  const doctorId = searchParams.get('id')
  const [activeSection, setActiveSection] = useState('doc_bio')

  // Fetch doctor profile
  const { data: doctorData, isLoading: doctorLoading, error: doctorError } = useQuery({
    queryKey: ['doctorProfile', doctorId],
    queryFn: () => doctorApi.getDoctorProfileById(doctorId),
    enabled: !!doctorId,
    retry: 1
  })

  // Extract doctor data
  const doctor = useMemo(() => {
    if (!doctorData) return null
    const responseData = doctorData.data || doctorData
    return Array.isArray(responseData) ? responseData[0] : responseData
  }, [doctorData])

  // Fetch doctor reviews (public endpoint)
  const { data: reviewsData, isLoading: reviewsLoading } = useQuery({
    queryKey: ['doctorReviews', doctorId],
    queryFn: () => reviewsApi.getReviewsByDoctorId(doctorId, { limit: 10, page: 1 }),
    enabled: !!doctorId
  })

  const reviews = useMemo(() => {
    if (!reviewsData) return []
    const responseData = reviewsData.data || reviewsData
    return responseData.reviews || []
  }, [reviewsData])

  const reviewCount = useMemo(() => {
    if (!reviewsData) return doctor?.ratingCount || 0
    const responseData = reviewsData.data || reviewsData
    return responseData.pagination?.total || doctor?.ratingCount || 0
  }, [reviewsData, doctor])

  // Calculate experience years from experience array
  const experienceYears = useMemo(() => {
    if (!doctor?.experience || !Array.isArray(doctor.experience) || doctor.experience.length === 0) {
      return doctor?.experienceYears || 0
    }
    // Calculate from earliest toYear or current year
    const currentYear = new Date().getFullYear()
    const earliestYear = Math.min(
      ...doctor.experience
        .map(exp => {
          const toYear = exp.toYear ? parseInt(exp.toYear) : currentYear
          return toYear
        })
        .filter(year => !isNaN(year))
    )
    return currentYear - earliestYear
  }, [doctor])

  // Calculate total awards count
  const awardsCount = useMemo(() => {
    if (!doctor?.awards || !Array.isArray(doctor.awards)) return 0
    return doctor.awards.length
  }, [doctor])

  // Fetch user's favorites to check if this doctor is favorited
  const { data: favoritesData } = useQuery({
    queryKey: ['favorites', user?._id],
    queryFn: () => favoriteApi.listFavorites(user?._id, { limit: 1000 }),
    enabled: !!user && user.role === 'PATIENT' && !!doctorId
  })

  // Check if doctor is in favorites
  const isFavorited = useMemo(() => {
    if (!favoritesData || !doctorId) return false
    const responseData = favoritesData.data || favoritesData
    const favorites = responseData.favorites || []
    return favorites.some(fav => {
      const favDoctorId = typeof fav.doctorId === 'object' ? fav.doctorId._id || fav.doctorId : fav.doctorId
      return String(favDoctorId) === String(doctorId)
    })
  }, [favoritesData, doctorId])

  // Get favorite ID for removal
  const favoriteId = useMemo(() => {
    if (!favoritesData || !doctorId) return null
    const responseData = favoritesData.data || favoritesData
    const favorites = responseData.favorites || []
    const favorite = favorites.find(fav => {
      const favDoctorId = typeof fav.doctorId === 'object' ? fav.doctorId._id || fav.doctorId : fav.doctorId
      return String(favDoctorId) === String(doctorId)
    })
    return favorite?._id || null
  }, [favoritesData, doctorId])

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
  const handleFavoriteToggle = (e) => {
    e.preventDefault()
    
    if (!user || user.role !== 'PATIENT') {
      toast.error('Please login as a patient to add favorites')
      return
    }

    if (!doctorId) {
      toast.error('Doctor ID not found')
      return
    }

    const doctorIdStr = String(doctorId)
    const patientIdStr = String(user._id)

    if (isFavorited && favoriteId) {
      // Remove from favorites
      removeFavoriteMutation.mutate(favoriteId)
    } else {
      // Add to favorites - include patientId for validator
      console.log('Adding favorite:', { doctorId: doctorIdStr, patientId: patientIdStr })
      addFavoriteMutation.mutate({ doctorId: doctorIdStr, patientId: patientIdStr })
    }
  }

  if (doctorLoading) {
    return (
      <div className="content doctor-content">
        <div className="container">
          <div className="text-center py-5">
            <div className="spinner-border text-primary" role="status">
              <span className="visually-hidden">Loading...</span>
            </div>
            <p className="mt-3 text-muted">Loading doctor profile...</p>
          </div>
        </div>
      </div>
    )
  }

  if (doctorError || !doctor) {
    return (
      <div className="content doctor-content">
        <div className="container">
          <div className="alert alert-danger">
            <h5>Doctor Not Found</h5>
            <p>{doctorError?.response?.data?.message || doctorError?.message || 'The doctor you\'re looking for doesn\'t exist.'}</p>
            <Link to="/search" className="btn btn-primary">Browse Doctors</Link>
          </div>
        </div>
      </div>
    )
  }

  // Extract doctor information
  const doctorName = doctor.userId?.fullName || doctor.fullName || 'Unknown Doctor'
  const doctorImage = doctor.userId?.profileImage || doctor.profileImage || '/assets/img/doctors/doc-profile-02.jpg'
  const specialization = doctor.specialization?.name || 'General'
  const rating = doctor.ratingAvg || 0
  const ratingCount = reviewCount || doctor.ratingCount || 0
  
  // Render star rating
  const renderStars = (rating) => {
    const fullStars = Math.floor(rating)
    const hasHalfStar = rating % 1 >= 0.5
    const emptyStars = 5 - fullStars - (hasHalfStar ? 1 : 0)
    
    return (
      <>
        {[...Array(fullStars)].map((_, i) => (
          <i key={i} className="fas fa-star filled"></i>
        ))}
        {hasHalfStar && <i className="fas fa-star-half-alt filled"></i>}
        {[...Array(emptyStars)].map((_, i) => (
          <i key={`empty-${i}`} className="fas fa-star"></i>
        ))}
      </>
    )
  }

  return (
    <div className="content doctor-content" style={{ padding: '20px 0' }}>
      <div className="container">
      {/* Doctor Widget */}
      <div className="card doc-profile-card">
        <div className="card-body">
          <div className="doctor-widget doctor-profile-two">
            <div className="doc-info-left">
              <div className="doctor-img">
                <img src={doctorImage} className="img-fluid" alt={doctorName} />
              </div>
              <div className="doc-info-cont">
                <span className="badge doc-avail-badge"><i className="fa-solid fa-circle"></i>Available </span>
                <h4 className="doc-name">
                  {doctorName} 
                  <img src="/assets/img/icons/badge-check.svg" alt="Img" />
                  <span className="badge doctor-role-badge"><i className="fa-solid fa-circle"></i>{specialization}</span>
                </h4>
                <p>{doctor.title || 'Medical Professional'}</p>
                <p className="address-detail">
                  <span className="loc-icon"><i className="feather-map-pin"></i></span>
                  {doctor.clinics?.[0] 
                    ? `${doctor.clinics[0].address || ''}, ${doctor.clinics[0].city || ''}, ${doctor.clinics[0].state || ''}`.trim()
                    : 'Location not available'
                  }
                  <span className="view-text">( View Location )</span>
                </p>
              </div>
            </div>
            <div className="doc-info-right">
              <ul className="doctors-activities">
                <li>
                  <div className="hospital-info">
                    <span className="list-icon"><img src="/assets/img/icons/watch-icon.svg" alt="Img" /></span>
                    <p>Full Time, Online Therapy Available</p>
                  </div>
                  <ul className="sub-links">
                    <li>
                      <a 
                        href="javascript:void(0)" 
                        onClick={handleFavoriteToggle}
                        className={isFavorited ? 'favorited' : ''}
                        title={isFavorited ? 'Remove from favorites' : 'Add to favorites'}
                      >
                        <i className={`feather-heart ${isFavorited ? 'filled' : ''}`} style={{ color: isFavorited ? '#f44336' : 'inherit' }}></i>
                      </a>
                    </li>
                    <li><a href="#"><i className="feather-share-2"></i></a></li>
                    <li><a href="#"><i className="feather-link"></i></a></li>
                  </ul>
                </li>
                <li>
                  <div className="hospital-info">
                    <span className="list-icon"><img src="/assets/img/icons/thumb-icon.svg" alt="Img" /></span>
                    <p><b>{rating >= 4.5 ? '94%' : rating >= 4 ? '85%' : rating >= 3.5 ? '75%' : '60%'} </b> Recommended</p>
                  </div>
                </li>
                <li>
                  <div className="hospital-info">
                    <span className="list-icon"><img src="/assets/img/icons/building-icon.svg" alt="Img" /></span>
                    <p>{doctor.clinics?.[0]?.name || 'Clinic Name Not Available'}</p>
                  </div>
                  <h5 className="accept-text"><span><i className="feather-check"></i></span>Accepting New Patients</h5>
                </li>
                <li>
                  <div className="rating">
                    {renderStars(rating)}
                    <span>{rating.toFixed(1)}</span>
                    <a href="#review" className="d-inline-block average-rating">{ratingCount} {ratingCount === 1 ? 'Review' : 'Reviews'}</a>
                  </div>
                  <ul className="contact-doctors">
                    <li><Link to="/doctor/chat"><span><img src="/assets/img/icons/device-message2.svg" alt="Img" /></span>Chat</Link></li>
                    <li><Link to="/voice-call"><span className="bg-violet"><i className="feather-phone-forwarded"></i></span>Audio Call</Link></li>
                    <li><Link to="/video-call"><span className="bg-indigo"><i className="fa-solid fa-video"></i></span>Video Call</Link></li>
                  </ul>
                </li>
              </ul>
            </div>
          </div>
          <div className="doc-profile-card-bottom">
            <ul>
              <li>
                <span className="bg-blue"><img src="/assets/img/icons/calendar3.svg" alt="Img" /></span>
                {ratingCount > 0 ? `${ratingCount}+ Reviews` : 'No Reviews Yet'}
              </li>
              <li>
                <span className="bg-dark-blue"><img src="/assets/img/icons/bullseye.svg" alt="Img" /></span>
                {experienceYears > 0 ? `In Practice for ${experienceYears} ${experienceYears === 1 ? 'Year' : 'Years'}` : 'Experience Not Available'}
              </li>
              <li>
                <span className="bg-green"><img src="/assets/img/icons/bookmark-star.svg" alt="Img" /></span>
                {awardsCount > 0 ? `${awardsCount}+ Awards` : 'No Awards Listed'}
              </li>
            </ul>
            <div className="bottom-book-btn">
              <p>
                <span>
                  Price : 
                  {doctor.consultationFees?.clinic && doctor.consultationFees?.online 
                    ? ` $${doctor.consultationFees.clinic} - $${doctor.consultationFees.online}`
                    : doctor.consultationFees?.clinic 
                    ? ` $${doctor.consultationFees.clinic}`
                    : doctor.consultationFees?.online
                    ? ` $${doctor.consultationFees.online}`
                    : ' Contact for pricing'
                  }
                </span> for a Session
              </p>
              <div className="clinic-booking">
                <Link className="apt-btn" to={`/booking?doctorId=${doctorId}`}>Book Appointment</Link>
              </div>
            </div>
          </div>
        </div>
      </div>
      {/* /Doctor Widget */}
      
      <div className="doctors-detailed-info" style={{ padding: '0 15px' }}>
        <ul className="information-title-list">
          <li className={activeSection === 'doc_bio' ? 'active' : ''}>
            <a 
              href="#doc_bio" 
              onClick={(e) => {
                e.preventDefault()
                setActiveSection('doc_bio')
              }}
            >
              Doctor Bio
            </a>
          </li>
          <li className={activeSection === 'experience' ? 'active' : ''}>
            <a 
              href="#experience" 
              onClick={(e) => {
                e.preventDefault()
                setActiveSection('experience')
              }}
            >
              Experience
            </a>
          </li>
          <li className={activeSection === 'education' ? 'active' : ''}>
            <a 
              href="#education" 
              onClick={(e) => {
                e.preventDefault()
                setActiveSection('education')
              }}
            >
              Education
            </a>
          </li>
          <li className={activeSection === 'awards' ? 'active' : ''}>
            <a 
              href="#awards" 
              onClick={(e) => {
                e.preventDefault()
                setActiveSection('awards')
              }}
            >
              Awards
            </a>
          </li>
          <li className={activeSection === 'services' ? 'active' : ''}>
            <a 
              href="#services" 
              onClick={(e) => {
                e.preventDefault()
                setActiveSection('services')
              }}
            >
              Treatments
            </a>
          </li>
          <li className={activeSection === 'speciality' ? 'active' : ''}>
            <a 
              href="#speciality" 
              onClick={(e) => {
                e.preventDefault()
                setActiveSection('speciality')
              }}
            >
              Speciality
            </a>
          </li>
          <li className={activeSection === 'clinic' ? 'active' : ''}>
            <a 
              href="#clinic" 
              onClick={(e) => {
                e.preventDefault()
                setActiveSection('clinic')
              }}
            >
              Clinics
            </a>
          </li>
          <li className={activeSection === 'membership' ? 'active' : ''}>
            <a 
              href="#membership" 
              onClick={(e) => {
                e.preventDefault()
                setActiveSection('membership')
              }}
            >
              Memberships
            </a>
          </li>
          <li className={activeSection === 'review' ? 'active' : ''}>
            <a 
              href="#review" 
              onClick={(e) => {
                e.preventDefault()
                setActiveSection('review')
              }}
            >
              Review
            </a>
          </li>
          {doctor.products && doctor.products.length > 0 && (
            <li className={activeSection === 'products' ? 'active' : ''}>
              <a 
                href="#products" 
                onClick={(e) => {
                  e.preventDefault()
                  setActiveSection('products')
                }}
              >
                Products
              </a>
            </li>
          )}
        </ul>
        <div className="doc-information-main" style={{ padding: '20px 0' }}>
          {/* Doctor Bio */}
          <div 
            className={`doc-information-details bio-detail ${activeSection === 'doc_bio' ? '' : 'd-none'}`} 
            id="doc_bio"
          >
            <div className="detail-title">
              <h4>Doctor Bio</h4>
            </div>
            {doctor.biography ? (
              <p>{doctor.biography}</p>
            ) : (
              <p className="text-muted">Biography not available.</p>
            )}
          </div>

          {/* Experience */}
          <div 
            className={`doc-information-details ${activeSection === 'experience' ? '' : 'd-none'}`} 
            id="experience"
          >
            <div className="detail-title">
              <h4>Experience</h4>
            </div>
            {doctor.experience && Array.isArray(doctor.experience) && doctor.experience.length > 0 ? (
              <div className="experience-list">
                {doctor.experience.map((exp, index) => (
                  <div key={index} className="experience-item mb-3">
                    <h5>{exp.hospital || 'Hospital Name Not Available'}</h5>
                    {exp.designation && <p className="text-muted mb-1">{exp.designation}</p>}
                    <p className="text-muted">
                      {exp.fromYear && exp.toYear 
                        ? `${exp.fromYear} - ${exp.toYear}`
                        : exp.fromYear 
                        ? `Since ${exp.fromYear}`
                        : 'Dates not available'}
                    </p>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-muted">Experience information not available.</p>
            )}
          </div>

          {/* Education */}
          <div 
            className={`doc-information-details ${activeSection === 'education' ? '' : 'd-none'}`} 
            id="education"
          >
            <div className="detail-title">
              <h4>Education</h4>
            </div>
            {doctor.education && Array.isArray(doctor.education) && doctor.education.length > 0 ? (
              <div className="education-list">
                {doctor.education.map((edu, index) => (
                  <div key={index} className="education-item mb-3">
                    <h5>{edu.degree || 'Degree Not Available'}</h5>
                    {edu.college && <p className="text-muted mb-1">{edu.college}</p>}
                    {edu.year && <p className="text-muted">{edu.year}</p>}
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-muted">Education information not available.</p>
            )}
          </div>

          {/* Awards */}
          <div 
            className={`doc-information-details ${activeSection === 'awards' ? '' : 'd-none'}`} 
            id="awards"
          >
            <div className="detail-title">
              <h4>Awards</h4>
            </div>
            {doctor.awards && Array.isArray(doctor.awards) && doctor.awards.length > 0 ? (
              <div className="awards-list">
                {doctor.awards.map((award, index) => (
                  <div key={index} className="award-item mb-2">
                    <h5>{award.title || 'Award Title Not Available'}</h5>
                    {award.year && <p className="text-muted">{award.year}</p>}
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-muted">Awards information not available.</p>
            )}
          </div>

          {/* Services/Treatments */}
          <div 
            className={`doc-information-details ${activeSection === 'services' ? '' : 'd-none'}`} 
            id="services"
          >
            <div className="detail-title">
              <h4>Services & Treatments</h4>
            </div>
            {doctor.services && Array.isArray(doctor.services) && doctor.services.length > 0 ? (
              <div className="services-list">
                <ul className="list-unstyled">
                  {doctor.services.map((service, index) => (
                    <li key={index} className="mb-2">
                      <i className="fas fa-check-circle text-primary me-2"></i>
                      <strong>{service.name || 'Service Name'}</strong>
                      {service.price && <span className="text-muted ms-2">- ${service.price}</span>}
                    </li>
                  ))}
                </ul>
              </div>
            ) : (
              <p className="text-muted">Services information not available.</p>
            )}
          </div>

          {/* Speciality */}
          <div 
            className={`doc-information-details ${activeSection === 'speciality' ? '' : 'd-none'}`} 
            id="speciality"
          >
            <div className="detail-title">
              <h4>Speciality</h4>
            </div>
            {doctor.specialization ? (
              <div>
                <h5>{doctor.specialization.name || specialization}</h5>
                {doctor.specialization.description && (
                  <p className="text-muted">{doctor.specialization.description}</p>
                )}
              </div>
            ) : (
              <p className="text-muted">Specialization information not available.</p>
            )}
          </div>

          {/* Clinics */}
          <div 
            className={`doc-information-details ${activeSection === 'clinic' ? '' : 'd-none'}`} 
            id="clinic"
          >
            <div className="detail-title">
              <h4>Clinics</h4>
            </div>
            {doctor.clinics && Array.isArray(doctor.clinics) && doctor.clinics.length > 0 ? (
              <div className="clinics-list">
                {doctor.clinics.map((clinic, index) => (
                  <div key={index} className="clinic-item mb-4 p-3 border rounded">
                    <h5>{clinic.name || 'Clinic Name Not Available'}</h5>
                    {clinic.address && (
                      <p className="mb-1">
                        <i className="fas fa-map-marker-alt text-primary me-2"></i>
                        {clinic.address}
                        {clinic.city && `, ${clinic.city}`}
                        {clinic.state && `, ${clinic.state}`}
                        {clinic.country && `, ${clinic.country}`}
                      </p>
                    )}
                    {clinic.phone && (
                      <p className="mb-1">
                        <i className="fas fa-phone text-primary me-2"></i>
                        <a href={`tel:${clinic.phone}`}>{clinic.phone}</a>
                      </p>
                    )}
                    {clinic.lat && clinic.lng && (
                      <Link 
                        to={`/clinic-navigation?clinicId=${clinic._id}`}
                        className="btn btn-sm btn-outline-primary mt-2"
                      >
                        <i className="fas fa-directions me-1"></i> Get Directions
                      </Link>
                    )}
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-muted">Clinic information not available.</p>
            )}
          </div>

          {/* Memberships */}
          <div 
            className={`doc-information-details ${activeSection === 'membership' ? '' : 'd-none'}`} 
            id="membership"
          >
            <div className="detail-title">
              <h4>Memberships</h4>
            </div>
            {doctor.memberships && Array.isArray(doctor.memberships) && doctor.memberships.length > 0 ? (
              <div className="memberships-list">
                <ul className="list-unstyled">
                  {doctor.memberships.map((membership, index) => (
                    <li key={index} className="mb-2">
                      <i className="fas fa-certificate text-primary me-2"></i>
                      {membership.name || 'Membership Name Not Available'}
                    </li>
                  ))}
                </ul>
              </div>
            ) : (
              <p className="text-muted">Membership information not available.</p>
            )}
          </div>

          {/* Reviews */}
          <div 
            className={`doc-information-details ${activeSection === 'review' ? '' : 'd-none'}`} 
            id="review"
          >
            <div className="detail-title">
              <h4>Reviews ({reviewCount})</h4>
            </div>
            {reviewsLoading ? (
              <div className="text-center py-3">
                <div className="spinner-border spinner-border-sm text-primary" role="status">
                  <span className="visually-hidden">Loading...</span>
                </div>
              </div>
            ) : reviews && reviews.length > 0 ? (
              <div className="reviews-list">
                {reviews.map((review) => (
                  <div key={review._id} className="review-item mb-4 p-3 border rounded">
                    <div className="d-flex align-items-start mb-2">
                      <div className="reviewer-info me-3">
                        <img 
                          src={review.patientId?.profileImage || '/assets/img/patients/patient.jpg'} 
                          alt={review.patientId?.fullName || 'Patient'}
                          className="rounded-circle"
                          style={{ width: '50px', height: '50px', objectFit: 'cover' }}
                        />
                      </div>
                      <div className="flex-grow-1">
                        <h6 className="mb-1">{review.patientId?.fullName || 'Anonymous'}</h6>
                        <div className="rating mb-2">
                          {renderStars(review.rating || 0)}
                          <span className="ms-2">{review.rating?.toFixed(1) || '0.0'}</span>
                        </div>
                        {review.comment && (
                          <p className="mb-0">{review.comment}</p>
                        )}
                        {review.createdAt && (
                          <small className="text-muted">
                            {new Date(review.createdAt).toLocaleDateString()}
                          </small>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-muted">No reviews yet. Be the first to review this doctor!</p>
            )}
          </div>

          {/* Products */}
          {doctor.products && Array.isArray(doctor.products) && doctor.products.length > 0 && (
            <div 
              className={`doc-information-details ${activeSection === 'products' ? '' : 'd-none'}`} 
              id="products"
            >
              <div className="detail-title">
                <h4>Products ({doctor.products.length})</h4>
              </div>
              <div className="row">
                {doctor.products.map((product) => {
                  const productImage = product.images && product.images.length > 0 
                    ? product.images[0] 
                    : '/assets/img/products/product.jpg'
                  const productPrice = product.discountPrice || product.price || 0
                  const originalPrice = product.discountPrice ? product.price : null
                  
                  return (
                    <div key={product._id} className="col-md-4 mb-3">
                      <div className="card">
                        <Link to={`/product-description?id=${product._id}`}>
                          <img 
                            src={productImage} 
                            className="card-img-top" 
                            alt={product.name}
                            style={{ height: '200px', objectFit: 'cover' }}
                          />
                        </Link>
                        <div className="card-body">
                          <h6 className="card-title">
                            <Link to={`/product-description?id=${product._id}`}>
                              {product.name}
                            </Link>
                          </h6>
                          <div className="d-flex align-items-center justify-content-between">
                            <div>
                              <span className="price">${productPrice.toFixed(2)}</span>
                              {originalPrice && (
                                <span className="price-strike ms-2">${originalPrice.toFixed(2)}</span>
                              )}
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  )
                })}
              </div>
            </div>
          )}
        </div>
      </div>
      </div>
    </div>
  )
}

export default DoctorProfile

