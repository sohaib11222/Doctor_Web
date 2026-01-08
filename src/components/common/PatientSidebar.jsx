import { Link, useLocation } from 'react-router-dom'
import { useQuery } from '@tanstack/react-query'
import { useAuth } from '../../contexts/AuthContext'
import * as profileApi from '../../api/profile'
import { useUnreadNotificationsCount } from '../../queries/notificationQueries'

const PatientSidebar = () => {
  const location = useLocation()
  const { user } = useAuth()

  // Fetch user profile
  const { data: userProfileResponse, isLoading } = useQuery({
    queryKey: ['userProfile', user?._id],
    queryFn: () => profileApi.getUserProfile(user._id),
    enabled: !!user?._id
  })

  const isActive = (paths) => {
    if (Array.isArray(paths)) {
      return paths.some(path => location.pathname === path || location.pathname.startsWith(path + '/'))
    }
    return location.pathname === paths || location.pathname.startsWith(paths + '/')
  }

  // Extract user profile data
  const userProfile = userProfileResponse?.data || userProfileResponse || user || {}
  
  // Get patient info
  const patientName = userProfile.fullName || user?.fullName || 'Patient'
  const profileImage = userProfile.profileImage || user?.profileImage || '/assets/img/doctors-dashboard/profile-06.jpg'
  const gender = userProfile.gender || ''
  const dob = userProfile.dob ? new Date(userProfile.dob) : null
  
  // Calculate age from date of birth
  const calculateAge = (dateOfBirth) => {
    if (!dateOfBirth) return null
    const today = new Date()
    const birthDate = new Date(dateOfBirth)
    let years = today.getFullYear() - birthDate.getFullYear()
    let months = today.getMonth() - birthDate.getMonth()
    
    if (months < 0) {
      years--
      months += 12
    }
    
    if (years > 0) {
      return `${years} year${years > 1 ? 's' : ''}${months > 0 ? ` ${months} month${months > 1 ? 's' : ''}` : ''}`
    } else if (months > 0) {
      return `${months} month${months > 1 ? 's' : ''}`
    } else {
      const days = Math.floor((today - birthDate) / (1000 * 60 * 60 * 24))
      return `${days} day${days > 1 ? 's' : ''}`
    }
  }
  
  const age = calculateAge(dob)
  const genderDisplay = gender ? (gender.charAt(0) + gender.slice(1).toLowerCase()) : ''
  const patientId = user?._id ? `PT${user._id.slice(-6).toUpperCase()}` : 'PT000000'

  // Fetch unread notifications count
  const { data: unreadNotificationsCount = 0 } = useUnreadNotificationsCount()

  return (
    <div className="profile-sidebar patient-sidebar profile-sidebar-new">
      <div className="widget-profile pro-widget-content">
        <div className="profile-info-widget">
          <Link to="/profile-settings" className="booking-doc-img">
            <img 
              src={profileImage} 
              alt="Patient Profile" 
              onError={(e) => {
                e.target.src = '/assets/img/doctors-dashboard/profile-06.jpg'
              }}
            />
          </Link>
          <div className="profile-det-info">
            <h3>
              <Link to="/profile-settings">{patientName}</Link>
            </h3>
            <div className="patient-details">
              <h5 className="mb-0">Patient ID : {patientId}</h5>
            </div>
            {(genderDisplay || age) && (
              <span>
                {genderDisplay}
                {(genderDisplay && age) && <i className="fa-solid fa-circle"></i>}
                {age}
              </span>
            )}
          </div>
        </div>
      </div>
      <div className="dashboard-widget">
        <nav className="dashboard-menu">
          <ul>
            <li className={isActive('/patient/dashboard') ? 'active' : ''}>
              <Link to="/patient/dashboard">
                <i className="isax isax-category-2"></i>
                <span>Dashboard</span>
              </Link>
            </li>
            <li className={isActive(['/patient-appointments', '/patient-appointments-grid', '/patient-upcoming-appointment', '/patient-completed-appointment', '/patient-cancelled-appointment', '/patient-appointment-details']) ? 'active' : ''}>
              <Link to="/patient-appointments">
                <i className="isax isax-calendar-1"></i>
                <span>My Appointments</span>
              </Link>
            </li>
            <li className={isActive(['/map-view', '/clinic-navigation']) ? 'active' : ''}>
              <Link to="/map-view">
                <i className="isax isax-location"></i>
                <span>Nearby Clinics</span>
              </Link>
            </li>
            <li className={isActive('/favourites') ? 'active' : ''}>
              <Link to="/favourites">
                <i className="isax isax-star-1"></i>
                <span>Favourites</span>
              </Link>
            </li>
            {/* <li className={isActive('/dependent') ? 'active' : ''}>
              <Link to="/dependent">
                <i className="isax isax-user-octagon"></i>
                <span>Dependants</span>
              </Link>
            </li> */}
            <li className={isActive('/medical-records') ? 'active' : ''}>
              <Link to="/medical-records">
                <i className="isax isax-note-21"></i>
                <span>Medical Records</span>
              </Link>
            </li>
            <li className={isActive('/patient-accounts') ? 'active' : ''}>
              <Link to="/patient-accounts">
                <i className="isax isax-wallet-2"></i>
                <span>Wallet</span>
              </Link>
            </li>
            <li className={isActive('/patient-invoices') ? 'active' : ''}>
              <Link to="/patient-invoices">
                <i className="isax isax-document-text"></i>
                <span>Invoices</span>
              </Link>
            </li>
            <li className={isActive('/order-history') ? 'active' : ''}>
              <Link to="/order-history">
                <i className="isax isax-shopping-bag"></i>
                <span>Order History</span>
              </Link>
            </li>
            {/* <li className={isActive('/documents-download') ? 'active' : ''}>
              <Link to="/documents-download">
                <i className="isax isax-document-download"></i>
                <span>Documents</span>
              </Link>
            </li> */}
            <li className={isActive('/chat') ? 'active' : ''}>
              <Link to="/chat">
                <i className="isax isax-messages-1"></i>
                <span>Message</span>
                <small className="unread-msg">7</small>
              </Link>
            </li>
            <li className={isActive('/patient-notifications') ? 'active' : ''}>
              <Link to="/patient-notifications">
                <i className="isax isax-notification"></i>
                <span>Notifications</span>
                {unreadNotificationsCount > 0 && (
                  <small className="unread-msg">{unreadNotificationsCount > 99 ? '99+' : unreadNotificationsCount}</small>
                )}
              </Link>
            </li>
            {/* <li className={isActive('/medical-details') ? 'active' : ''}>
              <Link to="/medical-details">
                <i className="isax isax-note-1"></i>
                <span>Vitals</span>
              </Link>
            </li> */}
            <li className={isActive('/profile-settings') ? 'active' : ''}>
              <Link to="/profile-settings">
                <i className="isax isax-setting-2"></i>
                <span>Settings</span>
              </Link>
            </li>
            <li>
              <Link to="/login">
                <i className="isax isax-logout"></i>
                <span>Logout</span>
              </Link>
            </li>
          </ul>
        </nav>
      </div>
    </div>
  )
}

export default PatientSidebar

