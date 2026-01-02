import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useForm } from 'react-hook-form'
import { yupResolver } from '@hookform/resolvers/yup'
import * as yup from 'yup'
import { toast } from 'react-toastify'
import api from '../../api/axios'
import { API_ROUTES } from '../../utils/apiConfig'
import AuthLayout from '../../layouts/AuthLayout'

// Step 1: Email validation schema
const emailSchema = yup.object({
  email: yup.string().email('Invalid email').required('Email is required'),
})

// Step 2: Code validation schema
const codeSchema = yup.object({
  code: yup
    .string()
    .required('Verification code is required')
    .length(6, 'Code must be 6 digits')
    .matches(/^\d+$/, 'Code must contain only numbers'),
})

// Step 3: Password validation schema
const passwordSchema = yup.object({
  newPassword: yup
    .string()
    .min(6, 'Password must be at least 6 characters')
    .required('New password is required'),
  confirmPassword: yup
    .string()
    .oneOf([yup.ref('newPassword')], 'Passwords must match')
    .required('Please confirm your password'),
})

const ForgotPassword = () => {
  const navigate = useNavigate()
  const [step, setStep] = useState(1) // 1: Email, 2: Verify Code, 3: Reset Password
  const [email, setEmail] = useState('')
  const [code, setCode] = useState('')
  const [loading, setLoading] = useState(false)

  // Step 1: Email form
  const emailForm = useForm({
    resolver: yupResolver(emailSchema),
  })

  // Step 2: Code form
  const codeForm = useForm({
    resolver: yupResolver(codeSchema),
  })

  // Step 3: Password form
  const passwordForm = useForm({
    resolver: yupResolver(passwordSchema),
  })

  // Step 1: Request password reset
  const handleRequestReset = async (data) => {
    setLoading(true)
    try {
      await api.post(API_ROUTES.AUTH.FORGOT_PASSWORD, {
        email: data.email,
      })
      setEmail(data.email)
      setStep(2)
      toast.success('Verification code sent to your email!')
    } catch (error) {
      const errorMessage = error.response?.data?.message || error.message || 'Failed to send verification code'
      toast.error(errorMessage)
      // If email is not registered, stay on step 1
      if (errorMessage.toLowerCase().includes('not registered') || errorMessage.toLowerCase().includes('email is not')) {
        // Stay on step 1, don't proceed
        return
      }
    } finally {
      setLoading(false)
    }
  }

  // Step 2: Verify code
  const handleVerifyCode = async (data) => {
    setLoading(true)
    try {
      await api.post(API_ROUTES.AUTH.VERIFY_RESET_CODE, {
        email,
        code: data.code,
      })
      setCode(data.code)
      setStep(3)
      toast.success('Code verified successfully!')
    } catch (error) {
      toast.error(error.response?.data?.message || 'Invalid or expired verification code')
    } finally {
      setLoading(false)
    }
  }

  // Step 3: Reset password
  const handleResetPassword = async (data) => {
    setLoading(true)
    try {
      await api.post(API_ROUTES.AUTH.RESET_PASSWORD, {
        email,
        code,
        newPassword: data.newPassword,
      })
      toast.success('Password reset successfully!')
      navigate('/login')
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to reset password')
    } finally {
      setLoading(false)
    }
  }

  // Resend code
  const handleResendCode = async () => {
    setLoading(true)
    try {
      await api.post(API_ROUTES.AUTH.FORGOT_PASSWORD, {
        email,
      })
      toast.success('Verification code resent to your email!')
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to resend code')
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
                      <h3>Forgot Password</h3>
                      {step === 1 && (
                        <p>Enter your registered email address and we'll send you a verification code.</p>
                      )}
                      {step === 2 && (
                        <p>Enter the 6-digit verification code sent to your email.</p>
                      )}
                      {step === 3 && (
                        <p>Enter your new password.</p>
                      )}
                    </div>

                    {/* Step 1: Enter Email */}
                    {step === 1 && (
                      <form onSubmit={emailForm.handleSubmit(handleRequestReset)}>
                        <div className="mb-3">
                          <label className="form-label">Email Address</label>
                          <input
                            className={`form-control ${emailForm.formState.errors.email ? 'is-invalid' : ''}`}
                            type="email"
                            placeholder="Enter your email"
                            {...emailForm.register('email')}
                          />
                          {emailForm.formState.errors.email && (
                            <div className="invalid-feedback">
                              {emailForm.formState.errors.email.message}
                            </div>
                          )}
                        </div>
                        <div className="mb-3">
                          <button
                            className="btn btn-primary-gradient w-100"
                            type="submit"
                            disabled={loading}
                          >
                            {loading ? 'Sending...' : 'Send Verification Code'}
                          </button>
                        </div>
                        <div className="account-signup">
                          <p>
                            Remember Password? <Link to="/login">Sign In</Link>
                          </p>
                        </div>
                      </form>
                    )}

                    {/* Step 2: Verify Code */}
                    {step === 2 && (
                      <form onSubmit={codeForm.handleSubmit(handleVerifyCode)}>
                        <div className="mb-3">
                          <label className="form-label">Verification Code</label>
                          <input
                            className={`form-control ${codeForm.formState.errors.code ? 'is-invalid' : ''}`}
                            type="text"
                            placeholder="Enter 6-digit code"
                            maxLength={6}
                            {...codeForm.register('code')}
                            onChange={(e) => {
                              const value = e.target.value.replace(/\D/g, '')
                              codeForm.setValue('code', value)
                            }}
                          />
                          {codeForm.formState.errors.code && (
                            <div className="invalid-feedback">
                              {codeForm.formState.errors.code.message}
                            </div>
                          )}
                          <small className="text-muted d-block mt-2">
                            Code sent to: <strong>{email}</strong>
                          </small>
                        </div>
                        <div className="mb-3">
                          <button
                            className="btn btn-primary-gradient w-100"
                            type="submit"
                            disabled={loading}
                          >
                            {loading ? 'Verifying...' : 'Verify Code'}
                          </button>
                        </div>
                        <div className="mb-3 text-center">
                          <button
                            type="button"
                            className="btn btn-link"
                            onClick={handleResendCode}
                            disabled={loading}
                          >
                            Resend Code
                          </button>
                        </div>
                        <div className="account-signup">
                          <p>
                            Remember Password? <Link to="/login">Sign In</Link>
                          </p>
                        </div>
                      </form>
                    )}

                    {/* Step 3: Reset Password */}
                    {step === 3 && (
                      <form onSubmit={passwordForm.handleSubmit(handleResetPassword)}>
                        <div className="mb-3">
                          <label className="form-label">New Password</label>
                          <input
                            className={`form-control ${passwordForm.formState.errors.newPassword ? 'is-invalid' : ''}`}
                            type="password"
                            placeholder="Enter new password"
                            {...passwordForm.register('newPassword')}
                          />
                          {passwordForm.formState.errors.newPassword && (
                            <div className="invalid-feedback">
                              {passwordForm.formState.errors.newPassword.message}
                            </div>
                          )}
                        </div>
                        <div className="mb-3">
                          <label className="form-label">Confirm Password</label>
                          <input
                            className={`form-control ${passwordForm.formState.errors.confirmPassword ? 'is-invalid' : ''}`}
                            type="password"
                            placeholder="Confirm new password"
                            {...passwordForm.register('confirmPassword')}
                          />
                          {passwordForm.formState.errors.confirmPassword && (
                            <div className="invalid-feedback">
                              {passwordForm.formState.errors.confirmPassword.message}
                            </div>
                          )}
                        </div>
                        <div className="mb-3">
                          <button
                            className="btn btn-primary-gradient w-100"
                            type="submit"
                            disabled={loading}
                          >
                            {loading ? 'Resetting...' : 'Reset Password'}
                          </button>
                        </div>
                        <div className="account-signup">
                          <p>
                            Remember Password? <Link to="/login">Sign In</Link>
                          </p>
                        </div>
                      </form>
                    )}

                    {/* Progress Indicator */}
                    <div className="mt-4">
                      <div className="d-flex justify-content-between align-items-center">
                        <div className={`step-indicator ${step >= 1 ? 'active' : ''}`}>
                          <span className="step-number">1</span>
                          <span className="step-label">Email</span>
                        </div>
                        <div className={`step-line ${step >= 2 ? 'active' : ''}`}></div>
                        <div className={`step-indicator ${step >= 2 ? 'active' : ''}`}>
                          <span className="step-number">2</span>
                          <span className="step-label">Verify</span>
                        </div>
                        <div className={`step-line ${step >= 3 ? 'active' : ''}`}></div>
                        <div className={`step-indicator ${step >= 3 ? 'active' : ''}`}>
                          <span className="step-number">3</span>
                          <span className="step-label">Reset</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <style>{`
        .step-indicator {
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: 5px;
        }
        .step-number {
          width: 30px;
          height: 30px;
          border-radius: 50%;
          background-color: #e9ecef;
          color: #6c757d;
          display: flex;
          align-items: center;
          justify-content: center;
          font-weight: 600;
          transition: all 0.3s;
        }
        .step-indicator.active .step-number {
          background-color: #0d6efd;
          color: white;
        }
        .step-label {
          font-size: 12px;
          color: #6c757d;
        }
        .step-indicator.active .step-label {
          color: #0d6efd;
          font-weight: 600;
        }
        .step-line {
          flex: 1;
          height: 2px;
          background-color: #e9ecef;
          margin: 0 10px;
          margin-top: -20px;
          transition: all 0.3s;
        }
        .step-line.active {
          background-color: #0d6efd;
        }
      `}</style>
    </AuthLayout>
  )
}

export default ForgotPassword
