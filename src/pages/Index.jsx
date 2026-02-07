import { useEffect, useState, useMemo, useRef } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { toast } from 'react-toastify'
import { useAuth } from '../contexts/AuthContext'
import * as doctorApi from '../api/doctor'
import * as specializationApi from '../api/specialization'
import * as reviewsApi from '../api/reviews'
import * as favoriteApi from '../api/favorite'
import * as insuranceApi from '../api/insurance'

const Index = () => {
  const navigate = useNavigate()
  const { user } = useAuth()
  const queryClient = useQueryClient()
  const [searchTerm, setSearchTerm] = useState('')
  const [location, setLocation] = useState('')
  const [selectedSpecialization, setSelectedSpecialization] = useState('')
  const [showTelemedicineModal, setShowTelemedicineModal] = useState(false)
  const [telemedicineSlide, setTelemedicineSlide] = useState(0)
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

  // Fetch active insurance companies
  const { data: insuranceCompaniesData, isLoading: insuranceLoading } = useQuery({
    queryKey: ['activeInsuranceCompanies'],
    queryFn: () => insuranceApi.getActiveInsuranceCompanies()
  })

  // Extract insurance companies - handle both direct array and wrapped response
  const insuranceCompanies = useMemo(() => {
    if (!insuranceCompaniesData) return []
    // If it's already an array, return it
    if (Array.isArray(insuranceCompaniesData)) return insuranceCompaniesData
    // If it has a data property, extract it
    if (insuranceCompaniesData.data) {
      return Array.isArray(insuranceCompaniesData.data) ? insuranceCompaniesData.data : []
    }
    return []
  }, [insuranceCompaniesData])

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
    const apiBaseURL = import.meta.env.VITE_API_URL || 'https://mydoctoradmin.mydoctorplus.it/api'
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
    return doctors.slice(0, 8)
      .map((doctor) => {
        const userId = doctor.userId || {}
        
        // Extract doctorId - match the pattern used in Search.jsx
        // The doctor object structure may have userId._id as the primary identifier
        // The API endpoint /doctor/profile/${doctorId} expects the user ID
        const doctorId = doctor.userId?._id || doctor._id || doctor.id
        
        // Skip doctors without a valid ID
        if (!doctorId) {
          console.warn('Doctor missing ID:', doctor)
          return null
        }
        
        // Get specialization - can be an object (populated) or just an ID
        let specialtyName = 'General'
        if (doctor.specialization) {
          if (typeof doctor.specialization === 'object' && doctor.specialization.name) {
            specialtyName = doctor.specialization.name
          }
        }
        
        // Get clinic location
        let location = 'Location not available'
        if (doctor.clinics && doctor.clinics.length > 0) {
          const clinic = doctor.clinics[0]
          // Build location string from available fields
          const locationParts = []
          
          // Add address if available
          if (clinic.address) {
            locationParts.push(clinic.address)
          }
          
          // Add city if available
          if (clinic.city) {
            locationParts.push(clinic.city)
          }
          
          // Add state if available
          if (clinic.state) {
            locationParts.push(clinic.state)
          }
          
          // Add country if available
          if (clinic.country) {
            locationParts.push(clinic.country)
          }
          
          if (locationParts.length > 0) {
            location = locationParts.join(', ')
          }
        }
        
        // Get consultation fee - prefer online fee, fallback to clinic fee, then default
        let feeDisplay = '€500' // Default
        if (doctor.consultationFees) {
          if (doctor.consultationFees.online) {
            feeDisplay = `€${doctor.consultationFees.online}`
          } else if (doctor.consultationFees.clinic) {
            feeDisplay = `€${doctor.consultationFees.clinic}`
          }
        }
        
        return {
          id: doctorId,
          name: userId.fullName || doctor.fullName || 'Dr. Unknown',
          specialty: specialtyName,
          location: location,
          time: '30 Min', // Default, can be fetched from availability
          fee: feeDisplay,
          rating: doctor.ratingAvg || 0,
          image: normalizeImageUrl(userId.profileImage || doctor.profileImage) || '/assets/img/doctor-grid/doctor-grid-01.jpg',
          available: true,
          doctorId: String(doctorId) // Ensure it's always a string for URL params
        }
      })
      .filter(doctor => doctor !== null) // Remove any doctors without valid IDs
  }, [doctors])

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
      if (!fav || !fav.doctorId) return null
      const doctorId = fav.doctorId && typeof fav.doctorId === 'object' && fav.doctorId !== null 
        ? (fav.doctorId._id || fav.doctorId) 
        : fav.doctorId
      return doctorId ? String(doctorId) : null
    }).filter(Boolean))
  }, [favoritesData])

  // Create a map of favoriteId by doctorId for easy removal
  const favoriteIdMap = useMemo(() => {
    if (!favoritesData) return {}
    const responseData = favoritesData.data || favoritesData
    const favorites = responseData.favorites || []
    const map = {}
    favorites.forEach(fav => {
      if (!fav || !fav.doctorId) return
      const doctorId = fav.doctorId && typeof fav.doctorId === 'object' && fav.doctorId !== null 
        ? (fav.doctorId._id || fav.doctorId) 
        : fav.doctorId
      if (doctorId && fav._id) {
        map[String(doctorId)] = fav._id
      }
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

  // Fetch reviews for testimonials (we'll use a sample approach)
  const testimonials = [
    { id: 1, name: 'Deny Hendrawan', location: 'United States', image: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=200&h=200&fit=crop&auto=format', title: 'Nice Treatment', text: 'I had a wonderful experience the staff was friendly and attentive, and Dr. Smith took the time to explain everything clearly.' },
    { id: 2, name: 'Johnson DWayne', location: 'United States', image: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=200&h=200&fit=crop&auto=format', title: 'Good Hospitability', text: 'Genuinely cares about his patients. He helped me understand my condition and worked with me to create a plan.' },
    { id: 3, name: 'Rayan Smith', location: 'United States', image: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=200&h=200&fit=crop&auto=format', title: 'Nice Treatment', text: 'I had a great experience with Dr. Chen. She was not only professional but also made me feel comfortable discussing.' },
    { id: 4, name: 'Sofia Doe', location: 'United States', image: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=200&h=200&fit=crop&auto=format', title: 'Excellent Service', text: 'I had a wonderful experience the staff was friendly and attentive, and Dr. Smith took the time to explain everything clearly.' },
  ]

  // Removed hardcoded companies - now using insurance companies from database
  // const companies = [
  //   'company-01.svg', 'company-02.svg', 'company-03.svg', 'company-04.svg',
  //   'company-05.svg', 'company-06.svg', 'company-07.svg', 'company-08.svg'
  // ]

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
            margin: 15,
            nav: true,
            dots: false,
            autoplay: true,
            autoplayTimeout: 2500,
            autoplayHoverPause: true,
            smartSpeed: 700,
            rtl: true,
            responsive: {
              0: { items: 1 },
              600: { items: 3 },
              1000: { items: 5 }
            }
          })
        }

        // Insurance Companies Slider - only initialize once
        if (insuranceCompanies.length > 0 && !carouselInstances.current['.insurance-companies-slider']) {
          initCarousel('.insurance-companies-slider', {
            loop: insuranceCompanies.length > 5,
            margin: 30,
            nav: true,
            dots: false,
            autoplay: true,
            autoplayTimeout: 3000,
            autoplayHoverPause: true,
            responsive: {
              0: { items: 2 },
              576: { items: 3 },
              768: { items: 4 },
              992: { items: 5 },
              1200: { items: 6 }
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

        // Company Slider (now shows insurance companies) - only initialize once
        if (insuranceCompanies.length > 0 && !carouselInstances.current['.company-slider']) {
          initCarousel('.company-slider', {
            loop: insuranceCompanies.length > 5,
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
      }, [specializations.length, insuranceCompanies.length])

  // Initialize doctors slider once when data is ready
  useEffect(() => {
    if (typeof window !== 'undefined' && window.$ && formatDoctors.length > 0) {
      const timer = setTimeout(() => {
        if (!carouselInstances.current['.doctors-slider']) {
          initCarousel('.doctors-slider', {
            loop: formatDoctors.length > 4,
            margin: 30,
            nav: true,
            navContainer: '.doctor-nav',
            dots: false,
            responsive: {
              0: { items: 1 },
              600: { items: 2 },
              1000: { items: 4 }
            }
          })
          
          // Apply centering styles after carousel initialization (especially for mobile)
          setTimeout(() => {
            const applyCentering = () => {
              if (window.innerWidth <= 768) {
                const navContainer = document.querySelector('.doctor-section .doctor-nav.nav-bottom.owl-nav') ||
                                   document.querySelector('.doctor-section .doctor-nav.owl-nav') ||
                                   document.querySelector('.doctor-section .owl-nav.nav-bottom')
                if (navContainer) {
                  navContainer.style.setProperty('display', 'flex', 'important')
                  navContainer.style.setProperty('justify-content', 'center', 'important')
                  navContainer.style.setProperty('align-items', 'center', 'important')
                  navContainer.style.setProperty('text-align', 'center', 'important')
                  navContainer.style.setProperty('margin-left', 'auto', 'important')
                  navContainer.style.setProperty('margin-right', 'auto', 'important')
                  navContainer.style.setProperty('width', '100%', 'important')
                  navContainer.style.setProperty('left', '0', 'important')
                  navContainer.style.setProperty('right', '0', 'important')
                  navContainer.style.setProperty('position', 'relative', 'important')
                  
                  const prevBtn = navContainer.querySelector('.owl-prev') || navContainer.querySelector('button.owl-prev')
                  const nextBtn = navContainer.querySelector('.owl-next') || navContainer.querySelector('button.owl-next')
                  if (prevBtn) {
                    prevBtn.style.setProperty('position', 'static', 'important')
                    prevBtn.style.setProperty('left', 'auto', 'important')
                    prevBtn.style.setProperty('right', 'auto', 'important')
                    prevBtn.style.setProperty('margin', '0 8px', 'important')
                    prevBtn.style.setProperty('float', 'none', 'important')
                  }
                  if (nextBtn) {
                    nextBtn.style.setProperty('position', 'static', 'important')
                    nextBtn.style.setProperty('left', 'auto', 'important')
                    nextBtn.style.setProperty('right', 'auto', 'important')
                    nextBtn.style.setProperty('margin', '0 8px', 'important')
                    nextBtn.style.setProperty('float', 'none', 'important')
                  }
                }
              }
            }
            
            // Apply immediately
            applyCentering()
            
            // Also apply after a short delay to catch any late-rendered elements
            setTimeout(applyCentering, 200)
            setTimeout(applyCentering, 500)
          }, 100)
        }
      }, 300)

      return () => clearTimeout(timer)
    }
  }, [formatDoctors.length])
  
  // Re-apply centering on window resize and use MutationObserver for mobile
  useEffect(() => {
    const applyCentering = () => {
      if (window.innerWidth <= 768) {
        const navContainer = document.querySelector('.doctor-section .doctor-nav.nav-bottom.owl-nav') ||
                           document.querySelector('.doctor-section .doctor-nav.owl-nav') ||
                           document.querySelector('.doctor-section .owl-nav.nav-bottom')
        if (navContainer) {
          navContainer.style.setProperty('display', 'flex', 'important')
          navContainer.style.setProperty('justify-content', 'center', 'important')
          navContainer.style.setProperty('align-items', 'center', 'important')
          navContainer.style.setProperty('text-align', 'center', 'important')
          navContainer.style.setProperty('margin-left', 'auto', 'important')
          navContainer.style.setProperty('margin-right', 'auto', 'important')
          navContainer.style.setProperty('width', '100%', 'important')
          navContainer.style.setProperty('left', '0', 'important')
          navContainer.style.setProperty('right', '0', 'important')
          navContainer.style.setProperty('position', 'relative', 'important')
          
          const prevBtn = navContainer.querySelector('.owl-prev') || navContainer.querySelector('button.owl-prev')
          const nextBtn = navContainer.querySelector('.owl-next') || navContainer.querySelector('button.owl-next')
          if (prevBtn) {
            prevBtn.style.setProperty('position', 'static', 'important')
            prevBtn.style.setProperty('left', 'auto', 'important')
            prevBtn.style.setProperty('right', 'auto', 'important')
            prevBtn.style.setProperty('margin', '0 8px', 'important')
            prevBtn.style.setProperty('float', 'none', 'important')
          }
          if (nextBtn) {
            nextBtn.style.setProperty('position', 'static', 'important')
            nextBtn.style.setProperty('left', 'auto', 'important')
            nextBtn.style.setProperty('right', 'auto', 'important')
            nextBtn.style.setProperty('margin', '0 8px', 'important')
            nextBtn.style.setProperty('float', 'none', 'important')
          }
        }
      }
    }
    
    const handleResize = () => {
      applyCentering()
    }
    
    // Use MutationObserver to watch for DOM changes (when carousel creates buttons)
    const observer = new MutationObserver(() => {
      applyCentering()
    })
    
    const doctorSection = document.querySelector('.doctor-section')
    if (doctorSection) {
      observer.observe(doctorSection, {
        childList: true,
        subtree: true,
        attributes: true
      })
    }
    
    window.addEventListener('resize', handleResize)
    // Apply on mount and after a delay
    setTimeout(applyCentering, 100)
    setTimeout(applyCentering, 500)
    setTimeout(applyCentering, 1000)
    
    return () => {
      window.removeEventListener('resize', handleResize)
      observer.disconnect()
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

  // Handle ESC key to close telemedicine modal
  useEffect(() => {
    const handleEscape = (e) => {
      if (e.key === 'Escape' && showTelemedicineModal) {
        setShowTelemedicineModal(false)
        setTelemedicineSlide(0)
      }
    }
    if (showTelemedicineModal) {
      window.addEventListener('keydown', handleEscape)
      // Prevent body scroll when modal is open
      document.body.style.overflow = 'hidden'
    }
    return () => {
      window.removeEventListener('keydown', handleEscape)
      document.body.style.overflow = 'unset'
    }
  }, [showTelemedicineModal])

  // Auto-slider for telemedicine modal
  useEffect(() => {
    if (!showTelemedicineModal) {
      return
    }

    const interval = setInterval(() => {
      setTelemedicineSlide((prev) => (prev === 0 ? 1 : 0))
    }, 5000) // Change slide every 5 seconds

    return () => clearInterval(interval)
  }, [showTelemedicineModal])

  const handleSearch = (e) => {
    e.preventDefault()
    // Navigate to search page with search parameters
    const params = new URLSearchParams()
    if (searchTerm.trim()) params.set('search', searchTerm.trim())
    if (location.trim()) params.set('location', location.trim())
    if (selectedSpecialization) params.set('specialization', selectedSpecialization)
    navigate(`/search?${params.toString()}`)
  }

  return (
    <>
      <style>{`
        /* Fixed size for doctor profile images on home page - 612px × 188px */
        .doctors-slider .card-img.card-img-hover img,
        .doctors-slider .card-img img {
          width: 100% !important;
          height: 188px !important;
          max-width: 612px !important;
          object-fit: cover !important;
          object-position: center !important;
          display: block !important;
        }
        .doctors-slider .card-img.card-img-hover,
        .doctors-slider .card-img {
          width: 100% !important;
          height: 188px !important;
          max-width: 612px !important;
          overflow: hidden !important;
          position: relative !important;
          margin: 0 auto !important;
        }
        /* Favorite icon styles */
        .fav-icon.favorited .fa-heart,
        .fav-icon .fa-heart.filled {
          color: #f44336 !important;
        }
        .fav-icon:hover .fa-heart {
          color: #f44336 !important;
          transition: color 0.2s;
        }
        /* Banner section - reduce top spacing on desktop */
        .banner-section.banner-sec-one {
          padding-top: 40px !important;
          padding-bottom: 60px !important;
        }
        .banner-section .banner-content {
          padding-top: 40px !important;
          padding-bottom: 40px !important;
        }
        .banner-section .rating-appointment {
          margin-bottom: 1.5rem !important;
        }
        /* Banner heading responsive styles */
        .banner-section .banner-content h1 {
          font-size: 3.5rem !important;
          font-weight: 700 !important;
          line-height: 1.2 !important;
          margin-bottom: 1.5rem !important;
          margin-top: 0.5rem !important;
        }

        .home-category-tabs {
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 10px;
          margin: 0 auto 14px;
          padding: 8px;
          background: rgba(11, 76, 140, 0.12);
          border-radius: 14px;
          width: fit-content;
          max-width: 100%;
          flex-wrap: wrap;
        }
        .home-category-tab {
          display: inline-flex;
          align-items: center;
          gap: 8px;
          padding: 10px 16px;
          border-radius: 12px;
          background: #0b4c8c;
          color: #fff;
          font-weight: 600;
          font-size: 14px;
          text-decoration: none;
          border: 1px solid rgba(255, 255, 255, 0.18);
          transition: transform 0.15s ease, background-color 0.15s ease;
          white-space: nowrap;
        }
        .home-category-tab i {
          font-size: 16px;
        }
        .home-category-tab:hover {
          color: #fff;
          transform: translateY(-1px);
          background: #083a6a;
        }
        .home-category-tab.active {
          background: linear-gradient(90deg, #0b4c8c 0%, #0e82fd 100%);
          border-color: rgba(255, 255, 255, 0.25);
        }

        @media (max-width: 992px) {
          .banner-section .banner-content h1 {
            font-size: 2.5rem !important;
          }
        }
        /* Search box larger styles */
        .banner-section .search-box-one {
          padding: 1.2rem !important;
          border-radius: 50px !important;
          background-color: #fff !important;
          box-shadow: 0 4px 20px rgba(0,0,0,0.1) !important;
        }
        .banner-section .search-box-one form {
          display: flex !important;
          gap: 8px !important;
          flex-wrap: nowrap !important;
          align-items: stretch !important;
        }
        .banner-section .search-box-one .search-input {
          flex: 1 1 auto !important;
          min-width: 0 !important;
          border-radius: 50px !important;
          overflow: hidden !important;
          background-color: #f8f9fa !important;
          border: 1px solid #e9ecef !important;
          display: flex !important;
          align-items: center !important;
          padding: 0 12px !important;
        }
        .banner-section .search-box-one .search-input i {
          font-size: 18px !important;
          color: #6c757d !important;
          margin-right: 8px !important;
          flex-shrink: 0 !important;
        }
        .banner-section .search-box-one .search-input .mb-0 {
          flex: 1 1 auto !important;
          min-width: 0 !important;
          display: flex !important;
          align-items: center !important;
        }
        .banner-section .search-box-one .form-control {
          font-size: 13px !important;
          padding: 12px 8px !important;
          padding-left: 20px !important;
          min-height: 50px !important;
          height: auto !important;
          border: none !important;
          background-color: transparent !important;
          border-radius: 50px !important;
          width: 100% !important;
          min-width: 0 !important;
        }
        .banner-section .search-box-one .form-control::placeholder {
          color: #6c757d !important;
          opacity: 1 !important;
          font-size: 13px !important;
          white-space: nowrap !important;
          overflow: visible !important;
          text-overflow: ellipsis !important;
        }
        .banner-section .search-box-one .form-control:focus {
          outline: none !important;
          box-shadow: none !important;
        }
        .banner-section .search-box-one .form-control option {
          font-size: 13px !important;
        }
        .banner-section .search-box-one .form-search-btn {
          flex: 0 0 auto !important;
          display: flex !important;
          align-items: stretch !important;
        }
        .banner-section .search-box-one .form-search-btn .btn {
          font-size: 16px !important;
          padding: 14px 32px !important;
          min-height: 50px !important;
          height: 100% !important;
          font-weight: 600 !important;
          white-space: nowrap !important;
          align-self: stretch !important;
          border-radius: 50px !important;
        }
        @media (max-width: 992px) {
          .banner-section .search-box-one form {
            flex-wrap: wrap !important;
          }
          .banner-section .search-box-one .search-input {
            flex: 1 1 calc(50% - 6px) !important;
            min-width: 150px !important;
          }
          .banner-section .search-box-one .form-search-btn {
            flex: 1 1 100% !important;
          }
          .banner-section .search-box-one .form-search-btn .btn {
            width: 100% !important;
          }
        }
        @media (max-width: 768px) {
          /* Header logo bigger on mobile */
          .navbar-brand.logo img,
          .menu-logo img {
            max-height: 55px !important;
            width: auto !important;
            height: auto !important;
            transform: scale(1.2) !important;
          }
          
          /* Center doctor slider navigation arrows on mobile */
          .doctor-section .doctor-nav.nav-bottom.owl-nav,
          .doctor-section .nav-bottom.owl-nav,
          .doctor-section .owl-nav.nav-bottom,
          .doctor-section .doctor-nav.owl-nav,
          .doctor-section .owl-nav {
            display: flex !important;
            justify-content: center !important;
            align-items: center !important;
            text-align: center !important;
            margin-left: auto !important;
            margin-right: auto !important;
            padding: 0 !important;
            width: 100% !important;
            left: 0 !important;
            right: 0 !important;
            position: relative !important;
            transform: none !important;
          }
          .doctor-section .doctor-nav.nav-bottom.owl-nav .owl-prev,
          .doctor-section .doctor-nav.nav-bottom.owl-nav .owl-next,
          .doctor-section .nav-bottom.owl-nav .owl-prev,
          .doctor-section .nav-bottom.owl-nav .owl-next,
          .doctor-section .owl-nav.nav-bottom .owl-prev,
          .doctor-section .owl-nav.nav-bottom .owl-next,
          .doctor-section .doctor-nav.owl-nav .owl-prev,
          .doctor-section .doctor-nav.owl-nav .owl-next,
          .doctor-section .owl-nav .owl-prev,
          .doctor-section .owl-nav .owl-next,
          .doctor-section button.owl-prev,
          .doctor-section button.owl-next {
            position: static !important;
            margin: 0 8px !important;
            margin-left: 8px !important;
            margin-right: 8px !important;
            display: inline-flex !important;
            align-items: center !important;
            justify-content: center !important;
            left: auto !important;
            right: auto !important;
            float: none !important;
            transform: none !important;
            top: auto !important;
            bottom: auto !important;
          }
          
          /* Center Top Specialties slider navigation arrows on mobile */
          .speciality-section .spciality-nav.nav-bottom.owl-nav,
          .speciality-section .nav-bottom.owl-nav,
          .speciality-section .owl-nav.nav-bottom,
          .speciality-section .spciality-nav.owl-nav,
          .speciality-section .owl-nav {
            display: flex !important;
            justify-content: center !important;
            align-items: center !important;
            text-align: center !important;
            margin-left: auto !important;
            margin-right: auto !important;
            padding: 0 !important;
            width: 100% !important;
            left: 0 !important;
            right: 0 !important;
            position: relative !important;
            transform: none !important;
          }
          .speciality-section .spciality-nav.nav-bottom.owl-nav .owl-prev,
          .speciality-section .spciality-nav.nav-bottom.owl-nav .owl-next,
          .speciality-section .nav-bottom.owl-nav .owl-prev,
          .speciality-section .nav-bottom.owl-nav .owl-next,
          .speciality-section .owl-nav.nav-bottom .owl-prev,
          .speciality-section .owl-nav.nav-bottom .owl-next,
          .speciality-section .spciality-nav.owl-nav .owl-prev,
          .speciality-section .spciality-nav.owl-nav .owl-next,
          .speciality-section .owl-nav .owl-prev,
          .speciality-section .owl-nav .owl-next,
          .speciality-section button.owl-prev,
          .speciality-section button.owl-next {
            position: static !important;
            margin: 0 8px !important;
            margin-left: 8px !important;
            margin-right: 8px !important;
            display: inline-flex !important;
            align-items: center !important;
            justify-content: center !important;
            left: auto !important;
            right: auto !important;
            float: none !important;
            transform: none !important;
            top: auto !important;
            bottom: auto !important;
          }
          
          /* Center Testimonials slider navigation arrows on mobile */
          .testimonial-section-one .testimonials-slider + .owl-nav,
          .testimonial-section-one .owl-nav.nav-bottom,
          .testimonial-section-one .nav-bottom.owl-nav,
          .testimonial-section-one .testimonials-slider ~ .owl-nav,
          .testimonial-section-one .owl-nav {
            display: flex !important;
            justify-content: center !important;
            align-items: center !important;
            text-align: center !important;
            margin-left: auto !important;
            margin-right: auto !important;
            padding: 0 !important;
            width: 100% !important;
            left: 0 !important;
            right: 0 !important;
            position: relative !important;
            transform: none !important;
          }
          .testimonial-section-one .testimonials-slider + .owl-nav .owl-prev,
          .testimonial-section-one .testimonials-slider + .owl-nav .owl-next,
          .testimonial-section-one .owl-nav.nav-bottom .owl-prev,
          .testimonial-section-one .owl-nav.nav-bottom .owl-next,
          .testimonial-section-one .nav-bottom.owl-nav .owl-prev,
          .testimonial-section-one .nav-bottom.owl-nav .owl-next,
          .testimonial-section-one .testimonials-slider ~ .owl-nav .owl-prev,
          .testimonial-section-one .testimonials-slider ~ .owl-nav .owl-next,
          .testimonial-section-one .owl-nav .owl-prev,
          .testimonial-section-one .owl-nav .owl-next,
          .testimonial-section-one button.owl-prev,
          .testimonial-section-one button.owl-next {
            position: static !important;
            margin: 0 8px !important;
            margin-left: 8px !important;
            margin-right: 8px !important;
            display: inline-flex !important;
            align-items: center !important;
            justify-content: center !important;
            left: auto !important;
            right: auto !important;
            float: none !important;
            transform: none !important;
            top: auto !important;
            bottom: auto !important;
          }
          
          /* Center Insurance Partners slider navigation arrows on mobile */
          .insurance-companies-section .insurance-companies-slider + .owl-nav,
          .insurance-companies-section .owl-nav.nav-bottom,
          .insurance-companies-section .nav-bottom.owl-nav,
          .insurance-companies-section .insurance-companies-slider ~ .owl-nav,
          .insurance-companies-section .owl-nav {
            display: flex !important;
            justify-content: center !important;
            align-items: center !important;
            text-align: center !important;
            margin-left: auto !important;
            margin-right: auto !important;
            padding: 0 !important;
            width: 100% !important;
            left: 0 !important;
            right: 0 !important;
            position: relative !important;
            transform: none !important;
          }
          .insurance-companies-section .insurance-companies-slider + .owl-nav .owl-prev,
          .insurance-companies-section .insurance-companies-slider + .owl-nav .owl-next,
          .insurance-companies-section .owl-nav.nav-bottom .owl-prev,
          .insurance-companies-section .owl-nav.nav-bottom .owl-next,
          .insurance-companies-section .nav-bottom.owl-nav .owl-prev,
          .insurance-companies-section .nav-bottom.owl-nav .owl-next,
          .insurance-companies-section .insurance-companies-slider ~ .owl-nav .owl-prev,
          .insurance-companies-section .insurance-companies-slider ~ .owl-nav .owl-next,
          .insurance-companies-section .owl-nav .owl-prev,
          .insurance-companies-section .owl-nav .owl-next,
          .insurance-companies-section button.owl-prev,
          .insurance-companies-section button.owl-next {
            position: static !important;
            margin: 0 8px !important;
            margin-left: 8px !important;
            margin-right: 8px !important;
            display: inline-flex !important;
            align-items: center !important;
            justify-content: center !important;
            left: auto !important;
            right: auto !important;
            float: none !important;
            transform: none !important;
            top: auto !important;
            bottom: auto !important;
          }
          
          .banner-section {
            background-image: url('/assets/img/mobile_hero_background.png') !important;
            background-size: cover !important;
            background-position: center center !important;
            background-repeat: no-repeat !important;
            position: relative !important;
            padding: 2rem 0 3rem !important;
            min-height: auto !important;
          }
          .banner-section::before {
            content: '' !important;
            position: absolute !important;
            top: 0 !important;
            left: 0 !important;
            right: 0 !important;
            bottom: 0 !important;
            background: rgba(255, 255, 255, 0.05) !important;
            z-index: 0 !important;
          }
          .banner-section .container {
            position: relative !important;
            z-index: 1 !important;
          }
          .banner-section .row {
            margin: 0 !important;
          }
          .banner-section .col-lg-7 {
            padding: 0 15px !important;
            width: 100% !important;
          }
          .banner-section .banner-content {
            text-align: center !important;
          }
          .banner-section .rating-appointment {
            flex-direction: column !important;
            align-items: center !important;
            justify-content: center !important;
            margin-bottom: 1.5rem !important;
            gap: 1rem !important;
            padding: 1.5rem !important;
            background-color: rgba(255, 255, 255, 0.95) !important;
            border-radius: 55px !important;
            box-shadow: 0 4px 20px rgba(0, 0, 0, 0.1) !important;
          }
          .banner-section .rating-appointment .avatar-list-stacked {
            margin-bottom: 0.75rem !important;
          }
          .banner-section .rating-appointment .avatar-list-stacked .avatar {
            width: 70px !important;
            height: 70px !important;
            border: 3px solid #fff !important;
            box-shadow: 0 2px 8px rgba(0, 0, 0, 0.15) !important;
            margin-left: -10px !important;
          }
          .banner-section .rating-appointment .avatar-list-stacked .avatar:first-child {
            margin-left: 0 !important;
          }
          .banner-section .rating-appointment .avatar-list-stacked .avatar img {
            width: 100% !important;
            height: 100% !important;
            object-fit: cover !important;
          }
          .banner-section .rating-appointment .me-2 {
            text-align: center !important;
            margin: 0 !important;
          }
          .banner-section .rating-appointment .me-2 h6 {
            font-size: 1rem !important;
            font-weight: 600 !important;
            color: #1a1a1a !important;
            margin-bottom: 0.5rem !important;
          }
          .banner-section .rating-appointment .me-2 .d-flex {
            justify-content: center !important;
            align-items: center !important;
            gap: 0.5rem !important;
          }
          .banner-section .rating-appointment .me-2 p {
            margin: 0 !important;
            color: #6c757d !important;
            font-size: 0.9rem !important;
          }
          .banner-section .banner-content h1 {
            font-size: 1.75rem !important;
            line-height: 1.3 !important;
            margin-bottom: 1.5rem !important;
            color: #1a1a1a !important;
            text-align: center !important;
          }
          .home-category-tabs {
            display: flex;
            align-items: center;
            justify-content: center;
            gap: 10px;
            margin: 0 auto 14px;
            padding: 8px;
            background: rgba(11, 76, 140, 0.12);
            border-radius: 14px;
            width: fit-content;
            max-width: 100%;
            flex-wrap: wrap;
          }
          .home-category-tab {
            display: inline-flex;
            align-items: center;
            gap: 8px;
            padding: 10px 16px;
            border-radius: 12px;
            background: #0b4c8c;
            color: #fff;
            font-weight: 600;
            font-size: 14px;
            text-decoration: none;
            border: 1px solid rgba(255, 255, 255, 0.18);
            transition: transform 0.15s ease, background-color 0.15s ease;
            white-space: nowrap;
          }
          .home-category-tab i {
            font-size: 16px;
          }
          .home-category-tab:hover {
            color: #fff;
            transform: translateY(-1px);
            background: #083a6a;
          }
          .home-category-tab.active {
            background: linear-gradient(90deg, #0b4c8c 0%, #0e82fd 100%);
            border-color: rgba(255, 255, 255, 0.25);
          }
          .banner-section .banner-img {
            display: none !important;
          }
          .banner-section .search-box-one {
            margin-top: 1rem !important;
            padding: 1rem !important;
          }
          .banner-section .search-box-one form {
            flex-direction: column !important;
            gap: 10px !important;
          }
          .banner-section .search-box-one .search-input {
            flex: 1 1 100% !important;
            min-width: 100% !important;
            width: 100% !important;
          }
          .banner-section .search-box-one .form-search-btn {
            flex: 1 1 100% !important;
            width: 100% !important;
          }
          .banner-section .search-box-one .form-search-btn .btn {
            width: 100% !important;
            padding: 14px 24px !important;
          }
        }
      `}</style>
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
                <h1 className="display-2" style={{ 
                  fontSize: '3.5rem', 
                  fontWeight: '700', 
                  lineHeight: '1.2',
                  marginBottom: '2rem'
                }}>
                  Discover Health: Find Your Trusted{' '}
                  <span className="banner-icon">
                    <img src="/assets/img/icons/video.svg" alt="img" />
                  </span>{' '}
                  <span className="text-gradient">Doctors</span> Today
                </h1>
                <div className="home-category-tabs" aria-label="Home quick categories">
                  <Link to="/search" className="home-category-tab active">
                    <i className="isax isax-user-search"></i>
                    Doctors
                  </Link>
                  <Link to="/telemedicine" className="home-category-tab">
                    <i className="isax isax-video"></i>
                    Telemedicine
                  </Link>
                  <Link to="/search" className="home-category-tab">
                    <i className="isax isax-hospital"></i>
                    Clinic
                  </Link>
                  <Link to="/pharmacy-search" className="home-category-tab">
                    <i className="isax isax-bag"></i>
                    Pharmacy
                  </Link>
                </div>
                <div className="search-box-one aos" data-aos="fade-up">
                  <form onSubmit={handleSearch}>
                    <div className="search-input search-line">
                      <i className="isax isax-hospital5 bficon"></i>
                      <div className="mb-0">
                        <input 
                          type="text" 
                          className="form-control" 
                          placeholder="Search doctors, clinics..." 
                          
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
                <img src="/assets/img/girl_final.png" className="img-fluid" alt="patient-image" />
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

      {/* Quick Service Options Section */}
      <section className="quick-service-section py-5">
        <div className="container">
          <div className="row g-4">
            {/* Don't know the specialization? */}
            <div className="col-lg-6 col-md-6 col-12">
              <div 
                className="quick-service-card card h-100 border-0 shadow-sm cursor-pointer"
                onClick={() => navigate('/search')}
                style={{
                  cursor: 'pointer',
                  transition: 'all 0.3s ease',
                  borderRadius: '12px',
                  padding: '24px'
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.transform = 'translateY(-5px)'
                  e.currentTarget.style.boxShadow = '0 8px 20px rgba(0,0,0,0.1)'
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.transform = 'translateY(0)'
                  e.currentTarget.style.boxShadow = '0 2px 8px rgba(0,0,0,0.08)'
                }}
              >
                <div className="d-flex align-items-start">
                  <div 
                    className="quick-service-icon me-3"
                    style={{
                      width: '60px',
                      height: '60px',
                      minWidth: '60px',
                      borderRadius: '50%',
                      backgroundColor: '#E8F4FD',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      flexShrink: 0
                    }}
                  >
                    <svg width="36" height="36" viewBox="0 0 36 36" fill="none" xmlns="http://www.w3.org/2000/svg">
                      {/* Back person 1 */}
                      <circle cx="10" cy="12" r="4" stroke="#0D6EFD" strokeWidth="1.5" fill="none"/>
                      <path d="M6 18C6 16 8 14 10 14C12 14 14 16 14 18" stroke="#0D6EFD" strokeWidth="1.5" fill="none"/>
                      <rect x="8" y="16" width="4" height="6" rx="1" stroke="#0D6EFD" strokeWidth="1.5" fill="none"/>
                      {/* Back person 2 */}
                      <circle cx="26" cy="12" r="4" stroke="#0D6EFD" strokeWidth="1.5" fill="none"/>
                      <path d="M22 18C22 16 24 14 26 14C28 14 30 16 30 18" stroke="#0D6EFD" strokeWidth="1.5" fill="none"/>
                      <rect x="24" y="16" width="4" height="6" rx="1" stroke="#0D6EFD" strokeWidth="1.5" fill="none"/>
                      {/* Front person with cross */}
                      <circle cx="18" cy="14" r="5" stroke="#0D6EFD" strokeWidth="1.5" fill="none"/>
                      <path d="M13 20C13 18 15 16 18 16C21 16 23 18 23 20" stroke="#0D6EFD" strokeWidth="1.5" fill="none"/>
                      <rect x="15" y="18" width="6" height="8" rx="1" stroke="#0D6EFD" strokeWidth="1.5" fill="none"/>
                      {/* Cross symbol on front person */}
                      <path d="M18 11V17M15 14H21" stroke="#0D6EFD" strokeWidth="2" strokeLinecap="round"/>
                    </svg>
                  </div>
                  <div className="flex-grow-1">
                    <h5 className="mb-2 fw-semibold">Don't know the specialization?</h5>
                    <p className="mb-0 text-muted">
                      Select this option and we will send your question to the most suitable specialization.
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Analysis Interpretation */}
            <div className="col-lg-6 col-md-6 col-12">
              <div 
                className="quick-service-card card h-100 border-0 shadow-sm cursor-pointer"
                onClick={() => navigate('/search')}
                style={{
                  cursor: 'pointer',
                  transition: 'all 0.3s ease',
                  borderRadius: '12px',
                  padding: '24px'
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.transform = 'translateY(-5px)'
                  e.currentTarget.style.boxShadow = '0 8px 20px rgba(0,0,0,0.1)'
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.transform = 'translateY(0)'
                  e.currentTarget.style.boxShadow = '0 2px 8px rgba(0,0,0,0.08)'
                }}
              >
                <div className="d-flex align-items-start">
                  <div 
                    className="quick-service-icon me-3"
                    style={{
                      width: '60px',
                      height: '60px',
                      minWidth: '60px',
                      borderRadius: '50%',
                      backgroundColor: '#E8F4FD',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      flexShrink: 0
                    }}
                  >
                    <svg width="36" height="36" viewBox="0 0 36 36" fill="none" xmlns="http://www.w3.org/2000/svg">
                      {/* Test tube */}
                      <path d="M12 6C12 5.4 12.4 5 13 5H19C19.6 5 20 5.4 20 6V8H12V6Z" fill="#0D6EFD"/>
                      <rect x="12" y="8" width="8" height="18" rx="2" stroke="#0D6EFD" strokeWidth="1.5" fill="none"/>
                      <path d="M14 12H18M14 16H18M14 20H16" stroke="#0D6EFD" strokeWidth="1.5" strokeLinecap="round"/>
                      {/* Drop symbol */}
                      <path d="M24 10C24 8.9 24.9 8 26 8C27.1 8 28 8.9 28 10C28 11.1 26 14 26 14C26 14 24 11.1 24 10Z" fill="#0D6EFD"/>
                      <path d="M26 8L26 12" stroke="white" strokeWidth="1" strokeLinecap="round"/>
                    </svg>
                  </div>
                  <div className="flex-grow-1">
                    <h5 className="mb-2 fw-semibold">Analysis Interpretation</h5>
                    <p className="mb-0 text-muted">
                      Select this option and we will send your analyses to the most suitable doctor.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
      {/* /Quick Service Options Section */}

      {/* List */}
      {/* <div className="list-section">
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
      </div> */}
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
              specializations.slice(0, 8).map((specialization, index) => {
                // Use icon from database if available for both background and center icon
                const databaseIconUrl = specialization.icon 
                  ? normalizeImageUrl(specialization.icon) 
                  : null
                
                // Background placeholder: use database icon, fallback to default image
                const backgroundImageUrl = databaseIconUrl || getSpecializationImage(index)
                
                // Center circle icon: use database icon, fallback to default icon
                // Always ensure we have a valid icon URL
                const centerIconUrl = databaseIconUrl || getSpecializationIcon(index)
                
                return (
                  <div 
                    key={specialization._id || specialization.id || index} 
                    className="spaciality-item"
                    style={{
                      display: 'flex',
                      flexDirection: 'column',
                      alignItems: 'center',
                      width: '100%'
                    }}
                  >
                    <div 
                      className="spaciality-img"
                      style={{
                        width: '175px',
                        height: '202px',
                        minWidth: '175px',
                        maxWidth: '175px',
                        minHeight: '202px',
                        maxHeight: '202px',
                        overflow: 'hidden',
                        margin: '0 auto'
                      }}
                    >
                      <img 
                        src={backgroundImageUrl} 
                        alt={specialization.name}
                        style={{
                          width: '100%',
                          height: '100%',
                          objectFit: 'cover',
                          objectPosition: 'center'
                        }}
                        onError={(e) => {
                          // Fallback to default background image if database icon fails to load
                          e.target.src = getSpecializationImage(index)
                        }}
                      />
                      <span className="spaciality-icon">
                        {centerIconUrl ? (
                          <img 
                            src={centerIconUrl} 
                            alt={specialization.name}
                            style={{
                              width: '40px',
                              height: '40px',
                              objectFit: 'contain',
                              display: 'block'
                            }}
                            onError={(e) => {
                              // Fallback to default icon if database icon fails to load
                              const fallbackIcon = getSpecializationIcon(index)
                              if (e.target.src !== fallbackIcon) {
                                e.target.src = fallbackIcon
                              }
                            }}
                          />
                        ) : (
                          <img 
                            src={getSpecializationIcon(index)} 
                            alt={specialization.name}
                            style={{
                              width: '40px',
                              height: '40px',
                              objectFit: 'contain',
                              display: 'block'
                            }}
                          />
                        )}
                      </span>
                    </div>
                    <div style={{ textAlign: 'center', marginTop: '16px' }}>
                      <h6 style={{ marginBottom: '4px', textAlign: 'center' }}>
                        <Link to={`/search?specialization=${specialization._id || specialization.id}`} style={{ textAlign: 'center' }}>
                          {specialization.name}
                        </Link>
                      </h6>
                      <p className="mb-0" style={{ textAlign: 'center' }}>{specialization.doctorCount || '0'} Doctors</p>
                    </div>
                  </div>
                )
              })
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
                    <a 
                      href="javascript:void(0)" 
                      className={`fav-icon ${favoriteDoctorIds.has(String(doctor.doctorId)) ? 'favorited' : ''}`}
                      onClick={(e) => handleFavoriteToggle(e, doctor.doctorId)}
                      title={favoriteDoctorIds.has(String(doctor.doctorId)) ? 'Remove from favorites' : 'Add to favorites'}
                    >
                      <i className={`fa fa-heart ${favoriteDoctorIds.has(String(doctor.doctorId)) ? 'filled' : ''}`}></i>
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
                        <p className="d-flex align-items-center mb-0 fs-14" style={{ overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap', maxWidth: '100%' }}>
                          <i className="isax isax-location me-2"></i>
                          <span style={{ overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap', display: 'inline-block', maxWidth: 'calc(100% - 24px)' }}>{doctor.location}</span>
                        </p>
                        <i className="fa-solid fa-circle fs-5 text-primary mx-2 me-1"></i>
                        {/* <span className="fs-14 fw-medium">{doctor.time}</span> */}
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
            <h2>15k Users Trust Mydoctor+ Worldwide</h2>
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

      {/* Telemedicine Section */}
      <section className="telemedicine-section" style={{
        backgroundColor: '#f8f9fa',
        position: 'relative',
        padding: '100px 0',
        overflow: 'hidden'
      }}>
        <div className="container">
          <div className="row align-items-center g-4">
            <div className="col-lg-6">
              <div className="telemedicine-content aos" data-aos="fade-right">
                <h2 style={{
                  fontSize: '52px',
                  fontWeight: '700',
                  color: '#0E82FD',
                  marginBottom: '24px',
                  lineHeight: '1.2'
                }}>
                  Telemedicine
                </h2>
                <p style={{
                  fontSize: '18px',
                  color: '#333333',
                  marginBottom: '40px',
                  lineHeight: '1.8',
                  maxWidth: '90%'
                }}>
                  Get in touch with the best doctors anytime and anywhere using private messaging or video conferencing.
                </p>
                <Link
                  to="/telemedicine"
                  className="btn btn-primary"
                  style={{
                    padding: '16px 36px',
                    fontSize: '16px',
                    fontWeight: '600',
                    borderRadius: '8px',
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: '10px',
                    textDecoration: 'none',
                    transition: 'all 0.3s ease',
                    backgroundColor: '#0E82FD',
                    border: 'none',
                    color: '#ffffff',
                    cursor: 'pointer'
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.transform = 'translateY(-2px)'
                    e.currentTarget.style.boxShadow = '0 8px 20px rgba(14, 130, 253, 0.4)'
                    e.currentTarget.style.backgroundColor = '#0a6dd4'
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.transform = 'translateY(0)'
                    e.currentTarget.style.boxShadow = 'none'
                    e.currentTarget.style.backgroundColor = '#0E82FD'
                  }}
                >
                  See More
                  <i className="fa-solid fa-chevron-right" style={{ fontSize: '14px' }}></i>
                </Link>
              </div>
            </div>
            <div className="col-lg-6">
              <div className="telemedicine-visual aos" data-aos="fade-left" style={{
                position: 'relative',
                textAlign: 'center',
                padding: '20px 0'
              }}>
                <div style={{
                  position: 'relative',
                  display: 'inline-block',
                  maxWidth: '100%'
                }}>
                  <img 
                    src="/assets/img/same.jpeg" 
                    alt="Telemedicine Video Consultation"
                    style={{
                      maxWidth: '100%',
                      height: 'auto',
                      borderRadius: '16px',
                      boxShadow: '0 25px 70px rgba(0, 0, 0, 0.2)',
                      display: 'block'
                    }}
                    onError={(e) => {
                      console.warn('Image not found: same.jpeg')
                      e.target.style.display = 'none'
                    }}
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
      {/* /Telemedicine Section */}

      {/* Telemedicine Modal */}
      {showTelemedicineModal && (
        <div 
          className="modal fade show" 
          style={{ 
            display: 'block', 
            backgroundColor: 'rgba(0, 0, 0, 0.5)',
            zIndex: 1050
          }}
          onClick={(e) => {
            if (e.target === e.currentTarget) {
              setShowTelemedicineModal(false)
              setTelemedicineSlide(0)
            }
          }}
        >
          <div 
            className="modal-dialog modal-lg modal-dialog-centered"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="modal-content" style={{ borderRadius: '12px', overflow: 'hidden' }}>
              <div className="modal-header" style={{ 
                borderBottom: '1px solid #e5e5e5',
                padding: '20px 24px',
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center'
              }}>
                <h5 className="modal-title" style={{ 
                  fontSize: '24px', 
                  fontWeight: '600',
                  margin: 0
                }}>
                  Telemedicine
                </h5>
                <button
                  type="button"
                  className="btn-close"
                  onClick={() => {
                    setShowTelemedicineModal(false)
                    setTelemedicineSlide(0)
                  }}
                  style={{
                    border: 'none',
                    background: 'transparent',
                    fontSize: '24px',
                    cursor: 'pointer',
                    padding: 0,
                    width: '30px',
                    height: '30px',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center'
                  }}
                >
                  <i className="fa-solid fa-times" style={{ color: '#666' }}></i>
                </button>
              </div>
              <div className="modal-body" style={{ padding: 0, position: 'relative' }}>
                {/* Slide 1: Private Chat */}
                {telemedicineSlide === 0 && (
                  <div style={{ padding: '30px' }}>
                    <div style={{ marginBottom: '24px' }}>
                      <h3 style={{ 
                        fontSize: '28px', 
                        fontWeight: '600',
                        marginBottom: '12px',
                        color: '#0A0A0A'
                      }}>
                        Private Chat
                      </h3>
                      <p style={{ 
                        fontSize: '16px', 
                        color: '#666',
                        lineHeight: '1.6',
                        margin: 0
                      }}>
                        Send private messages to your specialist doctor and easily resolve your doubts.
                      </p>
                    </div>
                    <div style={{
                      borderRadius: '12px',
                      overflow: 'hidden',
                      border: '1px solid #e5e5e5',
                      boxShadow: '0 4px 12px rgba(0, 0, 0, 0.1)'
                    }}>
                      <img 
                        src="/assets/img/message-chat.jpg" 
                        alt="Private Chat Interface"
                        style={{
                          width: '100%',
                          height: 'auto',
                          display: 'block'
                        }}
                        onError={(e) => {
                          // Try alternative extension
                          e.target.src = '/assets/img/message-chat.png'
                          e.target.onError = () => {
                            console.warn('Image not found: message-chat.jpg/png')
                            e.target.style.display = 'none'
                          }
                        }}
                      />
                    </div>
                  </div>
                )}

                {/* Slide 2: Video Consultation */}
                {telemedicineSlide === 1 && (
                  <div style={{ padding: '30px' }}>
                    <div style={{ marginBottom: '24px' }}>
                      <h3 style={{ 
                        fontSize: '28px', 
                        fontWeight: '600',
                        marginBottom: '12px',
                        color: '#0A0A0A'
                      }}>
                        Video Consultation
                      </h3>
                      <p style={{ 
                        fontSize: '16px', 
                        color: '#666',
                        lineHeight: '1.6',
                        margin: 0
                      }}>
                        Speak privately with your doctor from any location without having to physically reach your doctor's office.
                      </p>
                    </div>
                    <div style={{
                      borderRadius: '12px',
                      overflow: 'hidden',
                      border: '1px solid #e5e5e5',
                      boxShadow: '0 4px 12px rgba(0, 0, 0, 0.1)'
                    }}>
                      <img 
                        src="/assets/img/vedio-chat.png" 
                        alt="Video Consultation Interface"
                        style={{
                          width: '100%',
                          height: 'auto',
                          display: 'block'
                        }}
                        onError={(e) => {
                          // Try alternative extension
                          e.target.src = '/assets/img/vedio-chat.jpg'
                          e.target.onError = () => {
                            console.warn('Image not found: vedio-chat.png/jpg')
                            e.target.style.display = 'none'
                          }
                        }}
                      />
                    </div>
                  </div>
                )}

                {/* Navigation Dots */}
                <div style={{
                  display: 'flex',
                  justifyContent: 'center',
                  alignItems: 'center',
                  gap: '12px',
                  padding: '20px 30px',
                  borderTop: '1px solid #e5e5e5'
                }}>
                  <button
                    onClick={() => setTelemedicineSlide(0)}
                    style={{
                      width: '12px',
                      height: '12px',
                      borderRadius: '50%',
                      border: 'none',
                      backgroundColor: telemedicineSlide === 0 ? '#0E82FD' : '#ccc',
                      cursor: 'pointer',
                      transition: 'background-color 0.3s ease',
                      padding: 0
                    }}
                    aria-label="Go to slide 1"
                  />
                  <button
                    onClick={() => setTelemedicineSlide(1)}
                    style={{
                      width: '12px',
                      height: '12px',
                      borderRadius: '50%',
                      border: 'none',
                      backgroundColor: telemedicineSlide === 1 ? '#0E82FD' : '#ccc',
                      cursor: 'pointer',
                      transition: 'background-color 0.3s ease',
                      padding: 0
                    }}
                    aria-label="Go to slide 2"
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
      {/* /Telemedicine Modal */}

      {/* Insurance Companies Section */}
      {insuranceCompanies.length > 0 && (
        <section className="insurance-companies-section bg-light aos" data-aos="fade-up" style={{ padding: '60px 0' }}>
          <div className="container">
            <div className="section-header sec-header-one text-center">
              <span className="badge badge-primary">Insurance Partners</span>
              <h2>Accepted Insurance Companies</h2>
              <p className="text-muted">We work with leading insurance providers to make healthcare accessible</p>
            </div>
            <div className="owl-carousel insurance-companies-slider">
              {insuranceLoading ? (
                <div className="text-center py-4">
                  <div className="spinner-border text-primary" role="status">
                    <span className="sr-only">Loading...</span>
                  </div>
                </div>
              ) : (
                insuranceCompanies.map((insurance) => {
                  const logoUrl = normalizeImageUrl(insurance.logo)
                  return (
                    <div key={insurance._id || insurance.id} className="insurance-company-item text-center">
                      <div className="insurance-logo-wrapper" style={{
                        height: '100px',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        padding: '15px',
                        backgroundColor: '#fff',
                        borderRadius: '8px',
                        border: '1px solid #e9ecef',
                        margin: '10px'
                      }}>
                        {logoUrl ? (
                          <img
                            src={logoUrl}
                            alt={insurance.name}
                            style={{
                              maxWidth: '100%',
                              maxHeight: '70px',
                              objectFit: 'contain'
                            }}
                            onError={(e) => {
                              e.target.style.display = 'none'
                              e.target.nextSibling.style.display = 'flex'
                            }}
                          />
                        ) : null}
                        <div
                          className="insurance-placeholder"
                          style={{
                            display: logoUrl ? 'none' : 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            height: '70px',
                            width: '100%',
                            backgroundColor: '#f8f9fa',
                            borderRadius: '4px'
                          }}
                        >
                          <i className="fa-solid fa-shield-halved fa-2x text-muted"></i>
                        </div>
                      </div>
                      <h6 className="mt-2 mb-0" style={{ fontSize: '13px', color: '#666' }}>
                        {insurance.name}
                      </h6>
                    </div>
                  )
                })
              )}
            </div>
          </div>
        </section>
      )}

      {/* Insurance Companies Section - Replaces old fake companies section */}
      {/* {insuranceCompanies.length > 0 && (
        <section className="company-section bg-dark aos" data-aos="fade-up">
          <div className="container">
            <div className="section-header sec-header-one text-center">
              <h6 className="text-light">Trusted by 5+ million people with insurance partners like</h6>
            </div>
            <div className="owl-carousel company-slider">
              {insuranceCompanies.map((insurance) => {
                const logoUrl = normalizeImageUrl(insurance.logo)
                return (
                  <div key={insurance._id || insurance.id} className="text-center">
                    {logoUrl ? (
                      <img 
                        src={logoUrl} 
                        alt={insurance.name}
                        style={{
                          maxHeight: '50px',
                          maxWidth: '150px',
                          objectFit: 'contain',
                          filter: 'brightness(0) invert(1)' // Make logos white on dark background
                        }}
                        onError={(e) => {
                          e.target.style.display = 'none'
                          e.target.nextSibling.style.display = 'flex'
                        }}
                      />
                    ) : null}
                    <div
                      className="insurance-placeholder"
                      style={{
                        display: logoUrl ? 'none' : 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        height: '50px',
                        width: '150px',
                        margin: '0 auto'
                      }}
                    >
                      <i className="fa-solid fa-shield-halved fa-2x text-white"></i>
                    </div>
                  </div>
                )
              })}
            </div>
          </div>
        </section>
      )} */}

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
                    <p className="text-white fw-medium mb-0">800925225</p>
                  </div>
                </div>
                <div className="con-info d-flex align-items-center">
                  <span className="con-icon">
                    <i className="isax isax-message-2"></i>
                  </span>
                  <div className="ms-2">
                    <p className="text-white mb-1">Drop Us an Email</p>
                    <p className="text-white fw-medium mb-0">mydoctorplus@virgilio.it</p>
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

