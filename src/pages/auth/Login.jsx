import { useState } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import { useForm } from 'react-hook-form'
import { yupResolver } from '@hookform/resolvers/yup'
import * as yup from 'yup'
import { useAuth } from '../../contexts/AuthContext'
import { toast } from 'react-toastify'

const schema = yup.object({
  email: yup.string().email('Invalid email').required('Email is required'),
  password: yup.string().required('Password is required'),
})

const Login = () => {
  const navigate = useNavigate()
  const { login } = useAuth()
  const [loading, setLoading] = useState(false)
  
  const { register, handleSubmit, formState: { errors } } = useForm({
    resolver: yupResolver(schema)
  })

  const onSubmit = async (data) => {
    setLoading(true)
    try {
      const response = await login(data.email, data.password)
      toast.success('Login successful!')
      
      // Navigate based on user role
      if (response.user) {
        const role = response.user.role?.toUpperCase()
        const status = response.user.status?.toUpperCase()
        
        if (role === 'DOCTOR') {
          // Check doctor status
          if (status === 'PENDING') {
            // Doctor is pending approval
            navigate('/pending-approval')
          } else if (status === 'APPROVED') {
            // Doctor is approved, go to dashboard
            navigate('/doctor/dashboard')
          } else if (status === 'REJECTED' || status === 'BLOCKED') {
            // Doctor is rejected or blocked
            toast.error('Your account has been rejected or blocked. Please contact support.')
            navigate('/login')
          } else {
            // Unknown status, default to dashboard
            navigate('/doctor/dashboard')
          }
        } else if (role === 'PATIENT') {
          navigate('/patient/dashboard')
        } else if (role === 'ADMIN') {
          // Admin panel is in separate app (react-conversion-admin)
          // For now, redirect to home or show message
          toast.info('Admin panel is in separate application')
          navigate('/')
        } else {
          navigate('/patient/dashboard') // Default fallback
        }
      } else {
        navigate('/patient/dashboard')
      }
    } catch (error) {
      const errorMessage = error.response?.data?.message || error.message || 'Login failed'
      toast.error(errorMessage)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="content">
      <div className="container">
        <div className="row">
          <div className="col-md-6 offset-md-3">
            <div className="account-content">
              <div className="account-box">
                <div className="account-wrapper">
                  <h3 className="account-title">Login</h3>
                  <p className="account-subtitle">Access to our dashboard</p>
                  <form onSubmit={handleSubmit(onSubmit)}>
                    <div className="form-group">
                      <label>Email</label>
                      <input
                        type="email"
                        className={`form-control ${errors.email ? 'is-invalid' : ''}`}
                        {...register('email')}
                      />
                      {errors.email && <div className="invalid-feedback">{errors.email.message}</div>}
                    </div>
                    <div className="form-group">
                      <div className="row">
                        <div className="col">
                          <label>Password</label>
                        </div>
                        <div className="col-auto">
                          <Link className="text-muted" to="/forgot-password">
                            Forgot password?
                          </Link>
                        </div>
                      </div>
                      <input
                        type="password"
                        className={`form-control ${errors.password ? 'is-invalid' : ''}`}
                        {...register('password')}
                      />
                      {errors.password && <div className="invalid-feedback">{errors.password.message}</div>}
                    </div>
                    <div className="form-group text-center">
                      <button className="btn btn-primary account-btn" type="submit" disabled={loading}>
                        {loading ? 'Logging in...' : 'Login'}
                      </button>
                    </div>
                    <div className="account-footer">
                      <p>Don't have an account? <Link to="/register">Register</Link></p>
                    </div>
                    {/* Development Test Links - Remove in production */}
                    {process.env.NODE_ENV === 'development' && (
                      <div className="mt-3 pt-3 border-top">
                        <p className="text-muted small mb-2">🧪 Dev Test Links:</p>
                        <div className="d-flex gap-2 flex-wrap">
                          <Link to="/doctor-verification-upload" className="btn btn-sm btn-outline-secondary">Test Verification</Link>
                          <Link to="/pending-approval" className="btn btn-sm btn-outline-secondary">Test Pending</Link>
                        </div>
                      </div>
                    )}
                  </form>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Login

