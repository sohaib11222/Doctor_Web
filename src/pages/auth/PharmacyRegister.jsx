import { useState } from 'react'
import { Link, useNavigate, useSearchParams } from 'react-router-dom'
import AuthLayout from '../../layouts/AuthLayout'
import { useAuth } from '../../contexts/AuthContext'
import { toast } from 'react-toastify'

const PharmacyRegister = () => {
  const navigate = useNavigate()
  const [searchParams] = useSearchParams()
  const { register } = useAuth()
  const [loading, setLoading] = useState(false)
  const [showPassword, setShowPassword] = useState(false)

  const selectedKind = String(searchParams.get('kind') || '').toUpperCase()
  const isParapharmacy = selectedKind === 'PARAPHARMACY'
  const userRole = isParapharmacy ? 'PARAPHARMACY' : 'PHARMACY'
  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    phone: '',
    password: ''
  })

  const handleChange = (e) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (!formData.fullName.trim() || !formData.email.trim() || !formData.password) {
      toast.error('Please fill all required fields')
      return
    }

    if (!formData.phone.trim()) {
      toast.error('Phone number is required')
      return
    }

    const normalizedPhone = formData.phone.trim()
    if (!/^\+\d{7,15}$/.test(normalizedPhone)) {
      toast.error('Phone number must be in international format (E.164), e.g. +1234567890')
      return
    }

    setLoading(true)
    try {
      const response = await register(
        {
          fullName: formData.fullName.trim(),
          email: formData.email.trim(),
          phone: normalizedPhone,
          password: formData.password,
          role: userRole
        },
        'pharmacy'
      )

      const user = response?.user
      const status = user?.status?.toUpperCase()

      toast.success('Registration successful!')

      if (status === 'PENDING') {
        localStorage.removeItem('pharmacy_documents_submitted')
        navigate('/pharmacy-phone-verification')
      } else {
        navigate('/pharmacy/dashboard')
      }
    } catch (error) {
      toast.error(error.response?.data?.message || error.message || 'Registration failed')
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
                    <img src="/assets/img/pharmacy.jpg" className="img-fluid" alt="Mydoctor+ Pharmacy" />
                  </div>
                  <div className="col-md-12 col-lg-6 login-right">
                    <div className="login-header">
                      <h3>
                        {isParapharmacy ? 'Parapharmacy Register' : 'Pharmacy Register'}{' '}
                        <Link to="/doctor-register">Are you a Doctor?</Link>
                      </h3>
                    </div>
                    <form onSubmit={handleSubmit}>
                      <div className="mb-3">
                        <label className="form-label">Name</label>
                        <input type="text" className="form-control" name="fullName" value={formData.fullName} onChange={handleChange} />
                      </div>
                      <div className="mb-3">
                        <label className="form-label">Email</label>
                        <input type="email" className="form-control" name="email" value={formData.email} onChange={handleChange} />
                      </div>
                      <div className="mb-3">
                        <label className="form-label">Phone</label>
                        <input className="form-control form-control-lg group_formcontrol form-control-phone" id="phone" name="phone" type="text" value={formData.phone} onChange={handleChange} />
                      </div>
                      <div className="mb-3">
                        <div className="form-group-flex">
                          <label className="form-label">Create Password</label>
                        </div>
                        <div className="pass-group">
                          <input
                            type={showPassword ? 'text' : 'password'}
                            className="form-control pass-input"
                            name="password"
                            value={formData.password}
                            onChange={handleChange}
                          />
                          <span
                            className={`${showPassword ? 'feather-eye' : 'feather-eye-off'} toggle-password`}
                            role="button"
                            tabIndex={0}
                            onClick={() => setShowPassword((prev) => !prev)}
                            onKeyDown={(e) => {
                              if (e.key === 'Enter' || e.key === ' ') {
                                e.preventDefault()
                                setShowPassword((prev) => !prev)
                              }
                            }}
                          ></span>
                        </div>
                      </div>
                      <div className="mb-3">
                        <button className="btn btn-primary-gradient w-100" type="submit" disabled={loading}>
                          {loading ? 'Signing Up...' : 'Sign Up'}
                        </button>
                      </div>
                      <div className="login-or">
                        <span className="or-line"></span>
                        <span className="span-or">or</span>
                      </div>
                      {/* <div className="social-login-btn">
                        <a href="javascript:void(0);" className="btn w-100">
                          <img src="/assets/img/icons/google-icon.svg" alt="google-icon" />
                          Sign in With Google
                        </a>
                        <a href="javascript:void(0);" className="btn w-100">
                          <img src="/assets/img/icons/facebook-icon.svg" alt="fb-icon" />
                          Sign in With Facebook
                        </a>
                      </div> */}
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

export default PharmacyRegister

