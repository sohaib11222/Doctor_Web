import { Link, useLocation } from 'react-router-dom'

const Sidebar = ({ userType = 'patient' }) => {
  const location = useLocation()
  const isActive = (path) => location.pathname === path || location.pathname.startsWith(path + '/')

  if (userType === 'doctor') {
    return (
      <div className="sidebar sidebar-doctor">
        <div className="sidebar-inner">
          <ul className="sidebar-menu">
            <li className={isActive('/doctor-dashboard') ? 'active' : ''}>
              <Link to="/doctor-dashboard">
                <i className="feather-grid"></i> <span>Dashboard</span>
              </Link>
            </li>
            <li className={isActive('/appointments') ? 'active' : ''}>
              <Link to="/appointments">
                <i className="feather-calendar"></i> <span>Appointments</span>
              </Link>
            </li>
            <li className={isActive('/my-patients') ? 'active' : ''}>
              <Link to="/my-patients">
                <i className="feather-users"></i> <span>My Patients</span>
              </Link>
            </li>
            <li className={isActive('/schedule-timings') ? 'active' : ''}>
              <Link to="/schedule-timings">
                <i className="feather-clock"></i> <span>Schedule Timings</span>
              </Link>
            </li>
            <li className={isActive('/available-timings') ? 'active' : ''}>
              <Link to="/available-timings">
                <i className="feather-calendar"></i> <span>Available Timings</span>
              </Link>
            </li>
            <li className={isActive('/invoices') ? 'active' : ''}>
              <Link to="/invoices">
                <i className="feather-file-text"></i> <span>Invoices</span>
              </Link>
            </li>
            <li className={isActive('/reviews') ? 'active' : ''}>
              <Link to="/reviews">
                <i className="feather-star"></i> <span>Reviews</span>
              </Link>
            </li>
            <li className={isActive('/doctor-profile-settings') ? 'active' : ''}>
              <Link to="/doctor-profile-settings">
                <i className="feather-user"></i> <span>Profile Settings</Link>
              </Link>
            </li>
            <li className={isActive('/doctor-change-password') ? 'active' : ''}>
              <Link to="/doctor-change-password">
                <i className="feather-lock"></i> <span>Change Password</span>
              </Link>
            </li>
          </ul>
        </div>
      </div>
    )
  }

  if (userType === 'patient') {
    return (
      <div className="sidebar sidebar-patient">
        <div className="sidebar-inner">
          <ul className="sidebar-menu">
            <li className={isActive('/patient-dashboard') ? 'active' : ''}>
              <Link to="/patient-dashboard">
                <i className="feather-grid"></i> <span>Dashboard</span>
              </Link>
            </li>
            <li className={isActive('/patient-appointments') ? 'active' : ''}>
              <Link to="/patient-appointments">
                <i className="feather-calendar"></i> <span>Appointments</span>
              </Link>
            </li>
            <li className={isActive('/favourites') ? 'active' : ''}>
              <Link to="/favourites">
                <i className="feather-heart"></i> <span>Favourites</span>
              </Link>
            </li>
            <li className={isActive('/chat') ? 'active' : ''}>
              <Link to="/chat">
                <i className="feather-message-circle"></i> <span>Messages</span>
              </Link>
            </li>
            <li className={isActive('/profile-settings') ? 'active' : ''}>
              <Link to="/profile-settings">
                <i className="feather-user"></i> <span>Profile Settings</span>
              </Link>
            </li>
            <li className={isActive('/change-password') ? 'active' : ''}>
              <Link to="/change-password">
                <i className="feather-lock"></i> <span>Change Password</span>
              </Link>
            </li>
            <li className={isActive('/dependent') ? 'active' : ''}>
              <Link to="/dependent">
                <i className="feather-users"></i> <span>Dependent</span>
              </Link>
            </li>
            <li className={isActive('/patient-accounts') ? 'active' : ''}>
              <Link to="/patient-accounts">
                <i className="feather-credit-card"></i> <span>Accounts</span>
              </Link>
            </li>
            <li className={isActive('/patient-invoices') ? 'active' : ''}>
              <Link to="/patient-invoices">
                <i className="feather-file-text"></i> <span>Invoices</span>
              </Link>
            </li>
            <li className={isActive('/medical-records') ? 'active' : ''}>
              <Link to="/medical-records">
                <i className="feather-file"></i> <span>Medical Records</span>
              </Link>
            </li>
          </ul>
        </div>
      </div>
    )
  }

  if (userType === 'admin') {
    return (
      <div className="sidebar sidebar-admin">
        <div className="sidebar-inner">
          <ul className="sidebar-menu">
            <li className={isActive('/admin/index_admin') ? 'active' : ''}>
              <Link to="/admin/index_admin">
                <i className="feather-grid"></i> <span>Dashboard</span>
              </Link>
            </li>
            <li className={isActive('/admin/appointment-list') ? 'active' : ''}>
              <Link to="/admin/appointment-list">
                <i className="feather-calendar"></i> <span>Appointments</span>
              </Link>
            </li>
            <li className={isActive('/admin/specialities') ? 'active' : ''}>
              <Link to="/admin/specialities">
                <i className="feather-layers"></i> <span>Specialities</span>
              </Link>
            </li>
            <li className={isActive('/admin/doctor-list') ? 'active' : ''}>
              <Link to="/admin/doctor-list">
                <i className="feather-users"></i> <span>Doctor List</span>
              </Link>
            </li>
            <li className={isActive('/admin/patient-list') ? 'active' : ''}>
              <Link to="/admin/patient-list">
                <i className="feather-users"></i> <span>Patient List</span>
              </Link>
            </li>
            <li className={isActive('/admin/reviews') ? 'active' : ''}>
              <Link to="/admin/reviews">
                <i className="feather-star"></i> <span>Reviews</span>
              </Link>
            </li>
            <li className={isActive('/admin/transactions-list') ? 'active' : ''}>
              <Link to="/admin/transactions-list">
                <i className="feather-credit-card"></i> <span>Transactions</span>
              </Link>
            </li>
            <li className={isActive('/admin/settings') ? 'active' : ''}>
              <Link to="/admin/settings">
                <i className="feather-settings"></i> <span>Settings</span>
              </Link>
            </li>
          </ul>
        </div>
      </div>
    )
  }

  if (userType === 'pharmacy_admin') {
    return (
      <div className="sidebar sidebar-pharmacy-admin">
        <div className="sidebar-inner">
          <ul className="sidebar-menu">
            <li className={isActive('/pharmacy-admin/index_pharmacy_admin') ? 'active' : ''}>
              <Link to="/pharmacy-admin/index_pharmacy_admin">
                <i className="feather-grid"></i> <span>Dashboard</span>
              </Link>
            </li>
            <li className={isActive('/pharmacy-admin/products') ? 'active' : ''}>
              <Link to="/pharmacy-admin/products">
                <i className="feather-package"></i> <span>Products</span>
              </Link>
            </li>
            <li className={isActive('/pharmacy-admin/categories') ? 'active' : ''}>
              <Link to="/pharmacy-admin/categories">
                <i className="feather-layers"></i> <span>Categories</span>
              </Link>
            </li>
            <li className={isActive('/pharmacy-admin/order') ? 'active' : ''}>
              <Link to="/pharmacy-admin/order">
                <i className="feather-shopping-cart"></i> <span>Orders</span>
              </Link>
            </li>
            <li className={isActive('/pharmacy-admin/sales') ? 'active' : ''}>
              <Link to="/pharmacy-admin/sales">
                <i className="feather-trending-up"></i> <span>Sales</span>
              </Link>
            </li>
            <li className={isActive('/pharmacy-admin/supplier') ? 'active' : ''}>
              <Link to="/pharmacy-admin/supplier">
                <i className="feather-truck"></i> <span>Suppliers</span>
              </Link>
            </li>
            <li className={isActive('/pharmacy-admin/settings') ? 'active' : ''}>
              <Link to="/pharmacy-admin/settings">
                <i className="feather-settings"></i> <span>Settings</span>
              </Link>
            </li>
          </ul>
        </div>
      </div>
    )
  }

  return null
}

export default Sidebar

