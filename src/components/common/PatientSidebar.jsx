import { Link, useLocation } from 'react-router-dom'

const PatientSidebar = () => {
  const location = useLocation()
  const isActive = (paths) => {
    if (Array.isArray(paths)) {
      return paths.some(path => location.pathname === path || location.pathname.startsWith(path + '/'))
    }
    return location.pathname === paths || location.pathname.startsWith(paths + '/')
  }

  return (
    <div className="profile-sidebar patient-sidebar profile-sidebar-new">
      <div className="widget-profile pro-widget-content">
        <div className="profile-info-widget">
          <Link to="/profile-settings" className="booking-doc-img">
            <img src="/assets/img/doctors-dashboard/profile-06.jpg" alt="User Image" />
          </Link>
          <div className="profile-det-info">
            <h3>
              <Link to="/profile-settings">Hendrita Hayes</Link>
            </h3>
            <div className="patient-details">
              <h5 className="mb-0">Patient ID : PT254654</h5>
            </div>
            <span>Female <i className="fa-solid fa-circle"></i> 32 years 03 Months</span>
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
            <li className={isActive('/favourites') ? 'active' : ''}>
              <Link to="/favourites">
                <i className="isax isax-star-1"></i>
                <span>Favourites</span>
              </Link>
            </li>
            <li className={isActive('/dependent') ? 'active' : ''}>
              <Link to="/dependent">
                <i className="isax isax-user-octagon"></i>
                <span>Dependants</span>
              </Link>
            </li>
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
                <i className="fe fe-shopping-bag"></i>
                <span>Order History</span>
              </Link>
            </li>
            <li className={isActive('/documents-download') ? 'active' : ''}>
              <Link to="/documents-download">
                <i className="fe fe-download"></i>
                <span>Documents</span>
              </Link>
            </li>
            <li className={isActive('/chat') ? 'active' : ''}>
              <Link to="/chat">
                <i className="isax isax-messages-1"></i>
                <span>Message</span>
                <small className="unread-msg">7</small>
              </Link>
            </li>
            <li className={isActive('/medical-details') ? 'active' : ''}>
              <Link to="/medical-details">
                <i className="isax isax-note-1"></i>
                <span>Vitals</span>
              </Link>
            </li>
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

