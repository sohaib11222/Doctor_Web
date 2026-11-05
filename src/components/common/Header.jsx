import { Link, useLocation, useNavigate } from 'react-router-dom'
import { useAuth } from '../../contexts/AuthContext'
import { useCart } from '../../contexts/CartContext'
import { useState, useMemo } from 'react'
import { useQuery } from '@tanstack/react-query'
import * as profileApi from '../../api/profile'
import * as pharmacyApi from '../../api/pharmacy'
import LanguageToggle from './LanguageToggle'
import { useLanguage } from '../../contexts/LanguageContext'

const Header = () => {
  const { translateText: tr } = useLanguage()
  const location = useLocation()
  const navigate = useNavigate()
  const { user, logout } = useAuth()
  const { getCartItemCount } = useCart()
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const role = String(user?.role || '').trim().toUpperCase()
  const isDoctor = role === 'DOCTOR'
  const isPatient = role === 'PATIENT'
  const hasDashboard = ['DOCTOR', 'PATIENT', 'PHARMACY', 'PARAPHARMACY'].includes(role)
  const dashboardPath = isDoctor
    ? '/doctor/dashboard'
    : isPatient
      ? '/patient/dashboard'
      : '/pharmacy/dashboard'

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
    enabled: !!user && isDoctor
  })

  const { data: myPharmacyData } = useQuery({
    queryKey: ['my-pharmacy-header'],
    queryFn: () => pharmacyApi.getMyPharmacy(),
    enabled: !!user && (role === 'PHARMACY' || role === 'PARAPHARMACY')
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

    if (role === 'PHARMACY' || role === 'PARAPHARMACY') {
      const pharmacy = myPharmacyData?.data?.data || myPharmacyData?.data || myPharmacyData
      const pharmacyLogo = pharmacy?.logo
      const normalizedPharmacyLogo = normalizeImageUrl(pharmacyLogo)
      if (normalizedPharmacyLogo) return normalizedPharmacyLogo
    }
    
    // For doctors, try to get image from doctor profile first
    if (isDoctor && doctorProfileData?.data) {
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
  }, [user, userProfileData, doctorProfileData, myPharmacyData, role, isDoctor])

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

  // The public header and each authenticated role use one explicit, flat list.
  // Keeping this data in one place prevents a legacy dropdown or a role-specific
  // branch from silently adding links back into the navigation.
  const navigationItems = [
    ...(!isDoctor ? [{ key: 'home', to: '/', label: 'Home', active: isIndexPage }] : []),
    ...(isDoctor ? [{ key: 'panel', to: dashboardPath, label: 'My Panel', active: isActive(dashboardPath) }] : []),
    ...(!isDoctor ? [{
      key: 'emergency',
      to: '/search?isAvailableOnline=true',
      label: 'Emergency Room H24',
      className: 'nav-emergency',
      active: location.pathname === '/search' && new URLSearchParams(location.search).get('isAvailableOnline') === 'true',
      icon: 'fa-solid fa-kit-medical',
    }] : []),
    { key: 'doctors', to: '/search', label: 'Doctors', active: location.pathname === '/search' && !location.search },
    { key: 'pharmacy', to: '/pharmacy-search', label: 'Pharmacy', active: isActive('/pharmacy-search') },
    { key: 'shop', to: '/product-all', label: 'Shop', active: isActive('/product-all') },
    ...(!isDoctor && hasDashboard ? [{ key: 'panel', to: dashboardPath, label: 'My Panel', active: isActive(dashboardPath) }] : []),
    ...(!user ? [{ key: 'blog', to: '/blog-list', label: 'Blog', active: isActive('/blog-list') }] : []),
    { key: 'contact', to: '/contact-us', label: 'Contact Us', active: isActive('/contact-us') },
  ]

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
      <header className={getHeaderClass()}>
        <div className="container">
          <nav className="navbar navbar-expand-lg header-nav">
            <div className="navbar-header">
              <a id="mobile_btn" href="#navigation" aria-label="Open navigation" aria-expanded={isMenuOpen} onClick={(event) => { event.preventDefault(); setIsMenuOpen(!isMenuOpen) }}>
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



            <div id="navigation" className={`main-menu-wrapper ${isMenuOpen ? 'menu-opened' : ''}`}>
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
                }}>
                  <i className="fas fa-times"></i>
                </a>
              </div>
              <ul className="main-nav">
                {navigationItems.map((item) => (
                  <li key={item.key} className={[item.className, item.active ? 'active' : ''].filter(Boolean).join(' ')}>
                    <Link to={item.to} onClick={() => setIsMenuOpen(false)}>
                      {item.icon && <i className={item.icon} aria-hidden="true"></i>}
                      {item.icon ? ' ' : ''}{tr(item.label)}
                    </Link>
                  </li>
                ))}
                {!user && <><li className="md-mobile-only"><Link to="/login" onClick={() => setIsMenuOpen(false)}>{tr('Login')}</Link></li><li className="md-mobile-only"><Link to="/register" onClick={() => setIsMenuOpen(false)}>{tr('Register')}</Link></li></>}
                {isPatient && <li className="md-mobile-only"><Link to="/cart" onClick={() => setIsMenuOpen(false)}>{tr('Cart')}{cartItemCount > 0 ? ` (${cartItemCount})` : ''}</Link></li>}
                {user && <li className="md-mobile-only"><button type="button" className="btn btn-link" onClick={() => { setIsMenuOpen(false); handleLogout() }}>{tr('Logout')}</button></li>}
                <li className="md-mobile-only"><LanguageToggle /></li>
              </ul>
            </div>

            {/* Right Side Navigation */}
            {!user ? (
              <ul className="nav header-navbar-rht">
                <li className="nav-item"><LanguageToggle /></li>
                <li className="searchbar">
                  <Link to="/search"><i className="feather-search"></i></Link>
                </li>
                <li>
                  <Link to="/login" className="btn btn-md btn-primary-gradient d-inline-flex align-items-center rounded-pill">
                    <i className="isax isax-lock-1 me-1"></i>{tr('Sign In')}
                  </Link>
                </li>
                <li>
                  <Link to="/register" className="btn btn-md btn-dark d-inline-flex align-items-center rounded-pill">
                    <i className="isax isax-user-tick me-1"></i>{tr('Register')}
                  </Link>
                </li>
              </ul>
            ) : (
              <ul className="nav header-navbar-rht">
                <li className="nav-item"><LanguageToggle /></li>
                <li className="searchbar">
                  <Link to="/search"><i className="feather-search"></i></Link>
                </li>
                {isPatient && (
                  <li className="nav-item" style={{ position: 'relative' }}>
                    <Link to="/cart" className="nav-link" title={tr('Cart')} style={{ position: 'relative' }}>
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
                <li className="nav-item logged-item">
                  <Link className="nav-link" to={dashboardPath} aria-label={tr('My Panel')}>
                    <img className="avatar-img rounded-circle" src={userProfileImage} width="31" height="31" alt="" style={{ width: 31, height: 31, objectFit: 'cover' }} onError={(event) => { event.currentTarget.src = '/assets/img/doctors-dashboard/doctor-profile-img.jpg' }} />
                  </Link>
                </li>
                <li className="nav-item"><button type="button" className="btn btn-link nav-link" onClick={handleLogout}>{tr('Logout')}</button></li>
              </ul>
            )}
          </nav>
        </div>
      </header>
    </>
  )
}

export default Header

