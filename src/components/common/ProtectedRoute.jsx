import { useEffect, useRef } from 'react'
import { Navigate, useLocation } from 'react-router-dom'
import { useAuth } from '../../contexts/AuthContext'
import { useLanguage } from '../../contexts/LanguageContext'
import { toast } from 'react-toastify'

const RedirectWithNotice = ({ to, type = 'error', message }) => {
  const { translateText: tr } = useLanguage()
  const displayedMessage = useRef(null)

  useEffect(() => {
    if (!message || displayedMessage.current === message) return
    displayedMessage.current = message
    toast[type](tr(message))
  }, [message, tr, type])

  return <Navigate to={to} replace />
}

/**
 * ProtectedRoute Component
 * 
 * Protects routes based on:
 * - Authentication (user must be logged in)
 * - Role (user must have specific role)
 * - Status (for doctors, must be APPROVED unless allowPending is true)
 * 
 * @param {ReactNode} children - Component to render if access is granted
 * @param {string|string[]} role - Required role(s). Can be single role string or array of roles
 * @param {boolean} requireApproved - For doctors, require APPROVED status (default: false)
 * @param {boolean} allowPending - Allow PENDING doctors to access (default: false)
 * @param {boolean} requireAuth - Require authentication (default: true)
 */
const ProtectedRoute = ({ 
  children, 
  role = null, 
  requireApproved = false, 
  allowPending = false,
  requireAuth = true 
}) => {
  const { user, loading } = useAuth()
  const location = useLocation()
  const currentPath = (location?.pathname || '/').replace(/\/+$/, '') || '/'

  // Show loading spinner while checking auth
  if (loading) {
    return (
      <div className="d-flex justify-content-center align-items-center" style={{ minHeight: '100vh' }}>
        <div className="spinner-border text-primary" role="status">
          <span className="visually-hidden">Loading...</span>
        </div>
      </div>
    )
  }

  // Check authentication
  if (requireAuth && !user) {
    return <RedirectWithNotice to="/login" message="Please login to access this page" />
  }

  // If no role required, just check authentication
  if (!role) {
    return children
  }

  // Check role
  const userRole = user?.role?.toUpperCase()
  const allowedRoles = Array.isArray(role) 
    ? role.map(r => r.toUpperCase())
    : [role.toUpperCase()]

  if (!allowedRoles.includes(userRole)) {
    return <RedirectWithNotice to="/" message="You do not have permission to access this page" />
  }

  // For doctors, check status
  if (userRole === 'DOCTOR') {
    const userStatus = user?.status?.toUpperCase()

    // If requireApproved is true, doctor must be APPROVED
    if (requireApproved && userStatus !== 'APPROVED') {
      if (userStatus === 'PENDING' && !allowPending) {
        return <RedirectWithNotice to="/pending-approval" type="info" message="Your account is pending approval. Please wait for admin approval." />
      } else if (userStatus === 'REJECTED' || userStatus === 'BLOCKED') {
        return <RedirectWithNotice to="/login" message="Your account has been rejected or blocked. Please contact support." />
      } else {
        return <RedirectWithNotice to="/pending-approval" type="info" message="Your account needs to be approved to access this page." />
      }
    }

    // If allowPending is false and doctor is pending, redirect
    if (!allowPending && userStatus === 'PENDING' && requireApproved === false) {
      // Only redirect if this is a doctor-specific route (not pending-approval page itself)
      // This allows pending doctors to access pending-approval page
      if (currentPath !== '/pending-approval' && currentPath.startsWith('/doctor/')) {
        return <Navigate to="/pending-approval" replace />
      }
    }
  }

  // For pharmacies, check status
  if (userRole === 'PHARMACY' || userRole === 'PARAPHARMACY') {
    const userStatus = user?.status?.toUpperCase()
    const phoneVerified = Boolean(user?.isPhoneVerified)
    const documentsSubmitted = localStorage.getItem('pharmacy_documents_submitted') === 'true'

    if (!phoneVerified) {
      if (currentPath !== '/pharmacy-phone-verification') {
        return <Navigate to="/pharmacy-phone-verification" replace />
      }
      return children
    }

    if (userStatus === 'PENDING' && currentPath !== '/pharmacy-verification-upload' && currentPath !== '/pending-approval') {
      if (!documentsSubmitted) {
        return <Navigate to="/pharmacy-verification-upload" replace />
      }
    }

    if (requireApproved && userStatus !== 'APPROVED') {
      if (userStatus === 'PENDING' && !allowPending) {
        if (!documentsSubmitted) {
          return <Navigate to="/pharmacy-verification-upload" replace />
        }
        return <RedirectWithNotice to="/pending-approval" type="info" message="Your account is pending approval. Please wait for admin approval." />
      } else if (userStatus === 'REJECTED' || userStatus === 'BLOCKED') {
        return <RedirectWithNotice to="/login" message="Your account has been rejected or blocked. Please contact support." />
      } else {
        return <RedirectWithNotice to="/pending-approval" type="info" message="Your account needs to be approved to access this page." />
      }
    }

    if (!allowPending && userStatus === 'PENDING' && requireApproved === false) {
      if (currentPath !== '/pending-approval' && currentPath.startsWith('/pharmacy/')) {
        if (!documentsSubmitted) {
          return <Navigate to="/pharmacy-verification-upload" replace />
        }
        return <Navigate to="/pending-approval" replace />
      }
    }
  }

  return children
}

export default ProtectedRoute

