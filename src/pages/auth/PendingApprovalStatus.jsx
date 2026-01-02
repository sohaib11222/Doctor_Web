import { useEffect, useState } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import AuthLayout from '../../layouts/AuthLayout'
import { useAuth } from '../../contexts/AuthContext'
import api from '../../api/axios'
import { toast } from 'react-toastify'

const PendingApprovalStatus = () => {
  const navigate = useNavigate()
  const { user, logout } = useAuth()
  const [checkingStatus, setCheckingStatus] = useState(true)
  const [currentStatus, setCurrentStatus] = useState(null)

  useEffect(() => {
    // Check if user is already approved
    const checkApprovalStatus = async () => {
      try {
        // Check user status from AuthContext first
        if (user) {
          const status = user.status?.toUpperCase()
          setCurrentStatus(status)
          
          if (status === 'APPROVED') {
            // Doctor is approved, redirect to dashboard
            toast.success('Your account has been approved! Redirecting to dashboard...')
            navigate('/doctor/dashboard')
            return
          } else if (status === 'REJECTED' || status === 'BLOCKED') {
            // Doctor is rejected or blocked
            toast.error('Your account has been rejected or blocked. Please contact support.')
            setCheckingStatus(false)
            return
          }
        }

        // If user status is not in context, try to get from API
        // Use /users/:id endpoint to get user status (requires auth token)
        if (user?._id || user?.id) {
          try {
            const userId = user._id || user.id
            // Get user by ID (requires authentication token)
            const response = await api.get(`/users/${userId}`)
            const userData = response.data || response
            const userStatus = userData.status?.toUpperCase()
            
            if (userStatus) {
              setCurrentStatus(userStatus)
              
              if (userStatus === 'APPROVED') {
                toast.success('Your account has been approved! Redirecting to dashboard...')
                navigate('/doctor/dashboard')
                return
              } else if (userStatus === 'REJECTED' || userStatus === 'BLOCKED') {
                toast.error('Your account has been rejected or blocked. Please contact support.')
                setCheckingStatus(false)
                return
              }
            }
          } catch (apiError) {
            console.error('Error fetching user status:', apiError)
            // If /users/:id fails, try /doctor/profile/:id (public endpoint) as fallback
            try {
              const userId = user._id || user.id
              const profileResponse = await api.get(`/doctor/profile/${userId}`)
              const doctorData = profileResponse.data || profileResponse
              const userStatus = doctorData.userId?.status?.toUpperCase() || doctorData.user?.status?.toUpperCase()
              
              if (userStatus) {
                setCurrentStatus(userStatus)
                
                if (userStatus === 'APPROVED') {
                  toast.success('Your account has been approved! Redirecting to dashboard...')
                  navigate('/doctor/dashboard')
                  return
                } else if (userStatus === 'REJECTED' || userStatus === 'BLOCKED') {
                  toast.error('Your account has been rejected or blocked. Please contact support.')
                  setCheckingStatus(false)
                  return
                }
              }
            } catch (profileError) {
              console.error('Error fetching doctor profile:', profileError)
              // If both fail, just show pending status (user might not have doctor profile yet)
              console.log('Using status from AuthContext:', user.status)
            }
          }
        }

        setCheckingStatus(false)
      } catch (error) {
        console.error('Error checking approval status:', error)
        setCheckingStatus(false)
      }
    }

    checkApprovalStatus()

    // Poll for status updates every 30 seconds
    const interval = setInterval(checkApprovalStatus, 30000)
    return () => clearInterval(interval)
  }, [navigate, user])

  const handleLogout = () => {
    logout()
    navigate('/login')
  }

  const handleCheckStatus = async () => {
    setCheckingStatus(true)
    try {
      if (!user?._id && !user?.id) {
        toast.error('User information not available. Please login again.')
        setCheckingStatus(false)
        return
      }

      const userId = user._id || user.id
      
      // Try to get user by ID first (requires authentication)
      try {
        const response = await api.get(`/users/${userId}`)
        const userData = response.data || response
        const userStatus = userData.status?.toUpperCase()
        
        if (userStatus) {
          setCurrentStatus(userStatus)
          
          if (userStatus === 'APPROVED') {
            toast.success('Your account has been approved! Redirecting to dashboard...')
            navigate('/doctor/dashboard')
            return
          } else if (userStatus === 'REJECTED' || userStatus === 'BLOCKED') {
            toast.error('Your account has been rejected or blocked.')
          } else {
            toast.info('Your account is still pending approval.')
          }
          setCheckingStatus(false)
          return
        }
      } catch (userError) {
        console.error('Error fetching user:', userError)
        // Fallback to doctor profile endpoint
      }

      // Fallback: Try doctor profile endpoint (public)
      try {
        const profileResponse = await api.get(`/doctor/profile/${userId}`)
        const doctorData = profileResponse.data || profileResponse
        const userStatus = doctorData.userId?.status?.toUpperCase() || doctorData.user?.status?.toUpperCase()
        
        if (userStatus) {
          setCurrentStatus(userStatus)
          
          if (userStatus === 'APPROVED') {
            toast.success('Your account has been approved! Redirecting to dashboard...')
            navigate('/doctor/dashboard')
            return
          } else if (userStatus === 'REJECTED' || userStatus === 'BLOCKED') {
            toast.error('Your account has been rejected or blocked.')
          } else {
            toast.info('Your account is still pending approval.')
          }
        } else {
          toast.warning('Unable to determine account status.')
        }
      } catch (profileError) {
        console.error('Error fetching doctor profile:', profileError)
        toast.error('Failed to check status. Please try again.')
      }
    } catch (error) {
      console.error('Error checking status:', error)
      toast.error('Failed to check status. Please try again.')
    } finally {
      setCheckingStatus(false)
    }
  }

  return (
    <AuthLayout>
      <div className="content login-page pt-0">
        <div className="container-fluid">
          <div className="account-content">
            <div className="d-flex align-items-center justify-content-center">
              <div className="login-right">
                <div className="inner-right-login">
                  <div className="login-header">
                    <div className="logo-icon">
                      <img src="/assets/img/logo.png" alt="mydoctor-logo" />
                    </div>

                    {checkingStatus ? (
                      <div className="text-center py-5">
                        <div className="spinner-border text-primary" role="status">
                          <span className="visually-hidden">Loading...</span>
                        </div>
                        <p className="mt-3 text-muted">Checking your status...</p>
                      </div>
                    ) : (
                      <div style={{ maxWidth: '500px', margin: '0 auto' }}>
                        <div className="text-center mb-4">
                          <div className="mb-3" style={{ display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
                            <div className="pending-icon-wrapper" style={{ width: '100px', height: '100px', display: 'flex', alignItems: 'center', justifyContent: 'center', background: '#f8f9fa', borderRadius: '50%' }}>
                              <i className="fe fe-clock" style={{ fontSize: '48px', color: '#ffc107' }}></i>
                            </div>
                          </div>
                          <h3 className="mb-2">Pending Admin Approval</h3>
                          <p className="text-muted">
                            Your verification documents have been submitted successfully.
                          </p>
                        </div>

                        <div className="card" style={{ background: '#f8f9fa', border: 'none', margin: '20px 0' }}>
                          <div className="card-body">
                            <div className="d-flex align-items-start mb-3">
                              <div style={{ fontSize: '24px', marginRight: '15px', flexShrink: 0 }}>
                                <i className="fe fe-check-circle text-success"></i>
                              </div>
                              <div>
                                <h6 style={{ marginBottom: '5px', fontWeight: '600' }}>Documents Submitted</h6>
                                <p className="text-muted small mb-0">Your verification documents are under review</p>
                              </div>
                            </div>

                            <div className="d-flex align-items-start mb-3">
                              <div style={{ fontSize: '24px', marginRight: '15px', flexShrink: 0 }}>
                                <i className="fe fe-clock text-warning"></i>
                              </div>
                              <div>
                                <h6 style={{ marginBottom: '5px', fontWeight: '600' }}>Review in Progress</h6>
                                <p className="text-muted small mb-0">Our admin team is reviewing your documents</p>
                              </div>
                            </div>

                            <div className="d-flex align-items-start">
                              <div style={{ fontSize: '24px', marginRight: '15px', flexShrink: 0 }}>
                                <i className="fe fe-mail text-info"></i>
                              </div>
                              <div>
                                <h6 style={{ marginBottom: '5px', fontWeight: '600' }}>Notification</h6>
                                <p className="text-muted small mb-0">You will receive an email once your account is approved</p>
                              </div>
                            </div>
                          </div>
                        </div>

                        <div className="alert alert-info mt-4">
                          <div className="d-flex">
                            <div className="flex-shrink-0">
                              <i className="fe fe-info"></i>
                            </div>
                            <div className="flex-grow-1 ms-3">
                              <h6 className="alert-heading">What happens next?</h6>
                              <p className="mb-0 small">
                                Our admin team typically reviews verification documents within 24-48 hours. 
                                Once approved, you'll be able to access your doctor dashboard and start accepting appointments.
                              </p>
                            </div>
                          </div>
                        </div>

                        <div className="mt-4" style={{ borderTop: '1px solid #e9ecef', paddingTop: '20px' }}>
                          <div className="d-grid gap-2">
                            <button
                              type="button"
                              className="btn btn-primary"
                              onClick={handleCheckStatus}
                              disabled={checkingStatus}
                            >
                              <i className="fe fe-refresh-cw me-2"></i>
                              {checkingStatus ? 'Checking...' : 'Check Status Again'}
                            </button>
                            <Link
                              to="/doctor-verification-upload"
                              className="btn btn-outline-primary"
                            >
                              <i className="fe fe-edit me-2"></i>
                              Update Documents
                            </Link>
                            <button
                              type="button"
                              className="btn btn-link text-muted"
                              onClick={handleLogout}
                            >
                              Logout
                            </button>
                          </div>
                        </div>

                        <div className="support-info mt-4 text-center">
                          <p className="text-muted small mb-0">
                            Need help? <Link to="/contact-us">Contact Support</Link>
                          </p>
                        </div>
                      </div>
                    )}
                  </div>
                </div>
                <div className="login-bottom-copyright">
                  <span>© {new Date().getFullYear()} myDoctor. All rights reserved.</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

    </AuthLayout>
  )
}

export default PendingApprovalStatus

