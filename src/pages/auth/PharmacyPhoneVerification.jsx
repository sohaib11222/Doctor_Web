import { useEffect, useMemo, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import AuthLayout from '../../layouts/AuthLayout'
import { useAuth } from '../../contexts/AuthContext'
import { toast } from 'react-toastify'
import api from '../../api/axios'
import { API_ROUTES } from '../../utils/apiConfig'

const PharmacyPhoneVerification = () => {
  const navigate = useNavigate()
  const { user, refreshUser } = useAuth()

  const [phone, setPhone] = useState(user?.phone || '')
  const [code, setCode] = useState('')
  const [sending, setSending] = useState(false)
  const [verifying, setVerifying] = useState(false)

  const phoneTrimmed = useMemo(() => String(phone || '').trim(), [phone])

  useEffect(() => {
    if (!user) {
      navigate('/login')
      return
    }

    if (user?.isPhoneVerified) {
      navigate('/pharmacy-verification-upload')
    }
  }, [user, navigate])

  const handleResend = async () => {
    if (!user) return

    setSending(true)
    try {
      await api.post(API_ROUTES.AUTH.SEND_PHONE_OTP, phoneTrimmed ? { phone: phoneTrimmed } : {})
      toast.success('Verification code sent to your phone')
    } catch (error) {
      toast.error(error?.response?.data?.message || error?.message || 'Failed to send verification code')
    } finally {
      setSending(false)
    }
  }

  const handleVerify = async (e) => {
    e.preventDefault()

    if (!code.trim()) {
      toast.error('Please enter the verification code')
      return
    }

    setVerifying(true)
    try {
      await api.post(API_ROUTES.AUTH.VERIFY_PHONE_OTP, {
        code: code.trim(),
        phone: phoneTrimmed || undefined,
      })

      toast.success('Phone verified successfully')
      await refreshUser?.()
      localStorage.removeItem('pharmacy_documents_submitted')
      navigate('/pharmacy-verification-upload')
    } catch (error) {
      toast.error(error?.response?.data?.message || error?.message || 'Invalid verification code')
    } finally {
      setVerifying(false)
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
                      <img
                        src="/assets/img/doctor_final.png"
                        alt="mydoctor-logo"
                        style={{ maxHeight: '60px', height: 'auto', width: 'auto' }}
                      />
                    </div>

                    <form onSubmit={handleVerify}>
                      <h3 className="my-4">Verify Phone Number</h3>
                      <p className="text-muted mb-4">
                        Enter the code we sent to your phone number to continue.
                      </p>

                      <div className="mb-3">
                        <label className="form-label">Phone (E.164 format)</label>
                        <input
                          type="text"
                          className="form-control"
                          value={phone}
                          onChange={(e) => setPhone(e.target.value)}
                          placeholder="+1234567890"
                        />
                        <small className="text-muted d-block mt-1">
                          Example: +393331234567
                        </small>
                      </div>

                      <div className="mb-3">
                        <label className="form-label">Verification Code</label>
                        <input
                          type="text"
                          className="form-control"
                          value={code}
                          onChange={(e) => setCode(e.target.value.replace(/\D/g, ''))}
                          placeholder="Enter code"
                          maxLength={10}
                        />
                      </div>

                      <div className="mb-3">
                        <button
                          className="btn btn-primary-gradient w-100"
                          type="submit"
                          disabled={verifying}
                        >
                          {verifying ? 'Verifying...' : 'Verify & Continue'}
                        </button>
                      </div>

                      <div className="text-center">
                        <button
                          type="button"
                          className="btn btn-link"
                          onClick={handleResend}
                          disabled={sending}
                        >
                          {sending ? 'Sending...' : 'Resend code'}
                        </button>
                      </div>

                      <div className="text-center mt-3">
                        <Link to="/login" className="text-muted">
                          Back to Login
                        </Link>
                      </div>
                    </form>
                  </div>
                </div>
                <div className="login-bottom-copyright">
                  <span>© {new Date().getFullYear()} Mydoctor+. All rights reserved.</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </AuthLayout>
  )
}

export default PharmacyPhoneVerification
