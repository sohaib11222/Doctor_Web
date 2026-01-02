import { Link, useLocation } from 'react-router-dom'
import { useQuery } from '@tanstack/react-query'
import { useAuth } from '../../contexts/AuthContext'
import * as profileApi from '../../api/profile'

const DoctorSidebar = () => {
  const location = useLocation()
  const { user } = useAuth()

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

  const isActive = (paths) => {
    if (Array.isArray(paths)) {
      return paths.some(path => location.pathname === path || location.pathname.startsWith(path + '/'))
    }
    return location.pathname === paths || location.pathname.startsWith(paths + '/')
  }

  // Extract data
  const doctorData = doctorProfile?.data || {}
  const userData = userProfile?.data || user || {}
  
  // Get doctor info
  const doctorName = userData.fullName || 'Dr. ' + (user?.fullName || 'Doctor')
  const doctorTitle = doctorData.title || ''
  const specialization = doctorData.specialization
  const specializationName = specialization?.name || ''
  const profileImage = userData.profileImage || doctorData.userId?.profileImage || '/assets/img/doctors-dashboard/doctor-profile-img.jpg'
  
  // Format display name with title
  const displayName = doctorName.startsWith('Dr.') ? doctorName : `Dr. ${doctorName}`
  const designation = doctorTitle ? `${doctorTitle}${specializationName ? ` - ${specializationName}` : ''}` : specializationName || ''

  return (
    <div className="profile-sidebar doctor-sidebar profile-sidebar-new">
      <div className="widget-profile pro-widget-content">
        <div className="profile-info-widget">
          <Link to="/doctor-profile" className="booking-doc-img">
            <img 
              src={profileImage} 
              alt="Doctor Profile" 
              onError={(e) => {
                e.target.src = '/assets/img/doctors-dashboard/doctor-profile-img.jpg'
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
          <select className="select form-control">
            <option>I am Available Now</option>
            <option>Not Available</option>
          </select>
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
                <small className="unread-msg">2</small>
              </Link>
            </li>
            <li className={isActive(['/appointments', '/doctor-appointments-grid', '/doctor-appointment-details', '/doctor-upcoming-appointment', '/doctor-completed-appointment', '/doctor-cancelled-appointment', '/doctor-appointment-start']) ? 'active' : ''}>
              <Link to="/appointments">
                <i className="fa-solid fa-calendar-days"></i>
                <span>Appointments</span>
              </Link>
            </li>
            <li className={isActive('/available-timings') ? 'active' : ''}>
              <Link to="/available-timings">
                <i className="fa-solid fa-calendar-day"></i>
                <span>Available Timings</span>
              </Link>
            </li>
            <li className={isActive(['/my-patients', '/patient-profile']) ? 'active' : ''}>
              <Link to="/my-patients">
                <i className="fa-solid fa-user-injured"></i>
                <span>My Patients</span>
              </Link>
            </li>
            <li className={isActive('/doctor-specialities') ? 'active' : ''}>
              <Link to="/doctor-specialities">
                <i className="fa-solid fa-clock"></i>
                <span>Specialties & Services</span>
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
                <small className="unread-msg">7</small>
              </Link>
            </li>
            <li className={isActive('/doctor/admin-chat') ? 'active' : ''}>
              <Link to="/doctor/admin-chat">
                <i className="fa-solid fa-headset"></i>
                <span>Admin Messages</span>
                <small className="unread-msg">2</small>
              </Link>
            </li>
            <li className={isActive('/doctor/announcements') ? 'active' : ''}>
              <Link to="/doctor/announcements">
                <i className="fa-solid fa-bullhorn"></i>
                <span>Announcements</span>
                <small className="unread-msg">3</small>
              </Link>
            </li>
            <li className={isActive(['/blog', '/blog/create', '/blog/edit']) ? 'active' : ''}>
              <Link to="/blog">
                <i className="fa-solid fa-blog"></i>
                <span>Blog Posts</span>
              </Link>
            </li>
            <li className={isActive('/doctor/products') ? 'active' : ''}>
              <Link to="/doctor/products">
                <i className="fa-solid fa-box"></i>
                <span>Products</span>
              </Link>
            </li>
            <li className={isActive(['/pharmacy-orders', '/pharmacy-order-details']) ? 'active' : ''}>
              <Link to="/pharmacy-orders">
                <i className="fa-solid fa-shopping-bag"></i>
                <span>Pharmacy Orders</span>
              </Link>
            </li>
            <li className={isActive('/doctor/subscription-plans') ? 'active' : ''}>
              <Link to="/doctor/subscription-plans">
                <i className="fa-solid fa-crown"></i>
                <span>Subscription</span>
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
