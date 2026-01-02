import { Link, useLocation, useNavigate } from 'react-router-dom'
import { useAuth } from '../../contexts/AuthContext'
import { useState, useEffect } from 'react'

const Header = () => {
  const location = useLocation()
  const navigate = useNavigate()
  const { user, logout } = useAuth()
  const [isMenuOpen, setIsMenuOpen] = useState(false)

  const isActive = (path) => location.pathname === path || location.pathname.startsWith(path + '/')
  const isIndexPage = location.pathname === '/' || location.pathname === '/index'
  const isPharmacyIndex = location.pathname === '/pharmacy-index'

  const handleLogout = () => {
    logout()
    navigate('/login')
  }

  // Helper functions for role-based visibility
  const getUserRole = () => {
    if (!user?.role) return null
    return user.role.toUpperCase()
  }

  const getUserStatus = () => {
    if (!user?.status) return null
    return user.status.toUpperCase()
  }

  // Check if user can access a route based on role
  const canAccess = (allowedRoles, requireApproved = false) => {
    if (!user) return false
    
    const userRole = getUserRole()
    if (!userRole) return false
    
    const userStatus = getUserStatus()
    
    // Check if role is allowed
    const roles = Array.isArray(allowedRoles) 
      ? allowedRoles.map(r => r.toUpperCase())
      : [allowedRoles.toUpperCase()]
    
    const hasRole = roles.includes(userRole)
    
    if (!hasRole) return false
    
    // For doctors, check status if requireApproved is true
    if (userRole === 'DOCTOR' && requireApproved) {
      return userStatus === 'APPROVED'
    }
    
    return true
  }

  // Check if menu item should be visible
  const shouldShowMenuItem = (allowedRoles, requireApproved = false) => {
    // If no roles specified, show to everyone
    if (!allowedRoles) return true
    
    // If user not logged in, don't show protected items
    if (!user) return false
    
    return canAccess(allowedRoles, requireApproved)
  }

  // Determine header class based on route
  const getHeaderClass = () => {
    const path = location.pathname
    if (path === '/index-2') return 'header header-trans header-two'
    if (path === '/index-3') return 'header header-trans header-three header-eight'
    if (path === '/index-5') return 'header header-custom header-fixed header-ten'
    if (path === '/index-4') return 'header header-custom header-fixed header-one home-head-one'
    if (path === '/index-6') return 'header header-trans header-eleven'
    if (path === '/index-7') return 'header header-fixed header-fourteen header-twelve veterinary-header'
    if (path === '/index-8') return 'header header-fixed header-fourteen header-twelve header-thirteen'
    if (path === '/index-9') return 'header header-fixed header-fourteen'
    if (path === '/index-10') return 'header header-fixed header-fourteen header-fifteen ent-header'
    if (path === '/index-11') return 'header header-fixed header-fourteen header-sixteen'
    if (path === '/index-12') return 'header header-fixed header-fourteen header-twelve header-thirteen'
    if (path === '/pharmacy-index') return 'header'
    if (path === '/index-13') return 'header header-custom header-fixed header-ten home-care-header'
    if (path === '/index-14') return 'header header-custom header-fixed header-ten home-care-header dentist-header'
    return 'header header-custom header-fixed inner-header relative'
  }

  return (
    <>
      {/* Top Bar for Index Page */}
      {isIndexPage && (
        <div className="header-topbar">
          <div className="container">
            <div className="topbar-info">
              <div className="d-flex align-items-center gap-3 header-info">
                <p><i className="isax isax-message-text5 me-1"></i>info@example.com</p>
                <p><i className="isax isax-call5 me-1"></i>+1 66589 14556</p>
              </div>
              <ul>
                <li className="header-theme">
                  <a href="javascript:void(0);" id="dark-mode-toggle" className="theme-toggle">
                    <i className="isax isax-sun-1"></i>
                  </a>
                  <a href="javascript:void(0);" id="light-mode-toggle" className="theme-toggle activate">
                    <i className="isax isax-moon"></i>
                  </a>
                </li>
                <li className="d-inline-flex align-items-center drop-header">
                  <div className="dropdown dropdown-country me-3">
                    <a href="javascript:void(0);" className="d-inline-flex align-items-center" data-bs-toggle="dropdown">
                      <img src="/assets/img/flags/us-flag.svg" className="me-2" alt="flag" />
                    </a>
                    <ul className="dropdown-menu p-2 mt-2">
                      <li><a className="dropdown-item rounded d-flex align-items-center" href="javascript:void(0);">
                        <img src="/assets/img/flags/us-flag.svg" className="me-2" alt="flag" />ENG
                      </a></li>
                      <li><a className="dropdown-item rounded d-flex align-items-center" href="javascript:void(0);">
                        <img src="/assets/img/flags/arab-flag.svg" className="me-2" alt="flag" />ARA
                      </a></li>
                      <li><a className="dropdown-item rounded d-flex align-items-center" href="javascript:void(0);">
                        <img src="/assets/img/flags/france-flag.svg" className="me-2" alt="flag" />FRA
                      </a></li>
                    </ul>
                  </div>
                  <div className="dropdown dropdown-amt">
                    <a href="javascript:void(0);" className="dropdown-toggle" data-bs-toggle="dropdown">USD</a>
                    <ul className="dropdown-menu p-2 mt-2">
                      <li><a className="dropdown-item rounded" href="javascript:void(0);">USD</a></li>
                      <li><a className="dropdown-item rounded" href="javascript:void(0);">YEN</a></li>
                      <li><a className="dropdown-item rounded" href="javascript:void(0);">EURO</a></li>
                    </ul>
                  </div>
                </li>
                <li className="social-header">
                  <div className="social-icon">
                    <a href="javascript:void(0);"><i className="fa-brands fa-facebook"></i></a>
                    <a href="javascript:void(0);"><i className="fa-brands fa-x-twitter"></i></a>
                    <a href="javascript:void(0);"><i className="fa-brands fa-instagram"></i></a>
                    <a href="javascript:void(0);"><i className="fa-brands fa-linkedin"></i></a>
                    <a href="javascript:void(0);"><i className="fa-brands fa-pinterest"></i></a>
                  </div>
                </li>
              </ul>
            </div>
          </div>
        </div>
      )}

      {/* Pharmacy Top Header */}
      {isPharmacyIndex && (
        <>
          <div className="top-header">
            <div className="container">
              <div className="row align-items-center">
                <div className="col-md-6">
                  <div className="special-offer-content">
                    <p>Special offer! Get -20% off for first order with minimum <span>$200.00</span> in cart.</p>
                  </div>
                </div>
                <div className="col-md-6">
                  <div className="top-header-right">
                    <ul className="nav">
                      <li className="header-theme me-0 pe-0">
                        <a href="javascript:void(0);" id="dark-mode-toggle" className="theme-toggle">
                          <i className="isax isax-sun-1"></i>
                        </a>
                        <a href="javascript:void(0);" id="light-mode-toggle" className="theme-toggle activate">
                          <i className="isax isax-moon"></i>
                        </a>
                      </li>
                      <li>
                        <div className="btn log-register">
                          <Link to="/login" className="me-1">
                            <span><i className="feather-user"></i></span> Sign In
                          </Link> / 
                          <Link to="/register" className="ms-1">Sign Up</Link>
                        </div>
                      </li>
                    </ul>
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div className="cart-section">
            <div className="container">
              <div className="row align-items-center">
                <div className="col-md-3">
                  <div className="cart-logo">
                    <Link to="/">
                      <img src="/assets/img/logo.svg" className="img-fluid" alt="Logo" />
                    </Link>
                  </div>
                </div>
                <div className="col-md-6">
                  <div className="cart-search">
                    <form action="/pharmacy-search">
                      <div className="enter-pincode">
                        <i className="feather-map-pin"></i>
                        <div className="enter-pincode-input">
                          <input type="text" className="form-control" placeholder="Enter Pincode" />
                        </div>
                      </div>
                      <div className="cart-search-input">
                        <input type="text" className="form-control" placeholder="Search for medicines, health products and more" />
                      </div>
                      <div className="cart-search-btn">
                        <button type="submit" className="btn">
                          <i className="feather-search"></i>
                        </button>
                      </div>
                    </form>
                  </div>
                </div>
                <div className="col-md-3">
                  <div className="shopping-cart-list">
                    <ul className="nav">
                      <li>
                        <a href="javascript:void(0);">
                          <img src="/assets/img/icons/cart-favourite.svg" alt="Img" />
                        </a>
                      </li>
                      <li>
                        <div className="shopping-cart-amount">
                          <div className="shopping-cart-icon">
                            <img src="/assets/img/icons/bag-2.svg" alt="Img" />
                            <span>2</span>
                          </div>
                          <div className="shopping-cart-content">
                            <p>Shopping cart</p>
                            <h6>$57.00</h6>
                          </div>
                        </div>
                      </li>
                    </ul>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </>
      )}

      {/* Main Header */}
      <header className={getHeaderClass()}>
        <div className="container">
          <nav className="navbar navbar-expand-lg header-nav">
            <div className="navbar-header">
              <a id="mobile_btn" href="javascript:void(0);" onClick={() => setIsMenuOpen(!isMenuOpen)}>
                <span className="bar-icon">
                  <span></span>
                  <span></span>
                  <span></span>
                </span>
              </a>
              <Link to="/" className="navbar-brand logo">
                {location.pathname === '/index-2' || location.pathname === '/index-11' ? (
                  <img src="/assets/img/logo.png" className="img-fluid" alt="Logo" />
                ) : location.pathname === '/index-6' ? (
                  <img src="/assets/img/footer-logo.png" className="img-fluid" alt="Logo" />
                ) : location.pathname === '/index-7' ? (
                  <img src="/assets/img/veterinary-home-logo.svg" className="img-fluid" alt="Logo" />
                ) : (
                  <img src="/assets/img/logo.svg" className="img-fluid" alt="Logo" />
                )}
              </Link>
            </div>

            {isPharmacyIndex && (
              <div className="browse-categorie">
                <div className="dropdown categorie-dropdown">
                  <a href="javascript:void(0);" className="dropdown-toggle" data-bs-toggle="dropdown">
                    <img src="/assets/img/icons/browse-categorie.svg" alt="Img" /> Browse Categories
                  </a>
                  <div className="dropdown-menu">
                    <a className="dropdown-item" href="javascript:void(0);">Ayush</a>
                    <a className="dropdown-item" href="javascript:void(0);">Covid Essentials</a>
                    <a className="dropdown-item" href="javascript:void(0);">Devices</a>
                    <a className="dropdown-item" href="javascript:void(0);">Glucometers</a>
                  </div>
                </div>
              </div>
            )}

            <div className={`main-menu-wrapper ${isMenuOpen ? 'menu-opened' : ''}`}>
              <div className="menu-header">
                <Link to="/" className="menu-logo">
                  <img src="/assets/img/logo.svg" className="img-fluid" alt="Logo" />
                </Link>
                <a id="menu_close" className="menu-close" href="javascript:void(0);" onClick={() => setIsMenuOpen(false)}>
                  <i className="fas fa-times"></i>
                </a>
              </div>
              <ul className="main-nav">
                {/* Home Menu */}
                <li className={isActive('/') || location.pathname === '/index' ? 'active' : ''}>
                  <Link to="/">Home</Link>
                </li>

                {/* Doctors Menu - Only show to doctors (approved) or public (for registration) */}
                {(shouldShowMenuItem('DOCTOR', true) || !user) && (
                  <li className={`has-submenu ${isActive('/doctor') || isActive('/appointments') ? 'active' : ''}`}>
                    <a href="javascript:void(0);">Doctors <i className="fas fa-chevron-down"></i></a>
                    <ul className="submenu">
                      {shouldShowMenuItem('DOCTOR', true) && (
                        <>
                          <li><Link to="/doctor/dashboard">Doctor Dashboard</Link></li>
                          <li><Link to="/appointments">Appointments</Link></li>
                          <li><Link to="/available-timings">Available Timing</Link></li>
                          <li><Link to="/my-patients">Patients List</Link></li>
                          <li><Link to="/patient-profile">Patients Profile</Link></li>
                          <li><Link to="/chat-doctor">Chat</Link></li>
                          <li><Link to="/invoices">Invoices</Link></li>
                          <li><Link to="/doctor-profile-settings">Profile Settings</Link></li>
                          <li><Link to="/reviews">Reviews</Link></li>
                        </>
                      )}
                      {!user && (
                        <li><Link to="/doctor-register">Doctor Register</Link></li>
                      )}
                    </ul>
                  </li>
                )}

                {/* Patients Menu - Show to patients and public (for browsing/search) */}
                <li className={`has-submenu ${isActive('/patient') || isActive('/search') || isActive('/booking') ? 'active' : ''}`}>
                  <a href="javascript:void(0);">Patients <i className="fas fa-chevron-down"></i></a>
                  <ul className="submenu">
                    {/* Patient Dashboard - Only for patients */}
                    {shouldShowMenuItem('PATIENT') && (
                      <li><Link to="/patient/dashboard">Patient Dashboard</Link></li>
                    )}
                    
                    {/* Public browsing/search items - Show to everyone */}
                    <li className="has-submenu">
                      <a href="javascript:void(0);">Doctors</a>
                      <ul className="submenu inner-submenu">
                        <li><Link to="/map-grid">Map Grid</Link></li>
                        <li><Link to="/map-list">Map List</Link></li>
                        <li><Link to="/map-list-availability">Map with Availability</Link></li>
                      </ul>
                    </li>
                    <li className="has-submenu">
                      <a href="javascript:void(0);">Search Doctor</a>
                      <ul className="submenu inner-submenu">
                        <li><Link to="/search">Search Doctor 1</Link></li>
                        <li><Link to="/search-2">Search Doctor 2</Link></li>
                      </ul>
                    </li>
                    <li className="has-submenu">
                      <a href="javascript:void(0);">Doctor Profile</a>
                      <ul className="submenu inner-submenu">
                        <li><Link to="/doctor-profile">Doctor Profile 1</Link></li>
                        <li><Link to="/doctor-profile-2">Doctor Profile 2</Link></li>
                      </ul>
                    </li>
                    
                    {/* Booking - Only for patients */}
                    {shouldShowMenuItem('PATIENT') && (
                      <>
                        {/* <li className="has-submenu">
                          <a href="javascript:void(0);">Booking</a>
                          <ul className="submenu inner-submenu">
                            <li><Link to="/booking">Booking</Link></li>
                            <li><Link to="/booking-1">Booking 1</Link></li>
                            <li><Link to="/booking-2">Booking 2</Link></li>
                            <li><Link to="/booking-popup">Booking Popup</Link></li>
                          </ul>
                        </li>
                        <li><Link to="/checkout">Checkout</Link></li>
                        <li><Link to="/booking-success">Booking Success</Link></li> */}
                        <li><Link to="/favourites">Favourites</Link></li>
                        <li><Link to="/chat">Chat</Link></li>
                        <li><Link to="/profile-settings">Profile Settings</Link></li>
                        <li><Link to="/change-password">Change Password</Link></li>
                      </>
                    )}
                  </ul>
                </li>

                {/* Pharmacy Menu - Show to everyone (browse) but cart/checkout only for patients */}
                <li className={`has-submenu ${isActive('/pharmacy') || isActive('/product') || isActive('/cart') ? 'active' : ''}`}>
                  <a href="javascript:void(0);">Pharmacy <i className="fas fa-chevron-down"></i></a>
                  <ul className="submenu">
                    {/* Public browsing - Show to everyone */}
                   {/* <li><Link to="/pharmacy-index">Pharmacy</Link></li>*/}
                    <li><Link to="/pharmacy-search"> Pharmacies </Link></li>
                    {/* <li><Link to="/pharmacy-details">Pharmacy Details</Link></li> */}
                    <li><Link to="/product-all">Products</Link></li>
                    {/* <li><Link to="/product-description">Product Description</Link></li> */}
                    
                    {/* Cart & Checkout - Only for patients */}
                    {shouldShowMenuItem('PATIENT') && (
                      <>
                        <li><Link to="/cart">Cart</Link></li>
                        {/* <li><Link to="/product-checkout">Product Checkout</Link></li> */}
                        {/* <li><Link to="/payment-success">Payment Success</Link></li> */}
                      </>
                    )}
                    
                    {/* Pharmacy Register - Only show if not logged in */}
                    {!user && (
                      <li><Link to="/pharmacy-register">Pharmacy Register</Link></li>
                    )}
                  </ul>
                </li>

                {/* Blog */}
                <li className={isActive('/blog-list') || isActive('/blog-details') ? 'active' : ''}>
                  <Link to="/blog-list">Blog</Link>
                </li>

                {/* About Us */}
                <li className={isActive('/about-us') ? 'active' : ''}>
                  <Link to="/about-us">About Us</Link>
                </li>

                {/* Contact Us */}
                <li className={isActive('/contact-us') ? 'active' : ''}>
                  <Link to="/contact-us">Contact Us</Link>
                </li>
              </ul>
            </div>

            {/* Right Side Navigation */}
            {!user ? (
              <ul className="nav header-navbar-rht">
                <li className="searchbar">
                  <a href="javascript:void(0);"><i className="feather-search"></i></a>
                  <div className="togglesearch">
                    <form action="/search">
                      <div className="input-group">
                        <input type="text" className="form-control" />
                        <button type="submit" className="btn">Search</button>
                      </div>
                    </form>
                  </div>
                </li>
                <li>
                  <Link to="/login" className="btn btn-md btn-primary-gradient d-inline-flex align-items-center rounded-pill">
                    <i className="isax isax-lock-1 me-1"></i>Sign Up
                  </Link>
                </li>
                <li>
                  <Link to="/register" className="btn btn-md btn-dark d-inline-flex align-items-center rounded-pill">
                    <i className="isax isax-user-tick me-1"></i>Register
                  </Link>
                </li>
              </ul>
            ) : (
              <ul className="nav header-navbar-rht">
                <li className="searchbar">
                  <a href="javascript:void(0);"><i className="feather-search"></i></a>
                </li>
                <li className="header-theme noti-nav">
                  <a href="javascript:void(0);" id="dark-mode-toggle" className="theme-toggle">
                    <i className="isax isax-sun-1"></i>
                  </a>
                  <a href="javascript:void(0);" id="light-mode-toggle" className="theme-toggle activate">
                    <i className="isax isax-moon"></i>
                  </a>
                </li>
                <li className="nav-item dropdown has-arrow logged-item">
                  <a href="javascript:void(0);" className="nav-link ps-0" data-bs-toggle="dropdown">
                    <span className="user-img">
                      <img className="rounded-circle" src="/assets/img/doctors-dashboard/doctor-profile-img.jpg" width="31" alt="User" />
                    </span>
                  </a>
                  <div className="dropdown-menu dropdown-menu-end">
                    <div className="user-header">
                      <div className="avatar avatar-sm">
                        <img src="/assets/img/doctors-dashboard/doctor-profile-img.jpg" alt="User" className="avatar-img rounded-circle" />
                      </div>
                      <div className="user-text">
                        <h6>{user.fullName || user.name || 'User'}</h6>
                        <p className="text-muted mb-0">{getUserRole() || 'User'}</p>
                      </div>
                    </div>
                    
                    {/* Dashboard Links - Role-based */}
                    {shouldShowMenuItem('DOCTOR', true) && (
                      <Link className="dropdown-item" to="/doctor/dashboard">
                        <i className="fe fe-home me-2"></i>Doctor Dashboard
                      </Link>
                    )}
                    {shouldShowMenuItem('DOCTOR') && getUserStatus() === 'PENDING' && (
                      <Link className="dropdown-item" to="/pending-approval">
                        <i className="fe fe-clock me-2"></i>Pending Approval
                      </Link>
                    )}
                    {shouldShowMenuItem('PATIENT') && (
                      <Link className="dropdown-item" to="/patient/dashboard">
                        <i className="fe fe-home me-2"></i>Patient Dashboard
                      </Link>
                    )}
                    {shouldShowMenuItem(['PHARMACY', 'PHARMACY_ADMIN']) && (
                      <Link className="dropdown-item" to="/pharmacy-admin/dashboard">
                        <i className="fe fe-home me-2"></i>Pharmacy Dashboard
                      </Link>
                    )}
                    
                    {/* Profile Settings - Role-based */}
                    {shouldShowMenuItem('PATIENT') && (
                      <Link className="dropdown-item" to="/profile-settings">
                        <i className="fe fe-user me-2"></i>Profile Settings
                      </Link>
                    )}
                    {shouldShowMenuItem('DOCTOR', true) && (
                      <Link className="dropdown-item" to="/doctor-profile-settings">
                        <i className="fe fe-user me-2"></i>Profile Settings
                      </Link>
                    )}
                    
                    {/* Change Password - Role-based */}
                    {shouldShowMenuItem('PATIENT') && (
                      <Link className="dropdown-item" to="/change-password">
                        <i className="fe fe-lock me-2"></i>Change Password
                      </Link>
                    )}
                    {shouldShowMenuItem('DOCTOR', true) && (
                      <Link className="dropdown-item" to="/doctor-change-password">
                        <i className="fe fe-lock me-2"></i>Change Password
                      </Link>
                    )}
                    
                    {/* Appointments - Role-based */}
                    {shouldShowMenuItem('PATIENT') && (
                      <Link className="dropdown-item" to="/patient-appointments">
                        <i className="fe fe-calendar me-2"></i>My Appointments
                      </Link>
                    )}
                    {shouldShowMenuItem('DOCTOR', true) && (
                      <Link className="dropdown-item" to="/appointments">
                        <i className="fe fe-calendar me-2"></i>Appointments
                      </Link>
                    )}
                    
                    {/* Chat - Role-based */}
                    {shouldShowMenuItem('PATIENT') && (
                      <Link className="dropdown-item" to="/chat">
                        <i className="fe fe-message-circle me-2"></i>Chat
                      </Link>
                    )}
                    {shouldShowMenuItem('DOCTOR', true) && (
                      <Link className="dropdown-item" to="/chat-doctor">
                        <i className="fe fe-message-circle me-2"></i>Chat
                      </Link>
                    )}
                    
                    {/* Divider */}
                    <div className="dropdown-divider"></div>
                    
                    {/* Logout */}
                    <a className="dropdown-item" href="javascript:void(0);" onClick={handleLogout}>
                      <i className="fe fe-log-out me-2"></i>Logout
                    </a>
                  </div>
                </li>
              </ul>
            )}
          </nav>
        </div>
      </header>
    </>
  )
}

export default Header

