import { useState } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import { useForm } from 'react-hook-form'
import { yupResolver } from '@hookform/resolvers/yup'
import * as yup from 'yup'
import { useAuth } from '../../contexts/AuthContext'
import { toast } from 'react-toastify'

const schema = yup.object({
  name: yup.string().min(5, 'Name must be at least 5 characters').max(30, 'Name must be less than 30 characters').required('Name is required'),
  email: yup.string().email('Invalid email').required('Email is required'),
  password: yup.string().min(6, 'Password must be at least 6 characters').required('Password is required'),
  password_confirmation: yup.string().oneOf([yup.ref('password')], 'Passwords must match').required('Confirm password is required'),
})

const Register = () => {
  const navigate = useNavigate()
  const { register: registerUser } = useAuth()
  const [loading, setLoading] = useState(false)
  
  const { register, handleSubmit, formState: { errors } } = useForm({
    resolver: yupResolver(schema)
  })

  const onSubmit = async (data) => {
    setLoading(true)
    try {
      await registerUser(data, 'patient')
      toast.success('Registration successful!')
      navigate('/patient-dashboard')
    } catch (error) {
      toast.error(error.response?.data?.message || 'Registration failed')
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
                  <h3 className="account-title">Register</h3>
                  <p className="account-subtitle">Access to our dashboard</p>
                  <form onSubmit={handleSubmit(onSubmit)}>
                    <div className="form-group">
                      <label>Name</label>
                      <input
                        type="text"
                        className={`form-control ${errors.name ? 'is-invalid' : ''}`}
                        {...register('name')}
                      />
                      {errors.name && <div className="invalid-feedback">{errors.name.message}</div>}
                    </div>
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
                      <label>Password</label>
                      <input
                        type="password"
                        className={`form-control ${errors.password ? 'is-invalid' : ''}`}
                        {...register('password')}
                      />
                      {errors.password && <div className="invalid-feedback">{errors.password.message}</div>}
                    </div>
                    <div className="form-group">
                      <label>Confirm Password</label>
                      <input
                        type="password"
                        className={`form-control ${errors.password_confirmation ? 'is-invalid' : ''}`}
                        {...register('password_confirmation')}
                      />
                      {errors.password_confirmation && <div className="invalid-feedback">{errors.password_confirmation.message}</div>}
                    </div>
                    <div className="form-group text-center">
                      <button className="btn btn-primary account-btn" type="submit" disabled={loading}>
                        {loading ? 'Registering...' : 'Register as Patient'}
                      </button>
                    </div>
                    <div className="login-or">
                      <span className="or-line"></span>
                      <span className="span-or">or</span>
                    </div>
                    <div className="form-group text-center">
                      <Link to="/doctor-register" className="btn btn-outline-primary account-btn w-100">
                        <i className="fe fe-user-plus me-2"></i>
                        Register as a Doctor
                      </Link>
                    </div>
                    <div className="account-footer">
                      <p>Already have an account? <Link to="/login">Login</Link></p>
                    </div>
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

export default Register

