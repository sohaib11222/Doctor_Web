import { Link, useLocation, useNavigate } from 'react-router-dom'
import { useAuth } from '../../contexts/AuthContext'
import { useCart } from '../../contexts/CartContext'
import { useState, useEffect, useMemo } from 'react'
import { useQuery } from '@tanstack/react-query'
import * as profileApi from '../../api/profile'
import * as pharmacyApi from '../../api/pharmacy'

const Header = () => {
  const location = useLocation()
  const navigate = useNavigate()
  const { user, logout } = useAuth()
  const { getCartItemCount } = useCart()
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const [hasGoogleTranslateBanner, setHasGoogleTranslateBanner] = useState(false)
  const [openSubmenus, setOpenSubmenus] = useState({
    doctors: false,
    patients: false,
    pharmacy: false
  })

  // Fetch user profile to get profile image
  const { data: userProfileData } = useQuery({
    queryKey: ['userProfile', user?._id],
    queryFn: () => profileApi.getUserProfile(user._id),
    enabled: !!user?._id
  })

  // Fetch doctor profile for doctors (to get profileImage from userId)
  const { data: doctorProfileData } = useQuery({
    queryKey: ['doctorProfile'],
    queryFn: () => profileApi.getDoctorProfile(),
    enabled: !!user && user?.role === 'DOCTOR'
  })

  const { data: myPharmacyData } = useQuery({
    queryKey: ['my-pharmacy-header'],
    queryFn: () => pharmacyApi.getMyPharmacy(),
    enabled: !!user && (user?.role === 'PHARMACY' || user?.role === 'PARAPHARMACY')
  })

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

  // Get user profile image - prioritize doctor profile userId.profileImage if doctor
  const userProfileImage = useMemo(() => {
    if (!user) return '/assets/img/doctors-dashboard/doctor-profile-img.jpg'

    if (user?.role === 'PHARMACY' || user?.role === 'PARAPHARMACY') {
      const pharmacy = myPharmacyData?.data?.data || myPharmacyData?.data || myPharmacyData
      const pharmacyLogo = pharmacy?.logo
      const normalizedPharmacyLogo = normalizeImageUrl(pharmacyLogo)
      if (normalizedPharmacyLogo) return normalizedPharmacyLogo
    }
    
    // For doctors, try to get image from doctor profile first
    if (user?.role === 'DOCTOR' && doctorProfileData?.data) {
      const doctorUserId = doctorProfileData.data.userId || {}
      if (doctorUserId.profileImage) {
        const normalized = normalizeImageUrl(doctorUserId.profileImage)
        if (normalized) return normalized
      }
    }
    
    // Fallback to user profile data
    const profileData = userProfileData?.data || userProfileData || {}
    const imageUrl = profileData.profileImage || user.profileImage
    return normalizeImageUrl(imageUrl) || '/assets/img/doctors-dashboard/doctor-profile-img.jpg'
  }, [user, userProfileData, doctorProfileData, myPharmacyData])

  const isActive = (path) => location.pathname === path || location.pathname.startsWith(path + '/')
  const isIndexPage = location.pathname === '/' || location.pathname === '/index'
  const isPharmacyIndex = location.pathname === '/pharmacy-index'
  const cartItemCount = useMemo(() => {
    try {
      return getCartItemCount ? getCartItemCount() : 0
    } catch {
      return 0
    }
  }, [getCartItemCount])

  const handleLogout = () => {
    logout()
    navigate('/login')
  }

  // Toggle submenu in mobile view
  const toggleSubmenu = (menuName) => {
    setOpenSubmenus(prev => ({
      ...prev,
      [menuName]: !prev[menuName]
    }))
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

  // Detect Google Translate banner and adjust header position
  useEffect(() => {
    const checkGoogleTranslateBanner = () => {
      // Check for Google Translate banner in multiple ways
      const bannerFrame = document.querySelector('.goog-te-banner-frame')
      const skiptranslate = document.querySelector('.skiptranslate')
      const bodyTop = document.body.classList.contains('top')
      
      // Check if body has top class or padding-top (Google Translate adds this)
      const bodyStyle = window.getComputedStyle(document.body)
      const bodyTopValue = bodyStyle.top
      const bodyPaddingTop = bodyStyle.paddingTop
      
      // Check for visible banner frame (even if display:none is set, it might still affect layout)
      const bannerVisible = bannerFrame && 
        window.getComputedStyle(bannerFrame).display !== 'none' &&
        bannerFrame.offsetHeight > 0
      
      // Check if there's a translate banner at the top of the page
      const hasBanner = !!(
        (bannerFrame && bannerVisible) || 
        (skiptranslate && window.getComputedStyle(skiptranslate).display !== 'none') || 
        bodyTop ||
        (bodyTopValue && bodyTopValue !== '0px' && bodyTopValue !== 'auto') ||
        (bodyPaddingTop && parseFloat(bodyPaddingTop) > 0)
      )
      
      setHasGoogleTranslateBanner(hasBanner)
    }

    // Initial check with delay to allow Google Translate to load
    const initialTimeout = setTimeout(checkGoogleTranslateBanner, 100)

    // Watch for changes in DOM
    const observer = new MutationObserver(() => {
      checkGoogleTranslateBanner()
    })
    
    observer.observe(document.body, {
      childList: true,
      subtree: true,
      attributes: true,
      attributeFilter: ['class', 'style']
    })

    // Also check periodically (Google Translate can add banner dynamically)
    const interval = setInterval(checkGoogleTranslateBanner, 300)

    // Check on scroll/resize
    window.addEventListener('scroll', checkGoogleTranslateBanner, { passive: true })
    window.addEventListener('resize', checkGoogleTranslateBanner)

    return () => {
      clearTimeout(initialTimeout)
      observer.disconnect()
      clearInterval(interval)
      window.removeEventListener('scroll', checkGoogleTranslateBanner)
      window.removeEventListener('resize', checkGoogleTranslateBanner)
    }
  }, [])

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
      {/* Add CSS to handle Google Translate banner */}
      <style>{`
        /* Mobile menu submenu toggle styles */
        @media (max-width: 991px) {
          .main-menu-wrapper .has-submenu .submenu {
            display: none !important;
          }
          .main-menu-wrapper .has-submenu.submenu-opened .submenu {
            display: block !important;
          }
          .main-menu-wrapper .has-submenu.submenu-opened > a i.fa-chevron-down {
            transform: rotate(180deg);
            transition: transform 0.3s ease;
          }
          .main-menu-wrapper .has-submenu > a i.fa-chevron-down {
            transition: transform 0.3s ease;
          }
        }
        
        /* CRITICAL: Remove ALL body padding-top by default - only allow when Google Translate banner is visible */
        body {
          padding-top: 0 !important;
        }
        
        /* When Google Translate banner is active (body has .top class), allow minimal padding if needed */
        body.top {
          padding-top: 0 !important;
        }
        
        /* Adjust header when Google Translate banner is present */
        .header.header-fixed,
        .header.header-custom {
          transition: margin-top 0.3s ease, top 0.3s ease !important;
          margin-top: 0 !important;
        }
        
        /* When Google Translate banner is active, push header down */
        body.top .header.header-fixed,
        body.top .header.header-custom {
          margin-top: 42px !important;
        }
        
        /* When Google Translate banner is NOT active, ensure no margin-top */
        body:not(.top) .header.header-fixed,
        body:not(.top) .header.header-custom,
        .header.header-fixed:not(body.top .header),
        .header.header-custom:not(body.top .header) {
          margin-top: 0 !important;
        }
        
        /* Handle Google Translate banner frame */
        .goog-te-banner-frame {
          position: fixed !important;
          top: 0 !important;
          left: 0 !important;
          width: 100% !important;
          z-index: 9998 !important;
        }
        
        /* Ensure header stays below banner */
        .header {
          z-index: 9999 !important;
        }
        
        /* Pharmacy top header adjustment - only when Google Translate is active */
        body.top .top-header {
          margin-top: 42px !important;
        }
        
        /* Pharmacy top header - no margin when Google Translate is NOT active */
        body:not(.top) .top-header,
        .top-header {
          margin-top: 0 !important;
        }
      `}</style>

      {/* Pharmacy Top Header */}
      {isPharmacyIndex && (
        <>
          <div 
            className="top-header"
            style={{
              marginTop: hasGoogleTranslateBanner ? '42px' : '0',
              transition: 'margin-top 0.3s ease'
            }}
          >
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
                      <img src="/assets/img/doctor_final.png" className="img-fluid" alt="Logo" />
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
      <header 
        className={getHeaderClass()}
        style={{
          marginTop: hasGoogleTranslateBanner ? '42px' : '0',
          transition: 'margin-top 0.3s ease'
        }}
      >
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
                <img 
                  src="/assets/img/doctor_final.png" 
                  className="img-fluid" 
                  alt="Logo"
                  style={isIndexPage ? { maxHeight: '60px', height: 'auto', width: 'auto' } : {}}
                />
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
                  <img 
                    src="/assets/img/doctor_final.png" 
                    className="img-fluid" 
                    alt="Logo"
                    style={isIndexPage ? { maxHeight: '60px', height: 'auto', width: 'auto' } : {}}
                  />
                </Link>
                <a id="menu_close" className="menu-close" href="javascript:void(0);" onClick={() => {
                  setIsMenuOpen(false)
                  setOpenSubmenus({ doctors: false, patients: false, pharmacy: false })
                }}>
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
                  <li className={`has-submenu ${isActive('/doctor') || isActive('/appointments') ? 'active' : ''} ${openSubmenus.doctors ? 'submenu-opened' : ''}`}>
                    <a href="javascript:void(0);" onClick={(e) => { e.preventDefault(); toggleSubmenu('doctors'); }}>Doctors <i className="fas fa-chevron-down"></i></a>
                    <ul className="submenu" style={{ display: openSubmenus.doctors ? 'block' : 'none' }}>
                      {shouldShowMenuItem('DOCTOR', true) && (
                        <>
                          <li><Link to="/doctor/dashboard">Doctor Dashboard</Link></li>
                          <li><Link to="/appointments">Appointments</Link></li>
                          <li><Link to="/available-timings">Available Timing</Link></li>
                          <li><Link to="/my-patients">Patients List</Link></li>
                          {/* <li><Link to="/patient-profile">Patients Profile</Link></li> */}
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

                {/* Patients Menu - Show to patients and public (for browsing/search), but NOT to doctors */}
                {(!user || user.role !== 'DOCTOR') && (
                  <li className={`has-submenu ${isActive('/patient') || isActive('/search') || isActive('/booking') ? 'active' : ''} ${openSubmenus.patients ? 'submenu-opened' : ''}`}>
                    <a href="javascript:void(0);" onClick={(e) => { e.preventDefault(); toggleSubmenu('patients'); }}>Patients <i className="fas fa-chevron-down"></i></a>
                    <ul className="submenu" style={{ display: openSubmenus.patients ? 'block' : 'none' }}>
                      {/* Patient Dashboard - Only for patients */}
                      {shouldShowMenuItem('PATIENT') && (
                        <li><Link to="/patient/dashboard">Patient Dashboard</Link></li>
                      )}
                      
                      {/* Public browsing/search items - Show to everyone */}
                    {/* <li className="has-submenu">
                      <a href="javascript:void(0);">Doctors</a>
                      <ul className="submenu inner-submenu">
                        <li><Link to="/map-grid">Map Grid</Link></li>
                        <li><Link to="/map-list">Map List</Link></li>
                        <li><Link to="/map-list-availability">Map with Availability</Link></li>
                      </ul>
                    </li> */}
                    <li className="submenu">
                      <a href="/search">Search Doctor</a>
                      {/* <ul className="submenu inner-submenu">
                        <li><Link to="">Search Doctor 1</Link></li>
                        <li><Link to="/search-2">Search Doctor 2</Link></li>
                      </ul> */}
                    </li>
                    {/* <li className="has-submenu">
                      <a href="javascript:void(0);">Doctor Profile</a>
                      <ul className="submenu inner-submenu">
                        <li><Link to="/doctor-profile">Doctor Profile 1</Link></li>
                        <li><Link to="/doctor-profile-2">Doctor Profile 2</Link></li>
                      </ul>
                    </li> */}
                    
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
                )}

                {/* Pharmacy Menu - Different for doctors vs others */}
                {user && user.role === 'DOCTOR' ? (
                  /* Pharmacy Menu - Allow doctors to browse pharmacies/products */
                  <li className={`has-submenu ${isActive('/pharmacy') || isActive('/product') ? 'active' : ''}`}>
                    <a href="javascript:void(0);">Pharmacy <i className="fas fa-chevron-down"></i></a>
                    <ul className="submenu">
                      <li><Link to="/pharmacy-search"> Pharmacies </Link></li>
                      <li><Link to="/product-all">Products</Link></li>
                    </ul>
                  </li>
                ) : (
                  /* Pharmacy Menu - Show to everyone else (browse) but cart/checkout only for patients */
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
                        <>
                          <li><Link to="/pharmacy-register">Pharmacy Register</Link></li>
                          <li><Link to="/pharmacy-register?kind=PARAPHARMACY">Parapharmacy Register</Link></li>
                        </>
                      )}
                    </ul>
                  </li>
                )}

                {/* Blog */}
                <li className={isActive('/blog-list') || isActive('/blog-details') ? 'active' : ''}>
                  <Link to="/blog-list">Blog</Link>
                </li>

                {/* About Us */}
                <li className={isActive('/about-us') ? 'active' : ''}>
                  <Link to="/about-us">About Us</Link>
                </li>

                {/* Contact Us */}
                {/* <li className={isActive('/contact-us') ? 'active' : ''}>
                  <Link to="/contact-us">Contact Us</Link>
                </li> */}
              </ul>
            </div>

            {/* Right Side Navigation */}
            {!user ? (
              <ul className="nav header-navbar-rht">
                <li className="searchbar">
                  <Link to="/search"><i className="feather-search"></i></Link>
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
                  <Link to="/search"><i className="feather-search"></i></Link>
                </li>
                {user?.role === 'PATIENT' && (
                  <li className="nav-item" style={{ position: 'relative' }}>
                    <Link to="/cart" className="nav-link" title="Cart" style={{ position: 'relative' }}>
                      <i className="feather-shopping-cart"></i>
                      {cartItemCount > 0 && (
                        <span
                          className="badge bg-danger"
                          style={{
                            position: 'absolute',
                            top: '-6px',
                            right: '-10px',
                            borderRadius: '999px',
                            fontSize: '10px',
                            lineHeight: 1,
                            padding: '4px 6px',
                            minWidth: '18px',
                            textAlign: 'center'
                          }}
                        >
                          {cartItemCount}
                        </span>
                      )}
                    </Link>
                  </li>
                )}
                {/* <li className="header-theme noti-nav">
                  <a href="javascript:void(0);" id="dark-mode-toggle" className="theme-toggle">
                    <i className="isax isax-sun-1"></i>
                  </a>
                  <a href="javascript:void(0);" id="light-mode-toggle" className="theme-toggle activate">
                    <i className="isax isax-moon"></i>
                  </a>
                </li> */}
                <li className="nav-item dropdown has-arrow logged-item">
                  <a href="javascript:void(0);" className="nav-link ps-0" data-bs-toggle="dropdown">
                    <span className="user-img" style={{ display: 'inline-block', width: '31px', height: '31px', overflow: 'hidden', borderRadius: '50%' }}>
                      <img 
                        className="avatar-img rounded-circle" 
                        src={userProfileImage} 
                        width="31" 
                        height="31"
                        alt="User"
                        style={{ 
                          width: '31px', 
                          height: '31px', 
                          objectFit: 'cover', 
                          borderRadius: '50%',
                          display: 'block'
                        }}
                        onError={(e) => {
                          e.target.src = '/assets/img/doctors-dashboard/doctor-profile-img.jpg'
                        }}
                      />
                    </span>
                  </a>
                  <div className="dropdown-menu dropdown-menu-end">
                    <div className="user-header">
                      <div className="avatar avatar-sm" style={{ width: '40px', height: '40px', overflow: 'hidden', borderRadius: '50%' }}>
                        <img 
                          src={userProfileImage} 
                          alt="User" 
                          className="avatar-img rounded-circle"
                          style={{ 
                            width: '100%', 
                            height: '100%', 
                            objectFit: 'cover', 
                            borderRadius: '50%',
                            display: 'block'
                          }}
                          onError={(e) => {
                            e.target.src = '/assets/img/doctors-dashboard/doctor-profile-img.jpg'
                          }}
                        />
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
                    {shouldShowMenuItem(['PHARMACY', 'PARAPHARMACY']) && getUserStatus() === 'PENDING' && (
                      <Link className="dropdown-item" to="/pending-approval">
                        <i className="fe fe-clock me-2"></i>Pending Approval
                      </Link>
                    )}
                    {shouldShowMenuItem('PATIENT') && (
                      <Link className="dropdown-item" to="/patient/dashboard">
                        <i className="fe fe-home me-2"></i>Patient Dashboard
                      </Link>
                    )}
                    {shouldShowMenuItem(['PHARMACY', 'PARAPHARMACY']) && (
                      <Link className="dropdown-item" to="/pharmacy/dashboard">
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

