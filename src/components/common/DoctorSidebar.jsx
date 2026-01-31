import { Link, useLocation } from 'react-router-dom'
import { useState, useEffect, useMemo } from 'react'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { useAuth } from '../../contexts/AuthContext'
import * as profileApi from '../../api/profile'
import * as weeklyScheduleApi from '../../api/weeklySchedule'
import * as subscriptionApi from '../../api/subscription'
import * as appointmentApi from '../../api/appointments'
import * as rescheduleApi from '../../api/rescheduleRequest'
import { useUnreadNotificationsCount } from '../../queries/notificationQueries'
import { toast } from 'react-toastify'

const DoctorSidebar = () => {
  const location = useLocation()
  const { user } = useAuth()
  const queryClient = useQueryClient()

  // Fetch doctor profile
  const { data: doctorProfile } = useQuery({
    queryKey: ['doctorProfile'],
    queryFn: () => profileApi.getDoctorProfile(),
    enabled: !!user
  })

  // Fetch user profile for additional info
  const { data: userProfile } = useQuery({
    queryKey: ['userProfile', user?._id],
    queryFn: () => profileApi.getUserProfile(user._id),
    enabled: !!user?._id
  })

  // Extract data
  const doctorData = doctorProfile?.data || doctorProfile || {}
  const userData = userProfile?.data || userProfile || user || {}
  
  // Debug: Log doctor profile data in development
  useEffect(() => {
    if (import.meta.env.DEV && doctorProfile) {
      console.log('🔍 DoctorSidebar - Doctor Profile Data:', {
        rawResponse: doctorProfile,
        extractedDoctorData: doctorData,
        userId: doctorData.userId,
        userIdProfileImage: doctorData.userId?.profileImage,
        userDataProfileImage: userData.profileImage,
        userProfileImage: user?.profileImage
      })
    }
  }, [doctorProfile, doctorData, userData, user])
  
  // Normalize image URL helper function
  const normalizeImageUrl = (imageUri) => {
    if (!imageUri || typeof imageUri !== 'string') return null
    const trimmedUri = imageUri.trim()
    if (!trimmedUri) return null
    // If already a full URL, return as-is
    if (trimmedUri.startsWith('http://') || trimmedUri.startsWith('https://')) {
      return trimmedUri
    }
    // Otherwise, build full URL from base
    const apiBaseURL = import.meta.env.VITE_API_URL || 'https://mydoctoradmin.mydoctorplus.it/api'
    const baseURL = apiBaseURL.replace('/api', '')
    const imagePath = trimmedUri.startsWith('/') ? trimmedUri : `/${trimmedUri}`
    const fullUrl = `${baseURL}${imagePath}`
    
    // Debug logging
    if (import.meta.env.DEV && imageUri) {
      console.log('🔍 DoctorSidebar - Image URL normalization:', {
        original: imageUri,
        baseURL: baseURL,
        imagePath: imagePath,
        normalized: fullUrl
      })
    }
    
    return fullUrl
  }
  
  // Compute current availability value from profile - handle false explicitly
  // If isAvailableOnline is explicitly false, show "not-available", otherwise show "available"
  const currentAvailabilityValue = useMemo(() => {
    if (doctorData.isAvailableOnline === false) {
      return 'not-available'
    }
    // If true or undefined/null, default to available
    return 'available'
  }, [doctorData.isAvailableOnline])
  
  // State for availability
  const [availability, setAvailability] = useState(currentAvailabilityValue)

  // Update state when profile data changes
  useEffect(() => {
    setAvailability(currentAvailabilityValue)
  }, [currentAvailabilityValue])

  // Update availability mutation
  const updateAvailabilityMutation = useMutation({
    mutationFn: (isAvailable) => profileApi.updateDoctorProfile({ isAvailableOnline: isAvailable }),
    onSuccess: () => {
      queryClient.invalidateQueries(['doctorProfile'])
      toast.success('Availability updated successfully!')
    },
    onError: (error) => {
      const errorMessage = error.response?.data?.message || error.message || 'Failed to update availability'
      toast.error(errorMessage)
    }
  })

  // Handle availability update
  const handleUpdateAvailability = () => {
    const isAvailable = availability === 'available'
    updateAvailabilityMutation.mutate(isAvailable)
  }

  const isActive = (paths) => {
    if (Array.isArray(paths)) {
      return paths.some(path => location.pathname === path || location.pathname.startsWith(path + '/'))
    }
    return location.pathname === paths || location.pathname.startsWith(paths + '/')
  }
  
  // Get doctor info - prioritize doctorData.userId from API response
  const doctorUserId = doctorData.userId || {}
  const doctorName = doctorUserId.fullName || userData.fullName || user?.fullName || 'Dr. ' + (user?.fullName || 'Doctor')
  const doctorTitle = doctorData.title || ''
  const specialization = doctorData.specialization
  const specializationName = specialization?.name || ''
  
  // Get profile image - prioritize doctorData.userId.profileImage from API response
  const profileImageUrl = doctorUserId.profileImage || userData.profileImage || user?.profileImage
  
  // Debug logging
  if (import.meta.env.DEV) {
    console.log('🔍 DoctorSidebar - Profile Image Debug:', {
      doctorUserId: doctorUserId,
      doctorUserIdProfileImage: doctorUserId.profileImage,
      userDataProfileImage: userData.profileImage,
      userProfileImage: user?.profileImage,
      finalProfileImageUrl: profileImageUrl,
      normalized: normalizeImageUrl(profileImageUrl)
    })
  }
  
  const profileImage = normalizeImageUrl(profileImageUrl) || '/assets/img/doctors-dashboard/doctor-profile-img.jpg'
  
  // Format display name with title
  const displayName = doctorName.startsWith('Dr.') ? doctorName : `Dr. ${doctorName}`
  const designation = doctorTitle ? `${doctorTitle}${specializationName ? ` - ${specializationName}` : ''}` : specializationName || ''

  // Fetch unread notifications count
  const { data: unreadNotificationsCount = 0 } = useUnreadNotificationsCount()

  // Fetch pending appointment requests count
  const { data: pendingAppointmentsData } = useQuery({
    queryKey: ['doctorPendingAppointmentsCount'],
    queryFn: async () => {
      const response = await appointmentApi.listAppointments({ status: 'PENDING', limit: 1 })
      return response.data || response
    },
    enabled: !!user,
    retry: 1,
    refetchInterval: 30000 // Refetch every 30 seconds to keep count updated
  })

  // Extract pending appointments count
  const pendingAppointmentsCount = useMemo(() => {
    if (!pendingAppointmentsData) return 0
    const data = pendingAppointmentsData.data || pendingAppointmentsData
    return data.pagination?.total || data.appointments?.length || 0
  }, [pendingAppointmentsData])

  // Fetch pending reschedule requests count
  const { data: pendingRescheduleRequestsData } = useQuery({
    queryKey: ['doctorPendingRescheduleRequestsCount'],
    queryFn: async () => {
      const response = await rescheduleApi.listRescheduleRequests({ status: 'PENDING' })
      return response.data || response
    },
    enabled: !!user,
    retry: 1,
    refetchInterval: 30000 // Refetch every 30 seconds to keep count updated
  })

  // Extract pending reschedule requests count
  const pendingRescheduleRequestsCount = useMemo(() => {
    if (!pendingRescheduleRequestsData) return 0
    const requests = Array.isArray(pendingRescheduleRequestsData) 
      ? pendingRescheduleRequestsData 
      : (pendingRescheduleRequestsData.data || [])
    return requests.length || 0
  }, [pendingRescheduleRequestsData])

  // Fetch weekly schedule to check if timings are set
  const { data: weeklySchedule } = useQuery({
    queryKey: ['weeklySchedule'],
    queryFn: async () => {
      const response = await weeklyScheduleApi.getWeeklySchedule()
      return response.data || response
    },
    enabled: !!user,
    retry: 1
  })

  // Fetch subscription to check if active subscription exists
  const { data: mySubscription } = useQuery({
    queryKey: ['mySubscription'],
    queryFn: async () => {
      const response = await subscriptionApi.getMySubscription()
      return response.data || response
    },
    enabled: !!user,
    retry: 1
  })

  // Check if timings are set
  const hasTimings = useMemo(() => {
    if (!weeklySchedule) return false
    const schedule = weeklySchedule.data || weeklySchedule
    return schedule.days && schedule.days.some(day => 
      day.timeSlots && day.timeSlots.length > 0
    )
  }, [weeklySchedule])

  // Check if subscription is active
  const hasActiveSubscription = useMemo(() => {
    if (!mySubscription) return false
    const subscription = mySubscription.data || mySubscription
    return subscription.hasActiveSubscription === true || 
      (subscription.subscriptionPlan && subscription.subscriptionExpiresAt && 
       new Date(subscription.subscriptionExpiresAt) > new Date())
  }, [mySubscription])

  return (
    <div className="profile-sidebar doctor-sidebar profile-sidebar-new">
      <style>{`
        .doctor-sidebar.profile-sidebar-new .profile-info-widget::after {
          background-image: none !important;
          background-color: white !important;
        }
      `}</style>
      <div className="widget-profile pro-widget-content">
        <div className="profile-info-widget">
          <Link to="/doctor-profile" className="booking-doc-img">
            <img 
              src={profileImage} 
              alt="Doctor Profile" 
              onError={(e) => {
                console.error('❌ DoctorSidebar - Image failed to load:', {
                  attemptedUrl: e.target.src,
                  profileImage: profileImage,
                  profileImageUrl: profileImageUrl
                })
                e.target.src = '/assets/img/doctors-dashboard/doctor-profile-img.jpg'
              }}
              onLoad={() => {
                if (import.meta.env.DEV) {
                  console.log('✅ DoctorSidebar - Image loaded successfully:', profileImage)
                }
              }}
            />
          </Link>
          <div className="profile-det-info">
            <h3>
              <Link to="/doctor-profile">{displayName}</Link>
            </h3>
            {designation && (
              <div className="patient-details">
                <h5 className="mb-0">{designation}</h5>
              </div>
            )}
            {specializationName && (
              <span className="badge doctor-role-badge">
                <i className="fa-solid fa-circle"></i>{specializationName}
              </span>
            )}
          </div>
        </div>
      </div>
      <div className="doctor-available-head">
        <div className="input-block input-block-new">
          <label className="form-label">Availability <span className="text-danger">*</span></label>
          <select 
            className="select form-control"
            value={availability}
            onChange={(e) => setAvailability(e.target.value)}
            disabled={updateAvailabilityMutation.isPending}
          >
            <option value="available">I am Available Now</option>
            <option value="not-available">Not Available</option>
          </select>
          <button
            className="btn btn-primary btn-sm w-100 mt-2"
            onClick={handleUpdateAvailability}
            disabled={updateAvailabilityMutation.isPending}
            style={{ marginTop: '10px' }}
          >
            {updateAvailabilityMutation.isPending ? (
              <>
                <span className="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></span>
                Updating...
              </>
            ) : (
              'Update'
            )}
          </button>
        </div>
      </div>
      <div className="dashboard-widget">
        <nav className="dashboard-menu">
          <ul>
            <li className={isActive('/doctor/dashboard') ? 'active' : ''}>
              <Link to="/doctor/dashboard">
                <i className="fa-solid fa-shapes"></i>
                <span>Dashboard</span>
              </Link>
            </li>
            <li className={isActive('/doctor-request') ? 'active' : ''}>
              <Link to="/doctor-request">
                <i className="fa-solid fa-calendar-check"></i>
                <span>Requests</span>
                {pendingAppointmentsCount > 0 && (
                  <small className="unread-msg">{pendingAppointmentsCount > 99 ? '99+' : pendingAppointmentsCount}</small>
                )}
              </Link>
            </li>
            <li className={isActive(['/appointments', '/doctor-appointments-grid', '/doctor-appointment-details', '/doctor-upcoming-appointment', '/doctor-completed-appointment', '/doctor-cancelled-appointment', '/doctor-appointment-start']) ? 'active' : ''}>
              <Link to="/appointments">
                <i className="fa-solid fa-calendar-days"></i>
                <span>Appointments</span>
              </Link>
            </li>
            <li className={isActive('/doctor/reschedule-requests') ? 'active' : ''}>
              <Link to="/doctor/reschedule-requests">
                <i className="fa-solid fa-calendar-xmark"></i>
                <span>Reschedule Requests</span>
                {pendingRescheduleRequestsCount > 0 && (
                  <small className="unread-msg">{pendingRescheduleRequestsCount > 99 ? '99+' : pendingRescheduleRequestsCount}</small>
                )}
              </Link>
            </li>
            <li className={isActive('/available-timings') ? 'active' : ''}>
              <Link to="/available-timings">
                <i className="fa-solid fa-calendar-day"></i>
                <span>Available Timings</span>
                {!hasTimings && (
                  <i className="fa-solid fa-exclamation-triangle text-danger ms-2" 
                     style={{ fontSize: '14px' }} 
                     title="No available timings set. Please add timings to allow patients to book appointments."></i>
                )}
              </Link>
            </li>
            <li className={isActive(['/my-patients', '/patient-profile']) ? 'active' : ''}>
              <Link to="/my-patients">
                <i className="fa-solid fa-user-injured"></i>
                <span>My Patients</span>
              </Link>
            </li>
            <li className={isActive('/reviews') ? 'active' : ''}>
              <Link to="/reviews">
                <i className="fas fa-star"></i>
                <span>Reviews</span>
              </Link>
            </li>
            <li className={isActive('/invoices') ? 'active' : ''}>
              <Link to="/invoices">
                <i className="fa-solid fa-file-lines"></i>
                <span>Invoices</span>
              </Link>
            </li>
            <li className={isActive('/doctor-payment') ? 'active' : ''}>
              <Link to="/doctor-payment">
                <i className="fa-solid fa-money-bill-1"></i>
                <span>Payout Settings</span>
              </Link>
            </li>
            <li className={isActive('/chat-doctor') ? 'active' : ''}>
              <Link to="/chat-doctor">
                <i className="fa-solid fa-comments"></i>
                <span>Message</span>
                {/* <small className="unread-msg">7</small> */}
              </Link>
            </li>
            <li className={isActive('/doctor/admin-chat') ? 'active' : ''}>
              <Link to="/doctor/admin-chat">
                <i className="fa-solid fa-headset"></i>
                <span>Admin Messages</span>
                {/* <small className="unread-msg">2</small> */}
              </Link>
            </li>
            <li className={isActive('/doctor/announcements') ? 'active' : ''}>
              <Link to="/doctor/announcements">
                <i className="fa-solid fa-bullhorn"></i>
                <span>Announcements</span>
                {/* <small className="unread-msg">3</small> */}   
              </Link>
            </li>
            <li className={isActive('/doctor-notifications') ? 'active' : ''}>
              <Link to="/doctor-notifications">
                <i className="isax isax-notification"></i>
                <span>Notifications</span>
                {unreadNotificationsCount > 0 && (
                  <small className="unread-msg">{unreadNotificationsCount > 99 ? '99+' : unreadNotificationsCount}</small>
                )}
              </Link>
            </li>
            <li className={isActive(['/blog', '/blog/create', '/blog/edit']) ? 'active' : ''}>
              <Link to="/blog">
                <i className="fa-solid fa-blog"></i>
                <span>Blog Posts</span>
              </Link>
            </li>
            <li className={isActive('/doctor/subscription-plans') ? 'active' : ''}>
              <Link to="/doctor/subscription-plans">
                <i className="fa-solid fa-crown"></i>
                <span>Subscription</span>
                {!hasActiveSubscription && (
                  <i className="fa-solid fa-exclamation-triangle text-danger ms-2" 
                     style={{ fontSize: '14px' }} 
                     title="No active subscription. Please purchase a subscription plan to allow patients to book appointments."></i>
                )}
              </Link>
            </li>
            <li className={isActive(['/doctor-profile-settings', '/doctor-experience-settings', '/doctor-education-settings', '/doctor-awards-settings', '/doctor-insurance-settings', '/doctor-clinics-settings', '/doctor-business-settings']) ? 'active' : ''}>
              <Link to="/doctor-profile-settings">
                <i className="fa-solid fa-user-pen"></i>
                <span>Profile Settings</span>
              </Link>
            </li>
            <li className={isActive('/social-media') ? 'active' : ''}>
              <Link to="/social-media">
                <i className="fa-solid fa-shield-halved"></i>
                <span>Social Media</span>
              </Link>
            </li>
            <li className={isActive('/doctor-change-password') ? 'active' : ''}>
              <Link to="/doctor-change-password">
                <i className="fa-solid fa-key"></i>
                <span>Change Password</span>
              </Link>
            </li>
            <li>
              <Link to="/login">
                <i className="fa-solid fa-calendar-check"></i>
                <span>Logout</span>
              </Link>
            </li>
          </ul>
        </nav>
      </div>
    </div>
  )
}

export default DoctorSidebar
