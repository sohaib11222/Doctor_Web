import { useEffect, useState, useMemo, useRef } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useQuery } from '@tanstack/react-query'
import * as doctorApi from '../api/doctor'
import * as specializationApi from '../api/specialization'
import * as reviewsApi from '../api/reviews'

const Index = () => {
  const navigate = useNavigate()
  const [searchTerm, setSearchTerm] = useState('')
  const [location, setLocation] = useState('')
  const [selectedSpecialization, setSelectedSpecialization] = useState('')
  const carouselInstances = useRef({})

  // Fetch specializations
  const { data: specializationsData, isLoading: specializationsLoading } = useQuery({
    queryKey: ['specializations'],
    queryFn: () => specializationApi.getAllSpecializations()
  })

  // Fetch featured doctors (static, no filters - just featured doctors for home page)
  const { data: doctorsData, isLoading: doctorsLoading } = useQuery({
    queryKey: ['featuredDoctors'],
    queryFn: () => doctorApi.listDoctors({ limit: 8, page: 1 })
  })

  // Fetch all doctors for stats
  const { data: allDoctorsData } = useQuery({
    queryKey: ['allDoctors'],
    queryFn: () => doctorApi.listDoctors({ limit: 1, page: 1 })
  })

  // Fetch recent reviews for testimonials (we'll get reviews from multiple doctors)
  const { data: featuredDoctorsForReviews } = useQuery({
    queryKey: ['doctorsForReviews'],
    queryFn: () => doctorApi.listDoctors({ limit: 4, page: 1 }),
    enabled: !!doctorsData
  })

  // Extract data
  const specializations = useMemo(() => {
    if (!specializationsData) return []
    return Array.isArray(specializationsData) ? specializationsData : (specializationsData.data || [])
  }, [specializationsData])

  const doctors = useMemo(() => {
    if (!doctorsData) return []
    const responseData = doctorsData.data || doctorsData
    return responseData.doctors || responseData.data || responseData || []
  }, [doctorsData])

  // Calculate stats
  const stats = useMemo(() => {
    const allDoctorsResponse = allDoctorsData?.data || allDoctorsData
    const totalDoctors = allDoctorsResponse?.pagination?.total || allDoctorsResponse?.total || doctors.length || 500
    const totalSpecializations = specializations.length || 18
    const totalBookings = 30000 // This would come from appointments API if available
    const totalHospitals = 97 // This would come from clinics/pharmacies API if available
    const totalLabTests = 317 // This would come from products/services API if available

    return {
      doctors: totalDoctors,
      specializations: totalSpecializations,
      bookings: totalBookings,
      hospitals: totalHospitals,
      labTests: totalLabTests
    }
  }, [allDoctorsData, specializations.length, doctors.length])

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

  // Get default specialization image based on index
  const getSpecializationImage = (index) => {
    const images = [
      'speciality-01.jpg', 'speciality-02.jpg', 'speciality-03.jpg', 'speciality-04.jpg',
      'speciality-05.jpg', 'speciality-06.jpg', 'speciality-07.jpg', 'speciality-08.jpg'
    ]
    return `/assets/img/specialities/${images[index % images.length]}`
  }

  const getSpecializationIcon = (index) => {
    const icons = [
      'speciality-icon-01.svg', 'speciality-icon-02.svg', 'speciality-icon-03.svg', 'speciality-icon-04.svg',
      'speciality-icon-05.svg', 'speciality-icon-06.svg', 'speciality-icon-07.svg', 'speciality-icon-08.svg'
    ]
    return `/assets/img/specialities/${icons[index % icons.length]}`
  }

  // Format doctor data for display
  const formatDoctors = useMemo(() => {
    return doctors.slice(0, 8).map((doctor) => {
      const userId = doctor.userId || {}
      const specialization = doctor.specialization || {}
      const clinic = doctor.clinics?.[0] || {}
      
      return {
        id: doctor._id || doctor.userId?._id,
        name: userId.fullName || doctor.fullName || 'Dr. Unknown',
        specialty: specialization.name || 'General',
        location: clinic.city ? `${clinic.city}${clinic.state ? `, ${clinic.state}` : ''}` : 'Location not available',
        time: '30 Min', // Default, can be fetched from availability
        fee: clinic.consultationFee ? `$${clinic.consultationFee}` : '$500',
        rating: doctor.ratingAvg || 0,
        image: normalizeImageUrl(userId.profileImage || doctor.profileImage) || '/assets/img/doctor-grid/doctor-grid-01.jpg',
        available: true,
        doctorId: doctor._id || doctor.userId?._id
      }
    })
  }, [doctors])

  // Fetch reviews for testimonials (we'll use a sample approach)
  const testimonials = [
    { id: 1, name: 'Deny Hendrawan', location: 'United States', image: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=200&h=200&fit=crop&auto=format', title: 'Nice Treatment', text: 'I had a wonderful experience the staff was friendly and attentive, and Dr. Smith took the time to explain everything clearly.' },
    { id: 2, name: 'Johnson DWayne', location: 'United States', image: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=200&h=200&fit=crop&auto=format', title: 'Good Hospitability', text: 'Genuinely cares about his patients. He helped me understand my condition and worked with me to create a plan.' },
    { id: 3, name: 'Rayan Smith', location: 'United States', image: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=200&h=200&fit=crop&auto=format', title: 'Nice Treatment', text: 'I had a great experience with Dr. Chen. She was not only professional but also made me feel comfortable discussing.' },
    { id: 4, name: 'Sofia Doe', location: 'United States', image: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=200&h=200&fit=crop&auto=format', title: 'Excellent Service', text: 'I had a wonderful experience the staff was friendly and attentive, and Dr. Smith took the time to explain everything clearly.' },
  ]

  const companies = [
    'company-01.svg', 'company-02.svg', 'company-03.svg', 'company-04.svg',
    'company-05.svg', 'company-06.svg', 'company-07.svg', 'company-08.svg'
  ]

  // Destroy carousel instance safely
  const destroyCarousel = (selector) => {
    if (typeof window !== 'undefined' && window.$) {
      try {
        const $el = $(selector)
        if ($el.length && $el.data('owl.carousel')) {
          $el.trigger('destroy.owl.carousel').removeClass('owl-carousel owl-loaded')
          $el.find('.owl-stage-outer').children().unwrap()
        }
      } catch (error) {
        console.warn('Error destroying carousel:', error)
      }
    }
  }

  // Initialize carousel safely
  const initCarousel = (selector, options) => {
    if (typeof window !== 'undefined' && window.$) {
      try {
        const $el = $(selector)
        if ($el.length) {
          // Destroy existing instance first
          destroyCarousel(selector)
          
          // Wait a bit before re-initializing
          setTimeout(() => {
            if ($el.length && !$el.data('owl.carousel')) {
              $el.owlCarousel(options)
              carouselInstances.current[selector] = true
            }
          }, 50)
        }
      } catch (error) {
        console.warn('Error initializing carousel:', error)
      }
    }
  }

  // Initialize AOS animations (only once)
  useEffect(() => {
    if (typeof window !== 'undefined') {
      import('aos').then((AOS) => {
        AOS.init({
          duration: 1000,
          once: true,
        })
      })
    }
  }, [])

  // Initialize carousels when data is ready (but not on every search change)
  useEffect(() => {
    if (typeof window !== 'undefined' && window.$) {
      const timer = setTimeout(() => {
        // Speciality Slider - only initialize once
        if (specializations.length > 0 && !carouselInstances.current['.spciality-slider']) {
          initCarousel('.spciality-slider', {
            loop: specializations.length > 5,
        margin: 30,
        nav: true,
        dots: false,
        responsive: {
          0: { items: 1 },
          600: { items: 3 },
          1000: { items: 5 }
        }
      })
        }

        // Testimonials Slider - only initialize once
        if (!carouselInstances.current['.testimonials-slider']) {
          initCarousel('.testimonials-slider', {
        loop: true,
        margin: 30,
        nav: true,
        dots: false,
        responsive: {
          0: { items: 1 },
          600: { items: 2 },
          1000: { items: 3 }
        }
      })
        }

        // Company Slider - only initialize once
        if (!carouselInstances.current['.company-slider']) {
          initCarousel('.company-slider', {
        loop: true,
        margin: 30,
        nav: false,
        dots: false,
        autoplay: true,
        autoplayTimeout: 3000,
        responsive: {
          0: { items: 2 },
          600: { items: 4 },
          1000: { items: 6 }
        }
      })
    }
      }, 200)

      return () => clearTimeout(timer)
  }
  }, [specializations.length])

  // Initialize doctors slider once when data is ready
  useEffect(() => {
    if (typeof window !== 'undefined' && window.$ && formatDoctors.length > 0) {
      const timer = setTimeout(() => {
        if (!carouselInstances.current['.doctors-slider']) {
          initCarousel('.doctors-slider', {
            loop: formatDoctors.length > 4,
            margin: 30,
            nav: true,
            dots: false,
            responsive: {
              0: { items: 1 },
              600: { items: 2 },
              1000: { items: 4 }
            }
          })
        }
      }, 300)

      return () => clearTimeout(timer)
    }
  }, [formatDoctors.length])

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      if (typeof window !== 'undefined' && window.$) {
        destroyCarousel('.spciality-slider')
        destroyCarousel('.doctors-slider')
        destroyCarousel('.testimonials-slider')
        destroyCarousel('.company-slider')
      }
    }
  }, [])

  const handleSearch = (e) => {
    e.preventDefault()
    // Navigate to search page with search parameters
    const params = new URLSearchParams()
    if (searchTerm.trim()) params.set('search', searchTerm.trim())
    if (location.trim()) params.set('location', location.trim())
    if (selectedSpecialization) params.set('specialization', selectedSpecialization)
    navigate(`/search-2?${params.toString()}`)
  }

  return (
    <>
      {/* Home Banner */}
      <section className="banner-section banner-sec-one">
        <div className="container">
          <div className="row align-items-center">
            <div className="col-lg-7">
              <div className="banner-content aos" data-aos="fade-up">
                <div className="rating-appointment d-inline-flex align-items-center gap-2">
                  <div className="avatar-list-stacked avatar-group-lg">
                    <span className="avatar avatar-rounded">
                      <img className="border border-white" src="https://images.unsplash.com/photo-1612349317150-e413f6a5b16d?w=100&h=100&fit=crop&auto=format" alt="img" loading="lazy" onError={(e) => { e.target.onerror = null; e.target.src = 'https://images.unsplash.com/photo-1559839734-2b71ea197ec2?w=100&h=100&fit=crop&auto=format' }} />
                    </span>
                    <span className="avatar avatar-rounded">
                      <img className="border border-white" src="https://images.unsplash.com/photo-1559839734-2b71ea197ec2?w=100&h=100&fit=crop&auto=format" alt="img" loading="lazy" onError={(e) => { e.target.onerror = null; e.target.src = 'https://images.unsplash.com/photo-1612349317150-e413f6a5b16d?w=100&h=100&fit=crop&auto=format' }} />
                    </span>
                    <span className="avatar avatar-rounded">
                      <img src="https://images.unsplash.com/photo-1594824476968-48df8a5ad053?w=100&h=100&fit=crop&auto=format" alt="img" loading="lazy" onError={(e) => { e.target.onerror = null; e.target.src = 'https://images.unsplash.com/photo-1612349317150-e413f6a5b16d?w=100&h=100&fit=crop&auto=format' }} />
                    </span>
                  </div>
                  <div className="me-2">
                    <h6>5K+ Appointments</h6>
                    <div className="d-flex align-items-center">
                      <div className="d-flex align-items-center">
                        <i className="fa-solid fa-star text-orange me-1"></i>
                        <i className="fa-solid fa-star text-orange me-1"></i>
                        <i className="fa-solid fa-star text-orange me-1"></i>
                        <i className="fa-solid fa-star text-orange me-1"></i>
                        <i className="fa-solid fa-star text-orange me-1"></i>
                      </div>
                      <p>5.0 Ratings</p>
                    </div>
                  </div>
                </div>
                <h1 className="display-5">
                  Discover Health: Find Your Trusted{' '}
                  <span className="banner-icon">
                    <img src="/assets/img/icons/video.svg" alt="img" />
                  </span>{' '}
                  <span className="text-gradient">Doctors</span> Today
                </h1>
                <div className="search-box-one aos" data-aos="fade-up">
                  <form onSubmit={handleSearch}>
                    <div className="search-input search-line">
                      <i className="isax isax-hospital5 bficon"></i>
                      <div className="mb-0">
                        <input 
                          type="text" 
                          className="form-control" 
                          placeholder="Search doctors, clinics, hospitals, etc" 
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
                      <button className="btn btn-primary" type="submit">
                        <i className="isax isax-search-normal5 me-2"></i>Search
                      </button>
                    </div>
                  </form>
                </div>
              </div>
            </div>
            <div className="col-lg-5">
              <div className="banner-img aos" data-aos="fade-up">
                <img src="/assets/img/banner/banner-doctor.svg" className="img-fluid" alt="patient-image" />
                <div className="banner-appointment">
                  <h6>1K</h6>
                  <p>Appointments <span className="d-block">Completed</span></p>
                </div>
                <div className="banner-patient">
                  <div className="avatar-list-stacked avatar-group-sm">
                    <span className="avatar avatar-rounded">
                      <img src="https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=80&h=80&fit=crop&auto=format" alt="img" loading="lazy" onError={(e) => { e.target.onerror = null; e.target.src = 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=80&h=80&fit=crop&auto=format' }} />
                    </span>
                    <span className="avatar avatar-rounded">
                      <img src="https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=80&h=80&fit=crop&auto=format" alt="img" loading="lazy" onError={(e) => { e.target.onerror = null; e.target.src = 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=80&h=80&fit=crop&auto=format' }} />
                    </span>
                    <span className="avatar avatar-rounded">
                      <img src="https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=80&h=80&fit=crop&auto=format" alt="img" loading="lazy" onError={(e) => { e.target.onerror = null; e.target.src = 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=80&h=80&fit=crop&auto=format' }} />
                    </span>
                  </div>
                  <p>15K+</p>
                  <p>Satisfied Patients</p>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div className="banner-bg">
          <img src="/assets/img/bg/banner-bg-02.png" alt="img" className="banner-bg-01" />
          <img src="/assets/img/bg/banner-bg-03.png" alt="img" className="banner-bg-02" />
          <img src="/assets/img/bg/banner-bg-04.png" alt="img" className="banner-bg-03" />
          <img src="/assets/img/bg/banner-bg-05.png" alt="img" className="banner-bg-04" />
          <img src="/assets/img/bg/banner-icon-01.svg" alt="img" className="banner-bg-05" />
          <img src="/assets/img/bg/banner-icon-01.svg" alt="img" className="banner-bg-06" />
        </div>
      </section>
      {/* /Home Banner */}

      {/* List */}
      <div className="list-section">
        <div className="container">
          <div className="list-card card mb-0">
            <div className="card-body">
              <div className="d-flex align-items-center justify-content-center justify-content-xl-between flex-wrap gap-4 list-wraps">
                <Link to="/booking" className="list-item aos" data-aos="fade-up">
                  <div className="list-icon bg-secondary">
                    <img src="/assets/img/icons/list-icon-01.svg" alt="img" />
                  </div>
                  <h6>Book Appointment</h6>
                </Link>
                <Link to="/doctor-grid" className="list-item aos" data-aos="fade-up">
                  <div className="list-icon bg-primary">
                    <img src="/assets/img/icons/list-icon-02.svg" alt="img" />
                  </div>
                  <h6>Talk to Doctors</h6>
                </Link>
                <Link to="/hospitals" className="list-item aos" data-aos="fade-up">
                  <div className="list-icon bg-pink">
                    <img src="/assets/img/icons/list-icon-03.svg" alt="img" />
                  </div>
                  <h6>Hospitals & Clinics</h6>
                </Link>
                <Link to="/index-3" className="list-item aos" data-aos="fade-up">
                  <div className="list-icon bg-cyan">
                    <img src="/assets/img/icons/list-icon-04.svg" alt="img" />
                  </div>
                  <h6>Healthcare</h6>
                </Link>
                <Link to="/index-13" className="list-item aos" data-aos="fade-up">
                  <div className="list-icon bg-purple">
                    <img src="/assets/img/icons/list-icon-05.svg" alt="img" />
                  </div>
                  <h6>Medicine & Supplies</h6>
                </Link>
                <Link to="/index-12" className="list-item aos" data-aos="fade-up">
                  <div className="list-icon bg-orange">
                    <img src="/assets/img/icons/list-icon-06.svg" alt="img" />
                  </div>
                  <h6>Lab Testing</h6>
                </Link>
                <Link to="/index-13" className="list-item aos" data-aos="fade-up">
                  <div className="list-icon bg-teal">
                    <img src="/assets/img/icons/list-icon-07.svg" alt="img" />
                  </div>
                  <h6>Home Care</h6>
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
      {/* /List */}

      {/* Speciality Section */}
      <section className="speciality-section">
        <div className="container">
          <div className="section-header sec-header-one text-center aos" data-aos="fade-up">
            <span className="badge badge-primary">Top Specialties</span>
            <h2>Highlighting the Care & Support</h2>
          </div>
          <div className="owl-carousel spciality-slider aos" data-aos="fade-up">
            {specializationsLoading ? (
              <div className="text-center py-5">
                <div className="spinner-border text-primary" role="status">
                  <span className="sr-only">Loading...</span>
                </div>
              </div>
            ) : specializations.length > 0 ? (
              specializations.slice(0, 8).map((specialization, index) => (
                <div key={specialization._id || specialization.id || index} className="spaciality-item">
                <div className="spaciality-img">
                    <img src={getSpecializationImage(index)} alt={specialization.name} />
                  <span className="spaciality-icon">
                      <img src={getSpecializationIcon(index)} alt={specialization.name} />
                  </span>
                </div>
                <h6>
                    <Link to={`/search-2?specialization=${specialization._id || specialization.id}`}>
                      {specialization.name}
                    </Link>
                </h6>
                  <p className="mb-0">{specialization.doctorCount || '0'} Doctors</p>
              </div>
              ))
            ) : (
              <div className="text-center py-5">
                <p>No specializations available</p>
              </div>
            )}
          </div>
          <div className="spciality-nav nav-bottom owl-nav"></div>
        </div>
      </section>
      {/* /Speciality Section */}

      {/* Doctor Section */}
      <section className="doctor-section">
        <div className="container">
          <div className="section-header sec-header-one text-center aos" data-aos="fade-up">
            <span className="badge badge-primary">Featured Doctors</span>
            <h2>Our Highlighted Doctors</h2>
          </div>
          <div className="doctors-slider owl-carousel aos" data-aos="fade-up">
            {doctorsLoading ? (
              <div className="text-center py-5">
                <div className="spinner-border text-primary" role="status">
                  <span className="sr-only">Loading...</span>
                </div>
              </div>
            ) : formatDoctors.length > 0 ? (
              formatDoctors.map((doctor) => (
              <div key={doctor.id} className="card">
                <div className="card-img card-img-hover">
                    <Link to={`/doctor-profile?id=${doctor.doctorId}`}>
                      <img 
                        src={doctor.image} 
                        alt={doctor.name}
                        onError={(e) => {
                          e.target.src = '/assets/img/doctor-grid/doctor-grid-01.jpg'
                        }}
                      />
                  </Link>
                  <div className="grid-overlay-item d-flex align-items-center justify-content-between">
                    <span className="badge bg-orange">
                        <i className="fa-solid fa-star me-1"></i>{doctor.rating.toFixed(1)}
                    </span>
                    <a href="javascript:void(0)" className="fav-icon">
                      <i className="fa fa-heart"></i>
                    </a>
                  </div>
                </div>
                <div className="card-body p-0">
                  <div className={`d-flex active-bar align-items-center justify-content-between p-3`}>
                    <a href="#" className="text-indigo fw-medium fs-14">{doctor.specialty}</a>
                    <span className="badge bg-success-light d-inline-flex align-items-center">
                      <i className="fa-solid fa-circle fs-5 me-1"></i>
                      Available
                    </span>
                  </div>
                  <div className="p-3 pt-0">
                    <div className="doctor-info-detail mb-3 pb-3">
                      <h3 className="mb-1">
                          <Link to={`/doctor-profile?id=${doctor.doctorId}`}>{doctor.name}</Link>
                      </h3>
                      <div className="d-flex align-items-center">
                        <p className="d-flex align-items-center mb-0 fs-14">
                          <i className="isax isax-location me-2"></i>{doctor.location}
                        </p>
                        <i className="fa-solid fa-circle fs-5 text-primary mx-2 me-1"></i>
                        <span className="fs-14 fw-medium">{doctor.time}</span>
                      </div>
                    </div>
                    <div className="d-flex align-items-center justify-content-between">
                      <div>
                        <p className="mb-1">Consultation Fees</p>
                        <h3 className="text-orange">{doctor.fee}</h3>
                      </div>
                        <Link to={`/booking?doctorId=${doctor.doctorId}`} className="btn btn-md btn-dark inline-flex align-items-center rounded-pill">
                        <i className="isax isax-calendar-1 me-2"></i>
                        Book Now
                      </Link>
                    </div>
                  </div>
                </div>
              </div>
              ))
            ) : (
              <div className="text-center py-5">
                <p>No doctors available at the moment.</p>
              </div>
            )}
          </div>
          <div className="doctor-nav nav-bottom owl-nav"></div>
        </div>
      </section>
      {/* /Doctor Section */}

      {/* Services Section */}
      <section className="services-section aos" data-aos="fade-up">
        <div className="horizontal-slide d-flex" data-direction="right" data-speed="slow">
          <div className="slide-list d-flex gap-4">
            <div className="services-slide">
              <h6><a href="javascript:void(0);">Multi Speciality Treatments & Doctors</a></h6>
            </div>
            <div className="services-slide">
              <h6><a href="javascript:void(0);">Lab Testing Services</a></h6>
            </div>
            <div className="services-slide">
              <h6><a href="javascript:void(0);">Medecines & Supplies</a></h6>
            </div>
            <div className="services-slide">
              <h6><a href="javascript:void(0);">Hospitals & Clinics</a></h6>
            </div>
            <div className="services-slide">
              <h6><a href="javascript:void(0);">Health Care Services</a></h6>
            </div>
            <div className="services-slide">
              <h6><a href="javascript:void(0);">Talk to Doctors</a></h6>
            </div>
            <div className="services-slide">
              <h6><a href="javascript:void(0);">Home Care Services</a></h6>
            </div>
          </div>
        </div>
      </section>
      {/* /Services Section */}

      {/* Reasons Section */}
      <section className="reason-section">
        <div className="container">
          <div className="section-header sec-header-one text-center aos" data-aos="fade-up">
            <span className="badge badge-primary">Why Book With Us</span>
            <h2>Compelling Reasons to Choose</h2>
          </div>
          <div className="row row-gap-4 justify-content-center">
            <div className="col-lg-4 col-md-6">
              <div className="reason-item aos" data-aos="fade-up">
                <h6 className="mb-2">
                  <i className="isax isax-tag-user5 text-orange me-2"></i>Follow-Up Care
                </h6>
                <p className="fs-14 mb-0">We ensure continuity of care through regular follow-ups and communication, helping you stay on track with health goals.</p>
              </div>
            </div>
            <div className="col-lg-4 col-md-6">
              <div className="reason-item aos" data-aos="fade-up">
                <h6 className="mb-2">
                  <i className="isax isax-voice-cricle text-purple me-2"></i>Patient-Centered Approach
                </h6>
                <p className="fs-14 mb-0">We prioritize your comfort and preferences, tailoring our services to meet your individual needs and Care from Our Experts</p>
              </div>
            </div>
            <div className="col-lg-4 col-md-6">
              <div className="reason-item aos" data-aos="fade-up">
                <h6 className="mb-2">
                  <i className="isax isax-wallet-add-15 text-cyan me-2"></i>Convenient Access
                </h6>
                <p className="fs-14 mb-0">Easily book appointments online or through our dedicated customer service team, with flexible hours to fit your schedule.</p>
              </div>
            </div>
          </div>
        </div>
      </section>
      {/* /Reasons Section */}

      {/* Bookus Section */}
      <section className="bookus-section bg-dark">
        <div className="container">
          <div className="row align-items-center row-gap-4">
            <div className="col-lg-6">
              <div className="bookus-img">
                <div className="row g-3">
                  <div className="col-md-12 aos" data-aos="fade-up">
                    <img src="https://images.unsplash.com/photo-1576091160399-112ba8d25d1f?w=600&h=400&fit=crop&auto=format" alt="img" className="img-fluid" loading="lazy" onError={(e) => { e.target.onerror = null; e.target.src = 'https://images.unsplash.com/photo-1551601651-2a8555f1a136?w=600&h=400&fit=crop&auto=format' }} />
                  </div>
                  <div className="col-sm-6 aos" data-aos="fade-up">
                    <img src="https://images.unsplash.com/photo-1551601651-2a8555f1a136?w=400&h=300&fit=crop&auto=format" alt="img" className="img-fluid" loading="lazy" onError={(e) => { e.target.onerror = null; e.target.src = 'https://images.unsplash.com/photo-1519494026892-80bbd2d6fd0d?w=400&h=300&fit=crop&auto=format' }} />
                  </div>
                  <div className="col-sm-6 aos" data-aos="fade-up">
                    <img src="https://images.unsplash.com/photo-1519494026892-80bbd2d6fd0d?w=400&h=300&fit=crop&auto=format" alt="img" className="img-fluid" loading="lazy" onError={(e) => { e.target.onerror = null; e.target.src = 'https://images.unsplash.com/photo-1576091160399-112ba8d25d1f?w=400&h=300&fit=crop&auto=format' }} />
                  </div>
                </div>
              </div>
            </div>
            <div className="col-lg-6">
              <div className="section-header sec-header-one mb-2 aos" data-aos="fade-up">
                <span className="badge badge-primary">Why Book With Us</span>
                <h2 className="text-white">
                  We are committed to understanding your <span className="text-primary-gradient">unique needs and delivering care.</span>
                </h2>
              </div>
              <p className="text-light mb-4">As a trusted healthcare provider in our community, we are passionate about promoting health and wellness beyond the clinic. We actively engage in community outreach programs, health fairs, and educational workshop.</p>
              <div className="faq-info aos" data-aos="fade-up">
                <div className="accordion" id="faq-details">
                  <div className="accordion-item">
                    <h2 className="accordion-header" id="headingOne">
                      <a href="javascript:void(0);" className="accordion-button" data-bs-toggle="collapse" data-bs-target="#collapseOne">
                        01 . Our Vision
                      </a>
                    </h2>
                    <div id="collapseOne" className="accordion-collapse collapse show">
                      <div className="accordion-body">
                        <div className="accordion-content">
                          <p>We envision a community where everyone has access to high-quality healthcare and the resources they need to lead healthy, fulfilling lives.</p>
                        </div>
                      </div>
                    </div>
                  </div>
                  <div className="accordion-item">
                    <h2 className="accordion-header" id="headingTwo">
                      <a href="javascript:void(0);" className="accordion-button collapsed" data-bs-toggle="collapse" data-bs-target="#collapseTwo">
                        02 . Our Mission
                      </a>
                    </h2>
                    <div id="collapseTwo" className="accordion-collapse collapse">
                      <div className="accordion-body">
                        <div className="accordion-content">
                          <p>We envision a community where everyone has access to high-quality healthcare and the resources they need to lead healthy, fulfilling lives.</p>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div className="bookus-sec">
            <div className="row g-4">
              <div className="col-lg-3">
                <div className="book-item">
                  <div className="book-icon bg-primary">
                    <i className="isax isax-search-normal5"></i>
                  </div>
                  <div className="book-info">
                    <h6 className="text-white mb-2">Search For Doctors</h6>
                    <p className="fs-14 text-light">Search for a doctor based on specialization, location, or availability for your Treatements</p>
                  </div>
                  <div className="way-icon">
                    <img src="/assets/img/icons/way-icon.svg" alt="img" />
                  </div>
                </div>
              </div>
              <div className="col-lg-3">
                <div className="book-item">
                  <div className="book-icon bg-orange">
                    <i className="isax isax-security-user5"></i>
                  </div>
                  <div className="book-info">
                    <h6 className="text-white mb-2">Check Doctor Profile</h6>
                    <p className="fs-14 text-light">Explore detailed doctor profiles on our platform to make informed healthcare decisions.</p>
                  </div>
                  <div className="way-icon">
                    <img src="/assets/img/icons/way-icon.svg" alt="img" />
                  </div>
                </div>
              </div>
              <div className="col-lg-3">
                <div className="book-item">
                  <div className="book-icon bg-cyan">
                    <i className="isax isax-calendar5"></i>
                  </div>
                  <div className="book-info">
                    <h6 className="text-white mb-2">Schedule Appointment</h6>
                    <p className="fs-14 text-light">After choose your preferred doctor, select a convenient time slot, & confirm your appointment.</p>
                  </div>
                  <div className="way-icon">
                    <img src="/assets/img/icons/way-icon.svg" alt="img" />
                  </div>
                </div>
              </div>
              <div className="col-lg-3">
                <div className="book-item">
                  <div className="book-icon bg-indigo">
                    <i className="isax isax-blend5"></i>
                  </div>
                  <div className="book-info">
                    <h6 className="text-white mb-2">Get Your Solution</h6>
                    <p className="fs-14 text-light">Discuss your health concerns with the doctor and receive the personalized advice & with solution.</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
      {/* /Bookus Section */}

      {/* Testimonial Section */}
      <section className="testimonial-section-one">
        <div className="container">
          <div className="section-header sec-header-one text-center aos" data-aos="fade-up">
            <span className="badge badge-primary">Testimonials</span>
            <h2>15k Users Trust myDoctor Worldwide</h2>
          </div>
          <div className="owl-carousel testimonials-slider aos" data-aos="fade-up">
            {testimonials.map((testimonial) => (
              <div key={testimonial.id} className="card shadow-none mb-0">
                <div className="card-body">
                  <div className="d-flex align-items-center mb-4">
                    <div className="rating d-flex">
                      <i className="fa-solid fa-star filled me-1"></i>
                      <i className="fa-solid fa-star filled me-1"></i>
                      <i className="fa-solid fa-star filled me-1"></i>
                      <i className="fa-solid fa-star filled me-1"></i>
                      <i className="fa-solid fa-star filled"></i>
                    </div>
                    <span>
                      <img src="/assets/img/icons/quote-icon.svg" alt="img" />
                    </span>
                  </div>
                  <h6 className="fs-16 fw-medium mb-2">{testimonial.title}</h6>
                  <p>{testimonial.text}</p>
                  <div className="d-flex align-items-center">
                    <a href="javascript:void(0);" className="avatar avatar-lg">
                      <img src={testimonial.image} className="rounded-circle" alt="img" loading="lazy" onError={(e) => { e.target.onerror = null; e.target.src = 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=200&h=200&fit=crop&auto=format' }} />
                    </a>
                    <div className="ms-2">
                      <h6 className="mb-1"><a href="javascript:void(0);">{testimonial.name}</a></h6>
                      <p className="fs-14 mb-0">{testimonial.location}</p>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
          <div className="testimonial-counter">
            <div className="row row-cols-1 row-cols-sm-2 row-cols-md-3 row-cols-lg-5 row-gap-4">
              <div className="counter-item text-center aos" data-aos="fade-up">
                <h6 className="display-6"><span className="count-digit">{stats.doctors}</span>+</h6>
                <p>Doctors Available</p>
              </div>
              <div className="counter-item text-center aos" data-aos="fade-up">
                <h6 className="display-6 secondary-count"><span className="count-digit">{stats.specializations}</span>+</h6>
                <p>Specialities</p>
              </div>
              <div className="counter-item text-center aos" data-aos="fade-up">
                <h6 className="display-6 purple-count"><span className="count-digit">{Math.floor(stats.bookings / 1000)}</span>K</h6>
                <p>Bookings Done</p>
              </div>
              <div className="counter-item text-center aos" data-aos="fade-up">
                <h6 className="display-6 pink-count"><span className="count-digit">{stats.hospitals}</span>+</h6>
                <p>Hospitals & Clinic</p>
              </div>
              <div className="counter-item text-center aos" data-aos="fade-up">
                <h6 className="display-6 warning-count"><span className="count-digit">{stats.labTests}</span>+</h6>
                <p>Lab Tests Available</p>
              </div>
            </div>
          </div>
        </div>
      </section>
      {/* /Testimonial Section */}

      {/* Company Section */}
      <section className="company-section bg-dark aos" data-aos="fade-up">
        <div className="container">
          <div className="section-header sec-header-one text-center">
            <h6 className="text-light">Trusted by 5+ million people at companies like</h6>
          </div>
          <div className="owl-carousel company-slider">
            {companies.map((company, index) => (
              <div key={index}>
                <img src={`/assets/img/company/${company}`} alt="img" />
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <section className="faq-section-one">
        <div className="container">
          <div className="section-header sec-header-one text-center aos" data-aos="fade-up">
            <span className="badge badge-primary">FAQ'S</span>
            <h2>Your Questions are Answered</h2>
          </div>
          <div className="row">
            <div className="col-md-10 mx-auto">
              <div className="faq-info aos" data-aos="fade-up">
                <div className="accordion" id="faq-details">
                  <div className="accordion-item">
                    <h2 className="accordion-header" id="headingOne">
                      <a href="javascript:void(0);" className="accordion-button" data-bs-toggle="collapse" data-bs-target="#collapseOne">
                        How do I book an appointment with a doctor?
                      </a>
                    </h2>
                    <div id="collapseOne" className="accordion-collapse collapse show">
                      <div className="accordion-body">
                        <div className="accordion-content">
                          <p>Yes, simply visit our website and log in or create an account. Search for a doctor based on specialization, location, or availability & confirm your booking.</p>
                        </div>
                      </div>
                    </div>
                  </div>
                  <div className="accordion-item">
                    <h2 className="accordion-header" id="headingTwo">
                      <a href="javascript:void(0);" className="accordion-button collapsed" data-bs-toggle="collapse" data-bs-target="#collapseTwo">
                        Can I request a specific doctor when booking my appointment?
                      </a>
                    </h2>
                    <div id="collapseTwo" className="accordion-collapse collapse">
                      <div className="accordion-body">
                        <div className="accordion-content">
                          <p>Yes, you can usually request a specific doctor when booking your appointment, though availability may vary based on their schedule.</p>
                        </div>
                      </div>
                    </div>
                  </div>
                  <div className="accordion-item">
                    <h2 className="accordion-header" id="headingThree">
                      <a href="javascript:void(0);" className="accordion-button collapsed" data-bs-toggle="collapse" data-bs-target="#collapseThree">
                        What should I do if I need to cancel or reschedule my appointment?
                      </a>
                    </h2>
                    <div id="collapseThree" className="accordion-collapse collapse">
                      <div className="accordion-body">
                        <div className="accordion-content">
                          <p>If you need to cancel or reschedule your appointment, contact the doctor as soon as possible to inform them and to reschedule for another available time slot.</p>
                        </div>
                      </div>
                    </div>
                  </div>
                  <div className="accordion-item">
                    <h2 className="accordion-header" id="headingFour">
                      <a href="javascript:void(0);" className="accordion-button collapsed" data-bs-toggle="collapse" data-bs-target="#collapseFour">
                        What if I'm running late for my appointment?
                      </a>
                    </h2>
                    <div id="collapseFour" className="accordion-collapse collapse">
                      <div className="accordion-body">
                        <div className="accordion-content">
                          <p>If you know you will be late, it's courteous to call the doctor's office and inform them. Depending on their policy and schedule, they may be able to accommodate you or reschedule your appointment.</p>
                        </div>
                      </div>
                    </div>
                  </div>
                  <div className="accordion-item">
                    <h2 className="accordion-header" id="headingFive">
                      <a href="javascript:void(0);" className="accordion-button collapsed" data-bs-toggle="collapse" data-bs-target="#collapseFive">
                        Can I book appointments for family members or dependents?
                      </a>
                    </h2>
                    <div id="collapseFive" className="accordion-collapse collapse">
                      <div className="accordion-body">
                        <div className="accordion-content">
                          <p>Yes, in many cases, you can book appointments for family members or dependents. However, you may need to provide their personal information and consent to do so.</p>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
      {/* /FAQ Section */}

      {/* App Section */}
     
      {/* /App Section */}

      {/* Info Section */}
      <section className="info-section">
        <div className="container">
          <div className="contact-info">
            <div className="d-lg-flex align-items-center justify-content-between w-100 gap-4">
              <div className="mb-4 mb-lg-0 aos" data-aos="fade-up">
                <h6 className="display-6 text-white">Working for Your Better Health.</h6>
              </div>
              <div className="d-sm-flex align-items-center justify-content-lg-end gap-4 aos" data-aos="fade-up">
                <div className="con-info d-flex align-items-center mb-3 mb-sm-0">
                  <span className="con-icon">
                    <i className="isax isax-headphone"></i>
                  </span>
                  <div className="ms-2">
                    <p className="text-white mb-1">Customer Support</p>
                    <p className="text-white fw-medium mb-0">+1 56589 54598</p>
                  </div>
                </div>
                <div className="con-info d-flex align-items-center">
                  <span className="con-icon">
                    <i className="isax isax-message-2"></i>
                  </span>
                  <div className="ms-2">
                    <p className="text-white mb-1">Drop Us an Email</p>
                    <p className="text-white fw-medium mb-0">info1256@example.com</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
      {/* /Info Section */}
    </>
  )
}

export default Index

