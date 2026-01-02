import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useForm } from 'react-hook-form'
import { yupResolver } from '@hookform/resolvers/yup'
import * as yup from 'yup'
import { useAuth } from '../../contexts/AuthContext'
import { toast } from 'react-toastify'
import AuthLayout from '../../layouts/AuthLayout'

const schema = yup.object({
  fullName: yup.string().min(2, 'Full name must be at least 2 characters').required('Full name is required'),
  email: yup.string().email('Invalid email').required('Email is required'),
  password: yup.string().min(6, 'Password must be at least 6 characters').required('Password is required'),
  password_confirmation: yup.string().oneOf([yup.ref('password')], 'Passwords must match').required('Confirm password is required'),
  phone: yup.string().required('Phone is required'),
  gender: yup.string().oneOf(['MALE', 'FEMALE', 'OTHER'], 'Invalid gender').required('Gender is required'),
})

const DoctorRegister = () => {
  const navigate = useNavigate()
  const { register: registerUser } = useAuth()
  const [loading, setLoading] = useState(false)
  
  const { register, handleSubmit, formState: { errors } } = useForm({
    resolver: yupResolver(schema)
  })

  const onSubmit = async (data) => {
    setLoading(true)
    try {
      // Prepare registration data matching backend structure - only mandatory fields
      const registrationData = {
        fullName: data.fullName,
        email: data.email,
        password: data.password,
        role: 'DOCTOR', // Doctor registration
        phone: data.phone,
        gender: data.gender,
      }
      
      const response = await registerUser(registrationData, 'doctor')
      toast.success('Registration successful! Please upload verification documents.')
      
      // Navigate to verification upload
      if (response.user) {
        if (response.user.status === 'PENDING') {
          navigate('/doctor-verification-upload')
        } else {
          navigate('/doctor/dashboard')
        }
      } else {
        navigate('/doctor-verification-upload')
      }
    } catch (error) {
      const errorMessage = error.response?.data?.message || error.message || 'Registration failed'
      toast.error(errorMessage)
    } finally {
      setLoading(false)
    }
  }

  return (
    <AuthLayout>
      <div className="content">
        <div className="container-fluid">
          <div className="row">
            <div className="col-md-8 offset-md-2">
              <div className="account-content">
                <div className="row align-items-center justify-content-center">
                  <div className="col-md-7 col-lg-6 login-left">
                    <img src="/assets/img/login-banner.png" className="img-fluid" alt="myDoctor Login" />
                  </div>
                  <div className="col-md-12 col-lg-6 login-right">
                    <div className="login-header">
                      <h3>Doctor Register</h3>
                    </div>
                    <form onSubmit={handleSubmit(onSubmit)}>
                      <div className="mb-3">
                        <label className="form-label">Full Name</label>
                        <input
                          type="text"
                          className={`form-control ${errors.fullName ? 'is-invalid' : ''}`}
                          {...register('fullName')}
                          placeholder="Enter your full name"
                        />
                        {errors.fullName && <div className="invalid-feedback">{errors.fullName.message}</div>}
                      </div>
                      <div className="mb-3">
                        <label className="form-label">Email</label>
                        <input
                          type="email"
                          className={`form-control ${errors.email ? 'is-invalid' : ''}`}
                          {...register('email')}
                          placeholder="Enter your email"
                        />
                        {errors.email && <div className="invalid-feedback">{errors.email.message}</div>}
                      </div>
                      <div className="mb-3">
                        <label className="form-label">Phone *</label>
                        <input
                          type="tel"
                          className={`form-control ${errors.phone ? 'is-invalid' : ''}`}
                          {...register('phone')}
                          placeholder="Enter your phone number"
                        />
                        {errors.phone && <div className="invalid-feedback">{errors.phone.message}</div>}
                      </div>
                      <div className="mb-3">
                        <label className="form-label">Gender *</label>
                        <select
                          className={`form-control ${errors.gender ? 'is-invalid' : ''}`}
                          {...register('gender')}
                        >
                          <option value="">Select Gender</option>
                          <option value="MALE">Male</option>
                          <option value="FEMALE">Female</option>
                          <option value="OTHER">Other</option>
                        </select>
                        {errors.gender && <div className="invalid-feedback">{errors.gender.message}</div>}
                      </div>
                      <div className="mb-3">
                        <div className="form-group-flex">
                          <label className="form-label">Create Password</label>
                        </div>
                        <div className="pass-group">
                          <input
                            type="password"
                            className={`form-control pass-input ${errors.password ? 'is-invalid' : ''}`}
                            {...register('password')}
                            placeholder="Enter password"
                          />
                          <span className="feather-eye-off toggle-password"></span>
                        </div>
                        {errors.password && <div className="invalid-feedback">{errors.password.message}</div>}
                      </div>
                      <div className="mb-3">
                        <label className="form-label">Confirm Password</label>
                        <input
                          type="password"
                          className={`form-control ${errors.password_confirmation ? 'is-invalid' : ''}`}
                          {...register('password_confirmation')}
                          placeholder="Confirm your password"
                        />
                        {errors.password_confirmation && <div className="invalid-feedback">{errors.password_confirmation.message}</div>}
                      </div>
                      <div className="mb-3">
                        <button className="btn btn-primary-gradient w-100" type="submit" disabled={loading}>
                          {loading ? 'Registering...' : 'Sign Up as Doctor'}
                        </button>
                      </div>
                      <div className="login-or">
                        <span className="or-line"></span>
                        <span className="span-or">or</span>
                      </div>
                      <div className="form-group text-center mb-3">
                        <Link to="/register" className="btn btn-outline-primary w-100">
                          <i className="fe fe-user me-2"></i>
                          Register as Patient
                        </Link>
                      </div>
                      <div className="account-signup">
                        <p>
                          Already have account? <Link to="/login">Sign In</Link>
                        </p>
                      </div>
                    </form>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </AuthLayout>
  )
}

export default DoctorRegister

