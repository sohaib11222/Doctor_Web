import { useState } from 'react'
import { toast } from 'react-toastify'
import { resendEmailVerification, verifyEmail } from '../../api/auth'
import { useAuth } from '../../contexts/AuthContext'
import { useLanguage } from '../../contexts/LanguageContext'

const VERIFYABLE_ROLES = new Set(['DOCTOR', 'PHARMACY', 'PARAPHARMACY'])

/** Kept in the dashboard shell so an unverified professional cannot miss it. */
const EmailVerificationBanner = () => {
  const { user, setSession, refreshUser } = useAuth()
  const { translateText: tr } = useLanguage()
  const [code, setCode] = useState('')
  // A code is issued when the professional account is created. Keep the
  // input visible immediately; legacy accounts can simply request a new one.
  const [codeSent, setCodeSent] = useState(true)
  const [sending, setSending] = useState(false)
  const [verifying, setVerifying] = useState(false)
  const role = String(user?.role || '').toUpperCase()

  if (!VERIFYABLE_ROLES.has(role) || user?.isEmailVerified) return null

  const sendCode = async () => {
    setSending(true)
    try {
      await resendEmailVerification(user.email)
      setCodeSent(true)
      toast.success(tr('A verification code has been sent to your email address.'))
    } catch (error) {
      toast.error(tr(error.response?.data?.message || error.message || 'Unable to send a verification code.'))
    } finally { setSending(false) }
  }

  const confirmCode = async () => {
    if (!/^\d{6}$/.test(code)) {
      toast.error(tr('Enter the 6-digit verification code.'))
      return
    }
    setVerifying(true)
    try {
      const response = await verifyEmail(user.email, code)
      setSession(response)
      await refreshUser().catch(() => null)
      toast.success(tr('Your email address has been verified.'))
    } catch (error) {
      toast.error(tr(error.response?.data?.message || error.message || 'The verification code is invalid or has expired.'))
    } finally { setVerifying(false) }
  }

  return (
    <div className="alert alert-info border d-flex align-items-start justify-content-between gap-3 flex-wrap mb-4" role="status">
      <div className="d-flex gap-3">
        <i className="fa-solid fa-envelope-circle-check mt-1" style={{ fontSize: 22 }} />
        <div>
          <strong>{tr('Verify your email address')}</strong>
          <div className="small mt-1">{tr('Verify')} <b>{user.email}</b>{tr(' to secure your account and receive important updates. A code was sent when your account was created.')}</div>
          {codeSent && <div className="d-flex align-items-center gap-2 flex-wrap mt-3">
            <input className="form-control form-control-sm" style={{ width: 180, letterSpacing: '0.28em' }} inputMode="numeric" autoComplete="one-time-code" maxLength="6" aria-label={tr('Email verification code')} value={code} onChange={(event) => setCode(event.target.value.replace(/\D/g, '').slice(0, 6))} placeholder="123456" />
            <button type="button" className="btn btn-sm btn-primary" disabled={verifying} onClick={confirmCode}>{verifying ? tr('Verifying…') : tr('Verify email')}</button>
          </div>}
        </div>
      </div>
      <button type="button" className="btn btn-sm btn-outline-primary" disabled={sending || verifying} onClick={sendCode}>
        <i className="fa-solid fa-paper-plane me-1" />{sending ? tr('Sending…') : codeSent ? tr('Send a new code') : tr('Send verification code')}
      </button>
    </div>
  )
}

export default EmailVerificationBanner
