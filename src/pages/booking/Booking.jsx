import { useState, useEffect, useMemo } from 'react'
import { useNavigate, useSearchParams } from 'react-router-dom'
import { useQuery } from '@tanstack/react-query'
import { toast } from 'react-toastify'
import { useAuth } from '../../contexts/AuthContext'
import * as doctorApi from '../../api/doctor'
import * as specializationApi from '../../api/specialization'
import * as weeklyScheduleApi from '../../api/weeklySchedule'
import * as appointmentApi from '../../api/appointments'
import { formatCurrency } from '../../utils/currency'

const Booking = () => {
  const { user } = useAuth()
  const navigate = useNavigate()
  const [searchParams] = useSearchParams()
  const doctorId = searchParams.get('doctorId')

  const [currentStep, setCurrentStep] = useState(1)
  const [formData, setFormData] = useState({
    doctorId: doctorId || '',
    patientId: user?._id || '',
    selectedSpecialization: '',
    selectedServices: [],
    bookingType: 'VISIT', // VISIT or ONLINE
    appointmentDate: '',
    appointmentTime: '',
    patientNotes: '',
    clinicName: '',
    paymentMethod: 'DUMMY'
  })

  // Update formData when doctorId changes
  useEffect(() => {
    if (doctorId) {
      setFormData(prev => ({ ...prev, doctorId }))
    }
  }, [doctorId])

  // Fetch doctor profile
  const { data: doctorData, isLoading: doctorLoading, error: doctorError } = useQuery({
    queryKey: ['doctorProfile', doctorId],
    queryFn: async () => {
      console.log('🚀 [Booking] Fetching doctor profile for ID:', doctorId)
      try {
        const response = await doctorApi.getDoctorProfileById(doctorId)
        console.log('✅ [Booking] Doctor profile API response:', {
          responseType: typeof response,
          responseIsArray: Array.isArray(response),
          responseKeys: response ? Object.keys(response) : null,
          responseValue: response
        })
        return response
      } catch (error) {
        console.error('❌ [Booking] Error fetching doctor profile:', error)
        throw error
      }
    },
    enabled: !!doctorId,
    retry: 1,
    onSuccess: (data) => {
      console.log('🎉 [Booking] Doctor profile fetch successful:', data)
    },
    onError: (error) => {
      console.error('💥 [Booking] Doctor profile fetch failed:', error)
    }
  })

  // Fetch specializations
  const { data: specializationsData } = useQuery({
    queryKey: ['specializations'],
    queryFn: () => specializationApi.getAllSpecializations()
  })

  // Fetch available slots when date is selected
  const { data: availableSlotsData, isLoading: slotsLoading } = useQuery({
    queryKey: ['availableSlots', doctorId, formData.appointmentDate],
    queryFn: () => weeklyScheduleApi.getAvailableSlotsForDate(doctorId, formData.appointmentDate),
    enabled: !!doctorId && !!formData.appointmentDate
  })

  // Extract data - handle multiple possible response structures
  const doctor = useMemo(() => {
    console.log('🔍 [Booking] Extracting doctor data:', {
      hasDoctorData: !!doctorData,
      doctorDataType: typeof doctorData,
      doctorDataIsArray: Array.isArray(doctorData),
      doctorDataKeys: doctorData ? Object.keys(doctorData) : null,
      doctorDataValue: doctorData
    })
    
    if (!doctorData) {
      console.warn('⚠️ [Booking] No doctorData available')
      return null
    }
    
    // Handle different possible response structures:
    // 1. { success, message, data: {...} } - standard API response
    // 2. { data: {...} } - nested data
    // 3. {...} - direct object
    let responseData = doctorData
    
    // Try to extract from nested data property
    if (responseData && typeof responseData === 'object' && !Array.isArray(responseData)) {
      if (responseData.data && typeof responseData.data === 'object' && !Array.isArray(responseData.data)) {
        console.log('📦 [Booking] Found nested data property, extracting...')
        responseData = responseData.data
      }
    }
    
    console.log('✅ [Booking] Extracted doctor object:', {
      hasResponseData: !!responseData,
      responseDataType: typeof responseData,
      responseDataIsArray: Array.isArray(responseData),
      responseDataKeys: responseData ? Object.keys(responseData) : null,
      hasUserId: !!responseData?.userId,
      hasSpecialization: !!responseData?.specialization,
      hasServices: !!responseData?.services,
      servicesLength: responseData?.services?.length || 0
    })
    
    // Return the extracted data if it's a valid object (not null, not array)
    if (responseData && typeof responseData === 'object' && !Array.isArray(responseData)) {
      return responseData
    }
    
    console.error('❌ [Booking] Failed to extract valid doctor object')
    return null
  }, [doctorData])

  const specializations = useMemo(() => {
    if (!specializationsData) return []
    return Array.isArray(specializationsData) ? specializationsData : (specializationsData.data || [])
  }, [specializationsData])

  const availableSlots = useMemo(() => {
    if (!availableSlotsData) return []
    const responseData = availableSlotsData.data || availableSlotsData
    return Array.isArray(responseData) ? responseData : (responseData.slots || [])
  }, [availableSlotsData])

  // A slot belongs to the selected calendar date. Never carry a selected
  // clock time from one date into another, and clear it if a polling/refetch
  // response says another patient has just taken it.
  useEffect(() => {
    if (!formData.appointmentTime || slotsLoading) return
    if (!availableSlots.some((slot) => slot.startTime === formData.appointmentTime)) {
      setFormData((previous) => ({ ...previous, appointmentTime: '' }))
    }
  }, [availableSlots, formData.appointmentTime, slotsLoading])

  // Get doctor's specialization (singular - backend returns one specialization)
  const doctorSpecialization = useMemo(() => {
    if (!doctor) {
      return null
    }
    
    const spec = doctor.specialization
    
    // specialization can be:
    // 1. null/undefined - doctor hasn't set specialization
    // 2. ObjectId string - not populated
    // 3. Populated object with _id, name, etc.
    if (!spec) {
      return null
    }
    
    // If it's a string (ObjectId), it wasn't populated
    if (typeof spec === 'string') {
      return null
    }
    
    // Check if it's an object
    if (typeof spec === 'object' && spec !== null) {
      return spec
    }
    
    return null
  }, [doctor])

  // Get doctor's services (directly on doctor object)
  const doctorServices = useMemo(() => {
    if (!doctor?.services) return []
    return Array.isArray(doctor.services) ? doctor.services : []
  }, [doctor])

  // Selected service names are the only service data sent to the server.
  // Prices are always resolved server-side from the doctor profile.
  const selectedServiceNames = useMemo(() => {
    return formData.selectedServices
      .map((index) => doctorServices[index]?.name || doctorServices[index])
      .filter(Boolean)
  }, [formData.selectedServices, doctorServices])

  // Server-authoritative price breakdown shown on the review steps.
  const { data: quoteData, isLoading: quoteLoading, error: quoteError } = useQuery({
    queryKey: ['bookingQuote', doctorId, formData.bookingType, selectedServiceNames.join('|')],
    queryFn: () => appointmentApi.getBookingQuote({
      doctorId,
      bookingType: formData.bookingType,
      selectedServices: selectedServiceNames
    }),
    enabled: !!doctorId && currentStep >= 5,
    retry: 1
  })

  const quote = useMemo(() => {
    if (!quoteData) return null
    return quoteData.data || quoteData
  }, [quoteData])

  // Get specialization name (must be after doctorSpecialization is defined)
  const doctorSpecializationName = useMemo(() => {
    // First try: from doctorSpecialization (the useMemo result)
    if (doctorSpecialization?.name) {
      return doctorSpecialization.name
    }
    
    // Fallback: try to get from doctor.specialization directly
    if (doctor?.specialization?.name) {
      return doctor.specialization.name
    }
    
    return 'Not Specified'
  }, [doctorSpecialization, doctor])

  // Extract doctor information from the profile structure (moved before conditional returns)
  const doctorName = useMemo(() => {
    if (!doctor) {
      console.log('⚠️ [Booking] No doctor object for name extraction')
      return 'Unknown Doctor'
    }
    const name = doctor.userId?.fullName || doctor.fullName || 'Unknown Doctor'
    console.log('👤 [Booking] Doctor name extracted:', {
      hasDoctor: !!doctor,
      hasUserId: !!doctor.userId,
      userIdFullName: doctor.userId?.fullName,
      doctorFullName: doctor.fullName,
      extractedName: name
    })
    return name
  }, [doctor])

  const doctorImage = useMemo(() => {
    if (!doctor) {
      console.log('⚠️ [Booking] No doctor object for image extraction')
      return '/assets/img/clients/client-15.jpg'
    }
    const image = doctor.userId?.profileImage || doctor.profileImage || '/assets/img/clients/client-15.jpg'
    console.log('🖼️ [Booking] Doctor image extracted:', {
      hasDoctor: !!doctor,
      hasUserId: !!doctor.userId,
      userIdProfileImage: doctor.userId?.profileImage,
      doctorProfileImage: doctor.profileImage,
      extractedImage: image
    })
    return image
  }, [doctor])

  const doctorLocation = useMemo(() => {
    if (!doctor?.clinics?.[0]) {
      console.log('⚠️ [Booking] No clinics available for location')
      return 'Location not available'
    }
    const clinic = doctor.clinics[0]
    const address = `${clinic.address || ''}, ${clinic.city || ''}`.trim()
    const cityState = `${clinic.city || ''}, ${clinic.state || ''}`.trim()
    const location = address || cityState || 'Location not available'
    console.log('📍 [Booking] Doctor location extracted:', {
      hasClinics: !!doctor.clinics,
      clinicsLength: doctor.clinics?.length || 0,
      clinic: clinic,
      extractedLocation: location
    })
    return location
  }, [doctor])

  const doctorRating = useMemo(() => {
    if (!doctor) {
      console.log('⚠️ [Booking] No doctor object for rating extraction')
      return 0
    }
    const rating = doctor.ratingAvg || doctor.rating?.average || 0
    console.log('⭐ [Booking] Doctor rating extracted:', {
      hasDoctor: !!doctor,
      ratingAvg: doctor.ratingAvg,
      ratingAverage: doctor.rating?.average,
      extractedRating: rating
    })
    return rating
  }, [doctor])

  // Set specialization when doctor loads (must be after doctorSpecialization is defined)
  useEffect(() => {
    if (doctor && !formData.selectedSpecialization) {
      const spec = doctor.specialization
      if (spec) {
        const specId = spec._id || spec
        if (specId) {
          setFormData(prev => ({ ...prev, selectedSpecialization: specId }))
        }
      }
    }
  }, [doctor, formData.selectedSpecialization])


  // Update form data
  const updateFormData = (field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }))
  }

  const handleAppointmentDateChange = (value) => {
    setFormData((previous) => ({
      ...previous,
      appointmentDate: value,
      appointmentTime: '',
    }))
  }

  // Handle service selection
  const handleServiceToggle = (serviceIndex) => {
    setFormData(prev => {
      const services = prev.selectedServices.includes(serviceIndex)
        ? prev.selectedServices.filter(idx => idx !== serviceIndex)
        : [...prev.selectedServices, serviceIndex]
      return { ...prev, selectedServices: services }
    })
  }

  // Handle next step
  const handleNext = () => {
    // Validation based on current step
    if (currentStep === 1) {
      // Step 1: Specialization is optional (doctor may not have one set)
      // Set the specialization in form data if available
      if (!formData.selectedSpecialization && doctorSpecialization) {
        const specId = doctorSpecialization._id || doctorSpecialization
        if (specId) {
          updateFormData('selectedSpecialization', specId)
        }
      }
      
      // Check if doctor has services - if not, show warning but allow proceeding
      if (doctorServices.length === 0) {
        toast.warning('This doctor has no services available. You can still proceed with the booking.')
      }
      
      // Allow proceeding even without specialization or services
    }
    if (currentStep === 3) {
      if (!formData.appointmentDate || !formData.appointmentTime) {
        toast.error('Please select date and time')
        return
      }
    }
    if (currentStep === 4) {
      // Basic info is optional, can proceed
    }
    if (currentStep === 5) {
      if (quoteError) {
        toast.error('Could not calculate the booking price. Please try again.')
        return
      }
      if (!quote) {
        toast.error('Price details are still loading. Please wait a moment.')
        return
      }
    }
    if (currentStep < 6) {
      setCurrentStep(prev => prev + 1)
    }
  }

  // Handle previous step
  const handlePrevious = () => {
    if (currentStep > 1) {
      setCurrentStep(prev => prev - 1)
    }
  }

  const getTimezoneOffsetForLocalDateTime = (dateStr, timeStr) => {
    const [year, month, day] = String(dateStr).split('-').map((x) => Number(x))
    const [hours, minutes] = String(timeStr).split(':').map((x) => Number(x))

    if (!Number.isFinite(year) || !Number.isFinite(month) || !Number.isFinite(day) || !Number.isFinite(hours) || !Number.isFinite(minutes)) {
      return -new Date().getTimezoneOffset()
    }

    const dt = new Date(year, month - 1, day, hours, minutes, 0, 0)
    return -dt.getTimezoneOffset()
  }

  // Handle final step: hand the booking over to the real checkout page.
  const handleSubmit = () => {
    if (!user) {
      toast.error('Please login to book an appointment')
      navigate('/login')
      return
    }

    // Check if doctor profile is completed
    if (doctor && doctor.profileCompleted === false) {
      toast.error('This doctor\'s profile is incomplete. Appointments cannot be booked until the profile is completed.')
      return
    }

    if (!formData.appointmentDate || !formData.appointmentTime) {
      toast.error('Please select date and time')
      return
    }

    if (!quote) {
      toast.error('Price details are still loading. Please wait a moment.')
      return
    }

    const booking = {
      doctorId: formData.doctorId,
      doctorName,
      doctorImage,
      specializationName: doctorSpecializationName,
      doctorLocation,
      bookingType: formData.bookingType,
      appointmentDate: formData.appointmentDate,
      appointmentTime: formData.appointmentTime,
      appointmentDuration: quote.appointmentDuration,
      patientNotes: formData.patientNotes || '',
      clinicName: formData.clinicName || '',
      selectedServices: selectedServiceNames,
      paymentMethod: formData.paymentMethod,
      timezone: Intl.DateTimeFormat().resolvedOptions().timeZone,
      timezoneOffset: getTimezoneOffsetForLocalDateTime(formData.appointmentDate, formData.appointmentTime)
    }

    try {
      // A new booking must never reuse the appointment created by a previous
      // checkout attempt that was never completed.
      sessionStorage.removeItem('pendingBookingAppointmentId')
      sessionStorage.setItem('pendingBooking', JSON.stringify(booking))
    } catch (storageError) {
      console.warn('Could not persist pending booking:', storageError)
    }

    navigate('/checkout', { state: { booking } })
  }

  // Format date for display
  const formatDate = (dateString) => {
    if (!dateString) return ''
    const date = new Date(`${dateString}T00:00:00`)
    return date.toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })
  }

  // Format a Date using local calendar parts so the selected day never shifts.
  const formatLocalDate = (date) => {
    const year = date.getFullYear()
    const month = String(date.getMonth() + 1).padStart(2, '0')
    const day = String(date.getDate()).padStart(2, '0')
    return `${year}-${month}-${day}`
  }

  // Get minimum date (today, local calendar)
  const getMinDate = () => formatLocalDate(new Date())

  // Get dates for next 30 days (local calendar)
  const getAvailableDates = () => {
    const dates = []
    const today = new Date()
    for (let i = 0; i < 30; i++) {
      const date = new Date(today)
      date.setDate(today.getDate() + i)
      dates.push(formatLocalDate(date))
    }
    return dates
  }

  // Handle missing doctorId
  if (!doctorId) {
    return (
      <div className="doctor-content">
        <div className="container">
          <div className="row">
            <div className="col-lg-9 mx-auto">
              <div className="alert alert-warning">
                <h5>Doctor ID Required</h5>
                <p>Please select a doctor from the search page to book an appointment.</p>
                <button className="btn btn-primary" onClick={() => navigate('/search')}>Browse Doctors</button>
              </div>
            </div>
          </div>
        </div>
      </div>
    )
  }

  // Always render the booking form - show loading state inline if needed
  return (
    <div className="doctor-content">
      <div className="container">
        <div className="row">
          <div className="col-lg-9 mx-auto">
            <div className="booking-wizard">
              <ul className="form-wizard-steps d-sm-flex align-items-center justify-content-center" id="progressbar2">
                {[1, 2, 3, 4, 5, 6].map((step) => (
                  <li key={step} className={currentStep >= step ? 'progress-active' : ''}>
                    <div className="profile-step">
                      <span className="multi-steps">{step}</span>
                      <div className="step-section">
                        <h6>
                          {step === 1 && 'Specialty'}
                          {step === 2 && 'Appointment Type'}
                          {step === 3 && 'Date & Time'}
                          {step === 4 && 'Basic Information'}
                          {step === 5 && 'Review'}
                          {step === 6 && 'Confirmation'}
                        </h6>
                      </div>
                    </div>
                  </li>
                ))}
              </ul>
            </div>

            <div className="booking-widget multistep-form mb-5">

              {/* Show loading state only for step 1 */}
              {doctorLoading && currentStep === 1 ? (
                <div className="card booking-card mb-0">
                  <div className="card-body text-center py-5">
                    <div className="spinner-border text-primary mb-3" role="status">
                      <span className="visually-hidden">Loading...</span>
                    </div>
                    <p className="text-muted">Loading doctor information...</p>
                  </div>
                </div>
              ) : doctorError && !doctor && currentStep === 1 ? (
                <div className="card booking-card mb-0">
                  <div className="card-body">
                    <div className="alert alert-danger">
                      <h5>Error Loading Doctor</h5>
                      <p>{doctorError.response?.data?.message || doctorError.message || 'Failed to load doctor information'}</p>
                      <details style={{ marginTop: '10px' }}>
                        <summary>Error Details (Click to expand)</summary>
                        <pre style={{ fontSize: '10px', maxHeight: '200px', overflow: 'auto', marginTop: '10px' }}>
                          {JSON.stringify(doctorError, null, 2)}
                        </pre>
                      </details>
                      <button className="btn btn-primary mt-3" onClick={() => navigate('/search')}>Browse Doctors</button>
                    </div>
                  </div>
                </div>
              ) : (
                <>
                  {/* Step 1: Specialty & Services */}
                  {currentStep === 1 && (
                    <fieldset style={{ display: 'block', visibility: 'visible', opacity: 1, position: 'relative', width: '100%' }}>
                      <div className="card booking-card mb-0" style={{ display: 'block', visibility: 'visible', position: 'relative', zIndex: 1, width: '100%' }}>
                        <div className="card-header" style={{ display: 'block', width: '100%' }}>
                          <div className="booking-header pb-0">
                            <div className="card mb-0">
                              <div className="card-body">
                                <div className="d-flex align-items-center flex-wrap rpw-gap-2 row-gap-2">
                                  <span className="avatar avatar-xxxl avatar-rounded me-2 flex-shrink-0">
                                    <img 
                                      src={doctorImage || '/assets/img/clients/client-15.jpg'} 
                                      alt={doctorName || 'Doctor'}
                                      onError={(e) => {
                                        e.target.src = '/assets/img/clients/client-15.jpg'
                                      }}
                                    />
                                  </span>
                                  <div>
                                    <h4 className="mb-1">
                                      {doctorName || 'Loading Doctor...'} 
                                      {doctorRating > 0 && (
                                        <span className="badge bg-orange fs-12 ms-2">
                                          <i className="fa-solid fa-star me-1"></i>{doctorRating.toFixed(1)}
                                        </span>
                                      )}
                                    </h4>
                                    <p className="text-indigo mb-3 fw-medium">
                                      {doctorSpecializationName || 'Loading specialization...'}
                                    </p>
                                    <p className="mb-0">
                                      <i className="isax isax-location me-2"></i>{doctorLocation || 'Location not available'}
                                    </p>
                                  </div>
                                </div>
                              </div>
                            </div>
                          </div>
                        </div>
                        <div className="card-body booking-body">
                          <div className="card mb-0">
                            <div className="card-body pb-1">
                              <div className="mb-4 pb-4 border-bottom">
                                <label className="form-label">Speciality</label>
                                {doctorSpecialization ? (
                                  <>
                                    <div className="form-control" style={{ padding: '0.75rem', backgroundColor: '#f8f9fa' }}>
                                      {doctorSpecializationName || 'Not Specified'}
                                    </div>
                                    <input
                                      type="hidden"
                                      value={doctorSpecialization._id || doctorSpecialization}
                                      onChange={(e) => updateFormData('selectedSpecialization', e.target.value)}
                                    />
                                  </>
                                ) : (
                                  <div className="alert alert-warning mb-0">
                                    <i className="fa-solid fa-exclamation-triangle me-2"></i>
                                    This doctor has not specified a specialization yet. You can still proceed with the booking.
                                  </div>
                                )}
                              </div>
                              {doctorServices.length > 0 ? (
                                <>
                                  <h6 className="mb-3">Services</h6>
                                  <div className="row">
                                    {doctorServices.map((service, index) => (
                                      <div key={index} className="col-lg-4 col-md-6 mb-3">
                                        <div className={`card service-item ${formData.selectedServices.includes(index) ? 'border-primary' : ''}`} style={{ cursor: 'pointer' }}>
                                          <div className="card-body">
                                            <div className="form-check">
                                              <input
                                                className="form-check-input"
                                                type="checkbox"
                                                id={`service-${index}`}
                                                checked={formData.selectedServices.includes(index)}
                                                onChange={() => handleServiceToggle(index)}
                                              />
                                              <label className="form-check-label w-100" htmlFor={`service-${index}`}>
                                                <span className="service-title d-block mb-1 fw-medium">{service.name || service}</span>
                                                {service.price && <span className="fs-14 d-block text-primary">${service.price}</span>}
                                              </label>
                                            </div>
                                          </div>
                                        </div>
                                      </div>
                                    ))}
                                  </div>
                                </>
                              ) : (
                                <div className="alert alert-info">
                                  <p className="mb-0">No services available for this doctor. You can proceed to book a general consultation.</p>
                                </div>
                              )}
                            </div>
                          </div>
                        </div>
                        <div className="card-footer">
                          <div className="d-flex align-items-center flex-wrap rpw-gap-2 justify-content-between">
                            <button
                              type="button"
                              className="btn btn-md btn-dark inline-flex align-items-center rounded-pill"
                              onClick={() => navigate(-1)}
                            >
                              <i className="isax isax-arrow-left-2 me-1"></i>
                              Back
                            </button>
                            <button
                              type="button"
                              className="btn btn-md btn-primary-gradient inline-flex align-items-center rounded-pill"
                              onClick={handleNext}
                              disabled={doctorLoading}
                            >
                              Select Appointment Type
                              <i className="isax isax-arrow-right-3 ms-1"></i>
                            </button>
                          </div>
                        </div>
                      </div>
                    </fieldset>
                  )}

                  {/* Step 2: Appointment Type */}
                  {currentStep === 2 && (
                    <fieldset style={{ display: 'block', visibility: 'visible', opacity: 1 }}>
                      <div className="card booking-card mb-0">
                        <div className="card-body booking-body">
                          <h5 className="mb-4">Select Appointment Type</h5>
                          <div className="row">
                            <div className="col-md-6 mb-3">
                              <div
                                className={`card appointment-type-card ${formData.bookingType === 'VISIT' ? 'active' : ''}`}
                                style={{ 
                                  cursor: 'pointer',
                                  border: formData.bookingType === 'VISIT' ? '2px solid #007bff' : '1px solid #dee2e6',
                                  backgroundColor: formData.bookingType === 'VISIT' ? '#e7f3ff' : '#fff',
                                  transition: 'all 0.3s ease'
                                }}
                                onClick={(e) => {
                                  e.preventDefault()
                                  e.stopPropagation()
                                  updateFormData('bookingType', 'VISIT')
                                }}
                                onMouseEnter={(e) => {
                                  if (formData.bookingType !== 'VISIT') {
                                    e.currentTarget.style.borderColor = '#007bff'
                                    e.currentTarget.style.backgroundColor = '#f8f9fa'
                                  }
                                }}
                                onMouseLeave={(e) => {
                                  if (formData.bookingType !== 'VISIT') {
                                    e.currentTarget.style.borderColor = '#dee2e6'
                                    e.currentTarget.style.backgroundColor = '#fff'
                                  }
                                }}
                              >
                                <div className="card-body text-center">
                                  <i className="isax isax-hospital5 text-green mb-3" style={{ fontSize: '48px' }}></i>
                                  <h6>In-Person Visit</h6>
                                  <p className="text-muted mb-0">Visit the doctor at their clinic</p>
                                  {formData.bookingType === 'VISIT' && (
                                    <div className="mt-2">
                                      <i className="fa-solid fa-check-circle text-primary"></i> Selected
                                    </div>
                                  )}
                                </div>
                              </div>
                            </div>
                            <div className="col-md-6 mb-3">
                              <div
                                className={`card appointment-type-card ${formData.bookingType === 'ONLINE' ? 'active' : ''}`}
                                style={{ 
                                  cursor: 'pointer',
                                  border: formData.bookingType === 'ONLINE' ? '2px solid #007bff' : '1px solid #dee2e6',
                                  backgroundColor: formData.bookingType === 'ONLINE' ? '#e7f3ff' : '#fff',
                                  transition: 'all 0.3s ease'
                                }}
                                onClick={(e) => {
                                  e.preventDefault()
                                  e.stopPropagation()
                                  updateFormData('bookingType', 'ONLINE')
                                }}
                                onMouseEnter={(e) => {
                                  if (formData.bookingType !== 'ONLINE') {
                                    e.currentTarget.style.borderColor = '#007bff'
                                    e.currentTarget.style.backgroundColor = '#f8f9fa'
                                  }
                                }}
                                onMouseLeave={(e) => {
                                  if (formData.bookingType !== 'ONLINE') {
                                    e.currentTarget.style.borderColor = '#dee2e6'
                                    e.currentTarget.style.backgroundColor = '#fff'
                                  }
                                }}
                              >
                                <div className="card-body text-center">
                                  <i className="isax isax-video5 text-indigo mb-3" style={{ fontSize: '48px' }}></i>
                                  <h6>Online Consultation</h6>
                                  <p className="text-muted mb-0">Video call with the doctor</p>
                                  {formData.bookingType === 'ONLINE' && (
                                    <div className="mt-2">
                                      <i className="fa-solid fa-check-circle text-primary"></i> Selected
                                    </div>
                                  )}
                                </div>
                              </div>
                            </div>
                          </div>
                        </div>
                        <div className="card-footer">
                          <div className="d-flex align-items-center flex-wrap rpw-gap-2 justify-content-between">
                            <button
                              type="button"
                              className="btn btn-md btn-dark inline-flex align-items-center rounded-pill"
                              onClick={handlePrevious}
                            >
                              <i className="isax isax-arrow-left-2 me-1"></i>
                              Back
                            </button>
                            <button
                              type="button"
                              className="btn btn-md btn-primary-gradient inline-flex align-items-center rounded-pill"
                              onClick={handleNext}
                            >
                              Select Date & Time
                              <i className="isax isax-arrow-right-3 ms-1"></i>
                            </button>
                          </div>
                        </div>
                      </div>
                    </fieldset>
                  )}

                  {/* Step 3: Date & Time */}
                  {currentStep === 3 && (
                    <fieldset style={{ display: 'block', visibility: 'visible', opacity: 1, minHeight: '400px' }}>
                      <div className="card booking-card mb-0" style={{ display: 'block', visibility: 'visible', opacity: 1, border: '2px solid #ffc107' }}>
                    <div className="card-body booking-body">
                      <h5 className="mb-4">Select Date & Time</h5>
                      <div className="row">
                        <div className="col-md-6 mb-4">
                          <label className="form-label">Select Date</label>
                          <input
                            type="date"
                            className="form-control"
                            min={getMinDate()}
                            value={formData.appointmentDate}
                            onChange={(e) => handleAppointmentDateChange(e.target.value)}
                          />
                        </div>
                        <div className="col-md-6 mb-4">
                          <label className="form-label">Available Time Slots</label>
                          {slotsLoading ? (
                            <div className="text-center py-3">
                              <div className="spinner-border spinner-border-sm" role="status"></div>
                            </div>
                          ) : availableSlots.length === 0 ? (
                            <div className="alert alert-warning">
                              <p className="mb-0">No available slots for this date. Please select another date.</p>
                            </div>
                          ) : (
                            <div className="time-slots-grid" style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(100px, 1fr))', gap: '10px' }}>
                              {availableSlots.map((slot, index) => (
                                <button
                                  key={index}
                                  type="button"
                                  className={`btn btn-outline-primary ${formData.appointmentTime === slot.startTime ? 'active' : ''}`}
                                  style={{ marginBottom: '10px' }}
                                  onClick={() => updateFormData('appointmentTime', slot.startTime)}
                                >
                                  {slot.startTime}{slot.endTime ? ` – ${slot.endTime}` : ''}
                                </button>
                              ))}
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                    <div className="card-footer">
                      <div className="d-flex align-items-center flex-wrap rpw-gap-2 justify-content-between">
                        <button
                          type="button"
                          className="btn btn-md btn-dark inline-flex align-items-center rounded-pill"
                          onClick={handlePrevious}
                        >
                          <i className="isax isax-arrow-left-2 me-1"></i>
                          Back
                        </button>
                        <button
                          type="button"
                          className="btn btn-md btn-primary-gradient inline-flex align-items-center rounded-pill"
                          onClick={handleNext}
                        >
                          Continue
                          <i className="isax isax-arrow-right-3 ms-1"></i>
                        </button>
                      </div>
                    </div>
                  </div>
                    </fieldset>
                  )}

                  {/* Step 4: Basic Information */}
                  {currentStep === 4 && (
                    <fieldset style={{ display: 'block', visibility: 'visible', opacity: 1, minHeight: '400px' }}>
                      <div className="card booking-card mb-0" style={{ display: 'block', visibility: 'visible', opacity: 1, border: '2px solid #17a2b8' }}>
                    <div className="card-body booking-body">
                      <h5 className="mb-4">Basic Information</h5>
                      <div className="mb-3">
                        <label className="form-label">Patient Notes (Optional)</label>
                        <textarea
                          className="form-control"
                          rows="4"
                          placeholder="Any additional information you'd like to share with the doctor..."
                          value={formData.patientNotes}
                          onChange={(e) => updateFormData('patientNotes', e.target.value)}
                        />
                      </div>
                      {formData.bookingType === 'VISIT' && (
                        <div className="mb-3">
                          <label className="form-label">Clinic Name (Optional)</label>
                          <input
                            type="text"
                            className="form-control"
                            placeholder="Enter clinic name"
                            value={formData.clinicName}
                            onChange={(e) => updateFormData('clinicName', e.target.value)}
                          />
                        </div>
                      )}
                    </div>
                    <div className="card-footer">
                      <div className="d-flex align-items-center flex-wrap rpw-gap-2 justify-content-between">
                        <button
                          type="button"
                          className="btn btn-md btn-dark inline-flex align-items-center rounded-pill"
                          onClick={handlePrevious}
                        >
                          <i className="isax isax-arrow-left-2 me-1"></i>
                          Back
                        </button>
                        <button
                          type="button"
                          className="btn btn-md btn-primary-gradient inline-flex align-items-center rounded-pill"
                          onClick={handleNext}
                        >
                          Continue to Payment
                          <i className="isax isax-arrow-right-3 ms-1"></i>
                        </button>
                      </div>
                    </div>
                  </div>
                    </fieldset>
                  )}

                  {/* Step 5: Review charges & payment method */}
                  {currentStep === 5 && (
                    <fieldset style={{ display: 'block', visibility: 'visible', opacity: 1, minHeight: '400px' }}>
                      <div className="card booking-card mb-0" style={{ display: 'block', visibility: 'visible', opacity: 1, border: '2px solid #6f42c1' }}>
                    <div className="card-body booking-body">
                      <h5 className="mb-4">Review Charges & Payment Method</h5>
                      {quoteLoading ? (
                        <div className="text-center py-3">
                          <div className="spinner-border spinner-border-sm text-primary" role="status"></div>
                          <p className="mt-2 mb-0 text-muted">Calculating your total...</p>
                        </div>
                      ) : quoteError ? (
                        <div className="alert alert-danger">
                          <p className="mb-0">
                            {quoteError.response?.data?.message || quoteError.message || 'Could not calculate the booking price.'}
                          </p>
                        </div>
                      ) : quote && (
                        <div className="booking-summary mb-4">
                          <ul className="booking-fee list-unstyled mb-0">
                            <li className="d-flex justify-content-between py-1">
                              <span>Consultation Fee</span>
                              <span>{formatCurrency(quote.consultationFee, quote.currency)}</span>
                            </li>
                            {(quote.selectedServices || []).map((service, index) => (
                              <li key={`${service.name}-${index}`} className="d-flex justify-content-between py-1">
                                <span>{service.name}</span>
                                <span>{formatCurrency(service.price, quote.currency)}</span>
                              </li>
                            ))}
                            <li className="d-flex justify-content-between py-2 mt-2 border-top fw-bold">
                              <span>Total</span>
                              <span>{formatCurrency(quote.totalAmount, quote.currency)}</span>
                            </li>
                          </ul>
                        </div>
                      )}
                      <div className="mb-3">
                        <label className="form-label">Payment Method</label>
                        <select
                          className="form-control"
                          value={formData.paymentMethod}
                          onChange={(e) => updateFormData('paymentMethod', e.target.value)}
                        >
                          <option value="DUMMY">Test Payment (Dummy)</option>
                          <option value="CARD">Credit/Debit Card</option>
                          <option value="PAYPAL">PayPal</option>
                          <option value="BANK">Bank Transfer</option>
                        </select>
                      </div>
                      <div className="alert alert-info mb-0">
                        <p className="mb-0">The appointment is created and paid on the checkout page. The amount is always calculated by the server.</p>
                      </div>
                    </div>
                    <div className="card-footer">
                      <div className="d-flex align-items-center flex-wrap rpw-gap-2 justify-content-between">
                        <button
                          type="button"
                          className="btn btn-md btn-dark inline-flex align-items-center rounded-pill"
                          onClick={handlePrevious}
                        >
                          <i className="isax isax-arrow-left-2 me-1"></i>
                          Back
                        </button>
                        <button
                          type="button"
                          className="btn btn-md btn-primary-gradient inline-flex align-items-center rounded-pill"
                          onClick={handleNext}
                          disabled={quoteLoading || !!quoteError || !quote}
                        >
                          Review & Confirm
                          <i className="isax isax-arrow-right-3 ms-1"></i>
                        </button>
                      </div>
                    </div>
                  </div>
                    </fieldset>
                  )}

                  {/* Step 6: Confirmation */}
                  {currentStep === 6 && (
                    <fieldset style={{ display: 'block', visibility: 'visible', opacity: 1, minHeight: '400px' }}>
                      <div className="card booking-card mb-0" style={{ display: 'block', visibility: 'visible', opacity: 1, border: '2px solid #dc3545' }}>
                    <div className="card-body booking-body">
                      <h5 className="mb-4">Confirm Appointment</h5>
                      <div className="booking-summary">
                        <div className="row mb-3">
                          <div className="col-md-6">
                            <strong>Doctor:</strong> {doctorName}
                          </div>
                          <div className="col-md-6">
                            <strong>Specialization:</strong> {doctorSpecializationName}
                          </div>
                        </div>
                        <div className="row mb-3">
                          <div className="col-md-6">
                            <strong>Appointment Type:</strong> {formData.bookingType === 'VISIT' ? 'In-Person Visit' : 'Online Consultation'}
                          </div>
                          <div className="col-md-6">
                            <strong>Date:</strong> {formatDate(formData.appointmentDate)}
                          </div>
                        </div>
                        <div className="row mb-3">
                          <div className="col-md-6">
                            <strong>Time:</strong> {formData.appointmentTime || 'N/A'}
                          </div>
                          {formData.clinicName && (
                            <div className="col-md-6">
                              <strong>Clinic:</strong> {formData.clinicName}
                            </div>
                          )}
                        </div>
                        {selectedServiceNames.length > 0 && (
                          <div className="row mb-3">
                            <div className="col-12">
                              <strong>Services:</strong> {selectedServiceNames.join(', ')}
                            </div>
                          </div>
                        )}
                        {formData.patientNotes && (
                          <div className="row mb-3">
                            <div className="col-12">
                              <strong>Notes:</strong> {formData.patientNotes}
                            </div>
                          </div>
                        )}
                        {quote && (
                          <div className="row mb-3">
                            <div className="col-12">
                              <strong>Total Amount:</strong> {formatCurrency(quote.totalAmount, quote.currency)}
                            </div>
                          </div>
                        )}
                      </div>
                    </div>
                    <div className="card-footer">
                      <div className="d-flex align-items-center flex-wrap rpw-gap-2 justify-content-between">
                        <button
                          type="button"
                          className="btn btn-md btn-dark inline-flex align-items-center rounded-pill"
                          onClick={handlePrevious}
                        >
                          <i className="isax isax-arrow-left-2 me-1"></i>
                          Back
                        </button>
                        <button
                          type="button"
                          className="btn btn-md btn-primary-gradient inline-flex align-items-center rounded-pill"
                          onClick={handleSubmit}
                          disabled={quoteLoading || !!quoteError || !quote}
                        >
                          <i className="isax isax-arrow-right-3 me-1"></i>
                          Proceed to Checkout
                        </button>
                      </div>
                    </div>
                  </div>
                    </fieldset>
                  )}
                </>
              )}
            </div>

            <div className="text-center">
              <p className="mb-0">Copyright © {new Date().getFullYear()}. All Rights Reserved, Mydoctor+</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Booking
