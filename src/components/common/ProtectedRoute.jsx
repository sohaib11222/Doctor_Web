import { Navigate } from 'react-router-dom'
import { useAuth } from '../../contexts/AuthContext'
import { toast } from 'react-toastify'

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
    toast.error('Please login to access this page')
    return <Navigate to="/login" replace />
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
    toast.error('You do not have permission to access this page')
    return <Navigate to="/" replace />
  }

  // For doctors, check status
  if (userRole === 'DOCTOR') {
    const userStatus = user?.status?.toUpperCase()

    // If requireApproved is true, doctor must be APPROVED
    if (requireApproved && userStatus !== 'APPROVED') {
      if (userStatus === 'PENDING' && !allowPending) {
        toast.info('Your account is pending approval. Please wait for admin approval.')
        return <Navigate to="/pending-approval" replace />
      } else if (userStatus === 'REJECTED' || userStatus === 'BLOCKED') {
        toast.error('Your account has been rejected or blocked. Please contact support.')
        return <Navigate to="/login" replace />
      } else {
        toast.info('Your account needs to be approved to access this page.')
        return <Navigate to="/pending-approval" replace />
      }
    }

    // If allowPending is false and doctor is pending, redirect
    if (!allowPending && userStatus === 'PENDING' && requireApproved === false) {
      // Only redirect if this is a doctor-specific route (not pending-approval page itself)
      // This allows pending doctors to access pending-approval page
      const currentPath = window.location.pathname
      if (currentPath !== '/pending-approval' && currentPath.startsWith('/doctor/')) {
        return <Navigate to="/pending-approval" replace />
      }
    }
  }

  return children
}

export default ProtectedRoute

